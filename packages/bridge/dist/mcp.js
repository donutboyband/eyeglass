import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { store } from './store.js';
export async function startMcpServer() {
    const server = new Server({
        name: 'eyeglass-bridge',
        version: '0.1.0',
    }, {
        capabilities: {
            tools: {},
            resources: {},
        },
    });
    // Track if client supports sampling
    let clientSupportsSampling = false;
    // Check client capabilities after connection
    server.oninitialized = () => {
        const clientCaps = server.getClientCapabilities();
        clientSupportsSampling = !!clientCaps?.sampling;
        // Debug: log client capabilities to stderr
        console.error('[eyeglass] Client capabilities:', JSON.stringify(clientCaps, null, 2));
        console.error('[eyeglass] Sampling supported:', clientSupportsSampling);
    };
    // When a new focus comes in, trigger sampling if supported
    store.on('activity', async (event) => {
        if (event.type === 'status' && event.status === 'pending' && clientSupportsSampling) {
            try {
                // Request the client to handle the new focus
                await server.request({
                    method: 'sampling/createMessage',
                    params: {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `🔔 New Eyeglass request received!

A user has selected a UI element and needs your help. Please:
1. Call get_focused_element() to see what they selected
2. Use report_action() to show your progress
3. Use send_thought() to share your reasoning
4. Make the requested changes
5. Call update_status("success", "message") when done

Handle this request now.`,
                                },
                            },
                        ],
                        maxTokens: 4096,
                        systemPrompt: 'You are an AI assistant helping with UI development. The user has selected an element in their browser using Eyeglass and wants you to make changes. Use the available MCP tools to see the request and fulfill it.',
                        modelPreferences: {
                            intelligencePriority: 0.8,
                            speedPriority: 0.6,
                        },
                    },
                }, { method: 'sampling/createMessage' });
            }
            catch (err) {
                // Sampling failed or was rejected - that's okay
            }
        }
    });
    // List available resources
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: 'eyeglass://focus',
                    name: 'Current Focus',
                    description: 'The currently focused UI element and user request.',
                    mimeType: 'text/markdown',
                },
            ],
        };
    });
    // Read resource content
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const { uri } = request.params;
        if (uri === 'eyeglass://focus') {
            const content = store.formatAsMarkdown();
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'text/markdown',
                        text: content,
                    },
                ],
            };
        }
        throw new Error(`Unknown resource: ${uri}`);
    });
    // List tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'get_focused_element',
                    description: "Get the currently focused UI element with its semantic snapshot, accessibility tree, computed styles, and the user's change request.",
                    inputSchema: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    name: 'update_status',
                    description: 'Update the status shown to the user in the browser overlay. Use this to communicate progress.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                enum: ['idle', 'pending', 'fixing', 'success', 'failed'],
                                description: 'The new status',
                            },
                            message: {
                                type: 'string',
                                description: 'Optional message to show the user',
                            },
                        },
                        required: ['status'],
                    },
                },
                {
                    name: 'send_thought',
                    description: 'Share your reasoning or decision-making with the user. Use this to explain what you are considering or why you made a choice.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string',
                                description: 'The thought or reasoning to share',
                            },
                        },
                        required: ['content'],
                    },
                },
                {
                    name: 'report_action',
                    description: 'Report an action you are taking (reading a file, writing code, searching). This shows progress to the user.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: {
                                type: 'string',
                                enum: ['reading', 'writing', 'searching', 'thinking'],
                                description: 'The type of action',
                            },
                            target: {
                                type: 'string',
                                description: 'What you are acting on (e.g., file path, search query)',
                            },
                            complete: {
                                type: 'boolean',
                                description: 'Whether this action is complete (default: false)',
                            },
                        },
                        required: ['action', 'target'],
                    },
                },
                {
                    name: 'ask_question',
                    description: 'Ask the user a question and wait for their answer. Use this when you need clarification or want to offer choices. This tool BLOCKS until the user responds.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            question: {
                                type: 'string',
                                description: 'The question to ask',
                            },
                            options: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'The options for the user to choose from (2-4 options)',
                            },
                        },
                        required: ['question', 'options'],
                    },
                },
                {
                    name: 'get_focus_history',
                    description: 'Get the history of previously focused elements (up to 5).',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
                {
                    name: 'wait_for_request',
                    description: 'Blocks execution until the user selects a new element in the browser. Use this to enter a listening mode where you automatically react to user actions. Returns the focused element context when a request arrives.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            timeout_ms: {
                                type: 'number',
                                description: 'Optional timeout in milliseconds. If not provided, waits indefinitely.',
                            },
                        },
                        required: [],
                    },
                },
            ],
        };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const active = store.getActive();
        switch (name) {
            case 'get_focused_element': {
                const markdown = store.formatAsMarkdown();
                return {
                    content: [{ type: 'text', text: markdown }],
                };
            }
            case 'update_status': {
                const { status, message } = args;
                if (!active) {
                    return {
                        content: [{ type: 'text', text: 'No active focus to update.' }],
                        isError: true,
                    };
                }
                store.updateStatus(active.interactionId, status, message);
                return {
                    content: [
                        { type: 'text', text: `Status updated to "${status}"${message ? `: ${message}` : ''}` },
                    ],
                };
            }
            case 'send_thought': {
                const { content } = args;
                if (!active) {
                    return {
                        content: [{ type: 'text', text: 'No active focus.' }],
                        isError: true,
                    };
                }
                store.sendThought(active.interactionId, content);
                return {
                    content: [{ type: 'text', text: 'Thought shared with user.' }],
                };
            }
            case 'report_action': {
                const { action, target, complete } = args;
                if (!active) {
                    return {
                        content: [{ type: 'text', text: 'No active focus.' }],
                        isError: true,
                    };
                }
                store.reportAction(active.interactionId, action, target, complete ?? false);
                return {
                    content: [{ type: 'text', text: `Action reported: ${action} ${target}` }],
                };
            }
            case 'ask_question': {
                const { question, options } = args;
                if (!active) {
                    return {
                        content: [{ type: 'text', text: 'No active focus.' }],
                        isError: true,
                    };
                }
                if (!options || options.length < 2 || options.length > 4) {
                    return {
                        content: [{ type: 'text', text: 'Please provide 2-4 options.' }],
                        isError: true,
                    };
                }
                const questionId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
                const formattedOptions = options.map((label, i) => ({
                    id: `opt-${i}`,
                    label,
                }));
                const answer = await store.askQuestion(active.interactionId, questionId, question, formattedOptions);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `User selected: "${answer.answerLabel}"`,
                        },
                    ],
                };
            }
            case 'get_focus_history': {
                const history = store.getHistory();
                if (history.length === 0) {
                    return {
                        content: [{ type: 'text', text: 'No focus history available.' }],
                    };
                }
                const summary = history
                    .map((p, i) => {
                    const { snapshot, snapshots, userNote } = p;
                    // Handle both single and multi-select payloads
                    const firstSnapshot = snapshot || (snapshots && snapshots[0]);
                    if (!firstSnapshot)
                        return `${i + 1}. **unknown** - "${userNote}"`;
                    const elementCount = snapshots ? ` (${snapshots.length} elements)` : '';
                    return `${i + 1}. **${firstSnapshot.framework.componentName || firstSnapshot.tagName}**${elementCount} - "${userNote}"`;
                })
                    .join('\n');
                return {
                    content: [{ type: 'text', text: `## Focus History\n\n${summary}` }],
                };
            }
            case 'wait_for_request': {
                const { timeout_ms } = args;
                try {
                    await store.waitForFocus(timeout_ms);
                    // After waiting resolves, return the formatted markdown
                    const markdown = store.formatAsMarkdown();
                    return {
                        content: [{ type: 'text', text: markdown }],
                    };
                }
                catch (err) {
                    return {
                        content: [{ type: 'text', text: `Wait cancelled: ${err.message}` }],
                        isError: true,
                    };
                }
            }
            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

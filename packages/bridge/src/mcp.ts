import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { InteractionStatus } from '@eyeglass/types';
import { store } from './store.js';

export async function startMcpServer(): Promise<void> {
  const server = new Server(
    {
      name: 'eyeglass-bridge',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

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
        await server.request(
          {
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
          },
          { method: 'sampling/createMessage' } as any
        );
      } catch (err) {
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
          description:
            "Get the currently focused UI element with its semantic snapshot, accessibility tree, computed styles, and the user's change request.",
          inputSchema: {
            type: 'object' as const,
            properties: {},
            required: [],
          },
        },
        {
          name: 'update_status',
          description:
            'Update the status shown to the user in the browser overlay. Use this to communicate progress.',
          inputSchema: {
            type: 'object' as const,
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
          description:
            'Share your reasoning or decision-making with the user. Use this to explain what you are considering or why you made a choice.',
          inputSchema: {
            type: 'object' as const,
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
          description:
            'Report an action you are taking (reading a file, writing code, searching). This shows progress to the user.',
          inputSchema: {
            type: 'object' as const,
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
          description:
            'Ask the user a question and wait for their answer. Use this when you need clarification or want to offer choices. This tool BLOCKS until the user responds.',
          inputSchema: {
            type: 'object' as const,
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
            type: 'object' as const,
            properties: {},
            required: [],
          },
        },
        {
          name: 'wait_for_request',
          description:
            'Blocks execution until the user selects a new element in the browser. Use this to enter a listening mode where you automatically react to user actions. Returns the focused element context when a request arrives.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              timeout_ms: {
                type: 'number',
                description: 'Optional timeout in milliseconds. If not provided, waits indefinitely.',
              },
            },
            required: [],
          },
        },
        {
          name: 'analyze_component_usage',
          description:
            'Analyze how a component is used across the codebase. Returns the number of files that import the component and estimates the risk level of changes.',
          inputSchema: {
            type: 'object' as const,
            properties: {
              file_path: {
                type: 'string',
                description: 'The file path of the component to analyze (e.g., src/components/Button.tsx)',
              },
            },
            required: ['file_path'],
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
        const { status, message } = args as { status: InteractionStatus; message?: string };

        if (!active) {
          return {
            content: [{ type: 'text', text: 'No active focus to update.' }],
            isError: true,
          };
        }

        store.updateStatus(active.interactionId, status, message);

        // On success/failed, hint to continue listening for more requests
        const continueHint = (status === 'success' || status === 'failed')
          ? '\n\n**Ready for next request.** Call `wait_for_request()` to continue listening for user requests.'
          : '';

        return {
          content: [
            { type: 'text', text: `Status updated to "${status}"${message ? `: ${message}` : ''}${continueHint}` },
          ],
        };
      }

      case 'send_thought': {
        const { content } = args as { content: string };

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
        const { action, target, complete } = args as {
          action: 'reading' | 'writing' | 'searching' | 'thinking';
          target: string;
          complete?: boolean;
        };

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
        const { question, options } = args as { question: string; options: string[] };

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

        const answer = await store.askQuestion(
          active.interactionId,
          questionId,
          question,
          formattedOptions
        );

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
            if (!firstSnapshot) return `${i + 1}. **unknown** - "${userNote}"`;
            const elementCount = snapshots ? ` (${snapshots.length} elements)` : '';
            return `${i + 1}. **${firstSnapshot.framework.componentName || firstSnapshot.tagName}**${elementCount} - "${userNote}"`;
          })
          .join('\n');

        return {
          content: [{ type: 'text', text: `## Focus History\n\n${summary}` }],
        };
      }

      case 'wait_for_request': {
        const { timeout_ms } = args as { timeout_ms?: number };

        try {
          await store.waitForFocus(timeout_ms);
          // After waiting resolves, return the formatted markdown
          const markdown = store.formatAsMarkdown();
          return {
            content: [{ type: 'text', text: markdown }],
          };
        } catch (err) {
          return {
            content: [{ type: 'text', text: `Wait cancelled: ${(err as Error).message}` }],
            isError: true,
          };
        }
      }

      case 'analyze_component_usage': {
        const { file_path } = args as { file_path: string };

        if (!file_path) {
          return {
            content: [{ type: 'text', text: 'file_path is required' }],
            isError: true,
          };
        }

        try {
          const { execFileSync } = await import('child_process');
          const { basename, dirname } = await import('path');

          const cwd = process.cwd();
          const componentName = basename(file_path, '.tsx').replace('.jsx', '');

          // Count imports using grep
          let importCount = 0;
          let importingFiles: string[] = [];

          try {
            // Search for imports of this component
            const grepResult = execFileSync(
              'grep',
              [
                '-r',
                '-l',
                `from.*${componentName}`,
                '--include=*.tsx',
                '--include=*.ts',
                '--include=*.jsx',
                '--include=*.js',
                'src',
              ],
              { cwd, encoding: 'utf-8', maxBuffer: 1024 * 1024 }
            );

            importingFiles = grepResult
              .split('\n')
              .filter(Boolean)
              .filter(f => f !== file_path); // Exclude the component file itself

            importCount = importingFiles.length;
          } catch {
            // grep returns exit code 1 when no matches found
            importCount = 0;
          }

          // Determine risk level
          let riskLevel: 'Local' | 'Moderate' | 'Critical' = 'Local';
          if (importCount >= 10) {
            riskLevel = 'Critical';
          } else if (importCount >= 3) {
            riskLevel = 'Moderate';
          }

          const result = `## Component Usage Analysis

**Component:** \`${componentName}\`
**File:** \`${file_path}\`
**Import Count:** ${importCount} file(s)
**Risk Level:** ${riskLevel}

${importCount > 0 ? `### Importing Files:\n${importingFiles.slice(0, 10).map(f => `- \`${f}\``).join('\n')}${importingFiles.length > 10 ? `\n- ... and ${importingFiles.length - 10} more` : ''}` : 'No files import this component.'}

${riskLevel === 'Critical' ? '\n**Warning:** This component is widely used. Changes may have broad impact.' : ''}
${riskLevel === 'Moderate' ? '\n**Note:** This component is used in several places. Test changes carefully.' : ''}
`;

          return {
            content: [{ type: 'text', text: result }],
          };
        } catch (err) {
          return {
            content: [{ type: 'text', text: `Error analyzing component: ${(err as Error).message}` }],
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

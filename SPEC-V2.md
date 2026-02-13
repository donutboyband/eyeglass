This is the master specification for **Eyeglass 2.0**. It unifies the new interaction model, the deep React focus, and the comprehensive 7-layer context schema into a single blueprint.

---

# Eyeglass 2.0: The React Runtime Lens

**Tagline:** "The Heads-Up Display for React Development."
**Core Philosophy:** Native feel. Deep insight. Zero noise.

---

## 1. The 7 Layers of Frontend Reality

Eyeglass doesn't just read code; it analyzes the full runtime reality of the application.

1. **Code (Identity):** The source truth. File path, component name, and line number.
2. **State (Logic):** The brain. Current props, hooks (`useState`, `useEffect`), and Context providers.
3. **Visual (Render):** The output. Computed styles, geometry, and visibility.
4. **Causal (Engine):** The mechanics. Stacking contexts, event listener chains, and layout constraints.
5. **Perceptual (Experience):** The human view. Contrast, affordance, and occlusion (is it actually clickable?).
6. **Metal (Performance):** The hardware. Render counts, paint storms, and main-thread blocking.
7. **Systemic (Architecture):** The ecosystem. Usage frequency, design system compliance, and dependency risks.

---

## 2. The Interaction Model: "Loupe to Lens"

The UI lives natively on the rendered page, anchored by a persistent Hub.

### **The Hub (Persistent Anchor)**

* **Location:** Bottom-left (minimized by default).
* **Role:** Chat History, Preferences (Dark/Light mode), Global Status.
* **Interaction:** Clicking expands to show the conversation thread, ensuring context is never lost.

### **State A: The Loupe (Hover)**

* **Trigger:** Mouse hover over any element.
* **Visual:** A tiny, pill-shaped HUD floating 10px above the cursor. Glassmorphism, system fonts.
* **Content:**
* **Identity:** `<SubmitButton />` (Syntax highlighted).
* **The Pulse (Anomaly Filter):** A single colored dot.
* 🟢 (Hidden) = Healthy.
* 🟡 = Re-rendering often or blocking events.
* 🔴 = Layout thrashing, A11y violation, or error boundary.




* **Feel:** Magnetic snapping to React Component boundaries.

### **State B: The Focus (Click)**

* **Trigger:** Click the element.
* **Visual:** The Loupe expands instantly into the **Lens Card**.
* **Effect:** **No screen dimming.** The page remains interactive. The card floats intelligently to avoid occluding the element.
* **Content (The "Quiet" Inspection):**
* **Header:** Component Name + File Path.
* **Health Cards:** Only appear if relevant (e.g., "🛑 Event Blocked", "🥞 Stacking Context").
* **Action:** A simple input field: *"Ask Eyeglass..."*


* **The "Context Toggle":** A subtle button to "Show Relationships."
* **Effect:** Draws colored outlines around related elements on the page:
* **Blue:** The Component.
* **Purple:** The State Owner (parent passing props).
* **Orange:** The Layout Parent (flex/grid container).
* **Red:** The Event Blocker.





### **State C: The Conversation (Agent Active)**

* **Trigger:** User types a request.
* **Visual:** The Lens Card enters **"Live Mode"**.
* **The MCP Stream:** Agent thoughts stream into the card like subtitles.
* **The Schema Dump (Tasteful):** The full JSON context is sent to the agent but hidden from the user. A small collapsible `{}` icon allows developers to peek at the raw data payload.

---

## 3. The Architecture: Deep React Integration

### **The "Fiber Surgeon" (Updated Walker)**

* **Refactored:** Strips generic DOM logic to focus on React Fiber traversal.
* **Capabilities:**
* Reads `memoizedState` to extract Hook values.
* Walks the `return` pointer to find Context Providers (`ThemeProvider`).
* Compares `oldProps` vs `newProps` to detect unnecessary re-renders.



---

## 4. The 7-Layer Schema (`SemanticSnapshot`)

This is the payload sent to the LLM. It provides the "God Mode" context required to solve complex bugs.

```typescript
interface SemanticSnapshot {
  // --- LAYER 1: CODE (Identity) ---
  role: string;           // ARIA role (button, link, textbox, etc.)
  name: string;           // Accessible name
  tagName: string;        // HTML tag
  id?: string;            // Element ID
  className?: string;     // CSS classes
  dataAttributes?: Record<string, string>;

  // --- LAYER 2: STATE (React Brain) ---
  framework: {
    type: 'react';        // Strictly React focused
    displayName: string;  // e.g. "SubmitButton"
    key?: string | null;  // React key (critical for list bugs)
    filePath?: string;    // e.g. "src/components/Button.tsx"
    lineNumber?: number;
    
    // The "Live Logic"
    state: {
      props: Record<string, unknown>;
      hooks: Array<{
        name: string;     // e.g. "useState", "useEffect"
        value?: unknown;  // Current runtime value
        label?: string;   // Heuristic label if detectable
      }>;
      context: Array<{
        name: string;     // e.g. "ThemeProvider"
        value: unknown;   // The context value provided
      }>;
    };
  };

  // --- LAYER 3: VISUAL (Render Tree) ---
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  };

  styles: {
    display: string;
    position: string;
    flexDirection?: string;
    gridTemplate?: string;
    padding: string;
    margin: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    zIndex: string;
  };

  // --- LAYER 4: CAUSAL (The "Why") ---
  causality: {
    // Event Listeners: The invisible wires
    events: {
      listeners: Array<{
        type: string;       // e.g. "click"
        capture: boolean;
        source?: string;    // Source file if traceable
      }>;
      // Dead Click Analysis
      blockingHandlers: Array<{
        element: string;    // Selector of blocking ancestor
        event: string;
        reason: 'stopPropagation' | 'pointer-events:none' | 'captured';
      }>;
    };

    // Stacking Context: The 3D Truth
    stackingContext: {
      isStackingContext: boolean;
      parentContext: string | null; // Selector of ancestor creating context
      reason?: string;              // e.g. "transform", "opacity"
      effectiveZIndex: number;      // Calculated relative to root
    };

    // Layout Constraints
    layoutConstraints: Array<string>; // e.g. "Width constrained by flex-basis"
  };

  // --- LAYER 5: PERCEPTUAL (The Human Eye) ---
  perception: {
    affordance: {
      looksInteractable: boolean; // Has cursor:pointer / color:blue
      isInteractable: boolean;    // Has listener / interactive tag
      dissonanceScore: number;    // 0.0 - 1.0 (Confusion metric)
    };
    visibility: {
      isOccluded: boolean;
      occludedBy?: string;        // Element covering this one
      effectiveOpacity: number;
    };
    legibility: {
      contrastRatio: number;
      wcagStatus: 'pass' | 'fail';
      effectiveBgColor: string;
    };
    usability: {
      touchTargetSize: string;
      isTouchTargetValid: boolean; // > 44px
    };
  };

  // --- LAYER 6: METAL (Hardware Reality) ---
  metal: {
    pipeline: {
      layerPromoted: boolean;     // On GPU layer?
      layoutThrashingRisk: 'none' | 'low' | 'high';
    };
    performance: {
      renderCount: number;        // React Fiber renders
      lastRenderReason?: string;  // e.g. "Prop 'style' changed identity"
    };
    memory: {
      detachedNodesRetained?: number;
      listenerCount: number;
    };
  };

  // --- LAYER 7: SYSTEMIC (Architectural Impact) ---
  systemic: {
    impact: {
      importCount?: number;       // How many files use this component?
      riskLevel: 'Local' | 'Moderate' | 'Critical';
    };
    designSystem: {
      tokenMatches: Array<{ property: string; token: string }>; // e.g. blue-500
      deviations: Array<{ property: string; value: string; suggestion: string }>;
    };
  };

  // Metadata
  timestamp: number;
  url: string;
}

```

---

## 5. The "Taste" Guidelines

1. **Don't Show, Don't Tell:** If a metric is normal, hide it. Only show the anomaly.
2. **Native Materials:** Use system fonts (`-apple-system`), native shadows, and heavy usage of `backdrop-filter: blur()`.
3. **Respect the User:** Never block the element the user is looking at. Position the Lens intelligently.

---

## 6. Immediate Action Plan

1. **Refactor `fiber-walker.ts`:** Strip Vue/Svelte code. Implement deep React state/context extraction.
2. **Build the "Context Toggle":** Create the visualizer for the "Neighborhood" and "Causal" layers (colored outlines).
3. **Update the UI:** Replace the side panel with the floating "Loupe-to-Lens" card.
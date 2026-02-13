/**
 * Eyeglass Inspector - Glass UI for visual element inspection
 * v2.0 - Loupe-to-Lens interaction model
 */
export declare class EyeglassInspector extends HTMLElement {
    private shadow;
    private highlight;
    private panel;
    private toast;
    private hub;
    private domPauseBtn;
    private currentElement;
    private currentSnapshot;
    private interactionId;
    private frozen;
    private eventSource;
    private throttleTimeout;
    private mode;
    private activityEvents;
    private currentStatus;
    private currentStatusMessage;
    private hubExpanded;
    private hubPage;
    private inspectorEnabled;
    private autoCommitEnabled;
    private themePreference;
    private history;
    private isDragging;
    private dragOffset;
    private customPanelPosition;
    private customLensPosition;
    private multiSelectMode;
    private selectedElements;
    private selectedSnapshots;
    private multiSelectHighlights;
    private submittedSnapshots;
    private stateCapsules;
    private activeCapsuleId;
    private interactionStateLabel;
    private frozenHealthIssues;
    private cursorStyleElement;
    private scrollTimeout;
    private phraseIndex;
    private phraseInterval;
    private _userNote;
    private uiMode;
    private loupe;
    private lens;
    private lastMouseX;
    private lastMouseY;
    private crosshairX;
    private crosshairY;
    private simulatedHoverElement;
    private simulatedPressedElement;
    private simulatedFocusedElement;
    private simulatedStateVariant;
    private domPaused;
    private pauseStyleElement;
    private pausedAnimations;
    private nativeRAF;
    private nativeCAF;
    private queuedRAFCallbacks;
    private rafIdCounter;
    private pauseStartTime;
    private totalPausedTime;
    private rafInstalled;
    private pseudoMirrorReady;
    private pseudoMirrorStyle;
    private forcedStateElements;
    private showingContextOverlays;
    private contextOverlays;
    private contextOverlayElements;
    private handleMouseMove;
    private handleClick;
    private handleKeyDown;
    private handleScroll;
    private dragHandlers;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    private connectSSE;
    private handleActivityEvent;
    private restoreSession;
    private showResultToast;
    private hideToast;
    private applyTheme;
    private toggleInspectorEnabled;
    private updateCursor;
    private showHighlight;
    private updateCrosshair;
    private submitFromLensShortcut;
    private toggleCrosshair;
    private hideHighlight;
    private freeze;
    private unfreeze;
    private enterMultiSelectMode;
    private exitMultiSelectMode;
    private toggleInSelection;
    private removeFromSelection;
    private buildInteractionStateInfo;
    /**
     * Capture health issues from all interaction states (default, hover, focus, pressed)
     * and return a deduplicated combined list. This ensures element-level issues are caught
     * even if they only manifest on certain states (e.g., affordance mismatch on hover).
     */
    private captureAllStateHealthIssues;
    private applySnapshotSelection;
    private capturePreviewSnapshot;
    private toCapsule;
    private pushCapsule;
    private captureStateCapsule;
    private selectStateCapsule;
    private deleteStateCapsule;
    private rotateInteractionState;
    private applyInteractionVariant;
    private clearSimulatedState;
    private simulateHover;
    private simulateFocus;
    private simulatePressed;
    private dispatchSyntheticEvent;
    private getElementCenter;
    private getForcedStatesForVariant;
    private updateForcedStates;
    private ensurePseudoMirrorStyles;
    private collectPseudoMirrorRules;
    private toggleDomPause;
    /**
     * Install a permanent RAF wrapper that adjusts timestamps to account for paused time.
     * This wrapper stays installed and ensures all RAF callbacks get adjusted timestamps.
     */
    private installRAFWrapper;
    private pauseDom;
    private resumeDom;
    private renderHub;
    private renderPanel;
    private hidePanel;
    private renderLens;
    private wireLensEvents;
    private hideLens;
    private toggleContextOverlays;
    private showContextOverlays;
    private hideContextOverlays;
    private toggleSchemaView;
    private toggleJsonView;
    private wireSchemaSection;
    private highlightJson;
    private startPhraseRotation;
    private stopPhraseRotation;
    private submit;
    private submitFollowUp;
    private handleSubmitAnswer;
    private handleUndoRequest;
    private handleUndoFromPanel;
    private handleCommitRequest;
}

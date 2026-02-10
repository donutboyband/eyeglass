var Tt=new Set([0,1,11,14,15]);function Pt(t){let e=Object.keys(t).find(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$"));return e?t[e]:null}function O(t){if(!Tt.has(t.tag)||typeof t.type!="function")return!1;let n=t.type.displayName||t.type.name||"";return!(!n||n.startsWith("Context")||n.endsWith("Provider")||n==="StrictMode")}function B(t){return t.type.displayName||t.type.name||void 0}function Lt(t){let n=t;for(;n;){if(O(n))return n;n=n.return}return null}function _(t){let n=[],e=t;for(;e;){if(O(e)){let i=B(e);i&&n.push(i)}e=e.return}return n}function j(t){if(!t)return;let n={};for(let[e,i]of Object.entries(t)){if(e==="children")continue;let o=typeof i;(o==="string"||o==="number"||o==="boolean"||i===null)&&(n[e]=i)}return Object.keys(n).length>0?n:void 0}function Dt(t){let n=t.__vue__;if(n)return{name:"vue",componentName:n.$options?.name||n.$options?._componentTag};let i=Object.keys(t).find(o=>o.startsWith("__vue"));if(i){let o=t[i];if(o){let s=o,r,a;s?.type?.name?r=s.type.name:s?.type?.__name?r=s.type.__name:s?.component?.type?.name?r=s.component.type.name:s?.component?.type?.__name&&(r=s.component.type.__name);let l=s?.props||s?.component?.props;l&&(a=j(l));let h;return s?.type?.__file?h=s.type.__file:s?.component?.type?.__file&&(h=s.component.type.__file),{name:"vue",componentName:r,filePath:h,props:a}}return{name:"vue"}}return null}function $t(t){let e=Object.keys(t).find(i=>i.startsWith("__svelte"));if(e){let i=t[e],o;if(i?.constructor?.name&&i.constructor.name!=="Object"&&(o=i.constructor.name),!o&&i?.$$?.ctx){let s=i.$$.ctx;s?.constructor?.name&&s.constructor.name!=="Object"&&(o=s.constructor.name)}return{name:"svelte",componentName:o}}return null}function T(t){let n=Pt(t);if(n){let o=Lt(n);if(o){let r=B(o),a=o._debugSource,l=_(o);return{name:"react",componentName:r,filePath:a?.fileName,lineNumber:a?.lineNumber,props:j(o.memoizedProps),ancestry:l.length>0?l:void 0}}let s=_(n);return{name:"react",ancestry:s.length>0?s:void 0}}let e=Dt(t);if(e)return e;let i=$t(t);return i||{name:"vanilla"}}function At(t){let n=t.getAttribute("aria-label"),e=t.getAttribute("aria-describedby"),i=t.getAttribute("aria-disabled"),o=t.getAttribute("aria-expanded"),s=t.getAttribute("aria-checked"),r=t.getAttribute("aria-hidden"),a=null;e&&(a=document.getElementById(e)?.textContent?.trim()||null);let l=i==="true"||t.disabled||t.hasAttribute("disabled");return{label:n||t.getAttribute("title")||null,description:a,disabled:l,expanded:o?o==="true":void 0,checked:s==="true"?!0:s==="false"?!1:s==="mixed"?"mixed":void 0,hidden:r==="true"||t.hidden||!1}}function zt(t){let n=t.getBoundingClientRect();return{x:Math.round(n.x),y:Math.round(n.y),width:Math.round(n.width),height:Math.round(n.height),visible:n.width>0&&n.height>0}}function Nt(t){let n=getComputedStyle(t);return{display:n.display,position:n.position,flexDirection:n.flexDirection!=="row"?n.flexDirection:void 0,gridTemplate:n.display==="grid"?`${n.gridTemplateColumns} / ${n.gridTemplateRows}`:void 0,padding:n.padding,margin:n.margin,color:n.color,backgroundColor:n.backgroundColor,fontFamily:n.fontFamily,zIndex:n.zIndex}}function Rt(t){let n=t.getAttribute("role");if(n)return n;let e=t.tagName.toLowerCase();return{a:"link",button:"button",input:t.type||"textbox",select:"combobox",textarea:"textbox",img:"img",nav:"navigation",main:"main",header:"banner",footer:"contentinfo",aside:"complementary",article:"article",section:"region",form:"form",ul:"list",ol:"list",li:"listitem",table:"table",tr:"row",td:"cell",th:"columnheader",dialog:"dialog",h1:"heading",h2:"heading",h3:"heading",h4:"heading",h5:"heading",h6:"heading"}[e]||"generic"}function qt(t){let n=t.getAttribute("aria-label");if(n)return n;let e=t.getAttribute("aria-labelledby");if(e){let o=document.getElementById(e);if(o)return o.textContent?.trim()||""}if(t.tagName==="INPUT"||t.tagName==="SELECT"||t.tagName==="TEXTAREA"){let o=t.getAttribute("id");if(o){let s=document.querySelector(`label[for="${o}"]`);if(s)return s.textContent?.trim()||""}}if(t.tagName==="IMG")return t.alt||"";let i=t.textContent?.trim()||"";return i.length>50?i.slice(0,50)+"...":i}function Ft(t){let n={},e=t.getAttribute("id");e&&(n.id=e);let i=t.getAttribute("class");i?.trim()&&(n.className=i.trim());let o={};for(let s=0;s<t.attributes.length;s++){let r=t.attributes[s];r.name.startsWith("data-")&&(o[r.name]=r.value)}return Object.keys(o).length>0&&(n.dataAttributes=o),n}function S(t){let n=Ft(t);return{role:Rt(t),name:qt(t),tagName:t.tagName.toLowerCase(),...n,framework:T(t),a11y:At(t),geometry:zt(t),styles:Nt(t),timestamp:Date.now(),url:window.location.href}}var f="http://localhost:3300",E="eyeglass_session",P="eyeglass_history",L="eyeglass_enabled",D="eyeglass_autocommit",$="eyeglass_theme";var v=["Ruminating...","Percolating...","Divining...","Grokking...","Communing...","Concocting...","Synthesizing...","Distilling...","Incubating...","Forging...","Scrutinizing...","Triangulating...","Unraveling...","Traversing...","Sifting...","Marshaling...","Hydrating...","Harmonizing...","Indexing...","Entangling..."],U='url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xIDEyczQtOCAxMS04IDExIDggMTEgOC00IDgtMTEgOC0xMS04LTExLTh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0iIzYzNjZmMSIvPjwvc3ZnPg==") 8 8, crosshair';var Y=`
:host {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2147483647;
  pointer-events: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  box-sizing: border-box;
  --glass-bg: rgba(255, 255, 255, 0.88);
  --glass-border: rgba(0, 0, 0, 0.25);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --divider: rgba(0, 0, 0, 0.18);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --accent: #6366f1;
  --accent-soft: rgba(99, 102, 241, 0.1);
  --success: #10b981;
  --error: #ef4444;
  --border-radius: 16px;
  --border-radius-sm: 10px;
}

:host([data-theme="dark"]) {
  --glass-bg: rgba(22, 27, 34, 0.95);
  --glass-border: rgba(240, 246, 252, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4);
  --divider: rgba(240, 246, 252, 0.1);
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-muted: #6e7681;
  --accent: #3b82f6;
  --accent-soft: rgba(59, 130, 246, 0.15);
  --success: #3fb950;
  --error: #f85149;
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) {
    --glass-bg: rgba(22, 27, 34, 0.95);
    --glass-border: rgba(240, 246, 252, 0.1);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4);
    --divider: rgba(240, 246, 252, 0.1);
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --text-muted: #6e7681;
    --accent: #3b82f6;
    --accent-soft: rgba(59, 130, 246, 0.15);
    --success: #3fb950;
    --error: #f85149;
  }
}

/* Dark mode component overrides */
:host([data-theme="dark"]) .close-btn:hover,
:host([data-theme="dark"]) .toast-close:hover,
:host([data-theme="dark"]) .hub-header:hover,
:host([data-theme="dark"]) .hub-disable:hover,
:host([data-theme="dark"]) .hub-back-btn:hover,
:host([data-theme="dark"]) .hub-settings-btn:hover,
:host([data-theme="dark"]) .followup-done:hover {
  background: rgba(255, 255, 255, 0.08);
}

:host([data-theme="dark"]) .btn-secondary {
  background: rgba(255, 255, 255, 0.08);
}

:host([data-theme="dark"]) .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}

:host([data-theme="dark"]) .input-field {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

:host([data-theme="dark"]) .input-field:focus {
  background: rgba(255, 255, 255, 0.12);
}

:host([data-theme="dark"]) .followup-input {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

:host([data-theme="dark"]) .followup-input:focus {
  background: rgba(255, 255, 255, 0.12);
}

:host([data-theme="dark"]) .toggle-switch {
  background: #30363d;
}

:host([data-theme="dark"]) .toggle-switch.active {
  background: var(--accent);
}

:host([data-theme="dark"]) .skeleton-icon,
:host([data-theme="dark"]) .skeleton-line {
  background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%);
  background-size: 200% 100%;
}

:host([data-theme="dark"]) .question-option {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
}

:host([data-theme="dark"]) .question-option:hover {
  background: var(--accent-soft);
}

:host([data-theme="dark"]) .user-request {
  background: rgba(255, 255, 255, 0.03);
}

:host([data-theme="dark"]) .hub-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

:host([data-theme="dark"]) .selected-list,
:host([data-theme="dark"]) .multi-mode-hint {
  background: rgba(255, 255, 255, 0.03);
}

:host([data-theme="dark"]) .followup-area {
  background: rgba(63, 185, 80, 0.1);
}

:host([data-theme="dark"]) .panel-footer.done {
  background: rgba(63, 185, 80, 0.12);
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) .close-btn:hover,
  :host([data-theme="auto"]) .toast-close:hover,
  :host([data-theme="auto"]) .hub-header:hover,
  :host([data-theme="auto"]) .hub-disable:hover,
  :host([data-theme="auto"]) .hub-back-btn:hover,
  :host([data-theme="auto"]) .hub-settings-btn:hover,
  :host([data-theme="auto"]) .followup-done:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  :host([data-theme="auto"]) .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
  }

  :host([data-theme="auto"]) .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  :host([data-theme="auto"]) .input-field {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }

  :host([data-theme="auto"]) .input-field:focus {
    background: rgba(255, 255, 255, 0.12);
  }

  :host([data-theme="auto"]) .followup-input {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }

  :host([data-theme="auto"]) .followup-input:focus {
    background: rgba(255, 255, 255, 0.12);
  }

  :host([data-theme="auto"]) .toggle-switch {
    background: #30363d;
  }

  :host([data-theme="auto"]) .toggle-switch.active {
    background: var(--accent);
  }

  :host([data-theme="auto"]) .skeleton-icon,
  :host([data-theme="auto"]) .skeleton-line {
    background: linear-gradient(90deg, #21262d 25%, #30363d 50%, #21262d 75%);
    background-size: 200% 100%;
  }

  :host([data-theme="auto"]) .question-option {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
  }

  :host([data-theme="auto"]) .question-option:hover {
    background: var(--accent-soft);
  }

  :host([data-theme="auto"]) .user-request {
    background: rgba(255, 255, 255, 0.03);
  }

  :host([data-theme="auto"]) .hub-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  :host([data-theme="auto"]) .selected-list,
  :host([data-theme="auto"]) .multi-mode-hint {
    background: rgba(255, 255, 255, 0.03);
  }

  :host([data-theme="auto"]) .followup-area {
    background: rgba(63, 185, 80, 0.1);
  }

  :host([data-theme="auto"]) .panel-footer.done {
    background: rgba(63, 185, 80, 0.12);
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Highlight overlay */
.highlight {
  position: absolute;
  z-index: 2147483640;
  border: 2px solid var(--accent);
  background: rgba(99, 102, 241, 0.06);
  pointer-events: none;
  border-radius: 6px;
  transition: all 0.1s ease-out;
  box-shadow:
    0 0 0 3px rgba(99, 102, 241, 0.08),
    0 2px 8px rgba(99, 102, 241, 0.1);
}

.highlight.no-transition {
  transition: none;
}

/* Glass Panel */
.glass-panel {
  position: absolute;
  z-index: 2147483647;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  width: 340px;
  overflow: hidden;
  animation: panelIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.glass-panel *, .glass-panel *::before, .glass-panel *::after {
  cursor: inherit;
}

.glass-panel button, .glass-panel input {
  cursor: pointer;
}

.glass-panel input[type="text"] {
  cursor: text;
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Panel Header */
.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: grab;
  user-select: none;
}

.panel-header:active {
  cursor: grabbing;
}

.component-tag {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.01em;
}

.file-path {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 18px;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

/* User Request */
.user-request {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--divider);
}

.user-request-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.user-request-text {
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Input Mode */
.input-area {
  padding: 12px 16px 16px;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.6);
  color: var(--text-primary);
  outline: none;
  transition: all 0.15s;
  min-height: 60px;
  max-height: 150px;
  resize: none;
  line-height: 1.4;
  overflow-y: auto;
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  background: white;
}

.btn-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  flex: 1;
  padding: 9px 14px;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

/* Activity Feed */
.activity-feed {
  max-height: 280px;
  overflow-y: auto;
  padding: 8px 0;
}

.activity-feed::-webkit-scrollbar {
  width: 6px;
}

.activity-feed::-webkit-scrollbar-track {
  background: transparent;
}

.activity-feed::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.activity-item {
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: itemIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes itemIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.activity-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 10px;
}

.activity-icon.status { background: var(--accent-soft); color: var(--accent); }
.activity-icon.thought { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.activity-icon.action { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
.activity-icon.question { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.activity-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.activity-icon.error { background: rgba(239, 68, 68, 0.1); color: var(--error); }

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  color: var(--text-primary);
  word-wrap: break-word;
}

.activity-text.muted {
  color: var(--text-secondary);
}

.activity-target {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Question UI */
.question-box {
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: var(--border-radius-sm);
  padding: 12px;
  margin: 8px 16px;
  animation: questionIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes questionIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.question-text {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.question-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.question-option {
  padding: 7px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.question-option:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

/* Skeleton loader */
.skeleton-item {
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.skeleton-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Status Footer */
.panel-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}

.status-indicator.pending {
  background: var(--accent);
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.fixing {
  background: #0ea5e9;
  animation: pulse 1s ease-in-out infinite;
}

.status-indicator.success { background: var(--success); }
.status-indicator.failed { background: var(--error); }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

.status-text {
  font-size: 12px;
  color: var(--text-secondary);
  flex: 1;
}

/* Done state */
.panel-footer.done {
  background: rgba(16, 185, 129, 0.06);
}

.panel-footer.done .status-text {
  color: var(--success);
  font-weight: 500;
}

/* Result Toast - shows after page reload */
.result-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  padding: 14px 18px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 320px;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.toast-icon.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.toast-icon.failed {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.toast-message {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

/* Hub - Request History */
.hub {
  position: fixed;
  bottom: 16px;
  left: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  min-width: 36px;
  max-width: 200px;
  overflow: hidden;
  animation: hubIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.hub *, .hub *::before, .hub *::after {
  cursor: inherit;
}

.hub button {
  cursor: pointer;
}

@keyframes hubIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hub.disabled.collapsed {
  opacity: 0.5;
}

.hub-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
}

.hub-header:hover {
  background: rgba(0, 0, 0, 0.03);
}

.hub-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hub-logo {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  flex-shrink: 0;
}

.hub-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.hub-badge {
  font-size: 9px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  padding: 1px 5px;
  border-radius: 8px;
  min-width: 14px;
  text-align: center;
}

.hub-toggle {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: transform 0.2s;
}

.hub-toggle.expanded {
  transform: rotate(180deg);
}

.hub-disable {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-disable:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

.hub-disable.active {
  color: var(--accent);
}

.hub-disable svg {
  width: 14px;
  height: 14px;
}

.hub-content {
  border-top: 1px solid var(--divider);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.hub-content.expanded {
  max-height: 220px;
}

.hub-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}

.hub-list::-webkit-scrollbar {
  width: 6px;
}

.hub-list::-webkit-scrollbar-track {
  background: transparent;
}

.hub-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.hub-item {
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hub-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.hub-item-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hub-item-status.pending { background: var(--accent); animation: pulse 1.5s ease-in-out infinite; }
.hub-item-status.fixing { background: #0ea5e9; animation: pulse 1s ease-in-out infinite; }
.hub-item-status.success { background: var(--success); }
.hub-item-status.failed { background: var(--error); }

.hub-item-content {
  flex: 1;
  min-width: 0;
}

.hub-item-component {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
}

.hub-item-note {
  font-size: 11px;
  color: var(--text-primary);
  word-wrap: break-word;
}

.hub-item-undo {
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-item:hover .hub-item-undo {
  opacity: 1;
}

.hub-item-undo:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.hub-empty {
  padding: 10px 8px;
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
}

.hub-settings-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-settings-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

.hub-settings-btn svg {
  width: 12px;
  height: 12px;
}

/* Settings Page */
.hub-settings-page {
  padding: 8px 0;
}

.hub-settings-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 8px;
  border-bottom: 1px solid var(--divider);
}

.hub-back-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.hub-back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.hub-settings-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
}

.hub-settings-list {
  padding: 8px;
}

.hub-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
}

.hub-setting-row:not(:last-child) {
  border-bottom: 1px solid var(--divider);
  padding-bottom: 10px;
  margin-bottom: 4px;
}

.hub-setting-info {
  flex: 1;
}

.hub-setting-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
}

.hub-setting-desc {
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 2px;
}

.theme-selector {
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}

:host([data-theme="dark"]) .theme-selector {
  background: rgba(255, 255, 255, 0.08);
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) .theme-selector {
    background: rgba(255, 255, 255, 0.08);
  }
}

.theme-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  color: var(--text-secondary);
}

.theme-btn.active {
  background: var(--glass-bg);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.theme-btn svg {
  width: 14px;
  height: 14px;
}

.hub-button-group {
  display: flex;
}

/* Collapsed hub (minimal) */
.hub.collapsed .hub-title,
.hub.collapsed .hub-toggle {
  display: none;
}

.hub.collapsed .hub-header {
  padding: 5px;
}

.hub.collapsed .hub-header-left {
  gap: 4px;
}

.toggle-switch {
  position: relative;
  width: 32px;
  height: 18px;
  background: #cbd5e1;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
  padding: 0;
}

.toggle-switch.active {
  background: var(--accent);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active::after {
  transform: translateX(14px);
}

/* Success action buttons */
.success-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.action-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn-commit {
  background: var(--success);
  color: white;
}

.action-btn-commit:hover {
  background: #059669;
}

.action-btn-undo {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.action-btn-undo:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Follow-up input */
.followup-area {
  padding: 12px;
  border-top: 1px solid var(--divider);
  background: rgba(16, 185, 129, 0.04);
}

.followup-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.followup-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-primary);
  outline: none;
  transition: all 0.15s;
  min-height: 36px;
  max-height: 100px;
  resize: none;
  line-height: 1.4;
  overflow-y: auto;
}

.followup-input::placeholder {
  color: var(--text-muted);
}

.followup-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-soft);
  background: white;
}

.followup-send {
  flex-shrink: 0;
  padding: 9px 16px;
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.followup-send:hover {
  background: #4f46e5;
}

.followup-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.followup-done {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--divider);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.followup-done:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Multi-select styles */
.highlight.multi {
  border-style: dashed;
  border-width: 2px;
  box-shadow:
    0 0 0 2px rgba(99, 102, 241, 0.06),
    0 2px 6px rgba(99, 102, 241, 0.08);
}

.highlight-badge {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 20px;
  height: 20px;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.multi-select-icon {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 16px;
  line-height: 1;
}

.multi-select-icon:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.multi-select-icon.active {
  background: var(--accent);
  color: white;
}

.selected-list {
  padding: 8px 16px;
  border-bottom: 1px solid var(--divider);
  background: rgba(0, 0, 0, 0.02);
}

.selected-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.selected-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--accent-soft);
  border-radius: 6px;
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

.selected-chip-number {
  width: 16px;
  height: 16px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.selected-chip-remove {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
  transition: all 0.15s;
  padding: 0;
}

.selected-chip-remove:hover {
  opacity: 1;
  background: rgba(99, 102, 241, 0.2);
}

.multi-mode-hint {
  padding: 8px 16px;
  background: var(--accent-soft);
  border-bottom: 1px solid var(--divider);
  font-size: 11px;
  color: var(--accent);
  text-align: center;
}
`;function d(t){let n=document.createElement("div");return n.textContent=t,n.innerHTML}function A(t,n){switch(t){case"idle":return"Ready";case"pending":return"Waiting for agent...";case"fixing":return v[n%v.length];case"success":return"Done!";case"failed":return"Failed";default:return t}}function G(t,n,e,i){if(t&&(!n||e)){let s=i;return s||(s=document.createElement("style"),s.id="eyeglass-cursor-style",document.head.appendChild(s)),s.textContent=`
      html, body, body * {
        cursor: ${U} !important;
      }
    `,s}else return i&&(i.textContent=""),i}function z(){return`eyeglass-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function K(t){let n=new EventSource(`${f}/events`);return n.onmessage=e=>{try{let i=JSON.parse(e.data);i.type==="activity"&&t.onActivityEvent(i.payload)}catch{}},n.onerror=()=>{n.close(),setTimeout(()=>t.onReconnect(),3e3)},n}async function N(t){let n={interactionId:t.interactionId,userNote:t.userNote.trim(),autoCommit:t.autoCommit,...t.snapshots.length===1?{snapshot:t.snapshots[0]}:{snapshots:t.snapshots}};try{let e=await fetch(`${f}/focus`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});return e.ok?{success:!0}:{success:!1,error:`HTTP ${e.status}`}}catch{return{success:!1,error:"Failed to connect to bridge"}}}async function W(t,n,e,i){let o={interactionId:t,questionId:n,answerId:e,answerLabel:i};try{await fetch(`${f}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})}catch{}}async function J(t){try{return{success:(await fetch(`${f}/undo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:t})})).ok}}catch(n){return console.warn("Undo request failed:",n),{success:!1}}}async function V(t){try{return(await fetch(`${f}/commit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:t})})).ok?{success:!0}:(console.warn("Commit request failed"),{success:!1})}catch(n){return console.warn("Commit request failed:",n),{success:!1}}}function R(t,n,e){let i=e.map(s=>s.framework.componentName||s.tagName),o=e.length===1?i[0]:`${i.length} elements`;return{interactionId:t,userNote:n.trim(),componentName:o,filePath:e[0]?.framework.filePath,status:"pending",timestamp:Date.now()}}var Z=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1"/>
    </linearGradient>
  </defs>
  <circle cx="30" cy="50" r="20" fill="url(#lensGrad)" stroke="#3b82f6" stroke-width="3"/>
  <circle cx="70" cy="50" r="20" fill="url(#lensGrad)" stroke="#3b82f6" stroke-width="3"/>
  <path d="M 50 50 Q 50 42 50 50" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <line x1="50" y1="47" x2="50" y2="53" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <line x1="10" y1="50" x2="10" y2="50" stroke="#3b82f6" stroke-width="3"/>
  <path d="M 10 50 L 5 45" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <path d="M 90 50 L 95 45" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <path d="M 65 45 L 65 60 L 69 56 L 74 63 L 76 61 L 71 54 L 76 54 Z" fill="#3b82f6"/>
</svg>`,_t='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',Ot='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',Bt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',jt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',Ut='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',Yt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';function X(t,n,e){let i=n.hubExpanded?"":"collapsed",o=n.inspectorEnabled?"":"disabled",s=n.hubExpanded?"expanded":"",r=n.history.filter(c=>c.status==="pending"||c.status==="fixing").length;t.className=`hub ${i} ${o}`.trim(),t.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${Z}</div>
        <span class="hub-title">Eyeglass</span>
        ${r>0?`<span class="hub-badge">${r}</span>`:""}
        <button class="hub-toggle ${s}" title="Toggle history">\u25BC</button>
      </div>
      <div class="hub-button-group">
      <button class="hub-settings-btn" title="Settings">${Bt}</button>
      <button class="hub-disable ${n.inspectorEnabled?"active":""}" title="${n.inspectorEnabled?"Disable":"Enable"} inspector">
        ${n.inspectorEnabled?_t:Ot}
      </button>
      </div>
    </div>
    <div class="hub-content ${s}">
      ${n.history.length>0?`
        <div class="hub-list">
          ${n.history.map(c=>`
            <div class="hub-item" data-id="${c.interactionId}">
              <div class="hub-item-status ${c.status}"></div>
              <div class="hub-item-content">
                <div class="hub-item-component">${d(c.componentName)}</div>
                <div class="hub-item-note">${d(c.userNote)}</div>
              </div>
              ${c.status==="success"?`
                <button class="hub-item-undo" data-id="${c.interactionId}" title="Undo">\u21A9</button>
              `:""}
            </div>
          `).join("")}
        </div>
      `:`
        <div class="hub-empty">No requests yet</div>
      `}
    </div>
  `;let a=t.querySelector(".hub-header"),l=t.querySelector(".hub-disable"),h=t.querySelector(".hub-settings-btn");a.addEventListener("click",c=>{c.target===l||c.target===h||c.target.closest(".hub-settings-btn")||e.onToggleExpanded()}),h.addEventListener("click",c=>{c.stopPropagation(),e.onOpenSettings()}),l.addEventListener("click",c=>{c.stopPropagation(),e.onToggleEnabled()}),t.querySelectorAll(".hub-item-undo").forEach(c=>{c.addEventListener("click",g=>{g.stopPropagation();let x=g.currentTarget.dataset.id;e.onUndo(x)})})}function Q(t,n,e){t.className="hub",t.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${Z}</div>
        <span class="hub-title">Eyeglass</span>
      </div>
    </div>
    <div class="hub-content expanded">
      <div class="hub-settings-page">
        <div class="hub-settings-header">
          <button class="hub-back-btn" title="Back">\u2190</button>
          <span class="hub-settings-title">Settings</span>
        </div>
        <div class="hub-settings-list">
          <div class="hub-setting-row">
            <div class="hub-setting-info">
              <div class="hub-setting-label">Theme</div>
              <div class="hub-setting-desc">Light, dark, or match system</div>
            </div>
            <div class="theme-selector">
              <button class="theme-btn ${n.themePreference==="light"?"active":""}" data-theme="light" title="Light">${jt}</button>
              <button class="theme-btn ${n.themePreference==="auto"?"active":""}" data-theme="auto" title="Auto">${Yt}</button>
              <button class="theme-btn ${n.themePreference==="dark"?"active":""}" data-theme="dark" title="Dark">${Ut}</button>
            </div>
          </div>
          <div class="hub-setting-row">
            <div class="hub-setting-info">
              <div class="hub-setting-label">Auto-commit</div>
              <div class="hub-setting-desc">Automatically commit changes on success</div>
            </div>
            <button class="toggle-switch ${n.autoCommitEnabled?"active":""}" data-setting="autoCommit"></button>
          </div>
        </div>
      </div>
    </div>
  `,t.querySelector(".hub-back-btn").addEventListener("click",()=>{e.onBack()}),t.querySelectorAll(".theme-btn").forEach(o=>{o.addEventListener("click",s=>{let r=s.currentTarget.dataset.theme;e.onThemeChange(r)})}),t.querySelectorAll(".toggle-switch").forEach(o=>{o.addEventListener("click",s=>{s.currentTarget.dataset.setting==="autoCommit"&&e.onAutoCommitToggle()})})}function tt(t,n){let e=t.map(i=>{switch(i.type){case"status":return i.status==="pending"||i.status==="fixing"&&(!i.message||i.message==="Agent is working...")?"":Gt(i);case"thought":return Kt(i);case"action":return Wt(i);case"question":return Jt(i,t);default:return""}}).filter(Boolean);return e.length===0&&(n==="pending"||n==="fixing")?`
      <div class="skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-line"></div>
      </div>
    `:e.join("")}function Gt(t){let n=t.status==="success"?"success":t.status==="failed"?"error":"status",e=t.status==="success"?"\u2713":t.status==="failed"?"\u2715":"\u25CF";return`
    <div class="activity-item">
      <div class="activity-icon ${n}">${e}</div>
      <div class="activity-content">
        <div class="activity-text">${d(t.message||t.status)}</div>
      </div>
    </div>
  `}function Kt(t){return`
    <div class="activity-item">
      <div class="activity-icon thought">\u{1F4AD}</div>
      <div class="activity-content">
        <div class="activity-text muted">${d(t.content)}</div>
      </div>
    </div>
  `}function Wt(t){let n={reading:"\u{1F4D6}",writing:"\u270F\uFE0F",searching:"\u{1F50D}",thinking:"\u{1F9E0}"},e={reading:"Reading",writing:"Writing",searching:"Searching",thinking:"Thinking about"};return`
    <div class="activity-item">
      <div class="activity-icon action">${n[t.action]||"\u25CF"}</div>
      <div class="activity-content">
        <div class="activity-text">${e[t.action]||t.action}${t.complete?" \u2713":"..."}</div>
        <div class="activity-target">${d(t.target)}</div>
      </div>
    </div>
  `}function Jt(t,n){return n.some(i=>i.type==="status"&&i.timestamp>t.timestamp)?`
      <div class="activity-item">
        <div class="activity-icon question">?</div>
        <div class="activity-content">
          <div class="activity-text muted">${d(t.question)}</div>
        </div>
      </div>
    `:`
    <div class="question-box">
      <div class="question-text">${d(t.question)}</div>
      <div class="question-options">
        ${t.options.map(i=>`
          <button
            class="question-option"
            data-question-id="${t.questionId}"
            data-answer-id="${i.id}"
          >${d(i.label)}</button>
        `).join("")}
      </div>
    </div>
  `}function nt(t,n,e){if(e)return e;let i=window.innerHeight-t.bottom,o=n==="activity"?400:200,s=t.bottom+12;i<o&&t.top>o&&(s=t.top-o-12);let r=t.left;return r+340>window.innerWidth-20&&(r=window.innerWidth-360),r<20&&(r=20),{x:r,y:s}}function it(t,n,e){let i=n.multiSelectMode,o=i?"multi-select-icon active":"multi-select-icon",s=i?`
    <div class="selected-list">
      <div class="selected-list-header">
        <span class="selected-count">${n.selectedSnapshots.length} element${n.selectedSnapshots.length!==1?"s":""} selected</span>
      </div>
      <div class="selected-chips">
        ${n.selectedSnapshots.map((u,p)=>{let b=u.framework.componentName||u.tagName;return`
            <div class="selected-chip" data-index="${p}">
              <span class="selected-chip-number">${p+1}</span>
              <span>${d(b)}</span>
              <button class="selected-chip-remove" data-index="${p}" title="Remove">&times;</button>
            </div>
          `}).join("")}
      </div>
    </div>
  `:"",r=i?`
    <div class="multi-mode-hint">Click elements to add/remove from selection (max ${5})</div>
  `:"";t.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">&lt;${d(n.componentName)} /&gt;</span>
      ${n.filePath?`<span class="file-path">${d(n.filePath)}</span>`:""}
      <button class="${o}" title="${i?"Exit multi-select":"Select multiple elements"}">+</button>
      <button class="close-btn" title="Cancel (Esc)">&times;</button>
    </div>
    ${r}
    ${s}
    <div class="input-area">
      <textarea
        class="input-field"
        placeholder="${i?"Describe what to change for these elements...":"What do you want to change?"}"
        autofocus
        rows="2"
      ></textarea>
      <div class="btn-row">
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-primary">Send</button>
      </div>
    </div>
  `;let a=t.querySelector(".input-field"),l=t.querySelector(".close-btn"),h=t.querySelector(".btn-secondary"),c=t.querySelector(".btn-primary"),g=t.querySelector(".multi-select-icon");l.addEventListener("click",()=>e.onClose()),h.addEventListener("click",()=>e.onClose()),c.addEventListener("click",()=>e.onSubmit(a.value)),a.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&a.value.trim()&&(u.preventDefault(),e.onSubmit(a.value))}),g.addEventListener("click",()=>{e.onToggleMultiSelect()}),t.querySelectorAll(".selected-chip-remove").forEach(u=>{u.addEventListener("click",p=>{p.stopPropagation();let b=parseInt(p.currentTarget.dataset.index,10);e.onRemoveFromSelection(b)})}),t.querySelector(".panel-header").addEventListener("mousedown",e.onPanelDragStart),requestAnimationFrame(()=>a.focus())}function ot(t,n,e){let i=n.currentStatus==="success"||n.currentStatus==="failed",o=n.currentStatus==="success"&&!n.autoCommitEnabled,s=n.currentStatus==="success",r=n.submittedSnapshots.length,a=r>1?`${r} elements`:`&lt;${d(n.componentName)} /&gt;`,l=A(n.currentStatus,n.phraseIndex);t.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">${a}</span>
      ${r<=1&&n.filePath?`<span class="file-path">${d(n.filePath)}</span>`:""}
      <button class="close-btn" title="Close">&times;</button>
    </div>
    <div class="user-request">
      <div class="user-request-label">Your request</div>
      <div class="user-request-text">${d(n.userNote)}</div>
    </div>
    <div class="activity-feed">
      ${tt(n.activityEvents,n.currentStatus)}
    </div>
    <div class="panel-footer ${i?"done":""}">
      <div class="status-indicator ${n.currentStatus}"></div>
      <span class="status-text">${l}</span>
      ${o?`
        <div class="success-actions">
          <button class="action-btn action-btn-undo" title="Discard changes">Undo</button>
          <button class="action-btn action-btn-commit" title="Commit changes">Commit</button>
        </div>
      `:""}
    </div>
    ${s?`
      <div class="followup-area">
        <div class="followup-row">
          <textarea class="followup-input" placeholder="Anything else?" rows="1"></textarea>
          <button class="followup-send">Send</button>
          <button class="followup-done">\u2715</button>
        </div>
      </div>
    `:""}
  `,t.querySelector(".close-btn").addEventListener("click",()=>e.onClose()),t.querySelector(".panel-header").addEventListener("mousedown",e.onPanelDragStart),t.querySelectorAll(".question-option").forEach(y=>{y.addEventListener("click",Mt=>{let C=Mt.target,Ht=C.dataset.questionId,It=C.dataset.answerId,Ct=C.textContent;e.onSubmitAnswer(Ht,It,Ct)})});let g=t.querySelector(".action-btn-commit"),x=t.querySelector(".action-btn-undo");g&&g.addEventListener("click",()=>e.onCommit()),x&&x.addEventListener("click",()=>e.onUndo());let u=t.querySelector(".followup-input"),p=t.querySelector(".followup-send"),b=t.querySelector(".followup-done");u&&p&&(p.addEventListener("click",()=>{u.value.trim()&&e.onSubmitFollowUp(u.value)}),u.addEventListener("keydown",y=>{y.key==="Enter"&&!y.shiftKey&&u.value.trim()&&(y.preventDefault(),e.onSubmitFollowUp(u.value))}),requestAnimationFrame(()=>u.focus())),b&&b.addEventListener("click",()=>e.onClose());let I=t.querySelector(".activity-feed");I&&(I.scrollTop=I.scrollHeight)}function st(t,n,e){if(!t)return;let i=t.querySelector(".status-text");i&&(i.textContent=A(n,e))}function rt(t,n,e,i){return o=>{let s=e();if(!s.multiSelectMode&&s.frozen||!s.inspectorEnabled)return;if(o.composedPath().includes(t)){s.multiSelectMode||i.hideHighlight();return}if(s.throttleTimeout)return;i.setThrottleTimeout(window.setTimeout(()=>{i.setThrottleTimeout(null)},16)),t.style.pointerEvents="none";let a=document.elementFromPoint(o.clientX,o.clientY);if(t.style.pointerEvents="",!a||a===document.documentElement||a===document.body){s.multiSelectMode||i.hideHighlight();return}n.contains(a)||(i.setCurrentElement(a),i.showHighlight(a))}}function at(t,n,e){return i=>{let o=n();if(!(!o.inspectorEnabled||!o.currentElement||i.composedPath().some(r=>r===t))){if(i.preventDefault(),i.stopPropagation(),o.multiSelectMode){e.toggleInSelection(o.currentElement);return}o.frozen||e.freeze()}}}function lt(t){return n=>{n.key==="Escape"&&t.unfreeze()}}function ct(t,n){return()=>{let e=t();e.frozen&&(n.disableHighlightTransitions(),e.currentElement&&e.highlight&&!e.multiSelectMode&&n.showHighlight(e.currentElement),e.multiSelectMode&&e.selectedElements.length>0&&n.updateMultiSelectHighlightPositions(),e.scrollTimeout&&window.clearTimeout(e.scrollTimeout),n.setScrollTimeout(window.setTimeout(()=>{n.enableHighlightTransitions(),n.setScrollTimeout(null)},150)))}}function dt(t,n){let e=s=>{let r=t();if(!r.isDragging||!r.panel)return;let a=Math.max(0,Math.min(s.clientX-r.dragOffset.x,window.innerWidth-340)),l=Math.max(0,Math.min(s.clientY-r.dragOffset.y,window.innerHeight-100));n.setCustomPanelPosition({x:a,y:l}),r.panel.style.left=`${a}px`,r.panel.style.top=`${l}px`},i=()=>{n.setDragging(!1),document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",i)};return{handlePanelDragStart:s=>{if(s.target.closest("button"))return;let r=t();if(!r.panel)return;n.setDragging(!0);let a=r.panel.getBoundingClientRect();n.setDragOffset({x:s.clientX-a.left,y:s.clientY-a.top}),document.addEventListener("mousemove",e),document.addEventListener("mouseup",i)},handlePanelDrag:e,handlePanelDragEnd:i}}function ut(t,n,e,i,o){if(!t)return;let s={interactionId:t,userNote:n,componentName:e?.framework.componentName||e?.tagName||"element",status:i,message:o,timestamp:Date.now()};try{sessionStorage.setItem(E,JSON.stringify(s))}catch{}}function ht(){try{let t=sessionStorage.getItem(E);if(!t)return null;let n=JSON.parse(t);return Date.now()-n.timestamp>1e4?(sessionStorage.removeItem(E),null):n}catch{return null}}function q(){try{sessionStorage.removeItem(E)}catch{}}function pt(){try{let t=sessionStorage.getItem(P);if(t)return JSON.parse(t)}catch{}return[]}function m(t){try{sessionStorage.setItem(P,JSON.stringify(t))}catch{}}function F(t,n){let e=[...t],i=e.findIndex(o=>o.interactionId===n.interactionId);return i>=0?e[i]=n:(e.unshift(n),e.length>20&&(e.length=20)),e}function k(t,n,e){return t.map(i=>i.interactionId===n?{...i,status:e}:i)}function mt(t,n){return t.filter(e=>e.interactionId!==n)}function gt(){try{let t=localStorage.getItem(L);if(t!==null)return t==="true"}catch{}return!0}function bt(t){try{localStorage.setItem(L,String(t))}catch{}}function ft(){try{let t=localStorage.getItem(D);if(t!==null)return t==="true"}catch{}return!0}function vt(t){try{localStorage.setItem(D,String(t))}catch{}}function xt(){try{let t=localStorage.getItem($);if(t==="light"||t==="dark"||t==="auto")return t}catch{}return"auto"}function yt(t){try{localStorage.setItem($,t)}catch{}}function w(t,n){t.multiSelectHighlights.forEach(o=>o.remove());let e=[],i=3;return t.selectedElements.forEach((o,s)=>{let r=o.getBoundingClientRect(),a=document.createElement("div");a.className="highlight multi",a.style.display="block",a.style.left=`${r.left-i}px`,a.style.top=`${r.top-i}px`,a.style.width=`${r.width+i*2}px`,a.style.height=`${r.height+i*2}px`;let l=document.createElement("div");l.className="highlight-badge",l.textContent=String(s+1),a.appendChild(l),n.appendChild(a),e.push(a)}),e}function M(t,n){t.multiSelectHighlights.forEach(e=>e.remove())}function St(t,n){t.forEach((i,o)=>{let s=n[o];if(!s)return;let r=i.getBoundingClientRect();s.style.left=`${r.left-3}px`,s.style.top=`${r.top-3}px`,s.style.width=`${r.width+3*2}px`,s.style.height=`${r.height+3*2}px`})}function Et(t,n){t&&t.classList.add("no-transition"),n.forEach(e=>e.classList.add("no-transition"))}function wt(t,n){t&&t.classList.remove("no-transition"),n.forEach(e=>e.classList.remove("no-transition"))}var H=class extends HTMLElement{constructor(){super();this.highlight=null;this.panel=null;this.toast=null;this.hub=null;this.currentElement=null;this.currentSnapshot=null;this.interactionId=null;this.frozen=!1;this.eventSource=null;this.throttleTimeout=null;this.mode="input";this.activityEvents=[];this.currentStatus="idle";this.hubExpanded=!1;this.hubPage="main";this.inspectorEnabled=!0;this.autoCommitEnabled=!0;this.themePreference="auto";this.history=[];this.isDragging=!1;this.dragOffset={x:0,y:0};this.customPanelPosition=null;this.multiSelectMode=!1;this.selectedElements=[];this.selectedSnapshots=[];this.multiSelectHighlights=[];this.submittedSnapshots=[];this.cursorStyleElement=null;this.scrollTimeout=null;this.phraseIndex=0;this.phraseInterval=null;this._userNote="";this.shadow=this.attachShadow({mode:"closed"}),this.handleMouseMove=rt(this,this.shadow,()=>({frozen:this.frozen,multiSelectMode:this.multiSelectMode,inspectorEnabled:this.inspectorEnabled,throttleTimeout:this.throttleTimeout}),{setThrottleTimeout:e=>this.throttleTimeout=e,hideHighlight:()=>this.hideHighlight(),showHighlight:e=>this.showHighlight(e),setCurrentElement:e=>this.currentElement=e}),this.handleClick=at(this,()=>({inspectorEnabled:this.inspectorEnabled,currentElement:this.currentElement,frozen:this.frozen,multiSelectMode:this.multiSelectMode}),{toggleInSelection:e=>this.toggleInSelection(e),freeze:()=>this.freeze()}),this.handleKeyDown=lt({unfreeze:()=>this.unfreeze()}),this.handleScroll=ct(()=>({frozen:this.frozen,currentElement:this.currentElement,highlight:this.highlight,multiSelectMode:this.multiSelectMode,selectedElements:this.selectedElements,scrollTimeout:this.scrollTimeout}),{showHighlight:e=>this.showHighlight(e),updateMultiSelectHighlightPositions:()=>St(this.selectedElements,this.multiSelectHighlights),disableHighlightTransitions:()=>Et(this.highlight,this.multiSelectHighlights),enableHighlightTransitions:()=>wt(this.highlight,this.multiSelectHighlights),setScrollTimeout:e=>this.scrollTimeout=e}),this.dragHandlers=dt(()=>({isDragging:this.isDragging,dragOffset:this.dragOffset,panel:this.panel}),{setDragging:e=>this.isDragging=e,setDragOffset:e=>this.dragOffset=e,setCustomPanelPosition:e=>this.customPanelPosition=e})}connectedCallback(){let e=document.createElement("style");e.textContent=Y,this.shadow.appendChild(e),this.highlight=document.createElement("div"),this.highlight.className="highlight",this.highlight.style.display="none",this.shadow.appendChild(this.highlight),document.addEventListener("mousemove",this.handleMouseMove,!0),document.addEventListener("click",this.handleClick,!0),document.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0),this.inspectorEnabled=gt(),this.autoCommitEnabled=ft(),this.themePreference=xt(),this.applyTheme(),this.history=pt(),this.renderHub(),this.connectSSE(),this.restoreSession(),this.updateCursor()}disconnectedCallback(){document.removeEventListener("mousemove",this.handleMouseMove,!0),document.removeEventListener("click",this.handleClick,!0),document.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0),this.eventSource?.close(),this.cursorStyleElement&&(this.cursorStyleElement.remove(),this.cursorStyleElement=null)}connectSSE(){this.eventSource=K({onActivityEvent:e=>this.handleActivityEvent(e),onReconnect:()=>this.connectSSE()})}handleActivityEvent(e){e.type==="status"&&(this.history=k(this.history,e.interactionId,e.status),m(this.history),this.renderHub()),e.interactionId===this.interactionId&&(this.activityEvents.push(e),e.type==="status"&&(this.currentStatus=e.status,ut(this.interactionId,this._userNote,this.currentSnapshot,this.currentStatus,e.message),e.status==="fixing"?this.startPhraseRotation():this.stopPhraseRotation(),e.status==="failed"&&setTimeout(()=>this.unfreeze(),4e3)),this.renderPanel())}restoreSession(){let e=ht();e&&(e.status==="success"||e.status==="failed")&&(this.showResultToast(e),q())}showResultToast(e){this.toast=document.createElement("div"),this.toast.className="result-toast";let i=e.status==="success",o=i?"\u2713":"\u2715",s=i?"Done!":"Failed";this.toast.innerHTML=`
      <div class="toast-icon ${e.status}">${o}</div>
      <div class="toast-content">
        <div class="toast-title">${s}</div>
        <div class="toast-message">${d(e.message||e.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `,this.toast.querySelector(".toast-close").addEventListener("click",()=>this.hideToast()),this.shadow.appendChild(this.toast),setTimeout(()=>this.hideToast(),4e3)}hideToast(){this.toast&&(this.toast.remove(),this.toast=null)}applyTheme(){this.setAttribute("data-theme",this.themePreference)}updateCursor(){this.cursorStyleElement=G(this.inspectorEnabled,this.frozen,this.multiSelectMode,this.cursorStyleElement)}showHighlight(e){if(!this.highlight)return;let i=e.getBoundingClientRect(),o=3;this.highlight.style.display="block",this.highlight.style.left=`${i.left-o}px`,this.highlight.style.top=`${i.top-o}px`,this.highlight.style.width=`${i.width+o*2}px`,this.highlight.style.height=`${i.height+o*2}px`}hideHighlight(){this.highlight&&(this.highlight.style.display="none"),this.currentElement=null}freeze(){this.currentElement&&(this.frozen=!0,this.currentSnapshot=S(this.currentElement),this.selectedElements=[this.currentElement],this.selectedSnapshots=[this.currentSnapshot],this.mode="input",this.activityEvents=[],this.currentStatus="idle",this.updateCursor(),this.renderPanel())}unfreeze(){this.frozen=!1,this.currentSnapshot=null,this.interactionId=null,this.mode="input",this.activityEvents=[],this.customPanelPosition=null,this.multiSelectMode=!1,this.selectedElements=[],this.selectedSnapshots=[],this.submittedSnapshots=[],M({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.stopPhraseRotation(),this.hidePanel(),this.hideHighlight(),this.updateCursor(),q()}enterMultiSelectMode(){!this.frozen||this.multiSelectMode||(this.multiSelectMode=!0,this.multiSelectHighlights=w({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.updateCursor(),this.renderPanel())}exitMultiSelectMode(){this.multiSelectMode=!1,this.selectedElements.length>0&&(this.currentElement=this.selectedElements[0],this.currentSnapshot=this.selectedSnapshots[0]),this.selectedElements=this.currentElement?[this.currentElement]:[],this.selectedSnapshots=this.currentSnapshot?[this.currentSnapshot]:[],M({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.currentElement&&this.showHighlight(this.currentElement),this.updateCursor(),this.renderPanel()}toggleInSelection(e){if(!this.multiSelectMode)return;let i=this.selectedElements.indexOf(e);if(i>=0)this.removeFromSelection(i);else{if(this.selectedElements.length>=5)return;let o=S(e);this.selectedElements.push(e),this.selectedSnapshots.push(o)}this.multiSelectHighlights=w({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.renderPanel()}removeFromSelection(e){if(!(e<0||e>=this.selectedElements.length)){if(this.selectedElements.length===1){this.exitMultiSelectMode();return}this.selectedElements.splice(e,1),this.selectedSnapshots.splice(e,1),this.multiSelectHighlights=w({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.renderPanel()}}renderHub(){this.hub||(this.hub=document.createElement("div"),this.hub.className="hub",this.shadow.appendChild(this.hub)),this.hubPage==="settings"?Q(this.hub,{themePreference:this.themePreference,autoCommitEnabled:this.autoCommitEnabled},{onBack:()=>{this.hubPage="main",this.renderHub()},onThemeChange:e=>{this.themePreference=e,yt(e),this.applyTheme(),this.renderHub()},onAutoCommitToggle:()=>{this.autoCommitEnabled=!this.autoCommitEnabled,vt(this.autoCommitEnabled),this.renderHub()}}):X(this.hub,{hubExpanded:this.hubExpanded,inspectorEnabled:this.inspectorEnabled,history:this.history},{onToggleExpanded:()=>{this.hubExpanded=!this.hubExpanded,this.renderHub()},onToggleEnabled:()=>{this.inspectorEnabled=!this.inspectorEnabled,bt(this.inspectorEnabled),this.inspectorEnabled||this.unfreeze(),this.updateCursor(),this.renderHub()},onOpenSettings:()=>{this.hubPage="settings",this.hubExpanded=!0,this.renderHub()},onUndo:e=>this.handleUndoRequest(e)})}renderPanel(){if(!this.currentSnapshot||!this.currentElement)return;let e=this.currentElement.getBoundingClientRect(),{framework:i}=this.currentSnapshot;this.panel||(this.panel=document.createElement("div"),this.panel.className="glass-panel",this.shadow.appendChild(this.panel));let o=nt(e,this.mode,this.customPanelPosition);this.panel.style.left=`${o.x}px`,this.panel.style.top=`${o.y}px`;let s=i.componentName||this.currentSnapshot.tagName,r=i.filePath?i.filePath.split("/").slice(-2).join("/"):null;this.mode==="input"?it(this.panel,{componentName:s,filePath:r,multiSelectMode:this.multiSelectMode,selectedSnapshots:this.selectedSnapshots},{onClose:()=>this.unfreeze(),onSubmit:a=>this.submit(a),onToggleMultiSelect:()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode()},onRemoveFromSelection:a=>this.removeFromSelection(a),onPanelDragStart:this.dragHandlers.handlePanelDragStart}):ot(this.panel,{componentName:s,filePath:r,submittedSnapshots:this.submittedSnapshots,activityEvents:this.activityEvents,currentStatus:this.currentStatus,autoCommitEnabled:this.autoCommitEnabled,userNote:this._userNote,interactionId:this.interactionId,phraseIndex:this.phraseIndex},{onClose:()=>this.unfreeze(),onSubmitFollowUp:a=>this.submitFollowUp(a),onSubmitAnswer:(a,l,h)=>this.handleSubmitAnswer(a,l,h),onCommit:()=>this.handleCommitRequest(),onUndo:()=>this.handleUndoFromPanel(),onPanelDragStart:this.dragHandlers.handlePanelDragStart})}hidePanel(){this.panel&&(this.panel.remove(),this.panel=null)}startPhraseRotation(){this.phraseInterval||(this.phraseIndex=Math.floor(Math.random()*v.length),this.phraseInterval=window.setInterval(()=>{this.phraseIndex=(this.phraseIndex+1)%v.length,st(this.panel,this.currentStatus,this.phraseIndex)},1e4))}stopPhraseRotation(){this.phraseInterval&&(window.clearInterval(this.phraseInterval),this.phraseInterval=null)}async submit(e){if(!e.trim()||this.selectedSnapshots.length===0&&!this.currentSnapshot)return;this.interactionId=z(),this._userNote=e.trim();let i=this.selectedSnapshots.length>0?this.selectedSnapshots:this.currentSnapshot?[this.currentSnapshot]:[];this.submittedSnapshots=[...i];let o=R(this.interactionId,e,i);this.history=F(this.history,o),m(this.history),this.renderHub();let s=this.multiSelectMode,r=[...this.selectedElements],a=[...this.selectedSnapshots];M({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.multiSelectMode=!1,this.mode="activity",this.activityEvents=[],this.currentStatus="pending",this.renderPanel();let l=await N({interactionId:this.interactionId,userNote:e.trim(),autoCommit:this.autoCommitEnabled,snapshots:i});l.success||(this.currentStatus="failed",this.history=k(this.history,this.interactionId,"failed"),m(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:l.error||"Failed to connect to bridge",timestamp:Date.now()}),s&&r.length>1&&(this.multiSelectMode=!0,this.selectedElements=r,this.selectedSnapshots=a,this.mode="input",this.multiSelectHighlights=w({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none")),this.renderPanel())}async submitFollowUp(e){if(!e.trim()||this.submittedSnapshots.length===0)return;this.interactionId=z(),this._userNote=e.trim();let i=this.submittedSnapshots,o=R(this.interactionId,e,i);this.history=F(this.history,o),m(this.history),this.renderHub(),this.activityEvents=[],this.currentStatus="pending",this.renderPanel();let s=await N({interactionId:this.interactionId,userNote:e.trim(),autoCommit:this.autoCommitEnabled,snapshots:i});s.success||(this.currentStatus="failed",this.history=k(this.history,this.interactionId,"failed"),m(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:s.error||"Failed to connect to bridge",timestamp:Date.now()}),this.renderPanel())}async handleSubmitAnswer(e,i,o){this.interactionId&&await W(this.interactionId,e,i,o)}async handleUndoRequest(e){let i=this.history.findIndex(s=>s.interactionId===e);if(i===-1)return;this.history[i].status="pending",m(this.history),this.renderHub(),(await J(e)).success?this.history=mt(this.history,e):this.history[i].status="failed",m(this.history),this.renderHub()}async handleUndoFromPanel(){this.interactionId&&await this.handleUndoRequest(this.interactionId)}async handleCommitRequest(){if(!this.interactionId)return;let e=this.history.findIndex(o=>o.interactionId===this.interactionId);(await V(this.interactionId)).success&&(e>=0&&(this.history[e].status="success",m(this.history),this.renderHub()),this.unfreeze())}};customElements.get("eyeglass-inspector")||customElements.define("eyeglass-inspector",H);function kt(){if(document.querySelector("eyeglass-inspector")){console.warn("[eyeglass] Inspector already initialized");return}let t=document.createElement("eyeglass-inspector");document.body.appendChild(t),console.log("[eyeglass] Inspector initialized. Hover over elements and click to annotate.")}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",kt):kt());export{H as EyeglassInspector,S as captureSnapshot,T as extractFrameworkInfo,kt as initInspector};

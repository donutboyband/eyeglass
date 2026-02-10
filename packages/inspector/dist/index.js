var R=new Set([0,1,11,14,15]);function F(s){let t=Object.keys(s).find(e=>e.startsWith("__reactFiber$")||e.startsWith("__reactInternalInstance$"));return t?s[t]:null}function H(s){if(!R.has(s.tag)||typeof s.type!="function")return!1;let a=s.type.displayName||s.type.name||"";return!(!a||a.startsWith("Context")||a.endsWith("Provider")||a==="StrictMode")}function T(s){return s.type.displayName||s.type.name||void 0}function j(s){let a=s;for(;a;){if(H(a))return a;a=a.return}return null}function M(s){let a=[],t=s;for(;t;){if(H(t)){let e=T(t);e&&a.push(e)}t=t.return}return a}function C(s){if(!s)return;let a={};for(let[t,e]of Object.entries(s)){if(t==="children")continue;let i=typeof e;(i==="string"||i==="number"||i==="boolean"||e===null)&&(a[t]=e)}return Object.keys(a).length>0?a:void 0}function _(s){let a=s.__vue__;if(a)return{name:"vue",componentName:a.$options?.name||a.$options?._componentTag};let e=Object.keys(s).find(i=>i.startsWith("__vue"));if(e){let i=s[e];if(i){let n=i,o,r;n?.type?.name?o=n.type.name:n?.type?.__name?o=n.type.__name:n?.component?.type?.name?o=n.component.type.name:n?.component?.type?.__name&&(o=n.component.type.__name);let l=n?.props||n?.component?.props;l&&(r=C(l));let d;return n?.type?.__file?d=n.type.__file:n?.component?.type?.__file&&(d=n.component.type.__file),{name:"vue",componentName:o,filePath:d,props:r}}return{name:"vue"}}return null}function O(s){let t=Object.keys(s).find(e=>e.startsWith("__svelte"));if(t){let e=s[t],i;if(e?.constructor?.name&&e.constructor.name!=="Object"&&(i=e.constructor.name),!i&&e?.$$?.ctx){let n=e.$$.ctx;n?.constructor?.name&&n.constructor.name!=="Object"&&(i=n.constructor.name)}return{name:"svelte",componentName:i}}return null}function I(s){let a=F(s);if(a){let i=j(a);if(i){let o=T(i),r=i._debugSource,l=M(i);return{name:"react",componentName:o,filePath:r?.fileName,lineNumber:r?.lineNumber,props:C(i.memoizedProps),ancestry:l.length>0?l:void 0}}let n=M(a);return{name:"react",ancestry:n.length>0?n:void 0}}let t=_(s);if(t)return t;let e=O(s);return e||{name:"vanilla"}}function G(s){let a=s.getAttribute("aria-label"),t=s.getAttribute("aria-describedby"),e=s.getAttribute("aria-disabled"),i=s.getAttribute("aria-expanded"),n=s.getAttribute("aria-checked"),o=s.getAttribute("aria-hidden"),r=null;t&&(r=document.getElementById(t)?.textContent?.trim()||null);let l=e==="true"||s.disabled||s.hasAttribute("disabled");return{label:a||s.getAttribute("title")||null,description:r,disabled:l,expanded:i?i==="true":void 0,checked:n==="true"?!0:n==="false"?!1:n==="mixed"?"mixed":void 0,hidden:o==="true"||s.hidden||!1}}function U(s){let a=s.getBoundingClientRect();return{x:Math.round(a.x),y:Math.round(a.y),width:Math.round(a.width),height:Math.round(a.height),visible:a.width>0&&a.height>0}}function Y(s){let a=getComputedStyle(s);return{display:a.display,position:a.position,flexDirection:a.flexDirection!=="row"?a.flexDirection:void 0,gridTemplate:a.display==="grid"?`${a.gridTemplateColumns} / ${a.gridTemplateRows}`:void 0,padding:a.padding,margin:a.margin,color:a.color,backgroundColor:a.backgroundColor,fontFamily:a.fontFamily,zIndex:a.zIndex}}function W(s){let a=s.getAttribute("role");if(a)return a;let t=s.tagName.toLowerCase();return{a:"link",button:"button",input:s.type||"textbox",select:"combobox",textarea:"textbox",img:"img",nav:"navigation",main:"main",header:"banner",footer:"contentinfo",aside:"complementary",article:"article",section:"region",form:"form",ul:"list",ol:"list",li:"listitem",table:"table",tr:"row",td:"cell",th:"columnheader",dialog:"dialog",h1:"heading",h2:"heading",h3:"heading",h4:"heading",h5:"heading",h6:"heading"}[t]||"generic"}function K(s){let a=s.getAttribute("aria-label");if(a)return a;let t=s.getAttribute("aria-labelledby");if(t){let i=document.getElementById(t);if(i)return i.textContent?.trim()||""}if(s.tagName==="INPUT"||s.tagName==="SELECT"||s.tagName==="TEXTAREA"){let i=s.getAttribute("id");if(i){let n=document.querySelector(`label[for="${i}"]`);if(n)return n.textContent?.trim()||""}}if(s.tagName==="IMG")return s.alt||"";let e=s.textContent?.trim()||"";return e.length>50?e.slice(0,50)+"...":e}function J(s){let a={},t=s.getAttribute("id");t&&(a.id=t);let e=s.getAttribute("class");e?.trim()&&(a.className=e.trim());let i={};for(let n=0;n<s.attributes.length;n++){let o=s.attributes[n];o.name.startsWith("data-")&&(i[o.name]=o.value)}return Object.keys(i).length>0&&(a.dataAttributes=i),a}function x(s){let a=J(s);return{role:W(s),name:K(s),tagName:s.tagName.toLowerCase(),...a,framework:I(s),a11y:G(s),geometry:U(s),styles:Y(s),timestamp:Date.now(),url:window.location.href}}var b="http://localhost:3300",v="eyeglass_session",P="eyeglass_history",$="eyeglass_enabled",L="eyeglass_autocommit",N="eyeglass_theme",Z=1e4,y=["Ruminating...","Percolating...","Divining...","Grokking...","Communing...","Concocting...","Synthesizing...","Distilling...","Incubating...","Forging...","Scrutinizing...","Triangulating...","Unraveling...","Traversing...","Sifting...","Marshaling...","Hydrating...","Harmonizing...","Indexing...","Entangling..."],X='url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xIDEyczQtOCAxMS04IDExIDggMTEgOC00IDgtMTEgOC0xMS04LTExLTh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0iIzYzNjZmMSIvPjwvc3ZnPg==") 8 8, crosshair',Q=`
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
  --accent: #a5b4fc;
  --accent-soft: rgba(165, 180, 252, 0.15);
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
    --accent: #a5b4fc;
    --accent-soft: rgba(165, 180, 252, 0.15);
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
  align-items: center;
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
`,k=class s extends HTMLElement{constructor(){super();this.highlight=null;this.panel=null;this.toast=null;this.hub=null;this.currentElement=null;this.currentSnapshot=null;this.interactionId=null;this.frozen=!1;this.eventSource=null;this.throttleTimeout=null;this.mode="input";this.activityEvents=[];this.currentStatus="idle";this.hubExpanded=!1;this.hubPage="main";this.inspectorEnabled=!0;this.autoCommitEnabled=!0;this.themePreference="auto";this.history=[];this.isDragging=!1;this.dragOffset={x:0,y:0};this.customPanelPosition=null;this.multiSelectMode=!1;this.selectedElements=[];this.selectedSnapshots=[];this.multiSelectHighlights=[];this.submittedSnapshots=[];this.cursorStyleElement=null;this.scrollTimeout=null;this.phraseIndex=0;this.phraseInterval=null;this.handlePanelDrag=t=>{if(!this.isDragging||!this.panel)return;let e=Math.max(0,Math.min(t.clientX-this.dragOffset.x,window.innerWidth-340)),i=Math.max(0,Math.min(t.clientY-this.dragOffset.y,window.innerHeight-100));this.customPanelPosition={x:e,y:i},this.panel.style.left=`${e}px`,this.panel.style.top=`${i}px`};this.handlePanelDragEnd=()=>{this.isDragging=!1,document.removeEventListener("mousemove",this.handlePanelDrag),document.removeEventListener("mouseup",this.handlePanelDragEnd)};this.shadow=this.attachShadow({mode:"closed"})}static{this.MAX_SELECTION=5}connectedCallback(){let t=document.createElement("style");t.textContent=Q,this.shadow.appendChild(t),this.highlight=document.createElement("div"),this.highlight.className="highlight",this.highlight.style.display="none",this.shadow.appendChild(this.highlight),this.handleMouseMove=this.handleMouseMove.bind(this),this.handleClick=this.handleClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handlePanelDragStart=this.handlePanelDragStart.bind(this),this.handleScroll=this.handleScroll.bind(this),document.addEventListener("mousemove",this.handleMouseMove,!0),document.addEventListener("click",this.handleClick,!0),document.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0),this.loadEnabledState(),this.loadAutoCommitState(),this.loadThemeState(),this.applyTheme(),this.loadHistory(),this.renderHub(),this.connectSSE(),this.restoreSession(),this.updateCursor()}saveSession(t){if(!this.interactionId)return;let e={interactionId:this.interactionId,userNote:this._userNote||"",componentName:this.currentSnapshot?.framework.componentName||this.currentSnapshot?.tagName||"element",status:this.currentStatus,message:t,timestamp:Date.now()};try{sessionStorage.setItem(v,JSON.stringify(e))}catch{}}restoreSession(){try{let t=sessionStorage.getItem(v);if(!t)return;let e=JSON.parse(t);if(Date.now()-e.timestamp>Z){sessionStorage.removeItem(v);return}(e.status==="success"||e.status==="failed")&&(this.showResultToast(e),sessionStorage.removeItem(v))}catch{}}showResultToast(t){this.toast=document.createElement("div"),this.toast.className="result-toast";let e=t.status==="success",i=e?"\u2713":"\u2715",n=e?"Done!":"Failed";this.toast.innerHTML=`
      <div class="toast-icon ${t.status}">${i}</div>
      <div class="toast-content">
        <div class="toast-title">${n}</div>
        <div class="toast-message">${this.escapeHtml(t.message||t.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `,this.toast.querySelector(".toast-close").addEventListener("click",()=>this.hideToast()),this.shadow.appendChild(this.toast),setTimeout(()=>this.hideToast(),4e3)}hideToast(){this.toast&&(this.toast.remove(),this.toast=null)}loadEnabledState(){try{let t=localStorage.getItem($);t!==null&&(this.inspectorEnabled=t==="true")}catch{}}saveEnabledState(){try{localStorage.setItem($,String(this.inspectorEnabled))}catch{}}loadAutoCommitState(){try{let t=localStorage.getItem(L);t!==null&&(this.autoCommitEnabled=t==="true")}catch{}}saveAutoCommitState(){try{localStorage.setItem(L,String(this.autoCommitEnabled))}catch{}}loadThemeState(){try{let t=localStorage.getItem(N);(t==="light"||t==="dark"||t==="auto")&&(this.themePreference=t)}catch{}}saveThemeState(){try{localStorage.setItem(N,this.themePreference)}catch{}}applyTheme(){this.setAttribute("data-theme",this.themePreference)}loadHistory(){try{let t=sessionStorage.getItem(P);t&&(this.history=JSON.parse(t))}catch{this.history=[]}}saveHistory(){try{sessionStorage.setItem(P,JSON.stringify(this.history))}catch{}}addToHistory(t){let e=this.history.findIndex(i=>i.interactionId===t.interactionId);e>=0?this.history[e]=t:(this.history.unshift(t),this.history.length>20&&(this.history=this.history.slice(0,20))),this.saveHistory(),this.renderHub()}updateHistoryStatus(t,e){let i=this.history.find(n=>n.interactionId===t);i&&(i.status=e,this.saveHistory(),this.renderHub())}renderHub(){this.hub||(this.hub=document.createElement("div"),this.hub.className="hub",this.shadow.appendChild(this.hub)),this.hubPage==="settings"?this.renderHubSettingsPage():this.renderHubMainPage()}renderHubMainPage(){if(!this.hub)return;let t=this.hubExpanded?"":"collapsed",e=this.inspectorEnabled?"":"disabled",i=this.hubExpanded?"expanded":"",n=this.history.filter(c=>c.status==="pending"||c.status==="fixing").length;this.hub.className=`hub ${t} ${e}`.trim();let o='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',r='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',l='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',d=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
  </svg>`;this.hub.innerHTML=`
      <div class="hub-header">
        <div class="hub-header-left">
          <div class="hub-logo">${d}</div>
          <span class="hub-title">Eyeglass</span>
          ${n>0?`<span class="hub-badge">${n}</span>`:""}
          <button class="hub-toggle ${i}" title="Toggle history">\u25BC</button>
        </div>
        <div class="hub-button-group">
        <button class="hub-settings-btn" title="Settings">${l}</button>
        <button class="hub-disable ${this.inspectorEnabled?"active":""}" title="${this.inspectorEnabled?"Disable":"Enable"} inspector">
          ${this.inspectorEnabled?o:r}
        </button>
        </div>
      </div>
      <div class="hub-content ${i}">
        ${this.history.length>0?`
          <div class="hub-list">
            ${this.history.map(c=>`
              <div class="hub-item" data-id="${c.interactionId}">
                <div class="hub-item-status ${c.status}"></div>
                <div class="hub-item-content">
                  <div class="hub-item-component">${this.escapeHtml(c.componentName)}</div>
                  <div class="hub-item-note">${this.escapeHtml(c.userNote)}</div>
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
    `;let u=this.hub.querySelector(".hub-header"),f=this.hub.querySelector(".hub-disable"),g=this.hub.querySelector(".hub-settings-btn");u.addEventListener("click",c=>{c.target===f||c.target===g||c.target.closest(".hub-settings-btn")||(this.hubExpanded=!this.hubExpanded,this.renderHub())}),g.addEventListener("click",c=>{c.stopPropagation(),this.hubPage="settings",this.hubExpanded=!0,this.renderHub()}),f.addEventListener("click",c=>{c.stopPropagation(),this.inspectorEnabled=!this.inspectorEnabled,this.saveEnabledState(),this.inspectorEnabled||this.unfreeze(),this.updateCursor(),this.renderHub()}),this.hub.querySelectorAll(".hub-item-undo").forEach(c=>{c.addEventListener("click",h=>{h.stopPropagation();let p=h.currentTarget.dataset.id;this.requestUndo(p)})})}renderHubSettingsPage(){if(!this.hub)return;let t=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
  </svg>`;this.hub.className="hub";let e='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',i='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',n='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';this.hub.innerHTML=`
      <div class="hub-header">
        <div class="hub-header-left">
          <div class="hub-logo">${t}</div>
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
                <button class="theme-btn ${this.themePreference==="light"?"active":""}" data-theme="light" title="Light">${e}</button>
                <button class="theme-btn ${this.themePreference==="auto"?"active":""}" data-theme="auto" title="Auto">${n}</button>
                <button class="theme-btn ${this.themePreference==="dark"?"active":""}" data-theme="dark" title="Dark">${i}</button>
              </div>
            </div>
            <div class="hub-setting-row">
              <div class="hub-setting-info">
                <div class="hub-setting-label">Auto-commit</div>
                <div class="hub-setting-desc">Automatically commit changes on success</div>
              </div>
              <button class="toggle-switch ${this.autoCommitEnabled?"active":""}" data-setting="autoCommit"></button>
            </div>
          </div>
        </div>
      </div>
    `,this.hub.querySelector(".hub-back-btn").addEventListener("click",()=>{this.hubPage="main",this.renderHub()}),this.hub.querySelectorAll(".theme-btn").forEach(r=>{r.addEventListener("click",l=>{let d=l.currentTarget.dataset.theme;this.themePreference=d,this.saveThemeState(),this.applyTheme(),this.renderHub()})}),this.hub.querySelectorAll(".toggle-switch").forEach(r=>{r.addEventListener("click",l=>{l.currentTarget.dataset.setting==="autoCommit"&&(this.autoCommitEnabled=!this.autoCommitEnabled,this.saveAutoCommitState(),this.renderHub())})})}async requestUndo(t){let e=this.history.findIndex(i=>i.interactionId===t);if(e!==-1){this.history[e].status="pending",this.saveHistory(),this.renderHub();try{(await fetch(`${b}/undo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:t})})).ok?(this.history.splice(e,1),this.saveHistory(),this.renderHub()):(this.history[e].status="failed",this.saveHistory(),this.renderHub())}catch(i){this.history[e]&&(this.history[e].status="failed",this.saveHistory(),this.renderHub()),console.warn("Undo request failed:",i)}}}async requestCommit(t){let e=this.history.findIndex(i=>i.interactionId===t);try{(await fetch(`${b}/commit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:t})})).ok?(e>=0&&(this.history[e].status="success",this.saveHistory(),this.renderHub()),this.unfreeze()):console.warn("Commit request failed")}catch(i){console.warn("Commit request failed:",i)}}disconnectedCallback(){document.removeEventListener("mousemove",this.handleMouseMove,!0),document.removeEventListener("click",this.handleClick,!0),document.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0),this.eventSource?.close(),this.cursorStyleElement&&(this.cursorStyleElement.remove(),this.cursorStyleElement=null)}connectSSE(){this.eventSource=new EventSource(`${b}/events`),this.eventSource.onmessage=t=>{try{let e=JSON.parse(t.data);e.type==="activity"&&this.handleActivityEvent(e.payload)}catch{}},this.eventSource.onerror=()=>{this.eventSource?.close(),setTimeout(()=>this.connectSSE(),3e3)}}handleActivityEvent(t){t.type==="status"&&this.updateHistoryStatus(t.interactionId,t.status),t.interactionId===this.interactionId&&(this.activityEvents.push(t),t.type==="status"&&(this.currentStatus=t.status,this.saveSession(t.message),t.status==="fixing"?this.startPhraseRotation():this.stopPhraseRotation(),t.status==="failed"&&setTimeout(()=>this.unfreeze(),4e3)),this.renderPanel())}handleMouseMove(t){if(!this.multiSelectMode&&this.frozen||!this.inspectorEnabled)return;if(t.composedPath().includes(this)){this.multiSelectMode||this.hideHighlight();return}if(this.throttleTimeout)return;this.throttleTimeout=window.setTimeout(()=>{this.throttleTimeout=null},16),this.style.pointerEvents="none";let i=document.elementFromPoint(t.clientX,t.clientY);if(this.style.pointerEvents="",!i||i===document.documentElement||i===document.body){this.multiSelectMode||this.hideHighlight();return}this.shadow.contains(i)||(this.currentElement=i,this.showHighlight(i))}handleClick(t){if(!(!this.inspectorEnabled||!this.currentElement||t.composedPath().some(i=>i===this))){if(t.preventDefault(),t.stopPropagation(),this.multiSelectMode){this.toggleInSelection(this.currentElement);return}this.frozen||this.freeze()}}handleKeyDown(t){t.key==="Escape"&&this.unfreeze()}handleScroll(){this.frozen&&(this.disableHighlightTransitions(),this.currentElement&&this.highlight&&!this.multiSelectMode&&this.showHighlight(this.currentElement),this.multiSelectMode&&this.selectedElements.length>0&&this.updateMultiSelectHighlightPositions(),this.scrollTimeout&&window.clearTimeout(this.scrollTimeout),this.scrollTimeout=window.setTimeout(()=>{this.enableHighlightTransitions(),this.scrollTimeout=null},150))}disableHighlightTransitions(){this.highlight&&this.highlight.classList.add("no-transition"),this.multiSelectHighlights.forEach(t=>t.classList.add("no-transition"))}enableHighlightTransitions(){this.highlight&&this.highlight.classList.remove("no-transition"),this.multiSelectHighlights.forEach(t=>t.classList.remove("no-transition"))}updateMultiSelectHighlightPositions(){this.selectedElements.forEach((e,i)=>{let n=this.multiSelectHighlights[i];if(!n)return;let o=e.getBoundingClientRect();n.style.left=`${o.left-3}px`,n.style.top=`${o.top-3}px`,n.style.width=`${o.width+3*2}px`,n.style.height=`${o.height+3*2}px`})}handlePanelDragStart(t){if(t.target.closest("button"))return;this.isDragging=!0;let e=this.panel.getBoundingClientRect();this.dragOffset={x:t.clientX-e.left,y:t.clientY-e.top},document.addEventListener("mousemove",this.handlePanelDrag),document.addEventListener("mouseup",this.handlePanelDragEnd)}showHighlight(t){if(!this.highlight)return;let e=t.getBoundingClientRect(),i=3;this.highlight.style.display="block",this.highlight.style.left=`${e.left-i}px`,this.highlight.style.top=`${e.top-i}px`,this.highlight.style.width=`${e.width+i*2}px`,this.highlight.style.height=`${e.height+i*2}px`}hideHighlight(){this.highlight&&(this.highlight.style.display="none"),this.currentElement=null}freeze(){this.currentElement&&(this.frozen=!0,this.currentSnapshot=x(this.currentElement),this.selectedElements=[this.currentElement],this.selectedSnapshots=[this.currentSnapshot],this.mode="input",this.activityEvents=[],this.currentStatus="idle",this.updateCursor(),this.renderPanel())}enterMultiSelectMode(){!this.frozen||this.multiSelectMode||(this.multiSelectMode=!0,this.renderMultiSelectHighlights(),this.updateCursor(),this.renderPanel())}toggleInSelection(t){if(!this.multiSelectMode)return;let e=this.selectedElements.indexOf(t);if(e>=0)this.removeFromSelection(e);else{if(this.selectedElements.length>=s.MAX_SELECTION)return;let i=x(t);this.selectedElements.push(t),this.selectedSnapshots.push(i)}this.renderMultiSelectHighlights(),this.renderPanel()}removeFromSelection(t){if(!(t<0||t>=this.selectedElements.length)){if(this.selectedElements.length===1){this.exitMultiSelectMode();return}this.selectedElements.splice(t,1),this.selectedSnapshots.splice(t,1),this.renderMultiSelectHighlights(),this.renderPanel()}}exitMultiSelectMode(){this.multiSelectMode=!1,this.selectedElements.length>0&&(this.currentElement=this.selectedElements[0],this.currentSnapshot=this.selectedSnapshots[0]),this.selectedElements=this.currentElement?[this.currentElement]:[],this.selectedSnapshots=this.currentSnapshot?[this.currentSnapshot]:[],this.clearMultiSelectHighlights(),this.currentElement&&this.showHighlight(this.currentElement),this.updateCursor(),this.renderPanel()}renderMultiSelectHighlights(){this.clearMultiSelectHighlights();let t=3;this.selectedElements.forEach((e,i)=>{let n=e.getBoundingClientRect(),o=document.createElement("div");o.className="highlight multi",o.style.display="block",o.style.left=`${n.left-t}px`,o.style.top=`${n.top-t}px`,o.style.width=`${n.width+t*2}px`,o.style.height=`${n.height+t*2}px`;let r=document.createElement("div");r.className="highlight-badge",r.textContent=String(i+1),o.appendChild(r),this.shadow.appendChild(o),this.multiSelectHighlights.push(o)}),this.highlight&&(this.highlight.style.display="none")}clearMultiSelectHighlights(){this.multiSelectHighlights.forEach(t=>t.remove()),this.multiSelectHighlights=[]}unfreeze(){this.frozen=!1,this.currentSnapshot=null,this.interactionId=null,this.mode="input",this.activityEvents=[],this.customPanelPosition=null,this.multiSelectMode=!1,this.selectedElements=[],this.selectedSnapshots=[],this.submittedSnapshots=[],this.clearMultiSelectHighlights(),this.stopPhraseRotation(),this.hidePanel(),this.hideHighlight(),this.updateCursor();try{sessionStorage.removeItem(v)}catch{}}renderPanel(){if(!this.currentSnapshot||!this.currentElement)return;let t=this.currentElement.getBoundingClientRect(),{framework:e}=this.currentSnapshot;if(this.panel||(this.panel=document.createElement("div"),this.panel.className="glass-panel",this.shadow.appendChild(this.panel)),this.customPanelPosition)this.panel.style.left=`${this.customPanelPosition.x}px`,this.panel.style.top=`${this.customPanelPosition.y}px`;else{let o=window.innerHeight-t.bottom,r=this.mode==="activity"?400:200,l=t.bottom+12;o<r&&t.top>r&&(l=t.top-r-12);let d=t.left;d+340>window.innerWidth-20&&(d=window.innerWidth-360),d<20&&(d=20),this.panel.style.left=`${d}px`,this.panel.style.top=`${l}px`}let i=e.componentName||this.currentSnapshot.tagName,n=e.filePath?e.filePath.split("/").slice(-2).join("/"):null;this.mode==="input"?this.renderInputMode(i,n):this.renderActivityMode(i,n)}renderInputMode(t,e){if(!this.panel)return;let i=this.multiSelectMode,n=i?"multi-select-icon active":"multi-select-icon",o=i?`
      <div class="selected-list">
        <div class="selected-list-header">
          <span class="selected-count">${this.selectedElements.length} element${this.selectedElements.length!==1?"s":""} selected</span>
        </div>
        <div class="selected-chips">
          ${this.selectedSnapshots.map((h,p)=>{let m=h.framework.componentName||h.tagName;return`
              <div class="selected-chip" data-index="${p}">
                <span class="selected-chip-number">${p+1}</span>
                <span>${this.escapeHtml(m)}</span>
                <button class="selected-chip-remove" data-index="${p}" title="Remove">&times;</button>
              </div>
            `}).join("")}
        </div>
      </div>
    `:"",r=i?`
      <div class="multi-mode-hint">Click elements to add/remove from selection (max ${s.MAX_SELECTION})</div>
    `:"";this.panel.innerHTML=`
      <div class="panel-header">
        <span class="component-tag">&lt;${this.escapeHtml(t)} /&gt;</span>
        ${e?`<span class="file-path">${this.escapeHtml(e)}</span>`:""}
        <button class="${n}" title="${i?"Exit multi-select":"Select multiple elements"}">+</button>
        <button class="close-btn" title="Cancel (Esc)">&times;</button>
      </div>
      ${r}
      ${o}
      <div class="input-area">
        <input
          type="text"
          class="input-field"
          placeholder="${i?"Describe what to change for these elements...":"What do you want to change?"}"
          autofocus
        />
        <div class="btn-row">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Send</button>
        </div>
      </div>
    `;let l=this.panel.querySelector(".input-field"),d=this.panel.querySelector(".close-btn"),u=this.panel.querySelector(".btn-secondary"),f=this.panel.querySelector(".btn-primary"),g=this.panel.querySelector(".multi-select-icon");d.addEventListener("click",()=>this.unfreeze()),u.addEventListener("click",()=>this.unfreeze()),f.addEventListener("click",()=>this.submit(l.value)),l.addEventListener("keydown",h=>{h.key==="Enter"&&l.value.trim()&&this.submit(l.value)}),g.addEventListener("click",()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode()}),this.panel.querySelectorAll(".selected-chip-remove").forEach(h=>{h.addEventListener("click",p=>{p.stopPropagation();let m=parseInt(p.currentTarget.dataset.index,10);this.removeFromSelection(m)})}),this.panel.querySelector(".panel-header").addEventListener("mousedown",this.handlePanelDragStart),requestAnimationFrame(()=>l.focus())}renderActivityMode(t,e){if(!this.panel)return;let i=this.activityEvents.length>0&&this.panel.querySelector(".user-request-text")?.textContent||"",n=this.currentStatus==="success"||this.currentStatus==="failed",o=this.currentStatus==="success"&&!this.autoCommitEnabled,r=this.currentStatus==="success",l=this.submittedSnapshots.length,d=l>1?`${l} elements`:`&lt;${this.escapeHtml(t)} /&gt;`;this.panel.innerHTML=`
      <div class="panel-header">
        <span class="component-tag">${d}</span>
        ${l<=1&&e?`<span class="file-path">${this.escapeHtml(e)}</span>`:""}
        <button class="close-btn" title="Close">&times;</button>
      </div>
      <div class="user-request">
        <div class="user-request-label">Your request</div>
        <div class="user-request-text">${this.escapeHtml(this.getUserNote())}</div>
      </div>
      <div class="activity-feed">
        ${this.renderActivityFeed()}
      </div>
      <div class="panel-footer ${n?"done":""}">
        <div class="status-indicator ${this.currentStatus}"></div>
        <span class="status-text">${this.getStatusText()}</span>
        ${o?`
          <div class="success-actions">
            <button class="action-btn action-btn-undo" title="Discard changes">Undo</button>
            <button class="action-btn action-btn-commit" title="Commit changes">Commit</button>
          </div>
        `:""}
      </div>
      ${r?`
        <div class="followup-area">
          <div class="followup-row">
            <input type="text" class="followup-input" placeholder="Anything else?" />
            <button class="followup-send">Send</button>
            <button class="followup-done">\u2715</button>
          </div>
        </div>
      `:""}
    `,this.panel.querySelector(".close-btn").addEventListener("click",()=>this.unfreeze()),this.panel.querySelector(".panel-header").addEventListener("mousedown",this.handlePanelDragStart),this.panel.querySelectorAll(".question-option").forEach(S=>{S.addEventListener("click",q=>{let E=q.target,A=E.dataset.questionId,D=E.dataset.answerId,B=E.textContent;this.submitAnswer(A,D,B)})});let g=this.panel.querySelector(".action-btn-commit"),c=this.panel.querySelector(".action-btn-undo");g&&this.interactionId&&g.addEventListener("click",()=>this.requestCommit(this.interactionId)),c&&this.interactionId&&c.addEventListener("click",()=>this.requestUndo(this.interactionId));let h=this.panel.querySelector(".followup-input"),p=this.panel.querySelector(".followup-send"),m=this.panel.querySelector(".followup-done");h&&p&&(p.addEventListener("click",()=>{h.value.trim()&&this.submitFollowUp(h.value)}),h.addEventListener("keydown",S=>{S.key==="Enter"&&h.value.trim()&&this.submitFollowUp(h.value)}),requestAnimationFrame(()=>h.focus())),m&&m.addEventListener("click",()=>this.unfreeze());let w=this.panel.querySelector(".activity-feed");w&&(w.scrollTop=w.scrollHeight)}renderActivityFeed(){let t=this.activityEvents.map(e=>{switch(e.type){case"status":return e.status==="pending"||e.status==="fixing"&&(!e.message||e.message==="Agent is working...")?"":this.renderStatusItem(e);case"thought":return this.renderThoughtItem(e);case"action":return this.renderActionItem(e);case"question":return this.renderQuestionItem(e);default:return""}}).filter(Boolean);return t.length===0&&(this.currentStatus==="pending"||this.currentStatus==="fixing")?`
        <div class="skeleton-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-line"></div>
        </div>
      `:t.join("")}renderStatusItem(t){let e=t.status==="success"?"success":t.status==="failed"?"error":"status",i=t.status==="success"?"\u2713":t.status==="failed"?"\u2715":"\u25CF";return`
      <div class="activity-item">
        <div class="activity-icon ${e}">${i}</div>
        <div class="activity-content">
          <div class="activity-text">${this.escapeHtml(t.message||t.status)}</div>
        </div>
      </div>
    `}renderThoughtItem(t){return`
      <div class="activity-item">
        <div class="activity-icon thought">\u{1F4AD}</div>
        <div class="activity-content">
          <div class="activity-text muted">${this.escapeHtml(t.content)}</div>
        </div>
      </div>
    `}renderActionItem(t){let e={reading:"\u{1F4D6}",writing:"\u270F\uFE0F",searching:"\u{1F50D}",thinking:"\u{1F9E0}"},i={reading:"Reading",writing:"Writing",searching:"Searching",thinking:"Thinking about"};return`
      <div class="activity-item">
        <div class="activity-icon action">${e[t.action]||"\u25CF"}</div>
        <div class="activity-content">
          <div class="activity-text">${i[t.action]||t.action}${t.complete?" \u2713":"..."}</div>
          <div class="activity-target">${this.escapeHtml(t.target)}</div>
        </div>
      </div>
    `}renderQuestionItem(t){return this.activityEvents.some(i=>i.type==="status"&&i.timestamp>t.timestamp)?`
        <div class="activity-item">
          <div class="activity-icon question">?</div>
          <div class="activity-content">
            <div class="activity-text muted">${this.escapeHtml(t.question)}</div>
          </div>
        </div>
      `:`
      <div class="question-box">
        <div class="question-text">${this.escapeHtml(t.question)}</div>
        <div class="question-options">
          ${t.options.map(i=>`
            <button
              class="question-option"
              data-question-id="${t.questionId}"
              data-answer-id="${i.id}"
            >${this.escapeHtml(i.label)}</button>
          `).join("")}
        </div>
      </div>
    `}getUserNote(){let t=this.activityEvents.find(e=>e.type==="status");return this._userNote||""}getStatusText(){switch(this.currentStatus){case"idle":return"Ready";case"pending":return"Waiting for agent...";case"fixing":return y[this.phraseIndex%y.length];case"success":return"Done!";case"failed":return"Failed";default:return this.currentStatus}}startPhraseRotation(){this.phraseInterval||(this.phraseIndex=Math.floor(Math.random()*y.length),this.phraseInterval=window.setInterval(()=>{this.phraseIndex=(this.phraseIndex+1)%y.length,this.updateFooterText()},1e4))}stopPhraseRotation(){this.phraseInterval&&(window.clearInterval(this.phraseInterval),this.phraseInterval=null)}updateFooterText(){if(!this.panel)return;let t=this.panel.querySelector(".status-text");t&&(t.textContent=this.getStatusText())}hidePanel(){this.panel&&(this.panel.remove(),this.panel=null)}async submit(t){if(!t.trim()||this.selectedSnapshots.length===0&&!this.currentSnapshot)return;this.interactionId=`eyeglass-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,this._userNote=t.trim();let e=this.selectedSnapshots.length>0?this.selectedSnapshots:this.currentSnapshot?[this.currentSnapshot]:[];this.submittedSnapshots=[...e];let i={interactionId:this.interactionId,userNote:t.trim(),autoCommit:this.autoCommitEnabled,...e.length===1?{snapshot:e[0]}:{snapshots:e}},n=e.map(u=>u.framework.componentName||u.tagName),o=e.length===1?n[0]:`${n.length} elements`;this.addToHistory({interactionId:this.interactionId,userNote:t.trim(),componentName:o,filePath:e[0]?.framework.filePath,status:"pending",timestamp:Date.now()});let r=this.multiSelectMode,l=[...this.selectedElements],d=[...this.selectedSnapshots];this.clearMultiSelectHighlights(),this.multiSelectMode=!1,this.mode="activity",this.activityEvents=[],this.currentStatus="pending",this.renderPanel();try{let u=await fetch(`${b}/focus`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!u.ok)throw new Error(`HTTP ${u.status}`)}catch{this.currentStatus="failed",this.updateHistoryStatus(this.interactionId,"failed"),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:"Failed to connect to bridge",timestamp:Date.now()}),r&&l.length>1&&(this.multiSelectMode=!0,this.selectedElements=l,this.selectedSnapshots=d,this.mode="input",this.renderMultiSelectHighlights()),this.renderPanel()}}async submitFollowUp(t){if(!t.trim()||this.submittedSnapshots.length===0)return;this.interactionId=`eyeglass-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,this._userNote=t.trim();let e=this.submittedSnapshots,i={interactionId:this.interactionId,userNote:t.trim(),autoCommit:this.autoCommitEnabled,...e.length===1?{snapshot:e[0]}:{snapshots:e}},n=e.map(r=>r.framework.componentName||r.tagName),o=e.length===1?n[0]:`${n.length} elements`;this.addToHistory({interactionId:this.interactionId,userNote:t.trim(),componentName:o,filePath:e[0]?.framework.filePath,status:"pending",timestamp:Date.now()}),this.activityEvents=[],this.currentStatus="pending",this.renderPanel();try{let r=await fetch(`${b}/focus`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!r.ok)throw new Error(`HTTP ${r.status}`)}catch{this.currentStatus="failed",this.updateHistoryStatus(this.interactionId,"failed"),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:"Failed to connect to bridge",timestamp:Date.now()}),this.renderPanel()}}async submitAnswer(t,e,i){if(!this.interactionId)return;let n={interactionId:this.interactionId,questionId:t,answerId:e,answerLabel:i};try{await fetch(`${b}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})}catch{}}escapeHtml(t){let e=document.createElement("div");return e.textContent=t,e.innerHTML}updateCursor(){this.inspectorEnabled&&(!this.frozen||this.multiSelectMode)?(this.cursorStyleElement||(this.cursorStyleElement=document.createElement("style"),this.cursorStyleElement.id="eyeglass-cursor-style",document.head.appendChild(this.cursorStyleElement)),this.cursorStyleElement.textContent=`
        html, body, body * {
          cursor: ${X} !important;
        }
      `):this.cursorStyleElement&&(this.cursorStyleElement.textContent="")}};customElements.get("eyeglass-inspector")||customElements.define("eyeglass-inspector",k);function z(){if(document.querySelector("eyeglass-inspector")){console.warn("[eyeglass] Inspector already initialized");return}let s=document.createElement("eyeglass-inspector");document.body.appendChild(s),console.log("[eyeglass] Inspector initialized. Hover over elements and click to annotate.")}typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z());export{k as EyeglassInspector,x as captureSnapshot,I as extractFrameworkInfo,z as initInspector};

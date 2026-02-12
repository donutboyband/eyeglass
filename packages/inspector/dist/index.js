var nt=new Set([0,1,11,14,15]);function ee(e){let n=Object.keys(e).find(i=>i.startsWith("__reactFiber$")||i.startsWith("__reactInternalInstance$"));return n?e[n]:null}function te(e){if(!nt.has(e.tag)||typeof e.type!="function")return!1;let t=e.type.displayName||e.type.name||"";return!(!t||t==="StrictMode"||t==="Suspense"||t==="Fragment")}function ne(e){return e.type?.displayName||e.type?.name||void 0}function ie(e){let t=e;for(;t;){if(te(t))return t;t=t.return}return null}function Z(e){let t=[],n=e;for(;n;){if(te(n)){let i=ne(n);i&&t.push(i)}n=n.return}return t}function it(e){if(!e)return{};let t={};for(let[n,i]of Object.entries(e)){if(n==="children")continue;let o=typeof i;(o==="string"||o==="number"||o==="boolean"||i===null||Array.isArray(i)&&i.every(s=>typeof s=="string"||typeof s=="number"))&&(t[n]=i)}return t}function v(e,t=0){if(t>2)return"[nested]";if(e==null)return e;let n=typeof e;if(n==="string"||n==="number"||n==="boolean")return e;if(n==="function")return"[function]";if(Array.isArray(e))return e.length>5?`[Array(${e.length})]`:e.map(i=>v(i,t+1));if(n==="object"){if(e.$$typeof)return"[React Element]";if(e instanceof Element||e instanceof Node)return"[DOM Node]";let i=Object.keys(e);if(i.length>10)return`[Object(${i.length} keys)]`;let o={};for(let s of i)o[s]=v(e[s],t+1);return o}return String(e)}function ot(e){if(e&&typeof e=="object"&&"baseState"in e&&"queue"in e)return e.queue?.lastRenderedReducer?.name==="basicStateReducer"?"useState":"useReducer";if(e&&typeof e=="object"&&"current"in e){let t=Object.keys(e);if(t.length===1&&t[0]==="current")return"useRef"}if(Array.isArray(e)&&e.length===2&&Array.isArray(e[1]))return typeof e[0]=="function"?"useCallback":"useMemo";if(e&&typeof e=="object"&&"tag"in e&&"create"in e){if(e.tag&4)return"useEffect";if(e.tag&2)return"useLayoutEffect"}return"unknown"}function st(e,t){switch(t){case"useState":case"useReducer":return v(e.baseState);case"useRef":return v(e.current);case"useMemo":return v(e[0]);case"useCallback":return"[callback]";case"useEffect":case"useLayoutEffect":return;default:return v(e)}}function rt(e){let t=[];if(e.tag!==0&&e.tag!==11&&e.tag!==14&&e.tag!==15)return t;let n=e.memoizedState,i=0;for(;n!=null;){let o=n.memoizedState!==void 0?n.memoizedState:n,s=ot(o);if(s!=="unknown"&&t.push({name:s,value:st(o,s),label:`hook_${i}`}),n=n.next,i++,i>100)break}return t}function at(e){return e.tag===10}function lt(e){let t=e.type?._context||e.type;return t?.displayName||t?.Provider?.displayName||"Context"}function ct(e){let t=[],n=new Set,i=e.return;for(;i;){if(at(i)){let o=i.type?._context;o&&!n.has(o)&&(n.add(o),t.push({name:lt(i),value:v(i.memoizedProps?.value)}))}i=i.return}return t}function dt(e,t){if(!e||!t)return[];let n=[],i=new Set([...Object.keys(e),...Object.keys(t)]);for(let o of i){if(o==="children")continue;let s=e[o],r=t[o];s!==r&&n.push(o)}return n}function ut(e){let t=e.alternate;if(!t)return{renderCount:1,lastRenderReason:"Initial render"};let n={renderCount:2},i=dt(t.memoizedProps,e.memoizedProps);if(i.length>0){if(n.changedProps=i,i.includes("style")){let o=t.memoizedProps?.style,s=e.memoizedProps?.style;if(o&&s&&JSON.stringify(o)===JSON.stringify(s))return n.lastRenderReason="Prop 'style' changed identity (same value, new object)",n}return n.lastRenderReason=`Props changed: ${i.join(", ")}`,n}return e.memoizedState!==t.memoizedState?(n.lastRenderReason="State changed (hook update)",n):(n.lastRenderReason="Parent re-rendered",n)}function R(e){let t=ee(e);if(!t)return{type:"vanilla",name:"vanilla"};let n=ie(t);if(n){let o=ne(n),s=n._debugSource,r=Z(n),a=it(n.memoizedProps),l=rt(n),c=ct(n);return{type:"react",displayName:o,key:n.key,filePath:s?.fileName,lineNumber:s?.lineNumber,ancestry:r.length>0?r:void 0,state:{props:a,hooks:l,context:c},name:"react",componentName:o,props:a}}let i=Z(t);return{type:"react",name:"react",ancestry:i.length>0?i:void 0}}function oe(e){let t=ee(e);if(!t)return null;let n=ie(t);return n?ut(n):null}var le={"gray-50":["rgb(249, 250, 251)","#f9fafb"],"gray-100":["rgb(243, 244, 246)","#f3f4f6"],"gray-200":["rgb(229, 231, 235)","#e5e7eb"],"gray-300":["rgb(209, 213, 219)","#d1d5db"],"gray-400":["rgb(156, 163, 175)","#9ca3af"],"gray-500":["rgb(107, 114, 128)","#6b7280"],"gray-600":["rgb(75, 85, 99)","#4b5563"],"gray-700":["rgb(55, 65, 81)","#374151"],"gray-800":["rgb(31, 41, 55)","#1f2937"],"gray-900":["rgb(17, 24, 39)","#111827"],"red-500":["rgb(239, 68, 68)","#ef4444"],"red-600":["rgb(220, 38, 38)","#dc2626"],"orange-500":["rgb(249, 115, 22)","#f97316"],"amber-500":["rgb(245, 158, 11)","#f59e0b"],"yellow-500":["rgb(234, 179, 8)","#eab308"],"green-500":["rgb(34, 197, 94)","#22c55e"],"green-600":["rgb(22, 163, 74)","#16a34a"],"emerald-500":["rgb(16, 185, 129)","#10b981"],"teal-500":["rgb(20, 184, 166)","#14b8a6"],"cyan-500":["rgb(6, 182, 212)","#06b6d4"],"sky-500":["rgb(14, 165, 233)","#0ea5e9"],"blue-500":["rgb(59, 130, 246)","#3b82f6"],"blue-600":["rgb(37, 99, 235)","#2563eb"],"indigo-500":["rgb(99, 102, 241)","#6366f1"],"indigo-600":["rgb(79, 70, 229)","#4f46e5"],"violet-500":["rgb(139, 92, 246)","#8b5cf6"],"purple-500":["rgb(168, 85, 247)","#a855f7"],"fuchsia-500":["rgb(217, 70, 239)","#d946ef"],"pink-500":["rgb(236, 72, 153)","#ec4899"],"rose-500":["rgb(244, 63, 94)","#f43f5e"],white:["rgb(255, 255, 255)","#ffffff","#fff"],black:["rgb(0, 0, 0)","#000000","#000"],transparent:["rgba(0, 0, 0, 0)","transparent"]},ht={0:[0],1:[4],2:[8],3:[12],4:[16],5:[20],6:[24],8:[32],10:[40],12:[48],16:[64],20:[80],24:[96]};function se(e){return e.toLowerCase().replace(/\s+/g,"")}function re(e){let t=se(e);for(let[n,i]of Object.entries(le))if(i.some(o=>se(o)===t))return n;return null}function pt(e){let t=e.match(/^(\d+(?:\.\d+)?)(px)?$/);return t?parseFloat(t[1]):null}function gt(e){let t=pt(e);if(t===null)return null;for(let[n,i]of Object.entries(ht))if(i.includes(t))return`spacing-${n}`;return null}function ae(e){let t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!t)return null;let n=parseInt(t[1]),i=parseInt(t[2]),o=parseInt(t[3]),s=null,r=1/0;for(let[a,l]of Object.entries(le))for(let c of l){let d=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(d){let h=parseInt(d[1]),p=parseInt(d[2]),u=parseInt(d[3]),m=Math.sqrt(Math.pow(n-h,2)+Math.pow(i-p,2)+Math.pow(o-u,2));m<r&&m<50&&(r=m,s=a)}}return s}function mt(e){let t=[],n=[],i=re(e.color);if(i)t.push({property:"color",token:i});else if(e.color&&e.color!=="transparent"){let r=ae(e.color);r&&n.push({property:"color",value:e.color,suggestion:`Consider using ${r}`})}let o=re(e.backgroundColor);if(o)t.push({property:"backgroundColor",token:o});else if(e.backgroundColor&&e.backgroundColor!=="transparent"&&e.backgroundColor!=="rgba(0, 0, 0, 0)"){let r=ae(e.backgroundColor);r&&n.push({property:"backgroundColor",value:e.backgroundColor,suggestion:`Consider using ${r}`})}let s=e.padding.split(" ");for(let r of s){let a=gt(r);if(a){t.push({property:"padding",token:a});break}}return{tokenMatches:t,deviations:n}}function ft(e){if(!e)return"Local";let t=e.toLowerCase();return t.includes("/shared/")||t.includes("/common/")||t.includes("/core/")||t.includes("/ui/")||t.includes("/components/ui/")?"Critical":t.includes("/lib/")||t.includes("/primitives/")||t.includes("/atoms/")?"Moderate":"Local"}function ce(e,t){let{tokenMatches:n,deviations:i}=mt(t);return{impact:{riskLevel:ft(e)},designSystem:{tokenMatches:n,deviations:i}}}function bt(e){let t=e.getAttribute("aria-label"),n=e.getAttribute("aria-describedby"),i=e.getAttribute("aria-disabled"),o=e.getAttribute("aria-expanded"),s=e.getAttribute("aria-checked"),r=e.getAttribute("aria-hidden"),a=null;n&&(a=document.getElementById(n)?.textContent?.trim()||null);let l=i==="true"||e.disabled||e.hasAttribute("disabled");return{label:t||e.getAttribute("title")||null,description:a,disabled:l,expanded:o?o==="true":void 0,checked:s==="true"?!0:s==="false"?!1:s==="mixed"?"mixed":void 0,hidden:r==="true"||e.hidden||!1}}function vt(e){let t=e.getBoundingClientRect();return{x:Math.round(t.x),y:Math.round(t.y),width:Math.round(t.width),height:Math.round(t.height),visible:t.width>0&&t.height>0}}function xt(e){let t=getComputedStyle(e);return{display:t.display,position:t.position,flexDirection:t.flexDirection!=="row"?t.flexDirection:void 0,gridTemplate:t.display==="grid"?`${t.gridTemplateColumns} / ${t.gridTemplateRows}`:void 0,padding:t.padding,margin:t.margin,color:t.color,backgroundColor:t.backgroundColor,fontFamily:t.fontFamily,zIndex:t.zIndex}}function yt(e){let t=e.getAttribute("role");if(t)return t;let n=e.tagName.toLowerCase();return{a:"link",button:"button",input:e.type||"textbox",select:"combobox",textarea:"textbox",img:"img",nav:"navigation",main:"main",header:"banner",footer:"contentinfo",aside:"complementary",article:"article",section:"region",form:"form",ul:"list",ol:"list",li:"listitem",table:"table",tr:"row",td:"cell",th:"columnheader",dialog:"dialog",h1:"heading",h2:"heading",h3:"heading",h4:"heading",h5:"heading",h6:"heading"}[n]||"generic"}function St(e){let t=e.getAttribute("aria-label");if(t)return t;let n=e.getAttribute("aria-labelledby");if(n){let o=document.getElementById(n);if(o)return o.textContent?.trim()||""}if(e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"){let o=e.getAttribute("id");if(o){let s=document.querySelector(`label[for="${o}"]`);if(s)return s.textContent?.trim()||""}}if(e.tagName==="IMG")return e.alt||"";let i=e.textContent?.trim()||"";return i.length>50?i.slice(0,50)+"...":i}function wt(e){let t={},n=e.getAttribute("id");n&&(t.id=n);let i=e.getAttribute("class");i?.trim()&&(t.className=i.trim());let o={};for(let s=0;s<e.attributes.length;s++){let r=e.attributes[s];r.name.startsWith("data-")&&(o[r.name]=r.value)}return Object.keys(o).length>0&&(t.dataAttributes=o),t}function Et(e){let t=getComputedStyle(e),n={display:t.display,position:t.position};return t.display.includes("flex")&&(t.flexDirection!=="row"&&(n.flexDirection=t.flexDirection),t.alignItems!=="normal"&&(n.alignItems=t.alignItems),t.justifyContent!=="normal"&&(n.justifyContent=t.justifyContent),t.gap!=="normal"&&t.gap!=="0px"&&(n.gap=t.gap)),t.display.includes("grid")&&(n.gridTemplate=`${t.gridTemplateColumns} / ${t.gridTemplateRows}`),n}function kt(e){let t=[],n=[],i=e.parentElement,o=0;for(;i&&o<2&&i!==document.body&&i!==document.documentElement;){let r=i.getAttribute("class")?.trim();t.push({tagName:i.tagName.toLowerCase(),...r&&{className:r},styles:Et(i)}),i=i.parentElement,o++}let s=new Map;for(let r of Array.from(e.children)){let a=r.tagName.toLowerCase(),l=r.getAttribute("class")?.trim(),c=`${a}:${l||""}`;s.has(c)?s.get(c).count++:s.set(c,{className:l||void 0,count:1})}for(let[r,a]of s){let l=r.split(":")[0];n.push({tagName:l,...a.className&&{className:a.className},...a.count>1&&{count:a.count}})}return{parents:t,children:n}}function k(e){let t=e.tagName.toLowerCase(),n=e.id?`#${e.id}`:"",i=e.className&&typeof e.className=="string"?"."+e.className.split(/\s+/).filter(Boolean).slice(0,2).join("."):"";return`${t}${n}${i}`}function H(e){let t=[];if(typeof window.getEventListeners=="function")try{let s=window.getEventListeners(e);for(let r of Object.keys(s))for(let a of s[r])t.push({type:r,capture:a.capture||!1,source:a.listener?.toString?.()?.slice(0,50)});return t}catch{}let n=["onclick","onmousedown","onmouseup","onmouseover","onmouseout","onfocus","onblur","onkeydown","onkeyup","onkeypress","onchange","oninput","onsubmit","ontouchstart","ontouchend"];for(let s of n)(e.hasAttribute(s)||e[s])&&t.push({type:s.slice(2),capture:!1});let o=Object.keys(e).find(s=>s.startsWith("__reactProps$"));if(o){let s=e[o];if(s){for(let r of Object.keys(s))if(r.startsWith("on")&&typeof s[r]=="function"){let a=r.slice(2).toLowerCase();t.some(l=>l.type===a)||t.push({type:a,capture:!1,source:"React synthetic event"})}}}return t}function Ct(e){let t=[];getComputedStyle(e).pointerEvents==="none"&&t.push({element:k(e),event:"all",reason:"pointer-events:none"});let i=e.parentElement;for(;i&&i!==document.body;){getComputedStyle(i).pointerEvents==="none"&&t.push({element:k(i),event:"all",reason:"pointer-events:none"});let s=H(i);for(let r of s)r.capture&&t.push({element:k(i),event:r.type,reason:"captured"});i=i.parentElement}return t}function Mt(e){let t=getComputedStyle(e),n=[{check:t.position==="fixed"||t.position==="sticky",reason:"position:fixed/sticky"},{check:(t.position==="absolute"||t.position==="relative")&&t.zIndex!=="auto",reason:"positioned with z-index"},{check:parseFloat(t.opacity)<1,reason:"opacity"},{check:t.transform!=="none",reason:"transform"},{check:t.filter!=="none",reason:"filter"},{check:t.perspective!=="none",reason:"perspective"},{check:t.clipPath!=="none",reason:"clip-path"},{check:t.mask!=="none"&&t.mask!=="",reason:"mask"},{check:t.isolation==="isolate",reason:"isolation:isolate"},{check:t.mixBlendMode!=="normal",reason:"mix-blend-mode"},{check:t.willChange.includes("transform")||t.willChange.includes("opacity"),reason:"will-change"},{check:t.contain==="layout"||t.contain==="paint"||t.contain==="strict"||t.contain==="content",reason:"contain"}],i=n.some(l=>l.check),o=n.find(l=>l.check)?.reason,s=null,r=t.zIndex==="auto"?0:parseInt(t.zIndex,10)||0,a=e.parentElement;for(;a&&a!==document.body;){let l=getComputedStyle(a);if([l.position==="fixed"||l.position==="sticky",(l.position==="absolute"||l.position==="relative")&&l.zIndex!=="auto",parseFloat(l.opacity)<1,l.transform!=="none"].some(Boolean)){s=k(a);break}a=a.parentElement}return{isStackingContext:i,parentContext:s,reason:o,effectiveZIndex:r}}function Ht(e){let t=[],n=getComputedStyle(e),i=e.parentElement;if(i){let o=getComputedStyle(i);o.display.includes("flex")&&(n.flexGrow!=="0"&&t.push(`Flex grow: ${n.flexGrow}`),n.flexShrink!=="1"&&t.push(`Flex shrink: ${n.flexShrink}`),n.flexBasis!=="auto"&&t.push(`Flex basis: ${n.flexBasis}`),n.alignSelf!=="auto"&&t.push(`Align self: ${n.alignSelf}`)),o.display.includes("grid")&&(n.gridColumn!=="auto"&&t.push(`Grid column: ${n.gridColumn}`),n.gridRow!=="auto"&&t.push(`Grid row: ${n.gridRow}`))}return n.maxWidth!=="none"&&t.push(`Max width: ${n.maxWidth}`),n.minWidth!=="0px"&&n.minWidth!=="auto"&&t.push(`Min width: ${n.minWidth}`),n.maxHeight!=="none"&&t.push(`Max height: ${n.maxHeight}`),n.overflow!=="visible"&&t.push(`Overflow: ${n.overflow}`),t}function It(e){return{events:{listeners:H(e),blockingHandlers:Ct(e)},stackingContext:Mt(e),layoutConstraints:Ht(e)}}function z(e){let t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);return t?{r:parseInt(t[1],10),g:parseInt(t[2],10),b:parseInt(t[3],10),a:t[4]?parseFloat(t[4]):1}:e==="transparent"||e==="rgba(0, 0, 0, 0)"?{r:0,g:0,b:0,a:0}:null}function de(e,t,n){let[i,o,s]=[e,t,n].map(r=>(r=r/255,r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4)));return .2126*i+.7152*o+.0722*s}function Tt(e,t){let n=de(e.r,e.g,e.b),i=de(t.r,t.g,t.b),o=Math.max(n,i),s=Math.min(n,i);return(o+.05)/(s+.05)}function Lt(e){let t=e,n="rgb(255, 255, 255)";for(;t&&t!==document.documentElement;){let o=getComputedStyle(t).backgroundColor,s=z(o);if(s&&s.a>0&&(n=o,s.a===1))break;t=t.parentElement}return n}function Pt(e){let t=getComputedStyle(e),n=z(t.color),i=Lt(e),o=z(i),s=1;n&&o&&(s=Tt(n,o));let r=parseFloat(t.fontSize),a=parseInt(t.fontWeight,10)||400,c=r>=18||r>=14&&a>=700?3:4.5;return{contrastRatio:Math.round(s*100)/100,wcagStatus:s>=c?"pass":"fail",effectiveBgColor:i}}function $t(e){let t=e.getBoundingClientRect();if(t.width===0||t.height===0)return{isOccluded:!1,effectiveOpacity:0};let n=1,i=e;for(;i&&i!==document.documentElement;){let c=getComputedStyle(i);n*=parseFloat(c.opacity),i=i.parentElement}let o=t.left+t.width/2,s=t.top+t.height/2,r=document.elementFromPoint(o,s),a=!1,l;return r&&r!==e&&!e.contains(r)&&(r.contains(e)||(a=!0,l=k(r))),{isOccluded:a,occludedBy:l,effectiveOpacity:Math.round(n*100)/100}}function At(e){let t=getComputedStyle(e),n=e.tagName.toLowerCase(),i=t.cursor==="pointer"||t.textDecoration.includes("underline")||n==="a"||n==="button"||t.color.includes("0, 0, 255")||t.color.includes("0, 102, 204")||e.getAttribute("role")==="button"||e.getAttribute("role")==="link",s=H(e).length>0,r=["a","button","input","select","textarea","label"].includes(n),a=e.hasAttribute("tabindex")&&e.getAttribute("tabindex")!=="-1",l=s||r||a,c=0;return i&&!l?c=.7:!i&&l&&(c=.3),{looksInteractable:i,isInteractable:l,dissonanceScore:c}}function Nt(e){let t=e.getBoundingClientRect(),n=Math.round(t.width),i=Math.round(t.height),o=n>=44&&i>=44;return{touchTargetSize:`${n}x${i}`,isTouchTargetValid:o}}function Dt(e){return{affordance:At(e),visibility:$t(e),legibility:Pt(e),usability:Nt(e)}}function Rt(e){let t=getComputedStyle(e),n=H(e),i=t.transform!=="none"||t.willChange.includes("transform")||t.willChange.includes("opacity"),o="none";t.position==="absolute"||t.position==="fixed"?o="none":t.display==="inline"?o="low":n.some(r=>["scroll","resize","mousemove"].includes(r.type))&&(o="high");let s=oe(e);return{pipeline:{layerPromoted:i,layoutThrashingRisk:o},performance:{renderCount:s?.renderCount||0,lastRenderReason:s?.lastRenderReason},memory:{listenerCount:n.length}}}function y(e){let t=wt(e),n=R(e),i=xt(e);return{role:yt(e),name:St(e),tagName:e.tagName.toLowerCase(),...t,framework:n,a11y:bt(e),geometry:vt(e),styles:i,causality:It(e),perception:Dt(e),metal:Rt(e),systemic:ce(n.filePath,i),neighborhood:kt(e),timestamp:Date.now(),url:window.location.href}}var S="http://localhost:3300",C="eyeglass_session",O="eyeglass_history",q="eyeglass_enabled",F="eyeglass_autocommit",B="eyeglass_theme";var w=["Ruminating...","Percolating...","Divining...","Grokking...","Communing...","Concocting...","Synthesizing...","Distilling...","Incubating...","Forging...","Scrutinizing...","Triangulating...","Unraveling...","Traversing...","Sifting...","Marshaling...","Hydrating...","Harmonizing...","Indexing...","Entangling..."],ue="crosshair";var he=`
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
  --border-radius: 0;
  --border-radius-sm: 0;
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
  border: 1px solid var(--accent);
  background: rgba(99, 102, 241, 0.04);
  pointer-events: none;
  transition: all 0.08s ease-out;
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
.activity-icon.question { background: var(--accent-soft); color: var(--accent); }
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
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
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
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  pointer-events: auto;
  min-width: 180px;
  max-width: 180px;
  overflow: hidden;
  animation: hubIn 0.15s ease-out;
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

.hub-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hub-logo {
  width: 20px;
  height: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.1s;
  flex-shrink: 0;
}

.hub-disable:hover {
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
  max-height: 320px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.1s;
  flex-shrink: 0;
}

.hub-settings-btn:hover {
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.1s;
}

.hub-back-btn:hover {
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

.hub-shortcuts-section {
  margin-top: 12px;
  padding: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--divider);
}

.hub-shortcuts-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.hub-shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hub-shortcut-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hub-shortcut-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.hub-shortcut-keys {
  display: flex;
  gap: 4px;
  align-items: center;
}

.hub-shortcut-keys kbd {
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-family: inherit;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

:host([data-theme="dark"]) .hub-shortcut-keys kbd {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) .hub-shortcut-keys kbd {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

.theme-selector {
  display: flex;
  background: rgba(0, 0, 0, 0.04);
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
  font-size: 12px;
  cursor: pointer;
  transition: color 0.1s;
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
  width: 28px;
  height: 14px;
  background: #cbd5e1;
  cursor: pointer;
  transition: background 0.15s;
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
  width: 10px;
  height: 10px;
  background: white;
  transition: transform 0.15s;
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

/* ========================================
   LOUPE - Hover Tag (v2.0)
   ======================================== */
.loupe {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  font-family: 'SF Mono', 'Monaco', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--text-primary);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s ease-out;
  z-index: 10;
  white-space: nowrap;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loupe.visible {
  opacity: 1;
}

.loupe-name {
  color: var(--accent);
  font-weight: 500;
}

.loupe-pulse {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ========================================
   LENS CARD - Styles handled in lens.ts
   ======================================== */

/* ========================================
   CONTEXT OVERLAYS - Relationship View (v2.0)
   ======================================== */
.context-overlay {
  animation: context-appear 0.2s ease-out;
}

@keyframes context-appear {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-overlay.context-component {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.context-overlay.context-state-owner {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.context-overlay.context-layout-parent {
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
}

.context-overlay.context-event-blocker {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
}

.context-label {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

`;function g(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function j(e,t){switch(e){case"idle":return"Ready";case"pending":return"Waiting for agent...";case"fixing":return w[t%w.length];case"success":return"Done!";case"failed":return"Failed";default:return e}}function pe(e,t,n,i){if(e&&(!t||n)){let s=i;return s||(s=document.createElement("style"),s.id="eyeglass-cursor-style",document.head.appendChild(s)),s.textContent=`
      html, body, body * {
        cursor: ${ue} !important;
      }
    `,s}else return i&&(i.textContent=""),i}function _(){return`eyeglass-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function ge(e){let t=new EventSource(`${S}/events`);return t.onmessage=n=>{try{let i=JSON.parse(n.data);i.type==="activity"&&e.onActivityEvent(i.payload)}catch{}},t.onerror=()=>{t.close(),setTimeout(()=>e.onReconnect(),3e3)},t}async function U(e){let t={interactionId:e.interactionId,userNote:e.userNote.trim(),autoCommit:e.autoCommit,...e.snapshots.length===1?{snapshot:e.snapshots[0]}:{snapshots:e.snapshots}};try{let n=await fetch(`${S}/focus`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});return n.ok?{success:!0}:{success:!1,error:`HTTP ${n.status}`}}catch{return{success:!1,error:"Failed to connect to bridge"}}}async function me(e,t,n,i){let o={interactionId:e,questionId:t,answerId:n,answerLabel:i};try{await fetch(`${S}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})}catch{}}async function fe(e){try{return{success:(await fetch(`${S}/undo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:e})})).ok}}catch(t){return console.warn("Undo request failed:",t),{success:!1}}}async function be(e){try{return(await fetch(`${S}/commit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:e})})).ok?{success:!0}:(console.warn("Commit request failed"),{success:!1})}catch(t){return console.warn("Commit request failed:",t),{success:!1}}}function Y(e,t,n){let i=n.map(s=>s.framework.componentName||s.tagName),o=n.length===1?i[0]:`${i.length} elements`;return{interactionId:e,userNote:t.trim(),componentName:o,filePath:n[0]?.framework.filePath,status:"pending",timestamp:Date.now()}}var ve=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
</svg>`,zt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',Ot='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',qt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',Ft='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',Bt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',jt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';function xe(e,t,n){let i=t.hubExpanded?"":"collapsed",o=t.inspectorEnabled?"":"disabled",s=t.hubExpanded?"expanded":"",r=t.history.filter(d=>d.status==="pending"||d.status==="fixing").length;e.className=`hub ${i} ${o}`.trim(),e.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${ve}</div>
        ${r>0?`<span class="hub-badge">${r}</span>`:""}
        <button class="hub-toggle ${s}" title="Toggle history">\u25BC</button>
      </div>
      <div class="hub-button-group">
      <button class="hub-settings-btn" title="Settings">${qt}</button>
      <button class="hub-disable ${t.inspectorEnabled?"active":""}" title="${t.inspectorEnabled?"Disable":"Enable"} inspector">
        ${t.inspectorEnabled?zt:Ot}
      </button>
      </div>
    </div>
    <div class="hub-content ${s}">
      ${t.history.length>0?`
        <div class="hub-list">
          ${t.history.map(d=>`
            <div class="hub-item" data-id="${d.interactionId}">
              <div class="hub-item-status ${d.status}"></div>
              <div class="hub-item-content">
                <div class="hub-item-component">${g(d.componentName)}</div>
                <div class="hub-item-note">${g(d.userNote)}</div>
              </div>
              ${d.status==="success"?`
                <button class="hub-item-undo" data-id="${d.interactionId}" title="Undo">\u21A9</button>
              `:""}
            </div>
          `).join("")}
        </div>
      `:`
        <div class="hub-empty">No requests yet</div>
      `}
    </div>
  `;let a=e.querySelector(".hub-header"),l=e.querySelector(".hub-disable"),c=e.querySelector(".hub-settings-btn");a.addEventListener("click",d=>{d.target===l||d.target===c||d.target.closest(".hub-settings-btn")||n.onToggleExpanded()}),c.addEventListener("click",d=>{d.stopPropagation(),n.onOpenSettings()}),l.addEventListener("click",d=>{d.stopPropagation(),n.onToggleEnabled()}),e.querySelectorAll(".hub-item-undo").forEach(d=>{d.addEventListener("click",h=>{h.stopPropagation();let p=h.currentTarget.dataset.id;n.onUndo(p)})})}function ye(e,t,n){e.className="hub",e.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${ve}</div>
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
              <button class="theme-btn ${t.themePreference==="light"?"active":""}" data-theme="light" title="Light">${Ft}</button>
              <button class="theme-btn ${t.themePreference==="auto"?"active":""}" data-theme="auto" title="Auto">${jt}</button>
              <button class="theme-btn ${t.themePreference==="dark"?"active":""}" data-theme="dark" title="Dark">${Bt}</button>
            </div>
          </div>
          <div class="hub-setting-row">
            <div class="hub-setting-info">
              <div class="hub-setting-label">Auto-commit</div>
              <div class="hub-setting-desc">Automatically commit changes on success</div>
            </div>
            <button class="toggle-switch ${t.autoCommitEnabled?"active":""}" data-setting="autoCommit"></button>
          </div>
        </div>
        <div class="hub-shortcuts-section">
          <div class="hub-shortcuts-title">Keyboard Shortcuts</div>
          <div class="hub-shortcuts-list">
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle inspector</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC")>=0?"\u2318":"Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>E</kbd></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,e.querySelector(".hub-back-btn").addEventListener("click",()=>{n.onBack()}),e.querySelectorAll(".theme-btn").forEach(o=>{o.addEventListener("click",s=>{let r=s.currentTarget.dataset.theme;n.onThemeChange(r)})}),e.querySelectorAll(".toggle-switch").forEach(o=>{o.addEventListener("click",s=>{s.currentTarget.dataset.setting==="autoCommit"&&n.onAutoCommitToggle()})})}function Se(e,t){let n=e.map(i=>{switch(i.type){case"status":return i.status==="pending"||i.status==="fixing"&&(!i.message||i.message==="Agent is working...")?"":_t(i);case"thought":return Ut(i);case"action":return Yt(i);case"question":return Kt(i,e);default:return""}}).filter(Boolean);return n.length===0&&(t==="pending"||t==="fixing")?`
      <div class="skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-line"></div>
      </div>
    `:n.join("")}function _t(e){let t=e.status==="success"?"success":e.status==="failed"?"error":"status",n=e.status==="success"?"\u2713":e.status==="failed"?"\u2715":"\u25CF";return`
    <div class="activity-item">
      <div class="activity-icon ${t}">${n}</div>
      <div class="activity-content">
        <div class="activity-text">${g(e.message||e.status)}</div>
      </div>
    </div>
  `}function Ut(e){return`
    <div class="activity-item">
      <div class="activity-icon thought">\u{1F4AD}</div>
      <div class="activity-content">
        <div class="activity-text muted">${g(e.content)}</div>
      </div>
    </div>
  `}function Yt(e){let t={reading:"\u{1F4D6}",writing:"\u270F\uFE0F",searching:"\u{1F50D}",thinking:"\u{1F9E0}"},n={reading:"Reading",writing:"Writing",searching:"Searching",thinking:"Thinking about"};return`
    <div class="activity-item">
      <div class="activity-icon action">${t[e.action]||"\u25CF"}</div>
      <div class="activity-content">
        <div class="activity-text">${n[e.action]||e.action}${e.complete?" \u2713":"..."}</div>
        <div class="activity-target">${g(e.target)}</div>
      </div>
    </div>
  `}function Kt(e,t){return e.selectedAnswerId?`
      <div class="activity-item">
        <div class="activity-icon question">?</div>
        <div class="activity-content">
          <div class="activity-text muted">${g(e.question)}</div>
          <div class="activity-target">${g(e.selectedAnswerLabel||e.selectedAnswerId)}</div>
        </div>
      </div>
    `:`
    <div class="question-box">
      <div class="question-text">${g(e.question)}</div>
      <div class="question-options">
        ${e.options.map(n=>`
          <button
            class="question-option"
            data-question-id="${e.questionId}"
            data-answer-id="${n.id}"
          >${g(n.label)}</button>
        `).join("")}
      </div>
    </div>
  `}function we(e,t,n){if(n)return n;let i=window.innerHeight-e.bottom,o=t==="activity"?400:200,s=e.bottom+12;i<o&&e.top>o&&(s=e.top-o-12);let r=20,a=window.innerHeight-o-20;s=Math.max(r,Math.min(s,a));let l=e.left;return l+340>window.innerWidth-20&&(l=window.innerWidth-360),l<20&&(l=20),{x:l,y:s}}function Ee(e,t,n){let i=t.multiSelectMode,o=i?"multi-select-icon active":"multi-select-icon",s=i?`
    <div class="selected-list">
      <div class="selected-list-header">
        <span class="selected-count">${t.selectedSnapshots.length} element${t.selectedSnapshots.length!==1?"s":""} selected</span>
      </div>
      <div class="selected-chips">
        ${t.selectedSnapshots.map((u,m)=>{let x=u.framework.componentName||u.tagName;return`
            <div class="selected-chip" data-index="${m}">
              <span class="selected-chip-number">${m+1}</span>
              <span>${g(x)}</span>
              <button class="selected-chip-remove" data-index="${m}" title="Remove">&times;</button>
            </div>
          `}).join("")}
      </div>
    </div>
  `:"",r=i?`
    <div class="multi-mode-hint">Click elements to add/remove from selection</div>
  `:"";e.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">&lt;${g(t.componentName)} /&gt;</span>
      ${t.filePath?`<span class="file-path">${g(t.filePath)}</span>`:""}
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
  `;let a=e.querySelector(".input-field"),l=e.querySelector(".close-btn"),c=e.querySelector(".btn-secondary"),d=e.querySelector(".btn-primary"),h=e.querySelector(".multi-select-icon");l.addEventListener("click",()=>n.onClose()),c.addEventListener("click",()=>n.onClose()),d.addEventListener("click",()=>n.onSubmit(a.value)),a.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&a.value.trim()&&(u.preventDefault(),n.onSubmit(a.value))}),h.addEventListener("click",()=>{n.onToggleMultiSelect()}),e.querySelectorAll(".selected-chip-remove").forEach(u=>{u.addEventListener("click",m=>{m.stopPropagation();let x=parseInt(m.currentTarget.dataset.index,10);n.onRemoveFromSelection(x)})}),e.querySelector(".panel-header").addEventListener("mousedown",n.onPanelDragStart),requestAnimationFrame(()=>a.focus())}function ke(e,t,n){let i=t.currentStatus==="success"||t.currentStatus==="failed",o=t.currentStatus==="success"&&!t.autoCommitEnabled,s=t.currentStatus==="success",r=t.submittedSnapshots.length,a=r>1?`${r} elements`:`&lt;${g(t.componentName)} /&gt;`,l=j(t.currentStatus,t.phraseIndex);e.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">${a}</span>
      ${r<=1&&t.filePath?`<span class="file-path">${g(t.filePath)}</span>`:""}
      <button class="close-btn" title="Close">&times;</button>
    </div>
    <div class="user-request">
      <div class="user-request-label">Your request</div>
      <div class="user-request-text">${g(t.userNote)}</div>
    </div>
    <div class="activity-feed">
      ${Se(t.activityEvents,t.currentStatus)}
    </div>
    <div class="panel-footer ${i?"done":""}">
      <div class="status-indicator ${t.currentStatus}"></div>
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
  `,e.querySelector(".close-btn").addEventListener("click",()=>n.onClose()),e.querySelector(".panel-header").addEventListener("mousedown",n.onPanelDragStart),e.querySelectorAll(".question-option").forEach(E=>{E.addEventListener("click",Q=>{Q.stopPropagation();let D=Q.currentTarget,Ze=D.dataset.questionId,et=D.dataset.answerId,tt=D.textContent;n.onSubmitAnswer(Ze,et,tt)})});let h=e.querySelector(".action-btn-commit"),p=e.querySelector(".action-btn-undo");h&&h.addEventListener("click",()=>n.onCommit()),p&&p.addEventListener("click",()=>n.onUndo());let u=e.querySelector(".followup-input"),m=e.querySelector(".followup-send"),x=e.querySelector(".followup-done");u&&m&&(m.addEventListener("click",()=>{u.value.trim()&&n.onSubmitFollowUp(u.value)}),u.addEventListener("keydown",E=>{E.key==="Enter"&&!E.shiftKey&&u.value.trim()&&(E.preventDefault(),n.onSubmitFollowUp(u.value))}),requestAnimationFrame(()=>u.focus())),x&&x.addEventListener("click",()=>n.onClose());let N=e.querySelector(".activity-feed");N&&(N.scrollTop=N.scrollHeight)}function Ce(e,t,n){if(!e)return;let i=e.querySelector(".status-text");i&&(i.textContent=j(t,n))}function K(e){let t=[];e.perception?.legibility?.wcagStatus==="fail"&&t.push({level:"critical",category:"accessibility",message:"Low contrast ratio",details:`Contrast ratio: ${e.perception.legibility.contrastRatio}:1 (WCAG requires 4.5:1)`}),e.a11y?.hidden&&e.perception?.affordance?.isInteractable&&t.push({level:"critical",category:"accessibility",message:"Hidden but interactive",details:"Element is marked as hidden but has event listeners"});let n=e.metal?.performance?.lastRenderReason;if(n?.includes("'style' changed identity")&&t.push({level:"warning",category:"performance",message:"Inline style causing re-renders",details:n}),e.metal?.pipeline?.layoutThrashingRisk==="high"&&t.push({level:"warning",category:"performance",message:"Layout thrashing risk",details:"Element has listeners that may cause frequent layout recalculations"}),e.perception?.usability?.isTouchTargetValid===!1){let o=e.perception.usability.touchTargetSize;e.perception?.affordance?.isInteractable&&t.push({level:"warning",category:"usability",message:"Touch target too small",details:`Size: ${o} (should be at least 44x44)`})}e.perception?.affordance?.dissonanceScore&&e.perception.affordance.dissonanceScore>.5&&t.push({level:"warning",category:"usability",message:"Affordance mismatch",details:e.perception.affordance.looksInteractable?"Element looks clickable but has no interaction":"Element is interactive but does not look clickable"}),e.perception?.visibility?.isOccluded&&t.push({level:"warning",category:"usability",message:"Element is occluded",details:`Covered by: ${e.perception.visibility.occludedBy}`});let i=e.causality?.events?.blockingHandlers||[];if(i.length>0){let o=i.find(r=>r.reason==="pointer-events:none"),s=i.filter(r=>r.reason==="captured");o&&t.push({level:"critical",category:"events",message:"Events blocked",details:`pointer-events: none on ${o.element}`}),s.length>0&&t.push({level:"warning",category:"events",message:"Events may be captured",details:`${s.length} ancestor(s) using capture phase`})}return t}function I(e){let t=K(e);return t.some(n=>n.level==="critical")?"critical":t.some(n=>n.level==="warning")?"warning":"healthy"}function T(e){switch(e){case"critical":return"#ef4444";case"warning":return"#f59e0b";case"healthy":return"#10b981"}}function Me(e){let t=document.createElement("div");return t.className="loupe",t.setAttribute("aria-hidden","true"),e.appendChild(t),t}function Gt(e){let t=e.framework,n=t.displayName||t.componentName;if(n)return`<${n} />`;let i=`<${e.tagName}>`;return e.id?i=`#${e.id}`:e.className&&(i=`.${e.className.split(/\s+/)[0]}`),i}function Vt(e,t,n){let i=window.innerWidth,o=window.innerHeight,s=8,r=10,a=e.top-s,l=o-e.bottom-s,c=e.left-s,d=i-e.right-s,h,p,u;return a>=n+r?(h="above",p=e.left+(e.width-t)/2,u=e.top-n-r):l>=n+r?(h="below",p=e.left+(e.width-t)/2,u=e.bottom+r):d>=t+r?(h="right",p=e.right+r,u=e.top+(e.height-n)/2):c>=t+r?(h="left",p=e.left-t-r,u=e.top+(e.height-n)/2):(h="above",p=e.left+(e.width-t)/2,u=Math.max(s,e.top-n-r)),p=Math.max(s,Math.min(p,i-t-s)),u=Math.max(s,Math.min(u,o-n-s)),{position:h,x:p,y:u}}function He(e,t,n){let i=Gt(t),o=I(t),s=T(o),r=o!=="healthy";e.innerHTML=`
    <span class="loupe-name">${Wt(i)}</span>
    ${r?`<span class="loupe-pulse" style="background: ${s};"></span>`:""}
  `;let a=Math.min(300,i.length*8+30),l=28,{x:c,y:d}=Vt(n,a,l);e.style.transform=`translate(${Math.round(c)}px, ${Math.round(d)}px)`}function Ie(e){e.classList.add("visible")}function G(e){e.classList.remove("visible")}function Wt(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}function Te(e){let t=e.framework;return t.displayName||t.componentName||e.tagName}function Xt(e){let t=e.framework;if(!t.filePath)return null;let i=t.filePath.split("/").slice(-2).join("/");return t.lineNumber?`${i}:${t.lineNumber}`:i}function Jt(e){return e.length===0?"":`
    <div class="lens-issues">
      ${e.map(t=>`
        <div class="lens-issue ${t.level}">
          <span class="issue-dot"></span>
          <span class="issue-text">${f(t.message)}</span>
        </div>
      `).join("")}
    </div>
  `}function Le(e,t){let{currentSnapshot:n,mode:i,multiSelectMode:o,selectedSnapshots:s}=e;if(o&&s.length>0)return Zt(e);if(!n)return'<div class="lens-empty">No element selected</div>';let r=Te(n),a=Xt(n),l=I(n),c=T(l),d=K(n);return i==="activity"?Qt(e,r,a):`
    <div class="lens-bar">
      <span class="lens-tag">&lt;${f(r)} /&gt;</span>
      ${l!=="healthy"?`<span class="lens-dot" style="background:${c}"></span>`:""}
      <div class="lens-tools">
        <button class="lens-tool" data-action="toggle-context" title="Context"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="lens-tool" data-action="multi-select" title="Multi-select"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
        <button class="lens-tool lens-close" data-action="close" title="Close"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${a?`<div class="lens-path">${f(a)}</div>`:""}
    ${Jt(d)}
    <div class="lens-input-row">
      <input
        type="text"
        class="lens-input"
        placeholder="Ask Eyeglass..."
        value="${f(e._userNote||"")}"
        data-action="input"
      />
      <kbd class="lens-enter-hint">\u21B5</kbd>
    </div>
    <div class="lens-schema" data-expanded="false">
      <button class="lens-schema-toggle" data-action="toggle-schema">
        <span>Schema</span>
        <svg class="lens-schema-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <pre class="lens-schema-code"></pre>
    </div>
  `}function Qt(e,t,n){let{currentStatus:i,activityEvents:o}=e,s=[...o].reverse().find(c=>c.type==="thought"),r=[...o].reverse().find(c=>c.type==="action"),a=[...o].reverse().find(c=>c.type==="question"&&c.questionId&&!c.answered),l="Working...";return i==="pending"?l="Waiting for agent...":i==="success"?l="Done":i==="failed"?l="Failed":s?l=s.content:r&&(l=`${r.action}: ${r.target}`),`
    <div class="lens-bar">
      <span class="lens-tag">&lt;${f(t)} /&gt;</span>
      <span class="lens-status-badge ${i}">${i}</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="close" title="Close"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${n?`<div class="lens-path">${f(n)}</div>`:""}
    <div class="lens-activity">
      ${i==="fixing"?'<div class="lens-progress"><div class="lens-progress-bar"></div></div>':""}
      <div class="lens-message">${f(l)}</div>
    </div>
    ${a?en(a):""}
    ${i==="success"||i==="failed"?`
      <div class="lens-footer">
        <button class="lens-btn" data-action="new-request">New Request</button>
      </div>
    `:""}
  `}function Zt(e){let{selectedSnapshots:t,_userNote:n}=e;return`
    <div class="lens-bar">
      <span class="lens-tag">${t.length} selected</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="exit-multi" title="Exit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    <div class="lens-selection">
      ${t.map((i,o)=>`
        <div class="lens-chip">
          <span class="chip-num">${o+1}</span>
          <span class="chip-name">&lt;${f(Te(i))} /&gt;</span>
          <button class="chip-remove" data-action="remove-selection" data-index="${o}">\xD7</button>
        </div>
      `).join("")}
    </div>
    <div class="lens-input-row">
      <input
        type="text"
        class="lens-input"
        placeholder="What should change?"
        value="${f(n||"")}"
        data-action="input"
      />
      <kbd class="lens-enter-hint">\u21B5</kbd>
    </div>
  `}function en(e){return`
    <div class="lens-question">
      <div class="lens-q-text">${f(e.question)}</div>
      <div class="lens-q-options">
        ${e.options.map(t=>`
          <button class="lens-q-btn" data-action="answer" data-question-id="${e.questionId}" data-answer-id="${t.id}" data-answer-label="${f(t.label)}">
            ${f(t.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `}function Pe(e,t){let n=window.innerWidth,i=window.innerHeight,o=8,s=e.right+o;s+t.width>n-o&&(s=e.left-o-t.width),s<o&&(s=o);let r=e.top;return r+t.height>i-o&&(r=i-t.height-o),r<o&&(r=o),{x:Math.round(s),y:Math.round(r)}}function f(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}var $e=`
.lens-card {
  position: fixed;
  width: 220px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  pointer-events: auto;
  overflow: hidden;
  animation: lensEnter 0.12s ease-out;
  z-index: 2147483645;
}

@keyframes lensEnter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Top bar */
.lens-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--divider);
  cursor: grab;
  user-select: none;
}

.lens-bar:active {
  cursor: grabbing;
}

.lens-tag {
  font-family: 'SF Mono', 'Fira Code', Monaco, monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lens-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
}

.lens-tools {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.lens-tool {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.1s;
}

.lens-tool:hover {
  color: var(--accent);
}

.lens-tool.lens-close:hover {
  color: var(--error);
}

/* File path */
.lens-path {
  padding: 4px 10px 6px;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--divider);
}

/* Status badge */
.lens-status-badge {
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lens-status-badge.fixing {
  background: var(--accent-soft);
  color: var(--accent);
}

.lens-status-badge.success {
  background: rgba(16,185,129,0.15);
  color: var(--success);
}

.lens-status-badge.failed {
  background: rgba(239,68,68,0.15);
  color: var(--error);
}

.lens-status-badge.pending {
  background: rgba(245,158,11,0.15);
  color: #f59e0b;
}

/* Issues */
.lens-issues {
  padding: 6px 10px;
  border-bottom: 1px solid var(--divider);
}

.lens-issue {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.issue-dot {
  width: 4px;
  height: 4px;
  flex-shrink: 0;
}

.lens-issue.warning .issue-dot {
  background: #f59e0b;
}

.lens-issue.critical .issue-dot {
  background: var(--error);
}

.issue-text {
  font-size: 10px;
  color: var(--text-secondary);
}

/* Input */
.lens-input-row {
  padding: 8px 10px;
  position: relative;
  display: flex;
  align-items: center;
}

.lens-input {
  flex: 1;
  padding: 8px 10px;
  padding-right: 32px;
  background: rgba(0,0,0,0.06);
  border: 1px solid var(--glass-border);
  font-size: 11px;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.1s, background 0.1s;
}

.lens-input:focus {
  border-color: var(--accent);
  background: rgba(0,0,0,0.08);
}

.lens-input::placeholder {
  color: var(--text-muted);
}

.lens-enter-hint {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-family: inherit;
  font-size: 11px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--glass-border);
  opacity: 0.6;
  transition: opacity 0.1s;
  pointer-events: none;
}

.lens-input:focus + .lens-enter-hint {
  opacity: 1;
  color: var(--accent);
  border-color: var(--accent);
}

/* Activity */
.lens-activity {
  padding: 10px;
}

.lens-progress {
  height: 2px;
  background: rgba(0,0,0,0.08);
  margin-bottom: 8px;
  overflow: hidden;
}

.lens-progress-bar {
  height: 100%;
  width: 30%;
  background: var(--accent);
  animation: progressSlide 1s ease-in-out infinite;
}

@keyframes progressSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.lens-message {
  font-size: 10px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Footer */
.lens-footer {
  padding: 8px 10px;
  border-top: 1px solid var(--divider);
}

.lens-btn {
  width: 100%;
  padding: 8px;
  background: var(--accent);
  border: none;
  font-size: 10px;
  font-weight: 600;
  font-family: inherit;
  color: white;
  cursor: pointer;
  transition: filter 0.1s;
}

.lens-btn:hover {
  filter: brightness(1.1);
}

/* Question */
.lens-question {
  padding: 10px;
  border-top: 1px solid var(--divider);
}

.lens-q-text {
  font-size: 10px;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.lens-q-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-q-btn {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--glass-border);
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.1s;
}

.lens-q-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Selection (multi-select) */
.lens-selection {
  padding: 8px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 1px solid var(--divider);
}

.lens-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  background: var(--accent-soft);
  font-size: 10px;
}

.chip-num {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  font-size: 9px;
  font-weight: 600;
}

.chip-name {
  font-family: 'SF Mono', monospace;
  color: var(--text-primary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.chip-remove:hover {
  color: var(--error);
}

/* Schema (expandable) */
.lens-schema {
  border-top: 1px solid var(--divider);
}

.lens-schema-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: transparent;
  border: none;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.1s;
}

.lens-schema-toggle:hover {
  color: var(--text-secondary);
}

.lens-schema-chevron {
  transition: transform 0.15s;
}

.lens-schema[data-expanded="true"] .lens-schema-chevron {
  transform: rotate(180deg);
}

.lens-schema-code {
  margin: 0;
  padding: 0;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.15s ease-out, padding 0.15s ease-out;
}

.lens-schema[data-expanded="true"] .lens-schema-code {
  max-height: 160px;
  padding: 8px 10px;
  overflow-y: auto;
}

/* JSON syntax highlighting */
.lens-schema-code .json-key { color: #7dd3fc; }
.lens-schema-code .json-string { color: #86efac; }
.lens-schema-code .json-number { color: #fcd34d; }
.lens-schema-code .json-bool { color: #f9a8d4; }
.lens-schema-code .json-null { color: var(--text-muted); }
.lens-schema-code .json-bracket { color: var(--text-secondary); }

.lens-empty {
  padding: 20px;
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
}
`;var L={component:"#3b82f6","state-owner":"#8b5cf6","layout-parent":"#f97316","event-blocker":"#ef4444"};function Ae(e,t){let n=[];n.push({element:e,type:"component",color:L.component,label:t.framework.displayName||t.framework.componentName||t.tagName});let i=e.parentElement;for(;i&&i!==document.body;){let o=getComputedStyle(i);if(o.display.includes("flex")||o.display.includes("grid")){n.push({element:i,type:"layout-parent",color:L["layout-parent"],label:`Layout (${o.display})`});break}i=i.parentElement}if(t.causality?.events?.blockingHandlers)for(let o of t.causality.events.blockingHandlers)try{let s=document.querySelector(o.element);s&&!n.some(r=>r.element===s)&&n.push({element:s,type:"event-blocker",color:L["event-blocker"],label:`Blocks ${o.event} (${o.reason})`})}catch{}if(t.framework.ancestry&&t.framework.ancestry.length>1){let o=Object.keys(e).find(s=>s.startsWith("__reactFiber$"));if(o){let s=e[o],r=0;for(;s&&r<10;){if(s.return&&s.return.type&&typeof s.return.type=="function"){let a=s.return.type.displayName||s.return.type.name;if(a&&s.return.stateNode instanceof Element){n.push({element:s.return.stateNode,type:"state-owner",color:L["state-owner"],label:`<${a} /> (props source)`});break}}s=s.return,r++}}}return n}function Ne(e,t){let n=[];for(let i of t){let o=i.element.getBoundingClientRect();if(o.width===0||o.height===0)continue;let s=document.createElement("div");s.className=`context-overlay context-${i.type}`,s.style.cssText=`
      position: fixed;
      left: ${o.left-2}px;
      top: ${o.top-2}px;
      width: ${o.width+4}px;
      height: ${o.height+4}px;
      border: 2px solid ${i.color};
      border-radius: 4px;
      pointer-events: none;
      z-index: 9;
      box-sizing: border-box;
    `;let r=document.createElement("div");r.className="context-label",r.textContent=i.label,r.style.cssText=`
      position: absolute;
      top: -20px;
      left: 0;
      padding: 2px 6px;
      background: ${i.color};
      color: white;
      font-size: 10px;
      font-weight: 500;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
    `,s.appendChild(r),e.appendChild(s),n.push(s)}return n}function De(e){e.querySelectorAll(".context-overlay").forEach(n=>n.remove())}function Re(e,t,n,i){return o=>{let s=n();if(!s.multiSelectMode&&s.frozen||!s.inspectorEnabled)return;if(o.composedPath().includes(e)){i.hideHighlight();return}if(s.throttleTimeout)return;i.setThrottleTimeout(window.setTimeout(()=>{i.setThrottleTimeout(null)},16)),e.style.pointerEvents="none";let a=document.elementFromPoint(o.clientX,o.clientY);if(e.style.pointerEvents="",!a||a===document.documentElement||a===document.body){i.hideHighlight();return}t.contains(a)||(i.setCurrentElement(a),i.showHighlight(a,o))}}function ze(e,t,n){return i=>{let o=t();if(!(!o.inspectorEnabled||!o.currentElement||i.composedPath().some(r=>r===e))){if(i.preventDefault(),i.stopPropagation(),o.multiSelectMode){n.toggleInSelection(o.currentElement);return}o.frozen||n.freeze()}}}function Oe(e,t){return n=>{let i=e();n.key==="Escape"&&i.frozen&&(n.preventDefault(),t.unfreeze()),(navigator.platform.toUpperCase().indexOf("MAC")>=0?n.metaKey:n.ctrlKey)&&n.shiftKey&&n.key.toLowerCase()==="e"&&(n.preventDefault(),t.toggleInspectorEnabled())}}function qe(e,t){return()=>{let n=e();n.frozen&&(t.disableHighlightTransitions(),n.currentElement&&n.highlight&&!n.multiSelectMode&&t.showHighlight(n.currentElement),n.multiSelectMode&&n.selectedElements.length>0&&t.updateMultiSelectHighlightPositions(),n.scrollTimeout&&window.clearTimeout(n.scrollTimeout),t.setScrollTimeout(window.setTimeout(()=>{t.enableHighlightTransitions(),t.setScrollTimeout(null)},150)))}}function Fe(e,t){let n=null,i=a=>{let l=e();if(!l.isDragging||!n)return;let c=Math.max(0,Math.min(a.clientX-l.dragOffset.x,window.innerWidth-340)),d=Math.max(0,Math.min(a.clientY-l.dragOffset.y,window.innerHeight-100));t.setCustomPanelPosition({x:c,y:d}),n.style.left=`${c}px`,n.style.top=`${d}px`},o=()=>{t.setDragging(!1),n=null,document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",o)};return{handlePanelDragStart:a=>{if(a.target.closest("button, input"))return;let l=e();if(!l.panel)return;n=l.panel,t.setDragging(!0);let c=l.panel.getBoundingClientRect();t.setDragOffset({x:a.clientX-c.left,y:a.clientY-c.top}),document.addEventListener("mousemove",i),document.addEventListener("mouseup",o)},handlePanelDrag:i,handlePanelDragEnd:o,handleLensDragStart:a=>{if(a.target.closest("button, input"))return;let l=e();if(!l.lens)return;n=l.lens,t.setDragging(!0);let c=l.lens.getBoundingClientRect();t.setDragOffset({x:a.clientX-c.left,y:a.clientY-c.top}),document.addEventListener("mousemove",i),document.addEventListener("mouseup",o)}}}function Be(e,t,n,i,o){if(!e)return;let s={interactionId:e,userNote:t,componentName:n?.framework.componentName||n?.tagName||"element",status:i,message:o,timestamp:Date.now()};try{sessionStorage.setItem(C,JSON.stringify(s))}catch{}}function je(){try{let e=sessionStorage.getItem(C);if(!e)return null;let t=JSON.parse(e);return Date.now()-t.timestamp>1e4?(sessionStorage.removeItem(C),null):t}catch{return null}}function V(){try{sessionStorage.removeItem(C)}catch{}}function _e(){try{let e=sessionStorage.getItem(O);if(e)return JSON.parse(e)}catch{}return[]}function b(e){try{sessionStorage.setItem(O,JSON.stringify(e))}catch{}}function W(e,t){let n=[...e],i=n.findIndex(o=>o.interactionId===t.interactionId);return i>=0?n[i]=t:(n.unshift(t),n.length>20&&(n.length=20)),n}function P(e,t,n){return e.map(i=>i.interactionId===t?{...i,status:n}:i)}function Ue(e,t){return e.filter(n=>n.interactionId!==t)}function Ye(){try{let e=localStorage.getItem(q);if(e!==null)return e==="true"}catch{}return!0}function Ke(e){try{localStorage.setItem(q,String(e))}catch{}}function Ge(){try{let e=localStorage.getItem(F);if(e!==null)return e==="true"}catch{}return!0}function X(e){try{localStorage.setItem(F,String(e))}catch{}}function Ve(){try{let e=localStorage.getItem(B);if(e==="light"||e==="dark"||e==="auto")return e}catch{}return"auto"}function J(e){try{localStorage.setItem(B,e)}catch{}}function M(e,t){e.multiSelectHighlights.forEach(o=>o.remove());let n=[],i=3;return e.selectedElements.forEach((o,s)=>{let r=o.getBoundingClientRect(),a=document.createElement("div");a.className="highlight multi",a.style.display="block",a.style.left=`${r.left-i}px`,a.style.top=`${r.top-i}px`,a.style.width=`${r.width+i*2}px`,a.style.height=`${r.height+i*2}px`;let l=document.createElement("div");l.className="highlight-badge",l.textContent=String(s+1),a.appendChild(l),t.appendChild(a),n.push(a)}),n}function $(e,t){e.multiSelectHighlights.forEach(n=>n.remove())}function We(e,t){e.forEach((i,o)=>{let s=t[o];if(!s)return;let r=i.getBoundingClientRect();s.style.left=`${r.left-3}px`,s.style.top=`${r.top-3}px`,s.style.width=`${r.width+3*2}px`,s.style.height=`${r.height+3*2}px`})}function Xe(e,t){e&&e.classList.add("no-transition"),t.forEach(n=>n.classList.add("no-transition"))}function Je(e,t){e&&e.classList.remove("no-transition"),t.forEach(n=>n.classList.remove("no-transition"))}var A=class extends HTMLElement{constructor(){super();this.highlight=null;this.panel=null;this.toast=null;this.hub=null;this.currentElement=null;this.currentSnapshot=null;this.interactionId=null;this.frozen=!1;this.eventSource=null;this.throttleTimeout=null;this.mode="input";this.activityEvents=[];this.currentStatus="idle";this.hubExpanded=!1;this.hubPage="main";this.inspectorEnabled=!0;this.autoCommitEnabled=!0;this.themePreference="auto";this.history=[];this.isDragging=!1;this.dragOffset={x:0,y:0};this.customPanelPosition=null;this.multiSelectMode=!1;this.selectedElements=[];this.selectedSnapshots=[];this.multiSelectHighlights=[];this.submittedSnapshots=[];this.cursorStyleElement=null;this.scrollTimeout=null;this.phraseIndex=0;this.phraseInterval=null;this._userNote="";this.uiMode="loupe";this.loupe=null;this.lens=null;this.lastMouseX=0;this.lastMouseY=0;this.showingContextOverlays=!1;this.contextOverlays=[];this.contextOverlayElements=[];this.shadow=this.attachShadow({mode:"closed"}),this.handleMouseMove=Re(this,this.shadow,()=>({frozen:this.frozen,multiSelectMode:this.multiSelectMode,inspectorEnabled:this.inspectorEnabled,throttleTimeout:this.throttleTimeout}),{setThrottleTimeout:n=>this.throttleTimeout=n,hideHighlight:()=>this.hideHighlight(),showHighlight:(n,i)=>{i&&(this.lastMouseX=i.clientX,this.lastMouseY=i.clientY),this.showHighlight(n)},setCurrentElement:n=>this.currentElement=n}),this.handleClick=ze(this,()=>({inspectorEnabled:this.inspectorEnabled,currentElement:this.currentElement,frozen:this.frozen,multiSelectMode:this.multiSelectMode}),{toggleInSelection:n=>this.toggleInSelection(n),freeze:()=>this.freeze()}),this.handleKeyDown=Oe(()=>({frozen:this.frozen}),{unfreeze:()=>this.unfreeze(),toggleInspectorEnabled:()=>this.toggleInspectorEnabled()}),this.handleScroll=qe(()=>({frozen:this.frozen,currentElement:this.currentElement,highlight:this.highlight,multiSelectMode:this.multiSelectMode,selectedElements:this.selectedElements,scrollTimeout:this.scrollTimeout}),{showHighlight:n=>this.showHighlight(n),updateMultiSelectHighlightPositions:()=>We(this.selectedElements,this.multiSelectHighlights),disableHighlightTransitions:()=>Xe(this.highlight,this.multiSelectHighlights),enableHighlightTransitions:()=>Je(this.highlight,this.multiSelectHighlights),setScrollTimeout:n=>this.scrollTimeout=n}),this.dragHandlers=Fe(()=>({isDragging:this.isDragging,dragOffset:this.dragOffset,panel:this.panel,lens:this.lens}),{setDragging:n=>this.isDragging=n,setDragOffset:n=>this.dragOffset=n,setCustomPanelPosition:n=>this.customPanelPosition=n})}connectedCallback(){let n=document.createElement("style");n.textContent=he+$e,this.shadow.appendChild(n),this.highlight=document.createElement("div"),this.highlight.className="highlight",this.highlight.style.display="none",this.shadow.appendChild(this.highlight),this.loupe=Me(this.shadow),document.addEventListener("mousemove",this.handleMouseMove,!0),document.addEventListener("click",this.handleClick,!0),document.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0),this.inspectorEnabled=Ye(),this.autoCommitEnabled=Ge(),this.themePreference=Ve(),this.applyTheme(),this.history=_e(),this.renderHub(),this.connectSSE(),this.restoreSession(),this.updateCursor()}disconnectedCallback(){document.removeEventListener("mousemove",this.handleMouseMove,!0),document.removeEventListener("click",this.handleClick,!0),document.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0),this.eventSource?.close(),this.cursorStyleElement&&(this.cursorStyleElement.remove(),this.cursorStyleElement=null)}connectSSE(){this.eventSource=ge({onActivityEvent:n=>this.handleActivityEvent(n),onReconnect:()=>this.connectSSE()})}handleActivityEvent(n){n.type==="status"&&(this.history=P(this.history,n.interactionId,n.status),b(this.history),this.renderHub()),n.interactionId===this.interactionId&&(this.activityEvents.push(n),n.type==="status"&&(this.currentStatus=n.status,Be(this.interactionId,this._userNote,this.currentSnapshot,this.currentStatus,n.message),n.status==="fixing"?this.startPhraseRotation():this.stopPhraseRotation(),n.status==="failed"&&setTimeout(()=>this.unfreeze(),4e3)),this.uiMode==="lens"?this.renderLens():this.renderPanel())}restoreSession(){let n=je();n&&(n.status==="success"||n.status==="failed")&&(this.showResultToast(n),V())}showResultToast(n){this.toast=document.createElement("div"),this.toast.className="result-toast";let i=n.status==="success",o=i?"\u2713":"\u2715",s=i?"Done!":"Failed";this.toast.innerHTML=`
      <div class="toast-icon ${n.status}">${o}</div>
      <div class="toast-content">
        <div class="toast-title">${s}</div>
        <div class="toast-message">${g(n.message||n.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `,this.toast.querySelector(".toast-close").addEventListener("click",()=>this.hideToast()),this.shadow.appendChild(this.toast),setTimeout(()=>this.hideToast(),4e3)}hideToast(){this.toast&&(this.toast.remove(),this.toast=null)}applyTheme(){this.setAttribute("data-theme",this.themePreference)}toggleInspectorEnabled(){this.inspectorEnabled=!this.inspectorEnabled,Ke(this.inspectorEnabled),this.inspectorEnabled||this.unfreeze(),this.updateCursor(),this.renderHub()}updateCursor(){this.cursorStyleElement=pe(this.inspectorEnabled,this.frozen,this.multiSelectMode,this.cursorStyleElement)}showHighlight(n){if(!this.highlight)return;let i=n.getBoundingClientRect(),o=3;if(this.highlight.style.display="block",this.highlight.style.left=`${i.left-o}px`,this.highlight.style.top=`${i.top-o}px`,this.highlight.style.width=`${i.width+o*2}px`,this.highlight.style.height=`${i.height+o*2}px`,!this.frozen&&this.loupe&&this.uiMode==="loupe"){let s=y(n);this.currentSnapshot=s,He(this.loupe,s,i),Ie(this.loupe)}}hideHighlight(){this.highlight&&(this.highlight.style.display="none"),this.loupe&&!this.frozen&&G(this.loupe)}freeze(){this.currentElement&&(this.frozen=!0,this.currentSnapshot=y(this.currentElement),this.selectedElements=[this.currentElement],this.selectedSnapshots=[this.currentSnapshot],this.mode="input",this.activityEvents=[],this.currentStatus="idle",this.updateCursor(),this.loupe&&G(this.loupe),this.uiMode="lens",this.renderLens())}unfreeze(){this.frozen=!1,this.currentSnapshot=null,this.interactionId=null,this.mode="input",this.activityEvents=[],this.customPanelPosition=null,this.multiSelectMode=!1,this.selectedElements=[],this.selectedSnapshots=[],this.submittedSnapshots=[],$({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.stopPhraseRotation(),this.hideLens(),this.uiMode="loupe",this.hideContextOverlays(),this.hidePanel(),this.hideHighlight(),this.updateCursor(),V()}enterMultiSelectMode(){!this.frozen||this.multiSelectMode||(this.multiSelectMode=!0,this.multiSelectHighlights=M({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.updateCursor(),this.uiMode==="lens"?this.renderLens():this.renderPanel())}exitMultiSelectMode(){this.multiSelectMode=!1,this.selectedElements.length>0&&(this.currentElement=this.selectedElements[0],this.currentSnapshot=this.selectedSnapshots[0]),this.selectedElements=this.currentElement?[this.currentElement]:[],this.selectedSnapshots=this.currentSnapshot?[this.currentSnapshot]:[],$({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.currentElement&&this.showHighlight(this.currentElement),this.updateCursor(),this.uiMode==="lens"?this.renderLens():this.renderPanel()}toggleInSelection(n){if(!this.multiSelectMode)return;let i=this.selectedElements.indexOf(n);if(i>=0)this.removeFromSelection(i);else{let o=y(n);this.selectedElements.push(n),this.selectedSnapshots.push(o)}this.multiSelectHighlights=M({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.uiMode==="lens"?this.renderLens():this.renderPanel()}removeFromSelection(n){if(!(n<0||n>=this.selectedElements.length)){if(this.selectedElements.length===1){this.exitMultiSelectMode();return}this.selectedElements.splice(n,1),this.selectedSnapshots.splice(n,1),this.multiSelectHighlights=M({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.uiMode==="lens"?this.renderLens():this.renderPanel()}}renderHub(){this.hub||(this.hub=document.createElement("div"),this.hub.className="hub",this.shadow.appendChild(this.hub)),this.hubPage==="settings"?ye(this.hub,{themePreference:this.themePreference,autoCommitEnabled:this.autoCommitEnabled},{onBack:()=>{this.hubPage="main",this.renderHub()},onThemeChange:n=>{this.themePreference=n,J(n),this.applyTheme(),this.renderHub()},onAutoCommitToggle:()=>{this.autoCommitEnabled=!this.autoCommitEnabled,X(this.autoCommitEnabled),this.renderHub()}}):xe(this.hub,{hubExpanded:this.hubExpanded,inspectorEnabled:this.inspectorEnabled,history:this.history},{onToggleExpanded:()=>{this.hubExpanded=!this.hubExpanded,this.renderHub()},onToggleEnabled:()=>this.toggleInspectorEnabled(),onOpenSettings:()=>{this.hubPage="settings",this.hubExpanded=!0,this.renderHub()},onUndo:n=>this.handleUndoRequest(n)})}renderPanel(){if(!this.currentSnapshot||!this.currentElement)return;let n=this.currentElement.getBoundingClientRect(),{framework:i}=this.currentSnapshot;this.panel||(this.panel=document.createElement("div"),this.panel.className="glass-panel",this.shadow.appendChild(this.panel));let o=we(n,this.mode,this.customPanelPosition);this.panel.style.left=`${o.x}px`,this.panel.style.top=`${o.y}px`;let s=i.componentName||this.currentSnapshot.tagName,r=i.filePath?i.filePath.split("/").slice(-2).join("/"):null;this.mode==="input"?Ee(this.panel,{componentName:s,filePath:r,multiSelectMode:this.multiSelectMode,selectedSnapshots:this.selectedSnapshots},{onClose:()=>this.unfreeze(),onSubmit:a=>this.submit(a),onToggleMultiSelect:()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode()},onRemoveFromSelection:a=>this.removeFromSelection(a),onPanelDragStart:this.dragHandlers.handlePanelDragStart}):ke(this.panel,{componentName:s,filePath:r,submittedSnapshots:this.submittedSnapshots,activityEvents:this.activityEvents,currentStatus:this.currentStatus,autoCommitEnabled:this.autoCommitEnabled,userNote:this._userNote,interactionId:this.interactionId,phraseIndex:this.phraseIndex},{onClose:()=>this.unfreeze(),onSubmitFollowUp:a=>this.submitFollowUp(a),onSubmitAnswer:(a,l,c)=>this.handleSubmitAnswer(a,l,c),onCommit:()=>this.handleCommitRequest(),onUndo:()=>this.handleUndoFromPanel(),onPanelDragStart:this.dragHandlers.handlePanelDragStart})}hidePanel(){this.panel&&(this.panel.remove(),this.panel=null)}renderLens(){if(!this.currentSnapshot||!this.currentElement)return;this.lens||(this.lens=document.createElement("div"),this.lens.className="lens-card",this.shadow.appendChild(this.lens));let n={shadow:this.shadow,highlight:this.highlight,panel:this.panel,toast:this.toast,hub:this.hub,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot,interactionId:this.interactionId,frozen:this.frozen,mode:this.mode,activityEvents:this.activityEvents,currentStatus:this.currentStatus,hubExpanded:this.hubExpanded,hubPage:this.hubPage,inspectorEnabled:this.inspectorEnabled,autoCommitEnabled:this.autoCommitEnabled,themePreference:this.themePreference,history:this.history,isDragging:this.isDragging,dragOffset:this.dragOffset,customPanelPosition:this.customPanelPosition,multiSelectMode:this.multiSelectMode,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,submittedSnapshots:this.submittedSnapshots,cursorStyleElement:this.cursorStyleElement,throttleTimeout:this.throttleTimeout,scrollTimeout:this.scrollTimeout,phraseIndex:this.phraseIndex,phraseInterval:this.phraseInterval,_userNote:this._userNote,eventSource:this.eventSource},i={unfreeze:()=>this.unfreeze(),submit:a=>this.submit(a),submitFollowUp:a=>this.submitFollowUp(a),submitAnswer:(a,l,c)=>this.handleSubmitAnswer(a,l,c),requestUndo:a=>this.handleUndoRequest(a),requestCommit:a=>this.handleCommitRequest(),enterMultiSelectMode:()=>this.enterMultiSelectMode(),exitMultiSelectMode:()=>this.exitMultiSelectMode(),removeFromSelection:a=>this.removeFromSelection(a),toggleHubExpanded:()=>{this.hubExpanded=!this.hubExpanded,this.renderHub()},toggleInspectorEnabled:()=>this.toggleInspectorEnabled(),openSettingsPage:()=>{this.hubPage="settings",this.hubExpanded=!0,this.renderHub()},closeSettingsPage:()=>{this.hubPage="main",this.renderHub()},setTheme:a=>{this.themePreference=a,J(a),this.applyTheme()},toggleAutoCommit:()=>{this.autoCommitEnabled=!this.autoCommitEnabled,X(this.autoCommitEnabled)},handlePanelDragStart:this.dragHandlers.handlePanelDragStart,renderHub:()=>this.renderHub(),renderPanel:()=>this.renderPanel()};this.lens.innerHTML=Le(n,i);let o=this.currentElement.getBoundingClientRect(),s={width:220,height:this.lens.offsetHeight||200},r=Pe(o,s);this.lens.style.left=`${r.x}px`,this.lens.style.top=`${r.y}px`,this.wireLensEvents()}wireLensEvents(){if(!this.lens)return;let n=this.lens.querySelector(".lens-bar");n&&n.addEventListener("mousedown",this.dragHandlers.handleLensDragStart);let i=this.lens.querySelector('[data-action="toggle-schema"]');i&&i.addEventListener("click",()=>this.toggleSchemaView());let o=this.lens.querySelector('[data-action="close"]');o&&o.addEventListener("click",()=>this.unfreeze());let s=this.lens.querySelector(".lens-input");s&&(s.addEventListener("keydown",h=>{h.key==="Enter"&&s.value.trim()&&this.submit(s.value)}),setTimeout(()=>s.focus(),100));let r=this.lens.querySelector('[data-action="multi-select"]');r&&r.addEventListener("click",()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode(),this.renderLens()});let a=this.lens.querySelector('[data-action="toggle-context"]');a&&a.addEventListener("click",()=>this.toggleContextOverlays());let l=this.lens.querySelector('[data-action="peek-schema"]');l&&l.addEventListener("click",()=>this.toggleSchemaView());let c=this.lens.querySelector('[data-action="exit-multi"]');c&&c.addEventListener("click",()=>{this.exitMultiSelectMode(),this.renderLens()}),this.lens.querySelectorAll('[data-action="remove-selection"]').forEach(h=>{h.addEventListener("click",()=>{let p=parseInt(h.getAttribute("data-index")||"0",10);this.removeFromSelection(p),this.renderLens()})}),this.lens.querySelectorAll('[data-action="answer"]').forEach(h=>{h.addEventListener("click",()=>{let p=h.getAttribute("data-question-id")||"",u=h.getAttribute("data-answer-id")||"",m=h.getAttribute("data-answer-label")||"";this.handleSubmitAnswer(p,u,m)})});let d=this.lens.querySelector('[data-action="new-request"]');d&&d.addEventListener("click",()=>{this.mode="input",this.activityEvents=[],this.currentStatus="idle",this.renderLens()})}hideLens(){this.lens&&(this.lens.remove(),this.lens=null)}toggleContextOverlays(){this.showingContextOverlays?this.hideContextOverlays():this.showContextOverlays()}showContextOverlays(){!this.currentElement||!this.currentSnapshot||(this.showingContextOverlays=!0,this.contextOverlays=Ae(this.currentElement,this.currentSnapshot),this.contextOverlayElements=Ne(this.shadow,this.contextOverlays))}hideContextOverlays(){this.showingContextOverlays=!1,De(this.shadow),this.contextOverlays=[],this.contextOverlayElements=[]}toggleSchemaView(){if(!this.lens||!this.currentSnapshot)return;let n=this.lens.querySelector(".lens-schema"),i=this.lens.querySelector(".lens-schema-code");if(!n||!i)return;if(n.getAttribute("data-expanded")==="true")n.setAttribute("data-expanded","false");else{let s=JSON.stringify(this.currentSnapshot,null,2);i.innerHTML=this.highlightJson(s),n.setAttribute("data-expanded","true")}}highlightJson(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/("(?:\\.|[^"\\])*")\s*:/g,'<span class="json-key">$1</span>:').replace(/:\s*("(?:\\.|[^"\\])*")/g,': <span class="json-string">$1</span>').replace(/:\s*(\d+\.?\d*)/g,': <span class="json-number">$1</span>').replace(/:\s*(true|false)/g,': <span class="json-bool">$1</span>').replace(/:\s*(null)/g,': <span class="json-null">$1</span>').replace(/([{}\[\]])/g,'<span class="json-bracket">$1</span>')}startPhraseRotation(){this.phraseInterval||(this.phraseIndex=Math.floor(Math.random()*w.length),this.phraseInterval=window.setInterval(()=>{this.phraseIndex=(this.phraseIndex+1)%w.length,Ce(this.panel,this.currentStatus,this.phraseIndex)},1e4))}stopPhraseRotation(){this.phraseInterval&&(window.clearInterval(this.phraseInterval),this.phraseInterval=null)}async submit(n){if(!n.trim()||this.selectedSnapshots.length===0&&!this.currentSnapshot)return;this.interactionId=_(),this._userNote=n.trim();let i=this.selectedSnapshots.length>0?this.selectedSnapshots:this.currentSnapshot?[this.currentSnapshot]:[];this.submittedSnapshots=[...i];let o=Y(this.interactionId,n,i);this.history=W(this.history,o),b(this.history),this.renderHub();let s=this.multiSelectMode,r=[...this.selectedElements],a=[...this.selectedSnapshots];$({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.multiSelectMode=!1,this.mode="activity",this.activityEvents=[],this.currentStatus="pending",this.uiMode==="lens"?this.renderLens():this.renderPanel();let l=await U({interactionId:this.interactionId,userNote:n.trim(),autoCommit:this.autoCommitEnabled,snapshots:i});l.success||(this.currentStatus="failed",this.history=P(this.history,this.interactionId,"failed"),b(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:l.error||"Failed to connect to bridge",timestamp:Date.now()}),s&&r.length>1&&(this.multiSelectMode=!0,this.selectedElements=r,this.selectedSnapshots=a,this.mode="input",this.multiSelectHighlights=M({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none")),this.uiMode==="lens"?this.renderLens():this.renderPanel())}async submitFollowUp(n){if(!n.trim()||this.submittedSnapshots.length===0)return;this.interactionId=_(),this._userNote=n.trim();let i=this.submittedSnapshots,o=Y(this.interactionId,n,i);this.history=W(this.history,o),b(this.history),this.renderHub(),this.activityEvents=[],this.currentStatus="pending",this.uiMode==="lens"?this.renderLens():this.renderPanel();let s=await U({interactionId:this.interactionId,userNote:n.trim(),autoCommit:this.autoCommitEnabled,snapshots:i});s.success||(this.currentStatus="failed",this.history=P(this.history,this.interactionId,"failed"),b(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:s.error||"Failed to connect to bridge",timestamp:Date.now()}),this.uiMode==="lens"?this.renderLens():this.renderPanel())}async handleSubmitAnswer(n,i,o){if(!this.interactionId)return;let s=this.activityEvents.find(r=>r.type==="question"&&r.questionId===n);s&&(s.selectedAnswerId=i,s.selectedAnswerLabel=o),this.uiMode==="lens"?this.renderLens():this.renderPanel(),await me(this.interactionId,n,i,o)}async handleUndoRequest(n){let i=this.history.findIndex(s=>s.interactionId===n);if(i===-1)return;this.history[i].status="pending",b(this.history),this.renderHub(),(await fe(n)).success?this.history=Ue(this.history,n):this.history[i].status="failed",b(this.history),this.renderHub()}async handleUndoFromPanel(){this.interactionId&&await this.handleUndoRequest(this.interactionId)}async handleCommitRequest(){if(!this.interactionId)return;let n=this.history.findIndex(o=>o.interactionId===this.interactionId);(await be(this.interactionId)).success&&(n>=0&&(this.history[n].status="success",b(this.history),this.renderHub()),this.unfreeze())}};customElements.get("eyeglass-inspector")||customElements.define("eyeglass-inspector",A);function Qe(){if(document.querySelector("eyeglass-inspector")){console.warn("[eyeglass] Inspector already initialized");return}let e=document.createElement("eyeglass-inspector");document.body.appendChild(e),console.log("[eyeglass] Inspector initialized. Hover over elements and click to annotate.")}typeof window<"u"&&typeof document<"u"&&(typeof process<"u"||(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qe):Qe()));export{A as EyeglassInspector,y as captureSnapshot,R as extractFrameworkInfo,Qe as initInspector};

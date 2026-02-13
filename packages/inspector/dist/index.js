var rt=new Set([0,1,11,14,15]);function se(e){let t=Object.keys(e).find(s=>s.startsWith("__reactFiber$")||s.startsWith("__reactInternalInstance$"));return t?e[t]:null}function ie(e){if(!rt.has(e.tag)||typeof e.type!="function")return!1;let n=e.type.displayName||e.type.name||"";return!(!n||n==="StrictMode"||n==="Suspense"||n==="Fragment")}function oe(e){return e.type?.displayName||e.type?.name||void 0}function re(e){let n=e;for(;n;){if(ie(n))return n;n=n.return}return null}function ne(e){let n=[],t=e;for(;t;){if(ie(t)){let s=oe(t);s&&n.push(s)}t=t.return}return n}function at(e){if(!e)return{};let n={};for(let[t,s]of Object.entries(e)){if(t==="children")continue;let i=typeof s;(i==="string"||i==="number"||i==="boolean"||s===null||Array.isArray(s)&&s.every(o=>typeof o=="string"||typeof o=="number"))&&(n[t]=s)}return n}function M(e,n=0){if(n>2)return"[nested]";if(e==null)return e;let t=typeof e;if(t==="string"||t==="number"||t==="boolean")return e;if(t==="function")return"[function]";if(Array.isArray(e))return e.length>5?`[Array(${e.length})]`:e.map(s=>M(s,n+1));if(t==="object"){if(e.$$typeof)return"[React Element]";if(e instanceof Element||e instanceof Node)return"[DOM Node]";let s=Object.keys(e);if(s.length>10)return`[Object(${s.length} keys)]`;let i={};for(let o of s)i[o]=M(e[o],n+1);return i}return String(e)}function lt(e){if(e&&typeof e=="object"&&"baseState"in e&&"queue"in e)return e.queue?.lastRenderedReducer?.name==="basicStateReducer"?"useState":"useReducer";if(e&&typeof e=="object"&&"current"in e){let n=Object.keys(e);if(n.length===1&&n[0]==="current")return"useRef"}if(Array.isArray(e)&&e.length===2&&Array.isArray(e[1]))return typeof e[0]=="function"?"useCallback":"useMemo";if(e&&typeof e=="object"&&"tag"in e&&"create"in e){if(e.tag&4)return"useEffect";if(e.tag&2)return"useLayoutEffect"}return"unknown"}function ct(e,n){switch(n){case"useState":case"useReducer":return M(e.baseState);case"useRef":return M(e.current);case"useMemo":return M(e[0]);case"useCallback":return"[callback]";case"useEffect":case"useLayoutEffect":return;default:return M(e)}}function dt(e){let n=[];if(e.tag!==0&&e.tag!==11&&e.tag!==14&&e.tag!==15)return n;let t=e.memoizedState,s=0;for(;t!=null;){let i=t.memoizedState!==void 0?t.memoizedState:t,o=lt(i);if(o!=="unknown"&&n.push({name:o,value:ct(i,o),label:`hook_${s}`}),t=t.next,s++,s>100)break}return n}function ut(e){return e.tag===10}function pt(e){let n=e.type?._context||e.type;return n?.displayName||n?.Provider?.displayName||"Context"}function ht(e){let n=[],t=new Set,s=e.return;for(;s;){if(ut(s)){let i=s.type?._context;i&&!t.has(i)&&(t.add(i),n.push({name:pt(s),value:M(s.memoizedProps?.value)}))}s=s.return}return n}function gt(e,n){if(!e||!n)return[];let t=[],s=new Set([...Object.keys(e),...Object.keys(n)]);for(let i of s){if(i==="children")continue;let o=e[i],r=n[i];o!==r&&t.push(i)}return t}function mt(e){let n=e.alternate;if(!n)return{renderCount:1,lastRenderReason:"Initial render"};let t={renderCount:2},s=gt(n.memoizedProps,e.memoizedProps);if(s.length>0){if(t.changedProps=s,s.includes("style")){let i=n.memoizedProps?.style,o=e.memoizedProps?.style;if(i&&o&&JSON.stringify(i)===JSON.stringify(o))return t.lastRenderReason="Prop 'style' changed identity (same value, new object)",t}return t.lastRenderReason=`Props changed: ${s.join(", ")}`,t}return e.memoizedState!==n.memoizedState?(t.lastRenderReason="State changed (hook update)",t):(t.lastRenderReason="Parent re-rendered",t)}function q(e){let n=se(e);if(!n)return{type:"vanilla",name:"vanilla"};let t=re(n);if(t){let i=oe(t),o=t._debugSource,r=ne(t),a=at(t.memoizedProps),c=dt(t),d=ht(t);return{type:"react",displayName:i,key:t.key,filePath:o?.fileName,lineNumber:o?.lineNumber,ancestry:r.length>0?r:void 0,state:{props:a,hooks:c,context:d},name:"react",componentName:i,props:a}}let s=ne(n);return{type:"react",name:"react",ancestry:s.length>0?s:void 0}}function ae(e){let n=se(e);if(!n)return null;let t=re(n);return t?mt(t):null}var ue={"gray-50":["rgb(249, 250, 251)","#f9fafb"],"gray-100":["rgb(243, 244, 246)","#f3f4f6"],"gray-200":["rgb(229, 231, 235)","#e5e7eb"],"gray-300":["rgb(209, 213, 219)","#d1d5db"],"gray-400":["rgb(156, 163, 175)","#9ca3af"],"gray-500":["rgb(107, 114, 128)","#6b7280"],"gray-600":["rgb(75, 85, 99)","#4b5563"],"gray-700":["rgb(55, 65, 81)","#374151"],"gray-800":["rgb(31, 41, 55)","#1f2937"],"gray-900":["rgb(17, 24, 39)","#111827"],"red-500":["rgb(239, 68, 68)","#ef4444"],"red-600":["rgb(220, 38, 38)","#dc2626"],"orange-500":["rgb(249, 115, 22)","#f97316"],"amber-500":["rgb(245, 158, 11)","#f59e0b"],"yellow-500":["rgb(234, 179, 8)","#eab308"],"green-500":["rgb(34, 197, 94)","#22c55e"],"green-600":["rgb(22, 163, 74)","#16a34a"],"emerald-500":["rgb(16, 185, 129)","#10b981"],"teal-500":["rgb(20, 184, 166)","#14b8a6"],"cyan-500":["rgb(6, 182, 212)","#06b6d4"],"sky-500":["rgb(14, 165, 233)","#0ea5e9"],"blue-500":["rgb(59, 130, 246)","#3b82f6"],"blue-600":["rgb(37, 99, 235)","#2563eb"],"indigo-500":["rgb(99, 102, 241)","#6366f1"],"indigo-600":["rgb(79, 70, 229)","#4f46e5"],"violet-500":["rgb(139, 92, 246)","#8b5cf6"],"purple-500":["rgb(168, 85, 247)","#a855f7"],"fuchsia-500":["rgb(217, 70, 239)","#d946ef"],"pink-500":["rgb(236, 72, 153)","#ec4899"],"rose-500":["rgb(244, 63, 94)","#f43f5e"],white:["rgb(255, 255, 255)","#ffffff","#fff"],black:["rgb(0, 0, 0)","#000000","#000"],transparent:["rgba(0, 0, 0, 0)","transparent"]},ft={0:[0],1:[4],2:[8],3:[12],4:[16],5:[20],6:[24],8:[32],10:[40],12:[48],16:[64],20:[80],24:[96]};function le(e){return e.toLowerCase().replace(/\s+/g,"")}function ce(e){let n=le(e);for(let[t,s]of Object.entries(ue))if(s.some(i=>le(i)===n))return t;return null}function bt(e){let n=e.match(/^(\d+(?:\.\d+)?)(px)?$/);return n?parseFloat(n[1]):null}function vt(e){let n=bt(e);if(n===null)return null;for(let[t,s]of Object.entries(ft))if(s.includes(n))return`spacing-${t}`;return null}function de(e){let n=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!n)return null;let t=parseInt(n[1]),s=parseInt(n[2]),i=parseInt(n[3]),o=null,r=1/0;for(let[a,c]of Object.entries(ue))for(let d of c){let l=d.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(l){let p=parseInt(l[1]),h=parseInt(l[2]),u=parseInt(l[3]),g=Math.sqrt(Math.pow(t-p,2)+Math.pow(s-h,2)+Math.pow(i-u,2));g<r&&g<50&&(r=g,o=a)}}return o}function xt(e){let n=[],t=[],s=ce(e.color);if(s)n.push({property:"color",token:s});else if(e.color&&e.color!=="transparent"){let r=de(e.color);r&&t.push({property:"color",value:e.color,suggestion:`Consider using ${r}`})}let i=ce(e.backgroundColor);if(i)n.push({property:"backgroundColor",token:i});else if(e.backgroundColor&&e.backgroundColor!=="transparent"&&e.backgroundColor!=="rgba(0, 0, 0, 0)"){let r=de(e.backgroundColor);r&&t.push({property:"backgroundColor",value:e.backgroundColor,suggestion:`Consider using ${r}`})}let o=e.padding.split(" ");for(let r of o){let a=vt(r);if(a){n.push({property:"padding",token:a});break}}return{tokenMatches:n,deviations:t}}function yt(e){if(!e)return"Local";let n=e.toLowerCase();return n.includes("/shared/")||n.includes("/common/")||n.includes("/core/")||n.includes("/ui/")||n.includes("/components/ui/")?"Critical":n.includes("/lib/")||n.includes("/primitives/")||n.includes("/atoms/")?"Moderate":"Local"}function pe(e,n){let{tokenMatches:t,deviations:s}=xt(n);return{impact:{riskLevel:yt(e)},designSystem:{tokenMatches:t,deviations:s}}}function St(e){let n=e.getAttribute("aria-label"),t=e.getAttribute("aria-describedby"),s=e.getAttribute("aria-disabled"),i=e.getAttribute("aria-expanded"),o=e.getAttribute("aria-checked"),r=e.getAttribute("aria-hidden"),a=null;t&&(a=document.getElementById(t)?.textContent?.trim()||null);let c=s==="true"||e.disabled||e.hasAttribute("disabled");return{label:n||e.getAttribute("title")||null,description:a,disabled:c,expanded:i?i==="true":void 0,checked:o==="true"?!0:o==="false"?!1:o==="mixed"?"mixed":void 0,hidden:r==="true"||e.hidden||!1}}function wt(e){let n=e.getBoundingClientRect();return{x:Math.round(n.x),y:Math.round(n.y),width:Math.round(n.width),height:Math.round(n.height),visible:n.width>0&&n.height>0}}function Et(e){let n=getComputedStyle(e);return{display:n.display,position:n.position,flexDirection:n.flexDirection!=="row"?n.flexDirection:void 0,gridTemplate:n.display==="grid"?`${n.gridTemplateColumns} / ${n.gridTemplateRows}`:void 0,padding:n.padding,margin:n.margin,color:n.color,backgroundColor:n.backgroundColor,fontFamily:n.fontFamily,zIndex:n.zIndex}}function kt(e){let n=e.getAttribute("role");if(n)return n;let t=e.tagName.toLowerCase();return{a:"link",button:"button",input:e.type||"textbox",select:"combobox",textarea:"textbox",img:"img",nav:"navigation",main:"main",header:"banner",footer:"contentinfo",aside:"complementary",article:"article",section:"region",form:"form",ul:"list",ol:"list",li:"listitem",table:"table",tr:"row",td:"cell",th:"columnheader",dialog:"dialog",h1:"heading",h2:"heading",h3:"heading",h4:"heading",h5:"heading",h6:"heading"}[t]||"generic"}function Ct(e){let n=e.getAttribute("aria-label");if(n)return n;let t=e.getAttribute("aria-labelledby");if(t){let i=document.getElementById(t);if(i)return i.textContent?.trim()||""}if(e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"){let i=e.getAttribute("id");if(i){let o=document.querySelector(`label[for="${i}"]`);if(o)return o.textContent?.trim()||""}}if(e.tagName==="IMG")return e.alt||"";let s=e.textContent?.trim()||"";return s.length>50?s.slice(0,50)+"...":s}function Mt(e){let n={},t=e.getAttribute("id");t&&(n.id=t);let s=e.getAttribute("class");s?.trim()&&(n.className=s.trim());let i={};for(let o=0;o<e.attributes.length;o++){let r=e.attributes[o];r.name.startsWith("data-")&&(i[r.name]=r.value)}return Object.keys(i).length>0&&(n.dataAttributes=i),n}function It(e){let n=getComputedStyle(e),t={display:n.display,position:n.position};return n.display.includes("flex")&&(n.flexDirection!=="row"&&(t.flexDirection=n.flexDirection),n.alignItems!=="normal"&&(t.alignItems=n.alignItems),n.justifyContent!=="normal"&&(t.justifyContent=n.justifyContent),n.gap!=="normal"&&n.gap!=="0px"&&(t.gap=n.gap)),n.display.includes("grid")&&(t.gridTemplate=`${n.gridTemplateColumns} / ${n.gridTemplateRows}`),t}function Lt(e){let n=[],t=[],s=e.parentElement,i=0;for(;s&&i<2&&s!==document.body&&s!==document.documentElement;){let r=s.getAttribute("class")?.trim();n.push({tagName:s.tagName.toLowerCase(),...r&&{className:r},styles:It(s)}),s=s.parentElement,i++}let o=new Map;for(let r of Array.from(e.children)){let a=r.tagName.toLowerCase(),c=r.getAttribute("class")?.trim(),d=`${a}:${c||""}`;o.has(d)?o.get(d).count++:o.set(d,{className:c||void 0,count:1})}for(let[r,a]of o){let c=r.split(":")[0];t.push({tagName:c,...a.className&&{className:a.className},...a.count>1&&{count:a.count}})}return{parents:n,children:t}}function $(e){let n=e.tagName.toLowerCase(),t=e.id?`#${e.id}`:"",s=e.className&&typeof e.className=="string"?"."+e.className.split(/\s+/).filter(Boolean).slice(0,2).join("."):"";return`${n}${t}${s}`}function A(e){let n=[];if(typeof window.getEventListeners=="function")try{let o=window.getEventListeners(e);for(let r of Object.keys(o))for(let a of o[r])n.push({type:r,capture:a.capture||!1,source:a.listener?.toString?.()?.slice(0,50)});return n}catch{}let t=["onclick","onmousedown","onmouseup","onmouseover","onmouseout","onfocus","onblur","onkeydown","onkeyup","onkeypress","onchange","oninput","onsubmit","ontouchstart","ontouchend"];for(let o of t)(e.hasAttribute(o)||e[o])&&n.push({type:o.slice(2),capture:!1});let i=Object.keys(e).find(o=>o.startsWith("__reactProps$"));if(i){let o=e[i];if(o){for(let r of Object.keys(o))if(r.startsWith("on")&&typeof o[r]=="function"){let a=r.slice(2).toLowerCase();n.some(c=>c.type===a)||n.push({type:a,capture:!1,source:"React synthetic event"})}}}return n}function Ht(e){let n=[];function t(r,a){n.push({element:$(r),event:"all",reason:a})}function s(r,a){a.pointerEvents==="none"&&t(r,"pointer-events:none"),a.visibility==="hidden"&&t(r,"visibility:hidden"),parseFloat(a.opacity)===0&&t(r,"opacity:0")}let i=getComputedStyle(e);s(e,i),e.inert&&t(e,"inert");let o=e.parentElement;for(;o&&o!==document.body;){let r=getComputedStyle(o);s(o,r),o.inert&&t(o,"inert");let a=A(o);for(let c of a)c.capture&&n.push({element:$(o),event:c.type,reason:"captured"});o=o.parentElement}return n}function Tt(e){let n=getComputedStyle(e),t=[{check:n.position==="fixed"||n.position==="sticky",reason:"position:fixed/sticky"},{check:(n.position==="absolute"||n.position==="relative")&&n.zIndex!=="auto",reason:"positioned with z-index"},{check:parseFloat(n.opacity)<1,reason:"opacity"},{check:n.transform!=="none",reason:"transform"},{check:n.filter!=="none",reason:"filter"},{check:n.perspective!=="none",reason:"perspective"},{check:n.clipPath!=="none",reason:"clip-path"},{check:n.mask!=="none"&&n.mask!=="",reason:"mask"},{check:n.isolation==="isolate",reason:"isolation:isolate"},{check:n.mixBlendMode!=="normal",reason:"mix-blend-mode"},{check:n.willChange.includes("transform")||n.willChange.includes("opacity"),reason:"will-change"},{check:n.contain==="layout"||n.contain==="paint"||n.contain==="strict"||n.contain==="content",reason:"contain"}],s=t.some(c=>c.check),i=t.find(c=>c.check)?.reason,o=null,r=n.zIndex==="auto"?0:parseInt(n.zIndex,10)||0,a=e.parentElement;for(;a&&a!==document.body;){let c=getComputedStyle(a);if([c.position==="fixed"||c.position==="sticky",(c.position==="absolute"||c.position==="relative")&&c.zIndex!=="auto",parseFloat(c.opacity)<1,c.transform!=="none"].some(Boolean)){o=$(a);break}a=a.parentElement}return{isStackingContext:s,parentContext:o,reason:i,effectiveZIndex:r}}function Pt(e){let n=[],t=getComputedStyle(e),s=e.parentElement;if(s){let i=getComputedStyle(s);i.display.includes("flex")&&(t.flexGrow!=="0"&&n.push(`Flex grow: ${t.flexGrow}`),t.flexShrink!=="1"&&n.push(`Flex shrink: ${t.flexShrink}`),t.flexBasis!=="auto"&&n.push(`Flex basis: ${t.flexBasis}`),t.alignSelf!=="auto"&&n.push(`Align self: ${t.alignSelf}`)),i.display.includes("grid")&&(t.gridColumn!=="auto"&&n.push(`Grid column: ${t.gridColumn}`),t.gridRow!=="auto"&&n.push(`Grid row: ${t.gridRow}`))}return t.maxWidth!=="none"&&n.push(`Max width: ${t.maxWidth}`),t.minWidth!=="0px"&&t.minWidth!=="auto"&&n.push(`Min width: ${t.minWidth}`),t.maxHeight!=="none"&&n.push(`Max height: ${t.maxHeight}`),t.overflow!=="visible"&&n.push(`Overflow: ${t.overflow}`),n}function $t(e){return{events:{listeners:A(e),blockingHandlers:Ht(e)},stackingContext:Tt(e),layoutConstraints:Pt(e)}}function B(e){let n=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);return n?{r:parseInt(n[1],10),g:parseInt(n[2],10),b:parseInt(n[3],10),a:n[4]?parseFloat(n[4]):1}:e==="transparent"||e==="rgba(0, 0, 0, 0)"?{r:0,g:0,b:0,a:0}:null}function he(e,n,t){let[s,i,o]=[e,n,t].map(r=>(r=r/255,r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4)));return .2126*s+.7152*i+.0722*o}function At(e,n){let t=he(e.r,e.g,e.b),s=he(n.r,n.g,n.b),i=Math.max(t,s),o=Math.min(t,s);return(i+.05)/(o+.05)}function Dt(e){let n=e,t="rgb(255, 255, 255)";for(;n&&n!==document.documentElement;){let i=getComputedStyle(n).backgroundColor,o=B(i);if(o&&o.a>0&&(t=i,o.a===1))break;n=n.parentElement}return t}function Rt(e){let n=getComputedStyle(e),t=B(n.color),s=Dt(e),i=B(s),o=1;t&&i&&(o=At(t,i));let r=parseFloat(n.fontSize),a=parseInt(n.fontWeight,10)||400,d=r>=18||r>=14&&a>=700?3:4.5;return{contrastRatio:Math.round(o*100)/100,wcagStatus:o>=d?"pass":"fail",effectiveBgColor:s}}function zt(e){let n=e.getBoundingClientRect();if(n.width===0||n.height===0)return{isOccluded:!1,effectiveOpacity:0};let t=1,s=e;for(;s&&s!==document.documentElement;){let h=getComputedStyle(s);t*=parseFloat(h.opacity),s=s.parentElement}let i=[],o=n.left+n.width/2,r=n.top+n.height/2;i.push({x:o,y:r});let a=[.25,.75];for(let h of a)for(let u of a)i.push({x:n.left+n.width*h,y:n.top+n.height*u});let c,d=!1,l=e instanceof HTMLElement?e:null,p=l?l.style.pointerEvents:"";l&&(l.style.pointerEvents="auto");for(let h of i){let u=document.elementFromPoint(h.x,h.y);if(!(!u||u===e||e.contains(u))&&!u.contains(e)){d=!0,c=$(u);break}}return l&&(l.style.pointerEvents=p),{isOccluded:d,occludedBy:c,effectiveOpacity:Math.round(t*100)/100}}function Nt(e){let n=getComputedStyle(e),t=e.tagName.toLowerCase(),s=n.cursor==="pointer"||n.textDecoration.includes("underline")||t==="a"||t==="button"||n.color.includes("0, 0, 255")||n.color.includes("0, 102, 204")||e.getAttribute("role")==="button"||e.getAttribute("role")==="link",o=A(e).length>0,r=["a","button","input","select","textarea","label"].includes(t),a=e.hasAttribute("tabindex")&&e.getAttribute("tabindex")!=="-1",c=!!e.closest("[inert]"),d=e.disabled||e.getAttribute("aria-disabled")==="true"||n.pointerEvents==="none",l=!c&&!d&&(o||r||a),p=0;return s&&!l?p=.7:!s&&l&&(p=.3),{looksInteractable:s,isInteractable:l,dissonanceScore:p}}function Ot(e){let n=e.getBoundingClientRect(),t=Math.round(n.width),s=Math.round(n.height),i=t>=44&&s>=44;return{touchTargetSize:`${t}x${s}`,isTouchTargetValid:i}}function Ft(e){return{affordance:Nt(e),visibility:zt(e),legibility:Rt(e),usability:Ot(e)}}function qt(e){let n=getComputedStyle(e),t=A(e),s=n.transform!=="none"||n.willChange.includes("transform")||n.willChange.includes("opacity"),i="none";n.position==="absolute"||n.position==="fixed"?i="none":n.display==="inline"?i="low":t.some(r=>["scroll","resize","mousemove"].includes(r.type))&&(i="high");let o=ae(e);return{pipeline:{layerPromoted:s,layoutThrashingRisk:i},performance:{renderCount:o?.renderCount||0,lastRenderReason:o?.lastRenderReason},memory:{listenerCount:t.length}}}function S(e,n){let t=Mt(e),s=q(e),i=Et(e);return{role:kt(e),name:Ct(e),tagName:e.tagName.toLowerCase(),...t,framework:s,a11y:St(e),geometry:wt(e),styles:i,causality:$t(e),perception:Ft(e),metal:qt(e),systemic:pe(s.filePath,i),neighborhood:Lt(e),interactionState:n,timestamp:Date.now(),url:window.location.href}}var I="http://localhost:3300",T="eyeglass_session",j="eyeglass_history",_="eyeglass_enabled",Y="eyeglass_autocommit",U="eyeglass_theme";var L=["Ruminating...","Percolating...","Divining...","Grokking...","Communing...","Concocting...","Synthesizing...","Distilling...","Incubating...","Forging...","Scrutinizing...","Triangulating...","Unraveling...","Traversing...","Sifting...","Marshaling...","Hydrating...","Harmonizing...","Indexing...","Entangling..."],ge="crosshair";var me=`
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

/* Crosshair axes */
.crosshair {
  position: fixed;
  background: var(--accent);
  opacity: 0;
  pointer-events: none;
  z-index: 2147483639;
  transition: opacity 0.08s ease-out;
}

.crosshair.crosshair-x {
  left: 0;
  top: 0;
  width: 100vw;
  height: 1px;
  transform: translateY(0);
}

.crosshair.crosshair-y {
  top: 0;
  left: 0;
  width: 1px;
  height: 100vh;
  transform: translateX(0);
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
  border: 1px solid var(--accent);
}

.btn-primary:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--accent-muted);
  border-color: var(--accent-muted);
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

.btn-secondary:active {
  background: rgba(0, 0, 0, 0.12);
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

.hub-pause {
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

.hub-pause:hover {
  color: var(--text-secondary);
}

.hub-pause.active {
  color: var(--accent);
}

.hub-pause svg {
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
  max-height: 320px;
  overflow-y: auto;
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
  margin-bottom: 10px;
}

.hub-shortcuts-list {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px 8px;
  align-items: center;
}

.hub-shortcut-row {
  display: contents;
}

.hub-shortcut-label {
  font-size: 9px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.hub-shortcut-keys {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.hub-shortcut-keys kbd {
  display: inline-block;
  padding: 2px 6px;
  font-size: 8px;
  font-family: inherit;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid var(--glass-border);
  border-radius: 4px;
  min-width: 22px;
  text-align: center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
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

/* Independent DOM Pause Button */
.dom-pause-btn {
  position: fixed;
  bottom: 16px;
  left: 204px;
  width: 32px;
  height: 32px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: color 0.1s, background 0.1s;
  animation: hubIn 0.15s ease-out;
}

.dom-pause-btn:hover {
  color: var(--text-secondary);
}

.dom-pause-btn.active {
  color: var(--accent);
  background: var(--accent-soft);
}

.dom-pause-btn svg {
  width: 16px;
  height: 16px;
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

`;function v(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}function V(e,n){switch(e){case"idle":return"Ready";case"pending":return"Waiting for agent...";case"fixing":return L[n%L.length];case"success":return"Done!";case"failed":return"Failed";default:return e}}function fe(e,n,t,s){if(e&&(!n||t)){let o=s;return o||(o=document.createElement("style"),o.id="eyeglass-cursor-style",document.head.appendChild(o)),o.textContent=`
      html, body, body * {
        cursor: ${ge} !important;
      }
    `,o}else return s&&(s.textContent=""),s}function D(){return`eyeglass-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function K(e){let n=[];e.perception?.legibility?.wcagStatus==="fail"&&n.push({level:"critical",category:"accessibility",message:"Low contrast ratio",details:`Contrast ratio: ${e.perception.legibility.contrastRatio}:1 (WCAG requires 4.5:1)`}),e.a11y?.hidden&&e.perception?.affordance?.isInteractable&&n.push({level:"critical",category:"accessibility",message:"Hidden but interactive",details:"Element is marked as hidden but has event listeners"});let t=e.metal?.performance?.lastRenderReason;if(t?.includes("'style' changed identity")&&n.push({level:"warning",category:"performance",message:"Inline style causing re-renders",details:t}),e.metal?.pipeline?.layoutThrashingRisk==="high"&&n.push({level:"warning",category:"performance",message:"Layout thrashing risk",details:"Element has listeners that may cause frequent layout recalculations"}),e.perception?.usability?.isTouchTargetValid===!1){let c=e.perception.usability.touchTargetSize;e.perception?.affordance?.isInteractable&&n.push({level:"warning",category:"usability",message:"Touch target too small",details:`Size: ${c} (should be at least 44x44)`})}e.perception?.affordance?.dissonanceScore&&e.perception.affordance.dissonanceScore>.5&&n.push({level:"warning",category:"usability",message:"Affordance mismatch",details:e.perception.affordance.looksInteractable?"Element looks clickable but has no interaction":"Element is interactive but does not look clickable"}),e.perception?.visibility?.isOccluded&&n.push({level:"warning",category:"usability",message:"Element is occluded",details:`Covered by: ${e.perception.visibility.occludedBy}`});let s=e.causality?.events?.blockingHandlers||[];s.some(c=>c.reason==="inert")&&n.push({level:"critical",category:"events",message:"Container is inert",details:"Ancestor uses the inert attribute, blocking pointer/keyboard events"});let i=e.perception?.affordance?.looksInteractable,o=e.perception?.affordance?.isInteractable,r=e.perception?.visibility?.occludedBy;i&&r&&n.push({level:"warning",category:"usability",message:"Looks clickable but covered",details:r}),i&&!o&&s.length>0&&n.push({level:"warning",category:"events",message:"Appears interactive but events are blocked",details:s.map(c=>`${c.reason} @ ${c.element}`).join(", ")});let a=s;if(a.length>0){let c=a.find(l=>l.reason==="pointer-events:none"),d=a.filter(l=>l.reason==="captured");c&&n.push({level:"critical",category:"events",message:"Events blocked",details:`pointer-events: none on ${c.element}`}),d.length>0&&n.push({level:"warning",category:"events",message:"Events may be captured",details:`${d.length} ancestor(s) using capture phase`})}return n}function be(e){let n=K(e);return n.some(t=>t.level==="critical")?"critical":n.some(t=>t.level==="warning")?"warning":"healthy"}function R(e){switch(e){case"critical":return"#ef4444";case"warning":return"#f59e0b";case"healthy":return"#10b981"}}function ve(e){let n=new EventSource(`${I}/events`);return n.onmessage=t=>{try{let s=JSON.parse(t.data);s.type==="activity"&&e.onActivityEvent(s.payload)}catch{}},n.onerror=()=>{n.close(),setTimeout(()=>e.onReconnect(),3e3)},n}async function G(e){let n={interactionId:e.interactionId,userNote:e.userNote.trim(),autoCommit:e.autoCommit,...e.snapshots.length===1?{snapshot:e.snapshots[0]}:{snapshots:e.snapshots}};try{let t=await fetch(`${I}/focus`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});return t.ok?{success:!0}:{success:!1,error:`HTTP ${t.status}`}}catch{return{success:!1,error:"Failed to connect to bridge"}}}async function xe(e,n,t,s){let i={interactionId:e,questionId:n,answerId:t,answerLabel:s};try{await fetch(`${I}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})}catch{}}async function ye(e){try{return{success:(await fetch(`${I}/undo`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:e})})).ok}}catch(n){return console.warn("Undo request failed:",n),{success:!1}}}async function Se(e){try{return(await fetch(`${I}/commit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({interactionId:e})})).ok?{success:!0}:(console.warn("Commit request failed"),{success:!1})}catch(n){return console.warn("Commit request failed:",n),{success:!1}}}function X(e,n,t){let s=t.map(o=>o.framework.componentName||o.tagName),i=t.length===1?s[0]:`${s.length} elements`;return{interactionId:e,userNote:n.trim(),componentName:i,filePath:t[0]?.framework.filePath,status:"pending",timestamp:Date.now()}}var we=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
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
</svg>`,Bt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',jt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',_t='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',Yt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',Ut='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 5 18 12 8 19 8 5"/></svg>',Vt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',Kt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',Gt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';function Ee(e,n,t){let s=n.hubExpanded?"":"collapsed",i=n.inspectorEnabled?"":"disabled",o=n.hubExpanded?"expanded":"",r=n.history.filter(l=>l.status==="pending"||l.status==="fixing").length;e.className=`hub ${s} ${i}`.trim(),e.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${we}</div>
        ${r>0?`<span class="hub-badge">${r}</span>`:""}
        <button class="hub-toggle ${o}" title="Toggle history">\u25BC</button>
      </div>
      <div class="hub-button-group">
      <button class="hub-settings-btn" title="Settings">${_t}</button>
      <button class="hub-disable ${n.inspectorEnabled?"active":""}" title="${n.inspectorEnabled?"Disable":"Enable"} inspector (\u2318/Ctrl + Shift + E)">
        ${n.inspectorEnabled?Bt:jt}
      </button>
      </div>
    </div>
    <div class="hub-content ${o}">
      ${n.history.length>0?`
        <div class="hub-list">
          ${n.history.map(l=>`
            <div class="hub-item" data-id="${l.interactionId}">
              <div class="hub-item-status ${l.status}"></div>
              <div class="hub-item-content">
                <div class="hub-item-component">${v(l.componentName)}</div>
                <div class="hub-item-note">${v(l.userNote)}</div>
              </div>
              ${l.status==="success"?`
                <button class="hub-item-undo" data-id="${l.interactionId}" title="Undo">\u21A9</button>
              `:""}
            </div>
          `).join("")}
        </div>
      `:`
        <div class="hub-empty">No requests yet</div>
      `}
    </div>
  `;let a=e.querySelector(".hub-header"),c=e.querySelector(".hub-disable"),d=e.querySelector(".hub-settings-btn");a.addEventListener("click",l=>{l.target===c||l.target===d||l.target.closest(".hub-settings-btn")||t.onToggleExpanded()}),d.addEventListener("click",l=>{l.stopPropagation(),t.onOpenSettings()}),c.addEventListener("click",l=>{l.stopPropagation(),t.onToggleEnabled()}),e.querySelectorAll(".hub-item-undo").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation();let h=p.currentTarget.dataset.id;t.onUndo(h)})})}function ke(e,n,t){e.className="hub",e.innerHTML=`
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${we}</div>
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
              <button class="theme-btn ${n.themePreference==="light"?"active":""}" data-theme="light" title="Light">${Vt}</button>
              <button class="theme-btn ${n.themePreference==="auto"?"active":""}" data-theme="auto" title="Auto">${Gt}</button>
              <button class="theme-btn ${n.themePreference==="dark"?"active":""}" data-theme="dark" title="Dark">${Kt}</button>
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
        <div class="hub-shortcuts-section">
          <div class="hub-shortcuts-title">Keyboard Shortcuts</div>
          <div class="hub-shortcuts-list">
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle inspector</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC")>=0?"\u2318":"Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>E</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle multi-select</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC")>=0?"\u2318":"Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>M</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle context overlays</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC")>=0?"\u2318":"Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>C</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Submit request</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC")>=0?"\u2318":"Ctrl"}</kbd> <kbd>Enter</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Close panel / cancel</span>
              <span class="hub-shortcut-keys"><kbd>Esc</kbd></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,e.querySelector(".hub-back-btn").addEventListener("click",()=>{t.onBack()}),e.querySelectorAll(".theme-btn").forEach(i=>{i.addEventListener("click",o=>{let r=o.currentTarget.dataset.theme;t.onThemeChange(r)})}),e.querySelectorAll(".toggle-switch").forEach(i=>{i.addEventListener("click",o=>{o.currentTarget.dataset.setting==="autoCommit"&&t.onAutoCommitToggle()})})}function Ce(e,n,t){e.className=`dom-pause-btn ${n.domPaused?"active":""}`,e.title=n.domPaused?"Resume DOM (\u2318/Ctrl + Shift + U)":"Pause DOM (\u2318/Ctrl + Shift + U)",e.innerHTML=n.domPaused?Ut:Yt;let s=e.cloneNode(!0);e.parentNode?.replaceChild(s,e),s.addEventListener("click",()=>{t.onToggleDomPause()})}function Me(e,n){let t=[];for(let s of e)if(s.type==="status"){if(s.status==="pending"||s.status==="fixing"&&(!s.message||s.message==="Agent is working..."))continue;t.push(Xt(s))}else s.type==="thought"?t.push(Wt(s)):s.type==="action"?t.push(Jt(s)):s.type==="question"&&t.push(Qt(s,e));return t.length===0&&(n==="pending"||n==="fixing")?`
      <div class="skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-line"></div>
      </div>
    `:t.join("")}function Xt(e){let n=e.status==="success"?"success":e.status==="failed"?"error":"status",t=e.status==="success"?"\u2713":e.status==="failed"?"\u2715":"\u25CF";return`
    <div class="activity-item">
      <div class="activity-icon ${n}">${t}</div>
      <div class="activity-content">
        <div class="activity-text">${v(e.message||e.status)}</div>
      </div>
    </div>
  `}function Wt(e){return`
    <div class="activity-item">
      <div class="activity-icon thought">\u{1F4AD}</div>
      <div class="activity-content">
        <div class="activity-text muted">${v(e.content)}</div>
      </div>
    </div>
  `}function Jt(e){let n={reading:"\u{1F4D6}",writing:"\u270F\uFE0F",searching:"\u{1F50D}",thinking:"\u{1F9E0}"},t={reading:"Reading",writing:"Writing",searching:"Searching",thinking:"Thinking about"};return`
    <div class="activity-item">
      <div class="activity-icon action">${n[e.action]||"\u25CF"}</div>
      <div class="activity-content">
        <div class="activity-text">${t[e.action]||e.action}${e.complete?" \u2713":"..."}</div>
        <div class="activity-target">${v(e.target)}</div>
      </div>
    </div>
  `}function Qt(e,n){return e.selectedAnswerId?`
      <div class="activity-item">
        <div class="activity-icon question">?</div>
        <div class="activity-content">
          <div class="activity-text muted">${v(e.question)}</div>
          <div class="activity-target">${v(e.selectedAnswerLabel||e.selectedAnswerId)}</div>
        </div>
      </div>
    `:`
    <div class="question-box">
      <div class="question-text">${v(e.question)}</div>
      <div class="question-options">
        ${e.options.map(t=>`
          <button
            class="question-option"
            data-question-id="${e.questionId}"
            data-answer-id="${t.id}"
          >${v(t.label)}</button>
        `).join("")}
      </div>
    </div>
  `}function Ie(e,n,t){if(t)return t;let s=window.innerHeight-e.bottom,i=n==="activity"?400:200,o=e.bottom+12;s<i&&e.top>i&&(o=e.top-i-12);let r=20,a=window.innerHeight-i-20;o=Math.max(r,Math.min(o,a));let c=e.left;return c+340>window.innerWidth-20&&(c=window.innerWidth-360),c<20&&(c=20),{x:c,y:o}}function Le(e,n,t){let s=n.multiSelectMode,i=s?"multi-select-icon active":"multi-select-icon",o=s?`
    <div class="selected-list">
      <div class="selected-list-header">
        <span class="selected-count">${n.selectedSnapshots.length} element${n.selectedSnapshots.length!==1?"s":""} selected</span>
      </div>
      <div class="selected-chips">
        ${n.selectedSnapshots.map((u,g)=>{let y=u.framework.componentName||u.tagName;return`
            <div class="selected-chip" data-index="${g}">
              <span class="selected-chip-number">${g+1}</span>
              <span>${v(y)}</span>
              <button class="selected-chip-remove" data-index="${g}" title="Remove">&times;</button>
            </div>
          `}).join("")}
      </div>
    </div>
  `:"",r=s?`
    <div class="multi-mode-hint">Click elements to add/remove from selection</div>
  `:"";e.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">&lt;${v(n.componentName)} /&gt;</span>
      ${n.filePath?`<span class="file-path">${v(n.filePath)}</span>`:""}
      <button class="${i}" title="${s?"Exit multi-select (Esc)":"Multi-select (\u2318/Ctrl + Shift + M)"}">+</button>
      <button class="close-btn" title="Cancel (Esc)">&times;</button>
    </div>
    ${r}
    ${o}
    <div class="input-area">
      <textarea
        class="input-field"
        placeholder="${s?"Describe what to change for these elements...":"What do you want to change?"}"
        autofocus
        rows="2"
      ></textarea>
      <div class="btn-row">
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-primary" aria-label="Send request" title="Send (\u2318/Ctrl + Enter)">Send</button>
      </div>
    </div>
  `;let a=e.querySelector(".input-field"),c=e.querySelector(".close-btn"),d=e.querySelector(".btn-secondary"),l=e.querySelector(".btn-primary"),p=e.querySelector(".multi-select-icon");c.addEventListener("click",()=>t.onClose()),d.addEventListener("click",()=>t.onClose()),l.addEventListener("click",()=>t.onSubmit(a.value)),l.addEventListener("keydown",u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),t.onSubmit(a.value))}),a.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&a.value.trim()&&(u.preventDefault(),t.onSubmit(a.value))}),p.addEventListener("click",()=>{t.onToggleMultiSelect()}),e.querySelectorAll(".selected-chip-remove").forEach(u=>{u.addEventListener("click",g=>{g.stopPropagation();let y=parseInt(g.currentTarget.dataset.index,10);t.onRemoveFromSelection(y)})}),e.querySelector(".panel-header").addEventListener("mousedown",t.onPanelDragStart),requestAnimationFrame(()=>a.focus())}function He(e,n,t){let s=n.currentStatus==="success"||n.currentStatus==="failed",i=n.currentStatus==="success"&&!n.autoCommitEnabled,o=n.currentStatus==="success",r=n.submittedSnapshots.length,a=r>1?`${r} elements`:`&lt;${v(n.componentName)} /&gt;`,c=V(n.currentStatus,n.phraseIndex);e.innerHTML=`
    <div class="panel-header">
      <span class="component-tag">${a}</span>
      ${r<=1&&n.filePath?`<span class="file-path">${v(n.filePath)}</span>`:""}
      <button class="close-btn" title="Close (Esc)">&times;</button>
    </div>
    <div class="user-request">
      <div class="user-request-label">Your request</div>
      <div class="user-request-text">${v(n.userNote)}</div>
    </div>
    <div class="activity-feed">
      ${Me(n.activityEvents,n.currentStatus)}
    </div>
    <div class="panel-footer ${s?"done":""}">
      <div class="status-indicator ${n.currentStatus}"></div>
      <span class="status-text">${c}</span>
      ${i?`
        <div class="success-actions">
          <button class="action-btn action-btn-undo" title="Discard changes">Undo</button>
          <button class="action-btn action-btn-commit" title="Commit changes">Commit</button>
        </div>
      `:""}
    </div>
    ${o?`
      <div class="followup-area">
        <div class="followup-row">
          <textarea class="followup-input" placeholder="Anything else?" rows="1"></textarea>
          <button class="followup-send">Send</button>
          <button class="followup-done">\u2715</button>
        </div>
      </div>
    `:""}
  `,e.querySelector(".close-btn").addEventListener("click",()=>t.onClose()),e.querySelector(".panel-header").addEventListener("mousedown",t.onPanelDragStart),e.querySelectorAll(".question-option").forEach(k=>{k.addEventListener("click",C=>{C.stopPropagation();let m=C.currentTarget,x=m.dataset.questionId,b=m.dataset.answerId,H=m.textContent;t.onSubmitAnswer(x,b,H)})});let p=e.querySelector(".action-btn-commit"),h=e.querySelector(".action-btn-undo");p&&p.addEventListener("click",()=>t.onCommit()),h&&h.addEventListener("click",()=>t.onUndo());let u=e.querySelector(".followup-input"),g=e.querySelector(".followup-send"),y=e.querySelector(".followup-done");u&&g&&(g.addEventListener("click",()=>{u.value.trim()&&t.onSubmitFollowUp(u.value)}),u.addEventListener("keydown",k=>{k.key==="Enter"&&!k.shiftKey&&u.value.trim()&&(k.preventDefault(),t.onSubmitFollowUp(u.value))}),requestAnimationFrame(()=>u.focus())),y&&y.addEventListener("click",()=>t.onClose());let E=e.querySelector(".activity-feed");E&&(E.scrollTop=E.scrollHeight)}function Te(e,n,t){if(!e)return;let s=e.querySelector(".status-text");s&&(s.textContent=V(n,t))}function Pe(e){let n=document.createElement("div");return n.className="loupe",n.setAttribute("aria-hidden","true"),e.appendChild(n),n}function Zt(e){let n=e.framework,t=n.displayName||n.componentName;if(t)return`<${t} />`;let s=`<${e.tagName}>`;return e.id?s=`#${e.id}`:e.className&&(s=`.${e.className.split(/\s+/)[0]}`),s}function en(e,n,t){let s=window.innerWidth,i=window.innerHeight,o=8,r=10,a=e.top-o,c=i-e.bottom-o,d=e.left-o,l=s-e.right-o,p,h,u;return a>=t+r?(p="above",h=e.left+(e.width-n)/2,u=e.top-t-r):c>=t+r?(p="below",h=e.left+(e.width-n)/2,u=e.bottom+r):l>=n+r?(p="right",h=e.right+r,u=e.top+(e.height-t)/2):d>=n+r?(p="left",h=e.left-n-r,u=e.top+(e.height-t)/2):(p="above",h=e.left+(e.width-n)/2,u=Math.max(o,e.top-t-r)),h=Math.max(o,Math.min(h,s-n-o)),u=Math.max(o,Math.min(u,i-t-o)),{position:p,x:h,y:u}}function $e(e,n,t){let s=Zt(n),i=be(n),o=R(i),r=i!=="healthy";e.innerHTML=`
    <span class="loupe-name">${tn(s)}</span>
    ${r?`<span class="loupe-pulse" style="background: ${o};"></span>`:""}
  `;let a=Math.min(300,s.length*8+30),c=28,{x:d,y:l}=en(t,a,c);e.style.transform=`translate(${Math.round(d)}px, ${Math.round(l)}px)`}function Ae(e){e.classList.add("visible")}function W(e){e.classList.remove("visible")}function tn(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}function De(e){let n=e.framework;return n.displayName||n.componentName||e.tagName}function nn(e){let n=e.framework;if(!n.filePath)return null;let s=n.filePath.split("/").slice(-2).join("/");return n.lineNumber?`${s}:${n.lineNumber}`:s}function sn(e){return e.length===0?"":`
    <div class="lens-issues">
      ${e.map(n=>`
        <div class="lens-issue ${n.level}">
          <span class="issue-dot"></span>
          <span class="issue-text">${f(n.message)}</span>
          ${n.details?`
            <span class="issue-info">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span class="issue-tooltip">${f(n.details)}</span>
            </span>
          `:""}
          <button class="issue-add-btn" data-action="issue-insert" data-issue="${f(n.message)}" title="Add to prompt">\u21B5</button>
        </div>
      `).join("")}
    </div>
  `}function on(e){let n=e.systemic?.impact;if(!n||n.importCount===void 0)return"";let t=n.importCount===1?"import":"imports",s=n.riskLevel||"Local";return`
    <div class="lens-systemic">
      <div class="lens-systemic-label">Impact</div>
      <div class="lens-systemic-row">
        <span class="lens-systemic-count">${n.importCount} ${t}</span>
        <span class="lens-risk-badge ${s.toLowerCase()}">${s}</span>
      </div>
    </div>
  `}function Re(e){let n=[],t=[];e.role&&t.push({label:"Role",value:e.role}),e.name&&t.push({label:"Name",value:e.name}),e.tagName&&t.push({label:"Tag",value:`<${e.tagName}>`}),t.length&&n.push({title:"Identity",id:"identity",rows:t});let s=e.framework;if(s){let l=[];s.type&&l.push({label:"Framework",value:s.type}),(s.displayName||s.componentName)&&l.push({label:"Component",value:s.displayName||s.componentName||""}),s.filePath&&l.push({label:"File",value:s.filePath+(s.lineNumber?`:${s.lineNumber}`:"")}),l.length&&n.push({title:"Framework",id:"framework",rows:l})}let i=e.geometry;if(i){let l=[];l.push({label:"Position",value:`${Math.round(i.x)}, ${Math.round(i.y)}`}),l.push({label:"Size",value:`${Math.round(i.width)} \xD7 ${Math.round(i.height)}`}),i.visible!==void 0&&l.push({label:"Visible",value:i.visible?"Yes":"No"}),n.push({title:"Geometry",id:"geometry",rows:l})}let o=e.styles;if(o){let l=[];o.display&&l.push({label:"Display",value:o.display}),o.position&&l.push({label:"Position",value:o.position}),o.flexDirection&&l.push({label:"Flex Dir",value:o.flexDirection}),o.color&&l.push({label:"Color",value:o.color}),o.backgroundColor&&l.push({label:"Background",value:o.backgroundColor}),o.padding&&o.padding!=="0px"&&l.push({label:"Padding",value:o.padding}),o.margin&&o.margin!=="0px"&&l.push({label:"Margin",value:o.margin}),l.length&&n.push({title:"Styles",id:"styles",rows:l})}let r=e.a11y;if(r){let l=[];r.label&&l.push({label:"Label",value:r.label}),r.description&&l.push({label:"Description",value:r.description}),r.disabled&&l.push({label:"Disabled",value:"Yes"}),r.expanded!==void 0&&l.push({label:"Expanded",value:r.expanded?"Yes":"No"}),r.checked!==void 0&&l.push({label:"Checked",value:String(r.checked)}),r.hidden&&l.push({label:"Hidden",value:"Yes"}),l.length&&n.push({title:"Accessibility",id:"a11y",rows:l})}let a=e.perception;if(a){let l=[];a.affordance&&(l.push({label:"Looks Interactive",value:a.affordance.looksInteractable?"Yes":"No"}),l.push({label:"Is Interactive",value:a.affordance.isInteractable?"Yes":"No"}),a.affordance.dissonanceScore>0&&l.push({label:"Dissonance",value:a.affordance.dissonanceScore.toFixed(1)})),a.legibility?.contrastRatio&&l.push({label:"Contrast",value:`${a.legibility.contrastRatio.toFixed(1)}:1`}),a.visibility?.isOccluded&&l.push({label:"Occluded",value:a.visibility.occludedBy||"Yes"}),l.length&&n.push({title:"Perception",id:"perception",rows:l})}let c=e.causality;if(c?.events){let l=[],p=c.events.listeners||[];p.length&&l.push({label:"Listeners",value:p.map(u=>u.type).join(", ")});let h=c.events.blockingHandlers||[];h.length&&l.push({label:"Blocked By",value:h.map(u=>u.reason).join(", ")}),l.length&&n.push({title:"Events",id:"events",rows:l})}let d=e.metal;if(d){let l=[];d.performance?.renderCount!==void 0&&l.push({label:"Render Count",value:String(d.performance.renderCount)}),d.performance?.lastRenderReason&&l.push({label:"Last Render",value:d.performance.lastRenderReason}),d.pipeline?.layerPromoted&&l.push({label:"GPU Layer",value:"Yes"}),l.length&&n.push({title:"Performance",id:"metal",rows:l})}return n.map(l=>`
    <div class="schema-section" data-section="${l.id}" data-collapsed="false">
      <button class="schema-section-header" data-action="toggle-section" data-section="${l.id}">
        <svg class="schema-section-chevron" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        <span>${l.title}</span>
      </button>
      <div class="schema-section-content">
        ${l.rows.map(p=>`
          <div class="schema-row">
            <span class="schema-label">${f(p.label)}</span>
            <span class="schema-value">${f(p.value)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}function rn(e){return e.multiSelectMode?"":`
    <div class="lens-state-toolbar">
      <div class="lens-state-label">State <span>${f(e.interactionStateLabel)}</span>${e.domPaused?" \xB7 DOM paused":""}</div>
      <div class="lens-state-actions">
        <button class="state-btn icon-btn" data-action="rotate-state" title="Cycle state (\u2318/Ctrl + Shift + K)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 12 3 4 11 4"/><path d="M21 12a9 9 0 0 0-9-9H3"/><polyline points="21 12 21 20 13 20"/><path d="M3 12a9 9 0 0 0 9 9h9"/></svg>
        </button>
        <button class="state-btn icon-btn" data-action="capture-capsule" title="Save state capsule (\u2318/Ctrl + Shift + L)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 7l5-5h8l5 5"/></svg>
        </button>
      </div>
    </div>
    ${an(e)}
  `}function an(e){return e.stateCapsules.length?`
    <div class="lens-capsules" role="list">
      ${e.stateCapsules.map(n=>`
        <button
          class="lens-capsule ${e.activeCapsuleId===n.id?"active":""}"
          data-action="select-capsule"
          data-capsule-id="${n.id}"
          role="listitem"
        >
          <span class="capsule-label">${f(n.label)}</span>
          <span class="capsule-meta">${new Date(n.capturedAt).toLocaleTimeString()}</span>
          <span class="capsule-remove" data-action="delete-capsule" data-capsule-id="${n.id}" title="Remove capsule" aria-label="Remove capsule">\xD7</span>
        </button>
      `).join("")}
    </div>
  `:""}function ze(e){return e?'<div class="lens-pause-banner">DOM paused during capture</div>':""}function Ne(e,n){let{currentSnapshot:t,mode:s,multiSelectMode:i,selectedSnapshots:o}=e;if(i&&o.length>0)return cn(e);if(!t)return'<div class="lens-empty">No element selected</div>';let r=De(t),a=nn(t),c=e.frozenHealthIssues,d=c.some(u=>u.level==="critical")?"critical":c.some(u=>u.level==="warning")?"warning":"healthy",l=R(d),p=on(t),h=rn(e);return s==="activity"?ln(e,r,a):`
    <div class="lens-bar">
      <span class="lens-tag">&lt;${f(r)} /&gt;</span>
      ${d!=="healthy"?`<span class="lens-dot" style="background:${l}"></span>`:""}
      <div class="lens-tools">
        <button class="lens-tool" data-action="toggle-context" title="Context (\u2318/Ctrl + Shift + C)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="lens-tool" data-action="multi-select" title="Multi-select (\u2318/Ctrl + Shift + M)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
        <button class="lens-tool lens-close" data-action="close" title="Close (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${a?`<div class="lens-path">${f(a)}</div>`:""}
    ${h}
    ${sn(c)}
    ${p}
    <div class="lens-input-row">
      <textarea
        class="lens-input"
        placeholder="Ask Eyeglass..."
        data-action="input"
        rows="2"
      >${f(e._userNote||"")}</textarea>
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send (\u2318/Ctrl + Enter)">\u21B5</button>
    </div>
    <div class="lens-schema" data-expanded="false" data-view="organized">
      <div class="lens-schema-header">
        <button class="lens-schema-toggle" data-action="toggle-schema">
          <span>Schema</span>
          <svg class="lens-schema-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button class="lens-schema-json-toggle" data-action="toggle-json-view" title="View raw JSON">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/>
            <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>
          </svg>
        </button>
      </div>
      <div class="lens-schema-content">
        <div class="lens-schema-organized"></div>
        <pre class="lens-schema-code"></pre>
      </div>
    </div>
  `}function ln(e,n,t){let{currentStatus:s,currentStatusMessage:i,activityEvents:o,_userNote:r,autoCommitEnabled:a}=e,c=s==="success"&&!a,d=[...o].reverse().find(g=>g.type==="thought"),l=[...o].reverse().find(g=>g.type==="action"),p=dn(o,s),h=ze(e.domPaused),u="Working...";if(d)u=d.content;else if(l){let g=l;u=`${g.action}: ${g.target}${g.complete?" \u2713":"..."}`}else i?u=i:s==="pending"?u="Waiting for agent...":s==="success"?u="Done":s==="failed"&&(u="Failed");return`
    <div class="lens-bar">
      <span class="lens-tag">&lt;${f(n)} /&gt;</span>
      <span class="lens-status-badge ${s}">${s}</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="close" title="Close (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${t?`<div class="lens-path">${f(t)}</div>`:""}
    ${h}
    <div class="lens-activity">
      ${s==="fixing"?'<div class="lens-progress"><div class="lens-progress-bar"></div></div>':""}
      <div class="lens-message">${f(u)}</div>
      ${r?`<div class="lens-user-note" title="Original request">${f(r)}</div>`:""}
      ${p}
      ${c?`
        <div class="lens-actions">
          <div class="lens-actions-text">Auto-commit is off. Apply these changes?</div>
          <div class="lens-actions-row">
            <button class="lens-btn" data-action="lens-undo">Undo</button>
            <button class="lens-btn primary" data-action="lens-commit">Commit</button>
          </div>
        </div>
      `:""}
      ${s==="success"||s==="failed"?`
        <div class="lens-followup">
          <textarea class="lens-followup-input" rows="2" placeholder="Send a follow-up..."></textarea>
          <button class="lens-followup-send" data-action="send-followup" aria-label="Send follow-up" title="Send follow-up">\u21B5</button>
        </div>
      `:""}
    </div>
    ${s==="success"||s==="failed"?`
      <div class="lens-footer">
        <button class="lens-btn" data-action="new-request">New Request</button>
      </div>
    `:""}
`}function cn(e){let{selectedSnapshots:n,_userNote:t}=e,s=ze(e.domPaused);return`
    <div class="lens-bar">
      <span class="lens-tag">${n.length} selected</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="exit-multi" title="Exit (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${s}
    <div class="lens-selection">
      ${n.map((i,o)=>`
        <div class="lens-chip">
          <span class="chip-num">${o+1}</span>
          <span class="chip-name">&lt;${f(De(i))} /&gt;</span>
          <button class="chip-remove" data-action="remove-selection" data-index="${o}">\xD7</button>
        </div>
      `).join("")}
    </div>
    <div class="lens-input-row">
      <textarea
        class="lens-input"
        placeholder="What should change?"
        data-action="input"
        rows="2"
      >${f(t||"")}</textarea>
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send (\u2318/Ctrl + Enter)">\u21B5</button>
    </div>
  `}function dn(e,n){if(e.length===0)return"";let t=e.map(s=>un(s)).filter(s=>!!s).join("");return t?`<div class="lens-feed">${t}</div>`:n==="pending"||n==="fixing"?`
        <div class="lens-feed">
          <div class="lens-feed-skeleton">
            <div class="lens-feed-dot skeleton"></div>
            <div class="lens-feed-skeleton-line"></div>
          </div>
        </div>
      `:""}function un(e){switch(e.type){case"status":return pn(e);case"thought":return`
        <div class="lens-feed-item">
          <div class="lens-feed-dot thought"></div>
          <div class="lens-feed-body lens-feed-subtle">${f(e.content)}</div>
        </div>
      `;case"action":return`
        <div class="lens-feed-item">
          <div class="lens-feed-dot action"></div>
          <div class="lens-feed-body">
            <div class="lens-feed-title">${f(e.action)}${e.complete?" \u2713":" ..."}</div>
            <div class="lens-feed-subtle">${f(e.target)}</div>
          </div>
        </div>
      `;case"question":return hn(e);default:return null}}function pn(e){return e.status==="pending"||e.status==="fixing"&&(!e.message||e.message==="Agent is working...")?null:`
    <div class="lens-feed-item">
      <div class="lens-feed-dot status ${e.status}" title="${e.status}"></div>
      <div class="lens-feed-body">${f(e.message||e.status)}</div>
    </div>
  `}function hn(e){let n=!!e.selectedAnswerId,t=e.selectedAnswerLabel||e.options.find(s=>s.id===e.selectedAnswerId)?.label||"";return n?`
      <div class="lens-feed-item question answered">
        <div class="lens-feed-dot question"></div>
        <div class="lens-feed-body">
          <div class="lens-feed-question">${f(e.question)}</div>
          <div class="lens-feed-answer">${f(t)}</div>
        </div>
      </div>
    `:`
    <div class="lens-feed-item question">
      <div class="lens-feed-dot question"></div>
      <div class="lens-feed-body">
        <div class="lens-feed-question">${f(e.question)}</div>
        <div class="lens-feed-options">
          ${e.options.map(s=>`
            <button
              class="lens-feed-option"
              data-action="answer"
              data-question-id="${e.questionId}"
              data-answer-id="${s.id}"
              data-answer-label="${f(s.label)}"
            >${f(s.label)}</button>
          `).join("")}
        </div>
      </div>
    </div>
  `}function Oe(e,n){let t=window.innerWidth,s=window.innerHeight,i=8,o=e.right+i;o+n.width>t-i&&(o=e.left-i-n.width),o<i&&(o=i);let r=e.top;return r+n.height>s-i&&(r=s-n.height-i),r<i&&(r=i),{x:Math.round(o),y:Math.round(r)}}function f(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}var Fe=`
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

.lens-actions {
  margin-top: 10px;
  padding: 8px 10px;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lens-actions-text {
  font-size: 11px;
  color: var(--text-secondary);
}

.lens-actions-row {
  display: flex;
  gap: 6px;
}

.lens-btn {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.05);
  color: var(--text-primary);
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
}

.lens-state-toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 10px 4px;
  border-bottom: 1px solid var(--divider);
}

.lens-state-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  display: flex;
  gap: 4px;
  align-items: center;
}

.lens-state-label span {
  color: var(--text-primary);
  font-weight: 600;
}

.lens-state-actions {
  display: flex;
  gap: 6px;
}

.state-btn {
  flex: 1;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.04);
  color: var(--text-secondary);
  font-size: 10px;
  padding: 4px 6px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.state-btn.icon-btn {
  flex: 0;
  min-width: 56px;
  width: 56px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.state-btn.icon-btn svg {
  width: 14px;
  height: 14px;
}

.state-btn.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}

.state-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.lens-capsules {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 10px;
}

.lens-capsule {
  border: 1px solid var(--glass-border);
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 9px;
  cursor: pointer;
  min-width: 80px;
  position: relative;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.lens-capsule.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.capsule-label {
  font-family: 'SF Mono', monospace;
  color: inherit;
}

.capsule-meta {
  color: var(--text-muted);
  font-size: 8px;
}

.capsule-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
}

.capsule-remove:hover {
  color: var(--error);
}

.lens-pause-banner {
  padding: 6px 10px;
  font-size: 10px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--divider);
  background: rgba(249,115,22,0.08);
}

.lens-btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
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

.issue-add-btn {
  margin-left: auto;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-muted);
  font-size: 9px;
  padding: 2px 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: 2px;
}

.issue-add-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
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

.issue-info {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.issue-info svg {
  width: 12px;
  height: 12px;
  opacity: 0.6;
  transition: opacity 0.1s;
}

.issue-info:hover svg {
  opacity: 1;
}

.issue-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  padding: 6px 8px;
  font-size: 10px;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 200px;
  white-space: normal;
  line-height: 1.3;
  z-index: 2147483646;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
}

.issue-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--glass-border);
}

.issue-info:hover .issue-tooltip {
  opacity: 1;
  visibility: visible;
}

.lens-systemic {
  padding: 6px 10px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-systemic-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.lens-systemic-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lens-systemic-count {
  font-size: 11px;
  color: var(--text-primary);
}

.lens-risk-badge {
  padding: 2px 6px;
  font-size: 10px;
  border: 1px solid var(--glass-border);
  text-transform: uppercase;
}

.lens-risk-badge.local {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.4);
}

.lens-risk-badge.moderate {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
}

.lens-risk-badge.critical {
  color: var(--error);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Input */
.lens-input-row {
  padding: 8px 10px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.lens-input {
  flex: 1;
  padding: 8px 10px;
  background: rgba(0,0,0,0.06);
  border: 1px solid var(--glass-border);
  font-size: 11px;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.1s, background 0.1s;
  min-height: 48px;
  resize: vertical;
  line-height: 1.4;
}

.lens-input:focus {
  border-color: var(--accent);
  background: rgba(0,0,0,0.08);
}

.lens-input::placeholder {
  color: var(--text-muted);
}

.lens-enter-btn {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.06);
  color: var(--text-muted);
  font-size: 11px;
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s, background 0.1s, opacity 0.1s;
}

.lens-enter-btn:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  opacity: 0.9;
}

.lens-enter-btn:active {
  background: var(--accent-muted);
  color: var(--text-primary);
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

.lens-user-note {
  margin-top: 6px;
  padding: 6px 8px;
  border: 1px solid var(--glass-border);
  border-radius: 3px;
  font-size: 10px;
  color: var(--text-primary);
  background: rgba(0,0,0,0.05);
  line-height: 1.4;
  word-break: break-word;
}

.lens-followup {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}

.lens-followup-input {
  flex: 1;
  min-height: 48px;
  resize: vertical;
  padding: 6px 8px;
  border: 1px solid var(--glass-border);
  border-radius: 3px;
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(0,0,0,0.06);
}

.lens-followup-send {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.06);
  color: var(--text-muted);
  padding: 5px 7px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 2px;
  cursor: pointer;
  height: 100%;
  align-self: flex-start;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
}

.lens-followup-send:hover {
  border-color: var(--accent);
  color: var(--text-primary);
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

/* Activity Feed */
.lens-feed {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--divider);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lens-feed-empty {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
}

.lens-feed-item {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 10px;
  line-height: 1.4;
}

.lens-feed-dot {
  width: 6px;
  height: 6px;
  background: var(--text-muted);
  flex-shrink: 0;
}

.lens-feed-dot.skeleton {
  animation: lensPulse 1.2s ease-in-out infinite;
}

.lens-feed-dot.status.pending,
.lens-feed-dot.status.fixing {
  background: #3b82f6;
}

.lens-feed-dot.status.success {
  background: var(--success);
}

.lens-feed-dot.status.failed {
  background: var(--error);
}

.lens-feed-dot.thought {
  background: #60a5fa;
}

.lens-feed-dot.action {
  background: #f97316;
}

.lens-feed-dot.question {
  background: var(--accent);
}

.lens-feed-skeleton {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lens-feed-skeleton-line {
  flex: 1;
  height: 8px;
  border-radius: 2px;
  background: rgba(255,255,255,0.08);
  animation: lensPulse 1.2s ease-in-out infinite;
}

@keyframes lensPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.lens-feed-body {
  flex: 1;
  color: var(--text-primary);
}

.lens-feed-title {
  font-weight: 600;
  color: var(--text-primary);
}

.lens-feed-subtle {
  font-size: 9px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.lens-feed-question {
  font-weight: 600;
  color: var(--text-primary);
}

.lens-feed-answer {
  margin-top: 4px;
  color: var(--accent);
  font-weight: 600;
}

.lens-feed-options {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-feed-option {
  padding: 5px 8px;
  background: transparent;
  border: 1px solid var(--glass-border);
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.1s;
}

.lens-feed-option:hover {
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

.lens-schema-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lens-schema-toggle {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
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

.lens-schema-json-toggle {
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s, color 0.1s;
}

.lens-schema[data-expanded="true"] .lens-schema-json-toggle {
  opacity: 1;
}

.lens-schema-json-toggle:hover {
  color: var(--accent);
}

.lens-schema[data-view="json"] .lens-schema-json-toggle {
  color: var(--accent);
}

.lens-schema-chevron {
  transition: transform 0.15s;
}

.lens-schema[data-expanded="true"] .lens-schema-chevron {
  transform: rotate(180deg);
}

.lens-schema-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.15s ease-out;
}

.lens-schema[data-expanded="true"] .lens-schema-content {
  max-height: 240px;
  overflow-y: auto;
}

/* Organized view (Figma-style) */
.lens-schema-organized {
  display: block;
}

.lens-schema[data-view="json"] .lens-schema-organized {
  display: none;
}

.schema-section {
  border-bottom: 1px solid var(--divider);
}

.schema-section:last-child {
  border-bottom: none;
}

.schema-section-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  font-size: 9px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.1s;
}

.schema-section-header:hover {
  color: var(--text-primary);
}

.schema-section-chevron {
  transition: transform 0.15s;
  flex-shrink: 0;
}

.schema-section[data-collapsed="true"] .schema-section-chevron {
  transform: rotate(-90deg);
}

.schema-section-content {
  padding: 0 10px 6px 22px;
}

.schema-section[data-collapsed="true"] .schema-section-content {
  display: none;
}

.schema-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 2px 0;
  gap: 8px;
}

.schema-label {
  font-size: 9px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.schema-value {
  font-size: 9px;
  font-family: 'SF Mono', monospace;
  color: var(--text-primary);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

/* JSON view */
.lens-schema-code {
  display: none;
  margin: 0;
  padding: 0;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
  background: rgba(0,0,0,0.04);
}

.lens-schema[data-view="json"] .lens-schema-code {
  display: block;
  padding: 8px 10px;
}

/* JSON syntax highlighting */
.lens-schema-code .json-key { color: var(--accent); }
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
`;var z={component:"#3b82f6","state-owner":"#8b5cf6","layout-parent":"#f97316","event-blocker":"#ef4444"};function qe(e,n){let t=[];t.push({element:e,type:"component",color:z.component,label:n.framework.displayName||n.framework.componentName||n.tagName});let s=e.parentElement;for(;s&&s!==document.body;){let i=getComputedStyle(s);if(i.display.includes("flex")||i.display.includes("grid")){t.push({element:s,type:"layout-parent",color:z["layout-parent"],label:`Layout (${i.display})`});break}s=s.parentElement}if(n.causality?.events?.blockingHandlers)for(let i of n.causality.events.blockingHandlers)try{let o=document.querySelector(i.element);o&&!t.some(r=>r.element===o)&&t.push({element:o,type:"event-blocker",color:z["event-blocker"],label:`Blocks ${i.event} (${i.reason})`})}catch{}if(n.framework.ancestry&&n.framework.ancestry.length>1){let i=Object.keys(e).find(o=>o.startsWith("__reactFiber$"));if(i){let o=e[i],r=0;for(;o&&r<10;){if(o.return&&o.return.type&&typeof o.return.type=="function"){let a=o.return.type.displayName||o.return.type.name;if(a&&o.return.stateNode instanceof Element){t.push({element:o.return.stateNode,type:"state-owner",color:z["state-owner"],label:`<${a} /> (props source)`});break}}o=o.return,r++}}}return t}function Be(e,n){let t=[];for(let s of n){let i=s.element.getBoundingClientRect();if(i.width===0||i.height===0)continue;let o=document.createElement("div");o.className=`context-overlay context-${s.type}`,o.style.cssText=`
      position: fixed;
      left: ${i.left-2}px;
      top: ${i.top-2}px;
      width: ${i.width+4}px;
      height: ${i.height+4}px;
      border: 1.5px solid ${s.color};
      border-radius: 0px;
      pointer-events: none;
      z-index: 9;
      box-sizing: border-box;
    `;let r=document.createElement("div");r.className="context-label",r.textContent=s.label,r.style.cssText=`
      position: absolute;
      top: -20px;
      left: 0;
      padding: 2px 6px;
      background: var(--glass-bg);
      color: ${s.color};
      font-size: 10px;
      font-weight: 500;
      border: 1px solid ${s.color};
      border-radius: 0px;
      letter-spacing: 0.02em;
      white-space: nowrap;
      pointer-events: none;
    `,o.appendChild(r),e.appendChild(o),t.push(o)}return t}function je(e){e.querySelectorAll(".context-overlay").forEach(t=>t.remove())}function _e(e,n,t,s){return i=>{let o=t();if(!o.multiSelectMode&&o.frozen||!o.inspectorEnabled)return;if(i.composedPath().includes(e)){s.hideHighlight();return}if(o.throttleTimeout)return;s.setThrottleTimeout(window.setTimeout(()=>{s.setThrottleTimeout(null)},16)),e.style.pointerEvents="none";let a=document.elementFromPoint(i.clientX,i.clientY);if(e.style.pointerEvents="",!a||a===document.documentElement||a===document.body){s.hideHighlight();return}n.contains(a)||(s.setCurrentElement(a),s.showHighlight(a,i))}}function Ye(e,n,t){return s=>{let i=n();if(!(!i.inspectorEnabled||!i.currentElement||s.composedPath().some(r=>r===e))){if(s.preventDefault(),s.stopPropagation(),i.multiSelectMode){t.toggleInSelection(i.currentElement);return}i.frozen||t.freeze()}}}function Ue(e,n){return t=>{let s=e(),i=t.target,o=i&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable);t.key==="Escape"&&s.frozen&&(t.preventDefault(),n.unfreeze());let a=navigator.platform.toUpperCase().indexOf("MAC")>=0?t.metaKey:t.ctrlKey;a&&t.shiftKey&&t.key.toLowerCase()==="e"&&(t.preventDefault(),n.toggleInspectorEnabled()),!o&&s.inspectorEnabled&&(s.frozen&&a&&t.shiftKey&&t.key.toLowerCase()==="m"&&(t.preventDefault(),n.toggleMultiSelect()),s.frozen&&a&&t.shiftKey&&t.key.toLowerCase()==="k"&&(t.preventDefault(),n.rotateInteractionState()),s.frozen&&a&&t.shiftKey&&t.key.toLowerCase()==="l"&&(t.preventDefault(),n.captureStateCapsule()),s.frozen&&a&&t.shiftKey&&t.key.toLowerCase()==="c"&&(t.preventDefault(),n.toggleContextOverlays()),a&&t.shiftKey&&t.key.toLowerCase()==="u"&&(t.preventDefault(),n.toggleDomPause()),s.frozen&&a&&t.key==="Enter"&&(t.preventDefault(),n.submitShortcut()))}}function Ve(e,n){return()=>{let t=e();t.frozen&&(n.disableHighlightTransitions(),t.currentElement&&t.highlight&&!t.multiSelectMode&&n.showHighlight(t.currentElement),t.multiSelectMode&&t.selectedElements.length>0&&n.updateMultiSelectHighlightPositions(),t.scrollTimeout&&window.clearTimeout(t.scrollTimeout),n.setScrollTimeout(window.setTimeout(()=>{n.enableHighlightTransitions(),n.setScrollTimeout(null)},150)))}}function Ke(e,n){let t=null,s=a=>{let c=e();if(!c.isDragging||!t)return;let d=Math.max(0,Math.min(a.clientX-c.dragOffset.x,window.innerWidth-340)),l=Math.max(0,Math.min(a.clientY-c.dragOffset.y,window.innerHeight-100));t===c.lens?n.setCustomLensPosition({x:d,y:l}):n.setCustomPanelPosition({x:d,y:l}),t.style.left=`${d}px`,t.style.top=`${l}px`},i=()=>{n.setDragging(!1),t=null,document.removeEventListener("mousemove",s),document.removeEventListener("mouseup",i)};return{handlePanelDragStart:a=>{if(a.target.closest("button, input"))return;let c=e();if(!c.panel)return;t=c.panel,n.setDragging(!0);let d=c.panel.getBoundingClientRect();n.setDragOffset({x:a.clientX-d.left,y:a.clientY-d.top}),document.addEventListener("mousemove",s),document.addEventListener("mouseup",i)},handlePanelDrag:s,handlePanelDragEnd:i,handleLensDragStart:a=>{if(a.target.closest("button, input"))return;let c=e();if(!c.lens)return;t=c.lens,n.setDragging(!0);let d=c.lens.getBoundingClientRect();n.setDragOffset({x:a.clientX-d.left,y:a.clientY-d.top}),document.addEventListener("mousemove",s),document.addEventListener("mouseup",i)}}}function Ge(e,n,t,s,i){if(!e)return;let o={interactionId:e,userNote:n,componentName:t?.framework.componentName||t?.tagName||"element",status:s,message:i,timestamp:Date.now()};try{sessionStorage.setItem(T,JSON.stringify(o))}catch{}}function Xe(){try{let e=sessionStorage.getItem(T);if(!e)return null;let n=JSON.parse(e);return Date.now()-n.timestamp>1e4?(sessionStorage.removeItem(T),null):n}catch{return null}}function J(){try{sessionStorage.removeItem(T)}catch{}}function We(){try{let e=sessionStorage.getItem(j);if(e)return JSON.parse(e)}catch{}return[]}function w(e){try{sessionStorage.setItem(j,JSON.stringify(e))}catch{}}function Q(e,n){let t=[...e],s=t.findIndex(i=>i.interactionId===n.interactionId);return s>=0?t[s]=n:(t.unshift(n),t.length>20&&(t.length=20)),t}function N(e,n,t){return e.map(s=>s.interactionId===n?{...s,status:t}:s)}function Je(e,n){return e.filter(t=>t.interactionId!==n)}function Qe(){try{let e=localStorage.getItem(_);if(e!==null)return e==="true"}catch{}return!0}function Ze(e){try{localStorage.setItem(_,String(e))}catch{}}function et(){try{let e=localStorage.getItem(Y);if(e!==null)return e==="true"}catch{}return!0}function Z(e){try{localStorage.setItem(Y,String(e))}catch{}}function tt(){try{let e=localStorage.getItem(U);if(e==="light"||e==="dark"||e==="auto")return e}catch{}return"auto"}function ee(e){try{localStorage.setItem(U,e)}catch{}}function P(e,n){e.multiSelectHighlights.forEach(i=>i.remove());let t=[],s=3;return e.selectedElements.forEach((i,o)=>{let r=i.getBoundingClientRect(),a=document.createElement("div");a.className="highlight multi",a.style.display="block",a.style.left=`${r.left-s}px`,a.style.top=`${r.top-s}px`,a.style.width=`${r.width+s*2}px`,a.style.height=`${r.height+s*2}px`;let c=document.createElement("div");c.className="highlight-badge",c.textContent=String(o+1),a.appendChild(c),n.appendChild(a),t.push(a)}),t}function O(e,n){e.multiSelectHighlights.forEach(t=>t.remove())}function nt(e,n){e.forEach((s,i)=>{let o=n[i];if(!o)return;let r=s.getBoundingClientRect();o.style.left=`${r.left-3}px`,o.style.top=`${r.top-3}px`,o.style.width=`${r.width+3*2}px`,o.style.height=`${r.height+3*2}px`})}function st(e,n){e&&e.classList.add("no-transition"),n.forEach(t=>t.classList.add("no-transition"))}function it(e,n){e&&e.classList.remove("no-transition"),n.forEach(t=>t.classList.remove("no-transition"))}var te=["default","hover","focus","pressed"],mn=6,F=class extends HTMLElement{constructor(){super();this.highlight=null;this.panel=null;this.toast=null;this.hub=null;this.domPauseBtn=null;this.currentElement=null;this.currentSnapshot=null;this.interactionId=null;this.frozen=!1;this.eventSource=null;this.throttleTimeout=null;this.mode="input";this.activityEvents=[];this.currentStatus="idle";this.currentStatusMessage=null;this.hubExpanded=!1;this.hubPage="main";this.inspectorEnabled=!0;this.autoCommitEnabled=!0;this.themePreference="auto";this.history=[];this.isDragging=!1;this.dragOffset={x:0,y:0};this.customPanelPosition=null;this.customLensPosition=null;this.multiSelectMode=!1;this.selectedElements=[];this.selectedSnapshots=[];this.multiSelectHighlights=[];this.submittedSnapshots=[];this.stateCapsules=[];this.activeCapsuleId=null;this.interactionStateLabel="default";this.frozenHealthIssues=[];this.cursorStyleElement=null;this.scrollTimeout=null;this.phraseIndex=0;this.phraseInterval=null;this._userNote="";this.uiMode="loupe";this.loupe=null;this.lens=null;this.lastMouseX=0;this.lastMouseY=0;this.crosshairX=null;this.crosshairY=null;this.simulatedHoverElement=null;this.simulatedPressedElement=null;this.simulatedFocusedElement=null;this.simulatedStateVariant="default";this.domPaused=!1;this.pauseStyleElement=null;this.pausedAnimations=[];this.pseudoMirrorReady=!1;this.pseudoMirrorStyle=null;this.forcedStateElements=new Set;this.showingContextOverlays=!1;this.contextOverlays=[];this.contextOverlayElements=[];this.shadow=this.attachShadow({mode:"closed"}),this.handleMouseMove=_e(this,this.shadow,()=>({frozen:this.frozen,multiSelectMode:this.multiSelectMode,inspectorEnabled:this.inspectorEnabled,throttleTimeout:this.throttleTimeout}),{setThrottleTimeout:t=>this.throttleTimeout=t,hideHighlight:()=>this.hideHighlight(),showHighlight:(t,s)=>{s&&(this.lastMouseX=s.clientX,this.lastMouseY=s.clientY,this.updateCrosshair(this.lastMouseX,this.lastMouseY)),this.showHighlight(t)},setCurrentElement:t=>this.currentElement=t}),this.handleClick=Ye(this,()=>({inspectorEnabled:this.inspectorEnabled,currentElement:this.currentElement,frozen:this.frozen,multiSelectMode:this.multiSelectMode}),{toggleInSelection:t=>this.toggleInSelection(t),freeze:()=>this.freeze()}),this.handleKeyDown=Ue(()=>({frozen:this.frozen,multiSelectMode:this.multiSelectMode,inspectorEnabled:this.inspectorEnabled}),{unfreeze:()=>this.unfreeze(),toggleInspectorEnabled:()=>this.toggleInspectorEnabled(),toggleContextOverlays:()=>this.toggleContextOverlays(),toggleMultiSelect:()=>{this.frozen&&(this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode())},submitShortcut:()=>this.submitFromLensShortcut(),rotateInteractionState:()=>this.rotateInteractionState(),captureStateCapsule:()=>this.captureStateCapsule(),toggleDomPause:()=>this.toggleDomPause()}),this.handleScroll=Ve(()=>({frozen:this.frozen,currentElement:this.currentElement,highlight:this.highlight,multiSelectMode:this.multiSelectMode,selectedElements:this.selectedElements,scrollTimeout:this.scrollTimeout}),{showHighlight:t=>this.showHighlight(t),updateMultiSelectHighlightPositions:()=>nt(this.selectedElements,this.multiSelectHighlights),disableHighlightTransitions:()=>st(this.highlight,this.multiSelectHighlights),enableHighlightTransitions:()=>it(this.highlight,this.multiSelectHighlights),setScrollTimeout:t=>this.scrollTimeout=t}),this.dragHandlers=Ke(()=>({isDragging:this.isDragging,dragOffset:this.dragOffset,panel:this.panel,lens:this.lens}),{setDragging:t=>this.isDragging=t,setDragOffset:t=>this.dragOffset=t,setCustomPanelPosition:t=>this.customPanelPosition=t,setCustomLensPosition:t=>this.customLensPosition=t})}connectedCallback(){let t=document.createElement("style");t.textContent=me+Fe,this.shadow.appendChild(t),this.highlight=document.createElement("div"),this.highlight.className="highlight",this.highlight.style.display="none",this.shadow.appendChild(this.highlight),this.loupe=Pe(this.shadow),this.crosshairX=document.createElement("div"),this.crosshairX.className="crosshair crosshair-x",this.shadow.appendChild(this.crosshairX),this.crosshairY=document.createElement("div"),this.crosshairY.className="crosshair crosshair-y",this.shadow.appendChild(this.crosshairY),document.addEventListener("mousemove",this.handleMouseMove,!0),document.addEventListener("click",this.handleClick,!0),document.addEventListener("keydown",this.handleKeyDown,!0),window.addEventListener("scroll",this.handleScroll,!0),this.inspectorEnabled=Qe(),this.autoCommitEnabled=et(),this.themePreference=tt(),this.applyTheme(),this.history=We(),this.renderHub(),this.connectSSE(),this.restoreSession(),this.updateCursor()}disconnectedCallback(){document.removeEventListener("mousemove",this.handleMouseMove,!0),document.removeEventListener("click",this.handleClick,!0),document.removeEventListener("keydown",this.handleKeyDown,!0),window.removeEventListener("scroll",this.handleScroll,!0),this.eventSource?.close(),this.cursorStyleElement&&(this.cursorStyleElement.remove(),this.cursorStyleElement=null),this.crosshairX?.remove(),this.crosshairY?.remove()}connectSSE(){this.eventSource=ve({onActivityEvent:t=>this.handleActivityEvent(t),onReconnect:()=>this.connectSSE()})}handleActivityEvent(t){t.type==="status"&&(this.history=N(this.history,t.interactionId,t.status),w(this.history),this.renderHub()),t.interactionId===this.interactionId&&(this.activityEvents.push(t),t.type==="status"&&(this.currentStatus=t.status,this.currentStatusMessage=t.message||null,Ge(this.interactionId,this._userNote,this.currentSnapshot,this.currentStatus,t.message),t.status==="fixing"?this.startPhraseRotation():this.stopPhraseRotation(),t.status==="failed"&&setTimeout(()=>this.unfreeze(),4e3)),this.uiMode==="lens"?this.renderLens():this.renderPanel())}restoreSession(){let t=Xe();t&&(t.status==="success"||t.status==="failed")&&(this.showResultToast(t),J())}showResultToast(t){this.toast=document.createElement("div"),this.toast.className="result-toast";let s=t.status==="success",i=s?"\u2713":"\u2715",o=s?"Done!":"Failed";this.toast.innerHTML=`
      <div class="toast-icon ${t.status}">${i}</div>
      <div class="toast-content">
        <div class="toast-title">${o}</div>
        <div class="toast-message">${v(t.message||t.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `,this.toast.querySelector(".toast-close").addEventListener("click",()=>this.hideToast()),this.shadow.appendChild(this.toast),setTimeout(()=>this.hideToast(),4e3)}hideToast(){this.toast&&(this.toast.remove(),this.toast=null)}applyTheme(){this.setAttribute("data-theme",this.themePreference)}toggleInspectorEnabled(){this.inspectorEnabled=!this.inspectorEnabled,Ze(this.inspectorEnabled),this.inspectorEnabled||(this.unfreeze(),this.toggleCrosshair(!1)),this.updateCursor(),this.renderHub()}updateCursor(){this.cursorStyleElement=fe(this.inspectorEnabled,this.frozen,this.multiSelectMode,this.cursorStyleElement)}showHighlight(t){if(!this.highlight)return;let s=t.getBoundingClientRect(),i=3;if(this.highlight.style.display="block",this.highlight.style.left=`${s.left-i}px`,this.highlight.style.top=`${s.top-i}px`,this.highlight.style.width=`${s.width+i*2}px`,this.highlight.style.height=`${s.height+i*2}px`,!this.frozen&&this.loupe&&this.uiMode==="loupe"){let o=S(t);this.currentSnapshot=o,$e(this.loupe,o,s),Ae(this.loupe)}this.toggleCrosshair(!0)}updateCrosshair(t,s){if(!(!this.crosshairX||!this.crosshairY)){if(!this.inspectorEnabled){this.toggleCrosshair(!1);return}this.crosshairX.style.transform=`translateY(${s}px)`,this.crosshairY.style.transform=`translateX(${t}px)`,this.toggleCrosshair(!0)}}submitFromLensShortcut(){if(!this.lens)return;let t=this.lens.querySelector(".lens-input");if(!t)return;let s=t.value.trim();s&&this.submit(s)}toggleCrosshair(t){if(!this.crosshairX||!this.crosshairY)return;let s=t?"1":"0";this.crosshairX.style.opacity=s,this.crosshairY.style.opacity=s}hideHighlight(){this.highlight&&(this.highlight.style.display="none"),this.loupe&&!this.frozen&&W(this.loupe),this.toggleCrosshair(!1)}freeze(){if(!this.currentElement)return;this.frozen=!0,this._userNote="",this.toggleCrosshair(!1),this.updateCursor(),this.ensurePseudoMirrorStyles(),this.applyInteractionVariant(this.interactionStateLabel);let t=S(this.currentElement,this.buildInteractionStateInfo());this.applySnapshotSelection(t),this.frozenHealthIssues=this.captureAllStateHealthIssues(),this.selectedElements=[this.currentElement],this.mode="input",this.activityEvents=[],this.currentStatus="idle",this.stateCapsules=[];let s=this.pushCapsule(t);this.activeCapsuleId=s.id,this.loupe&&W(this.loupe),this.uiMode="lens",this.renderLens()}unfreeze(){this.frozen=!1,this.currentSnapshot=null,this.interactionId=null,this.mode="input",this._userNote="",this.activityEvents=[],this.currentStatusMessage=null,this.customPanelPosition=null,this.customLensPosition=null,this.multiSelectMode=!1,this.selectedElements=[],this.selectedSnapshots=[],this.submittedSnapshots=[],O({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.stateCapsules=[],this.activeCapsuleId=null,this.interactionStateLabel="default",this.frozenHealthIssues=[],this.clearSimulatedState(),this.resumeDom(),this.stopPhraseRotation(),this.hideLens(),this.uiMode="loupe",this.hideContextOverlays(),this.hidePanel(),this.hideHighlight(),this.toggleCrosshair(!1),this.updateCursor(),J()}enterMultiSelectMode(){!this.frozen||this.multiSelectMode||(this.multiSelectMode=!0,this.multiSelectHighlights=P({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.updateCursor(),this.uiMode==="lens"?this.renderLens():this.renderPanel())}exitMultiSelectMode(){this.multiSelectMode=!1,this.selectedElements.length>0&&(this.currentElement=this.selectedElements[0],this.currentSnapshot=this.selectedSnapshots[0]),this.selectedElements=this.currentElement?[this.currentElement]:[],this.selectedSnapshots=this.currentSnapshot?[this.currentSnapshot]:[],O({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.currentElement&&this.showHighlight(this.currentElement),this.updateCursor(),this.uiMode==="lens"?this.renderLens():this.renderPanel()}toggleInSelection(t){if(!this.multiSelectMode)return;let s=this.selectedElements.indexOf(t);if(s>=0)this.removeFromSelection(s);else{let i=S(t);this.selectedElements.push(t),this.selectedSnapshots.push(i)}this.multiSelectHighlights=P({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.toggleCrosshair(!1),this.uiMode==="lens"?this.renderLens():this.renderPanel()}removeFromSelection(t){if(!(t<0||t>=this.selectedElements.length)){if(this.selectedElements.length===1){this.exitMultiSelectMode();return}this.selectedElements.splice(t,1),this.selectedSnapshots.splice(t,1),this.multiSelectHighlights=P({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none"),this.uiMode==="lens"?this.renderLens():this.renderPanel()}}buildInteractionStateInfo(t={}){return{variant:t.variant??this.interactionStateLabel,label:t.label??this.interactionStateLabel,domPaused:t.domPaused??this.domPaused,capturedAt:t.capturedAt??Date.now()}}captureAllStateHealthIssues(){if(!this.currentElement)return[];let t=[],s=new Set,i=["default","hover","focus","pressed"];for(let o of i){this.applyInteractionVariant(o),this.currentElement.offsetHeight;let r=S(this.currentElement,this.buildInteractionStateInfo({variant:o})),a=K(r);for(let c of a)s.has(c.message)||(s.add(c.message),t.push(c))}return this.applyInteractionVariant("default"),t}applySnapshotSelection(t){this.currentSnapshot=t,this.multiSelectMode||(this.selectedSnapshots=[t])}capturePreviewSnapshot(){if(!this.currentElement)return;this.activeCapsuleId=null;let t=this.buildInteractionStateInfo(),s=S(this.currentElement,t);this.currentSnapshot=s,this.multiSelectMode||(this.selectedSnapshots=[s])}toCapsule(t){let s=t.interactionState??this.buildInteractionStateInfo(),i=s.variant||"custom";return{id:D(),variant:i,label:s.label||i,snapshot:t,capturedAt:s.capturedAt??Date.now()}}pushCapsule(t){let s=this.toCapsule(t);return this.stateCapsules=[s,...this.stateCapsules].slice(0,mn),s}captureStateCapsule(){this.currentElement&&(this.applyInteractionVariant(this.interactionStateLabel),requestAnimationFrame(()=>{if(!this.currentElement)return;let t=this.buildInteractionStateInfo(),s=S(this.currentElement,t);this.applySnapshotSelection(s);let i=this.pushCapsule(s);this.activeCapsuleId=i.id,this.renderLens()}))}selectStateCapsule(t){let s=this.stateCapsules.find(i=>i.id===t);s&&(this.activeCapsuleId=s.id,this.interactionStateLabel=s.variant,this.applyInteractionVariant(this.interactionStateLabel),this.applySnapshotSelection(s.snapshot),this.renderLens())}deleteStateCapsule(t){let s=this.activeCapsuleId===t;if(this.stateCapsules=this.stateCapsules.filter(i=>i.id!==t),s){let i=this.stateCapsules[0];if(i){this.selectStateCapsule(i.id);return}this.activeCapsuleId=null,this.applyInteractionVariant(this.interactionStateLabel),this.capturePreviewSnapshot()}this.renderLens()}rotateInteractionState(){let t=te.indexOf(this.interactionStateLabel),s=t===-1?0:(t+1)%te.length;if(this.interactionStateLabel=te[s],this.applyInteractionVariant(this.interactionStateLabel),this.interactionStateLabel==="default"){let i=this.stateCapsules.find(o=>o.variant==="default");i?(this.activeCapsuleId=null,this.currentSnapshot=i.snapshot,this.multiSelectMode||(this.selectedSnapshots=[i.snapshot])):this.capturePreviewSnapshot()}else this.capturePreviewSnapshot();this.uiMode==="lens"&&this.renderLens()}applyInteractionVariant(t){if(!this.currentElement||t===this.simulatedStateVariant&&t!=="pressed")return;switch(this.ensurePseudoMirrorStyles(),this.clearSimulatedState(),this.simulatedStateVariant=t,t){case"hover":this.simulateHover(this.currentElement);break;case"focus":this.simulateFocus(this.currentElement);break;case"pressed":this.simulatePressed(this.currentElement);break;default:break}let s=this.getForcedStatesForVariant(t);this.updateForcedStates(this.currentElement,s)}clearSimulatedState(){this.simulatedHoverElement=null,this.simulatedPressedElement=null,this.simulatedFocusedElement&&this.simulatedFocusedElement instanceof HTMLElement&&(this.simulatedFocusedElement.blur(),this.simulatedFocusedElement=null),this.simulatedStateVariant="default",this.currentElement&&this.updateForcedStates(this.currentElement,[])}simulateHover(t){this.simulatedHoverElement=t}simulateFocus(t){if(t instanceof HTMLElement&&typeof t.focus=="function")try{t.focus({preventScroll:!0}),this.simulatedFocusedElement=t}catch{}}simulatePressed(t){this.simulatedPressedElement=t}dispatchSyntheticEvent(t,s,i={}){let o={bubbles:!0,cancelable:!0,view:window,...i},r=s.startsWith("pointer");if(r&&typeof PointerEvent<"u")try{t.dispatchEvent(new PointerEvent(s,o));return}catch{}let a=r?s.replace("pointer","mouse"):s;t.dispatchEvent(new MouseEvent(a,o))}getElementCenter(t){let s=t.getBoundingClientRect();return{x:s.left+s.width/2,y:s.top+s.height/2}}getForcedStatesForVariant(t){switch(t){case"hover":return["hover"];case"focus":return["focus","focus-visible"];case"pressed":return["hover","active"];default:return[]}}updateForcedStates(t,s){if(t){if(s.length===0){t.setAttribute("data-eyeglass-force-state","default"),this.forcedStateElements.add(t);return}t.setAttribute("data-eyeglass-force-state",s.join(" ")),this.forcedStateElements.add(t)}}ensurePseudoMirrorStyles(){if(this.pseudoMirrorReady)return;let t=[],s=[];for(let o of Array.from(document.styleSheets)){try{if(!o.cssRules)continue}catch{continue}try{this.collectPseudoMirrorRules(o.cssRules,t,s)}catch{}}let i=[...t,...s];i.length>0&&(this.pseudoMirrorStyle=document.createElement("style"),this.pseudoMirrorStyle.dataset.source="eyeglass-pseudo-mirror",this.pseudoMirrorStyle.textContent=i.join(`
`),document.head.appendChild(this.pseudoMirrorStyle)),this.pseudoMirrorReady=!0}collectPseudoMirrorRules(t,s,i){let o=[{pseudo:":hover",attr:'[data-eyeglass-force-state~="hover"]'},{pseudo:":focus-visible",attr:'[data-eyeglass-force-state~="focus-visible"]'},{pseudo:":focus",attr:'[data-eyeglass-force-state~="focus"]'},{pseudo:":active",attr:'[data-eyeglass-force-state~="active"]'}],r=typeof CSSStyleRule<"u"?CSSStyleRule:null,a=typeof CSSMediaRule<"u"?CSSMediaRule:null,c=typeof CSSSupportsRule<"u"?CSSSupportsRule:null;for(let d of Array.from(t))if(r&&d instanceof r){let l=d,p=l.selectorText,h=!1,u=p.includes(":hover");for(let{pseudo:g,attr:y}of o)p.includes(g)&&(p=p.split(g).join(y),h=!0);if(h&&(s.push(`${p} { ${l.style.cssText} }`),u)){let g=l.selectorText.replace(/:hover/g,'[data-eyeglass-force-state="default"]:hover'),y=Array.from(l.style).map(E=>`${E}: unset !important`).join("; ");i.push(`${g} { ${y}; }`)}}else if(a&&d instanceof a){let l=[],p=[];this.collectPseudoMirrorRules(d.cssRules,l,p),l.length>0&&s.push(`@media ${d.conditionText} {
${l.join(`
`)}
}`),p.length>0&&i.push(`@media ${d.conditionText} {
${p.join(`
`)}
}`)}else if(c&&d instanceof c){let l=[],p=[];this.collectPseudoMirrorRules(d.cssRules,l,p),l.length>0&&s.push(`@supports ${d.conditionText} {
${l.join(`
`)}
}`),p.length>0&&i.push(`@supports ${d.conditionText} {
${p.join(`
`)}
}`)}}toggleDomPause(){this.domPaused?this.resumeDom():this.pauseDom(),this.renderHub(),this.uiMode==="lens"&&this.renderLens()}pauseDom(){this.domPaused||(this.domPaused=!0,typeof document.getAnimations=="function"&&(this.pausedAnimations=document.getAnimations(),this.pausedAnimations.forEach(t=>{try{t.pause()}catch{}})),this.pauseStyleElement=document.createElement("style"),this.pauseStyleElement.dataset.source="eyeglass-pause",this.pauseStyleElement.textContent=`
      * {
        transition-property: none !important;
        animation-play-state: paused !important;
      }
    `,document.head.appendChild(this.pauseStyleElement),document.documentElement.classList.add("eyeglass-dom-paused"))}resumeDom(){this.domPaused&&(this.domPaused=!1,this.pausedAnimations.forEach(t=>{try{t.play()}catch{}}),this.pausedAnimations=[],this.pauseStyleElement&&(this.pauseStyleElement.remove(),this.pauseStyleElement=null),document.documentElement.classList.remove("eyeglass-dom-paused"))}renderHub(){this.hub||(this.hub=document.createElement("div"),this.hub.className="hub",this.shadow.appendChild(this.hub)),this.domPauseBtn||(this.domPauseBtn=document.createElement("button"),this.shadow.appendChild(this.domPauseBtn)),Ce(this.domPauseBtn,{domPaused:this.domPaused},{onToggleDomPause:()=>this.toggleDomPause()}),this.domPauseBtn=this.shadow.querySelector(".dom-pause-btn"),this.hubPage==="settings"?ke(this.hub,{themePreference:this.themePreference,autoCommitEnabled:this.autoCommitEnabled},{onBack:()=>{this.hubPage="main",this.renderHub()},onThemeChange:t=>{this.themePreference=t,ee(t),this.applyTheme(),this.renderHub()},onAutoCommitToggle:()=>{this.autoCommitEnabled=!this.autoCommitEnabled,Z(this.autoCommitEnabled),this.renderHub()}}):Ee(this.hub,{hubExpanded:this.hubExpanded,inspectorEnabled:this.inspectorEnabled,history:this.history},{onToggleExpanded:()=>{this.hubExpanded=!this.hubExpanded,this.renderHub()},onToggleEnabled:()=>this.toggleInspectorEnabled(),onOpenSettings:()=>{this.hubPage="settings",this.hubExpanded=!0,this.renderHub()},onUndo:t=>this.handleUndoRequest(t)})}renderPanel(){if(!this.currentSnapshot||!this.currentElement)return;let t=this.currentElement.getBoundingClientRect(),{framework:s}=this.currentSnapshot;this.panel||(this.panel=document.createElement("div"),this.panel.className="glass-panel",this.shadow.appendChild(this.panel));let i=Ie(t,this.mode,this.customPanelPosition);this.panel.style.left=`${i.x}px`,this.panel.style.top=`${i.y}px`;let o=s.componentName||this.currentSnapshot.tagName,r=s.filePath?s.filePath.split("/").slice(-2).join("/"):null;this.mode==="input"?Le(this.panel,{componentName:o,filePath:r,multiSelectMode:this.multiSelectMode,selectedSnapshots:this.selectedSnapshots},{onClose:()=>this.unfreeze(),onSubmit:a=>this.submit(a),onToggleMultiSelect:()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode()},onRemoveFromSelection:a=>this.removeFromSelection(a),onPanelDragStart:this.dragHandlers.handlePanelDragStart}):He(this.panel,{componentName:o,filePath:r,submittedSnapshots:this.submittedSnapshots,activityEvents:this.activityEvents,currentStatus:this.currentStatus,autoCommitEnabled:this.autoCommitEnabled,userNote:this._userNote,interactionId:this.interactionId,phraseIndex:this.phraseIndex},{onClose:()=>this.unfreeze(),onSubmitFollowUp:a=>this.submitFollowUp(a),onSubmitAnswer:(a,c,d)=>this.handleSubmitAnswer(a,c,d),onCommit:()=>this.handleCommitRequest(),onUndo:()=>this.handleUndoFromPanel(),onPanelDragStart:this.dragHandlers.handlePanelDragStart})}hidePanel(){this.panel&&(this.panel.remove(),this.panel=null)}renderLens(){if(!this.currentSnapshot||!this.currentElement)return;this.lens||(this.lens=document.createElement("div"),this.lens.className="lens-card",this.shadow.appendChild(this.lens));let t={shadow:this.shadow,highlight:this.highlight,panel:this.panel,toast:this.toast,hub:this.hub,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot,interactionId:this.interactionId,frozen:this.frozen,mode:this.mode,activityEvents:this.activityEvents,currentStatus:this.currentStatus,currentStatusMessage:this.currentStatusMessage,hubExpanded:this.hubExpanded,hubPage:this.hubPage,inspectorEnabled:this.inspectorEnabled,autoCommitEnabled:this.autoCommitEnabled,themePreference:this.themePreference,history:this.history,isDragging:this.isDragging,dragOffset:this.dragOffset,customPanelPosition:this.customPanelPosition,customLensPosition:this.customLensPosition,multiSelectMode:this.multiSelectMode,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,submittedSnapshots:this.submittedSnapshots,stateCapsules:this.stateCapsules,activeCapsuleId:this.activeCapsuleId,interactionStateLabel:this.interactionStateLabel,domPaused:this.domPaused,cursorStyleElement:this.cursorStyleElement,throttleTimeout:this.throttleTimeout,scrollTimeout:this.scrollTimeout,phraseIndex:this.phraseIndex,phraseInterval:this.phraseInterval,_userNote:this._userNote,eventSource:this.eventSource,frozenHealthIssues:this.frozenHealthIssues},s={unfreeze:()=>this.unfreeze(),submit:a=>this.submit(a),submitFollowUp:a=>this.submitFollowUp(a),submitAnswer:(a,c,d)=>this.handleSubmitAnswer(a,c,d),requestUndo:a=>this.handleUndoRequest(a),requestCommit:a=>this.handleCommitRequest(),enterMultiSelectMode:()=>this.enterMultiSelectMode(),exitMultiSelectMode:()=>this.exitMultiSelectMode(),removeFromSelection:a=>this.removeFromSelection(a),toggleHubExpanded:()=>{this.hubExpanded=!this.hubExpanded,this.renderHub()},toggleInspectorEnabled:()=>this.toggleInspectorEnabled(),openSettingsPage:()=>{this.hubPage="settings",this.hubExpanded=!0,this.renderHub()},closeSettingsPage:()=>{this.hubPage="main",this.renderHub()},setTheme:a=>{this.themePreference=a,ee(a),this.applyTheme()},toggleAutoCommit:()=>{this.autoCommitEnabled=!this.autoCommitEnabled,Z(this.autoCommitEnabled)},handlePanelDragStart:this.dragHandlers.handlePanelDragStart,renderHub:()=>this.renderHub(),renderPanel:()=>this.renderPanel(),captureStateCapsule:()=>this.captureStateCapsule(),selectStateCapsule:a=>this.selectStateCapsule(a),deleteStateCapsule:a=>this.deleteStateCapsule(a),rotateInteractionState:()=>this.rotateInteractionState(),toggleDomPause:()=>this.toggleDomPause()};this.lens.innerHTML=Ne(t,s);let i=this.currentElement.getBoundingClientRect(),o={width:220,height:this.lens.offsetHeight||200},r=this.customLensPosition??Oe(i,o);this.lens.style.left=`${r.x}px`,this.lens.style.top=`${r.y}px`,this.wireLensEvents()}wireLensEvents(){if(!this.lens)return;let t=this.lens.querySelector(".lens-bar");t&&t.addEventListener("mousedown",this.dragHandlers.handleLensDragStart);let s=this.lens.querySelector('[data-action="toggle-schema"]');s&&s.addEventListener("click",()=>this.toggleSchemaView());let i=this.lens.querySelector('[data-action="toggle-json-view"]');i&&i.addEventListener("click",()=>this.toggleJsonView());let o=this.lens.querySelector('[data-action="close"]');o&&o.addEventListener("click",()=>this.unfreeze());let r=this.lens.querySelector('[data-action="lens-commit"]');r&&r.addEventListener("click",()=>this.handleCommitRequest());let a=this.lens.querySelector('[data-action="lens-undo"]');a&&a.addEventListener("click",()=>this.handleUndoFromPanel());let c=this.lens.querySelector(".lens-input");c&&(c.addEventListener("keydown",m=>{m.key==="Enter"&&!m.shiftKey&&c.value.trim()&&(this.submit(c.value),m.preventDefault())}),setTimeout(()=>c.focus(),100));let d=this.lens.querySelector(".lens-enter-btn");d&&c&&d.addEventListener("click",()=>{c.value.trim()?this.submit(c.value):c.focus()});let l=this.lens.querySelector('[data-action="multi-select"]');l&&l.addEventListener("click",()=>{this.multiSelectMode?this.exitMultiSelectMode():this.enterMultiSelectMode(),this.renderLens()});let p=this.lens.querySelector('[data-action="toggle-context"]');p&&p.addEventListener("click",()=>this.toggleContextOverlays()),this.lens.querySelector('[data-action="rotate-state"]')?.addEventListener("click",()=>this.rotateInteractionState()),this.lens.querySelector('[data-action="capture-capsule"]')?.addEventListener("click",()=>this.captureStateCapsule()),this.lens.querySelectorAll('[data-action="select-capsule"]').forEach(m=>{m.addEventListener("click",x=>{let b=x.currentTarget.getAttribute("data-capsule-id");b&&this.selectStateCapsule(b)})}),this.lens.querySelectorAll('[data-action="delete-capsule"]').forEach(m=>{m.addEventListener("click",x=>{x.stopPropagation();let b=x.currentTarget.getAttribute("data-capsule-id");b&&this.deleteStateCapsule(b)})});let g=this.lens.querySelector('[data-action="peek-schema"]');g&&g.addEventListener("click",()=>this.toggleSchemaView());let y=this.lens.querySelector('[data-action="exit-multi"]');y&&y.addEventListener("click",()=>{this.exitMultiSelectMode(),this.renderLens()}),this.lens.querySelectorAll('[data-action="remove-selection"]').forEach(m=>{m.addEventListener("click",()=>{let x=parseInt(m.getAttribute("data-index")||"0",10);this.removeFromSelection(x),this.renderLens()})}),this.lens.querySelectorAll('[data-action="answer"]').forEach(m=>{m.addEventListener("click",()=>{let x=m.getAttribute("data-question-id")||"",b=m.getAttribute("data-answer-id")||"",H=m.getAttribute("data-answer-label")||"";this.handleSubmitAnswer(x,b,H)})}),this.lens.querySelectorAll('[data-action="issue-insert"]').forEach(m=>{m.addEventListener("click",()=>{let x=m.getAttribute("data-issue")||"";if(!x)return;let b=this.lens?.querySelector(".lens-input");if(!b)return;let H=b.value.length>0&&!b.value.endsWith(`
`);b.value=`${b.value}${H?`
`:""}${x}`,this._userNote=b.value,b.dispatchEvent(new Event("input",{bubbles:!0})),b.focus(),b.setSelectionRange(b.value.length,b.value.length)})});let E=this.lens.querySelector('[data-action="new-request"]');E&&E.addEventListener("click",()=>{this.mode="input",this._userNote="",this.activityEvents=[],this.currentStatus="idle",this.renderLens()});let k=this.lens.querySelector(".lens-followup-send"),C=this.lens.querySelector(".lens-followup-input");k&&C&&(k.addEventListener("click",()=>{let m=C.value.trim();m&&this.submitFollowUp(m)}),C.addEventListener("keydown",m=>{if(m.key==="Enter"&&!m.shiftKey){m.preventDefault();let x=C.value.trim();x&&this.submitFollowUp(x)}}))}hideLens(){this.lens&&(this.lens.remove(),this.lens=null)}toggleContextOverlays(){this.showingContextOverlays?this.hideContextOverlays():this.showContextOverlays()}showContextOverlays(){!this.currentElement||!this.currentSnapshot||(this.showingContextOverlays=!0,this.contextOverlays=qe(this.currentElement,this.currentSnapshot),this.contextOverlayElements=Be(this.shadow,this.contextOverlays))}hideContextOverlays(){this.showingContextOverlays=!1,je(this.shadow),this.contextOverlays=[],this.contextOverlayElements=[]}toggleSchemaView(){if(!this.lens||!this.currentSnapshot)return;let t=this.lens.querySelector(".lens-schema"),s=this.lens.querySelector(".lens-schema-organized"),i=this.lens.querySelector(".lens-schema-code");if(!t||!s||!i)return;if(t.getAttribute("data-expanded")==="true")t.setAttribute("data-expanded","false");else{s.innerHTML=Re(this.currentSnapshot),this.wireSchemaSection();let r=JSON.stringify(this.currentSnapshot,null,2);i.innerHTML=this.highlightJson(r),t.setAttribute("data-expanded","true")}}toggleJsonView(){if(!this.lens)return;let t=this.lens.querySelector(".lens-schema");if(!t)return;let s=t.getAttribute("data-view")||"organized";t.setAttribute("data-view",s==="json"?"organized":"json")}wireSchemaSection(){this.lens&&this.lens.querySelectorAll('[data-action="toggle-section"]').forEach(t=>{t.addEventListener("click",s=>{let i=s.currentTarget.getAttribute("data-section"),o=this.lens?.querySelector(`.schema-section[data-section="${i}"]`);if(o){let r=o.getAttribute("data-collapsed")==="true";o.setAttribute("data-collapsed",r?"false":"true")}})})}highlightJson(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/("(?:\\.|[^"\\])*")\s*:/g,'<span class="json-key">$1</span>:').replace(/:\s*("(?:\\.|[^"\\])*")/g,': <span class="json-string">$1</span>').replace(/:\s*(\d+\.?\d*)/g,': <span class="json-number">$1</span>').replace(/:\s*(true|false)/g,': <span class="json-bool">$1</span>').replace(/:\s*(null)/g,': <span class="json-null">$1</span>').replace(/([{}\[\]])/g,'<span class="json-bracket">$1</span>')}startPhraseRotation(){this.phraseInterval||(this.phraseIndex=Math.floor(Math.random()*L.length),this.phraseInterval=window.setInterval(()=>{this.phraseIndex=(this.phraseIndex+1)%L.length,Te(this.panel,this.currentStatus,this.phraseIndex)},1e4))}stopPhraseRotation(){this.phraseInterval&&(window.clearInterval(this.phraseInterval),this.phraseInterval=null)}async submit(t){if(!t.trim()||this.selectedSnapshots.length===0&&!this.currentSnapshot)return;this.interactionId=D(),this._userNote=t.trim();let s=this.selectedSnapshots.length>0?this.selectedSnapshots:this.currentSnapshot?[this.currentSnapshot]:[];this.submittedSnapshots=[...s];let i=X(this.interactionId,t,s);this.history=Q(this.history,i),w(this.history),this.renderHub();let o=this.multiSelectMode,r=[...this.selectedElements],a=[...this.selectedSnapshots];O({multiSelectHighlights:this.multiSelectHighlights},this.shadow),this.multiSelectHighlights=[],this.multiSelectMode=!1,this.mode="activity",this.activityEvents=[],this.currentStatus="pending",this.currentStatusMessage=null,this.uiMode==="lens"?this.renderLens():this.renderPanel();let c=await G({interactionId:this.interactionId,userNote:t.trim(),autoCommit:this.autoCommitEnabled,snapshots:s});c.success||(this.currentStatus="failed",this.history=N(this.history,this.interactionId,"failed"),w(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:c.error||"Failed to connect to bridge",timestamp:Date.now()}),o&&r.length>1&&(this.multiSelectMode=!0,this.selectedElements=r,this.selectedSnapshots=a,this.mode="input",this.multiSelectHighlights=P({multiSelectMode:!0,selectedElements:this.selectedElements,selectedSnapshots:this.selectedSnapshots,multiSelectHighlights:this.multiSelectHighlights,currentElement:this.currentElement,currentSnapshot:this.currentSnapshot},this.shadow),this.highlight&&(this.highlight.style.display="none")),this.uiMode==="lens"?this.renderLens():this.renderPanel())}async submitFollowUp(t){if(!t.trim()||this.submittedSnapshots.length===0)return;this.interactionId=D(),this._userNote=t.trim();let s=this.submittedSnapshots,i=X(this.interactionId,t,s);this.history=Q(this.history,i),w(this.history),this.renderHub(),this.activityEvents=[],this.currentStatus="pending",this.currentStatusMessage=null,this.uiMode==="lens"?this.renderLens():this.renderPanel();let o=await G({interactionId:this.interactionId,userNote:t.trim(),autoCommit:this.autoCommitEnabled,snapshots:s});o.success||(this.currentStatus="failed",this.history=N(this.history,this.interactionId,"failed"),w(this.history),this.renderHub(),this.activityEvents.push({type:"status",interactionId:this.interactionId,status:"failed",message:o.error||"Failed to connect to bridge",timestamp:Date.now()}),this.uiMode==="lens"?this.renderLens():this.renderPanel())}async handleSubmitAnswer(t,s,i){if(!this.interactionId)return;let o=this.activityEvents.find(r=>r.type==="question"&&r.questionId===t);o&&(o.selectedAnswerId=s,o.selectedAnswerLabel=i),this.uiMode==="lens"?this.renderLens():this.renderPanel(),await xe(this.interactionId,t,s,i)}async handleUndoRequest(t){let s=this.history.findIndex(o=>o.interactionId===t);if(s===-1)return;this.history[s].status="pending",w(this.history),this.renderHub(),(await ye(t)).success?this.history=Je(this.history,t):this.history[s].status="failed",w(this.history),this.renderHub()}async handleUndoFromPanel(){this.interactionId&&await this.handleUndoRequest(this.interactionId)}async handleCommitRequest(){if(!this.interactionId)return;let t=this.history.findIndex(i=>i.interactionId===this.interactionId);(await Se(this.interactionId)).success&&(t>=0&&(this.history[t].status="success",w(this.history),this.renderHub()),this.unfreeze())}};customElements.get("eyeglass-inspector")||customElements.define("eyeglass-inspector",F);function ot(){if(document.querySelector("eyeglass-inspector")){console.warn("[eyeglass] Inspector already initialized");return}let e=document.createElement("eyeglass-inspector");document.body.appendChild(e),console.log("[eyeglass] Inspector initialized. Hover over elements and click to annotate.")}typeof window<"u"&&typeof document<"u"&&(typeof process<"u"||(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ot):ot()));export{F as EyeglassInspector,S as captureSnapshot,q as extractFrameworkInfo,ot as initInspector};

"use client";
"use strict";var q=Object.create;var O=Object.defineProperty;var G=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var K=Object.getPrototypeOf,X=Object.prototype.hasOwnProperty;var Z=(e,t)=>{for(var o in t)O(e,o,{get:t[o],enumerable:!0})},H=(e,t,o,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of J(t))!X.call(e,a)&&a!==o&&O(e,a,{get:()=>t[a],enumerable:!(s=G(t,a))||s.enumerable});return e};var W=(e,t,o)=>(o=e!=null?q(K(e)):{},H(t||!e||!e.__esModule?O(o,"default",{value:e,enumerable:!0}):o,e)),ee=e=>H(O({},"__esModule",{value:!0}),e);var Ve={};Z(Ve,{CheckmarkIcon:()=>F,ErrorIcon:()=>w,LoaderIcon:()=>C,ToastBar:()=>$,ToastIcon:()=>U,Toaster:()=>Y,default:()=>ke,resolveValue:()=>u,toast:()=>n,useToaster:()=>_,useToasterStore:()=>V});module.exports=ee(Ve);var te=e=>typeof e=="function",u=(e,t)=>te(e)?e(t):e;var j=(()=>{let e=0;return()=>(++e).toString()})(),I=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})();var x=require("react"),oe=20;var Q=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,oe)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:o}=t;return Q(e,{type:e.toasts.find(r=>r.id===o.id)?1:0,toast:o});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(r=>r.id===s||s===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+a}))}}},k=[],y={toasts:[],pausedAt:void 0},l=e=>{y=Q(y,e),k.forEach(t=>{t(y)})},re={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},V=(e={})=>{let[t,o]=(0,x.useState)(y),s=(0,x.useRef)(y);(0,x.useEffect)(()=>(s.current!==y&&o(y),k.push(o),()=>{let r=k.indexOf(o);r>-1&&k.splice(r,1)}),[]);let a=t.toasts.map(r=>{var c,i,p;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||((c=e[r.type])==null?void 0:c.removeDelay)||(e==null?void 0:e.removeDelay),duration:r.duration||((i=e[r.type])==null?void 0:i.duration)||(e==null?void 0:e.duration)||re[r.type],style:{...e.style,...(p=e[r.type])==null?void 0:p.style,...r.style}}});return{...t,toasts:a}};var ae=(e,t="blank",o)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(o==null?void 0:o.id)||j()}),R=e=>(t,o)=>{let s=ae(t,e,o);return l({type:2,toast:s}),s.id},n=(e,t)=>R("blank")(e,t);n.error=R("error");n.success=R("success");n.loading=R("loading");n.custom=R("custom");n.dismiss=e=>{l({type:3,toastId:e})};n.remove=e=>l({type:4,toastId:e});n.promise=(e,t,o)=>{let s=n.loading(t.loading,{...o,...o==null?void 0:o.loading});return typeof e=="function"&&(e=e()),e.then(a=>{let r=t.success?u(t.success,a):void 0;return r?n.success(r,{id:s,...o,...o==null?void 0:o.success}):n.dismiss(s),a}).catch(a=>{let r=t.error?u(t.error,a):void 0;r?n.error(r,{id:s,...o,...o==null?void 0:o.error}):n.dismiss(s)}),e};var b=require("react");var ie=(e,t)=>{l({type:1,toast:{id:e,height:t}})},ne=()=>{l({type:5,time:Date.now()})},v=new Map,ce=1e3,pe=(e,t=ce)=>{if(v.has(e))return;let o=setTimeout(()=>{v.delete(e),l({type:4,toastId:e})},t);v.set(e,o)},_=e=>{let{toasts:t,pausedAt:o}=V(e);(0,b.useEffect)(()=>{if(o)return;let r=Date.now(),c=t.map(i=>{if(i.duration===1/0)return;let p=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(p<0){i.visible&&n.dismiss(i.id);return}return setTimeout(()=>n.dismiss(i.id),p)});return()=>{c.forEach(i=>i&&clearTimeout(i))}},[t,o]);let s=(0,b.useCallback)(()=>{o&&l({type:6,time:Date.now()})},[o]),a=(0,b.useCallback)((r,c)=>{let{reverseOrder:i=!1,gutter:p=8,defaultPosition:d}=c||{},h=t.filter(m=>(m.position||d)===(r.position||d)&&m.height),z=h.findIndex(m=>m.id===r.id),D=h.filter((m,B)=>B<z&&m.visible).length;return h.filter(m=>m.visible).slice(...i?[D+1]:[0,D]).reduce((m,B)=>m+(B.height||0)+p,0)},[t]);return(0,b.useEffect)(()=>{t.forEach(r=>{if(r.dismissed)pe(r.id,r.removeDelay);else{let c=v.get(r.id);c&&(clearTimeout(c),v.delete(r.id))}})},[t]),{toasts:t,handlers:{updateHeight:ie,startPause:ne,endPause:s,calculateOffset:a}}};var f=W(require("react")),P=require("goober");var g=W(require("react")),A=require("goober");var S=require("goober"),de=S.keyframes`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,me=S.keyframes`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ue=S.keyframes`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,w=(0,S.styled)("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${de} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${me} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ue} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;var M=require("goober"),le=M.keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,C=(0,M.styled)("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${le} 1s linear infinite;
`;var E=require("goober"),fe=E.keyframes`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Te=E.keyframes`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,F=(0,E.styled)("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${fe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Te} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;var ye=(0,A.styled)("div")`
  position: absolute;
`,ge=(0,A.styled)("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,he=A.keyframes`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,xe=(0,A.styled)("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${he} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,U=({toast:e})=>{let{icon:t,type:o,iconTheme:s}=e;return t!==void 0?typeof t=="string"?g.createElement(xe,null,t):t:o==="blank"?null:g.createElement(ge,null,g.createElement(C,{...s}),o!=="loading"&&g.createElement(ye,null,o==="error"?g.createElement(w,{...s}):g.createElement(F,{...s})))};var be=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Se=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ae="0%{opacity:0;} 100%{opacity:1;}",Pe="0%{opacity:1;} 100%{opacity:0;}",Re=(0,P.styled)("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ve=(0,P.styled)("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ee=(e,t)=>{let s=e.includes("top")?1:-1,[a,r]=I()?[Ae,Pe]:[be(s),Se(s)];return{animation:t?`${(0,P.keyframes)(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${(0,P.keyframes)(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},$=f.memo(({toast:e,position:t,style:o,children:s})=>{let a=e.height?Ee(e.position||t||"top-center",e.visible):{opacity:0},r=f.createElement(U,{toast:e}),c=f.createElement(ve,{...e.ariaProps},u(e.message,e));return f.createElement(Re,{className:e.className,style:{...a,...o,...e.style}},typeof s=="function"?s({icon:r,message:c}):f.createElement(f.Fragment,null,r,c))});var N=require("goober"),T=W(require("react"));(0,N.setup)(T.createElement);var De=({id:e,className:t,style:o,onHeightUpdate:s,children:a})=>{let r=T.useCallback(c=>{if(c){let i=()=>{let p=c.getBoundingClientRect().height;s(e,p)};i(),new MutationObserver(i).observe(c,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return T.createElement("div",{ref:r,className:t,style:o},a)},Oe=(e,t)=>{let o=e.includes("top"),s=o?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:I()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...s,...a}},Ie=N.css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,L=16,Y=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:s,children:a,containerStyle:r,containerClassName:c})=>{let{toasts:i,handlers:p}=_(o);return T.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:L,left:L,right:L,bottom:L,pointerEvents:"none",...r},className:c,onMouseEnter:p.startPause,onMouseLeave:p.endPause},i.map(d=>{let h=d.position||t,z=p.calculateOffset(d,{reverseOrder:e,gutter:s,defaultPosition:t}),D=Oe(h,z);return T.createElement(De,{id:d.id,key:d.id,onHeightUpdate:p.updateHeight,className:d.visible?Ie:"",style:D},d.type==="custom"?u(d.message,d):a?a(d):T.createElement($,{toast:d,position:h}))}))};var ke=n;0&&(module.exports={CheckmarkIcon,ErrorIcon,LoaderIcon,ToastBar,ToastIcon,Toaster,resolveValue,toast,useToaster,useToasterStore});
//# sourceMappingURL=index.js.map
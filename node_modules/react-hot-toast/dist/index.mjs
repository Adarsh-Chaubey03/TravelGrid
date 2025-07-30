"use client";
var W=e=>typeof e=="function",f=(e,t)=>W(e)?e(t):e;var F=(()=>{let e=0;return()=>(++e).toString()})(),A=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})();import{useEffect as H,useState as j,useRef as Q}from"react";var Y=20;var U=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,Y)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:r}=t;return U(e,{type:e.toasts.find(o=>o.id===r.id)?1:0,toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(o=>o.id===s||s===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+a}))}}},P=[],y={toasts:[],pausedAt:void 0},u=e=>{y=U(y,e),P.forEach(t=>{t(y)})},q={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[t,r]=j(y),s=Q(y);H(()=>(s.current!==y&&r(y),P.push(r),()=>{let o=P.indexOf(r);o>-1&&P.splice(o,1)}),[]);let a=t.toasts.map(o=>{var n,i,p;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((n=e[o.type])==null?void 0:n.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((i=e[o.type])==null?void 0:i.duration)||(e==null?void 0:e.duration)||q[o.type],style:{...e.style,...(p=e[o.type])==null?void 0:p.style,...o.style}}});return{...t,toasts:a}};var J=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||F()}),x=e=>(t,r)=>{let s=J(t,e,r);return u({type:2,toast:s}),s.id},c=(e,t)=>x("blank")(e,t);c.error=x("error");c.success=x("success");c.loading=x("loading");c.custom=x("custom");c.dismiss=e=>{u({type:3,toastId:e})};c.remove=e=>u({type:4,toastId:e});c.promise=(e,t,r)=>{let s=c.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(a=>{let o=t.success?f(t.success,a):void 0;return o?c.success(o,{id:s,...r,...r==null?void 0:r.success}):c.dismiss(s),a}).catch(a=>{let o=t.error?f(t.error,a):void 0;o?c.error(o,{id:s,...r,...r==null?void 0:r.error}):c.dismiss(s)}),e};import{useEffect as $,useCallback as L}from"react";var K=(e,t)=>{u({type:1,toast:{id:e,height:t}})},X=()=>{u({type:5,time:Date.now()})},b=new Map,Z=1e3,ee=(e,t=Z)=>{if(b.has(e))return;let r=setTimeout(()=>{b.delete(e),u({type:4,toastId:e})},t);b.set(e,r)},O=e=>{let{toasts:t,pausedAt:r}=D(e);$(()=>{if(r)return;let o=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let p=(i.duration||0)+i.pauseDuration-(o-i.createdAt);if(p<0){i.visible&&c.dismiss(i.id);return}return setTimeout(()=>c.dismiss(i.id),p)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,r]);let s=L(()=>{r&&u({type:6,time:Date.now()})},[r]),a=L((o,n)=>{let{reverseOrder:i=!1,gutter:p=8,defaultPosition:d}=n||{},h=t.filter(m=>(m.position||d)===(o.position||d)&&m.height),v=h.findIndex(m=>m.id===o.id),S=h.filter((m,E)=>E<v&&m.visible).length;return h.filter(m=>m.visible).slice(...i?[S+1]:[0,S]).reduce((m,E)=>m+(E.height||0)+p,0)},[t]);return $(()=>{t.forEach(o=>{if(o.dismissed)ee(o.id,o.removeDelay);else{let n=b.get(o.id);n&&(clearTimeout(n),b.delete(o.id))}})},[t]),{toasts:t,handlers:{updateHeight:K,startPause:X,endPause:s,calculateOffset:a}}};import*as l from"react";import{styled as B,keyframes as z}from"goober";import*as g from"react";import{styled as w,keyframes as me}from"goober";import{styled as te,keyframes as I}from"goober";var oe=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,re=I`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,se=I`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,k=te("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${re} 0.15s ease-out forwards;
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
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;import{styled as ae,keyframes as ie}from"goober";var ne=ie`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=ae("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ne} 1s linear infinite;
`;import{styled as ce,keyframes as N}from"goober";var pe=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,de=N`
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
}`,_=ce("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
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
`;var ue=w("div")`
  position: absolute;
`,le=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,fe=me`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${fe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return t!==void 0?typeof t=="string"?g.createElement(Te,null,t):t:r==="blank"?null:g.createElement(le,null,g.createElement(V,{...s}),r!=="loading"&&g.createElement(ue,null,r==="error"?g.createElement(k,{...s}):g.createElement(_,{...s})))};var ye=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ge=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,he="0%{opacity:0;} 100%{opacity:1;}",xe="0%{opacity:1;} 100%{opacity:0;}",be=B("div")`
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
`,Se=B("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ae=(e,t)=>{let s=e.includes("top")?1:-1,[a,o]=A()?[he,xe]:[ye(s),ge(s)];return{animation:t?`${z(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${z(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},C=l.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?Ae(e.position||t||"top-center",e.visible):{opacity:0},o=l.createElement(M,{toast:e}),n=l.createElement(Se,{...e.ariaProps},f(e.message,e));return l.createElement(be,{className:e.className,style:{...a,...r,...e.style}},typeof s=="function"?s({icon:o,message:n}):l.createElement(l.Fragment,null,o,n))});import{css as Pe,setup as Re}from"goober";import*as T from"react";Re(T.createElement);var ve=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let o=T.useCallback(n=>{if(n){let i=()=>{let p=n.getBoundingClientRect().height;s(e,p)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return T.createElement("div",{ref:o,className:t,style:r},a)},Ee=(e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...a}},De=Pe`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,Oe=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,containerStyle:o,containerClassName:n})=>{let{toasts:i,handlers:p}=O(r);return T.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...o},className:n,onMouseEnter:p.startPause,onMouseLeave:p.endPause},i.map(d=>{let h=d.position||t,v=p.calculateOffset(d,{reverseOrder:e,gutter:s,defaultPosition:t}),S=Ee(h,v);return T.createElement(ve,{id:d.id,key:d.id,onHeightUpdate:p.updateHeight,className:d.visible?De:"",style:S},d.type==="custom"?f(d.message,d):a?a(d):T.createElement(C,{toast:d,position:h}))}))};var Vt=c;export{_ as CheckmarkIcon,k as ErrorIcon,V as LoaderIcon,C as ToastBar,M as ToastIcon,Oe as Toaster,Vt as default,f as resolveValue,c as toast,O as useToaster,D as useToasterStore};
//# sourceMappingURL=index.mjs.map
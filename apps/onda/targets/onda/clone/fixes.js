/* Canvas algorithms captured from the public Onda source on 2026-10-18.
 * Original equations, timing, palette, image dithering and interaction parameters are retained.
 * A small adapter attaches the original effects to captured DOM; no React runtime or remote scripts.
 */
(() => { 'use strict';
const modules = {};
let currentCanvas = null;
const cleanup = [];
modules[1398] = { jsx: () => null, jsxs: () => null };
modules[1788] = {
  useRef: () => ({ current: currentCanvas }),
  useState: value => [value, () => {}],
  useEffect: effect => { const dispose = effect(); if (dispose) cleanup.push(dispose); },
};
modules[3533] = { cn: (...parts) => parts.filter(Boolean).join(' ') };
function register(id, factory) {
  factory({ i: id => modules[id], s: (entries, target = id) => {
    const exported = modules[target] ||= {};
    for (let i = 0; i < entries.length; i += 3) exported[entries[i]] = entries[i + 2];
  }});
}
function mount(component, canvas, props = {}) {
  if (!canvas) return;
  currentCanvas = canvas;
  const start = cleanup.length;
  component(props);
  currentCanvas = null;
  const disposers = cleanup.splice(start);
  return () => disposers.forEach(dispose => dispose());
}

register(2406, e=>{"use strict";let t=[{size:.24,color:"--azure-200"},{size:.34,color:"--azure-200"},{size:.46,color:"--azure-300"},{size:.58,color:"--azure-400"},{size:.7,color:"--azure-500"},{size:.82,color:"--azure-600"}],r={"--grid-dot":"#e1e5eb","--azure-200":"#ddd6fe","--azure-300":"#c4b5fd","--azure-400":"#a78bfa","--azure-500":"#7c3aed","--azure-600":"#6d28d9"},o=e=>{let t=r[e]??"#7c3aed";return getComputedStyle(document.documentElement).getPropertyValue(e).trim()||t};e.s(["DOT_LEVELS",0,t,"readCssColor",0,o,"readDotColors",0,()=>t.map(e=>o(e.color))])});
register(7254, e=>{"use strict";var t=e.i(2406);let r=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],o=t.DOT_LEVELS.length,a=e=>e<0?0:e>1?1:e,n=(e,t,r)=>{let o=a((r-e)/(t-e));return o*o*(3-2*o)};e.s(["clamp01",0,a,"createGridLayer",0,(e,t,r,o,a,n)=>{let i=document.createElement("canvas");i.width=e,i.height=t;let l=i.getContext("2d");if(!l)return null;let s=Math.max(1,Math.round(.14*a)),d=Math.floor((a-s)/2);l.fillStyle=n,l.beginPath();for(let e=0;e<o;e++)for(let t=0;t<r;t++)l.rect(t*a+d,e*a+d,s,s);return l.fill(),i},"paintDots",0,(e,r,a,n,i,l)=>{for(let s=1;s<=o;s++){let o=Math.max(1,Math.round(i*t.DOT_LEVELS[s-1].size)),d=Math.floor((i-o)/2),c=!1;e.beginPath();for(let t=0,l=0;t<n;t++){let n=t*i+d;for(let t=0;t<a;t++,l++)r[l]===s&&(e.rect(t*i+d,n,o,o),c=!0)}c&&(e.fillStyle=l[s-1],e.fill())}},"smoothstep",0,n,"toLevel",0,(e,t,a)=>{if(e>=.14){let t=2+Math.floor((e-.14)/.86*(o-1));return t>o?o:t}return e<=.015?0:+(e/.14>(r[(3&a)<<2|3&t]+.5)/16)}],8659);let i=1/3,l=1/6,s=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),d=e=>{let t=e>>>0;return()=>{let e=t=t+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}},c=(e=1)=>{let t=d(e),r=new Uint8Array(256),o=new Uint8Array(512),a=new Uint8Array(512);for(let e=0;e<256;e++)r[e]=e;for(let e=255;e>0;e--){let o=Math.floor(t()*(e+1)),a=r[e];r[e]=r[o],r[o]=a}for(let e=0;e<512;e++)o[e]=r[255&e],a[e]=o[e]%12;return(e,t,r)=>{let n=(e+t+r)*i,d=Math.floor(e+n),c=Math.floor(t+n),m=Math.floor(r+n),p=(d+c+m)*l,u=e-(d-p),h=t-(c-p),f=r-(m-p),b=0,g=0,x=0,w=0,k=0,v=0;u>=h?h>=f?(b=1,w=1,k=1):(u>=f?b=1:x=1,w=1,v=1):h<f?(x=1,k=1,v=1):u<f?(g=1,k=1,v=1):(g=1,w=1,k=1);let y=u-b+l,M=h-g+l,j=f-x+l,z=u-w+2*l,A=h-k+2*l,N=f-v+2*l,C=u-1+3*l,S=h-1+3*l,E=f-1+3*l,L=255&d,F=255&c,O=255&m,R=0,D=.6-u*u-h*h-f*f;if(D>0){let e=3*a[L+o[F+o[O]]];D*=D,R+=D*D*(s[e]*u+s[e+1]*h+s[e+2]*f)}let W=.6-y*y-M*M-j*j;if(W>0){let e=3*a[L+b+o[F+g+o[O+x]]];W*=W,R+=W*W*(s[e]*y+s[e+1]*M+s[e+2]*j)}let V=.6-z*z-A*A-N*N;if(V>0){let e=3*a[L+w+o[F+k+o[O+v]]];V*=V,R+=V*V*(s[e]*z+s[e+1]*A+s[e+2]*N)}let q=.6-C*C-S*S-E*E;if(q>0){let e=3*a[L+1+o[F+1+o[O+1]]];q*=q,R+=q*q*(s[e]*C+s[e+1]*S+s[e+2]*E)}return 32*R}};e.s(["createNoise3D",0,c,"createRandom",0,d],7036);let m=e=>({...e,cos:Math.cos(e.angle),sin:Math.sin(e.angle),reach:Math.abs(e.waveAmp[0])+Math.abs(e.waveAmp[1])+e.width+.12});e.s(["createGlobeField",0,(e=11)=>{let t=c(e);return(e,r,o)=>{let a=Math.sqrt(e*e+r*r);if(a>=.38){let t=e/.6080000000000001,a=(r+.18*e)/.1596,n=1-Math.abs(Math.sqrt(t*t+a*a)-1)/.16,i=.6*o,l=.38*Math.cos(i)*1.6,s=.38*Math.sin(i)*.42-.18*l,d=e-l,c=r-s;return Math.max(n>0?.42*n:0,Math.exp(-(d*d+c*c)/.0014))}let i=e/.38,l=r/.38,s=Math.sqrt(Math.max(0,1-i*i-l*l)),d=.3894183423086505*l+.9210609940028851*s,c=.32*o,m=Math.cos(c),p=Math.sin(c),u=t(1.7*(i*m+d*p),1.7*(.9210609940028851*l-.3894183423086505*s),1.7*(d*m-i*p)),h=Math.max(0,-.52*i+-.56*l+.64*s);return Math.max(u>.08?.42+.58*h:.08+.22*h,.3*n(.82,1,a/.38))}},"createMorphField",0,()=>(e,t,r)=>{let o=.22*r,a=Math.cos(o),i=Math.sin(o),l=Math.abs(e*a+t*i),s=Math.abs(-e*i+t*a);if(.045>Math.abs(l-.33)&&s<.045||.045>Math.abs(s-.33)&&l<.045)return 1;let d=2+(.5+.5*Math.sin(.7*r))*4,c=Math.pow(Math.pow(l,d)+Math.pow(s,d),1/d),m=.85*(1-n(.014,.05,Math.abs(c-.33)));return c<.33&&(m=Math.max(m,.32*(.5+.5*Math.cos(38*c-2*r))*(1-c/.33)+.04)),m},"createRippleField",0,()=>(e,t,r)=>{let o=-.34+.06*Math.sin(.37*r),n=.05*Math.cos(.29*r),i=.34+.05*Math.cos(.31*r),l=-.06*Math.sin(.43*r);return a((.5+.25*(Math.cos(32*Math.sqrt((e-o)*(e-o)+(t-n)*(t-n))-2.4*r)+Math.cos(32*Math.sqrt((e-i)*(e-i)+(t-l)*(t-l))-2.4*r)))*Math.exp(-(1.8*(e*e*.7+t*t*2.4)))*1.2)},"createSilkField",0,(e=3,t=0)=>{let r=c(e),o=[m({angle:-.62+t,length:.86,width:.2,offset:0,waveAmp:[.11,.04],waveFreq:[2.6,5.9],waveSpeed:[.36,-.58],twistFreq:2.1,twistSpeed:.28,phase:0,strength:1}),m({angle:-.48+t,length:.66,width:.11,offset:.1,waveAmp:[.12,.03],waveFreq:[1.9,6.8],waveSpeed:[-.28,.46],twistFreq:2.9,twistSpeed:-.4,phase:2.1,strength:.78})];return(e,t,i)=>{let l=!1;for(let r=0;r<o.length;r++){let a=o[r],n=e*a.cos+t*a.sin,i=-e*a.sin+t*a.cos-a.offset;if(Math.abs(n)<a.length+.12&&Math.abs(i)<a.reach){l=!0;break}}if(!l)return 0;let s=r(1.25*e,1.25*t,.1*i),d=r(3.2*e+11.7,3.2*t-4.3,.2*i),c=0;for(let r=0;r<o.length;r++){let l=o[r],m=e*l.cos+t*l.sin,p=-e*l.sin+t*l.cos,u=Math.abs(m+.1*s)/l.length;if(u>=1)continue;let h=l.offset+l.waveAmp[0]*Math.sin(m*l.waveFreq[0]+i*l.waveSpeed[0]+l.phase)+l.waveAmp[1]*Math.sin(m*l.waveFreq[1]+i*l.waveSpeed[1]+1.7*l.phase)+.06*s,f=m*l.twistFreq-i*l.twistSpeed+l.phase+.7*s,b=Math.abs(Math.cos(f)),g=(p-h+.028*d)/(l.width*(1-u*u)*(.16+.84*b)),x=Math.abs(g);if(x>=1)continue;let w=(1-n(.55,1,x))*a(.5+.38*g*Math.sin(f)+.34*(1-b))*(1-n(.6,1,u))*l.strength;w>c&&(c=w)}return c}},"createStreamField",0,(e=5)=>{let t=d(e),r=new Float32Array(64),o=new Float32Array(64),a=new Float32Array(64),n=new Float32Array(64),i=new Float32Array(64);for(let e=0;e<64;e++)r[e]=.12+.42*t(),o[e]=10*t(),a[e]=.9+1.8*t(),n[e]=.18+.42*t(),i[e]=.55+.45*t();let l=1,s=(e,t,s,d,c)=>{if(c%2==1)return 0;let m=(c>>1)%64,p=Math.min(d,l-1-d),u=p>=6?1:Math.max(0,p)/6,h=e*a[m]-s*r[m]+o[m],f=h-Math.floor(h);return f>n[m]?.03*u:(.28+.72*(f/n[m]))*i[m]*u};return s.prepare=e=>{l=e.cols},s},"createWordmarkField",0,(e,t,r)=>{let o=new Float32Array(0),a=0,n=0,i=(e,t,r,i,l)=>{if(i>=a||l>=n)return 0;let s=o[l*a+i];return s<=.02?0:s*(.6+.4*Math.sin(4.6*e-1.4*r+1.2*Math.sin(3*t+.5*r)))};return i.prepare=({cols:i,rows:l})=>{a=i,n=l,o=new Float32Array(i*l);let s=document.createElement("canvas");s.width=i,s.height=l;let d=s.getContext("2d",{willReadFrequently:!0});if(!d)return;let[c,m]=t,p=Math.min(.98*i/c,.84*l/m);d.setTransform(p,0,0,p,(i-c*p)/2,(l-m*p)/2),d.lineWidth=r,d.strokeStyle="#000",e.forEach(e=>d.stroke(new Path2D(e)));let u=d.getImageData(0,0,i,l).data;for(let e=0;e<o.length;e++)o[e]=u[4*e+3]/255},i}],7254)});
register(6965, e=>{"use strict";var t=e.i(1398),r=e.i(1788),o=e.i(3533);let a=new Set,n=0,i=e=>{n=0,a.forEach(t=>t(e)),a.size>0&&!n&&(n=requestAnimationFrame(i))},l=e=>(a.add(e),n||(n=requestAnimationFrame(i)),()=>{a.delete(e),0===a.size&&n&&(cancelAnimationFrame(n),n=0)});e.s(["subscribeTick",0,l],4631);var s=e.i(2406),d=e.i(8659);let c=1e3/60-2;e.s(["DotCanvas",0,({field:e,className:a,cell:n=7,mobileCell:i=5,maxCells:m=24e3,centerX:p=.5,centerY:u=.5,mobileCenterX:h,mobileCenterY:f,scale:b=1,speed:g=1,grid:x=!1,interactive:w=!1,startTime:k=6})=>{let v=(0,r.useRef)(null),[y,M]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let t=v.current,r=t?.getContext("2d");if(!t||!r)return;let o=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=window.matchMedia("(pointer: fine)").matches,y=w&&a&&!o,j=(0,s.readDotColors)(),z=(0,s.readCssColor)("--grid-dot"),A={targetU:0,targetV:0,u:0,v:0,inside:!1,strength:0},N=0,C=0,S=0,E=0,L=0,F=1,O=0,R=0,D=new Float32Array(0),W=new Float32Array(0),V=new Uint8Array(0),q=null,I=k,T=0,P=0,G=!1,U=null,_=()=>{if(!E||!L)return;let t=y&&A.strength>.002;for(let r=0,o=0;r<L;r++)for(let a=0;a<E;a++,o++){let n=D[o],i=W[o],l=0;if(t){let e=n-A.u,t=i-A.v,r=e*e+t*t;r<.168&&(n-=e*(l=Math.exp(-r/.028)*A.strength)*.32,i-=t*l*.32)}let s=e(n,i,I,a,r);l>0&&(s+=.3*l*(1-.5*s)),V[o]=(0,d.toLevel)(s,a,r)}r.clearRect(0,0,N,C),q&&r.drawImage(q,0,0),(0,d.paintDots)(r,V,E,L,S,j),G||(G=!0,M(!0))},B=()=>{let r=t.getBoundingClientRect(),o=Math.max(1,r.width),a=Math.max(1,r.height),l=Math.min(window.devicePixelRatio||1,2),s=o<640,c=s?i:n;for(;o/c*(a/c)>m;)c+=.5;S=Math.max(2,Math.round(c*l)),N=Math.round(o*l),C=Math.round(a*l),t.width=N,t.height=C,E=Math.ceil(N/S),L=Math.ceil(C/S),F=Math.min(N,C)*b,O=N*(s&&void 0!==h?h:p),R=C*(s&&void 0!==f?f:u);let g=E*L;D=new Float32Array(g),W=new Float32Array(g),V=new Uint8Array(g);for(let e=0,t=0;e<L;e++){let r=((e+.5)*S-R)/F;for(let e=0;e<E;e++,t++)D[t]=((e+.5)*S-O)/F,W[t]=r}q=x?(0,d.createGridLayer)(N,C,E,L,S,z):null,e.prepare?.({cols:E,rows:L,cellPx:S,width:N,height:C}),_()},H=e=>{if(T&&e-T<c)return;let t=T?Math.min((e-T)/1e3,.05):1/60;T=e,I+=t*g,y&&(A.u+=(A.targetU-A.u)*.14,A.v+=(A.targetV-A.v)*.14,A.strength+=(!!A.inside-A.strength)*.06),_()},K=()=>{U?.(),U=null},$=e=>{let r=t.getBoundingClientRect(),o=e.clientX-r.left,a=e.clientY-r.top,n=N/Math.max(1,r.width);A.inside=o>=0&&a>=0&&o<=r.width&&a<=r.height,A.targetU=(o*n-O)/F,A.targetV=(a*n-R)/F,A.strength<.01&&(A.u=A.targetU,A.v=A.targetV)},X=e=>{e.relatedTarget||(A.inside=!1)},Y=new IntersectionObserver(e=>{e[0]?.isIntersecting?U||o||(T=0,U=l(H)):K()},{rootMargin:"120px 0px"}),Z=new ResizeObserver(()=>{cancelAnimationFrame(P),P=requestAnimationFrame(B)});return B(),Y.observe(t),Z.observe(t),y&&(window.addEventListener("pointermove",$,{passive:!0}),window.addEventListener("pointerout",X)),()=>{K(),Y.disconnect(),Z.disconnect(),cancelAnimationFrame(P),window.removeEventListener("pointermove",$),window.removeEventListener("pointerout",X)}},[e,n,i,m,p,u,h,f,b,g,x,w,k]),(0,t.jsx)("canvas",{ref:v,"aria-hidden":"true",className:(0,o.cn)("block size-full transition-opacity duration-1000 ease-out",y?"opacity-100":"opacity-0",a)})}],6965)});
register(4021, e=>{"use strict";var t=e.i(1398),r=e.i(1788),o=e.i(2406);e.s(["CursorDots",0,()=>{let e=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t=e.current,r=t?.getContext("2d");if(!t||!r||!window.matchMedia("(pointer: fine)").matches||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let a=(0,o.readDotColors)(),n=(0,o.readCssColor)("--grid-dot"),i=[],l=1,s=8,d=0,c=-9999,m=-9999,p=0,u=!1,h=()=>{s=Math.round(8*(l=Math.min(window.devicePixelRatio||1,2))),t.width=Math.round(window.innerWidth*l),t.height=Math.round(window.innerHeight*l)},f=e=>{for(d=0;i.length&&e-i[0].at>650;)i.shift();if(p+=(!!u-p)*.12,r.clearRect(0,0,t.width,t.height),!i.length&&p<.01)return;let h=90*l,b=170*l,g=c*l,x=m*l,w=g-b,k=g+b,v=x-b,y=x+b;for(let e of i)w=Math.min(w,e.x*l-h),k=Math.max(k,e.x*l+h),v=Math.min(v,e.y*l-h),y=Math.max(y,e.y*l+h);let M=Math.max(0,Math.floor(w/s)),j=Math.min(Math.ceil(t.width/s),Math.ceil(k/s)),z=Math.max(0,Math.floor(v/s)),A=Math.min(Math.ceil(t.height/s),Math.ceil(y/s)),N=h*h,C=b*b,S=Math.max(1,Math.round(.16*s)),E=Math.floor((s-S)/2);for(let t=z;t<A;t++){let d=(t+.5)*s;for(let c=M;c<j;c++){let m=(c+.5)*s,u=0;for(let t=0;t<i.length;t++){let r=i[t],o=m-r.x*l,a=d-r.y*l,n=o*o+a*a;if(n>=N)continue;let s=1-(e-r.at)/650,c=Math.exp(-n/N*3.2)*s*s;c>u&&(u=c)}let h=Math.min(4,Math.floor((.85*u+((7*c+13*t)%5-2)*.03)*5));if(h>=1){let e=Math.max(1,Math.round(s*o.DOT_LEVELS[h-1].size)),n=Math.floor((s-e)/2);r.fillStyle=a[h-1],r.fillRect(c*s+n,t*s+n,e,e);continue}let f=m-g,b=d-x,w=f*f+b*b;p>.01&&w<C&&(r.globalAlpha=(1-w/C)*p,r.fillStyle=n,r.fillRect(c*s+E,t*s+E,S,S),r.globalAlpha=1)}}d=requestAnimationFrame(f)},b=()=>{d||(d=requestAnimationFrame(f))},g=e=>{let t=e.target instanceof Element?e.target:null;if(u=!t?.closest("#top"),c=e.clientX,m=e.clientY,u){let e=performance.now(),t=i[i.length-1];(!t||Math.hypot(t.x-c,t.y-m)>6)&&(i.push({x:c,y:m,at:e}),i.length>24&&i.shift())}b()},x=()=>{u=!1,b()};return h(),window.addEventListener("resize",h),window.addEventListener("pointermove",g,{passive:!0}),document.documentElement.addEventListener("pointerleave",x),()=>{cancelAnimationFrame(d),window.removeEventListener("resize",h),window.removeEventListener("pointermove",g),document.documentElement.removeEventListener("pointerleave",x)}},[]),(0,t.jsx)("canvas",{ref:e,"aria-hidden":"true",className:"pointer-events-none fixed inset-0 z-40 size-full mix-blend-multiply"})}])});
const HalftonePhoto = (() => {
const t=modules[1398],s=modules[1788],N=modules[3533],k={},S=modules[4631],R=modules[7036],_=modules[2406],E=modules[8659];
return ({src:e,alt:i,className:r,cell:a=6,mobileCell:l=5,focusX:n=.5,focusY:o=.5,sizes:d="(min-width: 1024px) 50vw, 100vw"})=>{let c=(0,s.useRef)(null),[m,u]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{let t=c.current,i=t?.getContext("2d");if(!t||!i)return;let r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=(0,_.readDotColors)(),d=new window.Image,m=0,p=0,f=0,g=0,x=0,h=new Float32Array(0),b=new Float32Array(0),j=new Uint8Array(0),w=+!!r,v=!1,y=!1,N=!1,k=!1,C=0,M=0,z=null,O=()=>{if(!g||!x||h.length!==g*x)return;let e=w<1,t=1.25*w;for(let i=0,r=0;i<x;i++)for(let s=0;s<g;s++,r++){let a=h[r];e&&(a*=(0,E.clamp01)((t-b[r])/.25)),j[r]=(0,E.toLevel)(a,s,i)}i.clearRect(0,0,m,p),(0,E.paintDots)(i,j,g,x,f,s),k||(k=!0,u(!0))},P=()=>{let e=t.getBoundingClientRect(),i=Math.max(1,e.width),r=Math.max(1,e.height),s=Math.min(window.devicePixelRatio||1,2);f=Math.max(2,Math.round((i<640?l:a)*s)),m=Math.round(i*s),p=Math.round(r*s),t.width=m,t.height=p,g=Math.ceil(m/f),x=Math.ceil(p/f),v&&((()=>{let e=g*x,t=(0,R.createRandom)(31*g+x);h=new Float32Array(e),b=new Float32Array(e),j=new Uint8Array(e);for(let e=0,i=0;e<x;e++)for(let r=0;r<g;r++,i++)b[i]=(r/g*.55+e/x*.45)*.9+.1*t();let i=d.naturalWidth,r=d.naturalHeight;if(!i||!r)return;let s=m/p,a=i,l=r;i/r>s?a=r*s:l=i/s;let c=(i-a)*n,u=(r-l)*o,w=document.createElement("canvas");w.width=4*g,w.height=4*x;let v=w.getContext("2d"),y=document.createElement("canvas");y.width=g,y.height=x;let N=y.getContext("2d",{willReadFrequently:!0});if(!v||!N)return;let k=m/f,S=p/f;v.fillStyle="#ffffff",v.fillRect(0,0,w.width,w.height),v.imageSmoothingEnabled=!0,v.imageSmoothingQuality="high",v.drawImage(d,c,u,a,l,0,0,4*k,4*S),N.imageSmoothingEnabled=!0,N.imageSmoothingQuality="high",N.drawImage(w,0,0,g,x);let _=N.getImageData(0,0,g,x).data,C=new Float32Array(e);for(let t=0;t<e;t++){let e=4*t;C[t]=1-(.2126*_[e]+.7152*_[e+1]+.0722*_[e+2])/255}let M=Float32Array.from(C).sort(),z=M[Math.floor(.03*e)],O=Math.max(.12,M[Math.min(e-1,Math.floor(.985*e))]-z);for(let t=0;t<e;t++)h[t]=Math.pow((0,E.clamp01)((C[t]-z)/O),.9)})(),O())},I=()=>{z?.(),z=null},T=e=>{let t=C?Math.min((e-C)/1e3,.05):1/60;C=e,w=Math.min(1,w+t/1.6),O(),w>=1&&I()},A=()=>{!z&&!(w>=1)&&v&&N&&(C=0,z=(0,S.subscribeTick)(T))};d.decoding="async",d.onload=()=>{v=!0,P(),A()};let D=new IntersectionObserver(t=>{t[0]?.isIntersecting&&!y&&(y=!0,d.src=e,D.disconnect())},{rootMargin:"600px 0px"}),F=new IntersectionObserver(e=>{e[0]?.isIntersecting&&(N=!0,A(),F.disconnect())},{rootMargin:"0px 0px -12% 0px"}),$=new ResizeObserver(()=>{cancelAnimationFrame(M),M=requestAnimationFrame(P)});return P(),D.observe(t),F.observe(t),$.observe(t),()=>{I(),D.disconnect(),F.disconnect(),$.disconnect(),cancelAnimationFrame(M),d.onload=null}},[e,a,l,n,o]),(0,t.jsxs)("div",{className:(0,N.cn)("group/halftone relative overflow-hidden",r),children:[(0,t.jsx)(k.default,{src:e,alt:i,fill:!0,sizes:d,className:"halftone-photo object-cover opacity-0 transition-opacity duration-700 ease-out group-hover/halftone:opacity-100",style:{objectPosition:`${100*n}% ${100*o}%`}}),(0,t.jsx)("canvas",{ref:c,"aria-hidden":"true",className:(0,N.cn)("absolute inset-0 block size-full transition-opacity duration-700 ease-out group-hover/halftone:opacity-0",m?"opacity-100":"opacity-0")})]})};
})();
register(5836, e => { let o=[168,50],a=["M3.5 32a14.5 14.5 0 1 0 29 0a14.5 14.5 0 1 0 -29 0","M47.5 50V14","M47.5 32a14.5 14.5 0 0 1 29 0V50","M91.5 32a14.5 14.5 0 1 0 29 0a14.5 14.5 0 1 0 -29 0","M120.5 0V50","M135.5 32a14.5 14.5 0 1 0 29 0a14.5 14.5 0 1 0 -29 0","M164.5 14V50"],n="M6.5 12c1.65-2.8 3.85-2.8 5.5 0s3.85 2.8 5.5 0";e.s(["MARK_WAVE_PATH",0,n,"WORDMARK_PATHS",0,a,"WORDMARK_STROKE",0,7,"WORDMARK_VIEWBOX",0,o],5836); });
const fields=modules[7254], DotCanvas=modules[6965].DotCanvas;
const contactPage = document.title.startsWith('Contact');
mount(DotCanvas, document.querySelector('#top canvas'), {field:contactPage ? fields.createSilkField(29,.12) : fields.createSilkField(3),grid:true,interactive:true,centerX:contactPage ? .68 : .62,centerY:.42,mobileCenterX:contactPage ? .55 : .52,mobileCenterY:.3,speed:contactPage ? .85 : 1});
const motifs=[fields.createMorphField(),fields.createStreamField(5),fields.createGlobeField(11),fields.createRippleField()];
document.querySelectorAll('#services canvas').forEach((canvas,i)=>mount(DotCanvas,canvas,{field:motifs[i],grid:true,cell:6,mobileCell:5,startTime:4}));
const wordmark=modules[5836];
mount(DotCanvas,document.querySelector('footer canvas'),{field:fields.createWordmarkField(wordmark.WORDMARK_PATHS,wordmark.WORDMARK_VIEWBOX,wordmark.WORDMARK_STROKE),grid:true,interactive:true,cell:8,mobileCell:4,startTime:2});
mount(modules[4021].CursorDots,document.querySelector('canvas.fixed'));
document.querySelectorAll('[class~="group/halftone"]').forEach(box=>{
 const img=box.querySelector('img'),canvas=box.querySelector('canvas');
 const [focusX,focusY]=img.style.objectPosition.split(' ').map(v=>parseFloat(v)/100);
 const original=img.getAttribute('data-original-image');
 const portrait=box.closest('#testimonial');
 mount(HalftonePhoto,canvas,{src:original||img.src,focusX,focusY,...(portrait?{cell:5,mobileCell:4}:{})});
});

// Header state, thresholds and classes follow the captured SiteHeader component.
try {
 const header=document.querySelector('header'),button=document.querySelector('[aria-controls="mobile-menu"]'),menu=document.getElementById('mobile-menu');
 const base='fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300';
 const icon=button?.querySelector('svg');
 const menuIcon=icon?.innerHTML;
 let opened=false;
 const updateHeader=()=>{header.className=base+' '+(opened?'border-line bg-white':scrollY>24?'border-line bg-white/85 backdrop-blur-md':'border-transparent bg-transparent');};
 const setOpen=value=>{
  opened=value;menu.hidden=!value;button.setAttribute('aria-expanded',String(value));
  button.querySelector('.sr-only').textContent=value?'Close menu':'Open menu';
  icon.innerHTML=value?'<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>':menuIcon;
  document.body.style.overflow=value?'hidden':'';updateHeader();
 };
 button?.addEventListener('click',()=>setOpen(!opened));
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){setOpen(false);button.focus();}});
 window.addEventListener('resize',()=>{if(innerWidth>=768&&opened)setOpen(false);});
 window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
} catch(error) { console.error('Header:',error); }

// Reveal classes are re-armed; authored stylesheet supplies exact timing and easing.
try {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{rootMargin:'0px 0px -12% 0px'});
  document.querySelectorAll('.reveal,.split-word').forEach(el=>{el.classList.remove('is-visible');observer.observe(el);});
  document.querySelectorAll('#top .split-word').forEach(el=>requestAnimationFrame(()=>el.classList.add('is-visible')));
  const stats=document.querySelectorAll('#studio ul > li');
  const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   countObserver.unobserve(entry.target);
   const span=entry.target.querySelector('p:nth-child(2) span');
   if(!span)return;
   const end=span.textContent, value=parseInt(end,10),suffix=end.replace(/^\d+/,'');
   const start=performance.now();
   const tick=time=>{const progress=Math.min(1,(time-start)/1400);span.firstChild.nodeValue=String(Math.round(value*(1-Math.pow(1-progress,3))));if(progress<1)requestAnimationFrame(tick);};
   requestAnimationFrame(tick);
  }),{rootMargin:'0px 0px -12% 0px'});
  stats.forEach(el=>countObserver.observe(el));
  const steps=document.querySelector('#process ol');
  if(steps){
   const bars=steps.querySelectorAll('.origin-left'),dots=steps.querySelectorAll('li > span:nth-child(3)');
   bars.forEach(el=>el.classList.replace('scale-x-100','scale-x-0'));
   dots.forEach(el=>{el.classList.replace('border-azure-500','border-ink/20');el.classList.replace('bg-azure-500','bg-white');});
   const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){bars.forEach(el=>el.classList.replace('scale-x-0','scale-x-100'));dots.forEach(el=>{el.classList.replace('border-ink/20','border-azure-500');el.classList.replace('bg-white','bg-azure-500');});observer.disconnect();}},{rootMargin:'0px 0px -20% 0px'});observer.observe(steps);
  }
 }
} catch(error) { console.error('Reveals:',error); }

// The original template posts to /api/contact. Keep submissions local to this clone.
// Validation wording is original; no success is claimed without a configured backend.
try {
 document.querySelectorAll('form').forEach(form=>{
  const errorClass='mt-1 text-sm text-destructive';
  const clear=field=>{field.setAttribute('aria-invalid','false');field.removeAttribute('aria-describedby');field.classList.replace('border-destructive','border-ink/20');document.getElementById(field.id+'-error')?.remove();};
  form.querySelectorAll('input,textarea').forEach(field=>field.addEventListener('input',()=>clear(field)));
  form.addEventListener('submit',event=>{
   event.preventDefault();
   const values=Object.fromEntries(new FormData(form));
   const errors={};
   if(values.name.trim().length<2)errors.name='Please tell us your name.';
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))errors.email='Please enter a valid email address.';
   if(values.message.trim().length<10)errors.message='Please add a few words about your project.';
   form.querySelectorAll('input,textarea').forEach(clear);
   form.querySelector('[data-local-status]')?.remove();
   for(const [name,message]of Object.entries(errors)){
    const field=form.elements[name],error=document.createElement('p');error.id=field.id+'-error';error.className=errorClass;error.textContent=message;
    field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',error.id);field.classList.replace('border-ink/20','border-destructive');field.after(error);
   }
   if(Object.keys(errors).length){form.elements[Object.keys(errors)[0]].focus();return;}
   const status=document.createElement('p');status.dataset.localStatus='';status.setAttribute('role','alert');status.className='border-l-2 border-destructive pl-4 text-sm text-destructive';
   status.textContent='This preview does not send messages. Please connect a contact endpoint before publishing.';
   form.querySelector('button[type="submit"]').parentElement.before(status);
  });
 });
} catch(error) { console.error('Contact:',error); }

// Ambient silk uses the original randomized ranges and visibility schedule.
try {
 const random=(min,max)=>min+Math.random()*(max-min);
 document.querySelectorAll('section:not(#top) > div[aria-hidden="true"].pointer-events-none').forEach(host=>{
  let timer=0,visible=false,round=0,active=null,dispose=null;
  const schedule=(fn,delay)=>{clearTimeout(timer);timer=setTimeout(fn,delay);};
  const remove=()=>{dispose?.();dispose=null;active?.remove();active=null;host.replaceChildren();};
  const hide=()=>{if(active)active.style.opacity='0';schedule(()=>{remove();schedule(show,random(1200,5000));},1500);};
  const show=()=>{
   if(!visible)return;
   if(round>0&&Math.random()<.3){remove();schedule(show,random(2500,5000));return;}
   round++;
   const side=Math.random()<.5?'left':'right',top=random(14,86),offset=random(-28,-6),size=random(36,54),mirror=Math.random()<.5,tilt=random(-.35,.35),seed=Math.floor(random(1,9999)),speed=random(.7,1.15),startTime=random(0,40);
   const outer=document.createElement('div');outer.className='silk-drift absolute aspect-square -translate-y-1/2 transition-opacity duration-[1400ms] ease-out';
   outer.style.cssText=`top:${top}%;${side}:${offset}%;width:clamp(260px, ${size}vw, 720px);opacity:0`;
   const inner=document.createElement('div');inner.className='size-full';if(mirror)inner.style.transform='scaleX(-1)';
   const canvas=document.createElement('canvas');canvas.className='block size-full opacity-100';canvas.setAttribute('aria-hidden','true');
   inner.append(canvas);outer.append(inner);host.replaceChildren(outer);active=outer;
   dispose=mount(DotCanvas,canvas,{field:fields.createSilkField(seed,tilt),scale:.62,maxCells:12000,speed,startTime});
   schedule(()=>{outer.style.opacity=innerWidth>=768?'.8':'.6';schedule(hide,random(6500,11000));},180);
  };
  const observer=new IntersectionObserver(entries=>{const on=entries[0].isIntersecting;if(on&&!visible){visible=true;schedule(show,random(1500,3200));}else if(!on&&visible){visible=false;if(active)active.style.opacity='0';schedule(remove,1500);}},{rootMargin:'-10% 0px'});
  observer.observe(host);
 });
} catch(error) { console.error('Ambient silk:',error); }

})();
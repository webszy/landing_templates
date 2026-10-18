from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'targets/blackplus/source-scripts/0v4s2ig1.mukw.js').read_text()
engine=source[source.index('function u(e){if(void 0===e)'):source.index('let a2="wfEase"')]
start=source.index('a5||(nB.registerPlugin')
end=source.index('},[(0,n.useRouter)().asPath])',start)
effect=source[start:end]
interactions=r'''
// State transitions transcribed from the original site's React handlers.
try {
  const menu=document.querySelector('.menu-button');
  const nav=document.querySelector('.nav-menu');
  const setMenu=open=>{
    menu?.setAttribute('aria-expanded',String(open));
    menu?.classList.toggle('w--open',open);
    if(open) nav?.setAttribute('data-nav-menu-open','');
    else nav?.removeAttribute('data-nav-menu-open');
  };
  const toggle=()=>setMenu(menu?.getAttribute('aria-expanded')!=='true');
  menu?.addEventListener('click',toggle);
  menu?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
  const cart=document.querySelector('.cart-wrapper');
  const setCart=open=>{if(cart)cart.style.display=open?'flex':'none';};
  document.querySelector('[aria-label="Open cart"]')?.addEventListener('click',e=>{e.preventDefault();setCart(true);});
  document.querySelector('[aria-label="Close cart"]')?.addEventListener('click',e=>{e.preventDefault();setCart(false);});
  cart?.addEventListener('click',e=>{if(e.target===cart)setCart(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setCart(false);setMenu(false);}});
  document.querySelectorAll('.subscribe-form').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    form.style.display='none';
    const message=form.parentElement.querySelector('.w-form-done');
    if(message){message.style.display='block';message.setAttribute('role','status');}
  }));
} catch(error) { console.error('Black Plus controls',error); }
'''
out='/* Original GSAP 3.15.0 runtime and animation declarations captured from the public Black Plus bundle.\n   React lifecycle wrapper replaced with a single DOM-ready invocation; animation values unchanged. */\n(()=>{\n"use strict";\n'+engine+'\nlet a2="wfEase",a5=false;\nfunction initializeMotion(){'+effect+'}\ntry { initializeMotion(); } catch(error) { console.error("Black Plus motion",error); }\n})();\n'+interactions
(root/'targets/blackplus/clone/fixes.js').write_text(out)
print('Restored original motion runtime/declarations and menu, cart, form handlers:',len(out),'bytes')

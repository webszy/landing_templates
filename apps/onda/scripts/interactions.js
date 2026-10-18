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

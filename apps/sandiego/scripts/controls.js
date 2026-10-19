// State transitions and parameters from the captured San Diego common module.
try {
  const header = document.querySelector('.main-nav');
  const menuButton = header?.querySelector('.menu-button');
  const menu = header?.querySelector('.nav-menu');
  const dropdown = header?.querySelector('.nav-dropdown-parent');
  const toggle = dropdown?.querySelector('.w-dropdown-toggle');
  const panel = dropdown?.querySelector('.w-dropdown-list');
  let menuOpen = false, pagesOpen = false, timer;
  const setPages = open => {
    clearTimeout(timer); pagesOpen = open;
    toggle?.setAttribute('aria-expanded', String(open));
    panel?.classList.toggle('w--open', open);
    if (panel) nR.to(panel, { autoAlpha: +open, y: open ? 0 : -10, duration: s3(300), ease: s5('ease') });
  };
  const setMenu = open => {
    menuOpen = open;
    header?.setAttribute('data-nav-open', String(open));
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.classList.toggle('w--open', open);
    if (open && menu) nR.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: s3(300), ease: s5('ease') });
    if (!open) setPages(false);
  };
  const keyboard = callback => event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(); } };
  menuButton?.addEventListener('click', () => setMenu(!menuOpen));
  menuButton?.addEventListener('keydown', keyboard(() => setMenu(!menuOpen)));
  toggle?.addEventListener('click', () => setPages(!pagesOpen));
  toggle?.addEventListener('keydown', keyboard(() => setPages(!pagesOpen)));
  dropdown?.addEventListener('mouseenter', () => setPages(true));
  dropdown?.addEventListener('mouseleave', () => { clearTimeout(timer); timer = setTimeout(() => setPages(false), 180); });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { setPages(false); setMenu(false); } });
} catch (error) { console.error('San Diego navigation', error); }

try {
  for (const slider of document.querySelectorAll('.phone-slider-container')) {
    const slides = [...slider.querySelectorAll('.phone-slide')];
    let active = 0;
    const select = index => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, current) => nR.to(slide, { autoAlpha: +(current === active), duration: s3(500), ease: s5('ease') }));
      slider.querySelectorAll('.w-slider-dot').forEach((dot, current) => dot.classList.toggle('w-active', current === active));
    };
    slider.querySelector('.w-slider-arrow-left')?.addEventListener('click', () => select(active - 1));
    slider.querySelector('.w-slider-arrow-right')?.addEventListener('click', () => select(active + 1));
    slider.querySelectorAll('.w-slider-dot').forEach((dot, index) => dot.addEventListener('click', () => select(index)));
    select(0);
    const interval = setInterval(() => select(active + 1), 3000);
    cleanups.push(() => clearInterval(interval));
  }
} catch (error) { console.error('San Diego phone slider', error); }

try {
  for (const form of document.querySelectorAll('form:not([role="search"])')) {
    if (form.querySelector('[type="search"]')) continue;
    form.addEventListener('submit', event => {
      event.preventDefault();
      const email = form.querySelector('[type="email"]');
      const valid = (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && form.checkValidity();
      let message = form.parentElement.querySelector('[data-preview-status]');
      if (!message) { message = document.createElement('div'); message.dataset.previewStatus = ''; message.setAttribute('role', 'status'); form.after(message); }
      message.className = valid ? 'success-message w-form-done' : 'error-message w-form-fail';
      message.style.display = 'block';
      message.textContent = valid ? 'Thank you! Preview only — no message or email was sent.' : 'Oops! Please complete the required fields and enter a valid email address.';
      if (valid) form.style.display = 'none';
      else form.reportValidity();
    });
  }
} catch (error) { console.error('San Diego forms', error); }

try {
  for (const button of document.querySelectorAll('[aria-label="Play video"]')) {
    button.addEventListener('click', () => {
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('aria-label', 'Video player');
      dialog.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200';
      const container = document.createElement('div'); container.className = 'relative w-full max-w-4xl';
      const close = document.createElement('button'); close.type = 'button'; close.setAttribute('aria-label', 'Close video'); close.className = 'absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/10 text-white'; close.textContent = '×';
      const frameBox = document.createElement('div'); frameBox.className = 'relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl';
      const iframe = document.createElement('iframe'); iframe.src = 'https://www.youtube.com/embed/__VIDEO_ID__?autoplay=1&rel=0'; iframe.title = 'Video player'; iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; iframe.allowFullscreen = true; iframe.className = 'absolute inset-0 size-full border-0';
      const overflow = document.body.style.overflow;
      const dismiss = () => { dialog.remove(); document.body.style.overflow = overflow; window.removeEventListener('keydown', escape); button.focus(); };
      const escape = event => { if (event.key === 'Escape') dismiss(); };
      frameBox.append(iframe); container.append(close, frameBox); dialog.append(container); document.body.append(dialog); document.body.style.overflow = 'hidden'; close.focus();
      close.addEventListener('click', dismiss); dialog.addEventListener('click', dismiss); container.addEventListener('click', event => event.stopPropagation()); window.addEventListener('keydown', escape);
    });
  }
} catch (error) { console.error('San Diego video', error); }

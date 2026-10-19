// Parameters and selectors are transcribed from the original Manila components.
// Source: 18cb~h.9pnxik.js and 0rqtiex_7ktb4.js (see qa/provenance.json).
(() => {
  'use strict';
  const { gsap } = window.ManilaRuntime;
  const { ScrollTrigger } = window.ManilaRuntime;
  window.ManilaRuntime.registerGsap();
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const run = (name, initialize) => { try { initialize(); } catch (error) { console.error(`Manila ${name}:`, error); } };
  const activate = (element, callback) => {
    element.addEventListener('click', callback);
    element.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback(event); }
    });
  };

  run('navigation', () => {
    const navbar = $('.nav-rounded-center'), menu = $('.nav-menu'), toggle = $('[aria-label="Menu"]');
    if (!navbar || !menu || !toggle) return;
    const scroll = () => navbar.classList.toggle('nav-scrolled', window.scrollY > 30);
    window.addEventListener('scroll', scroll, { passive: true }); scroll();
    const setOpen = open => {
      toggle.classList.toggle('w--open', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.toggleAttribute('data-nav-menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    activate(toggle, () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach(link => link.addEventListener('click', () => setOpen(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 991) setOpen(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  });

  run('pages menu', () => {
    const dropdown = $('.nav-pages'), toggle = $('.w-dropdown-toggle', dropdown);
    if (!dropdown || !toggle) return;
    const panel = $('.nav-pages-panel', dropdown), card = $('.nav-pages-card', dropdown);
    const items = $$('.nav-pages-item', dropdown), highlight = $('.nav-pages-highlight', dropdown);
    let open = false, timeout;
    const setOpen = value => {
      open = value; dropdown.classList.toggle('is-open', value);
      toggle.setAttribute('aria-expanded', String(value));
      gsap.killTweensOf(card); gsap.killTweensOf(items);
      if (value) {
        gsap.set(panel, { display: 'block' });
        gsap.timeline().fromTo(card, { opacity: 0, y: -12, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .42, ease: 'expo.out' })
          .fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .4, stagger: .05, ease: 'power3.out' }, '-=0.28');
      } else gsap.to(card, { opacity: 0, y: -8, scale: .98, duration: .2, ease: 'power2.in', onComplete: () => {
        gsap.set(panel, { display: 'none' }); if (highlight) gsap.set(highlight, { opacity: 0 });
      } });
    };
    const clear = () => window.clearTimeout(timeout);
    dropdown.addEventListener('mouseenter', () => { clear(); if (!open) setOpen(true); });
    dropdown.addEventListener('mouseleave', () => { clear(); timeout = window.setTimeout(() => setOpen(false), 220); });
    activate(toggle, () => { clear(); setOpen(!open); });
    items.forEach(item => item.addEventListener('mouseenter', () => {
      if (highlight) gsap.to(highlight, { y: item.offsetTop, height: item.offsetHeight, opacity: 1, duration: .35, ease: 'power3.out' });
    }));
    $('.nav-pages-list', dropdown)?.addEventListener('mouseleave', () => { if (highlight) gsap.to(highlight, { opacity: 0, duration: .2 }); });
    $$('a', panel).forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', event => { if (open && !dropdown.contains(event.target)) setOpen(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  });

  run('billing', () => {
    const tabs = $$('#pricing [role="tab"]'), price = $('#pricing .price-holder-active .price');
    if (!price || !tabs.length) return;
    const period = price.nextElementSibling;
    tabs.forEach((tab, index) => {
      tab.tabIndex = 0;
      activate(tab, () => {
        tabs.forEach(item => { const selected = item === tab; item.classList.toggle('w--current', selected); item.setAttribute('aria-selected', String(selected)); });
        price.textContent = index === 0 ? '$100' : '$20';
        period.textContent = index === 0 ? '/year' : '/month';
      });
    });
  });

  run('testimonials', () => {
    const track = $('.testimonial-track'), previous = $('[aria-label="Previous testimonial"]'), next = $('[aria-label="Next testimonial"]');
    if (!track || !previous || !next) return;
    const slides = $$('.slide', track); let index = 0;
    const move = direction => {
      index = (index + direction + slides.length) % slides.length;
      slides.forEach((slide, position) => slide.setAttribute('aria-hidden', String(position !== index)));
      gsap.to(track, { xPercent: -(100 * index), duration: .5, ease: 'wfEase' });
    };
    gsap.set(track, { xPercent: 0, x: 0 });
    activate(previous, () => move(-1)); activate(next, () => move(1));
  });

  run('subscription', () => {
    const form = $('.subscribe-form'); if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      // Source displays this state immediately; this static clone keeps the submission local.
      const success = document.createElement('div');
      success.className = 'success-message w-form-done'; success.style.display = 'block'; success.setAttribute('role', 'status');
      const message = document.createElement('div'); message.className = 'gradient-text'; message.textContent = 'Thank you! We got you!';
      success.append(message); form.replaceWith(success);
    });
  });

  run('motion', () => {
    const selectors = '.hero-link,.hero-char,.hero-word,.js-reveal,.profile-pictures,.profile-picture-holder,.trusted-by-grid,.hero-section .gradient-center,.cone-image-holder,.cube-image,.rounded-cube-image,.cta-cone-image,.cta-circle-image,.dashboard-text-holder,.dashboard-image-holder';
    const reset = () => {
      $$(selectors).forEach(element => { for (const property of ['translate', 'rotate', 'scale', 'transform', 'opacity', 'filter']) element.style.removeProperty(property); });
      const cube = $('.cube-image'); if (cube) cube.style.transform = 'translate3d(0, -27%, 0)';
    };
    reset();
    gsap.matchMedia().add({ desktop: '(min-width: 992px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, reduced } = context.conditions;
      if (reduced) return;
      const belt = $('.trusted-grid-holder');
      if (belt) gsap.to([...belt.children], { xPercent: -100, duration: 20, ease: 'none', repeat: -1 });
      if (!desktop) return;
      if ($('.hero-section')) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.hero-link', { opacity: 0, y: 22, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.5)' })
          .fromTo('.hero-char', { opacity: 0, yPercent: 60, rotateX: -55 }, { opacity: 1, yPercent: 0, rotateX: 0, duration: .65, ease: 'back.out(1.6)', stagger: .026 }, '-=0.35')
          .fromTo('.hero-word', { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: .7, ease: 'back.out(1.6)' }, '<0.25')
          .fromTo('.hero-description', { opacity: 0, y: 18, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, '-=0.35')
          .fromTo('.subscribe-form-holder', { opacity: 0, y: 18, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .7 }, '-=0.5')
          .fromTo('.trusted-by-container', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7 }, '-=0.45');
        gsap.to('.hero-section .gradient-center', { rotation: 360, duration: 30, ease: 'none', repeat: -1 });
      }
      $$('.js-reveal').filter(element => !element.matches('.hero-description,.subscribe-form-holder,.trusted-by-container')).forEach(element => {
        const variant = element.dataset.variant, from = { opacity: 0 }, to = { opacity: 1, duration: 1, delay: .1, ease: 'wfEase', scrollTrigger: { trigger: element, start: 'top 88%', once: true } };
        if (variant === 'move') { from.y = parseFloat(element.style.getPropertyValue('--reveal-distance')) || 25; to.y = 0; }
        if (variant === 'scale') { from.scale = parseFloat(element.style.getPropertyValue('--reveal-scale')) || .5; to.scale = 1; if (element.matches('.collaboration-image')) to.duration = 1.1; }
        if (variant === 'blur') { from.filter = 'blur(6px)'; to.filter = 'blur(0px)'; }
        gsap.fromTo(element, from, to);
      });
      const profiles = $('.profile-pictures');
      if (profiles) gsap.timeline({ scrollTrigger: { trigger: profiles, start: 'top 85%', once: true } })
        .fromTo(profiles, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1, ease: 'wfEase' }, 0)
        .fromTo($$('.profile-picture-holder', profiles), { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .6, stagger: .12, ease: 'wfEase' }, 0);
      const floats = [
        ['.cube-image', 16, -15, 14, 5.5], ['.rounded-cube-image', -10, 18, -10, 6],
        ['.cta-cone-image', 10, -18, 6, 6], ['.cta-circle-image', -8, 20, -8, 5.5],
      ];
      floats.forEach(([selector, x, y, rotation, duration]) => { if ($(selector)) gsap.to(selector, { x, y, rotation, duration, ease: 'sine.inOut', yoyo: true, repeat: -1 }); });
      if ($('.cone-image-holder')) gsap.to('.cone-image-holder', { rotation: 360, duration: 14, ease: 'none', repeat: -1 });
      const dashboard = $('.dashboard-holder');
      if (dashboard) gsap.timeline({ defaults: { ease: 'power1.out' }, scrollTrigger: { trigger: dashboard, start: 'top bottom', end: 'bottom top', scrub: 1.8 } })
        .fromTo('.dashboard-text-holder:not(.bottom)', { x: 0, y: 0, xPercent: -35, yPercent: -50 }, { x: 0, y: 0, xPercent: -9, yPercent: -50, duration: .5 }, 0)
        .fromTo('.dashboard-image-holder', { scale: 0 }, { scale: 1, duration: .5 }, 0)
        .fromTo('.dashboard-text-holder.bottom', { x: 0, y: 0, xPercent: 80, yPercent: 50 }, { x: 0, y: 0, xPercent: -30, yPercent: 50, duration: 1 }, 0);
      ScrollTrigger.refresh();
    });
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
})();

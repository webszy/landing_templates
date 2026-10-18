// Restored from the original Aster page module (see ../evidence/).
(() => {
  'use strict';
  const section = document.querySelector('.aster-section');
  if (!section) return;
  const title = section.querySelector('.aster-title');
  const letters = [...title.querySelectorAll('[data-letter]')];
  const reveals = [...section.querySelectorAll('[data-reveal]')];
  const pill = section.querySelector('.aster-pill');
  const form = section.querySelector('.aster-form');
  const input = form.querySelector('.aster-input');
  const button = form.querySelector('.aster-submit');
  const video = section.querySelector('.aster-video');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setState(state) {
    pill.dataset.state = state;
    input.disabled = state !== 'idle';
    button.disabled = state !== 'idle' || !input.value;
    button.setAttribute('aria-label', {
      idle: 'Subscribe', loading: 'Subscribing', success: 'Subscribed',
    }[state]);
  }

  setState('idle');
  input.addEventListener('input', () => setState(pill.dataset.state));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (pill.dataset.state !== 'idle' || !input.value || !form.reportValidity()) return;
    // The source template also simulates this flow locally, without a backend.
    setState('loading');
    window.setTimeout(() => {
      setState('success');
      window.setTimeout(() => {
        input.value = '';
        setState('idle');
      }, 4000);
    }, 1400);
  });

  pill.addEventListener('mousemove', event => {
    const box = pill.getBoundingClientRect();
    pill.style.setProperty('--sheen-x', `${event.clientX - box.left}px`);
    pill.style.setProperty('--sheen-y', `${event.clientY - box.top}px`);
    pill.dataset.sheen = 'on';
  });
  pill.addEventListener('mouseleave', () => { pill.dataset.sheen = 'off'; });

  const showVideo = () => { video.style.opacity = '1'; };
  video.style.opacity = '0';
  video.muted = true;
  if (video.readyState >= 3) showVideo();
  else video.addEventListener('canplay', showVideo, { once: true });
  video.play().catch(() => {});

  if (reduced) return; // Captured end states remain visible.

  // Evaluate the original GSAP power1.out / power3.out ease formulas directly.
  const progress = (elapsed, delay, duration) => Math.max(0, Math.min(1, (elapsed - delay) / duration));
  letters.forEach(letter => { letter.style.transform = 'rotateX(0deg)'; });
  reveals.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translate(0px, 24px)';
    element.style.filter = 'blur(8px)';
  });
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let entering = true;
  const started = performance.now();

  section.addEventListener('mousemove', event => {
    const box = section.getBoundingClientRect();
    targetX = (event.clientX - box.left) / box.width;
    targetY = (event.clientY - box.top) / box.height;
  });
  section.addEventListener('mouseleave', () => { targetX = targetY = 0.5; });

  function frame(now) {
    if (entering) {
      const elapsed = now - started;
      letters.forEach((letter, index) => {
        const t = progress(elapsed, index * 55, 2100);
        letter.style.transform = `rotateX(${-270 * (1 - (1 - t) ** 2)}deg)`;
      });
      reveals.forEach((element, index) => {
        const t = progress(elapsed, 150 + index * 120, 1000);
        const eased = 1 - (1 - t) ** 4;
        element.style.opacity = String(eased);
        element.style.transform = `translate(0px, ${24 * (1 - eased)}px)`;
        element.style.filter = `blur(${8 * (1 - eased)}px)`;
      });
      entering = elapsed < Math.max(2100 + (letters.length - 1) * 55, 1150 + (reveals.length - 1) * 120);
    }
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    title.style.transform = `rotateX(${(currentY - 0.5) * 8}deg) rotateY(${-(currentX - 0.5) * 10}deg)`;
    window.requestAnimationFrame(frame);
  }
  window.requestAnimationFrame(frame);
})();

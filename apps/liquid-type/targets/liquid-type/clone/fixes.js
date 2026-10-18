// Typography springs, trails and ripples ported from ../evidence/original-page.js.
(() => {
  'use strict';
  const section = document.querySelector('section[aria-label="Interactive variable typography"]');
  const canvas = section?.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  const title = section?.querySelector('h1');
  if (!ctx || !title) return;
  const letters = [...title.querySelectorAll('.will-change-transform')];
  const wrappers = letters.map(letter => letter.parentElement);
  const reveals = [...section.querySelectorAll('[data-reveal]')];
  const root = document.documentElement;
  if (!root.hasAttribute('data-theme')) {
    root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  let dark = root.dataset.theme === 'dark';
  new MutationObserver(() => { dark = root.dataset.theme === 'dark'; })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const states = letters.map(() => ({ cx: 0, cy: 0, weight: 300, wVel: 0, scale: 1, sVel: 0, ready: false }));
  const pointer = { x: -9999, y: -9999, speed: 0, inside: false };
  const trails = [];
  const ripples = [];
  let breathing = 1;
  let lastTrail = 0;
  let widthsLocked = false;
  let width = section.clientWidth;
  let height = section.clientHeight;
  let entering = true;
  const started = performance.now();
  const progress = (elapsed, delay, duration) => Math.max(0, Math.min(1, (elapsed - delay) / duration));

  function sizeCanvas() {
    width = section.clientWidth;
    height = section.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function measureGlyphs() {
    const box = section.getBoundingClientRect();
    letters.forEach((letter, index) => {
      const rect = letter.getBoundingClientRect();
      states[index].cx = rect.left - box.left + rect.width / 2;
      states[index].cy = rect.top - box.top + rect.height / 2;
    });
  }

  function lockWidths() {
    wrappers.forEach(wrapper => { wrapper.style.width = ''; });
    letters.forEach(letter => { letter.style.fontVariationSettings = "'wght' 300"; });
    void title.offsetHeight;
    const widths = wrappers.map(wrapper => wrapper.getBoundingClientRect().width);
    wrappers.forEach((wrapper, index) => { wrapper.style.width = `${widths[index]}px`; });
    widthsLocked = true;
  }

  function animateEntrance(now) {
    if (!entering) return;
    const elapsed = now - started;
    const fade = progress(elapsed, 0, 2000);
    canvas.style.opacity = String(fade < 0.5 ? 4 * fade ** 3 : 1 - (-2 * fade + 2) ** 3 / 2);
    letters.forEach((letter, index) => {
      if (states[index].ready) return;
      const t = progress(elapsed, 500 + index * 45, 900);
      const eased = 1 - (1 - t) ** 5;
      letter.style.opacity = String(eased);
      letter.style.transform = `translate(0px, ${40 * (1 - eased)}px) scale(${0.85 + 0.15 * eased})`;
      letter.style.filter = `blur(${8 * (1 - eased)}px)`;
      if (t === 1) {
        letter.style.filter = '';
        states[index].ready = true;
        if (index === letters.length - 1) measureGlyphs();
      }
    });
    reveals.forEach((element, index) => {
      const t = progress(elapsed, 400 + index * 130, 1000);
      const eased = 1 - (1 - t) ** 5;
      element.style.opacity = String(eased);
      element.style.transform = `translate(0px, ${30 * (1 - eased)}px) scale(${0.94 + 0.06 * eased})`;
      element.style.filter = `blur(${6 * (1 - eased)}px)`;
    });
    entering = elapsed < Math.max(2000, 1400 + (letters.length - 1) * 45, 1400 + (reveals.length - 1) * 130);
  }

  function frame(now) {
    animateEntrance(now);
    const seconds = now / 1000;
    ctx.clearRect(0, 0, width, height);
    const trailColor = dark ? [245, 235, 210] : [100, 90, 75];
    const trailAlpha = dark ? 0.055 : 0.045;
    const glowColor = dark ? [245, 235, 210] : [80, 70, 55];
    const ringColor = dark ? [200, 190, 170] : [140, 130, 110];
    if (pointer.inside && now - lastTrail > 18) {
      lastTrail = now;
      trails.push({ x: pointer.x, y: pointer.y, size: Math.max(3, 12 - 0.04 * pointer.speed), age: 0, maxAge: 45 + 15 * Math.random() });
    }
    for (let index = trails.length - 1; index >= 0; index--) {
      const trail = trails[index];
      trail.age += 1;
      const life = 1 - trail.age / trail.maxAge;
      if (life <= 0) {
        trails.splice(index, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, trail.size * (0.5 + 0.5 * life), 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${trailColor[0]}, ${trailColor[1]}, ${trailColor[2]}, ${life * trailAlpha})`;
      ctx.fill();
    }
    for (let index = ripples.length - 1; index >= 0; index--) {
      const ring = ripples[index];
      const fraction = ring.radius / ring.max;
      const alpha = (1 - fraction) ** 2;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${0.22 * alpha})`;
      ctx.lineWidth = 2.5 * (1 - 0.5 * fraction);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, 0.92 * ring.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${0.1 * alpha})`;
      ctx.lineWidth = 8 * (1 - fraction);
      ctx.stroke();
      const remaining = 1 - ring.radius / ring.max;
      for (const state of states) {
        const distance = Math.abs(Math.hypot(state.cx - ring.x, state.cy - ring.y) - ring.radius);
        if (distance < 60) {
          const force = 1 - distance / 60;
          state.wVel += remaining * force * 45;
          state.sVel += remaining * force * 0.008;
        }
      }
      ring.radius += 5;
      if (ring.radius > ring.max) ripples.splice(index, 1);
    }
    breathing += (Number(!pointer.inside) - breathing) * 0.05;
    states.forEach((state, index) => {
      if (!state.ready) return;
      let targetWeight = 300;
      let targetScale = 1;
      if (pointer.inside) {
        const distance = Math.hypot(state.cx - pointer.x, state.cy - pointer.y);
        if (distance < 180) {
          const proximity = (1 - distance / 180) ** 2;
          targetWeight = 300 + 550 * proximity;
          targetScale = 1 + 0.12 * proximity;
        }
      }
      targetWeight += (0.5 * Math.sin(0.8 * seconds + 0.5 * index) + 0.5) * 20 * breathing;
      state.wVel += (targetWeight - state.weight) * 0.035;
      state.wVel *= 0.92;
      state.weight += state.wVel;
      state.sVel += (targetScale - state.scale) * 0.035;
      state.sVel *= 0.92;
      state.scale += state.sVel;
      const letter = letters[index];
      letter.style.fontVariationSettings = `'wght' ${Math.max(100, Math.min(900, Math.round(state.weight)))}`;
      letter.style.transform = `scale(${state.scale.toFixed(4)})`;
      const glow = Math.max(0, (state.weight - 300) / 550);
      letter.style.textShadow = glow > 0.1
        ? `0 0 ${(30 * glow).toFixed(2)}px rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${(0.15 * glow).toFixed(3)})`
        : 'none';
    });
    requestAnimationFrame(frame);
  }

  section.addEventListener('mousemove', event => {
    const box = section.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    pointer.speed = pointer.inside ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
    pointer.x = x;
    pointer.y = y;
    pointer.inside = true;
    if (!widthsLocked) {
      lockWidths();
      measureGlyphs();
    }
  });
  section.addEventListener('mouseleave', () => { pointer.inside = false; });
  section.addEventListener('click', event => {
    const box = section.getBoundingClientRect();
    ripples.push({ x: event.clientX - box.left, y: event.clientY - box.top, radius: 0, max: 0.6 * Math.max(width, height) });
  });
  window.addEventListener('resize', () => {
    sizeCanvas();
    if (widthsLocked) lockWidths();
    measureGlyphs();
  });
  sizeCanvas();
  canvas.style.opacity = '0';
  letters.forEach(letter => {
    letter.style.fontVariationSettings = "'wght' 300";
    letter.style.opacity = '0';
    letter.style.transform = 'translate(0px, 40px) scale(0.85)';
    letter.style.filter = 'blur(8px)';
    letter.style.textShadow = 'none';
  });
  reveals.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translate(0px, 30px) scale(0.94)';
    element.style.filter = 'blur(6px)';
  });
  requestAnimationFrame(measureGlyphs);
  requestAnimationFrame(frame);
})();

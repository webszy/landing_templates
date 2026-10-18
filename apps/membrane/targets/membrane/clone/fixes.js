// Canvas algorithm and entrance values ported from ../evidence/original-page.js.
(() => {
  'use strict';
  const section = document.querySelector('main section');
  const canvas = section?.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const reveals = [...section.querySelectorAll('[data-reveal]')];
  const pointer = { x: -9999, y: -9999, inside: false, pressing: false };
  let width = 0;
  let height = 0;
  let points = [];
  let time = 0;
  let entering = true;
  const started = performance.now();
  const pointAt = (col, row) => points[50 * row + col];
  const progress = (elapsed, delay, duration) => Math.max(0, Math.min(1, (elapsed - delay) / duration));

  function resize() {
    const box = section.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 50; col++) {
        const x = col / 49 * width;
        const y = row / 29 * height;
        points.push({ col, row, restX: x, restY: y, x, y, vx: 0, vy: 0, offsetZ: 0, velZ: 0 });
      }
    }
  }

  function draw(now) {
    time += 0.016;
    const centerX = width / 2;
    const centerY = height / 2;
    const diagonal = Math.hypot(centerX, centerY) || 1;
    const radius = pointer.pressing ? 200 : 130;
    const strength = pointer.pressing ? 30 : 15;
    for (const p of points) {
      const wave = 2 * Math.sin(0.6 * time + 0.15 * p.col + 0.12 * p.row);
      p.velZ += (wave - p.offsetZ) * 0.002;
      if (pointer.inside) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius && distance > 0.001) {
          const force = strength * (1 - distance / radius);
          p.velZ += 0.4 * force;
          p.vx += dx / distance * force * 0.12;
          p.vy += dy / distance * force * 0.12;
        }
      }
      p.vx += (p.restX - p.x) * 0.025;
      p.vy += (p.restY - p.y) * 0.025;
      p.velZ -= 0.025 * p.offsetZ * 1.5;
      p.vx *= 0.93;
      p.vy *= 0.93;
      p.velZ *= 0.93;
      p.x += p.vx;
      p.y += p.vy;
      p.offsetZ += p.velZ;
    }
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 50; col++) {
        const p = pointAt(col, row);
        let delta = 0;
        if (col > 0) delta += pointAt(col - 1, row).offsetZ - p.offsetZ;
        if (col < 49) delta += pointAt(col + 1, row).offsetZ - p.offsetZ;
        if (row > 0) delta += pointAt(col, row - 1).offsetZ - p.offsetZ;
        if (row < 29) delta += pointAt(col, row + 1).offsetZ - p.offsetZ;
        p.velZ += 0.18 * delta;
      }
    }
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255,255,255,0.018)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 50; col++) {
        const p = pointAt(col, row);
        const y = p.y - 0.3 * p.offsetZ;
        if (col === 0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      }
    }
    for (let col = 0; col < 50; col++) {
      for (let row = 0; row < 30; row++) {
        const p = pointAt(col, row);
        const y = p.y - 0.3 * p.offsetZ;
        if (row === 0) ctx.moveTo(p.x, y);
        else ctx.lineTo(p.x, y);
      }
    }
    ctx.stroke();
    for (const p of points) {
      const x = p.x;
      const y = p.y - 0.3 * p.offsetZ;
      const displacement = Math.abs(p.offsetZ) + Math.hypot(p.x - p.restX, p.y - p.restY);
      const center = Math.pow(1 - Math.min(1, Math.hypot(p.restX - centerX, p.restY - centerY) / diagonal * 1.4), 1.5);
      let red = 130 + 115 * center;
      let green = 130 + 105 * center;
      let blue = 140 + 70 * center;
      if (displacement > 3) {
        const mix = Math.min(1, (displacement - 3) * 0.1);
        red += (255 - red) * mix;
        green += (252 - green) * mix;
        blue += (245 - blue) * mix;
      }
      const size = 1 + center + (displacement > 0.5 ? 0.05 * displacement : 0);
      let alpha = Math.max(0.06 + 0.18 * center, displacement > 0.5 ? Math.min(0.9, 0.05 * displacement) : 0);
      if (pointer.inside) {
        const ellipse = ((p.restX - centerX) / (0.35 * width)) ** 2 + ((p.restY - centerY) / (0.35 * height)) ** 2;
        if (ellipse < 1) alpha *= 1 - (1 - ellipse) * 0.7;
      }
      red |= 0;
      green |= 0;
      blue |= 0;
      if (displacement > 1.5 || center > 0.4) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${red},${green},${blue},${0.18 * alpha})`;
        ctx.arc(x, y, size + 6, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (entering) {
      const elapsed = now - started;
      const fade = progress(elapsed, 0, 2000);
      // GSAP power2.inOut (cubic) and power4.out (quintic).
      canvas.style.opacity = String(fade < 0.5 ? 4 * fade ** 3 : 1 - (-2 * fade + 2) ** 3 / 2);
      reveals.forEach((element, index) => {
        const t = progress(elapsed, 500 + index * 130, 1000);
        const eased = 1 - (1 - t) ** 5;
        element.style.opacity = String(eased);
        element.style.transform = `translate(0px, ${30 * (1 - eased)}px) scale(${0.94 + 0.06 * eased})`;
        element.style.filter = `blur(${6 * (1 - eased)}px)`;
      });
      entering = elapsed < Math.max(2000, 1500 + (reveals.length - 1) * 130);
    }
    requestAnimationFrame(draw);
  }

  section.addEventListener('mousemove', event => {
    const box = section.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.inside = true;
  });
  section.addEventListener('mouseleave', () => {
    pointer.x = pointer.y = -9999;
    pointer.inside = pointer.pressing = false;
  });
  section.addEventListener('mousedown', () => { pointer.pressing = true; });
  section.addEventListener('mouseup', () => { pointer.pressing = false; });
  window.addEventListener('resize', resize);
  resize();
  canvas.style.opacity = '0';
  reveals.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translate(0px, 30px) scale(0.94)';
    element.style.filter = 'blur(6px)';
  });
  requestAnimationFrame(draw);
})();

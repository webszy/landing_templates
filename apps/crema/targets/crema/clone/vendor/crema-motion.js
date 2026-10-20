// Restores Crema's captured page script: GSAP intro, drag/auto-rotate, and the
// three.js r180 phone. Numbers are the page's own constants (yN, yU, yO, yk, yz).
import * as THREE from "three";
import { GLTFLoader } from "/vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "/vendor/three/examples/jsm/environments/RoomEnvironment.js";

const ASSET = "https://pub-dc2abe5caae44240a6d1913566a75e0f.r2.dev/sections/crema";
const YU = 760 / 16.06;
const CFG = {
  screenWFactor: 0.93,
  screenHFactor: 0.97,
  screenRadiusFactor: 0.13,
  restOffsetDeg: -14,
  dragDegPerPx: 0.7,
  restS: 4.5,
  transitionS: 1.4,
  autoRotate: true,
  phoneZOffset: 0
};
const SCENES = [
  {
    id: "cookie-shake",
    props: [
      { id: "s0-cupcake", x: 230, y: -240, z: 90, size: 138, rot: 8, icon: "cupcake", layer: 3 },
      { id: "s0-muffin", x: -230, y: 250, z: 70, size: 132, rot: -8, icon: "chocolate-muffin", layer: 3 },
      { id: "s0-chocolate", x: -230, y: -200, z: 60, size: 90, rot: 14, icon: "chocolate-bar", layer: 2 },
      { id: "s0-sugar", x: 260, y: 80, z: -60, size: 100, rot: -16, icon: "sugar-cube", layer: 1 }
    ],
    peek: { x: -60, y: 290, z: 130, width: 232, rot: -3, name: "Diego R.", city: "Austin · 3y member", photo: "1680022150842-00dca46d25e7", tier: "GOLD", points: "2,140 pts", quote: "Best shake I've had, cookie crumb topping is unreal, and it was ready before I parked." }
  },
  {
    id: "caffe-latte",
    props: [
      { id: "s1-coffee-cup", x: -230, y: -240, z: 90, size: 180, rot: -10, icon: "barista-coffee", layer: 3 },
      { id: "s1-croissant", x: 230, y: -200, z: 60, size: 124, rot: 18, icon: "croissant", layer: 3 },
      { id: "s1-turkish", x: 230, y: 250, z: 50, size: 168, rot: 6, icon: "turkish-coffee", layer: 2 },
      { id: "s1-iced", x: -260, y: 100, z: -50, size: 122, rot: 22, icon: "iced-coffee", layer: 1 }
    ],
    peek: { x: 60, y: 290, z: 130, width: 232, rot: 4, name: "Maya K.", city: "Brooklyn · 4y member", photo: "1594318223885-20dc4b889f9e", tier: "GOLD", points: "1,240 pts", quote: "Mobile order skipped a 14-person line. Latte was hot, foam was perfect." }
  },
  {
    id: "glazed-donut",
    props: [
      { id: "s2-donut1", x: 230, y: -230, z: 80, size: 128, rot: 18, icon: "donut-1", layer: 3 },
      { id: "s2-donut2", x: -230, y: 250, z: 70, size: 142, rot: -22, icon: "donut-2", layer: 3 },
      { id: "s2-donut3", x: -250, y: -120, z: -50, size: 100, rot: 32, icon: "donut-1", layer: 1 },
      { id: "s2-donut4", x: 260, y: 150, z: -40, size: 96, rot: -8, icon: "donut-2", layer: 1 }
    ],
    peek: { x: -50, y: 290, z: 140, width: 240, rot: -2, name: "Sara L.", city: "Lisbon · 2y member", photo: "1595085610896-fb31cfd5d4b7", tier: "PLATINUM", points: "3,605 pts", quote: "Donut was fresh out of the fryer. Glaze still warm. Best 3 bucks I've spent today." }
  }
];
const PRODUCTS = {
  1: {
    title: "Caffè Latte",
    subtitle: "Double Shot · Whole Milk",
    price: "$4.85",
    calories: "180 cal",
    prep: "4 min",
    heroId: "1553578615-ee00f2db2c5c",
    ingredients: [
      { label: "Espresso", photoId: "1495474472287-4d71bcdd2085" },
      { label: "Steamed Milk", photoId: "1550583724-b2692b85b150" },
      { label: "Foam Top", photoId: "1497515114629-f71d768fd07c" }
    ],
    selected: 0
  },
  2: {
    title: "Glazed Donut",
    subtitle: "Fresh-Baked · Brown Butter",
    price: "$3.20",
    calories: "260 cal",
    prep: "2 min",
    heroId: "1624277904878-120554c46c2d",
    ingredients: [
      { label: "Wheat Flour", photoId: "1568827999250-3f6afff96e66" },
      { label: "Sugar Glaze", photoId: "1497515114629-f71d768fd07c" },
      { label: "Buttermilk", photoId: "1550583724-b2692b85b150" }
    ],
    selected: 2
  }
};

const power3 = (t) => 1 - (1 - t) ** 3;
const power4 = (t) => 1 - (1 - t) ** 4;
const photo = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const icon = (name) => `${ASSET}/${name}.png`;

function orderedProps(scene) {
  const back = scene.props.filter((item) => item.z < 0).sort((a, b) => a.layer - b.layer);
  const front = scene.props.filter((item) => item.z >= 0).sort((a, b) => a.layer - b.layer);
  return back.concat(front);
}

function svg(size, color, stroke, body) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function productHtml(data, statusHtml) {
  const stat = (glyph, value) => `<div style="display:flex;align-items:center;gap:4px">${glyph}<span style="font-size:10.5px;font-weight:700;color:#0E1F1A">${value}</span></div>`;
  const dot = `<span aria-hidden="true" style="width:3px;height:3px;border-radius:50%;background:#56655F;opacity:.5"></span>`;
  const ingredients = data.ingredients.map((item, index) => {
    const on = index === data.selected;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1"><div style="width:38px;height:38px;border-radius:50%;padding:2px;background:${on ? "linear-gradient(135deg,#C9A961 0%,#B0894A 100%)" : "#fff"};box-shadow:${on ? "0 4px 10px rgba(176,137,74,0.34)" : "0 0 0 1px rgba(14,31,26,0.07)"}"><div style="width:100%;height:100%;border-radius:50%;background-image:url(${photo(item.photoId, 120)});background-position:center;background-size:cover;box-shadow:inset 0 0 0 1.5px #fff"></div></div><span style="font-size:9px;font-weight:600;color:${on ? "#0E1F1A" : "#56655F"};text-align:center">${item.label}</span></div>`;
  }).join("");
  return `${statusHtml}<div style="display:flex;justify-content:space-between;padding:10px 16px 0"><div style="width:30px;height:30px;border-radius:50%;background:#006241;display:grid;place-items:center;box-shadow:0 4px 10px -3px rgba(0,98,65,0.5)">${svg(13, "#fff", "2.4", `<path d="M15 5l-7 7 7 7"/>`)}</div><div style="width:30px;height:30px;border-radius:9px;background:#fff;display:grid;place-items:center;box-shadow:0 3px 8px -3px rgba(14,31,26,0.18), 0 0 0 1px rgba(14,31,26,0.04)">${svg(14, "#0E1F1A", "2", `<path d="M5 8h14l-1.4 11.4a2 2 0 0 1-2 1.6h-7.2a2 2 0 0 1-2-1.6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>`)}</div></div><div style="padding:12px 16px 0"><div style="font-size:22px;font-weight:800;color:#0E1F1A;letter-spacing:-0.02em;line-height:1.05">${data.title}</div><div style="font-size:11px;color:#56655F;margin-top:4px;font-weight:500">${data.subtitle}</div></div><div style="display:flex;align-items:center;gap:10px;padding:10px 16px 0">${stat(svg(11, "#006241", "2", `<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.4" fill="#006241" stroke="none"/>`), data.price)}${dot}${stat(svg(11, "#006241", "2", `<path d="M12 2.5c1.5 3 4.5 4.6 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.2.4-2 1-2.8.1 1.4.9 2.3 1.8 2.3.8 0 1.2-.6 1.2-1.7 0-2.2-1.5-3.3.5-6.3z"/>`), data.calories)}${dot}${stat(svg(11, "#006241", "2", `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`), data.prep)}</div><div style="flex:1;position:relative;margin:12px 12px 0;min-height:0"><div aria-hidden="true" style="position:absolute;inset:0;opacity:.55;background-image:radial-gradient(rgba(55,102,90,0.16) 1px, transparent 1.4px);background-size:10px 10px"></div><div style="position:absolute;inset:0;background-image:url(${photo(data.heroId, 600)});background-position:center;background-size:contain;background-repeat:no-repeat;mask-image:radial-gradient(ellipse 78% 66% at 50% 50%, #000 56%, transparent 100%);-webkit-mask-image:radial-gradient(ellipse 78% 66% at 50% 50%, #000 56%, transparent 100%);filter:drop-shadow(0 12px 18px rgba(58,31,18,0.18))"></div></div><div style="font-size:10px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;color:#0E1F1A;padding:10px 16px 0">Ingredients</div><div style="display:flex;justify-content:space-between;gap:6px;padding:8px 16px 0">${ingredients}</div><div style="padding:12px 16px 14px"><div style="display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:11px 14px;border-radius:14px;background:#006241;color:#fff;box-shadow:0 6px 14px -4px rgba(0,98,65,0.45)">${svg(14, "#fff", "2", `<path d="M5 8h14l-1.4 11.4a2 2 0 0 1-2 1.6h-7.2a2 2 0 0 1-2-1.6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>`)}<span style="text-align:center;font-size:12px;font-weight:800;letter-spacing:0.01em">Order Now</span>${svg(13, "#fff", "2.4", `<path d="M9 5l7 7-7 7"/>`)}</div></div>`;
}

function tween(delay, duration, ease, onUpdate, onStart) {
  const startAt = performance.now() + delay * 1000;
  const span = Math.max(duration, 0.001) * 1000;
  let started = false;
  function frame(now) {
    if (now < startAt) {
      requestAnimationFrame(frame);
      return;
    }
    if (!started) {
      started = true;
      if (onStart) onStart();
    }
    const t = Math.min(1, (now - startAt) / span);
    onUpdate(ease(t), t);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function preload(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = url;
  });
}

const stage = document.querySelector(".crema-stage");
const perspective = document.querySelector(".crema-perspective");
const letters = document.querySelector("[data-crema-root] h1");
const copy = document.querySelector(".crema-content p");
const buttons = document.querySelector(".crema-store-buttons");
const proof = buttons && buttons.nextElementSibling;
if (!stage || !perspective || !letters || !copy || !buttons || !proof) {
  throw new Error("Crema stage markup is missing");
}

const propsGroup = perspective.children[0];
const overlayGroup = perspective.children[1];
const propEls = [...propsGroup.children].filter((el) => el.getAttribute("aria-hidden") === "true");
const peek = [...propsGroup.children].find((el) => el.textContent.includes("Verified order"));
const social = [...propsGroup.children].find((el) => el !== peek && !el.hasAttribute("aria-hidden"));
const mask = overlayGroup.children[0];
const scaler = mask.children[0];
const app = scaler.children[0];
const canvas = stage.querySelector("canvas");
const screen0 = app.innerHTML;
const statusHtml = app.children[0] ? app.children[0].outerHTML : "";
const screenHtml = { 0: screen0, 1: productHtml(PRODUCTS[1], statusHtml), 2: productHtml(PRODUCTS[2], statusHtml) };

let stageHeight = stage.clientHeight || 580;
let entranceScale = 1;
let offsetZ = 20.9505;
let screenIndex = 0;
let phoneGroup = null;
const state = {
  angle: CFG.restOffsetDeg,
  target: CFG.restOffsetDeg,
  restClock: 0,
  midflipsCompleted: 0,
  entered: false,
  dragActive: false,
  dragStartX: 0,
  dragStartAngle: 0
};

function applyScreenDims(dims) {
  offsetZ = dims.offsetZPx;
  mask.style.left = `${-dims.widthPx / 2}px`;
  mask.style.top = `${-dims.heightPx / 2}px`;
  mask.style.width = `${dims.widthPx}px`;
  mask.style.height = `${dims.heightPx}px`;
  mask.style.borderRadius = `${dims.radiusPx}px`;
  const notchW = 0.22 * dims.widthPx;
  const notchH = 0.052 * dims.widthPx;
  const svgMask = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${dims.widthPx} ${dims.heightPx}' preserveAspectRatio='none'><rect width='100%' height='100%' fill='%23fff'/><rect x='${(dims.widthPx - notchW) / 2}' y='${0.024 * dims.widthPx}' width='${notchW}' height='${notchH}' rx='${notchH / 2}' fill='%23000'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${svgMask}")`;
  mask.style.maskImage = url;
  mask.style.webkitMaskImage = url;
  scaler.style.transform = `scale(${dims.widthPx / 232})`;
  if (social) {
    social.style.left = `${dims.widthPx / 2 + 26}px`;
    social.style.top = `${-dims.heightPx / 4}px`;
  }
}

function showScene(index) {
  screenIndex = index;
  const scene = SCENES[index];
  orderedProps(scene).forEach((prop, i) => {
    const el = propEls[i];
    if (!el) return;
    el.style.left = `${prop.x - prop.size / 2}px`;
    el.style.top = `${prop.y - prop.size / 2}px`;
    el.style.width = `${prop.size}px`;
    el.style.height = `${prop.size}px`;
    el.style.backgroundImage = `url("${icon(prop.icon)}")`;
    el.style.transform = `scale(var(--prop-scale, 1)) translateZ(${prop.z}px) rotate(${prop.rot}deg)`;
  });
  if (peek) {
    const card = scene.peek;
    peek.style.left = `${card.x - card.width / 2}px`;
    peek.style.top = `${card.y - 70}px`;
    peek.style.width = `${card.width}px`;
    peek.style.transform = `scale(var(--peek-scale, 1)) translateZ(${card.z}px) rotate(${card.rot}deg)`;
    const texts = peek.querySelectorAll("span");
    const nameEl = [...peek.querySelectorAll("div")].find((el) => el.children.length === 0 && el.textContent.includes("."));
    if (nameEl) nameEl.textContent = card.name;
    const city = [...texts].find((el) => el.textContent.includes("·") || el.textContent.includes("member"));
    if (city) city.textContent = card.city;
    const tier = [...texts].find((el) => /GOLD|PLATINUM/.test(el.textContent));
    if (tier) {
      const text = tier.lastChild && tier.lastChild.nodeType === 3 ? tier.lastChild : tier;
      text.textContent = card.tier;
    }
    const quote = [...peek.querySelectorAll("div")].find((el) => el.style.fontStyle === "italic" || el.textContent.includes("“") || el.textContent.startsWith("“"));
    if (quote) quote.textContent = `“${card.quote}”`;
    const points = [...texts].find((el) => el.textContent.includes("pts"));
    if (points) points.textContent = card.points;
    const faces = [...peek.querySelectorAll("div")].filter((el) => (el.style.backgroundImage || "").includes("url"));
    if (faces[0]) faces[0].style.backgroundImage = `url("${photo(card.photo, 160)}")`;
  }
  app.innerHTML = screenHtml[index];
}

function applyTransforms() {
  const scale = (stageHeight / 760) * entranceScale;
  const angle = state.angle;
  const facing = Math.cos(angle * Math.PI / 180);
  propsGroup.style.transform = `scale3d(${scale}, ${scale}, ${scale}) rotateY(${angle}deg)`;
  propsGroup.style.setProperty("--prop-scale", Math.max(0, facing).toFixed(3));
  propsGroup.style.setProperty("--peek-scale", Math.min(1, Math.max(0, facing / 0.309)).toFixed(3));
  const lift = CFG.phoneZOffset * YU;
  overlayGroup.style.transform = `scale3d(${scale}, ${scale}, ${scale}) translate3d(0px, 0px, ${lift}px) rotateY(${angle}deg) translate3d(0px, 0px, ${offsetZ}px)`;
  overlayGroup.style.setProperty("--overlay-vis", facing > 0 ? "1" : "0");
  perspective.style.perspective = `${stageHeight / 16.06 * 28}px`;
  if (phoneGroup) {
    phoneGroup.rotation.y = angle * Math.PI / 180;
    phoneGroup.scale.setScalar(entranceScale);
  }
}

function tick(delta) {
  if (state.entered && !state.dragActive) {
    const blend = 1 - Math.pow(0.5, delta / (CFG.transitionS / 7));
    if (Math.abs(state.angle - state.target) > 0.5) state.angle += (state.target - state.angle) * blend;
    else {
      state.angle = state.target;
      if (CFG.autoRotate) {
        state.restClock += delta;
        if (state.restClock >= CFG.restS) {
          state.target -= 360;
          state.restClock = 0;
        }
      }
    }
  }
  if (state.entered) {
    const turn = Math.floor(-state.angle / 360 + 0.5);
    const deltaTurns = turn - state.midflipsCompleted;
    if (deltaTurns !== 0) {
      state.midflipsCompleted = turn;
      let next = (screenIndex + deltaTurns) % SCENES.length;
      while (next < 0) next += SCENES.length;
      showScene(next);
    }
  }
  applyTransforms();
}

stage.addEventListener("pointerdown", (event) => {
  if (!state.entered) return;
  state.dragActive = true;
  state.dragStartX = event.clientX;
  state.dragStartAngle = state.angle;
  stage.setPointerCapture(event.pointerId);
  stage.style.cursor = "grabbing";
});
stage.addEventListener("pointermove", (event) => {
  if (!state.dragActive) return;
  state.angle = state.dragStartAngle + (event.clientX - state.dragStartX) * CFG.dragDegPerPx;
});
function endDrag(event) {
  if (!state.dragActive) return;
  state.dragActive = false;
  const direction = event.clientX - state.dragStartX < 0 ? -1 : 1;
  const turns = Math.round(-((state.dragStartAngle - CFG.restOffsetDeg) / 360));
  const offset = state.angle + 360 * turns;
  let commit = 0;
  if (direction === -1 && offset <= -90) commit = Math.floor((-offset - 90) / 360) + 1;
  else if (direction === 1 && offset >= 90) commit = -(Math.floor((offset - 90) / 360) + 1);
  state.target = CFG.restOffsetDeg - (turns + commit) * 360;
  state.restClock = 0;
  try { stage.releasePointerCapture(event.pointerId); } catch { /* already released */ }
  stage.style.cursor = "grab";
}
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

for (const link of buttons.querySelectorAll("a")) {
  const restShadow = link.style.boxShadow;
  const hover = (on) => {
    link.style.transform = on ? "translateY(-2px)" : "translateY(0px)";
    link.style.boxShadow = on
      ? "0 20px 36px -14px rgba(58,31,18,0.60), inset 0 1px 0 rgba(255,255,255,0.08)"
      : restShadow;
  };
  link.addEventListener("mouseenter", () => hover(true));
  link.addEventListener("mouseleave", () => hover(false));
  link.addEventListener("focus", () => hover(true));
  link.addEventListener("blur", () => hover(false));
}

new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.contentRect.height > 0) stageHeight = entry.contentRect.height;
  }
}).observe(stage);

function playIntro() {
  const letterEls = [...letters.querySelectorAll("[data-letter]")];
  const ends = new Map([letters, copy, buttons, proof, stage].concat(letterEls).map((el) => [el, {
    opacity: el.style.opacity,
    transform: el.style.transform,
    filter: el.style.filter,
    visibility: el.style.visibility
  }]));
  function restore(el) {
    const end = ends.get(el);
    if (!end) return;
    el.style.opacity = end.opacity;
    el.style.visibility = end.visibility;
    el.style.filter = end.filter;
    el.style.transform = end.transform;
  }
  letterEls.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.filter = "blur(22px)";
    tween(0.05 + index * 0.035, 1.05, power4, (k, t) => {
      if (t >= 1) {
        restore(el);
        return;
      }
      const y = 50 * (1 - k);
      const scale = 0.55 + 0.45 * k;
      el.style.opacity = String(k);
      el.style.visibility = k > 0.001 ? "inherit" : "hidden";
      el.style.filter = `blur(${22 * (1 - k)}px)`;
      el.style.transform = `translate(0px, ${y}px) scale(${scale})`;
    });
  });
  function rise(el, delay, duration, distance, blur) {
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.filter = `blur(${blur}px)`;
    tween(delay, duration, power3, (k, t) => {
      if (t >= 1) {
        restore(el);
        return;
      }
      el.style.opacity = String(k);
      el.style.visibility = "inherit";
      el.style.filter = `blur(${blur * (1 - k)}px)`;
      el.style.transform = `translate(0px, ${distance * (1 - k)}px)`;
    });
  }
  rise(copy, 1.05, 0.95, 16, 8);
  rise(buttons, 1.55, 0.85, 18, 8);
  rise(proof, 1.75, 0.85, 18, 8);

  stage.style.opacity = "0";
  stage.style.transform = "translateX(80%)";
  tween(1.6, 1.5, power3, (k, t) => {
    if (t >= 1) {
      restore(stage);
      return;
    }
    stage.style.transform = `translateX(${80 * (1 - k)}%)`;
  }, () => {
    stage.style.opacity = "1";
  });

  entranceScale = 1.3;
  state.angle = 452;
  tween(1.6, 1.5, power3, (k, t) => {
    if (t >= 1) {
      entranceScale = 1;
      state.entered = true;
      state.angle = CFG.restOffsetDeg;
      state.target = CFG.restOffsetDeg;
      state.midflipsCompleted = 0;
      state.restClock = -0.5;
      return;
    }
    entranceScale = 1.3 + (1 - 1.3) * k;
    state.angle = 452 + (CFG.restOffsetDeg - 452) * k;
  });
}

let introStarted = false;
function startIntro() {
  if (introStarted) return;
  introStarted = true;
  playIntro();
}

const urls = new Set([`${ASSET}/crema-bg.png`, `${ASSET}/crema-bg-mobile.png`]);
for (const scene of SCENES) {
  for (const prop of scene.props) urls.add(icon(prop.icon));
  urls.add(photo(scene.peek.photo, 160));
}
for (const product of Object.values(PRODUCTS)) {
  urls.add(photo(product.heroId, 600));
  for (const item of product.ingredients) urls.add(photo(item.photoId, 120));
}
// The live page waits for images or four seconds, then plays a 3.1s intro.
// A cold image cache would still be inside that intro when capture-run measures
// (settle is about four seconds and does not wait on rAF tweens). Cached loads
// start immediately, which is the state the live capture recorded, so preload
// in parallel and start the same timeline on the next frame.
for (const url of urls) preload(url);
requestAnimationFrame(startIntro);

canvas.style.width = "100%";
canvas.style.height = "100%";
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);
camera.position.set(0, 0, 28);
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.DirectionalLight(0xfff5e6, 1.6);
key.position.set(3, 6, 5);
scene.add(key);
const fill = new THREE.DirectionalLight(0xcfe0ff, 0.6);
fill.position.set(-4, 2, 3);
scene.add(fill);
const rim = new THREE.PointLight(0xffd8c0, 0.8);
rim.position.set(0, 2, -6);
scene.add(rim);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const shadow = document.createElement("canvas");
shadow.width = shadow.height = 128;
const paint = shadow.getContext("2d");
const gradient = paint.createRadialGradient(64, 64, 8, 64, 64, 64);
gradient.addColorStop(0, "rgba(59,28,10,0.45)");
gradient.addColorStop(1, "rgba(59,28,10,0)");
paint.fillStyle = gradient;
paint.fillRect(0, 0, 128, 128);
const shadowMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadow), transparent: true, depthWrite: false })
);
shadowMesh.rotation.x = -Math.PI / 2;
shadowMesh.position.set(0, -6.842, 0);
scene.add(shadowMesh);

function resize() {
  const width = canvas.clientWidth || stage.clientWidth || 580;
  const height = canvas.clientHeight || stage.clientHeight || 580;
  if (width < 2 || height < 2) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
resize();
new ResizeObserver(resize).observe(stage);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.05);
  tick(delta);
  renderer.render(scene, camera);
});

new GLTFLoader().load("/models/iphone-17-pro-compressed.glb", (gltf) => {
  const model = gltf.scene;
  model.traverse((node) => {
    if (node.isMesh && node.material) {
      node.material = Array.isArray(node.material) ? node.material.map((item) => item.clone()) : node.material.clone();
    }
  });
  model.traverse((node) => {
    if (!node.isMesh) return;
    for (const material of [].concat(node.material)) {
      if (!material || material.isMeshStandardMaterial !== true) continue;
      const name = (material.name || "").toLowerCase();
      if (name.includes("screen_bg") || name.includes("screen bg")) material.color.set("#020208");
      else if (!(name.includes("glass") || name.includes("flash") || name.includes("logo") || name.includes("camera_pixel") || name.includes("screen"))) {
        material.color.set("#48484A");
        material.metalness = 0.82;
        material.roughness = 0.38;
        material.envMapIntensity = 1.15;
      }
    }
  });
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const fit = 12.684 / (Math.max(size.x, size.y, size.z) || 1);
  const inner = new THREE.Group();
  inner.position.set(-center.x * fit, -center.y * fit, -center.z * fit);
  inner.scale.setScalar(fit);
  inner.add(model);
  phoneGroup = new THREE.Group();
  phoneGroup.add(inner);
  scene.add(phoneGroup);

  const body = [size.x * fit, size.y * fit, size.z * fit].sort((a, b) => a - b);
  // CSS overlay uses the sorted body size (thickness, width, height), not the screen mesh.
  const dims = {
    widthPx: body[1] * CFG.screenWFactor * YU,
    heightPx: body[2] * CFG.screenHFactor * YU,
    radiusPx: body[1] * CFG.screenWFactor * CFG.screenRadiusFactor * YU,
    offsetZPx: body[0] / 2 * YU
  };
  applyScreenDims(dims);
  applyTransforms();
  window.__crema = { loaded: true, body, fit, dims };
}, undefined, (error) => {
  window.__crema = { loaded: false, error: String(error && error.message || error) };
  console.error(error);
});

/* Authored Revolver GSAP/carousel source, attached to the captured DOM.
 * The adapter binds refs and native events; it does not render a React application.
 * Motion equations, timings, drag inertia, wheel thresholds and autoplay are original.
 */
(() => {
  'use strict';
  const factories = new Map();
  const previousBundle = globalThis.TURBOPACK;
  globalThis.TURBOPACK = { push(entries) {
    let ids = [];
    for (const entry of entries.slice(1)) {
      if (typeof entry === 'number') ids.push(entry);
      else if (typeof entry === 'function') {
        for (const id of ids) factories.set(id, entry);
        ids = [];
      }
    }
  } };
  /* CAPTURED_BUNDLE */
  if (previousBundle === undefined) delete globalThis.TURBOPACK;
  else globalThis.TURBOPACK = previousBundle;

  const ready = callback => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', callback, { once: true }) : callback();
  ready(() => {
    try {
      const section = document.querySelector('[data-rev-scope]');
      if (!section) return;
      const refs = [], states = [], effects = [], dispose = [];
      let refIndex = 0, stateIndex = 0, initial = true, component;
      const unitless = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order', 'scale']);
      const styleKeys = new WeakMap();
      const elements = value => (Array.isArray(value) ? value.flatMap(elements) : value && typeof value === 'object' && value.tag ? [value] : []);
      const jsx = (tag, props = {}) => typeof tag === 'function' ? tag(props) : { tag, props };
      const paintStyles = (element, style = {}) => {
        for (const key of styleKeys.get(element) || []) if (!(key in style)) element.style[key] = '';
        for (const [key, value] of Object.entries(style)) {
          const css = value == null ? '' : typeof value === 'number' && value !== 0 && !unitless.has(key) && !key.startsWith('--') ? `${value}px` : String(value);
          if (key.startsWith('--')) element.style.setProperty(key, css);
          else element.style[key] = css;
        }
        styleKeys.set(element, new Set(Object.keys(style)));
      };
      const findVNode = (node, predicate) => {
        if (predicate(node)) return node;
        for (const child of elements(node.props?.children)) {
          const found = findVNode(child, predicate);
          if (found) return found;
        }
      };

      function updateCaption(index) {
        const cards = states[0];
        const caption = [...section.querySelectorAll('[data-rev-reveal-late]')].find(element => /\d{2} — 06/.test(element.textContent));
        if (caption) {
          const leaves = [...caption.querySelectorAll('div')].filter(element => element.children.length === 0);
          const count = leaves.find(element => /^\d{2} — 06$/.test(element.textContent.trim()));
          const name = leaves.find(element => cards.some(card => card.name === element.textContent.trim()));
          const description = leaves.find(element => cards.some(card => card.caption === element.textContent.trim()));
          if (count) count.textContent = `${String(index + 1).padStart(2, '0')} — 06`;
          if (name) name.textContent = cards[index].name;
          if (description) description.textContent = cards[index].caption;
          if (name?.parentElement) name.parentElement.animate(
            [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)' },
          );
        }
        [...section.querySelectorAll('button[aria-label^="Show the "]')].forEach((button, current) => {
          button.style.height = current === index ? '22px' : '6px';
          button.style.background = `color-mix(in oklab, var(--rev-ink) ${current === index ? 85 : 28}%, transparent)`;
        });
      }

      const hooks = {
        useRef(value) {
          const index = refIndex++;
          return refs[index] ||= { current: value };
        },
        useState(value) {
          const index = stateIndex++;
          if (!(index in states)) states[index] = index === 2 ? innerWidth < 768 : value;
          return [states[index], next => {
            states[index] = typeof next === 'function' ? next(states[index]) : next;
            if (index === 1) updateCaption(states[index]);
            if (index === 2 && !initial) responsive();
            if (index === 3) {
              section.style.cursor = states[index] ? 'grabbing' : 'default';
              if (refs[1]?.current) refs[1].current.style.cursor = states[index] ? 'grabbing' : 'grab';
            }
            if (index === 5) {
              const hint = [...section.querySelectorAll('div')].find(element => element.children.length === 0 && element.textContent === 'Scroll · Drag · Tap a card');
              if (hint) { hint.style.opacity = states[index] ? '0' : '1'; hint.style.pointerEvents = states[index] ? 'none' : 'auto'; }
            }
          }];
        },
        useEffect(effect) { if (initial) effects.push(effect); },
      };
      const exported = {};
      factories.get(1512)({
        i: id => { if (id === 1398) return { jsx, jsxs: jsx }; if (id === 1788) return hooks; throw new Error(`Unexpected import ${id}`); },
        s(entries) { for (let index = 0; index < entries.length; index += 3) exported[entries[index]] = entries[index + 2]; },
      });
      component = exported.default;
      const tree = component();

      function bind(node, element) {
        if (node.tag.toLowerCase() !== element.tagName.toLowerCase()) throw new Error(`Captured DOM differs at ${node.tag}/${element.tagName}`);
        const { ref } = node.props;
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
        for (const [key, handler] of Object.entries(node.props)) {
          if (!/^on[A-Z]/.test(key) || typeof handler !== 'function' || key === 'onSubmit') continue;
          const event = key === 'onChange' ? 'input' : key.slice(2).toLowerCase();
          element.addEventListener(event, handler, { passive: false });
          dispose.push(() => element.removeEventListener(event, handler));
        }
        const children = elements(node.props.children);
        if (children.length !== element.children.length) throw new Error(`Captured child count differs at ${node.tag}: ${children.length}/${element.children.length}`);
        children.forEach((child, index) => bind(child, element.children[index]));
      }
      bind(tree, section);

      function responsive() {
        refIndex = 0; stateIndex = 0;
        const view = initial ? tree : component();
        const children = elements(view.props.children);
        const left = children.find(node => node.props.className === 'absolute z-30 flex flex-col');
        const leftElement = section.querySelector('h1').parentElement;
        paintStyles(leftElement, left.props.style);
        const heading = findVNode(left, node => node.tag === 'h1');
        paintStyles(section.querySelector('h1'), heading.props.style);
        const paragraph = leftElement.querySelector('p');
        if (paragraph) paragraph.style.display = states[2] ? 'none' : '';
        const form = findVNode(left, node => node.tag === 'form');
        const formElement = section.querySelector('form');
        const wrapper = elements(left.props.children).find(node => findVNode(node, child => child.tag === 'form'));
        paintStyles(formElement.parentElement, wrapper.props.style);
        paintStyles(formElement, form.props.style);
        paintStyles(formElement.querySelector('input'), findVNode(form, node => node.tag === 'input').props.style);
        paintStyles(formElement.querySelector('button'), findVNode(form, node => node.tag === 'button').props.style);
        const stage = children.find(node => node.props.ref === refs[1]);
        paintStyles(refs[1].current, stage.props.style);
        const dots = elements(stage.props.children).find(node => findVNode(node, child => child.tag === 'button'));
        paintStyles(section.querySelector('button[aria-label^="Show the "]').parentElement.parentElement, dots.props.style);
        const captionElement = [...section.querySelectorAll('[data-rev-reveal-late]')].find(element => /\d{2} — 06/.test(element.textContent));
        const caption = states[2] ? children.find(node => node.props['data-rev-reveal-late']) : elements(left.props.children).find(node => node.props['data-rev-reveal-late']);
        paintStyles(captionElement, caption.props.style);
        if (states[2]) section.insertBefore(captionElement, refs[1].current);
        else leftElement.append(captionElement);
      }
      responsive();
      initial = false;
      for (const effect of effects) { const cleanup = effect(); if (typeof cleanup === 'function') dispose.push(cleanup); }

      const form = section.querySelector('form');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const email = form.querySelector('input');
        let status = form.parentElement.querySelector('[role="status"]');
        if (!status) { status = document.createElement('div'); status.setAttribute('role', 'status'); status.style.cssText = 'margin-top:10px;font-size:13px;font-family:var(--font-geist-sans),sans-serif'; form.after(status); }
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        status.style.color = valid ? 'color-mix(in oklab,var(--rev-ink) 60%,transparent)' : '#d4313b';
        status.textContent = valid ? 'Preview only — no email was sent.' : 'Please enter a valid email address.';
        if (!valid) email.focus();
      });
      window.addEventListener('pagehide', () => dispose.forEach(cleanup => cleanup()), { once: true });
      window.__revolverReady = true;
    } catch (error) { console.error('Revolver interaction restoration:', error); }
  });
})();

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'targets/onda/source/modules', name + '.js'), 'utf8');
const parts = [`/* Canvas algorithms captured from the public Onda source on 2026-10-18.
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
`];
for (const [id, name] of [[2406,'2406'],[7254,'7254-8659-7036'],[6965,'6965-4631'],[4021,'4021']]) parts.push(`register(${id}, ${source(name)});`);
const page = source('7856');
const photo = page.slice(page.indexOf('let C=') + 6, page.indexOf(',M=[{column:'));
parts.push(`const HalftonePhoto = (() => {
const t=modules[1398],s=modules[1788],N=modules[3533],k={},S=modules[4631],R=modules[7036],_=modules[2406],E=modules[8659];
return ${photo};
})();`);
const logo = source('15-5836-2650-8959-3342');
parts.push(`register(5836, e => { ${logo.slice(logo.indexOf('let o='),logo.indexOf('let i=({className'))} });`);
parts.push(`const fields=modules[7254], DotCanvas=modules[6965].DotCanvas;
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
`);
parts.push(fs.readFileSync(path.join(root,'scripts/interactions.js'),'utf8'));
parts.push('})();');
const output = path.join(root,'targets/onda/clone/fixes.js');
fs.writeFileSync(output,parts.join('\n'));
console.log('Generated', output);

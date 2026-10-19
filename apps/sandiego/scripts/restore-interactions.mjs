import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = await readFile(new URL('../targets/sandiego/source-scripts/0htt6w-_o0pj4.js', import.meta.url), 'utf8');
const coreStart = source.indexOf('function n(t){');
const coreEnd = source.indexOf('var s6=t.i(41158)');
const layoutStart = source.indexOf('({children:t})=>{', source.indexOf('"Layout",0,')) + '({children:t})=>{'.length;
const layoutEnd = source.indexOf(',(0,e.jsxs)("div",{ref:u,className:"page-root"', layoutStart);
if (coreStart < 0 || coreEnd <= coreStart || layoutStart < 20 || layoutEnd <= layoutStart) throw new Error('Authored module boundaries changed; inspect the source before regenerating.');
const core = source.slice(coreStart, coreEnd);
const layout = source.slice(layoutStart, layoutEnd).replace('let u=(0,r.useRef)(null)', 'let u={current:scope}');
if (layout.includes('useRef')) throw new Error('Layout scope adapter did not match.');
const pageSource = await readFile(new URL('../targets/sandiego/source-scripts/13s3unjm37shs.js', import.meta.url), 'utf8');
const videoId = pageSource.match(/videoId:"([^"]+)"/)?.[1];
if (!videoId) throw new Error('The source video ID was not found.');
const controls = (await readFile(new URL('./controls.js', import.meta.url), 'utf8')).replace('__VIDEO_ID__', videoId);
const output = `/* Original San Diego GSAP 3.15, ScrollTrigger, CustomEase and layout declarations.\n * React lifecycle replaced by one initialization against captured markup.\n */\n(()=>{'use strict'; const t={s(){}};const r={useLayoutEffect(){},useEffect(){}};\n${core}\nconst scope=document.querySelector('.page-root')||document.body;const cleanups=[];\ns2();nB=(callback,config)=>{let cleanup;const context=nR.context(()=>{cleanup=callback()},config?.scope?.current||scope);cleanups.push(()=>context.revert());if(typeof cleanup==='function')cleanups.push(cleanup);};\ntry{(function(){${layout},void 0;})();}catch(error){console.error('San Diego motion',error);}\n${controls}\nwindow.addEventListener('pagehide',()=>cleanups.forEach(cleanup=>cleanup()),{once:true});window.__sandiegoReady=true;\n})();\n`;
await writeFile(new URL('../targets/sandiego/clone/fixes.js', import.meta.url), output);
await writeFile(new URL('../targets/sandiego/interaction-source.json', import.meta.url), JSON.stringify({
  source: 'source-scripts/0htt6w-_o0pj4.js', sha256: createHash('sha256').update(source).digest('hex'),
  method: 'Original GSAP/ScrollTrigger/CustomEase and all seven Layout motion callbacks, with native navigation and form bindings.',
}, null, 2) + '\n');
console.log(`Restored San Diego authored motion and native controls (${output.length} bytes).`);

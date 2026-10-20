import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,join} from 'node:path';
const root='targets/aurora/clone';
const dom=await readFile('targets/aurora/dom.html','utf8');
const tags=[...dom.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(x=>x[0]);
const scripts=[];
for(const tag of tags){
 const src=tag.match(/\bsrc="([^"]+)"/i)?.[1];
 if(src?.includes('/_next/')){
  const url=new URL(src,'https://aurora-template.modulify.website/');
  const path=join(root,url.pathname);
  await mkdir(dirname(path),{recursive:true});
  const r=await fetch(url);if(!r.ok)throw Error(`${r.status} ${url}`);
  await writeFile(path,Buffer.from(await r.arrayBuffer()));
  scripts.push(tag.replace(src,url.pathname));console.log(url.pathname);
 }else if(tag.includes('id="__NEXT_DATA__"'))scripts.push(tag);
}
let html=await readFile(`${root}/index.html`,'utf8');
html=html.replace(/<!-- original-runtime -->[\s\S]*?<!-- \/original-runtime -->/,'');
const ssr=await readFile('source/original.html','utf8');
const initial=ssr.match(/<body[^>]*>([\s\S]*?)<script/)[1];
html=html.replace(/(<body[^>]*>)[\s\S]*?(?=<style[^>]*>\[data-modulify-badge\])/, '$1'+initial);
const data=scripts.filter(t=>t.includes('__NEXT_DATA__')).join('');
const paths=scripts.map(t=>t.match(/src="([^"]+)"/)?.[1]).filter(Boolean);
const loader='// Replay the original locally hosted runtime in dependency order.\n(async()=>{for(const src of '+JSON.stringify(paths)+'){await new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=src;script.async=false;script.onload=resolve;script.onerror=()=>reject(new Error("Failed to load "+src));document.body.appendChild(script);});}})().catch(console.error);\n';
await writeFile(`${root}/fixes.js`,loader);
html=html.replace('</body>',`<!-- original-runtime -->${data}<script src="/fixes.js"></script><!-- /original-runtime --></body>`);
await writeFile(`${root}/index.html`,html);
// Hosted drafts reject '~' in path segments; rewrite paths and references together.
const {readdir,rename}=await import('node:fs/promises');
const files=await readdir(root,{recursive:true});
const renamed=files.filter(f=>f.includes('~'));
for(const file of files){if(!/\.(?:js|html|json)$/.test(file))continue;let text=await readFile(join(root,file),'utf8');for(const old of renamed){const name=old.split('/').pop();text=text.split(name).join(name.replaceAll('~','-'));}await writeFile(join(root,file),text);}
for(const old of renamed)await rename(join(root,old),join(root,old.replaceAll('~','-')));

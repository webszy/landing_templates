import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = await readFile(new URL('../targets/revolver/source-scripts/09-3dcrt239~r.js', import.meta.url), 'utf8');
const adapter = await readFile(new URL('./interaction-adapter.js', import.meta.url), 'utf8');
const marker = '/* CAPTURED_BUNDLE */';
if (adapter.split(marker).length !== 2) throw new Error('Expected exactly one source insertion point.');
const output = adapter.replace(marker, source);
await writeFile(new URL('../targets/revolver/clone/fixes.js', import.meta.url), output);
await writeFile(new URL('../targets/revolver/interaction-source.json', import.meta.url), JSON.stringify({
  source: 'source-scripts/09-3dcrt239~r.js',
  sha256: createHash('sha256').update(source).digest('hex'),
  method: 'Original GSAP and carousel source, bound to the captured DOM without React or Next.js.',
  form: 'Local validation only; no subscription request is sent.',
}, null, 2) + '\n');
console.log(`Restored authored Revolver carousel and interaction source (${output.length} bytes).`);

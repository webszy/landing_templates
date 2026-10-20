const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../targets/crema/clone');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

assert.match(html, /<script src="fixes\.js" defer><\/script>/);
assert.doesNotMatch(html, /analytics\.modulify\.ai/);
assert.doesNotMatch(html, /<script\b[^>]*src="(?!fixes\.js")/i);

for (const name of fs.readdirSync(path.join(root, 'assets/fonts'))) {
  const bytes = fs.readFileSync(path.join(root, 'assets/fonts', name));
  assert.equal(bytes.subarray(0, 4).toString(), 'wOF2', `Invalid font: ${name}`);
}

const glb = fs.readFileSync(path.join(root, 'models/iphone-17-pro-compressed.glb'));
assert.equal(glb.subarray(0, 4).toString(), 'glTF', 'Phone model is not a glTF binary');
assert(fs.statSync(path.join(root, 'vendor/three/build/three.module.js')).size > 1000);
assert(fs.statSync(path.join(root, 'vendor/three/build/three.core.js')).size > 1000);
assert(fs.statSync(path.join(root, 'vendor/crema-motion.js')).size > 1000);

console.log('Crema clone OK: fonts, phone model, three r180, and fixes.js.');

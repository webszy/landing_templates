const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'targets/forge/clone');
const dist = path.join(root, 'dist');

if (!fs.existsSync(path.join(source, 'index.html'))) {
  console.error('targets/forge/clone/index.html is missing — build the clone first: pingfusi capture-build forge --fixes');
  process.exit(1);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(source, dist, { recursive: true });
console.log('Static site built in dist/ — homepage, self-hosted fonts, captured icons and fixes.js.');

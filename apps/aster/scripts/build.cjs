const fs = require('node:fs');
const path = require('node:path');

require('./check.cjs');
const root = path.resolve(__dirname, '..');
fs.cpSync(path.join(root, 'targets/aster/clone'), path.join(root, 'dist'), { recursive: true });
console.log('Built apps/aster/dist/');

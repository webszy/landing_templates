const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
fs.cpSync(path.join(root,'targets/kerning/clone'),path.join(root,'dist'),{recursive:true});
console.log('Built dist/');

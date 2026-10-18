const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
fs.cpSync(path.join(root,'targets/onda/clone'),path.join(root,'dist'),{recursive:true});
console.log('Static site built in dist/ — homepage, contact page, fonts, images and animation scripts.');

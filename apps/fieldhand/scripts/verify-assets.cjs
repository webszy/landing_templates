const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../targets/fieldhand/clone');let references=0,files=0;const failures=[];
for(const file of walk(root)){files++;if(file.includes(path.sep+'shared'+path.sep)){const expected=path.basename(file).split('.')[0],actual=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(expected!==actual)failures.push('Changed asset hash: '+file);}
 if(!/\.(html|css|json|js)$/.test(file))continue;const text=fs.readFileSync(file,'utf8');for(const ref of new Set(text.match(/\/assets\/[a-zA-Z0-9_./-]+/g)||[])){references++;if(!fs.existsSync(path.join(root,ref.slice(1))))failures.push('Missing '+ref+' from '+file);}
 if(file.endsWith('.html'))for(const match of text.matchAll(/<a\b[^>]*\bhref="(\/[^"?#]*)[^"\s]*"/g)){const ref=match[1];if(ref.startsWith('//'))continue;const p=path.join(root,ref.slice(1));if(!fs.existsSync(p)&&!fs.existsSync(p+'.html'))failures.push('Missing internal route '+ref);}
}
if(failures.length){console.error([...new Set(failures)].join('\n'));process.exit(1);}console.log(`PASS — ${files} files, ${references} local asset references, content hashes and internal routes checked.`);
function*walk(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,f.name);if(f.isDirectory())yield*walk(p);else yield p;}}

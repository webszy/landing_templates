import listenPreview from '../../../scripts/listen-preview.cjs';
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../targets/blackplus/clone',import.meta.url));
const args=process.argv.slice(2);
const option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const port=option('--port',process.env.PORT);
const host=option('--host','127.0.0.1');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff':'font/woff','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path=resolve(root,'.'+pathname);
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const bytes=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(bytes);
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}
});
listenPreview(server, { name: 'Black Plus', host, port });

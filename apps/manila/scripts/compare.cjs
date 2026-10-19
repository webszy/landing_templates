const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const kit=execFileSync('pingfusi',['where'],{encoding:'utf8'}).trim(),chrome=require(kit+'/harness/chrome.js'),cdp=require(kit+'/harness/cdp.js');
const {diffSnapshots,formatDiff}=require(kit+'/tools/pixel-diff.js');
const root=path.resolve(__dirname,'..'),capture=fs.readFileSync(kit+'/tools/browser-capture.js','utf8'),mode=process.argv[2]||'mobile',filter=process.argv[3];
const vp=mode==='mobile'?{width:390,height:844,dpr:2}:{width:1728,height:982,dpr:2};
(async()=>{const acq=await chrome.acquire({headless:true,width:vp.width,height:vp.height}),{session,targetId}=await cdp.openPage(acq.port);const errors=[],results=[];await session.send('Runtime.enable');session.on('Runtime.exceptionThrown',x=>errors.push(x.exceptionDetails.exception?.description||x.exceptionDetails.text));
try{await chrome.normalizeViewport(session,vp);const probe=await chrome.probeEnvironment(session);if(!probe.verdict.ok)throw Error(probe.verdict.reason);
for(const {route,target}of JSON.parse(fs.readFileSync(root+'/routes.json')).filter(x=>!filter||x.route===filter)){
 const dir=root+'/qa/'+mode+'/'+(route==='/'?'home':route.slice(1).replaceAll('/','--'));fs.mkdirSync(dir,{recursive:true});
 const live=mode==='desktop'?JSON.parse(fs.readFileSync(root+'/targets/'+target+'/live.json')):JSON.parse(fs.readFileSync(dir+'/live.json'));fs.writeFileSync(dir+'/live.json',JSON.stringify(live));
 console.log('compare',mode,route);await cdp.navigate(session,'http://127.0.0.1:3006'+route);await cdp.evaluate(session,capture,{awaitPromise:false});const report=await cdp.evaluate(session,'pxCaptureAllPhased(null,{prefix:"clone",dom:false})',{timeoutMs:180000});if(!report.settle?.stable)throw Error('Unsettled clone '+route);
 fs.writeFileSync(dir+'/clone.json',report.payloads['clone.json']);const clone=JSON.parse(report.payloads['clone.json']);const diff=diffSnapshots(live,clone,{visual:true});fs.writeFileSync(dir+'/visual-diff.txt',formatDiff(diff));fs.writeFileSync(dir+'/visual-diff.json',JSON.stringify(diff,null,2));
 const state=await cdp.evaluate(session,`({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,missingImages:Array.from(document.images).filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),externalResources:performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)&&!r.name.startsWith('data:')).map(r=>r.name)})`);
 const shot=await session.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(dir+'/clone.png',Buffer.from(shot.data,'base64'));
 results.push({route,pass:diff.ok,state,summary:formatDiff(diff).split('\n').filter(x=>/PASS|FAIL|comparison|excluded/.test(x))});console.log(diff.ok?'PASS':'DIFF',route,JSON.stringify(state));
 const resultsFile=root+'/qa/'+mode+'-results.json',old=fs.existsSync(resultsFile)?JSON.parse(fs.readFileSync(resultsFile)).results:[];fs.writeFileSync(resultsFile,JSON.stringify({viewport:vp,results:[...old.filter(x=>!results.some(r=>r.route===x.route)),...results],errors},null,2));
}
}finally{session.close();await cdp.closeTab(acq.port,targetId);await acq.cleanup()}})().catch(e=>{console.error(e);process.exitCode=1});

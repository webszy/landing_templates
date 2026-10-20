const {chromium}=require('/Users/walter/.local/share/mise/installs/node/24.19.0/lib/node_modules/pingfusi/packages/motion/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1728,height:982},deviceScaleFactor:2});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const missing=[];page.on('response',r=>{if(r.status()>=400)missing.push({url:r.url(),status:r.status()})});
 await page.goto('http://127.0.0.1:3140/');await page.waitForTimeout(6000);
 fs.mkdirSync('qa',{recursive:true});
 await page.screenshot({path:'qa/desktop.png'});
 const initial=await page.evaluate(()=>({canvas:[...document.querySelectorAll('canvas')].map(c=>({width:c.width,height:c.height})),buttons:[...document.querySelectorAll('button')].map(x=>x.textContent),links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent,href:a.getAttribute('href')}))}));
 const modes=[];
 for(const name of ['Cascade','Veil','Ember','Dusk','Stream']){await page.getByRole('button',{name,exact:true}).click();await page.waitForTimeout(600);modes.push({name,pressed:await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed')});}
 await page.getByRole('button',{name:'Tune',exact:true}).click();await page.waitForTimeout(500);await page.screenshot({path:'qa/tune.png'});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);await page.screenshot({path:'qa/mobile.png'});
 const mobile=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth}));
 const report={initial,modes,mobile,errors,missing};fs.writeFileSync('qa/browser.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

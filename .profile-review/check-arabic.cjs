const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = process.cwd();
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (req.method === 'POST') { res.writeHead(503, {'Content-Type':'text/plain'}).end('Contact email is not configured yet. Please try again later.'); return; }
  fs.readFile(file, (error, data) => {
    res.writeHead(error ? 404 : 200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
    res.end(error ? 'Not found' : data);
  });
});
let chrome, socket;
(async () => {
  await new Promise(resolve => server.listen(8765, '127.0.0.1', resolve));
  chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9333',`--user-data-dir=${path.join(root,'.profile-review/chrome-ar')}`,'about:blank'], {windowsHide:true, stdio:'ignore'});
  chrome.on('error', error => { console.error(error); process.exitCode=1; });
  let endpoint;
  for (let i=0;i<30;i++) {try {endpoint=await (await fetch('http://127.0.0.1:9333/json/version')).json();break;} catch {await pause(300);}}
  if (!endpoint) throw Error('Could not start local Chrome');
  socket = new WebSocket(endpoint.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, {once:true}));
  let id=0; const pending=new Map(); const errors=[];
  socket.addEventListener('message', event => {
    const message=JSON.parse(event.data);
    if(message.id){const task=pending.get(message.id);pending.delete(message.id);message.error?task.reject(message.error):task.resolve(message.result);}
    if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);
  });
  const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params,sessionId}));});
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  const cmd=(method,params={})=>send(method,params,sessionId);
  const evaluate=async expression=>(await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
  await cmd('Page.enable');await cmd('Runtime.enable');
  const report=[];
  for(const page of ['index-ar.html','home-ar.html']) {
    for(const width of [390]) {
      await cmd('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
      await cmd('Page.navigate',{url:`http://127.0.0.1:8765/${page}`});
      for(let i=0;i<40;i++){if(await evaluate(`document.readyState==='complete' && getComputedStyle(document.querySelector('#pre-load')).display==='none'`))break;await pause(200);}
      await pause(1200);
      const state=await evaluate(`(() => {
        const visible=e=>!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)&&getComputedStyle(e).visibility!=='hidden';
        const header=[...document.querySelectorAll('.rs-header-area')].find(e=>!e.classList.contains('rs-sticky-header'));
        const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,right:r.right,width:r.width}};
        return {page:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang,dir:document.documentElement.dir,settings:!!document.querySelector('.rs-theme-settings-area'),links:[...document.querySelectorAll('.barakat-language-link')].map(a=>a.getAttribute('href')),header:rect(header),button:rect(header.querySelector('.sidebar-toggle')),logo:rect(header.querySelector('.rs-header-logo')),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.hash.length>1&&!document.getElementById(a.hash.slice(1))).map(a=>a.hash)};
      })()`);
      report.push(state);
      assert.equal(state.lang,page.includes('-ar')?'ar':'en');
      assert.equal(state.dir,page.includes('-ar')?'rtl':'ltr');
      assert.ok(state.scrollWidth<=width, 'Page overflow: '+page+' '+width);
      assert.equal(state.settings,false);
      assert.deepEqual(state.brokenImages,[]);
      if(page.startsWith('home'))assert.ok(state.button.right<=state.logo.x,'Menu must stay left of logo');
      if(width===390||width===1440){const shot=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`.profile-review/${page}-${width}-ar-check.png`,Buffer.from(shot.data,'base64'));}
      if(page.includes('-ar')&&width===390){
        await evaluate(`document.querySelector('.rs-header-area:not(.rs-sticky-header) .sidebar-toggle .bar-icon').click()`);
        await pause(500);
        const sidebar=await evaluate(`({open:document.querySelector('.offcanvas-area').classList.contains('info-open'),text:document.querySelector('.offcanvas-area').innerText,logo:document.querySelector('.offcanvas-logo img').getAttribute('src')})`);
        report.push({page,sidebar});
        const shot=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`.profile-review/${page}-sidebar-ar-check.png`,Buffer.from(shot.data,'base64'));
        await evaluate(`document.querySelector('.offcanvas-close-icon').click()`);
        await pause(350);
        await evaluate(`[...document.querySelectorAll('.rs-services-tab .nav-link')].at(-1)?.click()`);
        await pause(400);
        report.push({page,activeTab:await evaluate(`document.querySelector('.rs-services-tab .nav-link.active')?.textContent.trim() || null`)});
        await evaluate(`const f=document.querySelector('#contact-form');f.elements.name.value='اختبار';f.elements.email.value='test@example.com';f.elements.message.value='رسالة اختبار';f.requestSubmit();`);
        await pause(400);
        report.push({page,formMessage:await evaluate(`document.querySelector('.ajax-response').textContent`)});
        for(const section of ['homeportfolio','homecontact']){
          await evaluate(`window.scrollTo({top:document.getElementById('${section}').getBoundingClientRect().top+scrollY-100,behavior:'instant'})`);
          await pause(800);
          const shot=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`.profile-review/${page}-${section}-ar-check.png`,Buffer.from(shot.data,'base64'));
        }
        await evaluate(`document.querySelector('.barakat-language-link').click()`);
        await pause(800);
        assert.ok((await evaluate('location.pathname')).endsWith(page.replace('-ar','')),'Language switch destination');
      }
    }
  }
  fs.writeFileSync('.profile-review/arabic-check-results.json',JSON.stringify({report,errors},null,2));
  console.log(JSON.stringify({checks:report.length,errors},null,2));
  await send('Browser.close');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{socket?.close();chrome?.kill();server.close();});

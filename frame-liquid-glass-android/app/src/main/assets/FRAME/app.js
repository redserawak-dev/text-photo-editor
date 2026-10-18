/* FRAME mobile editor v0.3.1. All user media stays on this device. */
(() => {
'use strict';
const E=window.FrameEngine;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={
 home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 archive:'<path d="M5 3h10l4 4v14H5V3Z"/><path d="M14 3v5h5M10 5h2m-2 3h2m-2 3h2m-2 3h2m-2 3h2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',

 back:'<path d="m14 5-7 7 7 7"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>','arrow-up':'<path d="M7 17 17 7M6 7h11v11"/>',
 undo:'<path d="m8 5-5 5 5 5M3 10h11a6 6 0 0 1 0 12"/>',redo:'<path d="m16 5 5 5-5 5m5-5H10a6 6 0 0 0 0 12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',text:'<path d="M4 5h16M12 5v15M8 20h8M4 5v3m16-3v3"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-7 5 7"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-9 10 9 5 9-5M3 18l9 5 9-5"/>',crop:'<path d="M5 2v15a2 2 0 0 0 2 2h15M2 5h15a2 2 0 0 1 2 2v15"/>',
 adjust:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="3" fill="currentColor" stroke="none"/>',
 preset:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/>',gradient:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M5 17h14M5 14h14M5 11h14M5 8h14" opacity=".5"/><path d="M5 17h14" stroke-width="3"/>',
 edit:'<path d="m4 15 11-11 5 5L9 20H4v-5Zm9-9 5 5"/>',font:'<path d="m3 20 6-16 6 16M5 15h8m4-4h5m-2-3v10q0 2 2 2"/>',style:'<path d="M7 4h6a4 4 0 0 1 0 8H7V4Zm0 8h7a4 4 0 0 1 0 8H7v-8Z"/>',color:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',spacing:'<path d="M4 6h16M4 18h16M12 8v8m-3-5 3-3 3 3m-6 2 3 3 3-3"/>',
 position:'<path d="M12 2v20M2 12h20m-20 0 4-3m-4 3 4 3m16-3-4-3m4 3-4 3m-6-13-3 4m3-4 3 4m-3 16-3-4m3 4 3-4"/>',more:'<circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',duplicate:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8-1m-4 9v2"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',hidden:'<path d="m3 3 18 18M2 12s3-6 8-7m4 0c5 1 8 7 8 7s-2 4-6 6M12 19c-6 0-10-7-10-7"/>',
 check:'<path d="m5 12 4 4L20 5"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',folder:'<path d="M3 6h7l2 2h9v12H3V6Zm0 0V4h7l2 2h7v2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3h.01"/>',
 compare:'<path d="M12 2v20M9 4H4v16h5m6-16h5v16h-5"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',share:'<path d="M12 16V2m-5 5 5-5 5 5M6 10H3v11h18V10h-3"/>',
 left:'<path d="M4 4h16M4 9h10M4 14h16M4 19h10"/>',center:'<path d="M3 4h18M7 9h10M3 14h18M7 19h10"/>',right:'<path d="M4 4h16M10 9h10M4 14h16M10 19h10"/>',up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',chevron:'<path d="m9 5 7 7-7 7"/>',reset:'<path d="M3 4v6h6M3 10a9 9 0 1 1 0 5"/>',effects:'<path d="m12 3 2 6 7 3-7 3-2 6-2-6-7-3 7-3 2-6Z"/>',canvas:'<path d="M3 9V3h6m6 0h6v6m0 6v6h-6m-6 0H3v-6"/>',warning:'<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3h.01"/>'
};
const icon=(name)=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.more}</svg>`;
function hydrate(root=document){$$('[data-icon]',root).forEach(el=>{el.innerHTML=icon(el.dataset.icon);el.removeAttribute('data-icon');});}
const renderer=new E.Renderer(),store=new E.Store();
let p=null,selection=null,mode='photo',panel='',adjustTab='light',typing=false,history=[],historyIndex=-1,snap=true;
let saveTimer=null,saveChain=Promise.resolve(),dirty=false,revision=0,toastTimer=null,photoAction='new',exportBlob=null,exportName='',exportFormat='png',exportFactor=1;
let preview=null,rawPreview=null,previewWanted=false,previewRunning=false,previewVersion=0,paintQueued=false,view={zoom:1,panX:0,panY:0,s:1,x:0,y:0,fit:1,width:0,height:0,fitted:false},before=false,guides={x:false,y:false};
let adjustSelected={light:'exposure',color:'saturation',effects:'fade'};
let pointers=new Map(),gesture=null,lastTap={id:null,time:0},dbOK=true;

// Interruptible, critically damped panel motion. No timers that lock the interface.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const sheetState={y:0,velocity:0,target:0,frame:0,closing:false,drag:null,expanded:false,epoch:0};
let fontLibraryOpen=false,fontLibraryTab='all',fontReturnFocus=null,libraryMotion=null,libraryEpoch=0;
let typingView=null, lastToolbarKey='', gradientStop='end', viewportFrame=0;
let motionFrom=null, motionTime=0, modalEpoch=0, modalAnimation=null;
function visualTransition(){
 if(!p||reducedMotion.matches)return;
 motionFrom={s:view.s,x:view.x,y:view.y};motionTime=performance.now();
 requestPaint();
}
function stopSheet(){cancelAnimationFrame(sheetState.frame);sheetState.frame=0;sheetState.velocity=0;}
function setSheetY(y){sheetState.y=y;$('#panel').style.transform=`translate3d(0,${y}px,0)`;requestPaint();}
function settleSheet(target,done){
 cancelAnimationFrame(sheetState.frame);sheetState.target=target;const epoch=++sheetState.epoch;
 if(reducedMotion.matches){sheetState.velocity=0;setSheetY(target);done?.();return;}
 let previous=performance.now();
 const step=now=>{if(epoch!==sheetState.epoch)return;const dt=Math.min(.025,(now-previous)/1000);previous=now;
  sheetState.velocity+=(-540*(sheetState.y-target)-44*sheetState.velocity)*dt;
  setSheetY(sheetState.y+sheetState.velocity*dt);
  if(Math.abs(sheetState.y-target)<.2&&Math.abs(sheetState.velocity)<2){setSheetY(target);sheetState.frame=0;done?.();}
  else sheetState.frame=requestAnimationFrame(step);
 };sheetState.frame=requestAnimationFrame(step);
}
function updateDockLayout(){
 $('#editor').style.setProperty('--dock-bottom','0px');requestPaint();
}
function contextualTabs(key){
 const text=sel()?.type==='text'&&['fonts','type','color','spacing'].includes(key);
 if(text)return `<nav class="sheet-tabs" aria-label="Outils texte">${[['fonts','Font'],['type','Gaya'],['color','Warna'],['spacing','Jarak']].map(([k,label])=>`<button class="${key===k?'active':''}" data-action="panel-${k}" aria-pressed="${key===k}">${label}</button>`).join('')}</nav>`;
 if(['adjust','presets','crop'].includes(key))return `<nav class="sheet-tabs" aria-label="Alat foto">${[['adjust','Atur'],['presets','Filter'],['crop','Crop']].map(([k,label])=>`<button class="${key===k?'active':''}" data-action="panel-${k}">${label}</button>`).join('')}</nav>`;
 return '';
}
function panelReady(){
 const el=$('#panel');if(el.querySelector('.sheet-content'))return;
 el.innerHTML=`<button class="sheet-grip" data-action="expand-panel" aria-label="Perluas atau ringkas panel" title="Perluas atau ringkas panel"><span></span></button><header class="sheet-head"><h2></h2><button class="sheet-done" data-action="close-panel" aria-label="Selesai">${icon('check')}</button></header><div class="sheet-tabs-wrap"></div><div class="sheet-content"></div>`;
 el.querySelector('.sheet-grip').setAttribute('aria-label','Perluas atau ringkas panel');
}
function sheetExpansion(value){if(!panel)return;visualTransition();sheetState.expanded=value;$('#panel').classList.toggle('expanded',value);$('#panel .sheet-grip')?.setAttribute('aria-expanded',String(value));requestPaint();}
function layerGradientCSS(l){return `linear-gradient(90deg,${l.gradientMode==='duotone'?(l.startColor||l.color):l.color+'00'},${l.color})`;}

const sel=()=>p?.layers.find(l=>l.id===selection)||null;
const raf=()=>new Promise(r=>requestAnimationFrame(r));
function toast(message,error=false){clearTimeout(toastTimer);const el=$('#toast');el.innerHTML=icon(error?'warning':'check')+`<span>${esc(message)}</span>`;el.classList.toggle('error',error);el.hidden=false;toastTimer=setTimeout(()=>el.hidden=true,error?6200:3200);}
function busy(show,title='Menyiapkan foto...',note='Semua diproses di perangkat.'){ $('#busy').hidden=!show;$('#busy-title').textContent=title;$('#busy-note').textContent=note;}
function report(e){console.error(e);toast(e.message||'Ada kendala. Coba lagi.',true);busy(false);}
function setSaveStatus(text,error=false){$('#save-status').textContent=text;$('#save-status').classList.toggle('error',error);}
function scheduleSave(){if(!p)return;dirty=true;revision++;clearTimeout(saveTimer);setSaveStatus('Menyimpan...');saveTimer=setTimeout(()=>saveCurrent(),850);}
async function saveCurrent(){clearTimeout(saveTimer);if(!p||!dirty)return saveChain;const snapshot=E.copy(p),rev=revision;const assets=E.assetIds(snapshot).map(id=>renderer.assets.get(id)).filter(Boolean);let thumbnail='';try{const c=document.createElement('canvas');c.width=200;c.height=Math.round(snapshot.h/snapshot.w*200);const cx=c.getContext('2d');cx.scale(c.width/snapshot.w,c.height/snapshot.h);renderer.compose(cx,snapshot,preview);thumbnail=c.toDataURL('image/jpeg',.66);}catch(_){}
  saveChain=saveChain.catch(()=>{}).then(()=>store.save(snapshot,assets,thumbnail)).then(()=>{dbOK=true;if(p?.id===snapshot.id&&rev===revision){dirty=false;setSaveStatus('Tersimpan di perangkat');}}).catch(e=>{dbOK=false;setSaveStatus('Belum tersimpan - buat backup',true);console.warn(e);});return saveChain;}
function commit(){if(!p)return;const serialized=JSON.stringify(p);if(history[historyIndex]!==serialized){history=history.slice(0,historyIndex+1);history.push(serialized);if(history.length>45)history.shift();historyIndex=history.length-1;scheduleSave();}updateHistory();}
function updateHistory(){$('#undo').disabled=historyIndex<=0;$('#redo').disabled=historyIndex>=history.length-1;}
function historyMove(delta){if(typing)finishTyping();const ni=historyIndex+delta;if(ni<0||ni>=history.length)return;p=JSON.parse(history[ni]);historyIndex=ni;if(!sel())selection=null;renderer.invalidate();refreshUI();requestPaint(true);scheduleSave();}
function refreshUI(){if(!p)return;$('#project-name').textContent=p.name;$('#document-label').textContent=`${p.w} \u00d7 ${p.h}`;updateHistory();updateToolbar();if(panel)openPanel(panel);}
function resetView(){view.zoom=1;view.panX=0;view.panY=0;requestPaint();}
function requestPaint(photo=false){if(!p)return;if(photo||(!preview&&!previewRunning&&!previewWanted)){previewWanted=true;previewVersion++;pumpPreview();}if(!paintQueued){paintQueued=true;requestAnimationFrame(()=>{paintQueued=false;paint();});}}
async function pumpPreview(){if(previewRunning||!p||!previewWanted)return;previewRunning=true;let error=false;try{while(previewWanted&&p){previewWanted=false;const version=previewVersion,cp=E.copy(p),max=innerWidth<650?1100:1400,f=Math.min(1,max/Math.max(cp.w,cp.h)),w=Math.round(cp.w*f),h=Math.round(cp.h*f);$('#render-status').hidden=false;const out=await renderer.photo(cp,w,h);const orig=await renderer.raw(cp,w,h);if(version===previewVersion&&p.id===cp.id){preview=out;rawPreview=orig;requestPaint();}}}catch(e){error=true;console.warn(e);toast('Foto belum bisa diproses. Coba reset tone atau buka ulang proyek.',true);}finally{previewRunning=false;$('#render-status').hidden=true;if(previewWanted&&!error)pumpPreview();}}
function paint(){
 if(!p||$('#editor').hidden)return;
 const box=$('#stage').getBoundingClientRect(),w=box.width,h=box.height;if(w<1||h<1)return;
 const ratio=Math.min(devicePixelRatio||1,2);
 let occupied=116;
 if(typing)occupied=Math.max(0,box.bottom-$('#typing').getBoundingClientRect().top)+10;
 else if(!$('#panel').hidden)occupied=Math.max(0,$('#panel').offsetHeight-sheetState.y);
 const usable=Math.max(70,h-occupied-96);view.width=w;view.height=h;view.contentHeight=h;
 const fitAll=typing||view.fitted;view.centerY=fitAll?88+usable/2:h/2;
 view.fit=Math.max(.01,Math.min((w-(fitAll?32:0))/p.w,(fitAll?usable:h)/p.h));
 let target={s:view.fit*view.zoom,x:0,y:0};target.x=(w-p.w*target.s)/2+view.panX;target.y=(fitAll?88+(usable-p.h*target.s)/2:(h-p.h*target.s)/2)+view.panY;
 // An open panel overlays the photo. Keep the selected text above it without changing the document.
 const selectedLayer=sel();const layer=selectedLayer?.type==='gradient'?p.layers.find(l=>l.type==='text'&&l.visible):selectedLayer;
 if(!fitAll&&layer&&layer.type==='text'&&!$('#panel').hidden&&view.zoom===1){
  const bounds=E.layout(layer),bottom=target.y+(layer.y+bounds.h)*target.s,top=target.y+layer.y*target.s;
  const delta=Math.max(0,bottom-(h-occupied-30));target.y-=Math.min(delta,Math.max(0,top-115));
 }
 if(motionFrom&&!reducedMotion.matches&&!sheetState.drag){const t=Math.min(1,(performance.now()-motionTime)/360),ease=1-Math.pow(1-t,4);view.s=motionFrom.s+(target.s-motionFrom.s)*ease;view.x=motionFrom.x+(target.x-motionFrom.x)*ease;view.y=motionFrom.y+(target.y-motionFrom.y)*ease;if(t<1)requestPaint();else motionFrom=null;}
 else{view.s=target.s;view.x=target.x;view.y=target.y;motionFrom=null;}
 if(gesture?.viewSnapshot&&pointers.size===1){view.s=gesture.viewSnapshot.s;view.x=gesture.viewSnapshot.x;view.y=gesture.viewSnapshot.y;view.fit=gesture.viewSnapshot.fit;}
 for(const c of [$('#artwork'),$('#interaction')])if(c.width!==Math.round(w*ratio)||c.height!==Math.round(h*ratio)){c.width=Math.round(w*ratio);c.height=Math.round(h*ratio);}
 const c=$('#artwork').getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);c.save();c.translate(view.x,view.y);c.scale(view.s,view.s);c.beginPath();c.rect(0,0,p.w,p.h);c.clip();renderer.compose(c,p,before?rawPreview:preview,{before});c.restore();
 const o=$('#interaction').getContext('2d');o.setTransform(ratio,0,0,ratio,0,0);o.clearRect(0,0,w,h);o.save();o.translate(view.x,view.y);o.scale(view.s,view.s);drawSelection(o);o.restore();
 $('#zoom-label').textContent=view.zoom===1?'':`${Math.round(view.zoom*100)}%`;
 $('#stage').style.setProperty('--controls-bottom',`${Math.min(h-100,occupied+12)}px`);
 $('#editor').classList.toggle('fit-view',!!view.fitted);
 const label=$('#fit-button .fit-label');if(label)label.textContent=view.fitted?'Penuh':'Utuh';
}
function layerBox(l){return l.type==='text'?E.layout(l):{w:l.w,h:l.h};}
function rotatePoint(x,y,degrees){const t=degrees*Math.PI/180;return{x:x*Math.cos(t)-y*Math.sin(t),y:x*Math.sin(t)+y*Math.cos(t)};}
function localPoint(pt,l){return rotatePoint(pt.x-l.x,pt.y-l.y,-(l.rotation||0));}
function docPoint(x,y){return{x:(x-view.x)/view.s,y:(y-view.y)/view.s};}
function worldPoint(l,x,y){const v=rotatePoint(x,y,l.rotation||0);return{x:l.x+v.x,y:l.y+v.y};}
function handles(l){const b=layerBox(l),r=28/view.s;return[{type:'tl',x:0,y:0},{type:'tr',x:b.w,y:0},{type:'bl',x:0,y:b.h},{type:'br',x:b.w,y:b.h},{type:'rotate',x:b.w/2,y:-r},...(l.type==='text'?[{type:'width',x:b.w,y:b.h/2}]:[])].map(v=>({...v,...worldPoint(l,v.x,v.y)}));}
function drawSelection(c){if(guides.x||guides.y){c.strokeStyle='#007aff';c.lineWidth=1/view.s;c.setLineDash([4/view.s,4/view.s]);if(guides.x){c.beginPath();c.moveTo(p.w/2,0);c.lineTo(p.w/2,p.h);c.stroke();}if(guides.y){c.beginPath();c.moveTo(0,p.h/2);c.lineTo(p.w,p.h/2);c.stroke();}c.setLineDash([]);}const l=sel();if(!l||!l.visible||before)return;c.strokeStyle='#ffffff';c.fillStyle='#ffffff';c.lineWidth=1/view.s;if(l.type==='gradient'){const a={x:l.x1*p.w,y:l.y1*p.h},b={x:l.x2*p.w,y:l.y2*p.h};c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();for(const [i,t]of [a,b].entries()){c.beginPath();c.arc(t.x,t.y,6/view.s,0,Math.PI*2);c.fillStyle=i===0?(l.gradientMode==='duotone'?(l.startColor||l.color):'#ffffff'):l.color;c.fill();c.stroke();c.save();c.fillStyle='#111';c.font=`${8/view.s}px Arial`;c.textAlign='center';c.textBaseline='middle';if(i===0&&l.gradientMode!=='duotone')c.fillText('0',t.x,t.y);c.restore();}return;}
  const box=layerBox(l);c.save();c.translate(l.x,l.y);c.rotate((l.rotation||0)*Math.PI/180);c.strokeRect(0,0,box.w,box.h);if(!typing&&!l.locked){c.beginPath();c.moveTo(box.w/2,0);c.lineTo(box.w/2,-28/view.s);c.stroke();}c.restore();if(typing||l.locked)return;for(const h of handles(l)){c.beginPath();if(h.type==='width')c.rect(h.x-3/view.s,h.y-7/view.s,6/view.s,14/view.s);else c.arc(h.x,h.y,(h.type==='rotate'?4.5:3.5)/view.s,0,Math.PI*2);c.fillStyle=h.type==='rotate'?'#151613':'#f2f1ea';c.fill();c.stroke();}}
function hitLayer(pt){for(const l of [...p.layers].reverse()){if(!l.visible||l.locked||l.type==='gradient')continue;const local=localPoint(pt,l),b=layerBox(l);if(local.x>=-4/view.s&&local.y>=-4/view.s&&local.x<=b.w+4/view.s&&local.y<=b.h+4/view.s)return l;}return null;}
function selectLayer(id,keepPanel=false){selection=id;const l=sel();if(l)mode=l.type==='gradient'?'photo':'design';if(!keepPanel)closePanel();updateToolbar();requestPaint();}
function tool(name,label,action,active=false){return `<button class="tool ${active?'active':''} ${action==='delete'?'danger':''}" data-action="${action}" aria-label="${esc(label)}">${icon(name)}<span>${esc(label)}</span></button>`;}
function updateToolbar(){const l=sel();let items;if(l?.type==='text')items=[['edit','Edit teks','edit-text'],['font','Font','panel-fonts'],['style','Gaya','panel-type'],['color','Warna','panel-color'],['spacing','Jarak','panel-spacing'],['position','Posisi','panel-position'],['more','Lainnya','panel-more']];else if(l?.type==='image')items=[['image','Ganti','replace-layer'],['adjust','Opasitas','panel-image'],['position','Posisi','panel-position'],['layers','Layers','panel-layers'],['more','Lainnya','panel-more']];else if(l?.type==='gradient')items=[['gradient','Gradien','panel-gradient'],['layers','Layers','panel-layers'],['duplicate','Duplikat','duplicate'],['trash','Hapus','delete']];else if(mode==='photo')items=[['adjust','Atur','panel-adjust'],['preset','Filter','panel-presets'],['text','Teks','add-text'],['gradient','Gradien','add-gradient'],['more','Lainnya','panel-more']];else items=[['text','Teks','add-text'],['image','Gambar','add-image'],['layers','Layers','panel-layers'],['canvas','Kanvas','panel-canvas'],['more','Lainnya','panel-more']];const toolbarKey=items.map(i=>i[2]).join('|');
 if(toolbarKey!==lastToolbarKey){lastToolbarKey=toolbarKey;const prior=$('#toolbar'),next=prior.cloneNode(false);prior.getAnimations().forEach(a=>a.cancel());next.innerHTML=items.map(([i,t,a])=>tool(i,t,a,panel&&a===`panel-${panel}`)).join('');prior.replaceWith(next);
  if(!reducedMotion.matches)$('#toolbar').animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'ease-out'});
 }else $$('#toolbar .tool').forEach(b=>b.classList.toggle('active',!!panel&&b.dataset.action===`panel-${panel}`));
 $('#toolbar').classList.toggle('many',items.length>5);$$('#mode-switch button').forEach(b=>b.classList.toggle('active',b.dataset.action===`mode-${mode}`));$('#editor-bottom').hidden=typing;$('#editor').classList.toggle('has-panel',!!panel&&!typing);$('#editor').classList.toggle('is-typing',typing);$('#editor').dataset.panel=panel;$('#editor').classList.toggle('has-selection',!!l);$('#selection-context').hidden=!l;if(l)$('#selection-label').innerHTML=icon(l.type==='text'?'text':l.type==='gradient'?'gradient':'image')+`<span>${esc(l.type==='text'?(l.text||'Teks baru').split('\n')[0].slice(0,26):l.type==='gradient'?'Gradien':'Gambar')}</span>`;$('#mode-switch').hidden=!!l;updateDockLayout();$$('#toolbar .tool').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));$$('#mode-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));}
function control(label,key,value,min,max,step=1,unit=''){const v=Number(value),percent=(v-min)/(max-min)*100;return `<div class="control"><div class="control-top"><label for="r-${key}">${esc(label)}</label><div class="value-input"><input type="number" aria-label="${esc(label)} - angka" data-prop="${key}" value="${v}" min="${min}" max="${max}" step="${step}"><small>${esc(unit)}</small></div></div><input id="r-${key}" type="range" data-prop="${key}" aria-label="${esc(label)}" value="${v}" min="${min}" max="${max}" step="${step}" style="--fill:${percent}%"></div>`;}
function choice(label,action,active=false,extra=''){return `<button class="choice ${active?'active':''}" data-action="${action}" ${extra}>${label}</button>`;}
function alignButtons(l){return `<div class="align-row"><span>Rata teks</span><div class="align-buttons">${['left','center','right'].map(a=>choice(icon(a),`align-${a}`,l.align===a,`aria-label="Rata ${a==='left'?'kiri':a==='right'?'kanan':'tengah'}"`)).join('')}</div></div>`;}
function panelHTML(key){const l=sel();switch(key){
case 'presets':return {title:'Presets foto',html:`<div class="presets">${E.PRESETS.map(pre=>`<button class="preset ${p.preset===pre.id?'active':''}" data-action="preset" data-value="${pre.id}"><canvas width="166" height="202" data-preset="${pre.id}"></canvas><span>${pre.name}</span><small>${pre.note}</small></button>`).join('')}</div>${control('Intensitas','intensity',p.intensity,0,100,1,'%')}<p class="sheet-note">Karakter warna terinspirasi fotografi. Bukan simulasi resmi kamera. Layer teks tidak ikut difilter.</p><button class="text-button" data-action="reset-tone">${icon('reset')} Reset semua tone</button>`};
case 'adjust':{
 const fields=adjustTab==='light'?[['Gelap / terang','exposure',-2,2,.05,'EV','sun'],['Kontras','contrast',-100,100,1,'','preset'],['Highlights','highlights',-100,100,1,'','sun'],['Shadows','shadows',-100,100,1,'','gradient']]:adjustTab==='color'?[['Saturasi','saturation',-100,100,1,'','color'],['Suhu warna','temperature',-100,100,1,'','sun'],['Tint','tint',-100,100,1,'','color']]:[['Fade','fade',0,100,1,'','gradient'],['Grain','grain',0,100,1,'','effects'],['Vignette','vignette',0,100,1,'','preset']];
 const selected=fields.find(f=>f[1]===adjustSelected[adjustTab])||fields[0];
 return {title:'Sesuaikan foto',html:`<div class="tabs">${[['light','Cahaya'],['color','Warna'],['effects','Efek']].map(([v,t])=>`<button class="${adjustTab===v?'active':''}" data-action="adjust-tab" data-value="${v}">${t}</button>`).join('')}</div><div class="adjust-options">${fields.map(([t,k,min,max,step,u,i])=>`<button class="adjust-option ${k===selected[1]?'active':''}" data-action="adjust-control" data-value="${k}" aria-label="${t}">${icon(i)}<span>${t==='Gelap / terang'?'Terang':t}</span></button>`).join('')}</div><div class="adjustment-one">${control(selected[0],'a.'+selected[1],p.adjust[selected[1]],selected[2],selected[3],selected[4],selected[5])}<div class="ruler" aria-hidden="true"></div></div><button class="text-button adjust-reset" data-action="reset-adjust">${icon('reset')} Reset adjustment</button>`};}
case 'type':if(!l||l.type!=='text')return null;return {title:'Tipografi',html:`<span class="group-label">FONT</span><button class="font-current" data-action="open-font-library"><span style="font-family:${esc(l.font)}">${esc(fontName(l.font))}</span>${icon('chevron')}</button><div class="row equal">${choice('Regular','weight-400',l.weight===400)}${choice('<b>Bold</b>','weight-700',l.weight>=600)}${choice('<i>Miring</i>','italic',l.italic)}</div>${control('Ukuran font','l.size',l.size,8,600,1,'px')}${alignButtons(l)}<p class="sheet-note">Bold dan miring dapat disintesis browser bila font tidak menyediakan varian aslinya.</p>`};
case 'spacing':if(!l||l.type!=='text')return null;return {title:'Jarak & paragraf',html:`${control('Jarak huruf','l.spacing',l.spacing,-10,60,.5,'px')}${control('Jarak baris','l.lineHeight',l.lineHeight,.75,2.5,.05,'x')}${control('Lebar kotak teks','l.w',l.w,40,p.w*1.5,1,'px')}${alignButtons(l)}<p class="sheet-note">Lebar kotak mengatur pindah baris, bukan memperbesar huruf.</p>`};
case 'fonts':if(!l||l.type!=='text')return null;return {title:'Teks',html:`<div class="font-quick-head"><span>Font</span><button class="text-button" data-action="open-font-library">Semua font ${icon('chevron')}</button></div><div class="quick-fonts" id="font-list">${quickFonts()}</div><button class="font-inline-import" data-action="open-font-library">${icon('plus')} Tambah font dari file / ZIP</button>`};
case 'color':if(!l||l.type!=='text')return null;return {title:'Warna teks',html:colorControls(l.color,'l.color')+control('Opasitas','l.opacity',l.opacity,0,100,1,'%')+`<p class="sheet-note">Warna teks berdiri sendiri, tidak berubah oleh preset foto.</p>`};
case 'position':if(!l||l.type==='gradient')return null;return {title:'Posisi presisi',html:`${control('Posisi X','l.x',Math.round(l.x),-p.w,p.w*2,1,'px')}${control('Posisi Y','l.y',Math.round(l.y),-p.h,p.h*2,1,'px')}${control('Rotasi','l.rotation',Math.round(l.rotation),-180,180,1,'deg')}<div class="row equal">${choice('Tengah X','center-x')}${choice('Tengah Y','center-y')}${choice('Luruskan','reset-rotation')}</div><label class="check-row">Snap ke tengah<input type="checkbox" id="snap-toggle" ${snap?'checked':''}></label>`};
case 'gradient':if(!l||l.type!=='gradient')return null;return {title:'Gradien',html:gradientControls(l)};
case 'crop':return {title:'Crop & komposisi',html:`${ratioChoices()}${p.photo?`${control('Zoom foto','photo.zoom',p.photo.zoom,1,4,.01,'x')}${control('Geser horizontal','photo.offsetX',p.photo.offsetX,-1,1,.01,'')}${control('Geser vertikal','photo.offsetY',p.photo.offsetY,-1,1,.01,'')}${control('Luruskan foto','photo.rotation',p.photo.rotation,-45,45,.5,'deg')}<button class="text-button" data-action="reset-crop">${icon('reset')} Reset posisi foto</button>`:''}<p class="sheet-note">Crop tidak menghapus foto asli. Untuk menggeser foto, naikkan zoom sedikit agar ada ruang.</p>`};
case 'canvas':return {title:'Kanvas',html:`${ratioChoices()}<span class="group-label">UKURAN KUSTOM</span><div class="row"><input id="custom-width" class="text-field" type="number" aria-label="Lebar kanvas" min="128" max="4096" value="${p.w}"><span class="muted">x</span><input id="custom-height" class="text-field" type="number" aria-label="Tinggi kanvas" min="128" max="4096" value="${p.h}"></div><button class="secondary" data-action="custom-size">Terapkan ukuran</button><p class="sheet-note">Satuan piksel; maksimal 4096 per sisi. Posisi layer mengikuti proporsi kanvas.</p>`};
case 'layers':return {title:'Layers',html:layersHTML()};
case 'image':if(!l||l.type!=='image')return null;return {title:'Gambar tambahan',html:`${control('Opasitas','l.opacity',l.opacity,0,100,1,'%')}${control('Lebar','l.w',l.w,20,p.w*2,1,'px')}<div class="row equal">${choice('Ganti gambar','replace-layer')}${choice('Duplikat','duplicate')}</div><p class="sheet-note">Ukuran berubah proporsional. Filter foto utama tidak diterapkan ke gambar tambahan.</p>`};
case 'more':if(!l)return {title:'Alat lainnya',html:`<div class="tool-grid">${[['image','Ganti foto','replace-photo'],['image','Tambah gambar','add-image'],['layers','Layers','panel-layers'],['crop','Crop','panel-crop'],['canvas','Kanvas','panel-canvas'],['folder','Proyek & backup','project']].map(([i,t,a])=>tool(i,t,a)).join('')}</div>`};return {title:'Layer pilihan',html:`<div class="row equal">${choice(icon('duplicate')+' Duplikat','duplicate')}${choice(icon('trash')+' Hapus','delete')}</div><div class="row equal">${choice(icon(l.locked?'unlock':'lock')+(l.locked?' Buka kunci':' Kunci'),'lock-selected')}${choice(icon('layers')+' Urutan','panel-layers')}</div>${l.type==='text'?`${control('Bayangan','l.shadow',l.shadow,0,60,1,'px')}${control('Outline hitam','l.stroke',l.stroke,0,12,.5,'px')}<label class="check-row">Latar gelap teks<input type="checkbox" data-toggle="background" ${l.background?'checked':''}></label>`:''}`};
default:return null;}}
function openPanel(key){
 if(typing)finishTyping();const info=panelHTML(key);if(!info){closePanel();return;}
 const el=$('#panel'),previous=panel,wasVisible=!el.hidden,previousScroll=el.querySelector('.sheet-content')?.scrollTop||0;
 if(previous!==key&&wasVisible)visualTransition();sheetState.closing=false;panelReady();$('#panel .sheet-content').inert=false;panel=key;$('#editor').dataset.lastPanel=key;el.hidden=false;el.inert=false;
 el.classList.toggle('font-sheet',key==='fonts');el.setAttribute('aria-label',info.title);
 el.querySelector('.sheet-head h2').textContent=(sel()?.type==='text'&&['fonts','type','color','spacing'].includes(key))?'Teks':info.title;
 el.querySelector('.sheet-tabs-wrap').innerHTML=contextualTabs(key);
 $('#editor').classList.add('panel-visible');
 const content=el.querySelector('.sheet-content');const opened=previous===key?[...content.querySelectorAll('details[open]')].map(d=>d.className):[];
 content.innerHTML=info.html.replace(/<p class="sheet-note">(.*?)<\/p>/g,'<details class="panel-help"><summary>Catatan alat</summary><p>$1</p></details>');
 opened.forEach(c=>{const d=[...content.querySelectorAll('details')].find(d=>d.className===c);if(d)d.open=true;});content.scrollTop=previous===key?previousScroll:0;
 if(sel()?.locked){content.querySelectorAll('input,select,button').forEach(e=>{if(!['lock-selected','layer-lock','layer-visible','layer-select'].includes(e.dataset.action))e.disabled=true;});}
 updateToolbar();
 if(!wasVisible){sheetState.expanded=false;el.classList.remove('expanded');updateDockLayout();setSheetY(el.offsetHeight+18);settleSheet(0);}
 else if(sheetState.y!==0||sheetState.frame)settleSheet(0);
 if(previous&&previous!==key&&!reducedMotion.matches)content.animate([{opacity:.3,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'ease-out'});
 requestPaint();if(key==='presets')renderPresetThumbnails();
}
function closePanel(instant=false){
 const el=$('#panel');panel='';sheetState.closing=true;if(el.querySelector('.sheet-content'))el.querySelector('.sheet-content').inert=true;updateToolbar();
 const finish=()=>{el.hidden=true;el.inert=false;$('#editor').classList.remove('panel-visible');sheetState.closing=false;sheetState.expanded=false;el.classList.remove('expanded');sheetState.y=0;el.style.transform='';requestPaint();};
 if(instant||el.hidden){stopSheet();++sheetState.epoch;finish();}else settleSheet(el.offsetHeight+18,finish);
}
function gradientControls(l){
 const duo=l.gradientMode==='duotone';if(!duo)gradientStop='end';const start=l.startColor||l.color,end=l.color,key=gradientStop==='start'?'l.startColor':'l.color',value=gradientStop==='start'?start:end;
 const colors=['#ff9500','#ff70ad','#af52de','#40a6ed','#4dceac','#000000','#ffffff'];
 const angle=(Math.atan2((l.y2-l.y1)*p.h,(l.x2-l.x1)*p.w)*180/Math.PI+360)%360;
 return `<div class="tabs gradient-modes" aria-label="Jenis gradien">${[['fade','Warna ke transparan'],['duotone','Dua warna']].map(([v,t])=>`<button data-action="gradient-mode" data-value="${v}" class="${(duo?'duotone':'fade')===v?'active':''}" aria-pressed="${(duo?'duotone':'fade')===v}">${t}</button>`).join('')}</div>
 <div class="gradient-strip checkered"><div class="gradient-preview" style="background:${layerGradientCSS(l)}"></div></div>
 <div class="gradient-stops"><button class="gradient-stop ${gradientStop==='start'?'active':''}" data-action="gradient-stop" data-value="start" aria-label="${duo?'Pilih warna awal':'Ujung transparan'}" ${!duo?'disabled':''}><span class="stop-dot ${!duo?'checkered':''}" ${duo?`style="background:${start}"`:''}></span></button><button class="icon-button gradient-swap" data-action="gradient-swap" aria-label="${duo?'Tukar kedua warna':'Balik arah gradien'}">${icon('compare')}</button><button class="gradient-stop ${gradientStop==='end'?'active':''}" data-action="gradient-stop" data-value="end" aria-label="Pilih warna akhir"><span class="stop-dot" style="background:${end}"></span></button></div>
 <div class="swatches gradient-swatches" aria-label="Warna gradien">${colors.map(c=>`<button class="swatch ${c===value?'active':''}" style="--swatch:${c}" data-action="swatch" data-color-prop="${key}" data-value="${c}" aria-label="Warna ${c}"><span></span></button>`).join('')}<label class="gradient-add-color" title="Warna bebas">${icon('plus')}<input type="color" data-prop="${key}" value="${value}" aria-label="Warna gradien bebas"></label></div>
 <div class="gradient-sliders">${control('Sudut','gradient-angle',Math.round(angle),0,360,1,'deg')}${control('Opasitas','l.opacity',l.opacity,0,100,1,'%')}${control('Fade','gradient-length',Math.round(Math.hypot(l.x2-l.x1,l.y2-l.y1)*100),5,140,1,'%')}</div>
 <details class="gradient-advanced"><summary>Kode warna & arah ${icon('chevron')}</summary><label class="hex-field"><span>HEX</span><input class="color-field" value="${value.toUpperCase()}" maxlength="7" aria-label="Kode warna HEX" data-hex="${key}" spellcheck="false"></label><div class="row equal">${choice(icon('down'),'gradient-bottom',false,'aria-label="Arah bawah"')}${choice(icon('up'),'gradient-top',false,'aria-label="Arah atas"')}${choice('Kiri','gradient-left')}${choice('Kanan','gradient-right')}</div><p class="sheet-note">Ketuk titik di strip untuk mengganti warna awal atau akhir. Kedua titik di foto bisa digeser.</p></details>`;
}
function syncGradientPreview(){
 const l=sel();if(panel!=='gradient'||!l)return;
 const strip=$('.gradient-preview');if(strip)strip.style.background=layerGradientCSS(l);
 const start=$('[data-action="gradient-stop"][data-value="start"] .stop-dot'),end=$('[data-action="gradient-stop"][data-value="end"] .stop-dot');
 if(start&&l.gradientMode==='duotone')start.style.background=l.startColor||l.color;if(end)end.style.background=l.color;
}

function fontName(family){return p?.fonts.find(f=>f.family===family)?.name||family;}
const SYSTEM_FONTS=['Georgia','Arial','Times New Roman','Verdana','Trebuchet MS','Courier New'];
function fontOptions(query=''){const l=sel();const sample=(l?.text||'Aa, punya cerita.').split('\n')[0].slice(0,28);return [...(p.fonts||[]).map(f=>({name:f.name,family:f.family,custom:true})),...SYSTEM_FONTS.map(f=>({name:f,family:f}))].filter(f=>f.name.toLowerCase().includes(query.toLowerCase())).map(f=>`<button class="font-option ${l?.font===f.family?'active':''}" data-action="choose-font" data-value="${esc(f.family)}" aria-label="Pakai ${esc(f.name)}"><span class="font-option-copy"><span class="font-sample" style="font-family:${esc(f.family)}">${esc(sample)}</span><span class="font-meta">${esc(f.name)}</span></span>${l?.font===f.family?icon('check'):`<small>${f.custom?'IMPOR':'SISTEM'}</small>`}</button>`).join('')||'<p class="empty-note">Font tidak ditemukan.</p>';}
function quickFonts(){const l=sel();return [...(p.fonts||[]).map(f=>({name:f.name,family:f.family})),...SYSTEM_FONTS.map(f=>({name:f,family:f}))].map(f=>`<button class="quick-font ${l?.font===f.family?'active':''}" data-action="choose-font" data-value="${esc(f.family)}" aria-label="Pakai ${esc(f.name)}"><span style="font-family:${esc(f.family)}">Aa</span><small>${esc(f.name)}</small></button>`).join('');}
function renderFontLibrary(){if(!fontLibraryOpen||!p)return;const q=($('#library-search')?.value||'').toLowerCase();const l=sel();const list=[...(p.fonts||[]).map(f=>({...f,custom:true})),...SYSTEM_FONTS.map(f=>({name:f,family:f,custom:false}))].filter(f=>(fontLibraryTab==='all'||(fontLibraryTab==='imported'?f.custom:!f.custom))&&f.name.toLowerCase().includes(q));
 $('#library-count').textContent=list.length;$$('.library-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.value===fontLibraryTab));
 $('#library-font-list').innerHTML=list.length?list.map(f=>`<button class="library-font ${l?.font===f.family?'active':''}" data-action="choose-font" data-value="${esc(f.family)}" aria-label="Pakai ${esc(f.name)}"><span class="library-aa" style="font-family:${esc(f.family)}">Aa</span><span class="library-label"><strong>${esc(f.name)}</strong><small>${f.custom?'Font impor':'Font perangkat'}</small></span><span class="font-radio">${l?.font===f.family?icon('check'):''}</span></button>`).join(''):`<div class="font-empty">${icon('font')}<strong>${q?'Font tidak ditemukan':'Belum ada font impor'}</strong><p>${q?'Coba nama lain.':'Masukkan file font atau satu paket ZIP di atas.'}</p></div>`;
}
function openFontLibrary(){
 if(!sel()||sel().type!=='text')return;fontReturnFocus=document.activeElement;fontLibraryOpen=true;libraryMotion?.cancel();++libraryEpoch;
 const page=$('#font-page');page.hidden=false;page.inert=false;$('#editor').inert=true;$('#home').inert=true;renderFontLibrary();
 if(!reducedMotion.matches)libraryMotion=page.animate([{opacity:.2,translate:'24px 0'},{opacity:1,translate:'0 0'}],{duration:260,easing:'cubic-bezier(.2,.8,.2,1)'});
 $('#font-page [data-action="close-font-library"]').focus({preventScroll:true});
}
function closeFontLibrary(instant=false){
 fontLibraryOpen=false;libraryMotion?.cancel();const epoch=++libraryEpoch;$('#editor').inert=false;$('#home').inert=false;const page=$('#font-page');
 const finish=()=>{if(epoch===libraryEpoch){page.hidden=true;page.inert=false;}};
 if(instant||reducedMotion.matches||page.hidden)finish();else{page.inert=true;libraryMotion=page.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'24px 0'}],{duration:180,easing:'ease-out'});libraryMotion.onfinish=finish;}
 if(panel==='fonts')openPanel('fonts');
 // The old panel DOM was refreshed; return to a current, visible control.
 $('#panel [data-action="open-font-library"]')?.focus({preventScroll:true});fontReturnFocus=null;
}
function colorControls(color,prop,compact=false){
 const colors=['#000000','#ffffff','#ff3b30','#ff9500','#ffcc00','#34c759','#007aff','#af52de','#ff2d55'];
 return `<div class="swatches ${compact?'compact-swatches':''}" role="group" aria-label="Pilihan warna">${colors.map(c=>`<button class="swatch ${c.toLowerCase()===color.toLowerCase()?'active':''}" style="--swatch:${c}" data-action="swatch" data-color-prop="${prop}" data-value="${c}" aria-label="Warna ${c}" aria-pressed="${c.toLowerCase()===color.toLowerCase()}"><span></span></button>`).join('')}</div><div class="color-custom"><label class="native-color-wrap" title="Pilih warna bebas"><span class="color-wheel" aria-hidden="true"></span><input type="color" data-prop="${prop}" value="${color}" aria-label="Pilih warna bebas"></label><label class="hex-field"><span>HEX</span><input class="color-field" value="${color.toUpperCase()}" maxlength="7" aria-label="Kode warna HEX" data-hex="${prop}" spellcheck="false" autocomplete="off"></label></div>`;
}

function ratioChoices(){return `<span class="group-label">RASIO KANVAS</span><div class="row equal">${[['1:1',1080,1080],['4:5',1080,1350],['9:16',1080,1920],['16:9',1920,1080]].map(([name,w,h])=>choice(name,'ratio',Math.abs(p.w/p.h-w/h)<.002,`data-w="${w}" data-h="${h}"`)).join('')}</div>`;}
function layersHTML(){const layers=[...p.layers].reverse();return `<p class="sheet-note">Paling atas tampil di depan. Pilih layer, lalu gunakan tombol naik / turun.</p>${layers.map(l=>`<div class="layer-row ${l.id===selection?'active':''}"><button class="layer-select" data-action="layer-select" data-id="${esc(l.id)}">${l.type==='text'?'<span class="layer-thumb">T</span>':l.type==='gradient'?`<span class="layer-thumb" style="background:${layerGradientCSS(l)}"></span>`:`<img class="layer-thumb" src="${esc(renderer.assets.get(l.asset)?.data||'')}" alt="">`}<span class="layer-label"><span>${esc(l.type==='text'?(l.text||'Teks kosong').slice(0,40):l.name||'Gambar')}</span><small>${l.type==='text'?'Teks':l.type==='gradient'?'Gradient':'Gambar'}</small></span></button><button class="icon-button" data-action="layer-visible" data-id="${esc(l.id)}" aria-label="${l.visible?'Sembunyikan':'Tampilkan'} layer">${icon(l.visible?'eye':'hidden')}</button><button class="icon-button" data-action="layer-lock" data-id="${esc(l.id)}" aria-label="${l.locked?'Buka kunci':'Kunci'} layer">${icon(l.locked?'lock':'unlock')}</button></div>`).join('')}${p.photo?`<div class="layer-row"><span class="layer-thumb">${icon('image')}</span><span class="layer-label"><span>Foto utama</span><small>Dasar / tidak ikut urutan layer</small></span></div>`:''}${!layers.length?'<p class="empty-note">Belum ada layer. Tambahkan teks, gambar, atau gradient.</p>':''}${selection?`<div class="layer-actions">${choice(icon('up')+' Naik','layer-up')}${choice(icon('down')+' Turun','layer-down')}${choice(icon('duplicate'),'duplicate',false,'aria-label="Duplikat layer"')}${choice(icon('trash'),'delete',false,'aria-label="Hapus layer"')}</div>`:''}`;}
let thumbnailToken=0;
async function renderPresetThumbnails(){const token=++thumbnailToken,cp=E.copy(p);try{const r=await renderer.raw(cp,166,202);for(const preset of E.PRESETS){if(token!==thumbnailToken||panel!=='presets')return;const cv=$(`canvas[data-preset="${preset.id}"]`);if(!cv)continue;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(r,0,0);const img=ctx.getImageData(0,0,166,202);E.processPixels(img.data,166,202,renderer.combined(cp,preset.id));ctx.putImageData(img,0,0);await raf();}}catch(e){console.warn(e);}}
function readProp(key){if(key.startsWith('l.'))return sel()?.[key.slice(2)];if(key.startsWith('a.'))return p.adjust[key.slice(2)];if(key.startsWith('photo.'))return p.photo?.[key.slice(6)];return p[key];}
function applyProp(key,value){if(!p)return;const l=sel();let photo=false;if(key.startsWith('l.')){if(!l||l.locked){toast('Buka kunci layer dulu.');return;}const k=key.slice(2);if(k==='w'&&l.type==='image')l.h=l.h*value/l.w;l[k]=value;}else if(key.startsWith('a.')){p.adjust[key.slice(2)]=value;photo=true;}else if(key.startsWith('photo.')){if(!p.photo)return;p.photo[key.slice(6)]=value;photo=true;}else if(key==='gradient-angle'&&l?.type==='gradient'&&!l.locked){const length=Math.hypot((l.x2-l.x1)*p.w,(l.y2-l.y1)*p.h)||p.h*.5,cx=(l.x1+l.x2)/2,cy=(l.y1+l.y2)/2,r=value*Math.PI/180,dx=Math.cos(r)*length/2/p.w,dy=Math.sin(r)*length/2/p.h;l.x1=cx-dx;l.y1=cy-dy;l.x2=cx+dx;l.y2=cy+dy;}else if(key==='gradient-length'&&l?.type==='gradient'&&!l.locked){const dx=l.x2-l.x1,dy=l.y2-l.y1,dist=Math.hypot(dx,dy)||1;l.x1=l.x2-dx/dist*value/100;l.y1=l.y2-dy/dist*value/100;}else{p[key]=value;photo=['intensity','preset'].includes(key);}syncGradientPreview();scheduleSave();requestPaint(photo);}
function syncControls(key,value,source){
 $$('[data-prop]').filter(el=>el.dataset.prop===key).forEach(el=>{if(el!==source)el.value=value;if(el.type==='range')el.style.setProperty('--fill',`${(Number(value)-Number(el.min))/(Number(el.max)-Number(el.min))*100}%`);});
 $$('[data-hex]').filter(el=>el.dataset.hex===key).forEach(el=>{if(el!==source)el.value=String(value).toUpperCase();});
 $$('[data-color-prop]').filter(el=>el.dataset.colorProp===key).forEach(el=>{const active=el.dataset.value.toLowerCase()===String(value).toLowerCase();el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
 syncGradientPreview();
}

function resizeDocument(w,h){w=Math.round(w);h=Math.round(h);if(!Number.isFinite(w)||!Number.isFinite(h)||w<128||h<128||w>4096||h>4096){toast('Ukuran kanvas harus 128-4096 piksel per sisi.',true);return;}const sx=w/p.w,sy=h/p.h;for(const l of p.layers){if(l.type==='gradient')continue;l.x*=sx;l.y*=sy;l.w*=sx;if(l.type==='text'){l.size=E.clamp(l.size*sx,4,1500);l.spacing=E.clamp(l.spacing*sx,-100,300);l.shadow=E.clamp(l.shadow*sx,0,150);l.stroke=E.clamp(l.stroke*sx,0,50);}else l.h*=sx;}p.w=w;p.h=h;preview=null;renderer.invalidate();resetView();commit();refreshUI();requestPaint(true);}
function startTyping(){
 const l=sel();if(!l||l.type!=='text')return;if(l.locked){toast('Buka kunci layer sebelum mengedit.');return;}
 if(typing)return;typingView={zoom:view.zoom,panX:view.panX,panY:view.panY};visualTransition();
 closePanel(true);typing=true;$('#typing').hidden=false;view.zoom=1;view.panX=0;view.panY=0;
 $('#text-input').value=l.text;$('#typing-count').textContent=l.text.length;updateToolbar();
 // Synchronous focus retains the user-activation needed for the iOS keyboard.
 $('#text-input').focus({preventScroll:true});$('#text-input').setSelectionRange(l.text.length,l.text.length);requestPaint();
}
function finishTyping(){
 if(!typing)return;visualTransition();typing=false;$('#text-input').blur();$('#typing').hidden=true;
 if(typingView){Object.assign(view,typingView);typingView=null;}
 const l=sel();if(l?.type==='text'&&!l.text.trim()){p.layers=p.layers.filter(x=>x.id!==l.id);selection=null;}
 commit();updateToolbar();requestPaint();
}

function createText(){if(p.layers.length>=80){toast('Maksimal 80 layer per proyek.',true);return;}finishTyping();const l=E.textLayer(p,'');l.y=p.h*.45;p.layers.push(l);selection=l.id;mode='design';updateToolbar();startTyping();}
function addGradient(){if(p.layers.length>=80)return;finishTyping();const l=E.gradientLayer();const firstText=p.layers.findIndex(x=>x.type==='text');p.layers.splice(firstText<0?p.layers.length:firstText,0,l);selection=l.id;mode='photo';commit();openPanel('gradient');requestPaint();}
function duplicateLayer(){const l=sel();if(!l)return;if(p.layers.length>=80){toast('Maksimal 80 layer.',true);return;}const n=E.copy(l);n.id=E.uid();n.locked=false;if(n.type!=='gradient'){n.x+=p.w*.025;n.y+=p.h*.025;}p.layers.splice(p.layers.indexOf(l)+1,0,n);selection=n.id;commit();if(panel)openPanel(panel);updateToolbar();requestPaint();}
function deleteLayer(){const l=sel();if(!l)return;if(l.locked){toast('Buka kunci layer sebelum menghapus.');return;}p.layers=p.layers.filter(x=>x.id!==selection);selection=null;commit();if(panel==='layers')openPanel('layers');else closePanel();requestPaint();toast('Layer dihapus. Undo untuk mengembalikan.');}
function gradientDirection(direction){const l=sel();if(!l||l.type!=='gradient'||l.locked)return;const dirs={bottom:[.5,.35,.5,1],top:[.5,.65,.5,0],left:[.65,.5,0,.5],right:[.35,.5,1,.5]};const a=dirs[direction];[l.x1,l.y1,l.x2,l.y2]=a;l.name=direction[0].toUpperCase()+direction.slice(1)+' fade';commit();openPanel('gradient');requestPaint();}
async function enterProject(project){p=project;selection=null;mode='photo';panel='';stopSheet();sheetState.closing=false;motionFrom=null;typingView=null;lastToolbarKey='';typing=false;$('#typing').hidden=true;$('#panel').hidden=true;preview=null;rawPreview=null;renderer.invalidate();await renderer.prepare(p);history=[JSON.stringify(p)];historyIndex=0;$('#home').hidden=true;$('#editor').hidden=false;$('#editor').classList.remove('panel-visible');$('#editor').scrollTop=0;$('#editor').scrollLeft=0;const ambient=renderer.assets.get(p.photo?.asset)?.data;$('#ambient').style.backgroundImage=ambient?`url("${ambient}")`:'';view.fitted=false;document.body.style.overflow='hidden';dirty=false;setSaveStatus('Tersimpan di perangkat');resetView();refreshUI();requestPaint(true);}
async function demo(kind='palm'){
 busy(true,'Membuka ruang kreatif...');
 try{
  await saveCurrent();const assetName=kind==='portrait'?'portrait':kind==='architecture'?'demo':'palm';let data=window.FRAME_SAMPLE_DATA?.[assetName];
  if(!data&&assetName==='demo')data=window.FRAME_DEMO_DATA;
  if(!data){const response=await fetch(`assets/${assetName}.jpg`);if(!response.ok)throw new Error('Contoh belum tersedia. Buka foto sendiri.');data=await fileData(await response.blob());}
  const id=E.uid();renderer.addAsset({id,kind:'image',name:'FRAME example / '+assetName,data});
  const project=E.project(id,1080,1920);project.name=kind==='portrait'?'Portrait notes':kind==='architecture'?'Perspective':'Golden hour';project.preset='original';project.intensity=100;
  const grad=E.gradientLayer();grad.opacity=kind==='portrait'?46:27;grad.y1=.4;project.layers.push(grad);
  const title=E.textLayer(project,kind==='portrait'?'Good photos.\nBetter stories.':kind==='architecture'?'A different\nperspective.':'Somewhere,\nslow.');
  Object.assign(title,{x:110,y:kind==='portrait'?950:825,w:880,size:kind==='portrait'?116:132,spacing:-4,lineHeight:.98,font:'Georgia',italic:kind!=='portrait',align:kind==='palm'?'center':'left',color:'#ffffff'});
  const sub=E.textLayer(project,'A LITTLE SPACE TO CREATE');Object.assign(sub,{x:114,y:kind==='portrait'?1250:1130,w:850,size:18,font:'Arial',spacing:4,align:kind==='palm'?'center':'left',color:'#ffffff'});
  project.layers.push(title,sub);await enterProject(project);mode='photo';updateToolbar();scheduleSave();
 }catch(e){report(e);}finally{busy(false);}
}
function fileData(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(new Error('File tidak dapat dibaca.'));r.readAsDataURL(blob);});}
async function addImageAsset(file){if(!file)throw new Error('Pilih file foto.');if(file.size>30*1024*1024)throw new Error('Foto maksimal 30 MB. Gunakan versi lebih kecil.');let mime=file.type;if(!/^image\/(jpeg|png|webp|avif|gif)$/.test(mime)){const ext=file.name?.split('.').pop().toLowerCase();mime=({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',avif:'image/avif',gif:'image/gif'})[ext];if(!mime)throw new Error('Gunakan JPG, PNG, WebP, atau AVIF. HEIC belum didukung di versi ini.');file=new Blob([file],{type:mime});}const id=E.uid(),data=await fileData(file);renderer.addAsset({id,kind:'image',name:file.name||'Photo',data});const im=await renderer.image(id);if(im.naturalWidth*im.naturalHeight>60000000)throw new Error('Foto di atas 60 megapiksel terlalu besar untuk versi ini.');return{id,im};}
async function importPhoto(file){if(!file)return;busy(true);try{const {id,im}=await addImageAsset(file);if(photoAction==='replace'&&p){p.photo={asset:id,zoom:1,offsetX:0,offsetY:0,rotation:0};$('#ambient').style.backgroundImage=`url("${renderer.assets.get(id).data}")`;renderer.invalidate();commit();requestPaint(true);}else{await saveCurrent();const scale=Math.min(1,2160/Math.max(im.naturalWidth,im.naturalHeight)),w=Math.max(128,Math.round(im.naturalWidth*scale)),h=Math.max(128,Math.round(im.naturalHeight*scale));const project=E.project(id,w,h);project.name=(file.name||'Foto baru').replace(/\.[^.]+$/,'').slice(0,80);await enterProject(project);scheduleSave();}toast('Foto siap diedit.');}catch(e){report(e);}finally{busy(false);$('#photo-input').value='';photoAction='new';}}
let replacingLayer=false;
async function importImageLayer(file){if(!file||!p)return;busy(true,'Menambahkan gambar...');try{const {id,im}=await addImageAsset(file),old=replacingLayer?sel():null;if(old?.type==='image'){old.asset=id;old.h=old.w*im.naturalHeight/im.naturalWidth;}else{if(p.layers.length>=80)throw new Error('Maksimal 80 layer.');const w=p.w*.55,h=w*im.naturalHeight/im.naturalWidth;const l={id:E.uid(),type:'image',asset:id,name:file.name||'Gambar',x:(p.w-w)/2,y:(p.h-h)/2,w,h,rotation:0,opacity:100,visible:true,locked:false};p.layers.push(l);selection=l.id;mode='design';}commit();closePanel();requestPaint();toast('Gambar ditambahkan.');}catch(e){report(e);}finally{busy(false);$('#layer-input').value='';replacingLayer=false;}}
let pendingFontZip=null;
const FONT_LIMIT=30;
function fontMime(bytes){
  if(bytes.byteLength<12)throw new Error('File font kosong atau rusak.');
  const sig=new DataView(bytes.buffer,bytes.byteOffset,4).getUint32(0);
  const mime=({65536:'font/ttf',0x4f54544f:'font/otf',0x774f4646:'font/woff',0x774f4632:'font/woff2'})[sig];
  if(!mime)throw new Error('Bukan file TTF, OTF, WOFF, atau WOFF2 yang valid.');
  return mime;
}
async function importFontFiles(input){
  const files=Array.from(input||[]);if(!files.length||!p)return;
  const zip=files.filter(f=>/\.zip$/i.test(f.name)||/zip/i.test(f.type));
  if(zip.length){
    if(files.length!==1){toast('Pilih satu ZIP dulu, atau beberapa file font langsung.',true);$('#font-input').value='';return;}
    await inspectFontZip(zip[0]);return;
  }
  busy(true,'Menyiapkan font...','Font tetap di perangkat, tidak diunggah.');
  try{
    if(files.length>FONT_LIMIT-p.fonts.length)throw new Error(`Ruang tersisa untuk ${FONT_LIMIT-p.fonts.length} font. Maksimal 30 font impor per proyek.`);
    const candidates=[],errors=[];
    for(const file of files){if(!/\.(ttf|otf|woff2?)$/i.test(file.name)||file.size>5*1024*1024){errors.push({name:file.name,reason:'Format tidak didukung atau lebih dari 5 MB'});continue;}candidates.push({name:file.name,bytes:new Uint8Array(await file.arrayBuffer())});}
    await addFontBatch(candidates,errors,files.length===1);
  }catch(e){report(e);}finally{busy(false);$('#font-input').value='';}
}
async function inspectFontZip(file){
  if(p.fonts.length>=FONT_LIMIT){toast('Proyek ini sudah berisi 30 font impor.',true);$('#font-input').value='';return;}
  busy(true,'Membaca paket font...','Hanya daftar font yang dibaca. Belum mengubah desain.');
  try{
    const scan=await FrameFontZip.scan(file);
    if(!scan.entries.length)throw new Error(scan.skipped.length?'Tidak ada font yang bisa dibuka. Gunakan ZIP biasa tanpa password; maksimal 5 MB per font.':'ZIP ini tidak berisi TTF, OTF, WOFF, atau WOFF2.');
    const capacity=FONT_LIMIT-p.fonts.length;
    pendingFontZip={file,scan,projectId:p.id,capacity};
    modal('Font dari ZIP',`<div class="zip-heading"><span class="zip-symbol">${icon('archive')}</span><div><strong>${esc(file.name)}</strong><small>${scan.entries.length} font ditemukan &middot; ${(file.size/1024/1024).toFixed(1)} MB</small></div></div><div class="zip-tools"><span class="zip-count" id="zip-count"></span><button class="text-button" data-action="zip-select-toggle">Pilih semua</button></div><div class="zip-list">${scan.entries.map((entry,i)=>`<label class="zip-row"><input type="checkbox" class="zip-font-check" value="${entry.index}" ${i<capacity?'checked':''}><span><strong>${esc(entry.name.replace(/\.[^.]+$/,''))}</strong><small>${Math.round(entry.size/1024)} KB${entry.path!==entry.name?' &middot; '+esc(entry.path.slice(0,-entry.name.length)):''}</small></span><em>${esc(entry.name.split('.').pop().toUpperCase())}</em></label>`).join('')}</div>${scan.ignored||scan.skipped.length?`<p class="small muted">${scan.ignored+scan.skipped.length} file non-font atau tidak didukung dilewati. Folder di dalam ZIP ikut diperiksa.</p>`:''}<p class="zip-limit">Pilih sampai ${capacity} font. Maksimal 5 MB per font dan 30 MB total. Desain tidak berubah sampai lo memilih fontnya.</p><button id="zip-confirm" class="primary full" data-action="zip-import-selected"></button><button class="text-button" style="width:100%" data-action="close-modal">Batal</button>`);
    updateZipSelection();
  }catch(e){report(e);}finally{busy(false);$('#font-input').value='';}
}
function updateZipSelection(){
  if(!pendingFontZip||!$('#zip-confirm'))return;
  const selected=$$('.zip-font-check:checked'),allowed=pendingFontZip.capacity;
  const set=new Set(selected.map(el=>Number(el.value)));
  const total=pendingFontZip.scan.entries.filter(e=>set.has(e.index)).reduce((n,e)=>n+e.size,0);
  $('#zip-count').textContent=`${selected.length} dipilih / ${allowed} tersedia`;
  $('#zip-confirm').textContent=`Tambahkan ${selected.length} font`;
  $('#zip-confirm').disabled=!selected.length||selected.length>allowed||total>30*1024*1024;
  $('[data-action="zip-select-toggle"]').textContent=selected.length?'Hapus pilihan':'Pilih semua';
}
async function confirmFontZip(){
  const pending=pendingFontZip;if(!pending||pending.projectId!==p?.id)return;
  const selected=$$('.zip-font-check:checked').map(el=>Number(el.value));
  if(!selected.length||selected.length>FONT_LIMIT-p.fonts.length)return;
  closeModal();pendingFontZip=null;
  busy(true,'Menambahkan font...','Mengekstrak pilihan lo di perangkat.');
  try{const result=await FrameFontZip.extract(pending.file,selected);await addFontBatch(result.files,result.errors,false);}catch(e){report(e);}finally{busy(false);}
}
async function addFontBatch(files,errors=[],applySingle=false){
  const imported=[],duplicates=[];const current=p;
  for(let i=0;i<files.length;i++){
    const file=files[i];$('#busy-note').textContent=`Memuat ${i+1} dari ${files.length}: ${file.name}`;
    try{
      if(current!==p)throw new Error('Proyek berubah. Impor dibatalkan.');
      if(p.fonts.length>=FONT_LIMIT)throw new Error('Batas 30 font per proyek');
      if(file.bytes.length>5*1024*1024)throw new Error('Font lebih dari 5 MB');
      const mime=fontMime(file.bytes),data=await fileData(new Blob([file.bytes],{type:mime}));
      const payload=data.slice(data.indexOf(',')+1);
      if(p.fonts.some(f=>{const saved=renderer.assets.get(f.asset)?.data;return saved&&saved.slice(saved.indexOf(',')+1)===payload;})){duplicates.push(file.name);continue;}
      const id=E.uid(),family='FRAME_'+id.replace(/-/g,'_'),name=file.name.replace(/\.[^.]+$/,'').slice(0,240);
      const face=new FontFace(family,file.bytes.buffer.slice(file.bytes.byteOffset,file.bytes.byteOffset+file.bytes.byteLength));
      let timer;
      try{await Promise.race([face.load(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Font terlalu lama dimuat')),12000);})]);}finally{clearTimeout(timer);}
      document.fonts.add(face);renderer.loadedFonts.add(family);renderer.addAsset({id,kind:'font',name,data});
      const f={family,name,asset:id};p.fonts.push(f);imported.push(f);await raf();
    }catch(e){errors.push({name:file.name,reason:e.message||'Font rusak atau tidak didukung'});}
  }
  if(imported.length){if(applySingle&&sel()?.type==='text'&&!sel().locked)sel().font=imported[0].family;commit();}
  openPanel('fonts');renderFontLibrary();requestPaint();busy(false);
  if(errors.length){
    modal(imported.length?`${imported.length} font ditambahkan`:'Ada font yang belum masuk',`<p>${duplicates.length?duplicates.length+' font duplikat dilewati. ':''}Font yang berhasil sudah tersedia di daftar. File yang tidak valid tidak mengubah desain.</p><div class="import-results">${errors.map(e=>`<p><strong>${esc(e.name)}</strong><br>${esc(e.reason)}</p>`).join('')}</div><button class="primary full" data-action="close-modal">Kembali ke font</button>`);
  }else if(imported.length){toast(`${imported.length} font siap dipakai.${duplicates.length?' '+duplicates.length+' duplikat dilewati.':''}`);}
  else if(duplicates.length){toast('Semua font ini sudah ada. Tidak ditambahkan dua kali.');}
}

async function home(force=false){closeFontLibrary(true);finishTyping();closeModal();await saveCurrent();if(dirty&&!dbOK&&!force){modal('Draft belum tersimpan',`<p>Browser ini belum berhasil menyimpan proyek. Buat backup .frame sebelum keluar agar editan tidak hilang.</p><button class="primary full" data-action="backup">${icon('download')} Simpan backup</button><button class="secondary full" data-action="close-modal">Kembali mengedit</button><button class="text-button" data-action="home-force">Keluar tanpa menyimpan draft</button>`);return;}$('#editor').hidden=true;$('#home').hidden=false;document.body.style.overflow='';await renderRecent();}
async function renderRecent(){let rows=[];try{rows=await store.all();dbOK=true;}catch(e){dbOK=false;console.warn(e);}$('#recent-projects').innerHTML=rows.length?rows.map(row=>`<article class="recent-card"><button class="open-project" data-action="open-project" data-id="${esc(row.id)}">${row.thumbnail?`<img src="${esc(row.thumbnail)}" alt="Pratinjau ${esc(row.name)}" loading="lazy">`:''}<span class="recent-card-info"><strong>${esc(row.name)}</strong><small>${row.w} x ${row.h} &middot; ${new Date(row.updated).toLocaleDateString('id-ID',{day:'numeric',month:'short'})}</small></span></button><button class="icon-button" data-action="delete-project-confirm" data-id="${esc(row.id)}" aria-label="Hapus proyek ${esc(row.name)}">${icon('trash')}</button></article>`).join(''):`<div class="empty-projects">${icon('layers')}<div><strong>${dbOK?'Belum ada proyek. Mulai satu cerita.':'Penyimpanan lokal belum tersedia.'}</strong><p>${dbOK?'Editan tersimpan otomatis di browser ini.':'Editing tetap bisa. Simpan backup .frame sebelum menutup.'}</p></div></div>`;}
async function loadProject(id){busy(true,'Membuka proyek...');try{const row=await store.get('projects',id);if(!row)throw new Error('Proyek tidak ditemukan di browser ini.');for(const aid of E.assetIds(row.project)){const a=await store.get('assets',aid);if(!a)throw new Error('Aset proyek hilang. Pulihkan dari backup .frame.');renderer.addAsset(a);}await enterProject(E.copy(row.project));}catch(e){report(e);}finally{busy(false);}}
let modalFocus=null;
function modal(title,html){modalAnimation?.cancel();++modalEpoch;finishTyping();modalFocus=document.activeElement;$('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="modal-header"><h2>${esc(title)}</h2><button class="icon-button" data-action="close-modal" aria-label="Tutup">${icon('close')}</button></header>${html}</section></div>`;$('#app').inert=true;setTimeout(()=>$('.modal button, .modal input')?.focus({preventScroll:true}),10);}
function closeModal(){
 pendingFontZip=null;const root=$('#modal-root'),dialog=$('.modal'),epoch=++modalEpoch;modalAnimation?.cancel();
 $('#app').inert=false;modalFocus?.focus?.({preventScroll:true});modalFocus=null;
 const finish=()=>{if(epoch===modalEpoch)root.innerHTML='';};
 if(!dialog||reducedMotion.matches){finish();return;}
 dialog.parentElement.style.pointerEvents='none';dialog.inert=true;dialog.style.animation='none';
 modalAnimation=dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(20px)'}],{duration:150,easing:'ease-out',fill:'forwards'});
 modalAnimation.onfinish=finish;
}
function exportModal(){if(!p)return;finishTyping();exportFormat='png';exportFactor=1;let previewSrc='';try{const c=document.createElement('canvas');c.width=160;c.height=Math.round(160*p.h/p.w);const ctx=c.getContext('2d');ctx.scale(160/p.w,160/p.w);renderer.compose(ctx,p,preview);previewSrc=c.toDataURL();}catch(_){}modal('Siap dibagikan.',`<div class="export-preview"><img src="${previewSrc}" alt="Pratinjau hasil akhir"></div><label class="field-label">FORMAT FILE</label><div class="row equal">${choice('PNG','export-png',true)}${choice('JPG','export-jpeg')}</div><label class="field-label" for="export-size">UKURAN HASIL</label><select id="export-size">${exportSizes().map(([factor,label])=>`<option value="${factor}">${label}</option>`).join('')}</select><div id="jpeg-quality-wrap" hidden>${control('Kualitas JPG','export-quality',92,65,100,1,'%')}</div><div class="export-dims"><span>Tanpa watermark</span><strong id="export-dimensions">${p.w} x ${p.h} px</strong></div><button class="primary full" data-action="do-export">${icon('download')} Buat gambar</button><p class="small muted">Resolusi lebih besar tidak menambah detail foto sumber. Teks tetap dirender tajam.</p>`);}
function exportSizes(){const max=Math.max(p.w,p.h),a=[[1,`Ukuran kanvas - ${p.w} x ${p.h}`]],factors=[1080/max,2160/max,4096/max];for(const f of factors){const w=Math.round(p.w*f),h=Math.round(p.h*f);if(Math.abs(f-1)<.001||a.some(x=>Math.abs(x[0]-f)<.001))continue;a.push([f,`${Math.max(w,h)} px sisi panjang - ${w} x ${h}`]);}return a;}
let exportQuality=.92;
async function doExport(){if(!p)return;busy(true,'Merender hasil akhir...','Font, gradient, dan foto dirender pada ukuran ekspor.');try{const cp=E.copy(p),w=Math.round(cp.w*exportFactor),h=Math.round(cp.h*exportFactor);if(Math.max(w,h)>4096||w*h>17000000)throw new Error('Ukuran ekspor terlalu besar. Pilih resolusi lebih kecil.');await raf();const c=await renderer.render(cp,w,h);exportBlob=await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Memori tidak cukup. Turunkan resolusi ekspor.')),exportFormat==='png'?'image/png':'image/jpeg',exportQuality));exportName=(cp.name.replace(/[^\p{L}\p{N}_ -]/gu,'').trim()||'FRAME').slice(0,70)+`-${w}x${h}.${exportFormat==='png'?'png':'jpg'}`;const url=URL.createObjectURL(exportBlob);modal('Gambar siap.',`<div class="export-preview" style="height:220px"><img src="${url}" alt="Hasil ekspor"></div><div class="export-dims"><span>${w} x ${h} px</span><strong>${(exportBlob.size/1024/1024).toFixed(2)} MB</strong></div><button class="primary full" data-action="download-export">${icon('download')} Simpan gambar</button>${navigator.share?`<button class="secondary full" data-action="share-export">${icon('share')} Bagikan ke aplikasi</button>`:''}<button class="text-button" style="width:100%" data-action="close-modal">Kembali mengedit</button><p class="small muted">Di HP, gunakan Simpan gambar atau menu Bagikan. Lokasi penyimpanan mengikuti browser.</p>`);$('.modal img').onload=()=>URL.revokeObjectURL(url);await saveCurrent();}catch(e){report(e);}finally{busy(false);requestPaint(true);}}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function shareExport(){if(!exportBlob)return;try{const file=new File([exportBlob],exportName,{type:exportBlob.type});if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'FRAME'});else{download(exportBlob,exportName);toast('File disimpan. Browser ini belum mendukung berbagi gambar langsung.');}}catch(e){if(e.name!=='AbortError')report(e);}}
async function backup(){if(!p)return;finishTyping();const raw={app:'FRAME',version:1,project:E.copy(p),assets:E.assetIds(p).map(id=>renderer.assets.get(id)).filter(Boolean)};const blob=new Blob([JSON.stringify(raw)],{type:'application/json'});download(blob,(p.name.replace(/[^a-zA-Z0-9_-]+/g,'-')||'FRAME')+'.frame');toast('Backup dibuat. Simpan file .frame di tempat aman.');}
async function importBackup(file){if(!file)return;busy(true,'Membuka backup...');try{if(file.size>150*1024*1024)throw new Error('Backup maksimal 150 MB.');const raw=E.validate(JSON.parse(await file.text()));await saveCurrent();raw.assets.forEach(a=>renderer.addAsset(a));raw.project.id=E.uid();await enterProject(raw.project);scheduleSave();toast('Backup dibuka sebagai proyek baru.');}catch(e){report(e);}finally{busy(false);$('#project-input').value='';}}
function projectMenu(){if(!p)return;modal('Proyek',`<label class="field-label" for="rename-project">NAMA PROYEK</label><div class="row"><input id="rename-project" class="text-field" maxlength="80" value="${esc(p.name)}"><button class="primary" data-action="rename">Simpan</button></div><p><span class="status-chip">${icon('lock')} Penyimpanan lokal</span></p><button class="project-menu-btn" data-action="backup">Simpan backup .frame ${icon('download')}</button><button class="project-menu-btn" data-action="duplicate-project">Duplikat proyek ${icon('duplicate')}</button><button class="project-menu-btn" data-action="help">Panduan singkat ${icon('help')}</button><p>Draft disimpan di browser ini, bukan cloud. Menghapus data browser dapat menghapus proyek. Backup menyertakan foto, layer, dan font impor.</p>`);}
function help(){modal('Ruang kecil. Ide besar.',`<span class="eyebrow">FRAME / PHOTO + TYPE / V0.3.1</span>${[['image','Mulai dari foto','Buka JPG, PNG, WebP, atau AVIF. Editan tidak dikirim ke server.'],['text','Teks langsung di foto','Ketuk Teks, tulis, lalu Selesai. Ketuk dua kali tulisan untuk mengedit lagi.'],['position','Geser & atur','Satu jari menggeser objek. Handle sudut mengubah ukuran. Dua jari khusus zoom kanvas.'],['layers','Tetap bisa diubah','Foto, gradient, dan teks tetap terpisah. Undo mengembalikan satu tindakan.'],['download','Jangan lupa backup','Ekspor PNG/JPG untuk gambar jadi. Backup .frame untuk melanjutkan editing nanti.']].map(([i,t,d])=>`<div class="help-item">${icon(i)}<div><strong>${t}</strong><p>${d}</p></div></div>`).join('')}<p>Font bawaan memakai font sistem; tampilan dapat berbeda antarpiranti. Font impor, termasuk dari ZIP, tersimpan bersama proyek. Untuk offline/PWA, situs perlu dimuat dari HTTPS dan cache harus selesai terpasang. Dukungan bergantung pada browser.</p><p><span class="shortcut">Ctrl / Cmd + Z</span> Undo &nbsp; <span class="shortcut">Delete</span> Hapus layer</p><button class="primary full" data-action="close-modal">Oke, mulai berkarya</button>`);}
async function action(a,button){
 if(a.startsWith('panel-')){openPanel(a.slice(6));return;}
 if(a.startsWith('weight-')){const l=sel();if(l&&!l.locked){l.weight=Number(a.slice(7));commit();openPanel('type');requestPaint();}return;}
 if(a.startsWith('align-')){const l=sel();if(l&&!l.locked){l.align=a.slice(6);commit();openPanel(panel||'type');requestPaint();}return;}
 if(a.startsWith('gradient-')&&['bottom','top','left','right'].includes(a.slice(9))){gradientDirection(a.slice(9));return;}
 switch(a){
 case 'open-font-library':openFontLibrary();break;
 case 'close-font-library':closeFontLibrary();break;
 case 'font-filter':fontLibraryTab=button.dataset.value;renderFontLibrary();break;
 case 'import-font-file':$('#font-input').accept='.ttf,.otf,.woff,.woff2';$('#font-input').multiple=true;$('#font-input').click();break;
 case 'import-font-zip':$('#font-input').accept='.zip,application/zip';$('#font-input').multiple=false;$('#font-input').click();break;
 case 'search-projects':{const el=$('.home-search');el.hidden=!el.hidden;if(!el.hidden)$('#project-search').focus();break;}
 case 'show-projects':$('#projects-section').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});break;
 case 'home-top':window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});break;
 case 'new-photo':photoAction='new';$('#photo-input').click();break;
 case 'replace-photo':photoAction='replace';$('#photo-input').click();break;
 case 'add-image':replacingLayer=false;$('#layer-input').click();break;
 case 'replace-layer':if(sel()?.locked){toast('Buka kunci layer dulu.');break;}replacingLayer=true;$('#layer-input').click();break;
 case 'demo':await demo(button.dataset.demo||'palm');break;
 case 'home':if(typing){finishTyping();break;}await home();break;
 case 'home-force':await home(true);break;
 case 'help':help();break;
 case 'project':projectMenu();break;
 case 'close-modal':closeModal();break;
 case 'close-panel':closePanel();break;
 case 'undo':historyMove(-1);break;
 case 'redo':historyMove(1);break;
 case 'fit':visualTransition();view.fitted=!view.fitted;resetView();break;
 case 'deselect':finishTyping();selection=null;closePanel();requestPaint();break;
 case 'expand-panel':sheetExpansion(!sheetState.expanded);break;
 case 'mode-photo':case 'mode-design':finishTyping();mode=a==='mode-photo'?'photo':'design';selection=null;closePanel();requestPaint();break;
 case 'add-text':createText();break;
 case 'edit-text':startTyping();break;
 case 'typing-done':finishTyping();break;
 case 'add-gradient':addGradient();break;
 case 'duplicate':duplicateLayer();break;
 case 'delete':deleteLayer();break;
 case 'lock-selected':{const l=sel();if(l){l.locked=!l.locked;commit();openPanel('more');requestPaint();}break;}
 case 'italic':{const l=sel();if(l&&!l.locked){l.italic=!l.italic;commit();openPanel('type');requestPaint();}break;}
 case 'preset':p.preset=button.dataset.value;commit();$$('.preset').forEach(b=>b.classList.toggle('active',b.dataset.value===p.preset));requestPaint(true);break;
 case 'adjust-control':adjustSelected[adjustTab]=button.dataset.value;openPanel('adjust');break;
 case 'adjust-tab':adjustTab=button.dataset.value;openPanel('adjust');break;
 case 'reset-adjust':p.adjust=E.copy(E.DEFAULT_ADJUST);commit();openPanel('adjust');requestPaint(true);break;
 case 'reset-tone':p.adjust=E.copy(E.DEFAULT_ADJUST);p.preset='original';p.intensity=100;commit();openPanel('presets');requestPaint(true);toast('Tone kembali ke foto asli.');break;
 case 'choose-font':{const l=sel();if(l&&!l.locked){l.font=button.dataset.value;commit();if($('#font-list'))$('#font-list').innerHTML=quickFonts();renderFontLibrary();requestPaint();}break;}
 case 'import-font':$('#font-input').accept='.ttf,.otf,.woff,.woff2,.zip';$('#font-input').multiple=true;$('#font-input').click();break;
 case 'zip-import-selected':await confirmFontZip();break;
 case 'zip-select-toggle':{const checks=$$('.zip-font-check'),any=checks.some(c=>c.checked);checks.forEach((c,i)=>c.checked=!any&&i<(pendingFontZip?.capacity||0));updateZipSelection();break;}
 case 'swatch':{const key=button.dataset.colorProp||'l.color';if(sel()?.locked){toast('Buka kunci layer dulu.');break;}applyProp(key,button.dataset.value);syncControls(key,button.dataset.value,button);commit();break;}
 case 'gradient-mode':{const l=sel();if(!l||l.locked)break;l.gradientMode=button.dataset.value==='duotone'?'duotone':'fade';l.startColor=l.startColor||'#799dff';gradientStop='end';commit();openPanel('gradient');requestPaint();break;}
 case 'gradient-stop':gradientStop=button.dataset.value;openPanel('gradient');break;
 case 'gradient-swap':{const l=sel();if(!l||l.locked)break;if(l.gradientMode==='duotone'){const start=l.startColor||l.color;l.startColor=l.color;l.color=start;}else{[l.x1,l.y1,l.x2,l.y2]=[l.x2,l.y2,l.x1,l.y1];}commit();openPanel('gradient');requestPaint();break;}
 case 'center-x':case 'center-y':{const l=sel();if(l&&l.type!=='gradient'&&!l.locked){const box=layerBox(l),center=rotatePoint(box.w/2,box.h/2,l.rotation||0);if(a==='center-x')l.x=p.w/2-center.x;else l.y=p.h/2-center.y;commit();openPanel('position');requestPaint();}break;}
 case 'reset-rotation':if(sel()&&!sel().locked){sel().rotation=0;commit();openPanel('position');requestPaint();}break;
 case 'reset-crop':if(p.photo){Object.assign(p.photo,{zoom:1,offsetX:0,offsetY:0,rotation:0});commit();openPanel('crop');requestPaint(true);}break;
 case 'ratio':resizeDocument(Number(button.dataset.w),Number(button.dataset.h));break;
 case 'custom-size':resizeDocument(Number($('#custom-width').value),Number($('#custom-height').value));break;
 case 'layer-select':selection=button.dataset.id;mode=sel()?.type==='gradient'?'photo':'design';openPanel('layers');requestPaint();break;
 case 'layer-visible':{const l=p.layers.find(x=>x.id===button.dataset.id);if(l){l.visible=!l.visible;commit();openPanel('layers');requestPaint();}break;}
 case 'layer-lock':{const l=p.layers.find(x=>x.id===button.dataset.id);if(l){l.locked=!l.locked;commit();openPanel('layers');requestPaint();}break;}
 case 'layer-up':case 'layer-down':{const i=p.layers.findIndex(x=>x.id===selection),n=i+(a==='layer-up'?1:-1);if(i>=0&&n>=0&&n<p.layers.length&&!sel().locked){[p.layers[i],p.layers[n]]=[p.layers[n],p.layers[i]];commit();openPanel('layers');requestPaint();}break;}
 case 'open-project':await loadProject(button.dataset.id);break;
 case 'delete-project-confirm':{const row=await store.get('projects',button.dataset.id);if(row)modal('Proyek dihapus?',`<p>Hapus <strong>${esc(row.name)}</strong> dari browser ini? Simpan backup dulu bila masih dibutuhkan.</p><button class="secondary full danger-button" data-action="delete-project" data-id="${esc(row.id)}">${icon('trash')} Hapus proyek</button><button class="primary full" data-action="close-modal">Batalkan</button>`);break;}
 case 'delete-project':await store.remove(button.dataset.id);closeModal();await renderRecent();toast('Proyek dihapus dari perangkat.');break;
 case 'rename':p.name=$('#rename-project').value.trim().slice(0,80)||'Untitled';commit();refreshUI();closeModal();toast('Nama proyek disimpan.');break;
 case 'duplicate-project':{const next=E.copy(p);await saveCurrent();next.id=E.uid();next.name=(next.name+' - copy').slice(0,80);closeModal();await enterProject(next);scheduleSave();toast('Salinan proyek dibuat.');break;}
 case 'backup':await backup();break;
 case 'import-project':$('#project-input').click();break;
 case 'export':exportModal();break;
 case 'export-png':case 'export-jpeg':exportFormat=a==='export-png'?'png':'jpeg';$$('.modal [data-action^="export-"]').forEach(b=>b.classList.toggle('active',b.dataset.action===a));$('#jpeg-quality-wrap').hidden=exportFormat!=='jpeg';break;
 case 'do-export':await doExport();break;
 case 'download-export':if(exportBlob){download(exportBlob,exportName);toast('Gambar siap disimpan oleh browser.');}break;
 case 'share-export':await shareExport();break;
 }
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;action(b.dataset.action,b).catch(report);});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='project-search'){const q=t.value.toLowerCase();$$('.recent-card').forEach(c=>c.hidden=!c.textContent.toLowerCase().includes(q));return;}if(t.id==='library-search'){renderFontLibrary();return;}if(t.id==='text-input'){const l=sel();if(l?.type==='text'){l.text=t.value;l.name=t.value.slice(0,32);$('#typing-count').textContent=t.value.length;scheduleSave();requestPaint();}return;}if(t.id==='font-search'){$('#font-list').innerHTML=fontOptions(t.value);return;}if(t.dataset.prop){const key=t.dataset.prop;if(key==='export-quality'){exportQuality=E.clamp(Number(t.value),65,100)/100;syncControls(key,Number(t.value),t);return;}let value;if(t.type==='color')value=t.value;else{if(t.value===''||!Number.isFinite(Number(t.value)))return;value=E.clamp(Number(t.value),Number(t.min),Number(t.max));}if(sel()?.locked&&key.startsWith('l.')){t.value=readProp(key);return;}applyProp(key,value);syncControls(key,value,t);}});
document.addEventListener('change',e=>{const t=e.target;if(t.classList.contains('zip-font-check'))updateZipSelection();if(t.dataset.prop&&t.dataset.prop!=='export-quality'){if(t.type==='number'&&t.value===''){t.value=readProp(t.dataset.prop);return;}commit();}if(t.dataset.hex){const value=t.value.trim();if(/^#[0-9a-fA-F]{6}$/.test(value)){if(sel()?.locked){t.value=readProp(t.dataset.hex);toast('Buka kunci layer dulu.');return;}applyProp(t.dataset.hex,value.toLowerCase());syncControls(t.dataset.hex,value.toLowerCase(),null);commit();}else{t.value=readProp(t.dataset.hex);toast('Gunakan HEX 6 digit, misalnya #ffffff.',true);}}if(t.id==='snap-toggle')snap=t.checked;if(t.dataset.toggle&&sel()&&!sel().locked){sel()[t.dataset.toggle]=t.checked;commit();requestPaint();}if(t.id==='export-size'){exportFactor=Number(t.value);$('#export-dimensions').textContent=`${Math.round(p.w*exportFactor)} x ${Math.round(p.h*exportFactor)} px`;}});
$('#photo-input').addEventListener('change',e=>importPhoto(e.target.files[0]));$('#layer-input').addEventListener('change',e=>importImageLayer(e.target.files[0]));$('#font-input').addEventListener('change',e=>importFontFiles(e.target.files));$('#project-input').addEventListener('change',e=>importBackup(e.target.files[0]));
const interaction=$('#interaction');
function pointerPosition(e){const r=interaction.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
interaction.addEventListener('pointerdown',e=>{
 if(!p||e.button>0)return;e.preventDefault();interaction.setPointerCapture(e.pointerId);const pos=pointerPosition(e);pointers.set(e.pointerId,pos);
 if(pointers.size===2){if(gesture?.initial&&gesture.target){const l=p.layers.find(x=>x.id===gesture.target);if(l)Object.assign(l,gesture.initial);}const [a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};gesture={kind:'pinch',distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:view.zoom,anchor:docPoint(mid.x,mid.y)};requestPaint();return;}if(pointers.size>2)return;
 const pt=docPoint(pos.x,pos.y),l=sel();let handle=null;
 if(l&&!l.locked&&l.visible&&!typing){if(l.type==='gradient'){for(const [idx,point]of [{x:l.x1*p.w,y:l.y1*p.h},{x:l.x2*p.w,y:l.y2*p.h}].entries()){if(Math.hypot(point.x-pt.x,point.y-pt.y)<22/view.s)handle=idx===0?'g1':'g2';}}else{const nearest=handles(l).map(h=>({...h,d:Math.hypot(h.x-pt.x,h.y-pt.y)})).sort((a,b)=>a.d-b.d)[0];if(nearest?.d<19/view.s)handle=nearest.type;}}
 if(handle){gesture={kind:handle,target:l.id,initial:E.copy(l),box:layerBox(l),startDoc:pt,start:pos,viewSnapshot:{s:view.s,x:view.x,y:view.y,fit:view.fit},moved:false};return;}
 if(typing)finishTyping();const target=hitLayer(pt);if(target){selection=target.id;mode='design';updateToolbar();if(panel&&panel!=='presets'&&panel!=='adjust'&&panel!=='crop')openPanel(panel);gesture={kind:'move',target:target.id,initial:E.copy(target),box:layerBox(target),startDoc:pt,start:pos,viewSnapshot:{s:view.s,x:view.x,y:view.y,fit:view.fit},moved:false};}else{gesture={kind:'pan',start:pos,panX:view.panX,panY:view.panY,moved:false};}requestPaint();
});
interaction.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId)||!gesture||!p)return;e.preventDefault();const pos=pointerPosition(e);pointers.set(e.pointerId,pos);const g=gesture;
 if(g.kind==='pinch'&&pointers.size>=2){const [a,b]=[...pointers.values()],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};view.zoom=E.clamp(g.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,g.distance),1,6);const s=view.fit*view.zoom;view.panX=mid.x-(view.width-p.w*s)/2-g.anchor.x*s;view.panY=mid.y-(view.centerY-p.h*s/2)-g.anchor.y*s;requestPaint();return;}
 if(pointers.size!==1||g.kind==='pinch'||g.kind==='idle')return;if(Math.hypot(pos.x-g.start.x,pos.y-g.start.y)<3&&!g.moved)return;g.moved=true;
 if(g.kind==='pan'){if(view.zoom>1.01){view.panX=g.panX+pos.x-g.start.x;view.panY=g.panY+pos.y-g.start.y;requestPaint();}return;}
 const l=p.layers.find(x=>x.id===g.target);if(!l||l.locked)return;const pt=docPoint(pos.x,pos.y),ini=g.initial;guides={x:false,y:false};
 if(g.kind==='move'){l.x=ini.x+pt.x-g.startDoc.x;l.y=ini.y+pt.y-g.startDoc.y;if(snap){const b=layerBox(l),center=rotatePoint(b.w/2,b.h/2,l.rotation||0);if(Math.abs(l.x+center.x-p.w/2)<6/view.s){l.x=p.w/2-center.x;guides.x=true;}if(Math.abs(l.y+center.y-p.h/2)<6/view.s){l.y=p.h/2-center.y;guides.y=true;}}}
 else if(g.kind==='g1'||g.kind==='g2'){const k=g.kind==='g1'?'1':'2';l['x'+k]=E.clamp(pt.x/p.w,-1,2);l['y'+k]=E.clamp(pt.y/p.h,-1,2);}
 else if(g.kind==='width'){const v=localPoint(pt,ini);l.w=E.clamp(v.x,Math.max(20,l.size*.5),p.w*3);}
 else if(g.kind==='rotate'){const center=worldPoint(ini,g.box.w/2,g.box.h/2),a=Math.atan2(pt.y-center.y,pt.x-center.x),b=Math.atan2(g.startDoc.y-center.y,g.startDoc.x-center.x);let rot=ini.rotation+(a-b)*180/Math.PI;rot=((rot+180)%360+360)%360-180;if(snap&&Math.abs(rot%45)<3)rot=Math.round(rot/45)*45;l.rotation=rot;const v=rotatePoint(g.box.w/2,g.box.h/2,rot);l.x=center.x-v.x;l.y=center.y-v.y;}
 else {const right=g.kind.endsWith('r'),bottom=g.kind.startsWith('b'),ox=right?0:g.box.w,oy=bottom?0:g.box.h,fixed=worldPoint(ini,ox,oy),v=rotatePoint(pt.x-fixed.x,pt.y-fixed.y,-ini.rotation),dx=(right?1:-1)*g.box.w,dy=(bottom?1:-1)*g.box.h;const max=l.type==='text'?Math.min(8,1200/ini.size):8,min=l.type==='text'?Math.max(.06,8/ini.size):.06,scale=E.clamp((v.x*dx+v.y*dy)/(dx*dx+dy*dy),min,max);l.w=ini.w*scale;if(l.type==='text'){l.size=ini.size*scale;l.spacing=ini.spacing*scale;l.shadow=ini.shadow*scale;l.stroke=ini.stroke*scale;}else l.h=ini.h*scale;const origin=rotatePoint(ox*scale,oy*scale,ini.rotation);l.x=fixed.x-origin.x;l.y=fixed.y-origin.y;}
 scheduleSave();requestPaint();
});
function pointerEnd(e){if(!pointers.has(e.pointerId))return;const g=gesture;pointers.delete(e.pointerId);if(g?.kind==='pinch'){if(pointers.size)gesture={kind:'idle'};else gesture=null;requestPaint();return;}if(pointers.size)return;if(g?.moved&&g.target){commit();if(panel&&panel!=='fonts')openPanel(panel);}else if(g&&!g.moved){if(g.kind==='pan'){selection=null;closePanel();}else if(g.target){const now=performance.now();if(lastTap.id===g.target&&now-lastTap.time<340&&sel()?.type==='text'){startTyping();lastTap={id:null,time:0};}else lastTap={id:g.target,time:now};}}if(g?.viewSnapshot)visualTransition();gesture=null;guides={x:false,y:false};requestPaint();}
interaction.addEventListener('pointerup',pointerEnd);interaction.addEventListener('pointercancel',e=>{pointers.clear();if(gesture?.moved&&gesture.target)commit();gesture=null;guides={x:false,y:false};requestPaint();});interaction.addEventListener('contextmenu',e=>e.preventDefault());
interaction.addEventListener('dblclick',e=>{if(sel()?.type==='text'&&!typing){e.preventDefault();startTyping();}});
interaction.addEventListener('wheel',e=>{if(!p)return;e.preventDefault();const pos=pointerPosition(e),anchor=docPoint(pos.x,pos.y);view.zoom=E.clamp(view.zoom*Math.exp(-e.deltaY*.0015),1,6);const s=view.fit*view.zoom;view.panX=pos.x-(view.width-p.w*s)/2-anchor.x*s;view.panY=pos.y-(view.centerY-p.h*s/2)-anchor.y*s;if(view.zoom===1){view.panX=0;view.panY=0;}requestPaint();},{passive:false});
const compare=$('#compare');compare.addEventListener('pointerdown',e=>{e.preventDefault();compare.setPointerCapture(e.pointerId);before=true;compare.querySelector('span:last-child').textContent='Tanpa efek';requestPaint();});function endCompare(){before=false;compare.querySelector('span:last-child').textContent='Asli';requestPaint();}compare.addEventListener('pointerup',endCompare);compare.addEventListener('pointercancel',endCompare);compare.addEventListener('lostpointercapture',endCompare);
compare.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();before=true;requestPaint();}});compare.addEventListener('keyup',endCompare);
document.addEventListener('keydown',e=>{
 const dlg=$('.modal');if(dlg){if(e.key==='Escape'){closeModal();return;}if(e.key==='Tab'){const focusable=$$('button:not([disabled]), input, select, textarea, a[href]',dlg),first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}return;}
 if(fontLibraryOpen){if(e.key==='Escape'){closeFontLibrary();return;}if(e.key==='Tab'){const fs=$$('button:not([disabled]),input', $('#font-page')),f=fs[0],l=fs.at(-1);if(e.shiftKey&&document.activeElement===f){e.preventDefault();l?.focus();}else if(!e.shiftKey&&document.activeElement===l){e.preventDefault();f?.focus();}}return;}
 const input=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);if(e.key==='Escape'){if(fontLibraryOpen){closeFontLibrary();return;}if(typing)finishTyping();else if(panel)closePanel();else if(selection){selection=null;updateToolbar();requestPaint();}return;}if(input||!p||$('#editor').hidden)return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();historyMove(e.shiftKey?1:-1);}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();historyMove(1);}else if(['Delete','Backspace'].includes(e.key)&&selection){e.preventDefault();deleteLayer();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){const l=sel();if(l&&l.type!=='gradient'&&!l.locked){e.preventDefault();const step=e.shiftKey?10:1;l.x+=(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0);l.y+=(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0);commit();requestPaint();}}});

const sheet=$('#panel');let suppressGripClick=false;
sheet.addEventListener('pointerdown',e=>{
 if(!e.target.closest('.sheet-grip,.sheet-head')||e.target.closest('.sheet-done')||e.button>0||sheet.hidden)return;
 if(sheetState.closing){sheetState.closing=false;panel=$('#editor').dataset.lastPanel||'';sheet.querySelector('.sheet-content').inert=false;updateToolbar();}
 stopSheet();++sheetState.epoch;motionFrom=null;
 sheetState.drag={grip:!!e.target.closest('.sheet-grip'),id:e.pointerId,startY:e.clientY,startOffset:sheetState.y,lastY:e.clientY,lastTime:e.timeStamp,velocity:0,moved:false};
 sheet.setPointerCapture(e.pointerId);
});
sheet.addEventListener('pointermove',e=>{
 const g=sheetState.drag;if(!g||g.id!==e.pointerId)return;const dy=e.clientY-g.startY;
 if(Math.abs(dy)>4)g.moved=true;if(!g.moved)return;e.preventDefault();
 g.velocity=(e.clientY-g.lastY)/Math.max(1,e.timeStamp-g.lastTime);g.lastY=e.clientY;g.lastTime=e.timeStamp;
 setSheetY(Math.max(-24,g.startOffset+dy<0?(g.startOffset+dy)*.18:g.startOffset+dy));
});
function endSheetDrag(e,cancelled=false){
 const g=sheetState.drag;if(!g||g.id!==e.pointerId)return;sheetState.drag=null;
 suppressGripClick=g.moved;setTimeout(()=>suppressGripClick=false,0);
 if(cancelled){settleSheet(0);return;}if(!g.moved){if(g.grip){suppressGripClick=true;sheetExpansion(!sheetState.expanded);settleSheet(0);}return;}
 const delta=e.clientY-g.startY;
 if(sheetState.closing&&sheetState.y<sheet.offsetHeight*.7){sheetState.closing=false;panel=$('#editor').dataset.lastPanel||'gradient';updateToolbar();}
 if(delta< -55){sheetExpansion(true);settleSheet(0);}
 else if(sheetState.y>90||(delta>24&&g.velocity>.55)){if(sheetState.expanded){sheetExpansion(false);settleSheet(0);}else closePanel();}
 else settleSheet(0);
}
sheet.addEventListener('pointerup',e=>endSheetDrag(e));sheet.addEventListener('pointercancel',e=>endSheetDrag(e,true));
sheet.addEventListener('click',e=>{if(suppressGripClick&&e.target.closest('.sheet-grip')){e.preventDefault();e.stopImmediatePropagation();}},true);
new ResizeObserver(updateDockLayout).observe($('#editor-bottom'));
reducedMotion.addEventListener?.('change',()=>{if(reducedMotion.matches){motionFrom=null;if(sheetState.frame){const finish=sheetState.closing;stopSheet();++sheetState.epoch;if(finish)closePanel(true);else setSheetY(0);}}requestPaint();});

function viewport(){cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(()=>{const vv=window.visualViewport;if(typing)visualTransition();document.documentElement.style.setProperty('--app-height',`${vv?.height||innerHeight}px`);$('#editor').style.top=(vv?.offsetTop||0)+'px';updateDockLayout();requestPaint();});}
window.addEventListener('resize',viewport);window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);new ResizeObserver(()=>requestPaint()).observe($('#stage'));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(typing)commit();saveCurrent();}});window.addEventListener('pagehide',()=>saveCurrent());window.addEventListener('beforeunload',e=>{if(dirty&&!dbOK){e.preventDefault();e.returnValue='';}});
hydrate();viewport();renderRecent();
if('serviceWorker'in navigator&&(location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname))&&!window.FRAME_PORTABLE){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Offline shell not installed:',e)));}
window.FRAME={version:'0.3.1',getState:()=>p?E.copy(p):null,getSelection:()=>selection,getUI:()=>({panel,typing,mode,fontLibraryOpen,reducedMotion:reducedMotion.matches,sheetY:sheetState.y,sheetExpanded:sheetState.expanded}),getView:()=>({...view}),getHistory:()=>({length:history.length,index:historyIndex}),ready:()=>!previewRunning&&!previewWanted,save:saveCurrent,renderer,store};
})();

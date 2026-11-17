import {albumData,trackData,behindData,releaseData,motionData,artistData} from './comebackData.js';
const esc = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 10 10 2M3 2h7v7" stroke="currentColor" stroke-width="1"/></svg>';
const number = i => String(i+1).padStart(2,'0');
/** Standalone component. All assets and copy live in comebackData.js. Call destroy() before removing. */
export class ComebackProject {
 constructor(root){
  this.root=root;this.mode='listen';this.activeTrack=2;this.activeBehind=0;this.locked=false;this.destroyed=false;this.visible=true;this.listenState='explore';this.selectedTrack=null;this.focusBusy=false;this.focusEpoch=0;this.focusAnimations=[];this.muted=false;this.autoplayEnabled=false;
  this.abort=new AbortController();this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.audio=new Audio();this.animations=[];this.imageAnimations=[];this.noteAnimation=null;this.notePositionAnimation=null;this.noteEpoch=0;this.rotationFrame=0;this.pointerFrame=0;this.hoverDepth=null;this.timers=new Set();
  this.build();this.circles=[...root.querySelectorAll('.comeback-project__circle')];this.stage=root.querySelector('.comeback-project__stage');
  this.rotations=this.circles.map((circle,i)=>circle.querySelector('.comeback-project__track-artwork').animate([{transform:'rotate(0deg)'},{transform:`rotate(${360*trackData[i].rotation.direction}deg)`}],{duration:trackData[i].rotation.duration*1000,iterations:Infinity}));
  this.bind();this.updateUtilityUI();this.selectTrack(this.activeTrack);this.selectBehind(0);this.layout();this.syncRotations();
  this.resize=new ResizeObserver(()=>{this.updateViewportAxis();if(!this.locked&&!this.focusBusy)this.layout();else this.resizePending=true;});this.resize.observe(this.stage);
  this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.root.dataset.visible=String(this.visible);this.syncRotations();if(!this.visible)this.stopAudio();},{threshold:.02});this.observer.observe(root);
 }
 $(selector){return this.root.querySelector(selector);}
 later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);if(!this.destroyed)fn();},ms);this.timers.add(id);return id;}
 link(label,url,extra=''){return url?`<a class="comeback-project__link" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)} ${arrow}</a>`:`<button class="comeback-project__link" type="button" data-unavailable="${esc(label)}" ${extra}>${esc(label)} ${arrow}</button>`;}
 build(){
  this.root.dataset.mode='listen';this.root.dataset.revealed='false';this.root.dataset.listenState='explore';this.root.dataset.noteReady='false';
  this.root.innerHTML=`
  <div class="comeback-project__guide-line" aria-hidden="true"></div>
  <div class="comeback-project__artist" aria-label="${esc(artistData.latin)} ${esc(artistData.korean)}"><span>${esc(artistData.latin)}</span><span lang="ko">${esc(artistData.korean)}</span></div>
  <p class="comeback-project__label">${esc(albumData.sectionLabel)}</p>
  <div class="comeback-project__stage">
   <div class="comeback-project__behind" aria-hidden="true" inert>
    <div class="comeback-project__timeline"><div class="comeback-project__line" aria-hidden="true"></div>${behindData.map((step,i)=>`<button type="button" class="comeback-project__step" style="--i:${i}" data-step="${i}" aria-pressed="false"><span>${esc(step.step)}</span>${esc(step.title)}</button>`).join('')}</div>
    <div class="comeback-project__release"><p class="comeback-project__eyebrow"><span aria-hidden="true">↓</span> &nbsp; ${esc(releaseData.eyebrow)}</p><h3>${esc(releaseData.title)}</h3><div class="comeback-project__release-links">${this.link(releaseData.primaryCta.label,releaseData.primaryCta.url)}${this.link(releaseData.secondaryCta.label,releaseData.secondaryCta.url,'data-listen-now')}</div></div>
    <aside class="comeback-project__note" aria-label="JENA'S NOTE"><div class="comeback-project__note-content" aria-live="polite"></div></aside>
    <article class="comeback-project__media" aria-live="polite"></article>
   </div>
   <div class="comeback-project__objects">${trackData.map((t,i)=>`<button type="button" class="comeback-project__circle" data-track="${i}" aria-label="Track ${number(i)}: ${esc(t.title)}" aria-pressed="false" style="z-index:${trackData.length-i}"><span class="comeback-project__surface"><img class="comeback-project__track-artwork" src="${esc(t.cover)}" alt="" draggable="false"><img class="comeback-project__behind-artwork" src="${esc(behindData[i].image)}" alt="" aria-hidden="true" draggable="false"></span></button>`).join('')}</div>
   <div class="comeback-project__orbit-caption"><span>10 TRACKS / ${esc(albumData.duration)}</span><span data-listen-hint>HOVER TO EXPLORE · NUMBERS TO FOCUS</span></div>
   <div class="comeback-project__listen"><p class="comeback-project__album-artist">${esc(albumData.artist)}</p><h2 class="comeback-project__album-name">${esc(albumData.title)}</h2><p class="comeback-project__album-edition">${esc(albumData.edition)} &nbsp; / &nbsp; ${esc(albumData.year)}</p><div class="comeback-project__divider"></div><div class="comeback-project__track-details" aria-live="polite"></div><div class="comeback-project__select-tracks" aria-label="Select track">${trackData.map((t,i)=>`<button type="button" class="comeback-project__track-pick" data-pick="${i}" aria-label="Focus track ${number(i)}: ${esc(t.title)}. Click again to explore." aria-pressed="false">${number(i)}</button>`).join('')}</div></div>
   <div class="comeback-project__switch" role="group" aria-label="Album view">
    <button class="comeback-project__switch-tab" type="button" data-mode-target="listen" aria-label="Listen: explore the album" aria-pressed="true"><svg class="comeback-project__listen-symbol" aria-hidden="true" width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="#969696"/><circle cx="26" cy="26" r="18" fill="#d2d2d2"/><circle cx="26" cy="26" r="9" fill="#efefef"/></svg><span class="comeback-project__switch-label">LISTEN</span></button>
    <button class="comeback-project__switch-tab" type="button" data-mode-target="behind" aria-label="Behind: open the making of the album" aria-pressed="false"><svg aria-hidden="true" width="16" height="48" viewBox="0 0 16 48" fill="currentColor"><circle cx="8" cy="8" r="8"/><circle cx="8" cy="24" r="8"/><circle cx="8" cy="40" r="8"/></svg><span class="comeback-project__switch-label">BEHIND</span></button>
   </div>
  </div>
  <div class="comeback-project__utilities" role="group" aria-label="오디오 설정">
   <button type="button" class="comeback-project__utility" data-mute aria-pressed="false"><span class="comeback-project__utility-icon" aria-hidden="true"><svg width="12" height="19" viewBox="0 0 115 183" fill="currentColor"><path d="M0 0 115 96V183L0 87Z"/></svg></span><span data-mute-label>소리 끄기</span></button>
   <button type="button" class="comeback-project__utility" data-autoplay aria-pressed="false" title="자동 재생 설정만 변경됩니다. 연속 재생은 준비 중입니다."><span class="comeback-project__utility-icon" aria-hidden="true"><svg width="18" height="17" viewBox="0 0 276 258" fill="currentColor"><path fill-rule="evenodd" d="M0 34 137 0 276 82V184L137 258 0 178ZM60 65V211L218 128Z"/></svg></span><span>자동 재생</span><span class="comeback-project__utility-state" data-autoplay-state>OFF</span></button>
  </div>
  <div class="comeback-project__toast" role="status" hidden></div><span class="comeback-project__mode-announcement" role="status"></span>
  <dialog class="comeback-project__dialog"><button type="button" data-close aria-label="Close behind preview">×</button><div class="comeback-project__dialog-content"></div></dialog>`;
 }
 bind(){
  const signal=this.abort.signal;
  this.root.addEventListener('click',event=>{
   const button=event.target.closest('button');
   if(button?.hasAttribute('data-mute')){this.muted=!this.muted;this.applyMute();this.updateUtilityUI();return;}
   if(button?.hasAttribute('data-autoplay')){this.autoplayEnabled=!this.autoplayEnabled;this.updateUtilityUI();return;}
   if(this.locked)return;
   if(!button){
    const control=event.target.closest('a,input,select,textarea,video,summary,[role="button"],dialog,.comeback-project__listen');
    if(!control&&this.mode==='listen'&&this.listenState==='focus'&&!this.locked&&this.radialTrack(event)===null)this.setTrackFocus(null);
    return;
   }
   if(button.dataset.modeTarget)this.setMode(button.dataset.modeTarget);
   else if(button.dataset.track!==undefined){if(this.locked)return;if(this.mode==='behind')this.selectBehind(+button.dataset.track);else{const index=this.listenState==='focus'?this.selectedTrack:event.detail&&event.pointerType!=='touch'?this.radialTrack(event):+button.dataset.track;if(index!==null){this.selectTrack(index);this.play();}}}
   else if(button.dataset.pick!==undefined&&!this.locked){const index=+button.dataset.pick;this.setTrackFocus(this.listenState==='focus'&&this.selectedTrack===index?null:index);}
   else if(button.dataset.step!==undefined&&!this.locked)this.selectBehind(+button.dataset.step);
   else if(button.matches('[data-play]'))this.play();
   else if(button.matches('[data-media-play]'))this.openMedia();
   else if(button.matches('[data-close]')){this.$('dialog').close();this.$('dialog video')?.pause();}
   else if(button.hasAttribute('data-listen-now')&&!releaseData.secondaryCta.url)this.setMode('listen');
   else if(button.dataset.unavailable)this.toast(`${button.dataset.unavailable} — 콘텐츠 준비 중입니다. 실제 링크는 comebackData.js에서 연결할 수 있습니다.`);
  },{signal});
  // One geometric hit-test serves all layers, including surfaces currently fading out.
  this.stage.addEventListener('pointermove',event=>{
   if(event.pointerType==='touch'||this.mode!=='listen'||this.listenState!=='explore'||this.locked||this.focusBusy)return;
   this.lastPointer={clientX:event.clientX,clientY:event.clientY};
   if(!this.pointerFrame)this.pointerFrame=requestAnimationFrame(()=>{this.pointerFrame=0;if(this.mode==='listen'&&this.listenState==='explore'&&!this.locked&&!this.focusBusy)this.exploreAt(this.lastPointer);});
  },{signal});
  this.stage.addEventListener('pointerleave',()=>this.clearExploration(),{signal});
  this.circles.forEach((circle,i)=>{
   circle.addEventListener('focus',()=>{if(this.mode==='listen'&&this.listenState==='explore'&&!this.locked&&!this.focusBusy){this.selectTrack(i);this.explore(i);}},{signal});
   circle.addEventListener('blur',()=>{if(this.mode==='listen'&&this.listenState==='explore'&&!this.locked&&!this.focusBusy)this.clearExploration();},{signal});
  });
  this.root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!this.$('dialog').open&&this.listenState==='focus'){event.preventDefault();this.setTrackFocus(null);}},{signal});
  this.audio.addEventListener('ended',()=>this.updatePlayer(false),{signal});
  this.audio.addEventListener('timeupdate',()=>{const time=this.$('.comeback-project__time');if(time)time.textContent=`0:${String(Math.floor(this.audio.currentTime)).padStart(2,'0')}`;const limit=trackData[this.activeTrack].previewDuration;if(this.audio.currentTime>=limit)this.stopAudio();},{signal});
  this.audio.addEventListener('error',()=>{this.updatePlayer(false);this.toast('미리듣기 파일을 불러오지 못했습니다. 오디오 경로를 확인해주세요.');},{signal});
  document.addEventListener('visibilitychange',()=>{this.syncRotations();if(document.hidden)this.stopAudio();},{signal});
  this.motion.addEventListener('change',()=>this.syncRotations(),{signal});
  this.$('dialog').addEventListener('close',()=>this.$('dialog video')?.pause(),{signal});
 }
 applyMute(){
  this.audio.muted=this.muted;
  document.querySelectorAll('audio,video').forEach(media=>media.muted=this.muted);
 }
 updateUtilityUI(){
  const mute=this.$('[data-mute]'),autoplay=this.$('[data-autoplay]');
  mute.setAttribute('aria-pressed',String(this.muted));
  this.$('[data-mute-label]').textContent=this.muted?'소리 켜기':'소리 끄기';
  autoplay.setAttribute('aria-pressed',String(this.autoplayEnabled));
  autoplay.setAttribute('aria-label',`자동 재생 ${this.autoplayEnabled?'끄기':'켜기'} (연속 재생 준비 중)`);
  this.$('[data-autoplay-state]').textContent=this.autoplayEnabled?'ON':'OFF';
 }
 updateViewportAxis(){
  const box=this.stage.getBoundingClientRect();
  this.root.style.setProperty('--cp-viewport-axis',`${box.left+box.width/2}px`);
 }
 syncRotations(){this.rotations.forEach((a,i)=>{if(this.mode==='listen'&&!this.locked&&this.visible&&!document.hidden&&!this.motion.matches&&(this.listenState==='explore'||i===this.selectedTrack)){a.playbackRate=1;a.play();}else a.pause();});}
 radialTrack(point){
  const box=this.stage.getBoundingClientRect(),outer=this.positions('listen').at(-1);
  const radius=Math.hypot(point.clientX-box.left-outer.x-outer.size/2,point.clientY-box.top-outer.y-outer.size/2);
  if(radius>outer.size/2)return null;
  // Always use the unexpanded geometry: animated scale/opacity never moves a boundary.
  const zones=this.positions('listen');
  for(let i=0;i<zones.length;i++)if(radius<=zones[i].size/2)return i;
  return zones.length-1;
 }
 exploreAt(point){if(this.listenState!=='explore'||this.focusBusy||this.locked)return;const index=this.radialTrack(point);if(index===null){this.clearExploration();return;}this.selectTrack(index);this.explore(index);}
 explore(index){
  if(this.hoverDepth===index)return;this.hoverDepth=index;
  this.circles.forEach((circle,i)=>{
   const hidden=i<index;const expansion=1+.03*((9-index)/9)*(.3+.7*(9-i)/9);
   const surface=circle.querySelector('.comeback-project__surface');
   surface.style.transform=`scale(${hidden?1.05:expansion})`;surface.style.opacity=hidden?'0':'1';
  });
 }
 clearExploration(){
  cancelAnimationFrame(this.pointerFrame);this.pointerFrame=0;this.hoverDepth=null;
  this.circles.forEach(circle=>{const surface=circle.querySelector('.comeback-project__surface');surface.style.transform='scale(1)';surface.style.opacity='1';});
 }
 selectTrack(index){if(this.activeTrack!==index)this.stopAudio();this.activeTrack=index;this.showTrack(index);this.circles.forEach((c,i)=>{c.dataset.active=String(i===index);c.setAttribute('aria-pressed',String(i===index));});this.root.querySelectorAll('[data-pick]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));}
 showTrack(index){
  // Re-rendering track copy never creates an Audio instance or starts playback.
  if(this.displayedTrack===index)return;this.displayedTrack=index;const t=trackData[index];
  this.$('.comeback-project__track-details').innerHTML=`<span class="comeback-project__track-count">TRACK ${number(index)} <span class="comeback-project__track-total">/ 10</span></span><h3 class="comeback-project__track-title">${esc(t.title)}</h3><span class="comeback-project__preview-label">01:00 PREVIEW ${t.audio?'':'· AUDIO COMING SOON'}</span><div class="comeback-project__play-row"><button type="button" class="comeback-project__play" data-play="${index}" aria-label="Play preview of ${esc(t.title)}"></button><div class="comeback-project__wave" aria-hidden="true">${Array.from({length:27},(_,i)=>`<i style="--h:${6+(i*13%19)}px;--d:${i*-.07}s"></i>`).join('')}</div><span class="comeback-project__time">0:00</span></div><div class="comeback-project__services">${this.link('SPOTIFY',t.spotifyUrl)}${this.link('YOUTUBE MUSIC',t.youtubeMusicUrl)}</div>`;
  this.infoAnimation?.cancel();if(!this.motion.matches)this.infoAnimation=this.$('.comeback-project__track-details').animate([{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'ease-out'});
  if(index===this.activeTrack&&!this.audio.paused)this.updatePlayer(true);
 }
 selectBehind(index){const changed=index!==this.activeBehind;this.activeBehind=index;const d=behindData[index];this.root.querySelectorAll('[data-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));if(this.mode==='behind')this.circles.forEach((c,i)=>{c.dataset.active=String(i===index);c.setAttribute('aria-pressed',String(i===index));});
  this.$('.comeback-project__media').innerHTML=`<div class="comeback-project__media-visual"><img src="${esc(d.image)}" alt="${esc(d.title)}"><button type="button" class="comeback-project__media-play" data-media-play aria-label="Open ${esc(d.videoTitle)}"></button></div><p class="comeback-project__media-caption">${esc(d.caption)} &nbsp; · &nbsp; BEHIND ARCHIVE</p><span class="comeback-project__media-number">${esc(d.step)} / ${esc(d.title)}</span><h2>${esc(d.videoTitle)}</h2><p class="comeback-project__media-description">${esc(d.description)}</p>`;
  this.updateBehindNote(index,{animate:changed&&this.mode==='behind'&&!this.locked&&this.root.dataset.noteReady==='true'});
 }
 updateNotePosition(index,{animate=false,delay=0}={}){
  const note=this.$('.comeback-project__note'),row=this.$(`[data-step="${index}"]`),label=this.$('.comeback-project__note-label');
  if(!row||!label)return null;
  const style=getComputedStyle(note),from=style.translate;
  this.notePositionAnimation?.cancel();this.notePositionAnimation=null;
  note.style.removeProperty('translate');
  // Compact layouts keep their existing reserved Note area instead of covering content.
  if(style.getPropertyValue('--cp-note-row-follow').trim()==='0')return null;
  const rowBox=row.getBoundingClientRect(),parentBox=note.offsetParent.getBoundingClientRect();
  const y=rowBox.top-parentBox.top+(rowBox.height-label.getBoundingClientRect().height)/2;
  const to=`0px ${y}px`;
  note.style.setProperty('--cp-note-y',`${y}px`);
  if(!animate||this.motion.matches)return null;
  const movement=note.animate([{translate:from},{translate:to}],{duration:420,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
  this.notePositionAnimation=movement;
  movement.finished.catch(()=>{}).then(()=>{if(this.notePositionAnimation===movement){movement.cancel();this.notePositionAnimation=null;}});
  return movement;
 }
 holdNotePosition(){
  const note=this.$('.comeback-project__note'),translate=getComputedStyle(note).translate;
  this.notePositionAnimation?.cancel();this.notePositionAnimation=null;
  note.style.translate=translate;
 }
 async updateBehindNote(index,{animate=false}={}){
  const content=this.$('.comeback-project__note-content'),epoch=++this.noteEpoch;
  const style=getComputedStyle(content),from={opacity:style.opacity,transform:style.transform};
  this.noteAnimation?.cancel();this.noteAnimation=null;
  const render=()=>{const d=behindData[index];content.innerHTML=`<p class="comeback-project__note-label">JENA'S NOTE ${esc(d.step)}</p><p class="comeback-project__note-body" lang="ko">${esc(d.note??'')}</p><p class="comeback-project__note-signature">Jena</p>`;};
  if(!animate||this.motion.matches){
   render();
   if(this.locked&&this.mode==='behind')this.holdNotePosition();else this.updateNotePosition(index);
   return;
  }
  const movement=this.updateNotePosition(index,{animate:true,delay:90});
  const exit=content.animate([from,{opacity:0,transform:'translateY(-3px)'}],{duration:110,easing:'ease-out',fill:'forwards'});
  this.noteAnimation=exit;
  await exit.finished.catch(()=>{});
  if(this.destroyed||epoch!==this.noteEpoch)return;
  render();exit.cancel();
  const enter=content.animate([{opacity:0,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'ease-out'});
  this.noteAnimation=enter;
  await Promise.all([enter.finished.catch(()=>{}),movement?.finished.catch(()=>{})]);
  if(this.destroyed||epoch!==this.noteEpoch)return;
  enter.cancel();this.noteAnimation=null;
 }
 positions(mode){const w=this.stage.clientWidth;const mobile=w<580;const diameter=mobile?Math.min(w*.87,350):Math.min(680,w*.60);const centerX=w*.5,centerY=mobile?190:380;
  // Read shared layout tokens so timeline rows and the original circle objects stay aligned.
  const style=mode==='behind'?getComputedStyle(this.root):null;
  const nodeSize=parseFloat(style?.getPropertyValue('--cp-timeline-node-size'))||motionData.nodeSize;
  const nodeOffset=parseFloat(style?.getPropertyValue('--cp-timeline-node-offset'))||6;
  const rowGap=parseFloat(style?.getPropertyValue('--cp-timeline-row-gap'))||44;
  return this.circles.map((_,i)=>{if(mode==='behind')return{x:w*(mobile?.03:.06),y:(mobile?20:24)+nodeOffset+i*rowGap,size:nodeSize};const size=diameter*(1-(trackData.length-1-i)*.078);return{x:centerX-size/2,y:centerY-size/2,size};});}
 transform(p){return `translate(${p.x}px, ${p.y}px) scale(${p.size/600})`;}
 layout(){
  this.updateViewportAxis();
  this.updateNotePosition(this.activeBehind);
  const geometry=this.positions(this.mode);
  if(this.mode==='listen'&&this.listenState==='focus')this.circles[this.selectedTrack].style.transform=this.transform(geometry.at(-1));
  else geometry.forEach((p,i)=>this.circles[i].style.transform=this.transform(p));
 }
 async setTrackFocus(index,{duration=650,forMode=false}={}){
  if(this.destroyed||this.mode!=='listen'||(this.locked&&!forMode))return;
  if(index!==null&&(!Number.isInteger(index)||index<0||index>=trackData.length))return;
  // Capture the currently drawn objects before cancelling an interrupted focus transition.
  const first=this.circles.map(circle=>{const style=getComputedStyle(circle);return{transform:style.transform,opacity:style.opacity};});
  const previous=this.selectedTrack,wasFocus=this.listenState==='focus',epoch=++this.focusEpoch;
  this.focusAnimations.forEach(a=>a.cancel());this.focusAnimations=[];
  this.focusBusy=true;this.root.dataset.focusBusy='true';
  this.clearExploration();this.selectedTrack=index;this.listenState=index===null?'explore':'focus';
  this.root.dataset.listenState=this.listenState;
  if(index!==null)this.selectTrack(index);
  this.$('[data-listen-hint]').textContent=index===null?'HOVER TO EXPLORE · NUMBERS TO FOCUS':'CLICK AGAIN OR OUTSIDE TO EXPLORE';
  const geometry=this.positions('listen'),largest=geometry.at(-1);
  const centeredScale=(p,scale,dx=0,dy=0)=>({x:p.x+(p.size-p.size*scale)/2+dx,y:p.y+(p.size-p.size*scale)/2+dy,size:p.size*scale});
  const reduced=this.motion.matches,ms=reduced?100:duration;
  // Incoming artwork in Focus→Focus begins large; the other eight layers stay invisible.
  if(index!==null&&wasFocus&&index!==previous){first[index]={transform:this.transform(centeredScale(largest,.975)),opacity:'0'};}
  this.focusAnimations=this.circles.map((circle,i)=>{
   const selected=index===i,hidden=index!==null&&!selected;
   let destination=geometry[i];
   if(selected)destination=largest; // TRACK 10's Explore geometry is the sole size source.
   else if(hidden){const angle=i*2.4;const p=wasFocus&&i===previous?largest:geometry[i];destination=centeredScale(p,1.045,Math.cos(angle)*8,Math.sin(angle)*8);}
   const to={transform:this.transform(destination),opacity:hidden?'0':'1'};
   circle.style.transform=to.transform;circle.style.opacity=to.opacity;
   circle.inert=hidden;circle.setAttribute('aria-hidden',String(hidden));circle.style.pointerEvents=hidden?'none':'';
   const delay=reduced||forMode||wasFocus?0:(selected?0:i*12);
   return circle.animate([first[i],to],{duration:ms,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
  });
  if(!forMode)this.syncRotations();
  const running=this.focusAnimations;
  await Promise.all(running.map(a=>a.finished.catch(()=>{})));
  if(this.destroyed||epoch!==this.focusEpoch)return;
  running.forEach(a=>a.cancel());this.focusAnimations=[];this.focusBusy=false;this.root.dataset.focusBusy='false';
  this.layout();this.resizePending=false;if(!forMode)this.syncRotations();
  this.$('.comeback-project__mode-announcement').textContent=index===null?'Explore mode. Move across the artwork to explore ten tracks.':`Track ${number(index)} focus. Click the selected number again or outside the artwork to explore.`;
 }
 transitionCircleImages(next){
  const reduced=this.motion.matches;
  this.imageAnimations=this.circles.flatMap((circle,i)=>{
   const track=circle.querySelector('.comeback-project__track-artwork');
   const behind=circle.querySelector('.comeback-project__behind-artwork');
   return [track,behind].map((image,j)=>{
    const from=getComputedStyle(image).opacity;
    const to=String(next==='behind'?j:1-j);
    image.style.opacity=to;
    return image.animate([{opacity:from},{opacity:to}],{duration:reduced?80:420,delay:reduced?0:220+i*18,easing:'ease-in-out',fill:'backwards'});
   });
  });
 }
 async setMode(next){
  if(this.locked||next===this.mode||this.destroyed)return;this.locked=true;this.stopAudio();this.root.setAttribute('aria-busy','true');
  this.root.dataset.noteReady='false';this.updateBehindNote(this.activeBehind);
  this.root.dataset.preparing='true';this.root.querySelectorAll('[data-mode-target]').forEach(b=>b.disabled=true);
  if(this.listenState==='focus'||this.focusBusy){await this.setTrackFocus(null,{duration:200,forMode:true});if(this.destroyed)return;}
  this.clearExploration();
  this.$('.comeback-project__listen').inert=true;this.$('.comeback-project__behind').inert=true;
  this.root.dataset.revealed='false';
  // Decode the incoming visuals before starting the existing morph, avoiding blank frames.
  const incoming=next==='behind'?'.comeback-project__behind-artwork':'.comeback-project__track-artwork';
  await Promise.all(this.circles.map(circle=>circle.querySelector(incoming).decode().catch(()=>{})));
  if(this.destroyed)return;
  const reduced=this.motion.matches;const duration=reduced?120:motionData.duration;const stagger=reduced?0:motionData.stagger;
  if(next==='behind'&&!reduced){await this.slowRotations(150);if(this.destroyed)return;}else this.rotations.forEach(a=>a.pause());
  // FLIP: record current transforms, update the same ten buttons' final transforms,
  // then animate the inverse to identity. Never clone, reparent, or replace a circle.
  this.root.dataset.preparing='false';
  const first=this.circles.map(c=>getComputedStyle(c).transform);this.mode=next;this.root.dataset.mode=next;
  const destinations=this.positions(next);
  this.circles.forEach((circle,i)=>{circle.style.transform=this.transform(destinations[i]);circle.setAttribute('aria-label',next==='behind'?`Behind ${number(i)}: ${behindData[i].title}`:`Track ${number(i)}: ${trackData[i].title}`);});
  this.animations=this.circles.map((circle,i)=>{const keys=[{transform:first[i]}];if(next==='behind'&&!reduced){const p=this.positions('listen')[i];keys.push({transform:this.transform({x:p.x+p.size*.02,y:p.y+p.size*.02,size:p.size*.96}),offset:.12});}keys.push({transform:this.transform(destinations[i])});return circle.animate(keys,{duration,delay:i*stagger,easing:'cubic-bezier(.65,0,.18,1)',fill:'backwards'});});
  this.transitionCircleImages(next);
  this.later(()=>{if(next==='behind')this.root.dataset.revealed='true';},reduced?0:900);
  await Promise.all(this.animations.map(a=>a.finished.catch(()=>{})));if(this.destroyed)return;
  this.animations.forEach(a=>a.cancel());this.animations=[];this.imageAnimations.forEach(a=>a.cancel());this.imageAnimations=[];this.locked=false;this.root.removeAttribute('aria-busy');
  this.root.querySelectorAll('[data-mode-target]').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed',String(b.dataset.modeTarget===next));});
  const behind=next==='behind';this.$('.comeback-project__listen').inert=behind;this.$('.comeback-project__listen').setAttribute('aria-hidden',String(behind));this.$('.comeback-project__behind').inert=!behind;this.$('.comeback-project__behind').setAttribute('aria-hidden',String(!behind));

  behind?this.selectBehind(this.activeBehind):this.selectTrack(this.activeTrack);this.root.dataset.noteReady=String(behind);this.syncRotations();this.layout();this.resizePending=false;
  this.$('.comeback-project__mode-announcement').textContent=behind?'Behind mode. Explore ten chapters in the making of the album.':'Listen mode. Explore the ten tracks.';
 }
 slowRotations(duration){return new Promise(resolve=>{const start=performance.now();const tick=now=>{if(this.destroyed){resolve();return;}const p=Math.min(1,(now-start)/duration);this.rotations.forEach(a=>a.playbackRate=1-p);if(p<1)this.rotationFrame=requestAnimationFrame(tick);else{this.rotations.forEach(a=>a.pause());resolve();}};this.rotationFrame=requestAnimationFrame(tick);});}
 async play(){const index=+this.$('[data-play]').dataset.play;const t=trackData[index];if(!t.audio){this.toast('아직 공개되지 않은 음원입니다. 실제 음원 URL을 연결하면 60초 미리듣기가 활성화됩니다.');return;}
  if(this.activeTrack===index&&!this.audio.paused){this.audio.pause();this.updatePlayer(false);return;}this.selectTrack(index);const src=new URL(t.audio,import.meta.url).href;if(this.audio.src!==src)this.audio.src=src;try{await this.audio.play();if(!this.destroyed)this.updatePlayer(true);}catch{this.toast('오디오를 재생할 수 없습니다. 음원 파일을 확인해주세요.');}}
 updatePlayer(playing){const play=this.$('[data-play]');if(play){play.classList.toggle('is-playing',playing);play.setAttribute('aria-label',`${playing?'Pause':'Play'} preview`);}this.$('.comeback-project__wave')?.classList.toggle('is-playing',playing);}
 stopAudio(){this.audio.pause();this.updatePlayer(false);}
 openMedia(){const d=behindData[this.activeBehind];this.$('.comeback-project__dialog-content').innerHTML=`<h2>${esc(d.videoTitle)}</h2>${d.video?`<video controls playsinline poster="${esc(d.image)}" src="${esc(d.video)}"></video>`:`<img src="${esc(d.image)}" alt="${esc(d.title)}"><p>이 단계의 비하인드 영상은 준비 중입니다. 영상이 준비되면 comebackData.js의 video 경로를 연결해주세요.</p>`}<p>${esc(d.description)}</p>`;this.$('dialog').querySelectorAll('audio,video').forEach(media=>media.muted=this.muted);this.$('dialog').showModal();}
 toast(message){const box=this.$('.comeback-project__toast');box.textContent=message;box.hidden=false;if(this.toastTimer){clearTimeout(this.toastTimer);this.timers.delete(this.toastTimer);}this.toastTimer=this.later(()=>box.hidden=true,4500);}
 destroy(){this.destroyed=true;this.noteEpoch++;this.noteAnimation?.cancel();this.notePositionAnimation?.cancel();this.root.dataset.visible='false';this.focusEpoch++;this.focusAnimations.forEach(a=>a.cancel());this.imageAnimations.forEach(a=>a.cancel());this.abort.abort();this.resize.disconnect();this.observer.disconnect();cancelAnimationFrame(this.rotationFrame);cancelAnimationFrame(this.pointerFrame);this.infoAnimation?.cancel();this.animations.forEach(a=>a.cancel());this.rotations.forEach(a=>a.cancel());this.timers.forEach(clearTimeout);this.stopAudio();this.audio.removeAttribute('src');this.audio.load();if(this.$('dialog').open)this.$('dialog').close();}
}

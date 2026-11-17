import {albumData,trackData,behindData,releaseData,motionData} from './comebackData.js';
const esc = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 10 10 2M3 2h7v7" stroke="currentColor" stroke-width="1"/></svg>';
const number = i => String(i+1).padStart(2,'0');
/** Standalone component. All assets and copy live in comebackData.js. Call destroy() before removing. */
export class ComebackProject {
 constructor(root){
  this.root=root;this.mode='listen';this.activeTrack=2;this.activeBehind=0;this.locked=false;this.destroyed=false;this.visible=true;
  this.abort=new AbortController();this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.audio=new Audio();this.animations=[];this.rotationFrame=0;this.pointerFrame=0;this.hoverDepth=null;this.timers=new Set();
  this.build();this.circles=[...root.querySelectorAll('.comeback-project__circle')];this.stage=root.querySelector('.comeback-project__stage');
  this.rotations=this.circles.map((circle,i)=>circle.querySelector('img').animate([{transform:'rotate(0deg)'},{transform:`rotate(${360*trackData[i].rotation.direction}deg)`}],{duration:trackData[i].rotation.duration*1000,iterations:Infinity}));
  this.bind();this.selectTrack(this.activeTrack);this.selectBehind(0);this.layout();this.syncRotations();
  this.resize=new ResizeObserver(()=>{if(!this.locked)this.layout();else this.resizePending=true;});this.resize.observe(this.stage);
  this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.syncRotations();if(!this.visible)this.stopAudio();},{threshold:.02});this.observer.observe(root);
 }
 $(selector){return this.root.querySelector(selector);}
 later(fn,ms){const id=setTimeout(()=>{this.timers.delete(id);if(!this.destroyed)fn();},ms);this.timers.add(id);return id;}
 link(label,url,extra=''){return url?`<a class="comeback-project__link" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${esc(label)} ${arrow}</a>`:`<button class="comeback-project__link" type="button" data-unavailable="${esc(label)}" ${extra}>${esc(label)} ${arrow}</button>`;}
 build(){
  this.root.dataset.mode='listen';this.root.dataset.revealed='false';
  this.root.innerHTML=`
  <p class="comeback-project__label">${esc(albumData.sectionLabel)}</p>
  <div class="comeback-project__stage">
   <div class="comeback-project__guide-line" aria-hidden="true"></div>
   <div class="comeback-project__behind" aria-hidden="true" inert>
    <div class="comeback-project__timeline"><div class="comeback-project__line" aria-hidden="true"></div>${behindData.map((step,i)=>`<button type="button" class="comeback-project__step" style="--i:${i}" data-step="${i}" aria-pressed="false"><span>${esc(step.step)}</span>${esc(step.title)}</button>`).join('')}</div>
    <div class="comeback-project__release"><p class="comeback-project__eyebrow"><span aria-hidden="true">↓</span> &nbsp; ${esc(releaseData.eyebrow)}</p><h3>${esc(releaseData.title)}</h3><div class="comeback-project__release-links">${this.link(releaseData.primaryCta.label,releaseData.primaryCta.url)}${this.link(releaseData.secondaryCta.label,releaseData.secondaryCta.url,'data-listen-now')}</div></div>
    <article class="comeback-project__media" aria-live="polite"></article>
   </div>
   <div class="comeback-project__objects">${trackData.map((t,i)=>`<button type="button" class="comeback-project__circle" data-track="${i}" aria-label="Track ${number(i)}: ${esc(t.title)}" aria-pressed="false" style="z-index:${i+1}"><span class="comeback-project__surface"><img src="${esc(t.cover)}" alt="" draggable="false"></span></button>`).join('')}</div>
   <div class="comeback-project__orbit-caption"><span>10 TRACKS / ${esc(albumData.duration)}</span><span>MOVE TO EXPLORE · CLICK TO PREVIEW</span></div>
   <div class="comeback-project__listen"><p class="comeback-project__album-artist">${esc(albumData.artist)}</p><h2 class="comeback-project__album-name">${esc(albumData.title)}</h2><p class="comeback-project__album-edition">${esc(albumData.edition)} &nbsp; / &nbsp; ${esc(albumData.year)}</p><div class="comeback-project__divider"></div><div class="comeback-project__track-details" aria-live="polite"></div><div class="comeback-project__select-tracks" aria-label="Select track">${trackData.map((t,i)=>`<button type="button" class="comeback-project__track-pick" data-pick="${i}" aria-label="Select track ${number(i)}: ${esc(t.title)}" aria-pressed="false">${number(i)}</button>`).join('')}</div></div>
   <div class="comeback-project__switch" role="group" aria-label="Album view">
    <button class="comeback-project__switch-tab" type="button" data-mode-target="listen" aria-label="Listen: explore the album" aria-pressed="true"><svg class="comeback-project__listen-symbol" aria-hidden="true" width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="26" fill="#969696"/><circle cx="26" cy="26" r="18" fill="#d2d2d2"/><circle cx="26" cy="26" r="9" fill="#efefef"/></svg><span class="comeback-project__switch-label">LISTEN</span></button>
    <button class="comeback-project__switch-tab" type="button" data-mode-target="behind" aria-label="Behind: open the making of the album" aria-pressed="false"><svg aria-hidden="true" width="16" height="48" viewBox="0 0 16 48" fill="currentColor"><circle cx="8" cy="8" r="8"/><circle cx="8" cy="24" r="8"/><circle cx="8" cy="40" r="8"/></svg><span class="comeback-project__switch-label">BEHIND</span></button>
   </div>
  </div>
  <div class="comeback-project__toast" role="status" hidden></div><span class="comeback-project__mode-announcement" role="status"></span>
  <dialog class="comeback-project__dialog"><button type="button" data-close aria-label="Close behind preview">×</button><div class="comeback-project__dialog-content"></div></dialog>`;
 }
 bind(){
  const signal=this.abort.signal;
  this.root.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button)return;
   if(button.dataset.modeTarget)this.setMode(button.dataset.modeTarget);
   else if(button.dataset.track!==undefined){if(this.locked)return;if(this.mode==='behind')this.selectBehind(+button.dataset.track);else{const index=event.detail&&event.pointerType!=='touch'?this.radialTrack(event):+button.dataset.track;if(index!==null){this.selectTrack(index);this.play();}}}
   else if(button.dataset.pick!==undefined&&!this.locked)this.selectTrack(+button.dataset.pick);
   else if(button.dataset.step!==undefined&&!this.locked)this.selectBehind(+button.dataset.step);
   else if(button.matches('[data-play]'))this.play();
   else if(button.matches('[data-media-play]'))this.openMedia();
   else if(button.matches('[data-close]')){this.$('dialog').close();this.$('dialog video')?.pause();}
   else if(button.hasAttribute('data-listen-now')&&!releaseData.secondaryCta.url)this.setMode('listen');
   else if(button.dataset.unavailable)this.toast(`${button.dataset.unavailable} — 콘텐츠 준비 중입니다. 실제 링크는 comebackData.js에서 연결할 수 있습니다.`);
  },{signal});
  // One geometric hit-test serves all layers, including surfaces currently fading out.
  this.stage.addEventListener('pointermove',event=>{
   if(event.pointerType==='touch'||this.mode!=='listen'||this.locked)return;
   this.lastPointer={clientX:event.clientX,clientY:event.clientY};
   if(!this.pointerFrame)this.pointerFrame=requestAnimationFrame(()=>{this.pointerFrame=0;if(this.mode==='listen'&&!this.locked)this.exploreAt(this.lastPointer);});
  },{signal});
  this.stage.addEventListener('pointerleave',()=>this.clearExploration(),{signal});
  this.circles.forEach((circle,i)=>{
   circle.addEventListener('focus',()=>{if(this.mode==='listen'&&!this.locked){this.selectTrack(i);this.explore(i);}},{signal});
   circle.addEventListener('blur',()=>{if(this.mode==='listen'&&!this.locked)this.clearExploration();},{signal});
  });
  this.audio.addEventListener('ended',()=>this.updatePlayer(false),{signal});
  this.audio.addEventListener('timeupdate',()=>{const time=this.$('.comeback-project__time');if(time)time.textContent=`0:${String(Math.floor(this.audio.currentTime)).padStart(2,'0')}`;const limit=trackData[this.activeTrack].previewDuration;if(this.audio.currentTime>=limit)this.stopAudio();},{signal});
  this.audio.addEventListener('error',()=>{this.updatePlayer(false);this.toast('미리듣기 파일을 불러오지 못했습니다. 오디오 경로를 확인해주세요.');},{signal});
  document.addEventListener('visibilitychange',()=>{this.syncRotations();if(document.hidden)this.stopAudio();},{signal});
  this.motion.addEventListener('change',()=>this.syncRotations(),{signal});
  this.$('dialog').addEventListener('close',()=>this.$('dialog video')?.pause(),{signal});
 }
 syncRotations(){this.rotations.forEach(a=>{if(this.mode==='listen'&&!this.locked&&this.visible&&!document.hidden&&!this.motion.matches){a.playbackRate=1;a.play();}else a.pause();});}
 radialTrack(point){
  const box=this.stage.getBoundingClientRect(),outer=this.positions('listen')[0];
  const radius=Math.hypot(point.clientX-box.left-outer.x-outer.size/2,point.clientY-box.top-outer.y-outer.size/2);
  if(radius>outer.size/2)return null;
  // Always use the unexpanded geometry: animated scale/opacity never moves a boundary.
  const zones=this.positions('listen');
  for(let i=zones.length-1;i>=0;i--)if(radius<=zones[i].size/2)return i;
  return 0;
 }
 exploreAt(point){const index=this.radialTrack(point);if(index===null){this.clearExploration();return;}this.selectTrack(index);this.explore(index);}
 explore(index){
  if(this.hoverDepth===index)return;this.hoverDepth=index;
  this.circles.forEach((circle,i)=>{
   const hidden=i>index;const expansion=1+.03*(index/9)*(.3+.7*i/9);
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
 selectBehind(index){this.activeBehind=index;const d=behindData[index];this.root.querySelectorAll('[data-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));if(this.mode==='behind')this.circles.forEach((c,i)=>{c.dataset.active=String(i===index);c.setAttribute('aria-pressed',String(i===index));});
  this.$('.comeback-project__media').innerHTML=`<div class="comeback-project__media-visual"><img src="${esc(d.thumbnail)}" alt="${esc(d.title)} — temporary concept artwork"><button type="button" class="comeback-project__media-play" data-media-play aria-label="Open ${esc(d.videoTitle)}"></button></div><p class="comeback-project__media-caption">${esc(d.caption)} &nbsp; · &nbsp; CONCEPT VISUAL</p><span class="comeback-project__media-number">${esc(d.step)} / ${esc(d.title)}</span><h2>${esc(d.videoTitle)}</h2><p class="comeback-project__media-description">${esc(d.description)}</p>`;
 }
 positions(mode){const w=this.stage.clientWidth;const mobile=w<580;const diameter=mobile?Math.min(w*.87,350):Math.min(680,w*.60);const centerX=w*.5,centerY=mobile?190:380;
  return this.circles.map((_,i)=>{if(mode==='behind')return{x:w*(mobile?.03:.06),y:(mobile?20:24)+6+i*44,size:motionData.nodeSize};const size=diameter*(1-i*.078);return{x:centerX-size/2,y:centerY-size/2,size};});}
 transform(p){return `translate(${p.x}px, ${p.y}px) scale(${p.size/600})`;}
 layout(){this.positions(this.mode).forEach((p,i)=>this.circles[i].style.transform=this.transform(p));}
 async setMode(next){
  if(this.locked||next===this.mode||this.destroyed)return;this.locked=true;this.stopAudio();this.root.setAttribute('aria-busy','true');
  this.root.dataset.preparing='true';this.clearExploration();this.root.querySelectorAll('[data-mode-target]').forEach(b=>b.disabled=true);
  this.$('.comeback-project__listen').inert=true;this.$('.comeback-project__behind').inert=true;
  this.root.dataset.revealed='false';
  const reduced=this.motion.matches;const duration=reduced?120:motionData.duration;const stagger=reduced?0:motionData.stagger;
  if(next==='behind'&&!reduced){await this.slowRotations(150);if(this.destroyed)return;}else this.rotations.forEach(a=>a.pause());
  // FLIP: record current transforms, update the same ten buttons' final transforms,
  // then animate the inverse to identity. Never clone, reparent, or replace a circle.
  this.root.dataset.preparing='false';
  const first=this.circles.map(c=>getComputedStyle(c).transform);this.mode=next;this.root.dataset.mode=next;
  const destinations=this.positions(next);
  this.circles.forEach((circle,i)=>{circle.style.transform=this.transform(destinations[i]);circle.setAttribute('aria-label',next==='behind'?`Behind ${number(i)}: ${behindData[i].title}`:`Track ${number(i)}: ${trackData[i].title}`);});
  this.animations=this.circles.map((circle,i)=>{const keys=[{transform:first[i]}];if(next==='behind'&&!reduced){const p=this.positions('listen')[i];keys.push({transform:this.transform({x:p.x+p.size*.02,y:p.y+p.size*.02,size:p.size*.96}),offset:.12});}keys.push({transform:this.transform(destinations[i])});return circle.animate(keys,{duration,delay:i*stagger,easing:'cubic-bezier(.65,0,.18,1)',fill:'backwards'});});
  this.later(()=>{if(next==='behind')this.root.dataset.revealed='true';},reduced?0:900);
  await Promise.all(this.animations.map(a=>a.finished.catch(()=>{})));if(this.destroyed)return;
  this.animations.forEach(a=>a.cancel());this.animations=[];this.locked=false;this.root.removeAttribute('aria-busy');
  this.root.querySelectorAll('[data-mode-target]').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed',String(b.dataset.modeTarget===next));});
  const behind=next==='behind';this.$('.comeback-project__listen').inert=behind;this.$('.comeback-project__listen').setAttribute('aria-hidden',String(behind));this.$('.comeback-project__behind').inert=!behind;this.$('.comeback-project__behind').setAttribute('aria-hidden',String(!behind));

  behind?this.selectBehind(this.activeBehind):this.selectTrack(this.activeTrack);this.syncRotations();this.layout();this.resizePending=false;
  this.$('.comeback-project__mode-announcement').textContent=behind?'Behind mode. Explore ten chapters in the making of the album.':'Listen mode. Explore the ten tracks.';
 }
 slowRotations(duration){return new Promise(resolve=>{const start=performance.now();const tick=now=>{if(this.destroyed){resolve();return;}const p=Math.min(1,(now-start)/duration);this.rotations.forEach(a=>a.playbackRate=1-p);if(p<1)this.rotationFrame=requestAnimationFrame(tick);else{this.rotations.forEach(a=>a.pause());resolve();}};this.rotationFrame=requestAnimationFrame(tick);});}
 async play(){const index=+this.$('[data-play]').dataset.play;const t=trackData[index];if(!t.audio){this.toast('아직 공개되지 않은 음원입니다. 실제 음원 URL을 연결하면 60초 미리듣기가 활성화됩니다.');return;}
  if(this.activeTrack===index&&!this.audio.paused){this.audio.pause();this.updatePlayer(false);return;}this.selectTrack(index);const src=new URL(t.audio,import.meta.url).href;if(this.audio.src!==src)this.audio.src=src;try{await this.audio.play();if(!this.destroyed)this.updatePlayer(true);}catch{this.toast('오디오를 재생할 수 없습니다. 음원 파일을 확인해주세요.');}}
 updatePlayer(playing){const play=this.$('[data-play]');if(play){play.classList.toggle('is-playing',playing);play.setAttribute('aria-label',`${playing?'Pause':'Play'} preview`);}this.$('.comeback-project__wave')?.classList.toggle('is-playing',playing);}
 stopAudio(){this.audio.pause();this.updatePlayer(false);}
 openMedia(){const d=behindData[this.activeBehind];this.$('.comeback-project__dialog-content').innerHTML=`<h2>${esc(d.videoTitle)}</h2>${d.video?`<video controls playsinline poster="${esc(d.thumbnail)}" src="${esc(d.video)}"></video>`:`<img src="${esc(d.thumbnail)}" alt="${esc(d.title)} concept artwork"><p>이 비하인드 콘텐츠는 임시 비주얼입니다. 실제 영상이 준비되면 comebackData.js의 video 경로만 교체해주세요.</p>`}<p>${esc(d.description)}</p>`;this.$('dialog').showModal();}
 toast(message){const box=this.$('.comeback-project__toast');box.textContent=message;box.hidden=false;if(this.toastTimer){clearTimeout(this.toastTimer);this.timers.delete(this.toastTimer);}this.toastTimer=this.later(()=>box.hidden=true,4500);}
 destroy(){this.destroyed=true;this.abort.abort();this.resize.disconnect();this.observer.disconnect();cancelAnimationFrame(this.rotationFrame);cancelAnimationFrame(this.pointerFrame);this.infoAnimation?.cancel();this.animations.forEach(a=>a.cancel());this.rotations.forEach(a=>a.cancel());this.timers.forEach(clearTimeout);this.stopAudio();this.audio.removeAttribute('src');this.audio.load();if(this.$('dialog').open)this.$('dialog').close();}
}

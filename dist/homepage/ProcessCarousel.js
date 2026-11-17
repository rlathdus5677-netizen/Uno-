// Native horizontal scrolling, with one shared center/scale calculation for every input.
export class ProcessCarousel {
 constructor(rail,{previous,next,reducedMotion,progress}){
  this.rail=rail;this.previous=previous;this.next=next;this.motion=reducedMotion;this.progress=progress;
  this.abort=new AbortController();this.cards=[];this.activeIndex=0;this.frame=0;this.scrollFrame=0;this.timer=0;this.suppressUntil=0;
  const signal=this.abort.signal;
  rail.addEventListener('scroll',()=>{this.queueVisuals();this.scheduleSnap();},{passive:true,signal});
  rail.addEventListener('wheel',()=>{this.cancelMovement();this.scheduleSnap();},{passive:true,signal});
  rail.addEventListener('pointerdown',e=>{
   if(e.pointerType==='mouse'&&e.button!==0)return;
   this.cancelMovement();clearTimeout(this.timer);
   this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,scroll:rail.scrollLeft,mouse:e.pointerType==='mouse',dragging:false};
  },{signal});
  rail.addEventListener('pointermove',e=>{
   const pointer=this.pointer;if(!pointer||pointer.id!==e.pointerId)return;
   const delta=e.clientX-pointer.x;
   if(!pointer.mouse&&!pointer.dragging&&Math.abs(e.clientY-pointer.y)>Math.abs(delta))return;
   if(Math.abs(delta)>7&&!pointer.dragging){pointer.dragging=true;rail.dataset.dragging='true';rail.setPointerCapture(e.pointerId);}
   if(pointer.dragging){rail.scrollLeft=pointer.scroll-delta;e.preventDefault();}
  },{signal});
  const release=e=>{
   const pointer=this.pointer;if(!pointer||pointer.id!==e.pointerId)return;
   this.pointer=null;delete rail.dataset.dragging;
   if(pointer.dragging){this.suppressUntil=performance.now()+250;if(rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);}
   this.scheduleSnap();
  };
  window.addEventListener('pointerup',release,{signal});window.addEventListener('pointercancel',release,{signal});
  // Touch starts with implicit capture on a card; transferring capture to the rail
  // must not be mistaken for the end of that gesture.
  rail.addEventListener('lostpointercapture',e=>{if(e.target===rail&&!rail.hasPointerCapture(e.pointerId))release(e);},{signal});
  rail.addEventListener('dragstart',e=>e.preventDefault(),{signal});
  rail.addEventListener('focusin',e=>{const i=this.cards.indexOf(e.target);if(i>=0&&!this.pointer)this.center(i);},{signal});
  rail.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?this.cards.length-1:(this.targetIndex??this.activeIndex)+(e.key==='ArrowRight'?1:-1);
   this.center(i);
  },{signal});
  this.resize=new ResizeObserver(()=>{const i=this.targetIndex??this.activeIndex;this.center(i,{animate:false});});this.resize.observe(rail);
  this.motion.addEventListener('change',()=>this.center(this.targetIndex??this.activeIndex,{animate:false}),{signal});
 }
 setCards(cards){
  const previousId=this.cards[this.targetIndex??this.activeIndex]?.dataset.processId;
  this.cancelMovement();this.pointer=null;delete this.rail.dataset.dragging;
  this.cards=cards;
  const retained=cards.findIndex(c=>c.dataset.processId===previousId);
  this.center(retained>=0?retained:Math.floor((cards.length-1)/2),{animate:false});
 }
 destination(index){const card=this.cards[index];return card.offsetLeft+card.offsetWidth/2-this.rail.clientWidth/2;}
 nearest(){let nearest=0,distance=Infinity;this.cards.forEach((_,i)=>{const d=Math.abs(this.destination(i)-this.rail.scrollLeft);if(d<distance){distance=d;nearest=i;}});return nearest;}
 queueVisuals(){if(!this.scrollFrame)this.scrollFrame=requestAnimationFrame(()=>{this.scrollFrame=0;this.updateVisuals();});}
 updateVisuals(){
  if(!this.cards.length)return;
  const index=this.nearest();this.activeIndex=index;
  const span=this.cards[0].offsetWidth+parseFloat(getComputedStyle(this.rail).gap);
  this.cards.forEach((card,i)=>{
   const proximity=Math.max(0,1-Math.abs(this.destination(i)-this.rail.scrollLeft)/span);
   const scale=.9+.1*proximity*proximity*(3-2*proximity);
   card.style.setProperty('--process-card-scale',scale.toFixed(4));
   if(i===index)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
  });
  if(this.progress){
   this.progress.style.setProperty('--process-progress-count',this.cards.length);
   this.progress.style.setProperty('--process-progress-index',index);
   this.progress.setAttribute('aria-valuemax',this.cards.length);
   this.progress.setAttribute('aria-valuenow',index+1);
   this.progress.setAttribute('aria-valuetext',`${index+1} / ${this.cards.length}`);
  }
  const selected=this.targetIndex??index;
  this.previous.disabled=selected===0;this.next.disabled=selected===this.cards.length-1;
 }
 scheduleSnap(){
  clearTimeout(this.timer);
  if(this.pointer||this.frame)return;
  this.timer=setTimeout(()=>{if(!this.pointer&&!this.frame&&this.cards.length){const i=this.nearest();if(Math.abs(this.destination(i)-this.rail.scrollLeft)>.5)this.center(i);}},160);
 }
 cancelMovement(){cancelAnimationFrame(this.frame);this.frame=0;this.targetIndex=null;clearTimeout(this.timer);}
 center(index,{animate=true}={}){
  if(!this.cards.length)return;
  index=Math.max(0,Math.min(this.cards.length-1,index));
  this.cancelMovement();this.targetIndex=index;
  const from=this.rail.scrollLeft,to=this.destination(index);
  if(!animate||this.motion.matches||Math.abs(to-from)<.5){this.rail.scrollLeft=to;this.targetIndex=null;this.updateVisuals();return;}
  const start=performance.now();
  const tick=now=>{
   const progress=Math.min(1,(now-start)/550),eased=1-Math.pow(1-progress,4);
   this.rail.scrollLeft=from+(to-from)*eased;this.updateVisuals();
   if(progress<1)this.frame=requestAnimationFrame(tick);
   else{this.frame=0;this.targetIndex=null;this.rail.scrollLeft=to;this.updateVisuals();}
  };
  this.frame=requestAnimationFrame(tick);this.updateVisuals();
 }
 step(direction){this.center((this.targetIndex??this.activeIndex)+direction);}
 select(card){
  if(performance.now()<this.suppressUntil)return false;
  const i=this.cards.indexOf(card);if(i<0)return false;
  if(Math.abs(this.destination(i)-this.rail.scrollLeft)>.5||this.frame){this.center(i);return false;}
  return true;
 }
 destroy(){this.abort.abort();this.resize.disconnect();this.cancelMovement();cancelAnimationFrame(this.scrollFrame);}
}

// Native horizontal scrolling, with one shared center/scale calculation for every input.
export class ProcessCarousel {
 constructor(rail,{previous,next,reducedMotion,progress}){
  this.rail=rail;this.previous=previous;this.next=next;this.motion=reducedMotion;this.progress=progress;
  this.abort=new AbortController();this.cards=[];this.itemCount=0;this.activeIndex=0;this.physicalIndex=0;this.frame=0;this.scrollFrame=0;this.timer=0;this.suppressUntil=0;
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
  rail.addEventListener('focusin',e=>{const i=this.cards.indexOf(e.target);if(i>=0&&!this.pointer)this.centerAt(i);},{signal});
  rail.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();if(e.key==='Home'||e.key==='End')this.center(e.key==='Home'?0:this.itemCount-1);else this.step(e.key==='ArrowRight'?1:-1);
  },{signal});
  this.resize=new ResizeObserver(()=>{const i=this.targetIndex??this.physicalIndex;this.centerAt(i,{animate:false});});this.resize.observe(rail);
  this.motion.addEventListener('change',()=>this.centerAt(this.targetIndex??this.physicalIndex,{animate:false}),{signal});
 }
 setCards(cards){
  const previousId=this.cards[this.targetIndex??this.physicalIndex]?.dataset.processId;
  this.cancelMovement();this.pointer=null;delete this.rail.dataset.dragging;
  this.itemCount=cards.length;
  // One original data set; buffer copies are generated only for rendering.
  this.cards=Array.from({length:7},(_,cycle)=>cards.map((card,i)=>{
   const copy=cycle===3?card:card.cloneNode(true);copy.dataset.originalIndex=i;
   copy.removeAttribute('aria-current');return copy;
  })).flat();
  this.rail.replaceChildren(...this.cards);
  const retained=cards.findIndex(c=>c.dataset.processId===previousId);
  this.centerAt(3*this.itemCount+(retained>=0?retained:Math.floor((cards.length-1)/2)),{animate:false});
 }
 // Recycle a full cycle outside the viewport. Visible cards keep their DOM,
 // transforms, and viewport positions, including while dragging or animating.
 recycle(){
  if(!this.itemCount)return;
  let index=this.nearest(),moved=0;
  const n=this.itemCount,period=this.destination(n)-this.destination(0);
  while(index<2*n||index>=5*n){
   const forward=index>=5*n;
   const group=forward?this.cards.splice(0,n):this.cards.splice(-n);
   if(forward){this.rail.append(...group);this.cards.push(...group);}else{this.rail.prepend(...group);this.cards.unshift(...group);}
   const shift=forward?-period:period,indices=forward?-n:n;
   this.rail.scrollLeft+=shift;
   if(this.pointer)this.pointer.scroll+=shift;
   if(this.movement){this.movement.from+=shift;this.movement.to+=shift;}
   if(this.targetIndex!=null)this.targetIndex+=indices;
   index+=indices;moved++;
   if(moved>7)break;
  }
 }
 destination(index){const card=this.cards[index];return card.offsetLeft+card.offsetWidth/2-this.rail.clientWidth/2;}
 nearest(){let nearest=0,distance=Infinity;this.cards.forEach((_,i)=>{const d=Math.abs(this.destination(i)-this.rail.scrollLeft);if(d<distance){distance=d;nearest=i;}});return nearest;}
 queueVisuals(){if(!this.scrollFrame)this.scrollFrame=requestAnimationFrame(()=>{this.scrollFrame=0;this.updateVisuals();});}
 updateVisuals(){
  if(!this.cards.length)return;
  this.recycle();
  const index=this.nearest();this.physicalIndex=index;this.activeIndex=+this.cards[index].dataset.originalIndex;
  const span=this.cards[0].offsetWidth+parseFloat(getComputedStyle(this.rail).gap);
  this.cards.forEach((card,i)=>{
   const proximity=Math.max(0,1-Math.abs(this.destination(i)-this.rail.scrollLeft)/span);
   const scale=1+.15*proximity*proximity*(3-2*proximity);
   const delta=this.destination(i)-this.rail.scrollLeft;
   const shift=Math.sign(delta)*this.cards[0].offsetWidth*.075*Math.min(1,Math.abs(delta)/span);
   card.style.setProperty('--process-card-shift',`${shift.toFixed(3)}px`);
   card.inert=Math.abs(delta)>this.rail.clientWidth/2+card.offsetWidth*.6;
   card.style.setProperty('--process-card-scale',scale.toFixed(4));
   if(i===index)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
  });
  if(this.progress){
   this.progress.style.setProperty('--process-progress-count',this.itemCount);
   this.progress.style.setProperty('--process-progress-index',this.activeIndex);
   this.progress.setAttribute('aria-valuemax',this.itemCount);
   this.progress.setAttribute('aria-valuenow',this.activeIndex+1);
   this.progress.setAttribute('aria-valuetext',`${this.activeIndex+1} / ${this.itemCount}`);
  }
  this.previous.disabled=this.itemCount<2;this.next.disabled=this.itemCount<2;
 }
 scheduleSnap(){
  clearTimeout(this.timer);
  if(this.pointer||this.frame)return;
  this.timer=setTimeout(()=>{if(!this.pointer&&!this.frame&&this.cards.length){const i=this.nearest();if(Math.abs(this.destination(i)-this.rail.scrollLeft)>.5)this.centerAt(i);}},160);
 }
 cancelMovement(){cancelAnimationFrame(this.frame);this.frame=0;this.movement=null;this.targetIndex=null;clearTimeout(this.timer);}
 center(index,options){
  if(!this.itemCount)return;
  index=((index%this.itemCount)+this.itemCount)%this.itemCount;
  const anchor=this.targetIndex??this.nearest();
  const matches=this.cards.map((card,i)=>({i,logical:+card.dataset.originalIndex})).filter(c=>c.logical===index);
  const closest=matches.reduce((a,b)=>Math.abs(a.i-anchor)<=Math.abs(b.i-anchor)?a:b).i;
  this.centerAt(closest,options);
 }
 centerAt(index,{animate=true}={}){
  if(!this.cards.length)return;
  index=Math.max(0,Math.min(this.cards.length-1,index));
  this.cancelMovement();this.targetIndex=index;
  const from=this.rail.scrollLeft,to=this.destination(index);
  if(!animate||this.motion.matches||Math.abs(to-from)<.5){this.rail.scrollLeft=to;this.targetIndex=null;this.updateVisuals();return;}
  const start=performance.now(),movement={from,to};this.movement=movement;
  const tick=now=>{
   const progress=Math.min(1,(now-start)/550),eased=1-Math.pow(1-progress,4);
   this.rail.scrollLeft=movement.from+(movement.to-movement.from)*eased;this.updateVisuals();
   if(progress<1)this.frame=requestAnimationFrame(tick);
   else{this.frame=0;this.targetIndex=null;this.rail.scrollLeft=movement.to;this.movement=null;this.updateVisuals();}
  };
  this.frame=requestAnimationFrame(tick);this.updateVisuals();
 }
 step(direction){this.centerAt((this.targetIndex??this.nearest())+direction);}
 select(card){
  if(performance.now()<this.suppressUntil)return false;
  const i=this.cards.indexOf(card);if(i<0)return false;
  if(Math.abs(this.destination(i)-this.rail.scrollLeft)>.5||this.frame){this.centerAt(i);return false;}
  return true;
 }
 destroy(){this.abort.abort();this.resize.disconnect();this.cancelMovement();cancelAnimationFrame(this.scrollFrame);}
}

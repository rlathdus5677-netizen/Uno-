const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bannerUrl=new URL('./assets/event/popup-envelope.png',import.meta.url).href;
const logoUrl=new URL('./assets/figma/header-logo-latest.svg',import.meta.url).href;
const STORAGE_KEY='uno-event-popup-skip';
const storage={
 get(){try{return sessionStorage.getItem(STORAGE_KEY)==='1'}catch{return false}},
 set(){try{sessionStorage.setItem(STORAGE_KEY,'1')}catch{}}
};
const closeIcon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

// First-visit event popup. "오늘은 그만 보기" is kept for the current browser session only,
// so it stays hidden while the user navigates (including back to HOME) and returns on a new visit.
export class EventPopup{
 constructor(root,{onVote}={}){
  this.onVote=onVote;this.abort=new AbortController();
  const dialog=this.dialog=document.createElement('dialog');
  dialog.className='uno-event';dialog.tabIndex=-1;dialog.setAttribute('aria-labelledby','uno-event-title');
  dialog.innerHTML=`<button type="button" class="uno-event__close" data-event-action="close" aria-label="이벤트 팝업 닫기">${closeIcon}</button>
   <div class="uno-event__banner">
    <img class="uno-event__art" src="${esc(bannerUrl)}" alt="보라색 봉투에 담긴 JENA 콘서트 티켓" draggable="false">
    <div class="uno-event__brand"><img src="${esc(logoUrl)}" alt="UNO"><span>ENTERTAINMENT</span></div>
    <p class="uno-event__eyebrow">UNO 이벤트</p>
    <h2 id="uno-event-title" class="uno-event__title"><em>티켓값</em>은 <em>UNO</em>가 낼게</h2>
    <p class="uno-event__copy">JENA의 컴백무드에 <mark>한 표,</mark> 내 손엔 <mark>꽁짜표</mark></p>
    <p class="uno-event__period">11.27 - 12.24</p>
    <button type="button" class="uno-event__cta" data-event-action="vote">투표하러가기<svg viewBox="0 0 12 28" aria-hidden="true"><path d="m2 2 8 12-8 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
   </div>
   <div class="uno-event__footer"><label class="uno-event__skip"><input type="checkbox" data-event-skip><span>오늘은 그만 보기</span></label></div>`;
  root.append(dialog);
  const signal=this.abort.signal;
  dialog.addEventListener('click',event=>{
   const action=event.target.closest('[data-event-action]')?.dataset.eventAction;
   if(action==='close'){this.close();return;}
   if(action==='vote'){this.close();this.onVote?.();return;}
   if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)this.close();}
  },{signal});
  dialog.addEventListener('cancel',event=>{event.preventDefault();this.close();},{signal});
 }
 get skipped(){return storage.get()}
 openIfAllowed(){
  if(storage.get())return false;
  return this.open();
 }
 // Explicit EVENT navigation can reopen the existing popup even after dismissal.
 open(){
  if(this.dialog.open)return false;
  this.dialog.querySelector('[data-event-skip]').checked=false;
  this.dialog.showModal();this.dialog.focus({preventScroll:true});
  return true;
 }
 close(){
  if(this.dialog.querySelector('[data-event-skip]').checked)storage.set();
  if(this.dialog.open)this.dialog.close();
 }
 destroy(){this.abort.abort();if(this.dialog.open)this.dialog.close();this.dialog.remove();}
}

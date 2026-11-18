const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=name=>new URL(`./assets/figma/${name}`,import.meta.url).href;

// A separate native modal occupies the top layer without replacing the outfit list.
// This is the completion screen prototype; no vote or event API is called here.
export class VoteCompleteModal {
 constructor(root){
  this.dialog=document.createElement('dialog');
  this.dialog.className='uno-vote-complete';
  this.dialog.setAttribute('aria-labelledby','uno-vote-complete-title');
  this.dialog.setAttribute('aria-describedby','uno-vote-complete-description');
  this.dialog.setAttribute('aria-modal','true');
  root.append(this.dialog);this.abort=new AbortController();this.selectedOutfit=null;
  const signal=this.abort.signal;
  this.dialog.addEventListener('keydown',event=>{
   if(event.key!=='Tab')return;
   const buttons=[...this.dialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  },{signal});
  this.dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopPropagation();this.close();},{signal});
  this.dialog.addEventListener('close',()=>this.restoreFocus(),{signal});
  this.dialog.addEventListener('click',event=>{
   if(event.target.closest('[data-vote-close]')){event.stopPropagation();this.close();return;}
   if(event.target===this.dialog){const r=this.dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)this.close();}
  },{signal});
 }
 open(outfit,trigger){
  if(this.dialog.open||!outfit)return;
  this.selectedOutfit=outfit;this.trigger=trigger;
  const title=outfit.title.split(',').map(part=>part.trim()).join(', ');
  this.dialog.innerHTML=`<div class="uno-vote-complete__header"><button type="button" class="uno-vote-complete__close" data-vote-close aria-label="투표 완료 팝업 닫기"><img src="${asset('vote-close.svg')}" alt="" aria-hidden="true"></button></div>
   <div class="uno-vote-complete__body"><div class="uno-vote-complete__summary">
    <div class="uno-vote-complete__message"><img class="uno-vote-complete__icon" src="${asset('vote-complete-icon.svg')}" alt="" aria-hidden="true"><div><h2 id="uno-vote-complete-title">투표가 완료됐어요!</h2><p id="uno-vote-complete-description">당신의 한 표가 아티스트의 컴백에 반영됩니다.</p></div></div>
    <div class="uno-vote-complete__selection"><p class="uno-vote-complete__selection-label">내가 고른 컴백 무드</p><div class="uno-vote-complete__selection-row"><span class="uno-vote-complete__heart" aria-hidden="true">♥</span><div class="uno-vote-complete__selection-copy"><h3>${esc(title)}</h3><p>투표 결과는 실시간으로 반영돼요.</p></div></div></div>
   </div><p class="uno-vote-complete__event"><span aria-hidden="true">✦</span><strong>무료 티켓 이벤트에 자동 응모됐어요.</strong></p><button type="button" class="uno-vote-complete__confirm" data-vote-close>확인</button></div>`;
  this.dialog.showModal();this.dialog.querySelector('.uno-vote-complete__close').focus({preventScroll:true});
 }
 close(){if(this.dialog.open)this.dialog.close();this.restoreFocus();}
 restoreFocus(){
  const trigger=this.trigger;this.trigger=null;
  if(trigger?.isConnected&&trigger.closest('dialog')?.open)trigger.focus({preventScroll:true});
 }
 destroy(){this.close();this.abort.abort();this.dialog.remove();}
}

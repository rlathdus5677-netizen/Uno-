import {VoteCompleteModal} from './VoteCompleteModal.js';
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageArrow = direction => `<svg viewBox="0 0 20 20" aria-hidden="true" fill="none"><path d="${direction==='previous'?'m12 5-5 5 5 5':'m8 5 5 5-5 5'}" stroke="currentColor" stroke-width="1.2"/></svg>`;
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S2 15 2 8.5C2 2 10 1 12 6c2-5 10-4 10 2.5C22 15 12 21 12 21Z"/></svg>';

export class ParticipationModal {
 constructor(root){
  this.dialog=document.createElement('dialog');this.dialog.className='uno-participation';this.dialog.setAttribute('aria-labelledby','uno-participation-title');root.append(this.dialog);
  this.abort=new AbortController();this.favorites=new Set();this.voteComplete=new VoteCompleteModal(root);
  const signal=this.abort.signal;
  this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close()},{signal});
  this.dialog.addEventListener('close',()=>this.restoreScroll(),{signal});
  this.dialog.addEventListener('click',e=>{
   const action=e.target.closest('[data-participation-action]');
   if(action){
    const kind=action.dataset.participationAction;
    if(kind==='close')this.close();
    if(kind==='sort'){this.sort=action.dataset.sort;this.page=0;this.renderResults();}
    if(kind==='favorite'){const id=action.dataset.id;const wasFavorite=this.favorites.has(id);wasFavorite?this.favorites.delete(id):this.favorites.add(id);this.renderResults();const trigger=this.dialog.querySelector(`[data-participation-action="favorite"][data-id="${id}"]`);trigger?.focus({preventScroll:true});const outfit=this.content.items.find(item=>item.id===id);if(!wasFavorite&&outfit?.voteEnabled)this.voteComplete.open(outfit,trigger);}
    if(kind==='page'){const results=this.dialog.querySelector('.uno-participation__results');results.style.minHeight=`${results.getBoundingClientRect().height}px`;this.page=Number(action.dataset.page);this.renderResults();this.dialog.querySelector('.uno-participation__page.active')?.focus({preventScroll:true});}
    return;
   }
   if(e.target===this.dialog){const r=this.dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)this.close();}
  },{signal});
 }
 open(content,trigger){
  if(this.dialog.open||content.type!=='artist-archive')return;
  this.content=content;this.sort='popular';this.page=0;this.trigger=trigger;
  this.dialog.innerHTML=`<button type="button" class="uno-participation__close" data-participation-action="close" aria-label="팝업 닫기">×</button><div class="uno-participation__content"><h2 id="uno-participation-title">${esc(content.title)}</h2><div class="uno-participation__toolbar"><div class="uno-participation__sort" role="group" aria-label="스타일 정렬 및 필터">${[['all','모두보기'],['popular','인기순'],['newest','최신순'],['oldest','과거순'],['saved','찜한']].map(([id,label])=>`<button type="button" data-participation-action="sort" data-sort="${id}" aria-pressed="false">${label}</button>`).join('')}</div><p>${esc(content.description)}</p></div><div class="uno-participation__results" aria-live="polite"></div><nav class="uno-participation__pages" aria-label="스타일 페이지"></nav></div>`;
  this.renderResults();
  this.scroll={x:scrollX,y:scrollY,body:document.body.style.cssText,html:document.documentElement.style.cssText};
  const scrollbar=innerWidth-document.documentElement.clientWidth;
  // Keep the layout viewport width unchanged while locking document scrolling.
  document.documentElement.style.overflow='hidden';
  Object.assign(document.body.style,{position:'fixed',top:`${-this.scroll.y}px`,left:`${-this.scroll.x}px`,width:'100%',paddingRight:`${scrollbar}px`,boxSizing:'border-box'});
  this.dialog.showModal();this.dialog.querySelector('.uno-participation__close').focus({preventScroll:true});
 }
 renderResults(){
  const data=this.content;let items=data.items.filter(item=>this.sort!=='saved'||this.favorites.has(item.id));
  items=[...items].sort(this.sort==='popular'?(a,b)=>b.votes-a.votes:this.sort==='newest'?(a,b)=>b.order-a.order:(a,b)=>a.order-b.order);
  const pages=data.pageCount||Math.max(1,Math.ceil(items.length/data.pageSize));this.page=Math.max(0,Math.min(this.page,pages-1));
  const pageItems=items.slice(this.page*data.pageSize,(this.page+1)*data.pageSize);
  this.dialog.querySelectorAll('[data-sort]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sort===this.sort)));
  this.dialog.querySelector('.uno-participation__results').innerHTML=pageItems.length?`<div class="uno-participation__grid">${pageItems.map(item=>`<article class="uno-participation__card"><img src="${esc(item.image)}" alt="${esc(item.title)} 스타일" draggable="false"><button type="button" class="uno-participation__favorite" data-participation-action="favorite" data-id="${esc(item.id)}" aria-label="${esc(item.title)} 찜" aria-pressed="${this.favorites.has(item.id)}">${heart}</button><div class="uno-participation__card-copy"><h3>${esc(item.title)}</h3><p>${item.votes.toLocaleString('ko-KR')} 팬들이 투표했어요.</p></div></article>`).join('')}</div>`:this.page>0?'<p class="uno-participation__empty" data-page-pending>콘텐츠 준비 중입니다.</p>':'<p class="uno-participation__empty">아직 찜한 스타일이 없습니다.</p>';
  // Number buttons and arrows share the same zero-based page state.
  this.dialog.querySelector('.uno-participation__pages').innerHTML=`<button type="button" data-participation-action="page" data-page="${this.page-1}" class="uno-participation__page-arrow" aria-label="이전 페이지" ${this.page===0?'disabled':''}>${pageArrow('previous')}</button>${Array.from({length:pages},(_,i)=>`<button type="button" data-participation-action="page" data-page="${i}" class="uno-participation__page${i===this.page?' active':''}" aria-label="${i+1}페이지" ${i===this.page?'aria-current="page"':''}>${i+1}</button>`).join('')}<button type="button" data-participation-action="page" data-page="${this.page+1}" class="uno-participation__page-arrow" aria-label="다음 페이지" ${this.page===pages-1?'disabled':''}>${pageArrow('next')}</button>`;
 }
 close(){this.voteComplete.close();if(this.dialog.open)this.dialog.close();this.restoreScroll();}
 restoreScroll(){
  if(!this.scroll)return;const saved=this.scroll;this.scroll=null;
  document.body.style.cssText=saved.body;document.documentElement.style.cssText=saved.html;
  window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
  if(this.trigger?.isConnected)this.trigger.focus({preventScroll:true});
 }
 destroy(){this.close();this.voteComplete.destroy();this.abort.abort();this.dialog.remove();}
}

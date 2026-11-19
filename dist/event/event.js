import {renderSiteHeader} from '../homepage/SiteHeader.js';
import {NavigationMenu} from '../homepage/NavigationMenu.js';
import {navigationData,uiAssets} from '../homepage/homepageData.js';
import {eventData as data} from './eventData.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const homeUrl=target=>new URL(`../homepage/${target}`,import.meta.url).href;
export class EventPage{
 constructor(root){
  this.root=root;this.abort=new AbortController();this.selectedMood=data.moods[0].id;this.render();
  this.menu=new NavigationMenu(root,{items:navigationData,logo:uiAssets.mobileLogo,burger:uiAssets.menuBurger,close:uiAssets.menuClose,button:root.querySelector('[data-home-action=toggle-menu]')});
  this.menu.dialog.querySelectorAll('[data-home-action=navigate]').forEach(e=>{e.href=homeUrl(e.dataset.target);e.removeAttribute('aria-current')});
  this.menu.dialog.querySelector('[data-home-action=event]').setAttribute('aria-current','page');
  this.bind();this.updateCountdown();this.timer=setInterval(()=>this.updateCountdown(),1000);
 }
 render(){this.root.innerHTML=`${renderSiteHeader({homeHref:homeUrl('#home'),homeBase:homeUrl(''),activePage:'event',compact:true})}
 <main>
  <section class="event-hero" aria-labelledby="event-title">
   <picture class="event-media"><source media="(min-width:1025px)" srcset="${data.heroDesktop}"><img class="event-hero__background" src="${data.hero}" alt="보라색 봉투 안의 JENA 콘서트 티켓" fetchpriority="high"></picture>
   <div class="event-hero__brand"><img src="${data.logo}" alt="UNO"><span>ENTERTAINMENT</span></div>
   <div class="event-hero__intro"><div class="event-hero__eyebrow"><span>UNO 이벤트</span></div>
    <h1 id="event-title"><em>티켓값</em>은 <em>UNO</em>가 낼게</h1>
    <p>JENA의 컴백무드에 <mark>한 표,</mark> 내 손엔 <mark>꽁짜표</mark></p>
   </div>
   <div class="event-hero__bottom"><div class="event-hero__period"><span>${data.period}</span></div><a class="event-hero__cta" href="#event-vote">투표하러가기<img src="${data.chevron}" alt="" aria-hidden="true"></a></div>
  </section>
  <section class="event-countdown" aria-labelledby="countdown-title"><h2 id="countdown-title">투표 종료까지</h2><p class="event-countdown__days" data-days>D−00</p>
   <div class="event-clock" role="timer" aria-label="투표 종료까지 남은 시간">${['DAYS','HRS','MINS','SECS'].map((unit,i)=>`${i?'<span class="event-clock__colon" aria-hidden="true">:</span>':''}<div><span data-countdown="${i}">00</span><small>${unit}</small></div>`).join('')}</div><p class="event-countdown__notice">12월 24일, JENA의 컴백 무드 투표가 종료됩니다.</p>
  </section>
  <section class="event-how" aria-labelledby="how-title"><p class="event-label">HOW TO JOIN</p><h2 id="how-title">세 번의 터치로<br>응모까지 끝</h2>
   <ol class="event-steps">${data.steps.map(([meta,title],i)=>`<li><span class="event-steps__number">0${i+1}</span><div><p>${esc(meta)}</p><h3>${esc(title)}</h3></div></li>`).join('')}</ol><p class="event-entry">투표 완료 <span>=</span> 티켓 추첨 자동 응모</p>
  </section>
  <section class="event-vote" id="event-vote" aria-labelledby="vote-title"><p class="event-vote__label">EVENT 1</p><h2 id="vote-title">JENA의 컴백무드에<br>한 표를 던져요</h2><p class="event-vote__description">마음에 드는 무드 하나를 골라 투표해 주세요.</p>
   <fieldset class="event-moods"><legend class="event-sr">투표할 컴백 무드 선택</legend>${data.moods.map((m,i)=>`<label class="event-mood"><input type="radio" name="mood" value="${m.id}" ${i===0?'checked':''}><img class="event-mood__image" src="${m.image}" style="object-position:${m.imagePosition}" alt="${esc(m.title)} 무드 이미지"><span class="event-mood__copy"><span class="event-mood__meta">${m.label}</span><strong>${esc(m.title)}</strong><span class="event-mood__description">${esc(m.description)}</span></span><span class="event-mood__indicator" aria-hidden="true"></span></label>`).join('')}</fieldset>
   <button class="event-primary" type="button" data-event-vote>이 무드에 투표하기</button><p class="event-vote__count">지금까지 ${data.participationCount}명이 참여했어요</p>
  </section>
  <section class="event-benefit" aria-labelledby="benefit-title"><img class="event-benefit__light" src="${data.light}" alt="" aria-hidden="true"><div class="event-benefit__eyebrow"><p>EVENT BENEFIT</p><p>JENA CONCERT TICKET</p></div><picture class="event-media"><source media="(min-width:1025px)" srcset="${data.ticketDesktop}"><source media="(max-width:767px)" srcset="${data.ticketMobile} 2x"><img class="event-benefit__ticket" src="${data.ticket}" alt="JENA 콘서트 티켓"></picture><h2 id="benefit-title">티켓값은<br><em>UNO</em>가 낼게</h2><div class="event-benefit__detail"><span>당첨 혜택</span><strong>JENA 콘서트 티켓</strong></div></section>
  <section class="event-notice" aria-labelledby="notice-title"><p class="event-label">EVENT NOTICE</p><h2 id="notice-title"><img src="${data.warning}" alt="" aria-hidden="true">꼭 확인해주세요</h2><ul>${data.notices.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></section>
  <section class="event-final" aria-labelledby="final-title"><p class="event-label">READY TO VOTE?</p><h2 id="final-title">당신의 한 표로<br>JENA의 다음 장면을 완성하세요.</h2><a class="event-primary" href="${homeUrl('#process')}">UNO에서 투표하러 가기<img src="${data.arrow}" alt="" aria-hidden="true"></a><p class="event-final__notice">세 번째 PROCESS 섹션에서 참가하실 수 있습니다.</p></section>
 </main><footer class="event-footer"><p>UNO ENTERTAINMENT</p><p>UNIQUE + ONE</p></footer>
 <dialog class="event-dialog" aria-labelledby="event-dialog-title"><button class="event-dialog__close" type="button" data-dialog-close aria-label="닫기">×</button><h2 id="event-dialog-title"></h2><p data-dialog-copy></p><button class="event-primary" type="button" data-dialog-close>확인</button></dialog>`;}
 bind(){const signal=this.abort.signal;
  this.root.addEventListener('click',event=>{
   const control=event.target.closest('[data-home-action]');if(control){const action=control.dataset.homeAction;
    if(action==='toggle-menu'){this.menu.open();return;}
    if(action==='navigate'){event.preventDefault();this.menu.close();location.assign(homeUrl(control.dataset.target));return;}
    if(action==='event'){event.preventDefault();this.menu.close();return;}
    if(action==='login'){this.menu.close();this.openDialog('LOGIN','로그인 기능을 준비하고 있어요.');return;}
   }
   if(event.target.closest('[data-event-vote]')){const mood=data.moods.find(m=>m.id===this.selectedMood);this.openDialog('투표 기능을 준비 중이에요.',`선택한 무드: ${mood.title}\n현재는 투표와 티켓 추첨 응모가 접수되지 않습니다.`);}
   if(event.target.closest('[data-dialog-close]'))this.root.querySelector('.event-dialog').close();
  },{signal});
  this.root.querySelector('.event-moods').addEventListener('change',event=>{if(event.target.name==='mood')this.selectedMood=event.target.value},{signal});
  const dialog=this.root.querySelector('.event-dialog');dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()},{signal});
 }
 openDialog(title,copy){this.root.querySelector('#event-dialog-title').textContent=title;this.root.querySelector('[data-dialog-copy]').textContent=copy;this.root.querySelector('.event-dialog').showModal();}
 updateCountdown(now=Date.now()){
  const seconds=Math.max(0,Math.floor((Date.parse(data.endsAt)-now)/1000)),units=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
  this.root.querySelector('[data-days]').textContent=`D−${units[0]}`;this.root.querySelectorAll('[data-countdown]').forEach((e,i)=>e.textContent=String(units[i]).padStart(2,'0'));
 }
 destroy(){clearInterval(this.timer);this.abort.abort();this.menu.destroy();const dialog=this.root.querySelector('.event-dialog');if(dialog.open)dialog.close();}
}

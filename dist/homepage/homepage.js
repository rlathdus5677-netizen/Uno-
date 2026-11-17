import {ComebackProject} from '../comeback-project/ComebackProject.js';
import {ProcessCarousel} from './ProcessCarousel.js';
import {siteData,navigationData,heroData,processData,artistProcessData,upcomingLiveData,brandData,socialLinks,footerData} from './homepageData.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.2"/></svg>';
const externalArrow='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="m5 19 14-14M7 5h12v12" stroke="currentColor" stroke-width="1.2"/></svg>';
const socials={
 youtube:'<path d="M21 8a3 3 0 0 0-2-2c-2-.5-12-.5-14 0a3 3 0 0 0-2 2 27 27 0 0 0 0 8 3 3 0 0 0 2 2c2 .5 12 .5 14 0a3 3 0 0 0 2-2 27 27 0 0 0 0-8Z" fill="currentColor"/><path d="m10 9 5 3-5 3Z" fill="white"/>',
 tiktok:'<path d="M14 3h3c.3 2.3 1.7 3.9 4 4.3v3a9 9 0 0 1-4-1.5V16a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3Z" fill="currentColor"/>',
 facebook:'<path d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9Z" fill="currentColor"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>',
 x:'<path d="m4 3 16 18M20 3 4 21" stroke="currentColor" stroke-width="2"/><path d="M4 3h5l11 18h-5Z" stroke="currentColor" stroke-width="1.5" fill="none"/>'
};
export class UnoHomepage{
 constructor(root){
  this.root=root;this.activeCategory='all';this.abort=new AbortController();this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.scrollFrame=0;this.railAnimation=null;this.calendarUrl=null;
  this.render();this.archive=new ComebackProject(this.$('#uno-comeback-project'));this.carousel=new ProcessCarousel(this.$('.uno-homepage__rail'),{previous:this.$('[data-home-action=rail-prev]'),next:this.$('[data-home-action=rail-next]'),reducedMotion:this.motion});this.bind();this.renderCards();this.updateScrollUI();
  this.archiveObserver=new IntersectionObserver(([entry])=>{this.$('.uno-homepage__top').dataset.archive=String(entry.isIntersecting);},{threshold:0});this.archiveObserver.observe(this.$('.uno-homepage__archive'));
  requestAnimationFrame(()=>{const hash=location.hash;if(hash){const target=document.getElementById(hash.slice(1));target?.scrollIntoView({behavior:'instant'});}});
 }
 $(selector){return this.root.querySelector(selector)}
 render(){
  this.root.innerHTML=`
  <header class="uno-homepage__header" id="home">
   <a class="uno-homepage__logo" href="#home" data-home-action="navigate" data-target="#home" aria-label="UNO Entertainment 홈"><img src="${esc(siteData.logo)}" alt="UNO"><span>ENTERTAINMENT</span></a>
   <nav class="uno-homepage__nav" aria-label="메인 메뉴">${navigationData.map((n,i)=>`<a href="${esc(n.href)}" data-home-action="navigate" data-target="${esc(n.href)}" ${i===0?'aria-current="page"':''}>${esc(n.label)}</a>`).join('')}</nav>
   <button class="uno-homepage__login" type="button" data-home-action="login">LOGIN</button>
  </header>
  <main>
   <section class="uno-homepage__hero" aria-label="Live now">
    <img class="uno-homepage__hero-image" src="${esc(heroData.image)}" alt="${esc(heroData.alt)}" style="object-position:${esc(heroData.imagePosition)}" fetchpriority="high" draggable="false">
    <p class="uno-homepage__live-label"><i aria-hidden="true"></i>${esc(heroData.eyebrow)}</p>
    <div class="uno-homepage__hero-copy"><h1>${esc(heroData.headline)}</h1><p class="uno-homepage__hero-meta">${esc(heroData.metadata)}</p><button type="button" class="uno-homepage__text-link" data-home-action="live-preview">${esc(heroData.cta)}${arrow}</button></div>
   </section>
   <section class="uno-homepage__archive" id="comeback-archive" aria-label="Comeback Archive">
    <section id="uno-comeback-project" class="comeback-project" aria-label="UNO Comeback Archive"></section>
   </section>
   <section class="uno-homepage__process" id="process" aria-labelledby="uno-process-title">
    <p class="uno-homepage__section-label">${esc(processData.label)}</p><h2 class="uno-homepage__process-headline" id="uno-process-title">${esc(processData.headline)}</h2>
    <div class="uno-homepage__filters" id="join" role="group" aria-label="제작 과정 카테고리">${processData.filters.map(f=>`<button class="uno-homepage__filter" type="button" data-category="${esc(f.id)}" aria-pressed="${f.id==='all'}">${esc(f.label)}</button>`).join('')}</div>
    <div class="uno-homepage__rail-tools"><button type="button" data-home-action="rail-prev" aria-label="이전 콘텐츠">${arrow.replace('viewBox=','style="transform:rotate(180deg)" viewBox=')}</button><button type="button" data-home-action="rail-next" aria-label="다음 콘텐츠">${arrow}</button></div>
    <div class="uno-homepage__rail" tabindex="0" role="region" aria-roledescription="캐러셀" aria-label="아티스트 제작 과정 콘텐츠"></div>
    <div class="uno-homepage__process-bottom"><span data-home-count></span><span>SCROLL TO DISCOVER / 함께 만드는 다음 장면</span></div>
   </section>
   <section class="uno-homepage__upcoming" id="upcoming-live" aria-labelledby="uno-upcoming-title">
    <p class="uno-homepage__section-label">${esc(upcomingLiveData.label)}</p><h2 class="uno-homepage__upcoming-headline" id="uno-upcoming-title">${esc(upcomingLiveData.headline)}</h2>
    <div class="uno-homepage__live-grid"><img class="uno-homepage__upcoming-image" src="${esc(upcomingLiveData.image)}" alt="${esc(upcomingLiveData.alt)}" loading="lazy">
     <div class="uno-homepage__schedule"><p class="uno-homepage__schedule-label">${esc(upcomingLiveData.eyebrow)}</p><p class="uno-homepage__date">${esc(upcomingLiveData.dateLabel)}</p><p class="uno-homepage__time">${esc(upcomingLiveData.timeLabel)}</p><h3 class="uno-homepage__schedule-title">${esc(upcomingLiveData.title)}</h3><p class="uno-homepage__schedule-description">${esc(upcomingLiveData.description)}</p><button type="button" class="uno-homepage__text-link" data-home-action="reminder">${esc(upcomingLiveData.cta)}${arrow}</button><p class="uno-homepage__schedule-notice">${esc(upcomingLiveData.notice)}</p></div>
    </div>
   </section>
   <section class="uno-homepage__brand" id="about-uno" aria-label="About UNO Entertainment">
    <p class="uno-homepage__section-label">${esc(brandData.label)}</p>
    <div class="uno-homepage__brand-grid"><h2 class="uno-homepage__brand-words">${brandData.words.map(w=>`<span ${w.accent?'class="uno-homepage__word-accent"':''}>${esc(w.text)}</span>`).join('')}</h2><div class="uno-homepage__brand-symbol" style="--uno-brand-symbol:url('${esc(brandData.symbol)}')" role="img" aria-label="UNO 심볼"></div></div>
    <div class="uno-homepage__brand-bottom"><button type="button" class="uno-homepage__text-link uno-homepage__about" data-home-action="about">${esc(brandData.aboutLabel)}${externalArrow}</button><div class="uno-homepage__socials" aria-label="공식 소셜 채널">${socialLinks.map(s=>`<a href="${esc(s.url)}" aria-label="${esc(s.name)}" ${s.url==='#'?`data-home-action="social" data-channel="${esc(s.name)}"`:'target="_blank" rel="noopener noreferrer"'}><svg viewBox="0 0 24 24" aria-hidden="true">${socials[s.icon]||''}</svg></a>`).join('')}</div></div>
   </section>
  </main>
  <footer class="uno-homepage__footer"><div class="uno-homepage__footer-brand"><img src="${esc(siteData.logo)}" alt="UNO"><p>${esc(footerData.tagline)}</p></div><div class="uno-homepage__footer-links">${footerData.links.map(l=>`<button type="button" data-home-action="${esc(l.action)}">${esc(l.label)}</button>`).join('')}</div><p class="uno-homepage__copyright"><span>${esc(footerData.notice)}</span><span>${esc(footerData.copyright)}</span><span>${esc(footerData.prototypeNotice)}</span></p></footer>
  <button type="button" class="uno-homepage__top" data-home-action="top" data-visible="false" data-archive="false" aria-label="맨 위로 이동" title="TOP"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M12 20V4m-6 6 6-6 6 6" stroke="currentColor" stroke-width="1.4"/></svg></button>
  <dialog class="uno-homepage__dialog" aria-labelledby="uno-home-dialog-title"><button type="button" class="uno-homepage__dialog-close" data-home-action="close-dialog" aria-label="닫기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" stroke-width="1.2"/></svg></button><div class="uno-homepage__dialog-content"></div></dialog>`;
 }
 bind(){
  const signal=this.abort.signal;
  this.root.addEventListener('click',event=>{
   const filter=event.target.closest('[data-category]');if(filter){this.activeCategory=filter.dataset.category;this.renderCards();return;}
   const card=event.target.closest('[data-process-id]');if(card){if(!this.carousel.select(card))return;const d=artistProcessData.find(d=>d.id===card.dataset.processId);this.openDialog(d.title,`<img class="uno-homepage__dialog-image" src="${esc(d.image)}" alt="${esc(d.alt)}"><p>${esc(d.description)}</p>`,`${d.artist} / ${d.category.toUpperCase()}`);return;}
   const control=event.target.closest('[data-home-action]');if(!control)return;
   switch(control.dataset.homeAction){
    case 'navigate':{event.preventDefault();const target=this.$(control.dataset.target);target?.scrollIntoView({behavior:this.motion.matches?'instant':'smooth',block:'start'});history.replaceState(null,'',control.dataset.target);this.root.querySelectorAll('.uno-homepage__nav a').forEach(a=>{if(a===control)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});break;}
    case 'top':window.scrollTo({top:0,behavior:this.motion.matches?'instant':'smooth'});this.root.querySelectorAll('.uno-homepage__nav a').forEach((a,i)=>{if(i===0)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});break;
    case 'rail-prev':this.scrollRail(-1);break;
    case 'rail-next':this.scrollRail(1);break;
    case 'live-preview':this.openDialog(heroData.previewTitle,`<img class="uno-homepage__dialog-image" src="${esc(heroData.image)}" alt="${esc(heroData.alt)}"><p>${esc(heroData.previewDescription)}</p><button type="button" class="uno-homepage__text-link" data-home-action="show-schedule">라이브 일정 보기 ${arrow}</button>`,'UNO LIVE');break;
    case 'show-schedule':this.$('dialog.uno-homepage__dialog').close();this.$('#upcoming-live').scrollIntoView({behavior:this.motion.matches?'instant':'smooth'});break;
    case 'reminder':this.openDialog('다음 라이브를 함께 기다려요.',`<p>${esc(upcomingLiveData.dateLabel)} · ${esc(upcomingLiveData.timeLabel)}</p><p>${esc(upcomingLiveData.reminderDescription)}</p><button type="button" class="uno-homepage__text-link" data-home-action="calendar">캘린더에 일정 저장 ${arrow}</button>`,'LIVE REMINDER');break;
    case 'calendar':this.downloadCalendar();break;
    case 'login':this.openDialog('조금만 기다려주세요.','<p>로그인 서비스를 준비하고 있어요. 지금은 UNO의 라이브와 아티스트 콘텐츠를 먼저 둘러보세요.</p>','UNO ACCOUNT');break;
    case 'about':this.openDialog(brandData.aboutTitle,`<p>${esc(brandData.aboutDescription)}</p>`,'ABOUT UNO');break;
    case 'social':event.preventDefault();this.openDialog(control.dataset.channel,'<p>공식 채널 링크를 준비하고 있습니다.</p>','FOLLOW UNO');break;
    case 'privacy':this.openDialog('개인정보처리방침','<p>정식 서비스 공개에 맞춰 개인정보처리방침을 안내하겠습니다.</p>','UNO ENTERTAINMENT');break;
    case 'business':this.openDialog('비즈니스 문의','<p>비즈니스 문의 채널을 준비하고 있습니다.</p>','UNO ENTERTAINMENT');break;
    case 'close-dialog':this.$('dialog.uno-homepage__dialog').close();break;
   }
  },{signal});
  window.addEventListener('scroll',()=>{if(!this.scrollFrame)this.scrollFrame=requestAnimationFrame(()=>{this.scrollFrame=0;this.updateScrollUI()})},{passive:true,signal});
  this.$('dialog.uno-homepage__dialog').addEventListener('click',e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close()},{signal});
 }
 renderCards(){
  this.root.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===this.activeCategory)));
  const items=artistProcessData.filter(d=>this.activeCategory==='all'||d.category===this.activeCategory),rail=this.$('.uno-homepage__rail');rail.dataset.filtered=String(this.activeCategory!=='all');
  rail.innerHTML=items.map((d,i)=>`<button type="button" class="uno-homepage__process-card" data-process-id="${esc(d.id)}" aria-label="${i+1} / ${items.length} · ${esc(d.title)} 선택 및 자세히 보기"><img class="uno-homepage__card-image" src="${esc(d.image)}" alt="${esc(d.alt)}" loading="lazy" draggable="false"><span class="uno-homepage__card-meta"><span>${esc(d.artist)}</span><span>${esc(d.category.toUpperCase())}</span></span><h3>${esc(d.title)}</h3><p class="uno-homepage__card-series">${esc(d.series)} · ${esc(d.category[0].toUpperCase()+d.category.slice(1))}</p></button>`).join('');this.carousel.setCards([...rail.querySelectorAll('[data-process-id]')]);
  this.$('[data-home-count]').textContent=`${String(items.length).padStart(2,'0')} STORIES / ${this.activeCategory.toUpperCase()}`;
  this.railAnimation?.cancel();if(!this.motion.matches)this.railAnimation=rail.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
 }
 scrollRail(direction){this.carousel.step(direction)}
 updateScrollUI(){this.$('.uno-homepage__top').dataset.visible=String(window.scrollY>160)}
 openDialog(title,body,kicker=''){this.$('.uno-homepage__dialog-content').innerHTML=`${kicker?`<p class="uno-homepage__dialog-kicker">${esc(kicker)}</p>`:''}<h2 id="uno-home-dialog-title">${esc(title)}</h2>${body}`;this.$('dialog.uno-homepage__dialog').showModal()}
 downloadCalendar(){
  const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'),start=new Date(upcomingLiveData.startsAt),end=new Date(start.getTime()+upcomingLiveData.durationMinutes*60000);
  const safe=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UNO Entertainment//Live Schedule//KO','BEGIN:VEVENT',`UID:uno-live-${stamp(start)}@calendar.invalid`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${safe(upcomingLiveData.calendarTitle)}`,`DESCRIPTION:${safe(upcomingLiveData.description)}`,'BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY',`DESCRIPTION:${safe(upcomingLiveData.calendarTitle)}`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  if(this.calendarUrl)URL.revokeObjectURL(this.calendarUrl);this.calendarUrl=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));const link=document.createElement('a');link.href=this.calendarUrl;link.download='uno-jena-live.ics';link.click();
 }
 destroy(){this.carousel.destroy();this.abort.abort();this.archiveObserver.disconnect();this.railAnimation?.cancel();cancelAnimationFrame(this.scrollFrame);if(this.calendarUrl)URL.revokeObjectURL(this.calendarUrl);this.archive.destroy();if(this.$('dialog.uno-homepage__dialog').open)this.$('dialog.uno-homepage__dialog').close()}
}

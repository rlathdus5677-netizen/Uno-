import {siteData,uiAssets,navigationData} from './homepageData.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eventHref=new URL('../event/',import.meta.url).href;

// One shared header for HOME and EVENT. Desktop navigation uses the existing type/color rules.
export function renderSiteHeader({homeHref='#home',compact=false,homeBase='',activePage='home'}={}){
 const items=navigationData.filter(item=>item.href!=='#about-uno');
 return `<header class="uno-homepage__header" id="home">
   <a class="uno-homepage__logo" href="${esc(homeHref)}" data-home-action="navigate" data-target="#home" aria-label="UNO Entertainment 홈"><picture>${compact?`<source media="(min-width:1025px)" srcset="${esc(siteData.logo)}">`:''}<source media="(max-width:650px)" srcset="${esc(uiAssets.mobileLogo)}"><img src="${esc(compact?uiAssets.mobileLogo:siteData.logo)}" alt="UNO"></picture><span>Entertainment</span></a>
   <nav class="uno-homepage__nav uno-homepage__desktop-nav" aria-label="상단 메인 메뉴">${items.map(item=>{const isEvent=item.action==='event',active=isEvent?activePage==='event':activePage==='home'&&item.href==='#home';return `<a href="${esc(isEvent?eventHref:homeBase+item.href)}" data-home-action="${isEvent?'event':'navigate'}" ${isEvent?'':`data-target="${esc(item.href)}"`} ${active?'aria-current="page"':''}>${esc(item.label)}</a>`}).join('')}</nav>
   <div class="uno-homepage__header-actions"><button type="button" class="uno-homepage__login uno-homepage__desktop-login" data-home-action="login">LOGIN</button><button type="button" class="uno-homepage__menu-toggle" data-home-action="toggle-menu" aria-label="메뉴 열기" aria-controls="uno-navigation-panel" aria-haspopup="dialog" aria-expanded="false"><img src="${esc(uiAssets.menuBurger)}" alt="" aria-hidden="true"></button></div>
  </header>`;
}

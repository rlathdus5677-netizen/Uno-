import {siteData,uiAssets} from './homepageData.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Shared markup: HOME keeps its original rendering; compact pages use the same mobile logo.
export function renderSiteHeader({homeHref='#home',compact=false}={}){
 return `<header class="uno-homepage__header" id="home">
   <a class="uno-homepage__logo" href="${esc(homeHref)}" data-home-action="navigate" data-target="#home" aria-label="UNO Entertainment 홈"><picture><source media="(max-width:650px)" srcset="${esc(uiAssets.mobileLogo)}"><img src="${esc(compact?uiAssets.mobileLogo:siteData.logo)}" alt="UNO"></picture><span>Entertainment</span></a>
   <button type="button" class="uno-homepage__menu-toggle" data-home-action="toggle-menu" aria-label="메뉴 열기" aria-controls="uno-navigation-panel" aria-haspopup="dialog" aria-expanded="false"><img src="${esc(uiAssets.menuBurger)}" alt="" aria-hidden="true"></button>
  </header>`;
}

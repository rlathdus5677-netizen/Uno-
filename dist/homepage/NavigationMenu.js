const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export class NavigationMenu {
 constructor(root,{items,logo,burger,close,button}){
  this.button=button;this.icons={burger,close};this.abort=new AbortController();
  this.dialog=document.createElement('dialog');this.dialog.className='uno-menu';this.dialog.id='uno-navigation-panel';this.dialog.setAttribute('aria-label','메인 메뉴');
  this.dialog.innerHTML=`<div class="uno-menu__header"><a href="#home" data-home-action="navigate" data-target="#home" aria-label="UNO 홈"><img src="${esc(logo)}" alt="UNO"></a><button type="button" class="uno-menu__close" aria-label="메뉴 닫기"><img src="${esc(close)}" alt="" aria-hidden="true"></button></div><div class="uno-menu__content"><nav class="uno-homepage__nav" aria-label="메인 메뉴">${items.map((item,i)=>item.href?`<a href="${esc(item.href)}" data-home-action="navigate" data-target="${esc(item.href)}" ${i===0?'aria-current="page"':''}>${esc(item.label)}</a>`:`<button type="button" class="uno-menu__event" data-home-action="${esc(item.action)}">${esc(item.label)}</button>`).join('')}</nav><button type="button" class="uno-homepage__login" data-home-action="login">LOGIN</button></div>`;
  root.append(this.dialog);const signal=this.abort.signal;
  this.dialog.querySelector('.uno-menu__close').addEventListener('click',()=>this.close(),{signal});
  this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close()},{signal});
  this.dialog.addEventListener('close',()=>{if(!this.dialog.open)this.restore();},{signal});
  this.dialog.addEventListener('click',e=>{if(e.target!==this.dialog)return;const r=this.dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)this.close();},{signal});
  this.dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const controls=[...this.dialog.querySelectorAll('a,button')],first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}},{signal});
 }
 open(){
  if(this.dialog.open)return;
  this.saved={x:scrollX,y:scrollY,body:document.body.style.cssText,html:document.documentElement.style.cssText};
  const scrollbar=innerWidth-document.documentElement.clientWidth;
  document.documentElement.style.overflow='hidden';Object.assign(document.body.style,{position:'fixed',top:`${-this.saved.y}px`,left:`${-this.saved.x}px`,width:'100%',paddingRight:`${scrollbar}px`,boxSizing:'border-box'});
  this.button.setAttribute('aria-expanded','true');this.button.setAttribute('aria-label','메뉴 닫기');this.button.querySelector('img').src=this.icons.close;
  this.dialog.showModal();this.dialog.querySelector('.uno-menu__close').focus({preventScroll:true});
 }
 close(){if(this.dialog.open)this.dialog.close();this.restore();}
 restore(){
  if(!this.saved)return;const saved=this.saved;this.saved=null;
  document.body.style.cssText=saved.body;document.documentElement.style.cssText=saved.html;window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});
  this.button.setAttribute('aria-expanded','false');this.button.setAttribute('aria-label','메뉴 열기');this.button.querySelector('img').src=this.icons.burger;this.button.focus({preventScroll:true});
 }
 destroy(){this.close();this.abort.abort();this.dialog.remove();}
}

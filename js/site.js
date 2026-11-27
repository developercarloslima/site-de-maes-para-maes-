(()=>{
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const config=window.COLO_CONFIG||{};
  $('#year').textContent=String(new Date().getFullYear());

  const menuButton=$('.mobile-menu-toggle');
  const nav=$('#main-nav');
  menuButton?.addEventListener('click',()=>{
    const isOpen=menuButton.getAttribute('aria-expanded')==='true';
    menuButton.setAttribute('aria-expanded',String(!isOpen));
    menuButton.textContent=isOpen?'☰':'×';
    nav.classList.toggle('nav-open',!isOpen);
  });
  $$('#main-nav a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded','false');
    menuButton.textContent='☰';
  }));

  const screens={
    'meu-dia':{img:'app-meu-dia.webp',name:'Meu Dia',title:'Seu dia, com mais clareza',description:'Acompanhe as informações e os momentos importantes da sua rotina.'},
    'amamentacao':{img:'app-amamentacao.webp',name:'Amamentação',title:'Aprendendo a cada mamada',description:'Encontre orientações e conteúdos para acompanhar esse período tão especial.'},
    'sono':{img:'app-sono.webp',name:'Sono seguro',title:'Aconchego também é proteção',description:'Conteúdos dedicados a conhecer melhor os cuidados e a rotina do sono.'},
    'vacinas':{img:'app-vacinas.webp',name:'Vacinas & proteção',title:'Cuidado em cada etapa',description:'Informações organizadas sobre o acompanhamento de vacinas e proteção.'},
    'recordacoes':{img:'app-recordacoes.webp',name:'Livro de recordações',title:'Pequenos momentos, grandes memórias',description:'Um espaço para registrar lembranças e histórias da família.'},
    'meus-filhos':{img:'app-meus-filhos.webp',name:'Meus filhos',title:'Toda a sua família, em um só lugar',description:'Acompanhe perfis separados e organize a jornada de cada filho.'}
  };
  $$('.screen-tab').forEach(button=>button.addEventListener('click',()=>{
    const s=screens[button.dataset.screen]; if(!s)return;
    $$('.screen-tab').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
    button.classList.add('active');button.setAttribute('aria-pressed','true');
    const img=$('#active-screen');img.src=`assets/${s.img}?v=20261126b`;img.alt=`Tela real do Colo de Mãe: ${s.name}`;
    $('#screen-caption').innerHTML=`<span class="caption-icon" aria-hidden="true">♥</span><div><strong>${s.title}</strong><p>${s.description}</p></div>`;
  }));

  const modal=$('#checkout-modal');
  let lastFocus=null;
  function showModal(){lastFocus=document.activeElement;modal.hidden=false;document.body.classList.add('modal-open');$('.modal-close')?.focus();}
  function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');lastFocus?.focus?.();}
  $$('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});

  // CTA móvel discreto após o hero, sem encobrir escolhas de cookies.
  const mobileBar=$('#mobile-purchase-bar');
  const consentBanner=$('#cookie-banner');
  // Batch scroll/resize UI updates to avoid repeated style invalidations.
  let mobileFrame=0;
  function updateMobileCTA(){
    mobileFrame=0;
    if(!mobileBar)return;
    const show=window.innerWidth<=580 && window.scrollY>650 && Boolean(consentBanner?.hidden);
    if(mobileBar.hidden===!show)return;
    mobileBar.hidden=!show;
    document.body.classList.toggle('has-mobile-purchase',show);
  }
  function scheduleMobileCTA(){
    if(!mobileFrame)mobileFrame=requestAnimationFrame(updateMobileCTA);
  }
  window.addEventListener('scroll',scheduleMobileCTA,{passive:true});
  window.addEventListener('resize',scheduleMobileCTA,{passive:true});
  $('#cookie-accept')?.addEventListener('click',scheduleMobileCTA);
  $('#cookie-reject')?.addEventListener('click',scheduleMobileCTA);
  $('#cookie-settings')?.addEventListener('click',scheduleMobileCTA);
  window.addEventListener('load',scheduleMobileCTA);

  $$('a[data-checkout]').forEach(a=>a.addEventListener('click',e=>{
    const link=config.checkoutUrl?.trim();
    if(!link||!/^https:\/\//i.test(link)){
      e.preventDefault();showModal();return;
    }
    // Refresh consented _fbc/_fbp and UTM parameters before opening Cakto.
    if(typeof window.coloRefreshCheckoutLinks==='function')window.coloRefreshCheckoutLinks();
  }));
})();

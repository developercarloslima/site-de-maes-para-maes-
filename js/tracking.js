/**
 * Pixel Meta + UTMs: implementação com consentimento de marketing (LGPD).
 * Meta Pixel ID oficial: 1722078432606863.
 * PageView e ViewContent são enviados após consentimento; InitiateCheckout só ao
 * clicar para ir a um checkout real configurado em js/config.js.
 *
 * O rastreamento UTM é independente dos cookies: preserva utm_*, fbclid, gclid e
 * parâmetros adicionais e cria sck sem duplicar valores; apenas links de checkout
 * são modificados, evitando poluir links internos e de privacidade.
 */
(()=>{
  'use strict';
  const config=window.COLO_CONFIG||{};
  const consentKey='colo-de-mae-marketing-consent-v1';
  const banner=document.getElementById('cookie-banner');
  let trackingStarted=false;
  const readConsent=()=>{try{return localStorage.getItem(consentKey)}catch(e){return null}};
  let consentState=readConsent();
  const writeConsent=value=>{consentState=value;try{localStorage.setItem(consentKey,value)}catch(e){/* manter preferência em memória caso armazenamento esteja indisponível */}};

  const urlParams=new URLSearchParams(window.location.search);
  const referer=(()=>{try{return new URL(document.referrer)}catch(e){return null}})();
  const refererParams=new URLSearchParams(referer?.search||'');
  const keys=new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']);
  for(const [key] of urlParams){if(!['sck'].includes(key))keys.add(key)}
  for(const [key] of refererParams){if(key.startsWith('utm_'))keys.add(key)}
  const utms={};
  for(const key of keys){
    let value=urlParams.get(key)??refererParams.get(key);
    if(key==='utm_source'&&!value)value=referer?.hostname||'direto';
    if(value)utms[key]=value;
  }
  const clickTokens=[];
  const existingSck=urlParams.get('sck')||'';
  if(existingSck)clickTokens.push(...existingSck.split('|').filter(Boolean));
  for(const v of Object.values(utms)){if(v&&!clickTokens.includes(v))clickTokens.push(v)}

  function checkoutLink(){
    if(!config.checkoutUrl||!/^https:\/\//i.test(config.checkoutUrl))return null;
    try{
      const u=new URL(config.checkoutUrl);
      for(const [key,value] of Object.entries(utms))if(!u.searchParams.has(key))u.searchParams.set(key,value);
      if(!u.searchParams.has('sck')&&clickTokens.length)u.searchParams.set('sck',clickTokens.join('|'));
      return u.href;
    }catch(e){return null}
  }
  function decorateCheckout(){
    const href=checkoutLink();
    document.querySelectorAll('a[data-checkout]').forEach(a=>{if(href)a.href=href});
  }
  decorateCheckout();

  function startPixel(){
    if(trackingStarted)return;
    trackingStarted=true;
    // Meta Pixel Code (conforme instruções do anunciante).
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init',config.pixelId||'1722078432606863');
    window.fbq('track','PageView');
    window.fbq('track','ViewContent',{content_name:config.productName||'Colo de Mãe + 3 Bônus',content_type:'product',value:Number(config.price||29.90),currency:'BRL'});
    // End Meta Pixel Code.
  }

  window.coloTrackCheckout=()=>{
    if(consentState==='accepted'&&window.fbq){
      window.fbq('track','InitiateCheckout',{
        content_name:config.productName||'Colo de Mãe + 3 Bônus',
        value:Number(config.price||29.90),currency:'BRL',num_items:1
      });
    }
  };
  function accept(){writeConsent('accepted');if(banner)banner.hidden=true;startPixel()}
  function reject(){writeConsent('rejected');if(banner)banner.hidden=true}
  document.getElementById('cookie-accept')?.addEventListener('click',accept);
  document.getElementById('cookie-reject')?.addEventListener('click',reject);
  document.getElementById('cookie-settings')?.addEventListener('click',()=>{if(banner)banner.hidden=false;banner?.scrollIntoView({block:'nearest',behavior:'smooth'})});
  const consent=consentState;
  if(consent==='accepted')startPixel();
  else if(consent===null&&banner)banner.hidden=false;
})();

/**
 * Colo de Mãe — Meta Pixel and Cakto attribution
 *
 * The landing page owns PageView + ViewContent only.
 * Cakto owns InitiateCheckout (checkout opened) and Purchase (payment approved).
 * Do not emit Purchase or InitiateCheckout from this page: they would duplicate
 * the checkout's native events and harm the funnel data.
 *
 * UTM and sck are carried to Cakto without requiring marketing cookies.
 * Only after marketing consent, _fbp and _fbc are added as optional query
 * parameters. Cakto must support them for server attribution to benefit.
 * No Meta access tokens or personal customer data are stored in this script.
 */
(()=>{
  'use strict';
  const config=window.COLO_CONFIG||{};
  const consentKey='colo-de-mae-marketing-consent-v1';
  const banner=document.getElementById('cookie-banner');
  const urlParams=new URLSearchParams(window.location.search);
  let started=false;

  const getConsent=()=>{try{return localStorage.getItem(consentKey)}catch{return null}};
  let consentState=getConsent();
  const setConsent=value=>{consentState=value;try{localStorage.setItem(consentKey,value)}catch{/* Memory-only choice */}};
  const getCookie=name=>{
    try{
      const entry=document.cookie.split('; ').find(item=>item.startsWith(name+'='));
      return entry?decodeURIComponent(entry.slice(name.length+1)):'';
    }catch{return '';}
  };

  let referrer=null;
  try{referrer=document.referrer?new URL(document.referrer):null;}catch{/* Invalid or unavailable referrer */}
  const refParams=new URLSearchParams(referrer?.search||'');
  const keys=new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id']);
  for(const [key] of urlParams){if(key!=='sck')keys.add(key);}
  for(const [key] of refParams){if(key.startsWith('utm_'))keys.add(key);}
  const params={};
  for(const key of keys){
    let value=urlParams.get(key)??refParams.get(key);
    if(key==='utm_source'&&!value)value=referrer?.hostname||'direto';
    if(value)params[key]=value;
  }
  const sckValues=(urlParams.get('sck')||'').split('|').filter(Boolean);
  for(const value of Object.values(params)){
    if(value&&!sckValues.includes(value))sckValues.push(value);
  }

  // Share pseudonymous Meta attribution identifiers ONLY after consent.
  // Never fake an _fbp ID; Meta's Pixel generates it if the browser permits.
  function metaIdentifiers(){
    if(consentState!=='accepted')return {};
    const ids={};
    const fbp=getCookie('_fbp');
    if(/^fb\.1\.\d{10,13}\.[A-Za-z0-9._-]+$/.test(fbp))ids.fbp=fbp;

    const storedFbc=getCookie('_fbc');
    if(/^fb\.1\.\d{10,13}\.[A-Za-z0-9._-]+$/.test(storedFbc)){
      ids.fbc=storedFbc;
    }else{
      const clickId=urlParams.get('fbclid')||'';
      if(/^[A-Za-z0-9_-]{10,500}$/.test(clickId)){
        ids.fbc='fb.1.'+Date.now()+'.'+clickId;
      }
    }
    return ids;
  }

  function checkoutUrl(){
    if(!config.checkoutUrl||!/^https:\/\//i.test(config.checkoutUrl))return null;
    try{
      const url=new URL(config.checkoutUrl);
      if(url.hostname!=='pay.cakto.com.br')return null;
      for(const [key,value] of Object.entries(params)){
        if(!url.searchParams.has(key))url.searchParams.set(key,value);
      }
      if(!url.searchParams.has('sck')&&sckValues.length){
        url.searchParams.set('sck',sckValues.join('|'));
      }
      for(const [key,value] of Object.entries(metaIdentifiers())){
        url.searchParams.set(key,value);
      }
      return url.toString();
    }catch{return null;}
  }

  function decorateCheckoutLinks(){
    const href=checkoutUrl();
    if(!href)return;
    document.querySelectorAll('a[data-checkout]').forEach(link=>{
      link.href=href;
      link.target='_blank';
      link.rel='noopener noreferrer';
    });
  }
  window.coloRefreshCheckoutLinks=decorateCheckoutLinks;
  decorateCheckoutLinks();

  function startPixel(){
    if(started)return;
    started=true;
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
    window.fbq('track','ViewContent',{
      content_name:config.productName||'Colo de Mãe + 3 Bônus',
      content_type:'product',
      value:Number(config.price||29.90),
      currency:'BRL'
    });
  }

  function accept(){setConsent('accepted');if(banner)banner.hidden=true;startPixel();decorateCheckoutLinks();}
  function reject(){setConsent('rejected');if(banner)banner.hidden=true;decorateCheckoutLinks();}
  document.getElementById('cookie-accept')?.addEventListener('click',accept);
  document.getElementById('cookie-reject')?.addEventListener('click',reject);
  document.getElementById('cookie-settings')?.addEventListener('click',()=>{
    if(banner)banner.hidden=false;
    banner?.scrollIntoView({block:'nearest',behavior:'smooth'});
  });
  if(consentState==='accepted')startPixel();
  else if(consentState===null&&banner)banner.hidden=false;
})();

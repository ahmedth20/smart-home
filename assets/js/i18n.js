/* Local, reversible FR/EN translations. No external translation service. */
(function () {
 'use strict';
 const dictionary=window.SMART_TRANSLATIONS||{};
 const toggle=document.getElementById('language-toggle');
 const originals=new WeakMap();
 let language='fr';
 try { if(localStorage.getItem('smart-home-language')==='en')language='en'; } catch (_) {}
 const fragments=[
  ['Prix et disponibilité — ','Price and availability — '],['Bonjour SMART HOME GROUP,','Hello SMART HOME GROUP,'],
  ['Je souhaite obtenir des renseignements sur vos produits.','I would like information about your products.'],
  ['Je souhaite connaître le prix et la disponibilité du produit suivant :','I would like the price and availability of the following product:'],
  ['Merci également de confirmer les caractéristiques de cette fiche.','Please also confirm the specifications in this listing.'],
  ['Quantité souhaitée :','Quantity required:'],['Je souhaite contacter votre service après-vente.','I would like to contact your after-sales service.'],
  ['Marque et modèle :','Brand and model:'],['Numéro de série (si disponible) :','Serial number (if available):'],['Ville / région :','Town / region:'],
  ['Date d’achat :','Purchase date:'],['Description du problème :','Issue description:'],['Je souhaite connaître un revendeur dans ma région.','I would like to find a retailer in my region.'],['Appareil recherché :','Appliance required:'],['Merci.','Thank you.'],
  ['Photos du ','Photos of '],['Ouvrir la fiche de ','Open details for '],['Voir ','View '],
  ['Réfrigérateur double porte','Double-door refrigerator'],['Réfrigérateur Defrost avec serrure','Defrost refrigerator with lock'],['Réfrigérateur mini-bar une porte','Single-door minibar refrigerator'],
  ['Machine à laver semi-automatique','Semi-automatic washing machine'],['Lave-linge top','Top-loading washing machine'],['Congélateur horizontal','Chest freezer'],['Congélateur coffre','Chest freezer'],['Fontaine à eau avec tiroir','Water dispenser with drawer'],['Rafraîchisseur d’air mobile','Portable air cooler'],['Rafraîchisseur d’air','Air cooler'],
  ['avec pompe','with pump'],['1 bac','single tub'],['fontaine noire','black water dispenser'],['fontaine grise','grey water dispenser'],
  ['Gris foncé','Dark grey'],['gris foncé','dark grey'],['Blanc','White'],['Gris','Grey'],['Noir','Black'],['Inox','Stainless steel'],
  ['avec porte noire','with black lid'],['vue extérieure','exterior view'],['vue intérieure','interior view'],['fermé','closed'],['ouvert','open'],['nets','net']
 ];
 function translate(text){
  const trimmed=text.trim();
  if(dictionary[trimmed])return text.replace(trimmed,dictionary[trimmed]);
  let result=text;
  result=result.replace(/(\d+) produits? affichés? sur (\d+)/g,(_,n,total)=>`${n} product${n==='1'?'':'s'} displayed out of ${total}`);
  result=result.replace(/(\d+) modèles?/g,(_,n)=>`${n} model${n==='1'?'':'s'}`).replace(/(\d+) produits?/g,(_,n)=>`${n} product${n==='1'?'':'s'}`);
  for(const [fr,en] of fragments)result=result.split(fr).join(en);
  if(result.includes(' | SMART HOME GROUP'))for(const [fr,en] of Object.entries(dictionary))if(result.startsWith(fr+' |'))result=en+result.slice(fr.length);
  return result;
 }
 function renderValue(node,key,read,write){
  const current=read();
  let cache=originals.get(node);if(!cache){cache={};originals.set(node,cache);}
  let state=cache[key];
  if(!state||current!==state.rendered)state=cache[key]={source:current,rendered:current};
  const next=language==='en'?translate(state.source):state.source;
  state.rendered=next;if(current!==next)write(next);
 }
 function apply(){
  observer.disconnect();
  document.documentElement.lang=language;
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('script,style,#language-toggle')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  while(walker.nextNode()){const node=walker.currentNode;renderValue(node,'text',()=>node.nodeValue,v=>{node.nodeValue=v;});}
  for(const el of document.querySelectorAll('[aria-label],[placeholder],[alt],[data-search],meta[name="description"],title')){
   if(el===toggle)continue;
   for(const attr of ['aria-label','placeholder','alt','content','data-search'])if(el.hasAttribute(attr))renderValue(el,attr,()=>el.getAttribute(attr),v=>el.setAttribute(attr,v));
   if(el.tagName==='TITLE')renderValue(el,'title',()=>el.textContent,v=>{el.textContent=v;});
  }
  // Never overwrite a visitor's edited subject or message.
  for(const el of document.querySelectorAll('#contact-subject,#request-text')){
   const state=originals.get(el)?.value;
   if(state&&el.value!==state.rendered)continue;
   renderValue(el,'value',()=>el.value,v=>{el.value=v;});
  }
  if(toggle){toggle.textContent=language==='fr'?'EN':'FR';toggle.lang=language==='fr'?'en':'fr';toggle.setAttribute('aria-label',language==='fr'?'Switch to English':'Passer en français');toggle.title=language==='fr'?'English':'Français';}
  observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label']});
 }
 const observer=new MutationObserver(()=>apply());
 toggle?.addEventListener('click',()=>{language=language==='fr'?'en':'fr';try{localStorage.setItem('smart-home-language',language);}catch(_){}apply();});
 window.smartI18n={translate:t=>language==='en'?translate(t):t,refresh:apply};
 apply();
})();

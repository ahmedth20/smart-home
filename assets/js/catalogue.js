(function(){
'use strict';
const products=window.SMART_PRODUCTS||[];
const byId=new Map(products.map(p=>[p.id,p]));
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const dialog=document.getElementById('product-dialog');
function setupGallery(frame){
 const track=frame.querySelector('.gallery-track');const slides=[...track.children];
 let pointerStart=null;
 track.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};track.dataset.dragging='false';},{passive:true});
 track.addEventListener('pointermove',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8)track.dataset.dragging='true';},{passive:true});
 track.addEventListener('pointerup',()=>{pointerStart=null;},{passive:true});
 track.addEventListener('pointercancel',()=>{pointerStart=null;track.dataset.dragging='true';},{passive:true});
 track.querySelectorAll('img').forEach(img=>img.draggable=false);
 const prev=frame.querySelector('[data-gallery-prev]'),next=frame.querySelector('[data-gallery-next]');
 function index(){return Math.round(track.scrollLeft/(track.clientWidth||1));}
 function update(){const i=index();frame.querySelector('.gallery-position').textContent=(i+1)+' / '+slides.length;prev.disabled=i===0;next.disabled=i>=slides.length-1;}
 function move(delta){track.scrollTo({left:Math.max(0,Math.min(slides.length-1,index()+delta))*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});update();
}
function createGallery(p){
 const frame=document.createElement('div');frame.className='gallery-frame detail-gallery';
 frame.innerHTML='<div class="gallery-track" tabindex="0" aria-label="Photos du produit à faire défiler"></div><div class="gallery-controls"><button type="button" data-gallery-prev aria-label="Photo précédente"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 6 9 12l6 6"/></svg></button><span class="gallery-position" aria-live="polite"></span><button type="button" data-gallery-next aria-label="Photo suivante"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></div>';
 p.images.forEach((src,i)=>{const slide=document.createElement('div');slide.className='gallery-slide';const image=document.createElement('img');image.src=src;image.alt=p.imageAlts?.[i]||p.model+' — '+(i===0?'vue extérieure':'vue intérieure');slide.append(image);frame.querySelector('.gallery-track').append(slide);});setupGallery(frame);return frame;
}
document.querySelectorAll('[data-gallery]').forEach(setupGallery);
let lastTrigger=null;
function openDetail(id,trigger){
 const p=byId.get(id);if(!p||!dialog)return;
 lastTrigger=trigger;
 document.getElementById('detail-title').textContent=p.model;
 document.getElementById('detail-brand').textContent=p.brand+' · SMART HOME GROUP';
 document.getElementById('detail-type').textContent=p.type;
 const visual=document.querySelector('.detail-visual');visual.replaceChildren();
 if(p.images&&p.images.length>1){visual.append(createGallery(p));}
 else{const image=document.createElement('img');image.id='detail-image';image.src=p.image;image.alt=p.name;visual.append(image);}

 const tags=document.getElementById('detail-tags');tags.replaceChildren();
 [p.capacityLabel,p.color].forEach(t=>{const span=document.createElement('span');span.textContent=t;tags.append(span)});
 document.getElementById('detail-description').textContent=p.description;
 const note=document.getElementById('detail-note');note.textContent=p.note;note.hidden=!p.note;
 document.getElementById('detail-contact').href='contact.html?produit='+encodeURIComponent(p.id);
 dialog.showModal();document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',event=>{if(event.detail!==0&&button.closest('.gallery-track')?.dataset.dragging==='true')return;openDetail(button.dataset.detail,button);}));
if(dialog){
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{document.body.style.overflow='';if(lastTrigger)lastTrigger.focus()});
}
const search=document.getElementById('product-search');
if(search){
 const tabs=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.catalogue-group .product-card')];
 const brand=document.getElementById('brand-filter'),sort=document.getElementById('product-sort');
 const param=new URLSearchParams(location.search).get('categorie');
 let category=tabs.some(t=>t.dataset.filter===param)?param:'all';
 function apply(){
  const terms=normalize(search.value).trim().split(/\s+/).filter(Boolean);let count=0;
  tabs.forEach(t=>{const active=t.dataset.filter===category;t.classList.toggle('active',active);t.setAttribute('aria-pressed',String(active))});
  cards.forEach(card=>{const matches=(category==='all'||card.dataset.category===category)&&(brand.value==='all'||card.dataset.brand===brand.value)&&terms.every(term=>normalize(card.dataset.search).includes(term));card.hidden=!matches;if(matches)count++});
  document.querySelectorAll('.products-grid').forEach(grid=>{
   const list=[...grid.querySelectorAll('.product-card')];
   list.sort((a,b)=>sort.value==='name'?a.dataset.search.localeCompare(b.dataset.search,'fr'):(Number(a.dataset.capacity)-Number(b.dataset.capacity))*(sort.value==='capacity-desc'?-1:1)).forEach(card=>grid.append(card));
  });
  document.querySelectorAll('[data-laundry-section]').forEach(section=>{
   const visible=section.querySelectorAll('.product-card:not([hidden])').length;
   section.hidden=!visible;section.querySelector('.laundry-count').textContent=visible+' modèle'+(visible>1?'s':'');
  });
  document.querySelectorAll('.catalogue-group').forEach(group=>{
   const visible=group.querySelectorAll('.product-card:not([hidden])').length;
   group.hidden=!visible;group.querySelector('.group-count').textContent=visible+' modèle'+(visible>1?'s':'');
  });
  document.getElementById('result-count').textContent=count+' produit'+(count>1?'s':'')+' affiché'+(count>1?'s':'')+' sur '+products.length;
  document.getElementById('empty-state').hidden=count!==0;
 }
 tabs.forEach(tab=>tab.addEventListener('click',()=>{category=tab.dataset.filter;const url=new URL(location.href);if(category==='all')url.searchParams.delete('categorie');else url.searchParams.set('categorie',category);history.replaceState(null,'',url);apply()}));
 search.addEventListener('input',apply);brand.addEventListener('change',apply);sort.addEventListener('change',apply);
 document.getElementById('reset-filters').addEventListener('click',()=>{category='all';search.value='';brand.value='all';sort.value='capacity';const url=new URL(location.href);url.searchParams.delete('categorie');history.replaceState(null,'',url);apply();search.focus()});apply();
 const id=location.hash.slice(1);if(byId.has(id))openDetail(id,document.querySelector('[data-detail="'+id+'"]'));
}
const heroVideo=document.getElementById('hero-video');
if(heroVideo){
 const toggle=document.querySelector('.hero-video-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function syncVideo(){const paused=heroVideo.paused;toggle.setAttribute('aria-label',paused?'Lire l’animation':'Mettre l’animation en pause');toggle.setAttribute('aria-pressed',String(paused));toggle.querySelector('.video-pause-icon').hidden=paused;toggle.querySelector('.video-play-icon').hidden=!paused;}
 function playVideo(){heroVideo.play().catch(()=>syncVideo());}
 heroVideo.muted=true;
 if(reduced.matches){heroVideo.autoplay=false;heroVideo.pause();}else{playVideo();}
 toggle.addEventListener('click',()=>{if(heroVideo.paused)playVideo();else heroVideo.pause();});
 heroVideo.addEventListener('play',syncVideo);heroVideo.addEventListener('pause',syncVideo);
 heroVideo.addEventListener('error',()=>{toggle.hidden=true;heroVideo.classList.add('video-unavailable');});
 reduced.addEventListener('change',()=>{if(reduced.matches)heroVideo.pause();});syncVideo();
}
const request=document.getElementById('request-text');
if(request){
 const companyEmail='info@smarthome.com.tn';
 const form=document.getElementById('contact-email-form');
 const subject=document.getElementById('contact-subject');
 const id=new URLSearchParams(location.search).get('produit'),p=byId.get(id);
 if(p){
  document.getElementById('contact-product').textContent=p.type+' — '+p.model+' · '+p.capacityLabel+' · '+p.color;
  subject.value='Prix et disponibilité — '+p.model;
  request.value='Bonjour SMART HOME GROUP,\n\nJe souhaite connaître le prix et la disponibilité du produit suivant :\n'+p.type+' — '+p.model+'\n'+p.capacityLabel+' · '+p.color+'\n'+(p.note?'Merci également de confirmer les caractéristiques de cette fiche.\n':'')+'\nQuantité souhaitée : 1\n\nMerci.';
 }
 const requestKind=new URLSearchParams(location.search).get('demande');
 if(requestKind==='sav'){
  subject.value='Demande de service après-vente';
  document.getElementById('contact-product').textContent='Décrivez votre appareil et le problème rencontré pour faciliter votre prise en charge.';
  request.value='Bonjour SMART HOME GROUP,\n\nJe souhaite contacter votre service après-vente.\n\nMarque et modèle : '+(p?p.model:'')+'\nNuméro de série (si disponible) :\nVille / région :\nDate d’achat :\nDescription du problème :\n\nMerci.';
 }else if(requestKind==='revendeur'){
  subject.value='Recherche d’un revendeur';
  document.getElementById('contact-product').textContent='Indiquez votre région et l’appareil recherché.';
  request.value='Bonjour SMART HOME GROUP,\n\nJe souhaite connaître un revendeur dans ma région.\n\nVille / région :\nAppareil recherché :\n\nMerci.';
 }
 const initialSubject=subject.value,initialMessage=request.value;
 const button=document.getElementById('send-request');
 const status=document.getElementById('email-status');
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity()||button.disabled)return;
  if(form.elements.namedItem('_honey').value)return;
  const payload={nom:document.getElementById('contact-name').value.trim(),email:document.getElementById('contact-email').value.trim(),objet:subject.value.trim(),message:request.value.trim(),_subject:'SMART HOME — '+subject.value.trim(),_template:'table',_captcha:'false',_honey:'',_url:'https://ahmedth20.github.io/smart-home/contact.html'};
  if(!payload.nom||!payload.objet||!payload.message){status.textContent='Merci de compléter votre nom, l’objet et votre message.';status.dataset.state='error';return;}
  if(p)payload.produit=p.type+' — '+p.model+' · '+p.capacityLabel+' · '+p.color;
  button.disabled=true;button.textContent='Envoi en cours…';form.setAttribute('aria-busy','true');
  status.textContent='Transmission de votre demande…';status.dataset.state='pending';
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
  try{
   const response=await fetch('https://formsubmit.co/ajax/'+companyEmail,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
   const data=await response.json();
   if(!response.ok||(data.success!==true&&data.success!=='true'))throw new Error('Service unavailable');
   if(/activat|confirm.*email/i.test(data.message||'')){
    status.textContent='Votre demande n’a pas encore pu être confirmée. Contactez-nous à info@smarthome.com.tn.';status.dataset.state='pending';
   }else{
    status.textContent='Votre demande a été transmise. Merci ! Notre équipe vous répondra par e-mail.';status.dataset.state='success';
    form.reset();
    subject.value=initialSubject;request.value=initialMessage;
   }
  }catch(error){status.textContent=error.name==='AbortError'?'L’envoi n’a pas pu être confirmé. Réessayez dans un instant. Votre message a été conservé.':'L’envoi n’a pas abouti. Votre message est conservé. Réessayez dans un instant ou contactez info@smarthome.com.tn.';status.dataset.state='error';}
  finally{clearTimeout(timer);button.disabled=false;button.textContent='Envoyer';form.removeAttribute('aria-busy');}
 });
}
})();

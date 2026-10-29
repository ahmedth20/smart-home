(function(){
'use strict';
const products=window.SMART_PRODUCTS||[];
const byId=new Map(products.map(p=>[p.id,p]));
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const dialog=document.getElementById('product-dialog');
let lastTrigger=null;
function openDetail(id,trigger){
 const p=byId.get(id);if(!p||!dialog)return;
 lastTrigger=trigger;
 document.getElementById('detail-title').textContent=p.model;
 document.getElementById('detail-brand').textContent=p.brand+' · SMART HOME GROUP';
 document.getElementById('detail-type').textContent=p.type;
 const image=document.getElementById('detail-image');image.src=p.image;image.alt=p.name;
 const tags=document.getElementById('detail-tags');tags.replaceChildren();
 [p.capacityLabel,p.color].forEach(t=>{const span=document.createElement('span');span.textContent=t;tags.append(span)});
 document.getElementById('detail-description').textContent=p.description;
 const note=document.getElementById('detail-note');note.textContent=p.note;note.hidden=!p.note;
 document.getElementById('detail-source').textContent='Catalogue SMART HOME GROUP 2026 · page '+p.sourcePage;
 document.getElementById('detail-contact').href='contact.html?produit='+encodeURIComponent(p.id);
 dialog.showModal();document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>openDetail(button.dataset.detail,button)));
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
  document.querySelectorAll('.catalogue-group').forEach(group=>{const list=[...group.querySelectorAll('.product-card')];const visible=list.filter(c=>!c.hidden).length;group.hidden=!visible;group.querySelector('.group-count').textContent=visible+' modèle'+(visible>1?'s':'');list.sort((a,b)=>sort.value==='name'?a.dataset.search.localeCompare(b.dataset.search,'fr'):(Number(a.dataset.capacity)-Number(b.dataset.capacity))*(sort.value==='capacity-desc'?-1:1)).forEach(card=>group.querySelector('.products-grid').append(card))});
  document.getElementById('result-count').textContent=count+' produit'+(count>1?'s':'')+' affiché'+(count>1?'s':'')+' sur 26';
  document.getElementById('empty-state').hidden=count!==0;
 }
 tabs.forEach(tab=>tab.addEventListener('click',()=>{category=tab.dataset.filter;const url=new URL(location.href);if(category==='all')url.searchParams.delete('categorie');else url.searchParams.set('categorie',category);history.replaceState(null,'',url);apply()}));
 search.addEventListener('input',apply);brand.addEventListener('change',apply);sort.addEventListener('change',apply);
 document.getElementById('reset-filters').addEventListener('click',()=>{category='all';search.value='';brand.value='all';sort.value='capacity';const url=new URL(location.href);url.searchParams.delete('categorie');history.replaceState(null,'',url);apply();search.focus()});apply();
 const id=location.hash.slice(1);if(byId.has(id))openDetail(id,document.querySelector('[data-detail="'+id+'"]'));
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
    status.textContent='La réception des messages est en cours d’activation par SMART HOME GROUP. Votre demande a été transmise au service.';status.dataset.state='pending';
   }else{
    status.textContent='Votre demande a été transmise. Merci ! Notre équipe vous répondra par e-mail.';status.dataset.state='success';
    form.reset();
    if(p){subject.value='Prix et disponibilité — '+p.model;request.value='Bonjour SMART HOME GROUP,\n\nJe souhaite connaître le prix et la disponibilité du produit suivant :\n'+p.type+' — '+p.model+'\n'+p.capacityLabel+' · '+p.color+'\n\nQuantité souhaitée : 1\n\nMerci.';}
   }
  }catch(error){status.textContent=error.name==='AbortError'?'La confirmation de l’envoi n’a pas pu être reçue. Votre message est conservé ; réessayez dans un instant.':'L’envoi n’a pas abouti. Votre message est conservé. Réessayez dans un instant ou contactez info@smarthome.com.tn.';status.dataset.state='error';}
  finally{clearTimeout(timer);button.disabled=false;button.textContent='Envoyer';form.removeAttribute('aria-busy');}
 });
}
})();

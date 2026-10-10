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
 const id=new URLSearchParams(location.search).get('produit'),p=byId.get(id);
 if(p){document.getElementById('contact-product').textContent=p.type+' — '+p.model+' · '+p.capacityLabel+' · '+p.color;request.value='Bonjour SMART HOME GROUP,\n\nJe souhaite connaître le prix et la disponibilité du produit suivant :\n'+p.type+' — '+p.model+'\n'+p.capacityLabel+' · '+p.color+'\n'+(p.note?'Merci également de confirmer les caractéristiques de cette fiche.\n':'')+'\nMerci.'}
 document.getElementById('copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(request.value);document.getElementById('copy-status').textContent='Votre demande a été copiée.'}catch{request.focus();request.select();document.getElementById('copy-status').textContent='Sélection prête : utilisez Ctrl+C pour copier votre demande.'}});
}

})();

// ════ STATE ════
const S={
  users:    JSON.parse(localStorage.getItem('cc_u')||'[]'),
  comp:     JSON.parse(localStorage.getItem('cc_c')||'[]'),
  food:     JSON.parse(localStorage.getItem('cc_f')||'[]'),
  products: JSON.parse(localStorage.getItem('cc_p')||'[]'),
  me:null, isAdmin:false
};
function save(){
  localStorage.setItem('cc_u',JSON.stringify(S.users));
  localStorage.setItem('cc_c',JSON.stringify(S.comp));
  localStorage.setItem('cc_f',JSON.stringify(S.food));
  localStorage.setItem('cc_p',JSON.stringify(S.products));
}
function td(){ return new Date().toLocaleDateString('en-IN'); }

// seed demo data
if(!S.users.length){
  S.users.push({id:'CC99999',name:'Demo User',mobile:'9999999999',joined:td()});
  S.comp.push({id:'CMP001',uid:'CC99999',uname:'Demo User',title:'Broken streetlight near Gandhi Park',cat:'💡 Broken Streetlight',desc:'The streetlight near Gandhi Park has been broken for 2 weeks making the area unsafe at night.',loc:'Gandhi Park, Adyar, Chennai',img:null,status:'in-progress',date:td()});
  S.comp.push({id:'CMP002',uid:'CC99999',uname:'Demo User',title:'Garbage not collected at bus stop',cat:'🗑️ Garbage Overflow',desc:'Garbage has not been collected for 5 days near the Anna Nagar bus stand.',loc:'Anna Nagar, Chennai',img:null,status:'pending',date:td()});
  S.food.push({id:'FD001',name:'Cooked Rice & Sambar',qty:'20 plates',loc:'T Nagar, Chennai',contact:'9876543210',donor:'Priya Raman',uid:'CC99999',date:td()});
  S.products.push({id:'PRD001',name:'Organic Tomatoes',price:'₹40/kg',qty:'50 kg',contact:'9988776655',img:null,farmer:'Karthik Farms',uid:'CC99999',date:td()});
  S.products.push({id:'PRD002',name:'Fresh Coconuts',price:'₹25/piece',qty:'100 pieces',contact:'9977665544',img:null,farmer:'Murugan Farms',uid:'CC99999',date:td()});
  save();
}

// ════ NAVIGATION ════
function go(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='page-landing')   updateLandingStats();
  if(id==='page-dashboard') renderDash();
  if(id==='page-civic')     { syncPills(); renderComp(); }
  if(id==='page-food')      { syncPills(); renderFood(); }
  if(id==='page-farmer')    { syncPills(); renderProds(); }
  if(id==='page-admin')     renderAdmin();
}

function syncPills(){
  const v=S.me?S.me.id:'';
  ['cid-civic','cid-food','cid-farmer'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=v;});
}

function updateLandingStats(){
  document.getElementById('ls-users').textContent     = S.users.length;
  document.getElementById('ls-complaints').textContent= S.comp.length;
  document.getElementById('ls-food').textContent      = S.food.length;
}

// ════ REGISTER ════
function register(){
  const n=document.getElementById('reg-name').value.trim();
  const m=document.getElementById('reg-mob').value.trim();
  if(!n){toast('⚠️','Please enter your full name','#f59e0b');return;}
  if(m.length<10){toast('⚠️','Enter a valid 10-digit mobile number','#f59e0b');return;}
  const id='CC'+(10000+Math.floor(Math.random()*90000));
  S.users.push({id,name:n,mobile:m,joined:td()});
  save();
  document.getElementById('cid-val').textContent=id;
  document.getElementById('cid-modal').classList.add('show');
  document.getElementById('reg-name').value='';
  document.getElementById('reg-mob').value='';
}
function copyID(){
  navigator.clipboard.writeText(document.getElementById('cid-val').textContent)
    .then(()=>toast('📋','Citizen ID copied to clipboard','#22c55e'));
}
function goLogin(){
  document.getElementById('cid-modal').classList.remove('show');
  go('page-login');
}

// ════ LOGIN ════
function login(){
  const id=document.getElementById('li-id').value.trim().toUpperCase();
  const m=document.getElementById('li-mob').value.trim();
  const u=S.users.find(u=>u.id===id&&u.mobile===m);
  if(!u){toast('❌','Invalid Citizen ID or Mobile Number','#e63946');return;}
  S.me=u;
  document.getElementById('d-cid').textContent=u.id;
  document.getElementById('d-name').textContent=`Hello, ${u.name}! 👋`;
  go('page-dashboard');
  notif('👋 Welcome to CivicConnect!','Let\'s improve our community together.');
  document.getElementById('li-id').value='';
  document.getElementById('li-mob').value='';
}

// ════ ADMIN LOGIN ════
function adminLogin(){
  const u=document.getElementById('au').value.trim();
  const p=document.getElementById('ap').value.trim();
  if(u==='admin'&&p==='admin123'){
    S.isAdmin=true;
    document.getElementById('au').value='';
    document.getElementById('ap').value='';
    go('page-admin');
    notif('✅ Admin Login Successful!','Welcome to the CivicConnect Admin Panel.');
  } else { toast('❌','Wrong username or password','#e63946'); }
}

function logout(){ S.me=null; S.isAdmin=false; go('page-landing'); }

// ════ CIVIC ════
function submitCivic(){
  const title=document.getElementById('cv-title').value.trim();
  const cat=document.getElementById('cv-cat').value;
  const desc=document.getElementById('cv-desc').value.trim();
  const loc=document.getElementById('cv-loc').value.trim();
  if(!title){toast('⚠️','Issue title is required','#f59e0b');return;}
  if(!desc){toast('⚠️','Description is required','#f59e0b');return;}
  if(!loc){toast('⚠️','Please enter or capture your location','#f59e0b');return;}
  const file=document.getElementById('cv-img').files[0];
  const done=img=>{
    S.comp.unshift({id:'CMP'+Date.now(),uid:S.me?.id||'GUEST',uname:S.me?.name||'Guest',title,cat,desc,loc,img,status:'pending',date:td()});
    save();
    ['cv-title','cv-desc','cv-loc'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('cv-img').value='';
    document.getElementById('cv-prev').style.display='none';
    renderComp();
    success('🏙️ Complaint Submitted!',`Your issue "<b>${title}</b>" has been reported. Authorities will review it shortly.`);
  };
  if(file){const r=new FileReader();r.onload=e=>done(e.target.result);r.readAsDataURL(file);}else done(null);
}

function renderComp(){
  const mine=S.comp.filter(c=>!S.me||c.uid===S.me.id);
  const el=document.getElementById('my-complaints');
  const dash=document.getElementById('d-complaints');
  if(!mine.length){
    const e='<div class="empty"><span class="empty-ico">📭</span><p>No complaints yet. Report an issue to get started!</p></div>';
    el.innerHTML=e;if(dash)dash.innerHTML=e;return;
  }
  const h=mine.map(ciHTML).join('');
  el.innerHTML=h;
  if(dash)dash.innerHTML=mine.slice(0,3).map(ciHTML).join('');
}

function ciHTML(c){
  return `<div class="ci">
    <div class="ci-ico">${c.cat.split(' ')[0]}</div>
    <div class="ci-body">
      <h4>${c.title}</h4>
      <div class="ci-desc">${c.desc.substring(0,90)}${c.desc.length>90?'...':''}</div>
      <div class="ci-meta">
        <span class="badge ${sb(c.status)}">${sl(c.status)}</span>
        <span class="ci-loc">📍 ${c.loc}</span>
        <span class="ci-date">${c.date}</span>
      </div>
    </div>
  </div>`;
}
function sb(s){return s==='pending'?'b-pending':s==='in-progress'?'b-progress':'b-resolved';}
function sl(s){return s==='pending'?'⏳ Pending':s==='in-progress'?'🔧 In Progress':'✅ Resolved';}

// ════ FOOD ════
function donateFood(){
  const n=document.getElementById('fd-name').value.trim();
  const q=document.getElementById('fd-qty').value.trim();
  const l=document.getElementById('fd-loc').value.trim();
  const c=document.getElementById('fd-contact').value.trim();
  if(!n||!q||!l||!c){toast('⚠️','Please fill all fields','#f59e0b');return;}
  S.food.unshift({id:'FD'+Date.now(),name:n,qty:q,loc:l,contact:c,donor:S.me?.name||'Anonymous',uid:S.me?.id||'GUEST',date:td()});
  save();
  ['fd-name','fd-qty','fd-loc','fd-contact'].forEach(i=>document.getElementById(i).value='');
  renderFood();
  success('🍲 Food Donation Listed!',`"<b>${n}</b>" is now visible to NGOs and volunteers nearby. Thank you for your generosity!`);
}

function renderFood(){
  const el=document.getElementById('food-list');
  if(!S.food.length){el.innerHTML='<div class="empty"><span class="empty-ico">🍽️</span><p>No donations yet. Be the first!</p></div>';return;}
  el.innerHTML='<div class="food-grid">'+S.food.map(f=>`
    <div class="fc">
      <div class="fc-head"><div class="fc-icon">🍛</div><div class="fc-name">${f.name}</div></div>
      <div class="fd">📦 <span>${f.qty}</span></div>
      <div class="fd">📍 <span>${f.loc}</span></div>
      <div class="fd">📞 <span>${f.contact}</span></div>
      <div class="fd" style="color:var(--text3)">🙋 <span>${f.donor} · ${f.date}</span></div>
      <button class="btn btn-orange btn-sm btn-full" style="margin-top:14px" onclick="toast('📞','Contacting ${f.contact}...','#f59e0b')">📞 Contact Donor</button>
    </div>`).join('')+'</div>';
}

// ════ FARMER ════
const EJ={tomato:'🍅',potato:'🥔',onion:'🧅',mango:'🥭',banana:'🍌',corn:'🌽',wheat:'🌾',milk:'🥛',egg:'🥚',coconut:'🥥',carrot:'🥕',rice:'🌾',spinach:'🥬'};
function pe(n){const k=Object.keys(EJ).find(k=>n.toLowerCase().includes(k));return k?EJ[k]:'🌿';}

function addProduct(){
  const n=document.getElementById('pr-name').value.trim();
  const pr=document.getElementById('pr-price').value.trim();
  const q=document.getElementById('pr-qty').value.trim();
  const c=document.getElementById('pr-contact').value.trim();
  if(!n||!pr||!q||!c){toast('⚠️','Please fill all required fields','#f59e0b');return;}
  const file=document.getElementById('pr-img').files[0];
  const done=img=>{
    S.products.unshift({id:'PRD'+Date.now(),name:n,price:pr,qty:q,contact:c,img,farmer:S.me?.name||'Farmer',uid:S.me?.id||'GUEST',date:td()});
    save();
    ['pr-name','pr-price','pr-qty','pr-contact'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('pr-img').value='';
    document.getElementById('pr-prev').style.display='none';
    renderProds();
    success('🌾 Product Listed!',`"<b>${n}</b>" is now live in the marketplace. Customers can contact you directly!`);
  };
  if(file){const r=new FileReader();r.onload=e=>done(e.target.result);r.readAsDataURL(file);}else done(null);
}

function renderProds(){
  const g=document.getElementById('prod-grid');
  if(!S.products.length){g.innerHTML='<div class="empty" style="grid-column:1/-1"><span class="empty-ico">🌱</span><p>No products yet.</p></div>';return;}
  g.innerHTML=S.products.map(p=>`
    <div class="pc">
      <div class="pc-img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<span>${pe(p.name)}</span>`}</div>
      <div class="pc-body">
        <h4>${p.name}</h4>
        <div class="pc-price">${p.price}</div>
        <div class="pc-qty">📦 ${p.qty}</div>
        <div style="font-size:0.7rem;color:var(--text3);margin:5px 0;font-weight:600">🧑‍🌾 ${p.farmer}</div>
        <button class="btn btn-teal btn-sm btn-full" style="margin-top:10px" onclick="toast('📞','Contacting ${p.contact}...','#14b8a6')">📞 Contact Farmer</button>
      </div>
    </div>`).join('');
}

// ════ DASHBOARD ════
function renderDash(){
  syncPills();
  renderComp();
  const mine=S.comp.filter(c=>!S.me||c.uid===S.me.id);
  const myF=S.food.filter(f=>!S.me||f.uid===S.me.id);
  const myP=S.products.filter(p=>!S.me||p.uid===S.me.id);
  document.getElementById('qs-c').textContent=mine.length;
  document.getElementById('qs-f').textContent=myF.length;
  document.getElementById('qs-p').textContent=myP.length;
}

// ════ ADMIN ════
function renderAdmin(){
  const pend=S.comp.filter(c=>c.status==='pending').length;
  const prog=S.comp.filter(c=>c.status==='in-progress').length;
  const res=S.comp.filter(c=>c.status==='resolved').length;
  document.getElementById('st-u').textContent=S.users.length;
  document.getElementById('st-c').textContent=S.comp.length;
  document.getElementById('st-f').textContent=S.food.length;
  document.getElementById('st-p').textContent=S.products.length;
  document.getElementById('st-pend').textContent=pend;
  document.getElementById('st-prog').textContent=prog;
  document.getElementById('st-res').textContent=res;
  // sidebar counts
  document.getElementById('ac-users').textContent=S.users.length;
  document.getElementById('ac-comp').textContent=S.comp.length;
  document.getElementById('ac-food').textContent=S.food.length;
  document.getElementById('ac-prod').textContent=S.products.length;

  // activity
  const acts=[];
  S.comp.slice(0,3).forEach(c=>acts.push({i:'📢',t:`Complaint: "${c.title}"`,m:`By ${c.uname} · ${c.date}`,s:c.status}));
  S.food.slice(0,2).forEach(f=>acts.push({i:'🍲',t:`Food Donation: "${f.name}"`,m:`By ${f.donor} · ${f.date}`,s:null}));
  S.products.slice(0,2).forEach(p=>acts.push({i:'🌾',t:`Product: "${p.name}"`,m:`By ${p.farmer} · ${p.date}`,s:null}));
  document.getElementById('a-activity').innerHTML=acts.length?acts.map(a=>`
    <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fff;border:1.5px solid var(--border2);border-radius:14px;margin-bottom:10px;box-shadow:var(--sh);animation:cardIn 0.35s ease both">
      <div style="width:40px;height:40px;background:var(--red-light);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${a.i}</div>
      <div style="flex:1"><div style="font-size:0.84rem;font-weight:700;color:var(--text)">${a.t}</div><div style="font-size:0.74rem;color:var(--text2);margin-top:2px;font-weight:500">${a.m}</div></div>
      ${a.s?`<span class="badge ${sb(a.s)}">${sl(a.s)}</span>`:''}
    </div>`).join(''):'<div class="empty"><span class="empty-ico">📭</span><p>No recent activity.</p></div>';

  // users
  document.getElementById('a-users').innerHTML=S.users.length
    ?S.users.map((u,i)=>`<tr><td style="color:var(--text3);font-weight:700">${i+1}</td><td><code>${u.id}</code></td><td><b>${u.name}</b></td><td>${u.mobile}</td><td>${u.joined}</td></tr>`).join('')
    :'<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:30px;font-weight:600">No users registered yet</td></tr>';

  renderAComp();
  renderAFood();
  renderAProds();
}

function renderAComp(){
  const f=document.getElementById('cf')?.value||'';
  const data=f?S.comp.filter(c=>c.status===f):S.comp;
  const el=document.getElementById('a-complaints');
  if(!data.length){el.innerHTML='<div class="empty"><span class="empty-ico">📭</span><p>No complaints found.</p></div>';return;}
  el.innerHTML=data.map(c=>`
    <div class="acr">
      <div class="acr-ico">${c.cat.split(' ')[0]}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:0.92rem;margin-bottom:3px">${c.title}</div>
        <div style="font-size:0.78rem;color:var(--text2);margin-bottom:3px;font-weight:500">${c.cat} · 📍 ${c.loc}</div>
        <div style="font-size:0.76rem;color:var(--text3);margin-bottom:3px;font-weight:500">📄 ${c.desc.substring(0,85)}${c.desc.length>85?'...':''}</div>
        <div style="font-size:0.74rem;color:var(--text3);margin-bottom:10px;font-weight:500">👤 ${c.uname} (${c.uid}) · 📅 ${c.date}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="badge ${sb(c.status)}">${sl(c.status)}</span>
          <select class="ss" onchange="updStatus('${c.id}',this.value)">
            <option value="pending"     ${c.status==='pending'    ?'selected':''}>⏳ Pending</option>
            <option value="in-progress" ${c.status==='in-progress'?'selected':''}>🔧 In Progress</option>
            <option value="resolved"    ${c.status==='resolved'   ?'selected':''}>✅ Resolved</option>
          </select>
          <button class="btn btn-outline btn-sm" style="color:var(--red);border-color:var(--red-mid);padding:6px 12px" onclick="delComp('${c.id}')">🗑️ Delete</button>
        </div>
      </div>
      ${c.img?`<img src="${c.img}" style="width:68px;height:68px;object-fit:cover;border-radius:10px;border:1.5px solid var(--border2);flex-shrink:0">`:''}
    </div>`).join('');
}

function renderAFood(){
  const el=document.getElementById('a-food');
  if(!S.food.length){el.innerHTML='<div class="empty"><span class="empty-ico">🍽️</span><p>No donations yet.</p></div>';return;}
  el.innerHTML='<div class="food-grid">'+S.food.map(f=>`
    <div class="fc">
      <div class="fc-head"><div class="fc-icon">🍛</div><div class="fc-name">${f.name}</div></div>
      <div class="fd">📦 <span>${f.qty}</span></div>
      <div class="fd">📍 <span>${f.loc}</span></div>
      <div class="fd">📞 <span>${f.contact}</span></div>
      <div class="fd" style="color:var(--text3)">🙋 <span>${f.donor} (${f.uid})</span></div>
      <div class="fd" style="color:var(--text3)">📅 <span>${f.date}</span></div>
      <button class="btn btn-outline btn-sm btn-full" style="margin-top:12px;color:var(--red);border-color:var(--red-mid)" onclick="delFood('${f.id}')">🗑️ Remove</button>
    </div>`).join('')+'</div>';
}

function renderAProds(){
  const el=document.getElementById('a-products');
  if(!S.products.length){el.innerHTML='<div class="empty" style="grid-column:1/-1"><span class="empty-ico">🌱</span><p>No products yet.</p></div>';return;}
  el.innerHTML=S.products.map(p=>`
    <div class="pc">
      <div class="pc-img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<span>${pe(p.name)}</span>`}</div>
      <div class="pc-body">
        <h4>${p.name}</h4>
        <div class="pc-price">${p.price}</div>
        <div class="pc-qty">📦 ${p.qty}</div>
        <div style="font-size:0.7rem;color:var(--text3);margin:5px 0;font-weight:600">🧑‍🌾 ${p.farmer} (${p.uid})</div>
        <button class="btn btn-outline btn-sm btn-full" style="margin-top:10px;color:var(--red);border-color:var(--red-mid)" onclick="delProd('${p.id}')">🗑️ Remove</button>
      </div>
    </div>`).join('');
}

function updStatus(id,status){
  const c=S.comp.find(c=>c.id===id);
  if(c){c.status=status;save();renderAdmin();toast('✅',`Status updated to "${status}"`, '#22c55e');}
}

// ════ DELETE with custom confirm ════
let _cb=null;
function showConf(msg,cb){
  document.getElementById('conf-msg').textContent=msg;
  _cb=cb;
  document.getElementById('conf-modal').classList.add('show');
}
function confYes(){document.getElementById('conf-modal').classList.remove('show');if(_cb){_cb();_cb=null;}}
function confNo(){document.getElementById('conf-modal').classList.remove('show');_cb=null;}

function delComp(id){showConf('Delete this complaint? This cannot be undone.',()=>{S.comp=S.comp.filter(c=>c.id!==id);save();renderAdmin();toast('🗑️','Complaint deleted','#e63946');});}
function delFood(id){showConf('Remove this food donation?',()=>{S.food=S.food.filter(f=>f.id!==id);save();renderAdmin();toast('🗑️','Donation removed','#e63946');});}
function delProd(id){showConf('Remove this product from the marketplace?',()=>{S.products=S.products.filter(p=>p.id!==id);save();renderAdmin();toast('🗑️','Product removed','#e63946');});}

function atab(id,el){
  document.querySelectorAll('.atab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.aside-item').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  el.classList.add('on');
  if(id==='at-complaints')renderAComp();
  if(id==='at-food')renderAFood();
  if(id==='at-products')renderAProds();
}

// ════ SUCCESS OVERLAY ════
function success(title,msg){
  document.getElementById('suc-title').textContent=title.replace(/<[^>]*>/g,'');
  document.getElementById('suc-msg').innerHTML=msg;
  const o=document.getElementById('success-overlay');
  o.classList.add('show');
  // auto-close after 4s
  clearTimeout(window._sucTimer);
  window._sucTimer=setTimeout(closeSuccess,4500);
}
function closeSuccess(){
  document.getElementById('success-overlay').classList.remove('show');
}

// ════ UTILITIES ════
function gps(fieldId,btn){
  btn.textContent='⌛ Locating...';btn.disabled=true;
  if(!navigator.geolocation){toast('📍','GPS not supported','#f59e0b');btn.textContent='📍 Capture GPS';btn.disabled=false;return;}
  navigator.geolocation.getCurrentPosition(
    pos=>{
      document.getElementById(fieldId).value=`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`;
      btn.textContent='✅ Captured';btn.disabled=false;
      setTimeout(()=>btn.textContent='📍 Capture GPS',2500);
      toast('📍','Location captured successfully!','#22c55e');
    },
    ()=>{
      document.getElementById(fieldId).value='Chennai, Tamil Nadu, India';
      btn.textContent='📍 Capture GPS';btn.disabled=false;
      toast('📍','Using default location','#f59e0b');
    }
  );
}

function previewImg(inp,prev){
  const f=document.getElementById(inp).files[0];
  if(!f)return;
  const r=new FileReader();
  r.onload=e=>{const i=document.getElementById(prev);i.src=e.target.result;i.style.display='block';};
  r.readAsDataURL(f);
}

// ════ TOAST ════
let _toastT=null;
function toast(icon,msg,color='#22c55e'){
  document.getElementById('toast-icon').textContent=icon;
  document.getElementById('toast-icon').style.background=color+'22';
  document.getElementById('toast-msg').textContent=msg;
  const el=document.getElementById('toast');
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(_toastT);
  _toastT=setTimeout(()=>el.classList.remove('show'),3000);
}

// ════ NOTIFICATION ════
let _notifT=null;
function notif(t,m){
  document.getElementById('notif-t').textContent=t;
  document.getElementById('notif-m').textContent=m;
  const el=document.getElementById('notif');
  el.classList.add('show');
  clearTimeout(_notifT);
  _notifT=setTimeout(()=>el.classList.remove('show'),4500);
}

// backdrop close
document.getElementById('cid-modal').addEventListener('click',e=>{if(e.target===document.getElementById('cid-modal'))document.getElementById('cid-modal').classList.remove('show');});
document.getElementById('conf-modal').addEventListener('click',e=>{if(e.target===document.getElementById('conf-modal'))confNo();});
document.getElementById('success-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('success-overlay'))closeSuccess();});

updateLandingStats();
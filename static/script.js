// ═══ STATE ═══
const S = {
  users:      JSON.parse(localStorage.getItem('cc_users')      || '[]'),
  complaints: JSON.parse(localStorage.getItem('cc_complaints') || '[]'),
  food:       JSON.parse(localStorage.getItem('cc_food')       || '[]'),
  products:   JSON.parse(localStorage.getItem('cc_products')   || '[]'),
  me: null, isAdmin: false
};

function save() {
  localStorage.setItem('cc_users',      JSON.stringify(S.users));
  localStorage.setItem('cc_complaints', JSON.stringify(S.complaints));
  localStorage.setItem('cc_food',       JSON.stringify(S.food));
  localStorage.setItem('cc_products',   JSON.stringify(S.products));
}

function today(){ return new Date().toLocaleDateString('en-IN'); }

// Seed demo data
if (!S.users.length) {
  S.users.push({id:'CC99999',name:'Demo User',mobile:'9999999999',joined:today()});
  S.complaints.push({id:'CMP001',uid:'CC99999',uname:'Demo User',title:'Broken streetlight near park',cat:'💡 Broken Streetlight',desc:'The streetlight near Gandhi Park has been broken for 2 weeks.',loc:'Gandhi Park, Adyar, Chennai',img:null,status:'in-progress',date:today()});
  S.complaints.push({id:'CMP002',uid:'CC99999',uname:'Demo User',title:'Garbage overflow at bus stop',cat:'🗑️ Garbage Overflow',desc:'Garbage has not been collected for 5 days.',loc:'Anna Nagar, Chennai',img:null,status:'pending',date:today()});
  S.food.push({id:'FD001',name:'Cooked Rice & Sambar',qty:'20 plates',loc:'T Nagar, Chennai',contact:'9876543210',donor:'Priya Raman',uid:'CC99999',date:today()});
  S.products.push({id:'PRD001',name:'Organic Tomatoes',price:'₹40/kg',qty:'50 kg',contact:'9988776655',img:null,farmer:'Karthik Farms',uid:'CC99999',date:today()});
  S.products.push({id:'PRD002',name:'Fresh Coconuts',price:'₹25/piece',qty:'100 pieces',contact:'9977665544',img:null,farmer:'Murugan Farms',uid:'CC99999',date:today()});
  save();
}

// ═══ NAV ═══
function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='page-dashboard') renderDashboard();
  if(id==='page-civic')    { syncCIDs(); renderComplaints(); }
  if(id==='page-food')     { syncCIDs(); renderFood(); }
  if(id==='page-farmer')   { syncCIDs(); renderProducts(); }
  if(id==='page-admin')    renderAdmin();
}

function syncCIDs(){
  const v = S.me ? S.me.id : '';
  ['cid2','cid3','cid4'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent=v; });
}

// ═══ REGISTER ═══
function register(){
  const name=document.getElementById('reg-name').value.trim();
  const mobile=document.getElementById('reg-mobile').value.trim();
  if(!name){showToast('⚠️ Please enter your name');return;}
  if(mobile.length<10){showToast('⚠️ Enter a valid 10-digit mobile number');return;}
  const id='CC'+(10000+Math.floor(Math.random()*90000));
  S.users.push({id,name,mobile,joined:today()});
  save();
  document.getElementById('modal-id').textContent=id;
  document.getElementById('modal').classList.add('show');
  document.getElementById('reg-name').value='';
  document.getElementById('reg-mobile').value='';
}
function copyID(){
  navigator.clipboard.writeText(document.getElementById('modal-id').textContent)
    .then(()=>showToast('✅ Citizen ID copied!'));
}
function goToLogin(){
  document.getElementById('modal').classList.remove('show');
  showPage('page-login');
}
document.getElementById('modal').addEventListener('click',e=>{
  if(e.target===document.getElementById('modal')) document.getElementById('modal').classList.remove('show');
});
document.getElementById('confirm-modal').addEventListener('click',e=>{
  if(e.target===document.getElementById('confirm-modal')) confirmNo();
});

// ═══ LOGIN ═══
function login(){
  const id=document.getElementById('login-id').value.trim().toUpperCase();
  const mobile=document.getElementById('login-mobile').value.trim();
  const user=S.users.find(u=>u.id===id&&u.mobile===mobile);
  if(!user){showToast('❌ Invalid Citizen ID or Mobile Number');return;}
  S.me=user;
  document.getElementById('nav-cid').textContent=user.id;
  document.getElementById('dash-name').textContent=`Hello, ${user.name}! 👋`;
  showPage('page-dashboard');
  showNotif('👋 Welcome to CivicConnect!','Let\'s improve our community together.');
  document.getElementById('login-id').value='';
  document.getElementById('login-mobile').value='';
}

// ═══ ADMIN LOGIN ═══
function adminLogin(){
  const u=document.getElementById('admin-uname').value.trim();
  const p=document.getElementById('admin-pwd').value.trim();
  if(u==='admin'&&p==='admin123'){
    S.isAdmin=true;
    document.getElementById('admin-uname').value='';
    document.getElementById('admin-pwd').value='';
    showPage('page-admin');
    showNotif('✅ Admin Login Successful!','Welcome to the CivicConnect Admin Panel.');
  } else {
    showToast('❌ Wrong username or password');
  }
}

function logout(){ S.me=null; S.isAdmin=false; showPage('page-landing'); }

// ═══ CIVIC ═══
function submitCivic(){
  const title=document.getElementById('civic-title').value.trim();
  const cat=document.getElementById('civic-cat').value;
  const desc=document.getElementById('civic-desc').value.trim();
  const loc=document.getElementById('civic-loc').value.trim();
  if(!title){showToast('⚠️ Issue title is required');return;}
  if(!desc){showToast('⚠️ Description is required');return;}
  if(!loc){showToast('⚠️ Location is required');return;}
  const file=document.getElementById('civic-img').files[0];
  const finish=img=>{
    S.complaints.unshift({id:'CMP'+Date.now(),uid:S.me?.id||'GUEST',uname:S.me?.name||'Guest',title,cat,desc,loc,img,status:'pending',date:today()});
    save();
    ['civic-title','civic-desc','civic-loc'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('civic-img').value='';
    document.getElementById('civic-prev').style.display='none';
    renderComplaints();
    showNotif('✅ Complaint Submitted!',`"${title}" has been reported.`);
  };
  if(file){const r=new FileReader();r.onload=e=>finish(e.target.result);r.readAsDataURL(file);}
  else finish(null);
}

function renderComplaints(){
  const mine=S.complaints.filter(c=>!S.me||c.uid===S.me.id);
  const el=document.getElementById('my-complaints');
  const dash=document.getElementById('dash-complaints');
  if(!mine.length){
    const empty='<div class="empty-state"><div class="ei">📭</div><p>No complaints yet.</p></div>';
    el.innerHTML=empty; if(dash) dash.innerHTML=empty; return;
  }
  const html=mine.map(cHtml).join('');
  el.innerHTML=html;
  if(dash) dash.innerHTML=mine.slice(0,3).map(cHtml).join('');
}

function cHtml(c){
  return `<div class="complaint-item">
    <div class="c-icon">${c.cat.split(' ')[0]}</div>
    <div class="c-info">
      <h4>${c.title}</h4>
      <p>${c.desc.substring(0,90)}${c.desc.length>90?'...':''}</p>
      <div class="c-meta">
        <span class="badge ${sbadge(c.status)}">${slabel(c.status)}</span>
        <span class="c-loc">📍 ${c.loc}</span>
        <span style="font-size:0.7rem;color:var(--text3)">${c.date}</span>
      </div>
    </div>
  </div>`;
}
function sbadge(s){return s==='pending'?'badge-pending':s==='in-progress'?'badge-progress':'badge-resolved';}
function slabel(s){return s==='pending'?'⏳ Pending':s==='in-progress'?'🔧 In Progress':'✅ Resolved';}

// ═══ FOOD ═══
function donateFood(){
  const name=document.getElementById('food-name').value.trim();
  const qty=document.getElementById('food-qty').value.trim();
  const loc=document.getElementById('food-loc').value.trim();
  const contact=document.getElementById('food-contact').value.trim();
  if(!name||!qty||!loc||!contact){showToast('⚠️ Please fill all fields');return;}
  S.food.unshift({id:'FD'+Date.now(),name,qty,loc,contact,donor:S.me?.name||'Anonymous',uid:S.me?.id||'GUEST',date:today()});
  save();
  ['food-name','food-qty','food-loc','food-contact'].forEach(id=>document.getElementById(id).value='');
  renderFood();
  showNotif('🍲 Food Donation Listed!',`"${name}" is now available for pickup.`);
}

function renderFood(){
  const el=document.getElementById('food-list');
  if(!S.food.length){el.innerHTML='<div class="empty-state"><div class="ei">🍽️</div><p>No donations yet. Be the first!</p></div>';return;}
  el.innerHTML='<div class="food-grid">'+S.food.map(f=>`
    <div class="food-card">
      <h4>🍛 ${f.name}</h4>
      <div class="fd">📦 ${f.qty}</div>
      <div class="fd">📍 ${f.loc}</div>
      <div class="fd">📞 ${f.contact}</div>
      <div class="fd" style="color:var(--text3)">🙋 ${f.donor} · ${f.date}</div>
      <button class="btn btn-orange btn-sm btn-full" style="margin-top:12px" onclick="showToast('📞 Contacting: ${f.contact}')">📞 Contact Donor</button>
    </div>`).join('')+'</div>';
}

// ═══ FARMER ═══
const EMJ={tomato:'🍅',potato:'🥔',onion:'🧅',mango:'🥭',banana:'🍌',corn:'🌽',wheat:'🌾',milk:'🥛',egg:'🥚',coconut:'🥥',carrot:'🥕',rice:'🌾',spinach:'🥬'};
function pEmoji(n){const k=Object.keys(EMJ).find(k=>n.toLowerCase().includes(k));return k?EMJ[k]:'🌿';}

function addProduct(){
  const name=document.getElementById('prod-name').value.trim();
  const price=document.getElementById('prod-price').value.trim();
  const qty=document.getElementById('prod-qty').value.trim();
  const contact=document.getElementById('prod-contact').value.trim();
  if(!name||!price||!qty||!contact){showToast('⚠️ Please fill all fields');return;}
  const file=document.getElementById('prod-img').files[0];
  const done=img=>{
    S.products.unshift({id:'PRD'+Date.now(),name,price,qty,contact,img,farmer:S.me?.name||'Farmer',uid:S.me?.id||'GUEST',date:today()});
    save();
    ['prod-name','prod-price','prod-qty','prod-contact'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('prod-img').value='';
    document.getElementById('prod-prev').style.display='none';
    renderProducts();
    showNotif('🌾 Product Listed!',`"${name}" added to marketplace.`);
  };
  if(file){const r=new FileReader();r.onload=e=>done(e.target.result);r.readAsDataURL(file);}
  else done(null);
}

function renderProducts(){
  const g=document.getElementById('product-grid');
  if(!S.products.length){g.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="ei">🌱</div><p>No products yet.</p></div>';return;}
  g.innerHTML=S.products.map(p=>`
    <div class="product-card">
      <div class="product-img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<span>${pEmoji(p.name)}</span>`}</div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="product-price">${p.price}</div>
        <div class="product-qty">📦 ${p.qty}</div>
        <div style="font-size:0.72rem;color:var(--text3);margin:4px 0">🧑‍🌾 ${p.farmer}</div>
        <button class="btn btn-green btn-sm btn-full" style="margin-top:10px" onclick="showToast('📞 Contacting: ${p.contact}')">📞 Contact Farmer</button>
      </div>
    </div>`).join('');
}

// ═══ DASHBOARD ═══
function renderDashboard(){ renderComplaints(); }

// ═══ ADMIN ═══
function renderAdmin(){
  const pending=S.complaints.filter(c=>c.status==='pending').length;
  const inprog=S.complaints.filter(c=>c.status==='in-progress').length;
  const resolved=S.complaints.filter(c=>c.status==='resolved').length;

  document.getElementById('st-users').textContent=S.users.length;
  document.getElementById('st-complaints').textContent=S.complaints.length;
  document.getElementById('st-food').textContent=S.food.length;
  document.getElementById('st-products').textContent=S.products.length;
  document.getElementById('st-pending').textContent=pending;
  document.getElementById('st-inprog').textContent=inprog;
  document.getElementById('st-resolved').textContent=resolved;

  // Recent activity
  const acts=[];
  S.complaints.slice(0,3).forEach(c=>acts.push({icon:'📢',text:`Complaint: "${c.title}" by ${c.uname}`,date:c.date,status:c.status}));
  S.food.slice(0,2).forEach(f=>acts.push({icon:'🍲',text:`Donation: "${f.name}" by ${f.donor}`,date:f.date,status:null}));
  S.products.slice(0,2).forEach(p=>acts.push({icon:'🌾',text:`Product: "${p.name}" by ${p.farmer}`,date:p.date,status:null}));
  document.getElementById('recent-activity').innerHTML=acts.length
    ? acts.map(a=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#fff;border:1.5px solid var(--border);border-radius:10px;margin-bottom:10px;box-shadow:0 1px 6px var(--shadow)">
        <span style="font-size:1.4rem">${a.icon}</span>
        <div style="flex:1"><div style="font-size:0.85rem;font-weight:600">${a.text}</div><div style="font-size:0.72rem;color:var(--text3)">${a.date}</div></div>
        ${a.status?`<span class="badge ${sbadge(a.status)}">${slabel(a.status)}</span>`:''}
      </div>`).join('')
    : '<div class="empty-state"><div class="ei">📭</div><p>No recent activity.</p></div>';

  // Users table
  document.getElementById('admin-users-body').innerHTML=S.users.length
    ? S.users.map((u,i)=>`<tr><td style="color:var(--text3)">${i+1}</td><td><code>${u.id}</code></td><td><b>${u.name}</b></td><td>${u.mobile}</td><td>${u.joined}</td></tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:30px">No users yet</td></tr>';

  renderAdminComplaints();
  renderAdminFood();
  renderAdminProducts();
}

function renderAdminComplaints(){
  const filter=document.getElementById('filter-status')?.value||'';
  const data=filter?S.complaints.filter(c=>c.status===filter):S.complaints;
  const el=document.getElementById('admin-complaints-list');
  if(!data.length){el.innerHTML='<div class="empty-state"><div class="ei">📭</div><p>No complaints found.</p></div>';return;}
  el.innerHTML=data.map(c=>`
    <div class="admin-c-row">
      <div style="font-size:1.8rem;flex-shrink:0">${c.cat.split(' ')[0]}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:0.95rem;margin-bottom:3px">${c.title}</div>
        <div style="font-size:0.8rem;color:var(--text2);margin-bottom:4px">${c.cat} &nbsp;·&nbsp; 📍 ${c.loc}</div>
        <div style="font-size:0.78rem;color:var(--text3);margin-bottom:6px">📄 ${c.desc.substring(0,80)}...</div>
        <div style="font-size:0.78rem;color:var(--text3);margin-bottom:10px">👤 ${c.uname} (${c.uid}) &nbsp;·&nbsp; 📅 ${c.date}</div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span class="badge ${sbadge(c.status)}">${slabel(c.status)}</span>
          <select class="status-select" onchange="updateStatus('${c.id}',this.value)">
            <option value="pending"     ${c.status==='pending'    ?'selected':''}>⏳ Pending</option>
            <option value="in-progress" ${c.status==='in-progress'?'selected':''}>🔧 In Progress</option>
            <option value="resolved"    ${c.status==='resolved'   ?'selected':''}>✅ Resolved</option>
          </select>
          <button class="btn btn-secondary btn-sm" style="color:var(--red);border-color:var(--red-mid)" onclick="deleteComplaint('${c.id}')">🗑️ Delete</button>
        </div>
      </div>
      ${c.img?`<img src="${c.img}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:1.5px solid var(--border);flex-shrink:0">` :''}
    </div>`).join('');
}

function renderAdminFood(){
  const el=document.getElementById('admin-food-list');
  if(!S.food.length){el.innerHTML='<div class="empty-state"><div class="ei">🍽️</div><p>No donations yet.</p></div>';return;}
  el.innerHTML='<div class="food-grid">'+S.food.map(f=>`
    <div class="food-card">
      <h4>🍛 ${f.name}</h4>
      <div class="fd">📦 ${f.qty}</div>
      <div class="fd">📍 ${f.loc}</div>
      <div class="fd">📞 ${f.contact}</div>
      <div class="fd" style="color:var(--text3)">🙋 ${f.donor} (${f.uid}) · ${f.date}</div>
      <button class="btn btn-secondary btn-sm btn-full" style="margin-top:10px;color:var(--red);border-color:var(--red-mid)" onclick="deleteFood('${f.id}')">🗑️ Remove</button>
    </div>`).join('')+'</div>';
}

function renderAdminProducts(){
  const el=document.getElementById('admin-products-list');
  if(!S.products.length){el.innerHTML='<div class="empty-state" style="grid-column:1/-1"><div class="ei">🌱</div><p>No products yet.</p></div>';return;}
  el.innerHTML=S.products.map(p=>`
    <div class="product-card">
      <div class="product-img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<span>${pEmoji(p.name)}</span>`}</div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="product-price">${p.price}</div>
        <div class="product-qty">📦 ${p.qty}</div>
        <div style="font-size:0.72rem;color:var(--text3);margin:4px 0">🧑‍🌾 ${p.farmer} (${p.uid})</div>
        <button class="btn btn-secondary btn-sm btn-full" style="margin-top:10px;color:var(--red);border-color:var(--red-mid)" onclick="deleteProd('${p.id}')">🗑️ Remove</button>
      </div>
    </div>`).join('');
}

function updateStatus(id,status){
  const c=S.complaints.find(c=>c.id===id);
  if(c){c.status=status;save();renderAdmin();showToast(`✅ Status updated to "${status}"`);}
}
/* ── CONFIRM MODAL ── */
let _pendingDelete = null;
function showConfirm(msg, cb){
  document.getElementById('confirm-msg').textContent = msg;
  _pendingDelete = cb;
  document.getElementById('confirm-modal').classList.add('show');
}
function confirmYes(){
  document.getElementById('confirm-modal').classList.remove('show');
  if(_pendingDelete){ _pendingDelete(); _pendingDelete=null; }
}
function confirmNo(){
  document.getElementById('confirm-modal').classList.remove('show');
  _pendingDelete=null;
}

function deleteComplaint(id){
  showConfirm('Delete this complaint?', ()=>{
    S.complaints=S.complaints.filter(c=>c.id!==id);
    save(); renderAdmin(); showToast('🗑️ Complaint deleted');
  });
}
function deleteFood(id){
  showConfirm('Remove this food donation?', ()=>{
    S.food=S.food.filter(f=>f.id!==id);
    save(); renderAdmin(); showToast('🗑️ Donation removed');
  });
}
function deleteProd(id){
  showConfirm('Remove this product?', ()=>{
    S.products=S.products.filter(p=>p.id!==id);
    save(); renderAdmin(); showToast('🗑️ Product removed');
  });
}

function switchTab(tabId,el){
  document.querySelectorAll('.admin-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s=>s.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  el.classList.add('active');
  if(tabId==='tab-complaints') renderAdminComplaints();
  if(tabId==='tab-food') renderAdminFood();
  if(tabId==='tab-products') renderAdminProducts();
}

// ═══ UTILITIES ═══
function captureGPS(fieldId,btn){
  btn.textContent='⌛ Getting...'; btn.disabled=true;
  if(!navigator.geolocation){showToast('❌ GPS not supported');btn.textContent='📍 Capture GPS';btn.disabled=false;return;}
  navigator.geolocation.getCurrentPosition(
    pos=>{
      document.getElementById(fieldId).value=`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`;
      btn.textContent='✅ Captured!';btn.disabled=false;
      setTimeout(()=>btn.textContent='📍 Capture GPS',2500);
      showToast('📍 Location captured!');
    },
    ()=>{
      document.getElementById(fieldId).value='Chennai, Tamil Nadu, India';
      btn.textContent='📍 Capture GPS';btn.disabled=false;
      showToast('📍 Default location used');
    }
  );
}

function previewImg(inputId,previewId){
  const file=document.getElementById(inputId).files[0];
  if(!file)return;
  const r=new FileReader();
  r.onload=e=>{const img=document.getElementById(previewId);img.src=e.target.result;img.style.display='block';};
  r.readAsDataURL(file);
}

function showNotif(title,msg){
  document.getElementById('notif-title').textContent=title;
  document.getElementById('notif-msg').textContent=msg;
  const el=document.getElementById('notification');
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),4500);
}

function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2800);
}


//api connect

function submitIssue(){

let name = document.getElementById("name").value
let issue = document.getElementById("issue").value

fetch("/report_issue",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
issue:issue
})
})
.then(res=>res.json())
.then(data=>{
alert(data.message)
})

}
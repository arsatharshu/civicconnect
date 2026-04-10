/* ═══════════════ CIVICCONNECT — app.js ═══════════════ */
'use strict';

/* ════ STATE ════ */
const S = {
  users:    JSON.parse(localStorage.getItem('cc_u')  || '[]'),
  comp:     JSON.parse(localStorage.getItem('cc_c')  || '[]'),
  food:     JSON.parse(localStorage.getItem('cc_f')  || '[]'),
  products: JSON.parse(localStorage.getItem('cc_p')  || '[]'),
  orders:   JSON.parse(localStorage.getItem('cc_o')  || '[]'),
  notifs:   JSON.parse(localStorage.getItem('cc_n')  || '[]'),
  subs:     JSON.parse(localStorage.getItem('cc_s')  || '[]'),
  me: null, isAdmin: false,
  _currentPri: 'low',
  _currentComp: null,
  _currentProd: null
};
function save() {
  localStorage.setItem('cc_u', JSON.stringify(S.users));
  localStorage.setItem('cc_c', JSON.stringify(S.comp));
  localStorage.setItem('cc_f', JSON.stringify(S.food));
  localStorage.setItem('cc_p', JSON.stringify(S.products));
  localStorage.setItem('cc_o', JSON.stringify(S.orders));
  localStorage.setItem('cc_n', JSON.stringify(S.notifs));
  localStorage.setItem('cc_s', JSON.stringify(S.subs));
}
function td() { return new Date().toLocaleDateString('en-IN'); }

/* ════ TRANSLATIONS ════ */
const LANG = {
  en: {
    notifications:'🔔 Notifications', clearAll:'Clear All',
    gotIt:'✓ Got it!', regSuccess:'Registration Successful!',
    regSuccessMsg:'Save your Citizen ID — you need it to login every time.',
    copyId:'📋 Copy ID', loginNow:'Login Now →',
    confirmDelete:'Confirm Delete', cancel:'Cancel', delete:'Delete',
    comments:'💬 Comments', writeComment:'Write a comment...',
    shareComplaint:'Share Complaint', copyLink:'📋 Copy', close:'Close',
    subscribeProduct:'Subscribe to Product', yourMobile:'📱 Your Mobile',
    subscribe:'🔔 Subscribe', bulkOrder:'📦 Post Bulk Order',
    bulkOrderDesc:'Post your requirement — farmers will contact you',
    productNeeded:'🌽 Product Needed', quantity:'📦 Quantity',
    contact:'📱 Contact', location:'📍 Location',
    postOrder:'📦 Post Order', tagline:'✨ Smart Community Support System',
    heroTitle:'Connect. Report.<br><em>Build Together.</em>',
    heroSub:'CivicConnect bridges citizens, farmers, NGOs, and administrators in one powerful digital ecosystem.',
    getStarted:'🚀 Get Started Free', loginBtn:'🔐 Login',
    feat1:'🏙️ Civic Issue Reporting', feat2:'🍲 Food Donation Portal',
    feat3:'🌾 Farmer Direct Market', feat4:'🏆 Points & Badges',
    citizens:'Citizens', issuesReported:'Issues Reported',
    foodDonations:'Food Donations', resolved:'Resolved',
    successStories:'🎉 Success Stories',
    createAccount:'Create Account', joinThousands:'Join thousands improving their community',
    fullName:'👤 Full Name', mobileNumber:'📱 Mobile Number',
    enterName:'Enter your full name', enterMobile:'Enter your 10-digit mobile number',
    createMyAccount:'✨ Create My Account', alreadyHave:'Already have an account?',
    loginHere:'Login here', backHome:'← Back to Home',
    welcomeBack:'Welcome Back', loginSub:'Login with your Citizen ID and mobile number',
    citizenId:'Citizen ID', loginDash:'→ Login to Dashboard',
    newHere:'New here?', createAccount2:'Create an account',
    langToggle:'🌐 EN', logout:'Logout',
    dashSub:'What would you like to do today?',
    myComplaints:'My Complaints', points:'🏆 Points', badges:'🏅 Badges',
    topCitizens:'🏆 Top Citizens This Week',
    myRecentComplaints:'📋 My Recent Complaints',
    reportCivic:'Report Civic Issues', reportCivicDesc:'Road damage, broken lights, garbage, water leakage — report directly.',
    reportNow:'Report Now →', foodDonation:'Food Donation',
    foodDonationDesc:'Donate surplus food or connect NGOs to distribute meals.',
    donateNow:'Donate Now →', farmerMarket:'Farmer Market',
    farmerMarketDesc:'Buy fresh produce from farmers or list your harvest.',
    exploreMarket:'Explore Market →', backDash:'← Dashboard',
    reportCivicIssues:'🏙️ Report Civic Issues',
    reportCivicSub:'Submit complaints & track real-time status',
    newComplaint:'📝 New Complaint', allComplaints:'📋 All Complaints',
    issueTitle:'📝 Issue Title', issueTitlePh:'e.g. Broken streetlight on Main Road',
    category:'🏷️ Category', description:'📄 Description',
    descPh:'Describe the issue in detail...', locationPh:'Your location',
    captureGps:'📍 Capture GPS', priority:'🚦 Priority',
    low:'🟢 Low', medium:'🟡 Medium', high:'🔴 High',
    issuePhoto:'📷 Issue Photo', optional:'(optional)',
    clickUpload:'Click or tap to upload a photo',
    submitComplaint:'🚨 Submit Complaint',
    foodPortal:'🍲 Food Donation Portal',
    foodPortalSub:'Donate food or find available donations near you',
    donateFood:'🍛 Donate Food', foodItemName:'🍛 Food Item Name',
    foodNamePh:'e.g. Cooked Rice, Bread, Biryani',
    pickupLocation:'📍 Pickup Location', donateFoodBtn:'🍲 Donate Food Now',
    bulkOrders:'📦 Bulk Orders', availableDonations:'🍽️ Available Donations',
    postBulkOrder:'+ Post Bulk Order Request',
    farmerMarketTitle:'🌾 Farmer Direct Market',
    farmerMarketSub:'Fresh produce directly from farmers to your table',
    priceTrend:'📈 Price Trend (Last 30 Days)',
    listProduct:'🌽 List Your Product', productName:'🌽 Product Name',
    productNamePh:'e.g. Organic Tomatoes', price:'💰 Price',
    season:'🌤️ Season', allYear:'All Year', summer:'Summer',
    monsoon:'Monsoon', winter:'Winter',
    productPhoto:'📷 Product Photo', listProduct2:'🌾 List My Product',
    marketplace:'🛒 Marketplace',
    myBadges:'🏅 My Badges', activityHistory:'📊 Activity History',
    totalPoints:'Total Points', exportCsv:'📤 Export CSV',
    profile:'Profile', home:'Home', civic:'Civic', food:'Food', market:'Market',
    roadDamage:'🚧 Road Damage'
  },
  ta: {
    notifications:'🔔 அறிவிப்புகள்', clearAll:'அனைத்தும் நீக்கு',
    gotIt:'✓ சரி!', regSuccess:'பதிவு வெற்றிகரமாக முடிந்தது!',
    regSuccessMsg:'உங்கள் குடிமகன் ஐடியை சேமிக்கவும் — உள்நுழைவதற்கு இது தேவை.',
    copyId:'📋 ஐடி நகலெடு', loginNow:'உள்நுழைவு →',
    confirmDelete:'நீக்கலை உறுதிப்படுத்தவும்', cancel:'ரத்துசெய்', delete:'நீக்கு',
    comments:'💬 கருத்துகள்', writeComment:'கருத்து எழுதுங்கள்...',
    shareComplaint:'புகாரை பகிரவும்', copyLink:'📋 நகலெடு', close:'மூடு',
    subscribeProduct:'தயாரிப்புக்கு சந்தா', yourMobile:'📱 உங்கள் மொபைல்',
    subscribe:'🔔 சந்தா', bulkOrder:'📦 மொத்த ஆர்டர்',
    bulkOrderDesc:'உங்கள் தேவையை பதிவிடுங்கள் — விவசாயிகள் தொடர்பு கொள்வார்கள்',
    productNeeded:'🌽 தேவையான பொருள்', quantity:'📦 அளவு',
    contact:'📱 தொடர்பு', location:'📍 இடம்',
    postOrder:'📦 ஆர்டர் பதிவிடு', tagline:'✨ ஸ்மார்ட் சமூக ஆதரவு அமைப்பு',
    heroTitle:'இணை. புகாரளி.<br><em>ஒன்றாக கட்டு.</em>',
    heroSub:'CivicConnect குடிமக்கள், விவசாயிகள், தன்னார்வ தொண்டு நிறுவனங்கள் மற்றும் நிர்வாகிகளை ஒரே டிஜிட்டல் சுற்றுச்சூழலில் இணைக்கிறது.',
    getStarted:'🚀 இலவசமாக தொடங்கு', loginBtn:'🔐 உள்நுழைவு',
    feat1:'🏙️ குடிமையான புகார் அறிக்கை', feat2:'🍲 உணவு தானம்',
    feat3:'🌾 விவசாயி நேரடி சந்தை', feat4:'🏆 புள்ளிகள் மற்றும் பதக்கங்கள்',
    citizens:'குடிமக்கள்', issuesReported:'புகாரிடப்பட்ட சிக்கல்கள்',
    foodDonations:'உணவு தானங்கள்', resolved:'தீர்க்கப்பட்டவை',
    successStories:'🎉 வெற்றிக் கதைகள்',
    createAccount:'கணக்கு உருவாக்கு', joinThousands:'ஆயிரக்கணக்கானோருடன் சேருங்கள்',
    fullName:'👤 முழு பெயர்', mobileNumber:'📱 மொபைல் எண்',
    enterName:'உங்கள் முழு பெயரை உள்ளிடவும்', enterMobile:'10 இலக்க மொபைல் எண்',
    createMyAccount:'✨ என் கணக்கை உருவாக்கு', alreadyHave:'ஏற்கனவே கணக்கு உள்ளதா?',
    loginHere:'இங்கே உள்நுழைவு', backHome:'← முகப்புக்கு திரும்பு',
    welcomeBack:'மீண்டும் வருக', loginSub:'குடிமகன் ஐடி மற்றும் மொபைல் எண்ணால் உள்நுழைவு',
    citizenId:'குடிமகன் ஐடி', loginDash:'→ டாஷ்போர்டுக்கு',
    newHere:'புதியவரா?', createAccount2:'கணக்கை உருவாக்கு',
    langToggle:'🌐 EN', logout:'வெளியேறு',
    dashSub:'இன்று என்ன செய்ய விரும்புகிறீர்கள்?',
    myComplaints:'என் புகார்கள்', points:'🏆 புள்ளிகள்', badges:'🏅 பதக்கங்கள்',
    topCitizens:'🏆 இந்த வாரம் சிறந்த குடிமக்கள்',
    myRecentComplaints:'📋 என் சமீபத்திய புகார்கள்',
    reportCivic:'குடிமையான சிக்கல்களை புகாரளி',
    reportCivicDesc:'சாலை சேதம், தெரு விளக்கு, குப்பை, தண்ணீர் கசிவு — நேரடியாக புகாரளிக்கவும்.',
    reportNow:'இப்போதே புகாரளி →', foodDonation:'உணவு தானம்',
    foodDonationDesc:'மிகுதி உணவை தானம் செய்யுங்கள் அல்லது தேவையுள்ளவர்களுக்கு வழங்குங்கள்.',
    donateNow:'இப்போதே தானம் →', farmerMarket:'விவசாயி சந்தை',
    farmerMarketDesc:'விவசாயிகளிடமிருந்து நேரடியாக விலைகொடுத்து வாங்குங்கள்.',
    exploreMarket:'சந்தையை ஆராய் →', backDash:'← டாஷ்போர்டு',
    reportCivicIssues:'🏙️ குடிமையான சிக்கல்களை புகாரளி',
    reportCivicSub:'புகார்களை சமர்ப்பி & நிலை நேரடியாக கண்காணி',
    newComplaint:'📝 புதிய புகார்', allComplaints:'📋 அனைத்து புகார்கள்',
    issueTitle:'📝 சிக்கல் தலைப்பு', issueTitlePh:'எ.கா. முக்கிய சாலையில் உடைந்த விளக்கு',
    category:'🏷️ வகை', description:'📄 விளக்கம்',
    descPh:'சிக்கலை விரிவாக விவரிக்கவும்...', locationPh:'உங்கள் இடம்',
    captureGps:'📍 GPS பெறு', priority:'🚦 முன்னுரிமை',
    low:'🟢 குறைவு', medium:'🟡 நடுத்தர', high:'🔴 அதிகம்',
    issuePhoto:'📷 சிக்கல் புகைப்படம்', optional:'(விருப்பமானது)',
    clickUpload:'படத்தை பதிவேற்றவும்',
    submitComplaint:'🚨 புகாரை சமர்ப்பி',
    foodPortal:'🍲 உணவு தான போர்டல்',
    foodPortalSub:'உணவை தானம் செய்யுங்கள் அல்லது கிடைக்கும் தானங்களை கண்டறியுங்கள்',
    donateFood:'🍛 உணவு தானம்', foodItemName:'🍛 உணவு பொருளின் பெயர்',
    foodNamePh:'எ.கா. சமைத்த சாதம், ரொட்டி, பிரியாணி',
    pickupLocation:'📍 பிக்அப் இடம்', donateFoodBtn:'🍲 இப்போதே தானம் செய்',
    bulkOrders:'📦 மொத்த ஆர்டர்கள்', availableDonations:'🍽️ கிடைக்கும் தானங்கள்',
    postBulkOrder:'+ மொத்த ஆர்டர் கோரிக்கை இடு',
    farmerMarketTitle:'🌾 விவசாயி நேரடி சந்தை',
    farmerMarketSub:'விவசாயிகளிடமிருந்து நேரடியாக புதிய விளைபொருட்கள்',
    priceTrend:'📈 விலை போக்கு (கடந்த 30 நாட்கள்)',
    listProduct:'🌽 உங்கள் பொருளை பட்டியலிடுங்கள்', productName:'🌽 பொருளின் பெயர்',
    productNamePh:'எ.கா. ஆர்கானிக் தக்காளி', price:'💰 விலை',
    season:'🌤️ பருவம்', allYear:'ஆண்டு முழுவதும்', summer:'கோடை',
    monsoon:'மழைக்காலம்', winter:'குளிர்காலம்',
    productPhoto:'📷 பொருளின் புகைப்படம்', listProduct2:'🌾 என் பொருளை பட்டியலிடு',
    marketplace:'🛒 சந்தை',
    myBadges:'🏅 என் பதக்கங்கள்', activityHistory:'📊 செயல்பாட்டு வரலாறு',
    totalPoints:'மொத்த புள்ளிகள்', exportCsv:'📤 CSV ஏற்றுமதி',
    profile:'சுயவிவரம்', home:'முகப்பு', civic:'குடிமை', food:'உணவு', market:'சந்தை',
    roadDamage:'🚧 சாலை சேதம்'
  }
};
let currentLang = localStorage.getItem('cc_lang') || 'en';

function t(key) { return (LANG[currentLang] && LANG[currentLang][key]) || LANG.en[key] || key; }

function applyLang() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const k = el.getAttribute('data-t');
    const val = t(k);
    if (val.includes('<br>') || val.includes('<em>')) el.innerHTML = val;
    else el.textContent = val;
  });
  document.querySelectorAll('[data-placeholder-t]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-placeholder-t'));
  });
  document.querySelectorAll('#lang-btn').forEach(btn => {
    btn.textContent = currentLang === 'en' ? '🌐 தமிழ்' : '🌐 EN';
  });
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ta' : 'en';
  localStorage.setItem('cc_lang', currentLang);
  applyLang();
  toast('🌐', currentLang === 'ta' ? 'தமிழில் மாற்றப்பட்டது' : 'Switched to English', '#8b5cf6');
}

/* ════ THEME ════ */
let currentTheme = localStorage.getItem('cc_theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('cc_theme', currentTheme);
  document.querySelectorAll('#theme-btn').forEach(b => b.textContent = currentTheme === 'dark' ? '☀️' : '🌙');
  toast(currentTheme === 'dark' ? '🌙' : '☀️', currentTheme === 'dark' ? 'Dark mode on' : 'Light mode on', '#8b5cf6');
}
document.querySelectorAll('#theme-btn').forEach(b => b.textContent = currentTheme === 'dark' ? '☀️' : '🌙');

/* ════ BADGE DEFINITIONS ════ */
const BADGE_DEFS = [
  { id:'first_report',  ico:'🏙️', name:'First Reporter',  desc:'Filed your first complaint',    pts:10  },
  { id:'reporter5',     ico:'📢', name:'Active Reporter',  desc:'Filed 5 complaints',            pts:50  },
  { id:'first_donate',  ico:'🍲', name:'Food Hero',        desc:'Made your first food donation', pts:15  },
  { id:'donor5',        ico:'🤝', name:'Super Donor',      desc:'Donated food 5 times',          pts:75  },
  { id:'first_product', ico:'🌾', name:'Farmer Star',      desc:'Listed your first product',     pts:20  },
  { id:'resolved1',     ico:'✅', name:'Problem Solver',   desc:'Had a complaint resolved',      pts:30  },
  { id:'voter',         ico:'👍', name:'Community Voice',  desc:'Voted on 3 complaints',         pts:10  },
  { id:'century',       ico:'💯', name:'Century Club',     desc:'Earned 100+ points',            pts:0   },
];

/* ════ SEED DEMO DATA ════ */
if (!S.users.length) {
  S.users.push({ id:'CC99999', name:'Demo User', mobile:'9999999999', joined:td(), pts:120, badges:['first_report','first_donate','resolved1'], activity:[] });
  S.comp.push({ id:'CMP001', uid:'CC99999', uname:'Demo User', title:'Broken streetlight near Gandhi Park', cat:'💡 Broken Streetlight', desc:'The streetlight near Gandhi Park has been broken for 2 weeks making the area unsafe at night.', loc:'Gandhi Park, Adyar, Chennai', img:null, status:'in-progress', priority:'medium', votes:4, voters:[], comments:[], date:td() });
  S.comp.push({ id:'CMP002', uid:'CC99999', uname:'Demo User', title:'Garbage overflow at Anna Nagar bus stop', cat:'🗑️ Garbage Overflow', desc:'Garbage has not been collected for 5 days near the Anna Nagar bus stand. Very unhygienic.', loc:'Anna Nagar, Chennai', img:null, status:'pending', priority:'high', votes:9, voters:[], comments:[], date:td() });
  S.comp.push({ id:'CMP003', uid:'CC99999', uname:'Demo User', title:'Pothole on OMR service road', cat:'🚧 Road Damage', desc:'Large pothole causing accidents near IT park exit.', loc:'OMR, Chennai', img:null, status:'resolved', priority:'high', votes:15, voters:[], comments:[], date:td() });
  S.food.push({ id:'FD001', name:'Cooked Rice & Sambar', qty:'20 plates', loc:'T Nagar, Chennai', contact:'9876543210', donor:'Priya Raman', uid:'CC99999', date:td() });
  S.products.push({ id:'PRD001', name:'Organic Tomatoes', price:'₹40/kg', qty:'50 kg', contact:'9988776655', img:null, farmer:'Karthik Farms', uid:'CC99999', date:td(), rating:4, ratingCount:8, season:'all' });
  S.products.push({ id:'PRD002', name:'Fresh Coconuts', price:'₹25/piece', qty:'100 pcs', contact:'9977665544', img:null, farmer:'Murugan Farms', uid:'CC99999', date:td(), rating:5, ratingCount:12, season:'all' });
  S.products.push({ id:'PRD003', name:'Alphonso Mangoes', price:'₹200/dozen', qty:'200 dozen', contact:'9955443322', img:null, farmer:'Velu Gardens', uid:'CC99999', date:td(), rating:5, ratingCount:20, season:'summer' });
  save();
}

/* ════ NAVIGATION ════ */
function go(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  const fns = {
    'page-landing':   () => { updateLandingStats(); renderSuccessFeed(); },
    'page-dashboard': () => renderDash(),
    'page-civic':     () => { syncPills(); renderComp(); },
    'page-food':      () => { syncPills(); renderFood(); renderBulkOrders(); },
    'page-farmer':    () => { syncPills(); renderProds(); renderTrendChart(); },
    'page-profile':   () => renderProfile(),
    'page-admin':     () => renderAdmin(),
  };
  if (fns[id]) fns[id]();
  applyLang();
}

function syncPills() {
  const v = S.me ? S.me.id : '';
  ['cid-civic','cid-food','cid-farmer'].forEach(id => { const e = document.getElementById(id); if(e) e.textContent = v; });
}

function updateLandingStats() {
  const resolved = S.comp.filter(c => c.status === 'resolved').length;
  document.getElementById('ls-u').textContent = S.users.length;
  document.getElementById('ls-c').textContent = S.comp.length;
  document.getElementById('ls-f').textContent = S.food.length;
  document.getElementById('ls-r').textContent = resolved;
}

/* ════ REGISTER ════ */
function register() {
  const n = document.getElementById('reg-name').value.trim();
  const m = document.getElementById('reg-mob').value.trim();
  if (!n) { toast('⚠️','Please enter your full name','#f59e0b'); return; }
  if (m.length < 10) { toast('⚠️','Enter a valid 10-digit mobile number','#f59e0b'); return; }
  const id = 'CC' + (10000 + Math.floor(Math.random() * 90000));
  const user = { id, name:n, mobile:m, joined:td(), pts:0, badges:[], activity:[] };
  S.users.push(user);
  save();
  document.getElementById('cid-val').textContent = id;
  document.getElementById('cid-modal').classList.add('show');
  document.getElementById('reg-name').value = '';
  document.getElementById('reg-mob').value = '';
  addNotif('🎉', t('regSuccess'), `Your Citizen ID: ${id}`);
}
function copyID() {
  navigator.clipboard.writeText(document.getElementById('cid-val').textContent)
    .then(() => toast('📋', 'Citizen ID copied!', '#22c55e'));
}
function goLogin() { document.getElementById('cid-modal').classList.remove('show'); go('page-login'); }

/* ════ LOGIN ════ */
function login() {
  const id = document.getElementById('li-id').value.trim().toUpperCase();
  const m  = document.getElementById('li-mob').value.trim();
  const u  = S.users.find(u => u.id === id && u.mobile === m);
  if (!u) { toast('❌','Invalid Citizen ID or Mobile Number','#e63946'); return; }
  S.me = u;
  document.getElementById('d-cid').textContent = u.id;
  document.getElementById('d-name').textContent = `Hello, ${u.name}! 👋`;
  go('page-dashboard');
  addNotif('👋','Welcome back!',`Good to see you, ${u.name}`);
  document.getElementById('li-id').value = '';
  document.getElementById('li-mob').value = '';
}

/* ════ ADMIN LOGIN ════ */
function adminLogin() {
  const u = document.getElementById('au').value.trim();
  const p = document.getElementById('ap').value.trim();
  if (u === 'admin' && p === 'admin123') {
    S.isAdmin = true;
    document.getElementById('au').value = '';
    document.getElementById('ap').value = '';
    go('page-admin');
    toast('✅','Admin login successful','#22c55e');
  } else { toast('❌','Wrong username or password','#e63946'); }
}
function logout() { S.me = null; S.isAdmin = false; go('page-landing'); }

/* ════ POINTS & BADGES ════ */
function addPoints(uid, pts, reason) {
  const u = S.users.find(u => u.id === uid);
  if (!u) return;
  u.pts = (u.pts || 0) + pts;
  u.activity = u.activity || [];
  u.activity.unshift({ pts, reason, date: td() });
  if (u.activity.length > 20) u.activity = u.activity.slice(0, 20);
  checkBadges(u);
  save();
}
function checkBadges(u) {
  const reports = S.comp.filter(c => c.uid === u.id).length;
  const donations = S.food.filter(f => f.uid === u.id).length;
  const products = S.products.filter(p => p.uid === u.id).length;
  const resolvedOwn = S.comp.filter(c => c.uid === u.id && c.status === 'resolved').length;
  u.badges = u.badges || [];
  const grant = (id) => { if (!u.badges.includes(id)) { u.badges.push(id); const b = BADGE_DEFS.find(d => d.id === id); if(b && b.pts) addPoints(u.id, b.pts, `Badge: ${b.name}`); showBadgeUnlock(b); } };
  if (reports >= 1) grant('first_report');
  if (reports >= 5) grant('reporter5');
  if (donations >= 1) grant('first_donate');
  if (donations >= 5) grant('donor5');
  if (products >= 1) grant('first_product');
  if (resolvedOwn >= 1) grant('resolved1');
  if ((u.pts || 0) >= 100) grant('century');
}
function showBadgeUnlock(b) {
  if (!b) return;
  toast('🏅', `Badge Unlocked: ${b.name}!`, '#8b5cf6');
}

/* ════ CIVIC ════ */
function setPri(el, val) {
  document.querySelectorAll('.pri-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  S._currentPri = val;
}

function submitCivic() {
  const title = document.getElementById('cv-title').value.trim();
  const cat   = document.getElementById('cv-cat').value;
  const desc  = document.getElementById('cv-desc').value.trim();
  const loc   = document.getElementById('cv-loc').value.trim();
  if (!title) { toast('⚠️', t('issueTitle') + ' required', '#f59e0b'); return; }
  if (!desc)  { toast('⚠️', t('description') + ' required', '#f59e0b'); return; }
  if (!loc)   { toast('⚠️', t('location') + ' required', '#f59e0b'); return; }
  const file = document.getElementById('cv-img').files[0];
  const done = img => {
    S.comp.unshift({ id:'CMP'+Date.now(), uid:S.me?.id||'GUEST', uname:S.me?.name||'Guest', title, cat, desc, loc, img, status:'pending', priority:S._currentPri, votes:0, voters:[], comments:[], date:td() });
    save();
    ['cv-title','cv-desc','cv-loc'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('cv-img').value = '';
    document.getElementById('cv-prev').style.display = 'none';
    if (S.me) { addPoints(S.me.id, 10, 'Submitted a complaint'); }
    renderComp();
    success('🏙️ Complaint Submitted!', `Your issue "<b>${title}</b>" has been reported. Authorities will review it shortly. <b>+10 pts</b>!`);
    addNotif('🏙️','New complaint filed', `"${title}" — ${cat}`);
  };
  if (file) { const r = new FileReader(); r.onload = e => done(e.target.result); r.readAsDataURL(file); }
  else done(null);
}

function renderComp() {
  const search = (document.getElementById('search-comp')?.value || '').toLowerCase();
  const mine = S.comp.filter(c => (!S.me || c.uid === S.me.id) && (!search || c.title.toLowerCase().includes(search) || c.loc.toLowerCase().includes(search)));
  const el = document.getElementById('my-complaints');
  const dash = document.getElementById('d-complaints');
  if (!mine.length) {
    const e = '<div class="empty"><span class="empty-ico">📭</span><p>No complaints yet.</p></div>';
    if(el) el.innerHTML = e;
    if(dash) dash.innerHTML = e;
    return;
  }
  const html = mine.map(ciHTML).join('');
  if(el) el.innerHTML = html;
  if(dash) dash.innerHTML = mine.slice(0,3).map(ciHTML).join('');
}

function ciHTML(c) {
  const voted = S.me && c.voters.includes(S.me.id);
  return `<div class="ci">
    <div class="ci-ico">${c.cat.split(' ')[0]}</div>
    <div class="ci-body">
      <h4>${c.title}</h4>
      <div class="ci-desc">${c.desc.substring(0,90)}${c.desc.length>90?'...':''}</div>
      <div class="ci-meta">
        <span class="badge ${sb(c.status)}">${sl(c.status)}</span>
        <span class="badge ${pb(c.priority)}">${pl(c.priority)}</span>
        <span class="ci-loc">📍 ${c.loc}</span>
        <span class="ci-date">${c.date}</span>
      </div>
      ${timelineHTML(c.status)}
      <div class="ci-actions">
        <button class="ci-btn vote-btn ${voted?'voted':''}" onclick="voteComp('${c.id}')">👍 ${c.votes}</button>
        <button class="ci-btn" onclick="openComments('${c.id}')">💬 ${(c.comments||[]).length}</button>
        <button class="ci-btn" onclick="openShare('${c.id}')">📤 Share</button>
      </div>
    </div>
  </div>`;
}

function timelineHTML(status) {
  const steps = ['pending','in-progress','resolved'];
  const idx = steps.indexOf(status);
  return `<div class="timeline">
    ${steps.map((s,i) => `
      <div class="tl-step">
        <div class="tl-dot ${i<idx?'done':''} ${i===idx?'current':''}"></div>
        ${i<steps.length-1?`<div class="tl-line ${i<idx?'done':''}"></div>`:''}
      </div>`).join('')}
    <span style="font-size:0.68rem;color:var(--text3);margin-left:4px">${sl(status)}</span>
  </div>`;
}

function sb(s){return s==='pending'?'b-pending':s==='in-progress'?'b-progress':'b-resolved';}
function sl(s){return s==='pending'?'⏳ Pending':s==='in-progress'?'🔧 In Progress':'✅ Resolved';}
function pb(p){return p==='high'?'b-high':p==='medium'?'b-medium':'b-low';}
function pl(p){return p==='high'?'🔴 High':p==='medium'?'🟡 Medium':'🟢 Low';}

/* VOTE */
function voteComp(id) {
  if (!S.me) { toast('⚠️','Please login to vote','#f59e0b'); return; }
  const c = S.comp.find(c => c.id === id);
  if (!c) return;
  if (c.voters.includes(S.me.id)) { toast('ℹ️','Already voted','#3b82f6'); return; }
  c.voters.push(S.me.id); c.votes++;
  const voterCount = S.comp.reduce((a,c) => a + c.voters.filter(v=>v===S.me.id).length, 0);
  if (voterCount >= 3) { const u = S.users.find(u=>u.id===S.me.id); checkBadges(u); }
  addPoints(S.me.id, 2, 'Voted on a complaint');
  save(); renderComp();
  toast('👍','Vote recorded! +2 pts','#22c55e');
}

/* COMMENTS */
function openComments(id) {
  S._currentComp = id;
  const c = S.comp.find(c => c.id === id);
  const list = document.getElementById('comment-list');
  list.innerHTML = (c.comments||[]).length ? c.comments.map(cm => `
    <div style="padding:10px 0;border-bottom:1px solid var(--border2)">
      <div style="font-size:0.78rem;font-weight:700;color:var(--red)">${cm.name}</div>
      <div style="font-size:0.82rem;color:var(--text);margin-top:2px">${cm.text}</div>
      <div style="font-size:0.7rem;color:var(--text3);margin-top:3px">${cm.date}</div>
    </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text3);font-size:0.84rem">No comments yet. Be the first!</div>';
  document.getElementById('comment-modal').classList.add('show');
}
function submitComment() {
  const text = document.getElementById('comment-input').value.trim();
  if (!text) return;
  const c = S.comp.find(c => c.id === S._currentComp);
  if (!c) return;
  c.comments = c.comments || [];
  c.comments.push({ name: S.me?.name||'Anonymous', text, date: td() });
  save();
  document.getElementById('comment-input').value = '';
  openComments(S._currentComp);
  toast('💬','Comment posted!','#22c55e');
}

/* SHARE */
function openShare(id) {
  const c = S.comp.find(c => c.id === id);
  if (!c) return;
  S._currentComp = id;
  const text = `🏙️ CIVIC ISSUE ALERT!\n\n📝 ${c.title}\n🏷️ ${c.cat}\n📍 ${c.loc}\n${sl(c.status)}\n\nReport via CivicConnect!`;
  document.getElementById('share-text').textContent = text;
  document.getElementById('share-modal').classList.add('show');
}
function shareWA() {
  const c = S.comp.find(c => c.id === S._currentComp);
  if (!c) return;
  const msg = encodeURIComponent(`🏙️ ${c.title} — ${c.loc} | ${sl(c.status)}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}
function copyShare() {
  const text = document.getElementById('share-text').textContent;
  navigator.clipboard.writeText(text).then(() => toast('📋','Copied to clipboard','#22c55e'));
}

/* ════ FOOD ════ */
function donateFood() {
  const n = document.getElementById('fd-name').value.trim();
  const q = document.getElementById('fd-qty').value.trim();
  const l = document.getElementById('fd-loc').value.trim();
  const c = document.getElementById('fd-contact').value.trim();
  if (!n||!q||!l||!c) { toast('⚠️','Please fill all fields','#f59e0b'); return; }
  S.food.unshift({ id:'FD'+Date.now(), name:n, qty:q, loc:l, contact:c, donor:S.me?.name||'Anonymous', uid:S.me?.id||'GUEST', date:td() });
  save();
  ['fd-name','fd-qty','fd-loc','fd-contact'].forEach(i => document.getElementById(i).value = '');
  if (S.me) addPoints(S.me.id, 15, 'Food donation');
  renderFood();
  success('🍲 Food Donation Listed!', `"<b>${n}</b>" is now available for NGOs and volunteers. <b>+15 pts</b>!`);
  addNotif('🍲','New food donation', `${n} — ${q} at ${l}`);
  checkSeasonalAlert(n);
}

function renderFood() {
  const el = document.getElementById('food-list');
  if (!el) return;
  if (!S.food.length) { el.innerHTML = '<div class="empty"><span class="empty-ico">🍽️</span><p>No donations yet.</p></div>'; return; }
  el.innerHTML = '<div class="food-grid">'+S.food.map(f=>`
    <div class="fc">
      <div class="fc-head"><div class="fc-icon">🍛</div><div class="fc-name">${f.name}</div></div>
      <div class="fd">📦 <span>${f.qty}</span></div>
      <div class="fd">📍 <span>${f.loc}</span></div>
      <div class="fd">📞 <span>${f.contact}</span></div>
      <div class="fd" style="color:var(--text3)">🙋 ${f.donor} · ${f.date}</div>
      <div style="display:flex;gap:6px;margin-top:12px">
        <button class="btn btn-orange btn-sm" style="flex:1" onclick="toast('📞','Contacting ${f.contact}...','#f59e0b')">📞 Contact</button>
      </div>
    </div>`).join('')+'</div>';
}

/* BULK ORDERS */
function submitBulk() {
  const p = document.getElementById('bulk-prod').value.trim();
  const q = document.getElementById('bulk-qty').value.trim();
  const c = document.getElementById('bulk-contact').value.trim();
  const l = document.getElementById('bulk-loc').value.trim();
  if (!p||!q||!c) { toast('⚠️','Fill all required fields','#f59e0b'); return; }
  S.orders.unshift({ id:'ORD'+Date.now(), product:p, qty:q, contact:c, loc:l||'Not specified', buyer:S.me?.name||'Anonymous', uid:S.me?.id||'GUEST', date:td() });
  save();
  ['bulk-prod','bulk-qty','bulk-contact','bulk-loc'].forEach(i => document.getElementById(i).value='');
  document.getElementById('bulk-modal').classList.remove('show');
  renderBulkOrders();
  toast('📦','Bulk order posted!','#f59e0b');
}
function renderBulkOrders() {
  const el = document.getElementById('bulk-list'); if(!el) return;
  if (!S.orders.length) { el.innerHTML=''; return; }
  el.innerHTML = S.orders.slice(0,3).map(o=>`
    <div class="bulk-item">
      <h5>📦 ${o.product} — ${o.qty}</h5>
      <div class="bfd">📍 ${o.loc} · 📞 ${o.contact}</div>
      <div class="bfd" style="color:var(--text3)">🛒 ${o.buyer} · ${o.date}</div>
    </div>`).join('');
}

/* ════ FARMER ════ */
function addProduct() {
  const n  = document.getElementById('pr-name').value.trim();
  const pr = document.getElementById('pr-price').value.trim();
  const q  = document.getElementById('pr-qty').value.trim();
  const c  = document.getElementById('pr-contact').value.trim();
  const s  = document.getElementById('pr-season').value;
  if (!n||!pr||!q||!c) { toast('⚠️','Please fill all required fields','#f59e0b'); return; }
  const file = document.getElementById('pr-img').files[0];
  const done = img => {
    S.products.unshift({ id:'PRD'+Date.now(), name:n, price:pr, qty:q, contact:c, img, farmer:S.me?.name||'Farmer', uid:S.me?.id||'GUEST', date:td(), rating:0, ratingCount:0, season:s });
    save();
    ['pr-name','pr-price','pr-qty','pr-contact'].forEach(i => document.getElementById(i).value='');
    document.getElementById('pr-img').value = '';
    document.getElementById('pr-prev').style.display = 'none';
    if (S.me) addPoints(S.me.id, 20, 'Listed a product');
    renderProds();
    success('🌾 Product Listed!', `"<b>${n}</b>" is now live in the marketplace! <b>+20 pts</b>!`);
    addNotif('🌾','New product listed', `${n} — ${pr}`);
    checkSubAlert(n);
  };
  if (file) { const r = new FileReader(); r.onload = e => done(e.target.result); r.readAsDataURL(file); }
  else done(null);
}

const EJ = { tomato:'🍅', potato:'🥔', onion:'🧅', mango:'🥭', banana:'🍌', corn:'🌽', wheat:'🌾', milk:'🥛', egg:'🥚', coconut:'🥥', carrot:'🥕', rice:'🌾', spinach:'🥬' };
function pe(n) { const k = Object.keys(EJ).find(k => n.toLowerCase().includes(k)); return k ? EJ[k] : '🌿'; }

function renderProds() {
  const search  = (document.getElementById('search-prod')?.value||'').toLowerCase();
  const season  = document.getElementById('season-filter')?.value||'';
  const g = document.getElementById('prod-grid');
  if (!g) return;
  let data = S.products;
  if (search) data = data.filter(p => p.name.toLowerCase().includes(search) || p.farmer.toLowerCase().includes(search));
  if (season) data = data.filter(p => p.season === season);
  if (!data.length) { g.innerHTML = '<div class="empty" style="grid-column:1/-1"><span class="empty-ico">🌱</span><p>No products found.</p></div>'; return; }
  g.innerHTML = data.map(p => `
    <div class="pc">
      <div class="pc-img">
        ${p.img ? `<img src="${p.img}" alt="${p.name}">` : `<span>${pe(p.name)}</span>`}
        ${p.season && p.season!=='all' ? `<div class="pc-season">${p.season==='summer'?'☀️ Summer':p.season==='monsoon'?'🌧️ Monsoon':'❄️ Winter'}</div>` : ''}
      </div>
      <div class="pc-body">
        <h4>${p.name}</h4>
        <div class="pc-price">${p.price}</div>
        <div class="pc-qty">📦 ${p.qty}</div>
        <div class="pc-farmer">🧑‍🌾 ${p.farmer}</div>
        <div class="stars">${renderStars(p.id, p.rating)}</div>
        <div style="font-size:0.7rem;color:var(--text3);margin-bottom:8px">${p.rating>0?`${p.rating.toFixed(1)}⭐ (${p.ratingCount} reviews)`:'No reviews yet'}</div>
        <div class="pc-actions">
          <button class="btn btn-teal btn-sm" style="flex:1" onclick="toast('📞','Contacting ${p.contact}...','#14b8a6')">📞 Contact</button>
          <button class="btn btn-outline btn-sm" onclick="openSubModal('${p.id}','${p.name}')">🔔</button>
        </div>
      </div>
    </div>`).join('');
}

function renderStars(pid, rating) {
  return [1,2,3,4,5].map(i => `<span class="star" onclick="rateProd('${pid}',${i})" style="color:${i<=Math.round(rating)?'#f59e0b':'#d1d5db'}">${i<=Math.round(rating)?'★':'☆'}</span>`).join('');
}
function rateProd(id, stars) {
  if (!S.me) { toast('⚠️','Login to rate','#f59e0b'); return; }
  const p = S.products.find(p => p.id === id);
  if (!p) return;
  const total = (p.rating * p.ratingCount + stars) / (p.ratingCount + 1);
  p.rating = Math.round(total * 10) / 10;
  p.ratingCount++;
  save(); renderProds();
  toast('⭐', `Rated ${stars} star${stars>1?'s':''}!`, '#f59e0b');
}

/* FARMER SUBSCRIPTION */
function openSubModal(pid, name) {
  S._currentProd = pid;
  document.getElementById('sub-prod-name').textContent = `🌾 ${name}`;
  document.getElementById('sub-mobile').value = S.me?.mobile || '';
  document.getElementById('sub-modal').classList.add('show');
}
function confirmSub() {
  const m = document.getElementById('sub-mobile').value.trim();
  if (m.length < 10) { toast('⚠️','Enter valid mobile','#f59e0b'); return; }
  const p = S.products.find(p => p.id === S._currentProd);
  S.subs.push({ pid: S._currentProd, mobile: m, name: p?.name||'Product', date: td() });
  save();
  document.getElementById('sub-modal').classList.remove('show');
  toast('🔔', `Subscribed to ${p?.name}! We'll notify you.`, '#14b8a6');
}

function checkSubAlert(name) {
  const matched = S.subs.filter(s => s.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
  if (matched.length) addNotif('🔔','Subscription Alert', `${matched.length} subscriber(s) notified about ${name}!`);
}

function checkSeasonalAlert(name) {
  const month = new Date().getMonth();
  const summer = [2,3,4], monsoon = [5,6,7,8], winter = [10,11,0,1];
  let season = 'all year';
  if (summer.includes(month)) season = 'summer';
  if (monsoon.includes(month)) season = 'monsoon';
  if (winter.includes(month)) season = 'winter';
  if (season !== 'all year') addNotif('🌤️','Seasonal Alert', `${name} is great for ${season} season!`);
}

/* ════ PRICE TREND CHART ════ */
let trendChartInstance = null;
const PRICE_DATA = {
  Tomatoes:  [42,45,38,50,55,48,40,42,45,50,55,42,38,45,50,48,42,40,44,46,50,52,48,42,40,38,42,45,50,48],
  Onions:    [30,32,28,35,38,34,30,28,32,35,38,30,28,34,36,34,30,28,32,34,36,38,34,30,28,26,30,32,35,34],
  Potatoes:  [25,26,24,28,30,27,25,24,26,28,30,25,24,27,28,27,25,24,26,27,28,30,27,25,24,22,25,26,28,27],
  Rice:      [60,60,58,62,62,60,60,58,62,62,60,60,58,62,62,60,60,58,62,62,60,60,58,62,62,60,60,58,62,62],
  Coconuts:  [22,24,20,26,28,24,22,20,24,26,28,22,20,24,26,24,22,20,24,26,28,30,26,22,20,18,22,24,26,24],
};
function renderTrendChart() {
  const canvas = document.getElementById('trend-chart'); if(!canvas) return;
  const prod = document.getElementById('trend-prod')?.value || 'Tomatoes';
  const data = PRICE_DATA[prod] || PRICE_DATA.Tomatoes;
  const labels = Array.from({length:30},(_,i)=>`Day ${i+1}`);
  if (trendChartInstance) { trendChartInstance.destroy(); }
  trendChartInstance = new Chart(canvas, {
    type:'line',
    data:{ labels, datasets:[{ label:`${prod} Price (₹/kg)`, data, borderColor:'#e63946', backgroundColor:'rgba(230,57,70,0.08)', tension:0.4, fill:true, pointRadius:2, pointHoverRadius:5, borderWidth:2 }] },
    options:{ responsive:true, plugins:{ legend:{ labels:{ color: getComputedStyle(document.documentElement).getPropertyValue('--text').trim()||'#333', font:{family:'Plus Jakarta Sans',size:12} }}}, scales:{ x:{ ticks:{ color:'#999', maxTicksLimit:8 }, grid:{ color:'rgba(0,0,0,0.05)' }}, y:{ ticks:{ color:'#999' }, grid:{ color:'rgba(0,0,0,0.05)' }}}}
  });
}

/* ════ SUCCESS STORIES FEED ════ */
function renderSuccessFeed() {
  const resolved = S.comp.filter(c => c.status === 'resolved');
  const el = document.getElementById('success-feed'); if(!el) return;
  if (!resolved.length) { el.innerHTML = '<div class="empty"><span class="empty-ico">🎉</span><p>No success stories yet. Resolved complaints will appear here!</p></div>'; return; }
  el.innerHTML = resolved.slice(0,6).map((c,i) => `
    <div class="sf-card" style="animation-delay:${i*0.06}s">
      <div class="sf-ico">✅</div>
      <div>
        <div class="sf-title">Issue Resolved!</div>
        <div class="sf-desc">${c.title} — ${c.loc}</div>
        <div class="sf-date">${c.date} · ${c.cat}</div>
      </div>
    </div>`).join('');
}

/* ════ DASHBOARD ════ */
function renderDash() {
  syncPills();
  renderComp();
  if (S.me) {
    const u = S.users.find(u => u.id === S.me.id);
    if (u) {
      document.getElementById('qs-pts').textContent = u.pts || 0;
      document.getElementById('qs-b').textContent   = (u.badges||[]).length;
    }
    const mine = S.comp.filter(c => c.uid === S.me.id);
    document.getElementById('qs-c').textContent = mine.length;
  }
  renderLeaderboardMini();
  renderBadgeStrip();
}
function renderBadgeStrip() {
  const el = document.getElementById('badge-strip'); if(!el) return;
  const u = S.me ? S.users.find(u => u.id === S.me.id) : null;
  if (!u || !(u.badges||[]).length) { el.innerHTML = ''; return; }
  el.innerHTML = u.badges.map(bid => {
    const b = BADGE_DEFS.find(d => d.id === bid);
    return b ? `<div class="b-chip">${b.ico} ${b.name}</div>` : '';
  }).join('');
}
function renderLeaderboardMini() {
  const el = document.getElementById('leaderboard-mini'); if(!el) return;
  const ranked = [...S.users].sort((a,b)=>(b.pts||0)-(a.pts||0)).slice(0,4);
  const medals = ['🥇','🥈','🥉','4️⃣'];
  el.innerHTML = ranked.map((u,i) => `
    <div class="lb-card" style="animation-delay:${i*0.06}s">
      <div class="lb-rank">${medals[i]}</div>
      <div class="lb-info"><div class="lb-name">${u.name}</div><div class="lb-pts">${u.pts||0} pts · ${(u.badges||[]).length} badges</div></div>
      <div class="lb-pts-big">${u.pts||0}</div>
    </div>`).join('');
}

/* ════ PROFILE ════ */
function renderProfile() {
  const u = S.me ? S.users.find(u => u.id === S.me.id) : null;
  if (!u) { go('page-login'); return; }
  document.getElementById('p-name').textContent  = u.name;
  document.getElementById('p-cid').textContent   = u.id;
  document.getElementById('p-joined').textContent = `Joined: ${u.joined}`;
  document.getElementById('p-pts').textContent   = u.pts || 0;
  document.getElementById('p-avatar').textContent = u.name.charAt(0).toUpperCase();
  // badges
  const bg = document.getElementById('p-badges');
  bg.innerHTML = BADGE_DEFS.map(b => {
    const has = (u.badges||[]).includes(b.id);
    return `<div class="badge-card ${has?'':'badge-locked'}">
      <div class="bc-ico">${b.ico}</div>
      <div class="bc-name">${b.name}</div>
      <div class="bc-desc">${b.desc}</div>
      ${has ? `<div style="font-size:0.68rem;color:var(--green);font-weight:700;margin-top:4px">✅ Unlocked</div>` : `<div style="font-size:0.68rem;color:var(--text3);font-weight:700;margin-top:4px">🔒 Locked</div>`}
    </div>`;
  }).join('');
  // activity
  const al = document.getElementById('p-activity');
  const acts = (u.activity||[]);
  al.innerHTML = acts.length ? acts.map((a,i) => `
    <div class="pa-item" style="animation-delay:${i*0.04}s">
      <div class="pa-icon" style="background:var(--red-light)">🏆</div>
      <div class="pa-text">${a.reason}</div>
      <div class="pa-pts">+${a.pts} pts</div>
      <div class="pa-date">${a.date}</div>
    </div>`).join('') : '<div class="empty"><span class="empty-ico">📊</span><p>No activity yet. Start reporting issues!</p></div>';
}

/* ════ NOTIFICATIONS ════ */
function addNotif(ico, title, msg) {
  S.notifs.unshift({ ico, title, msg, date: td(), id: Date.now() });
  if (S.notifs.length > 30) S.notifs = S.notifs.slice(0, 30);
  save(); updateBellCount();
}
function updateBellCount() {
  const count = S.notifs.length;
  document.querySelectorAll('#bell-count').forEach(el => {
    el.textContent = count > 9 ? '9+' : count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
function toggleBell() {
  const panel = document.getElementById('bell-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderBellList();
}
function renderBellList() {
  const el = document.getElementById('bell-list');
  if (!S.notifs.length) { el.innerHTML = '<div class="bell-empty">No notifications yet</div>'; return; }
  el.innerHTML = S.notifs.map(n => `
    <div class="bell-item">
      <div class="bell-dot"></div>
      <div><div class="bell-it">${n.ico} ${n.title}</div><div class="bell-im">${n.msg}</div></div>
    </div>`).join('');
}
function clearNotifs() { S.notifs = []; save(); renderBellList(); updateBellCount(); toast('🔔','Notifications cleared','#8b5cf6'); }
document.addEventListener('click', e => {
  const panel = document.getElementById('bell-panel');
  const btn   = document.getElementById('bell-btn');
  if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) panel.classList.remove('open');
});

/* ════ ADMIN ════ */
function renderAdmin() {
  const pend = S.comp.filter(c=>c.status==='pending').length;
  const prog = S.comp.filter(c=>c.status==='in-progress').length;
  const res  = S.comp.filter(c=>c.status==='resolved').length;
  const rate = S.comp.length ? Math.round(res/S.comp.length*100) : 0;
  [$('st-u',S.users.length), $('st-c',S.comp.length), $('st-f',S.food.length), $('st-p',S.products.length),
   $('st-pend',pend), $('st-prog',prog), $('st-res',res), $('st-rate',rate+'%'),
   $('ac-u',S.users.length), $('ac-c',S.comp.length), $('ac-f',S.food.length), $('ac-p',S.products.length)].forEach(()=>{});
  function $(id,val){const e=document.getElementById(id);if(e)e.textContent=val;}
  $('st-u',S.users.length); $('st-c',S.comp.length); $('st-f',S.food.length); $('st-p',S.products.length);
  $('st-pend',pend); $('st-prog',prog); $('st-res',res); $('st-rate',rate+'%');
  $('ac-u',S.users.length); $('ac-c',S.comp.length); $('ac-f',S.food.length); $('ac-p',S.products.length);

  // charts
  renderAdminCharts();
  // activity
  const acts = [];
  S.comp.slice(0,3).forEach(c=>acts.push({i:'📢',t:`Complaint: "${c.title}"`,m:`${c.uname} · ${c.date}`,s:c.status}));
  S.food.slice(0,2).forEach(f=>acts.push({i:'🍲',t:`Donation: "${f.name}"`,m:`${f.donor} · ${f.date}`,s:null}));
  document.getElementById('a-activity').innerHTML = acts.map(a=>`
    <div class="acr">
      <div class="acr-ico">${a.i}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:0.86rem">${a.t}</div>
        <div style="font-size:0.74rem;color:var(--text2);margin-top:2px">${a.m}</div>
      </div>
      ${a.s?`<span class="badge ${sb(a.s)}">${sl(a.s)}</span>`:''}
    </div>`).join('') || '<div class="empty"><span class="empty-ico">📭</span><p>No activity.</p></div>';
  // users
  document.getElementById('a-users').innerHTML = S.users.map((u,i)=>`
    <tr><td style="color:var(--text3);font-weight:700">${i+1}</td>
    <td><code>${u.id}</code></td><td><b>${u.name}</b></td><td>${u.mobile}</td>
    <td style="color:var(--red);font-weight:700">${u.pts||0}</td>
    <td>${(u.badges||[]).map(b=>{const bd=BADGE_DEFS.find(d=>d.id===b);return bd?bd.ico:'';}).join(' ')}</td>
    <td>${u.joined}</td></tr>`).join('') ||
    '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:28px">No users yet</td></tr>';
  renderAComp(); renderAFood(); renderAProds(); renderALeaderboard();
}

let catChart=null, weekChart=null;
function renderAdminCharts() {
  const cats = {};
  S.comp.forEach(c => { cats[c.cat] = (cats[c.cat]||0)+1; });
  const cc = document.getElementById('cat-chart');
  if (cc) {
    if (catChart) catChart.destroy();
    catChart = new Chart(cc, {
      type:'doughnut',
      data:{ labels:Object.keys(cats), datasets:[{ data:Object.values(cats), backgroundColor:['#e63946','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#14b8a6'], borderWidth:0 }] },
      options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()||'#333', font:{size:11,family:'Plus Jakarta Sans'}, padding:10 }}}}
    });
  }
  const wc = document.getElementById('week-chart');
  if (wc) {
    if (weekChart) weekChart.destroy();
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const vals = days.map(()=>Math.floor(Math.random()*8)+1);
    weekChart = new Chart(wc, {
      type:'bar',
      data:{ labels:days, datasets:[{ label:'Complaints', data:vals, backgroundColor:'rgba(230,57,70,0.7)', borderRadius:8, borderSkipped:false }] },
      options:{ responsive:true, plugins:{ legend:{ labels:{ color:getComputedStyle(document.documentElement).getPropertyValue('--text').trim()||'#333', font:{size:11,family:'Plus Jakarta Sans'} }}}, scales:{ x:{ ticks:{color:'#999'}, grid:{display:false}}, y:{ ticks:{color:'#999'}, grid:{color:'rgba(0,0,0,0.05)'}}}}
    });
  }
}

function renderAComp() {
  const f  = document.getElementById('cf')?.value||'';
  const pf = document.getElementById('cpf')?.value||'';
  let data = S.comp;
  if (f)  data = data.filter(c=>c.status===f);
  if (pf) data = data.filter(c=>c.priority===pf);
  const el = document.getElementById('a-complaints');
  if (!data.length) { el.innerHTML='<div class="empty"><span class="empty-ico">📭</span><p>No complaints found.</p></div>'; return; }
  el.innerHTML = data.map(c=>`
    <div class="acr">
      <div class="acr-ico">${c.cat.split(' ')[0]}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:800;font-size:0.9rem;margin-bottom:3px">${c.title}</div>
        <div style="font-size:0.76rem;color:var(--text2);margin-bottom:3px">${c.cat} · 📍 ${c.loc}</div>
        <div style="font-size:0.75rem;color:var(--text3);margin-bottom:3px">📄 ${c.desc.substring(0,80)}...</div>
        <div style="font-size:0.73rem;color:var(--text3);margin-bottom:10px">👤 ${c.uname} (${c.uid}) · 📅 ${c.date} · 👍 ${c.votes} votes · 💬 ${(c.comments||[]).length}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="badge ${sb(c.status)}">${sl(c.status)}</span>
          <span class="badge ${pb(c.priority)}">${pl(c.priority)}</span>
          <select class="ss" onchange="updStatus('${c.id}',this.value)">
            <option value="pending"     ${c.status==='pending'    ?'selected':''}>⏳ Pending</option>
            <option value="in-progress" ${c.status==='in-progress'?'selected':''}>🔧 In Progress</option>
            <option value="resolved"    ${c.status==='resolved'   ?'selected':''}>✅ Resolved</option>
          </select>
          <button class="btn btn-outline btn-sm" style="color:var(--red);border-color:var(--red-mid);padding:5px 10px" onclick="delComp('${c.id}')">🗑️</button>
        </div>
      </div>
      ${c.img?`<img src="${c.img}" style="width:64px;height:64px;object-fit:cover;border-radius:10px;border:1.5px solid var(--border2);flex-shrink:0">`:''}
    </div>`).join('');
}

function renderAFood() {
  const el = document.getElementById('a-food');
  if (!S.food.length) { el.innerHTML='<div class="empty"><span class="empty-ico">🍽️</span><p>No donations yet.</p></div>'; return; }
  el.innerHTML='<div class="food-grid">'+S.food.map(f=>`
    <div class="fc">
      <div class="fc-head"><div class="fc-icon">🍛</div><div class="fc-name">${f.name}</div></div>
      <div class="fd">📦 ${f.qty}</div><div class="fd">📍 ${f.loc}</div>
      <div class="fd">📞 ${f.contact}</div>
      <div class="fd" style="color:var(--text3)">🙋 ${f.donor} (${f.uid}) · ${f.date}</div>
      <button class="btn btn-outline btn-sm btn-full" style="margin-top:10px;color:var(--red);border-color:var(--red-mid)" onclick="delFood('${f.id}')">🗑️ Remove</button>
    </div>`).join('')+'</div>';
}

function renderAProds() {
  const el = document.getElementById('a-products');
  if (!S.products.length) { el.innerHTML='<div class="empty" style="grid-column:1/-1"><span class="empty-ico">🌱</span><p>No products yet.</p></div>'; return; }
  el.innerHTML = S.products.map(p=>`
    <div class="pc">
      <div class="pc-img">${p.img?`<img src="${p.img}" alt="${p.name}">`:`<span>${pe(p.name)}</span>`}</div>
      <div class="pc-body">
        <h4>${p.name}</h4><div class="pc-price">${p.price}</div>
        <div class="pc-qty">📦 ${p.qty}</div>
        <div class="pc-farmer">🧑‍🌾 ${p.farmer} (${p.uid})</div>
        <div style="font-size:0.72rem;color:var(--text3)">⭐ ${p.rating} · ${p.ratingCount} reviews · ${p.season}</div>
        <button class="btn btn-outline btn-sm btn-full" style="margin-top:10px;color:var(--red);border-color:var(--red-mid)" onclick="delProd('${p.id}')">🗑️ Remove</button>
      </div>
    </div>`).join('');
}

function renderALeaderboard() {
  const el = document.getElementById('a-leaderboard'); if(!el) return;
  const ranked = [...S.users].sort((a,b)=>(b.pts||0)-(a.pts||0));
  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = ranked.map((u,i)=>`
    <div class="lb-full-card">
      <div style="font-size:1.4rem;width:32px;text-align:center">${medals[i]||i+1}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;font-size:0.9rem">${u.name}</div>
        <div style="font-size:0.74rem;color:var(--text2);margin-top:2px"><code>${u.id}</code> · ${(u.badges||[]).map(b=>{const bd=BADGE_DEFS.find(d=>d.id===b);return bd?bd.ico:'';}).join(' ')}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:1.2rem;font-weight:800;color:var(--red)">${u.pts||0}</div>
        <div style="font-size:0.68rem;color:var(--text3)">points</div>
      </div>
    </div>`).join('') || '<div class="empty"><span class="empty-ico">🏆</span><p>No users yet.</p></div>';
}

function updStatus(id, status) {
  const c = S.comp.find(c=>c.id===id);
  if (!c) return;
  c.status = status;
  save(); renderAdmin();
  toast('✅', `Status → ${sl(status)}`, '#22c55e');
  if (status === 'resolved') addNotif('✅','Complaint Resolved!', c.title);
  if (c.uid) checkBadges(S.users.find(u=>u.id===c.uid));
}

/* ════ DELETE ════ */
let _cb = null;
function showConf(msg,cb){ document.getElementById('conf-msg').textContent=msg; _cb=cb; document.getElementById('conf-modal').classList.add('show'); }
function confYes(){ document.getElementById('conf-modal').classList.remove('show'); if(_cb){_cb();_cb=null;} }
function confNo() { document.getElementById('conf-modal').classList.remove('show'); _cb=null; }
function delComp(id){ showConf('Delete this complaint?',()=>{ S.comp=S.comp.filter(c=>c.id!==id); save(); renderAdmin(); toast('🗑️','Deleted','#e63946'); }); }
function delFood(id){ showConf('Remove this donation?',()=>{ S.food=S.food.filter(f=>f.id!==id); save(); renderAdmin(); toast('🗑️','Removed','#e63946'); }); }
function delProd(id){ showConf('Remove this product?',()=>{ S.products=S.products.filter(p=>p.id!==id); save(); renderAdmin(); toast('🗑️','Removed','#e63946'); }); }

function atab(id, el) {
  document.querySelectorAll('.atab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.aside-item').forEach(s=>s.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  el.classList.add('on');
  const fns = { 'at-complaints':renderAComp, 'at-food':renderAFood, 'at-products':renderAProds, 'at-leaderboard':renderALeaderboard };
  if (fns[id]) fns[id]();
}

/* ════ EXPORT CSV ════ */
function exportCSV() {
  const rows = [['Type','ID','Name/Title','Details','Status','Date']];
  S.users.forEach(u=>rows.push(['User',u.id,u.name,u.mobile,'Active',u.joined]));
  S.comp.forEach(c=>rows.push(['Complaint',c.id,c.title,c.loc,c.status,c.date]));
  S.food.forEach(f=>rows.push(['Food',f.id,f.name,f.loc,'Available',f.date]));
  S.products.forEach(p=>rows.push(['Product',p.id,p.name,p.price+' '+p.qty,'Listed',p.date]));
  const csv = rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `CivicConnect_Export_${new Date().toLocaleDateString('en-IN').replace(/\//g,'-')}.csv`;
  a.click();
  toast('📤','CSV exported successfully!','#22c55e');
}

/* ════ SUCCESS OVERLAY ════ */
function success(title, msg) {
  document.getElementById('s-title').textContent = title.replace(/<[^>]*>/g,'');
  document.getElementById('s-msg').innerHTML = msg;
  document.getElementById('sov').classList.add('show');
  clearTimeout(window._sT);
  window._sT = setTimeout(closeSov, 4500);
}
function closeSov() { document.getElementById('sov').classList.remove('show'); }

/* ════ UTILITIES ════ */
function gps(fieldId, btn) {
  btn.textContent = '⌛ Locating...'; btn.disabled = true;
  if (!navigator.geolocation) { toast('📍','GPS not supported','#f59e0b'); btn.textContent=t('captureGps'); btn.disabled=false; return; }
  navigator.geolocation.getCurrentPosition(
    pos => { document.getElementById(fieldId).value=`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`; btn.textContent='✅ Captured'; btn.disabled=false; setTimeout(()=>btn.textContent=t('captureGps'),2500); toast('📍','Location captured!','#22c55e'); },
    ()   => { document.getElementById(fieldId).value='Chennai, Tamil Nadu, India'; btn.textContent=t('captureGps'); btn.disabled=false; toast('📍','Default location used','#f59e0b'); }
  );
}
function previewImg(inp, prev) {
  const f = document.getElementById(inp).files[0]; if(!f) return;
  const r = new FileReader(); r.onload=e=>{const i=document.getElementById(prev);i.src=e.target.result;i.style.display='block';}; r.readAsDataURL(f);
}

let _tt = null;
function toast(icon, msg, color='#22c55e') {
  document.getElementById('ti').textContent = icon;
  document.getElementById('ti').style.background = color+'22';
  document.getElementById('tm').textContent = msg;
  const el = document.getElementById('toast');
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(_tt); _tt = setTimeout(()=>el.classList.remove('show'), 3200);
}

/* BACKDROP CLOSE */
['cid-modal','conf-modal','comment-modal','share-modal','sub-modal','bulk-modal'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('click', e=>{ if(e.target===el) el.classList.remove('show'); });
});
document.getElementById('sov').addEventListener('click', e=>{ if(e.target===document.getElementById('sov')) closeSov(); });

/* ════ INIT ════ */
applyLang();
updateBellCount();
updateLandingStats();
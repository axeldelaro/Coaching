// ============================================================
// RECOMP — Application principale
// ============================================================
const CFG = window.RECOMP_CONFIG || {};
const LOCAL_MODE = !CFG.SUPABASE_URL || CFG.SUPABASE_URL.includes('VOTRE-PROJET');
let sb = null; // client Supabase (chargé dynamiquement, peut rester null si CDN indisponible)

async function initSupabase() {
  if (LOCAL_MODE) return;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    sb = createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  } catch {
    sb = null; // l'app fonctionnera en lecture du cache local ; retry possible
  }
}

// ---------- État global ----------
const S = {
  user: null,          // { id, email }
  profile: null,       // ligne profiles
  logs: [],            // logs 60 derniers jours
  outbox: JSON.parse(localStorage.getItem('rc_outbox') || '[]'),
  timer: null
};

// ---------- Utilitaires ----------
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const app = $('#app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

function lsKey(k) { return `rc_${S.user?.id || 'anon'}_${k}`; }
function cacheSet(k, v) { localStorage.setItem(lsKey(k), JSON.stringify(v)); }
function cacheGet(k, dflt = null) {
  try { return JSON.parse(localStorage.getItem(lsKey(k))) ?? dflt; } catch { return dflt; }
}

// ---------- Couche données (Supabase + cache + outbox) ----------
async function dbLoadProfile() {
  if (LOCAL_MODE || !sb) { S.profile = cacheGet('profile'); return; }
  const { data, error } = await sb.from('profiles').select('*').eq('id', S.user.id).maybeSingle();
  if (!error && data) { S.profile = data; cacheSet('profile', data); }
  else S.profile = cacheGet('profile'); // fallback offline
}

async function dbSaveProfile(patch) {
  S.profile = { ...(S.profile || { id: S.user.id }), ...patch, updated_at: new Date().toISOString() };
  cacheSet('profile', S.profile);
  if (LOCAL_MODE) return;
  if (!sb) { queueOp({ t: 'profile', row: S.profile }); return; }
  const { error } = await sb.from('profiles').upsert(S.profile);
  if (error) queueOp({ t: 'profile', row: S.profile });
}

async function dbLoadLogs() {
  const since = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  if (LOCAL_MODE || !sb) { S.logs = cacheGet('logs', []); return; }
  const { data, error } = await sb.from('logs').select('*').gte('day', since).order('day', { ascending: false });
  if (!error && data) { S.logs = data; cacheSet('logs', data); }
  else S.logs = cacheGet('logs', []);
}

async function dbSaveLog(kind, day, payload, { unique = false } = {}) {
  let row = unique ? S.logs.find(l => l.kind === kind && l.day === day) : null;
  if (row) { row.payload = payload; }
  else { row = { id: uid(), user_id: S.user.id, day, kind, payload, created_at: new Date().toISOString() }; S.logs.unshift(row); }
  cacheSet('logs', S.logs);
  if (LOCAL_MODE) return row;
  if (!sb) { queueOp({ t: 'log', row }); return row; }
  const { error } = await sb.from('logs').upsert(row);
  if (error) queueOp({ t: 'log', row });
  return row;
}

function queueOp(op) {
  S.outbox.push(op);
  localStorage.setItem('rc_outbox', JSON.stringify(S.outbox));
}

async function flushOutbox() {
  if (LOCAL_MODE || !sb || !S.outbox.length || !navigator.onLine) return;
  const pending = [...S.outbox]; S.outbox = [];
  for (const op of pending) {
    const { error } = op.t === 'profile'
      ? await sb.from('profiles').upsert(op.row)
      : await sb.from('logs').upsert(op.row);
    if (error) S.outbox.push(op);
  }
  localStorage.setItem('rc_outbox', JSON.stringify(S.outbox));
  if (!S.outbox.length) toast('☁️ Données synchronisées');
}
window.addEventListener('online', flushOutbox);

function offlinePill() {
  let p = $('.offline-pill');
  if (!navigator.onLine && !p) {
    p = document.createElement('div');
    p.className = 'offline-pill';
    p.textContent = 'Hors-ligne — les données seront synchronisées';
    document.body.appendChild(p);
  } else if (navigator.onLine && p) p.remove();
}
window.addEventListener('online', offlinePill);
window.addEventListener('offline', offlinePill);

// ---------- Calculs nutritionnels ----------
function computeTargets(a) {
  const w = +a.weight, h = +a.height, age = +a.age;
  const bmr = Math.round(10 * w + 6.25 * h - 5 * age + (a.sex === 'F' ? -161 : 5));
  const factors = { sedentaire: 1.2, leger: 1.375, actif: 1.55, tres_actif: 1.725 };
  const tdee = Math.round(bmr * (factors[a.activity] || 1.375));
  const delta = { perte: -350, maintien: 0, prise: +250 }[a.goal] ?? -350;
  let kcal = tdee + delta;
  kcal = Math.max(kcal, a.sex === 'F' ? 1300 : 1500);
  const p = Math.round(1.8 * w);
  const f = Math.round(0.9 * w);
  const c = Math.max(0, Math.round((kcal - p * 4 - f * 9) / 4));
  return { bmr, tdee, kcal, p, c, f };
}

// ---------- Adaptation du programme à l'anamnèse ----------
function buildProgram(a) {
  const prog = JSON.parse(JSON.stringify(window.DEFAULT_PROGRAM));
  const inj = (a.injuries || []).map(x => x.toLowerCase()).join(' ');
  const eq = a.equipment || [];
  const B = prog.sessions.find(s => s.id === 'B');
  if (/épaule|epaule|clavicule|coiffe/.test(inj)) {
    const dips = B.exercises.find(e => e.id === 'b3');
    dips.name = 'Pompes surélevées (mains sur table)';
    dips.cue = "⚠️ Antécédent épaule/clavicule : poussée limitée. Mains sur table stable, corps gainé, descente 2 s, amplitude sans douleur. Si 0 gêne après 2 semaines : réessayer les dips partiels.";
    dips.flag = 'clavicule';
  }
  if (!eq.includes('barre')) {
    const pull = B.exercises.find(e => e.id === 'b1');
    pull.name = 'Rowing inversé (sous une table solide)';
    pull.cue = "Allongé sous la table, prise large, corps gainé en planche. Tire la poitrine vers le bord. Plus les pieds sont loin, plus c'est dur.";
  }
  if (!eq.includes('chaise_romaine')) {
    const A = prog.sessions.find(s => s.id === 'A');
    const lomb = A.exercises.find(e => e.id === 'a4');
    lomb.name = 'Superman au sol';
    lomb.cue = "Allongé ventre au sol, lève bras et jambes 2 s, redescends contrôlé. Regard au sol, nuque neutre.";
    const abs = A.exercises.find(e => e.id === 'a5');
    abs.name = 'Crunch + dead bug';
    abs.cue = "Crunch : décolle les omoplates, pas la lombaire. Dead bug : lombaires plaquées au sol en permanence.";
  }
  if (/genou/.test(inj)) {
    const A = prog.sessions.find(s => s.id === 'A');
    A.exercises.forEach(e => { if (/squat|fente/i.test(e.name)) e.cue += " ⚠️ Genou : amplitude SANS douleur uniquement, tempo lent, stop à 3/10."; });
  }
  return prog;
}

// ---------- Notifications / rappels ----------
async function askNotifPermission() {
  if (!('Notification' in window)) { toast('Notifications non supportées sur ce navigateur'); return false; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { toast('Permission refusée — active-la dans les réglages Android'); return false; }
  return true;
}

async function fireNotif(title, body, tag) {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag, vibrate: [120, 60, 120] });
  } catch { /* silencieux */ }
}

function checkReminders() {
  const r = S.profile?.settings?.reminders;
  if (!r || !r.enabled || Notification?.permission !== 'granted') return;
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5);
  const day = now.getDay(); // 0=dim
  const t = todayStr();
  const firedKey = lsKey('fired_' + t);
  const fired = JSON.parse(localStorage.getItem(firedKey) || '{}');
  const mark = (k) => { fired[k] = 1; localStorage.setItem(firedKey, JSON.stringify(fired)); };

  if (r.workoutDays?.includes(day) && hhmm === r.workoutTime && !fired.workout) {
    fireNotif('🏋️ C\'est l\'heure de ta séance', 'Ton programme t\'attend. 45 minutes pour toi.', 'workout'); mark('workout');
  }
  if (r.weighTime && hhmm === r.weighTime && !fired.weigh) {
    fireNotif('⚖️ Pesée du matin', 'À jeun, mêmes conditions chaque jour. 10 secondes dans le Carnet.', 'weigh'); mark('weigh');
  }
  if (r.hydrate && ['10:00', '13:00', '16:00', '19:00'].includes(hhmm) && !fired['h' + hhmm]) {
    fireNotif('💧 Hydratation', 'Un grand verre d\'eau maintenant.', 'hydrate'); mark('h' + hhmm);
  }
}
setInterval(checkReminders, 30000);

// ---------- Mini-charts (canvas) ----------
function drawLine(canvas, values, { color = '#0E8A5F' } = {}) {
  const dpr = devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const vals = values.filter(v => v != null);
  if (vals.length < 2) { ctx.fillStyle = '#5B6E64'; ctx.font = '13px system-ui'; ctx.fillText('Pas encore assez de données', 10, h / 2); return; }
  const min = Math.min(...vals), max = Math.max(...vals);
  const pad = 8, span = (max - min) || 1;
  const X = (i) => pad + (i / (values.length - 1)) * (w - 2 * pad);
  const Y = (v) => h - pad - ((v - min) / span) * (h - 2 * pad);
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.beginPath();
  let started = false;
  values.forEach((v, i) => {
    if (v == null) return;
    if (!started) { ctx.moveTo(X(i), Y(v)); started = true; } else ctx.lineTo(X(i), Y(v));
  });
  ctx.stroke();
  ctx.fillStyle = color;
  values.forEach((v, i) => { if (v != null) { ctx.beginPath(); ctx.arc(X(i), Y(v), 3, 0, 7); ctx.fill(); } });
  ctx.fillStyle = '#5B6E64'; ctx.font = '11px system-ui';
  ctx.fillText(max.toFixed(1), 4, 12); ctx.fillText(min.toFixed(1), 4, h - 4);
}

function drawBars(canvas, labels, values, { color = '#0E8A5F', target = null } = {}) {
  const dpr = devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, target || 0, 1);
  const bw = w / values.length;
  values.forEach((v, i) => {
    const bh = (v / max) * (h - 26);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(i * bw + bw * 0.2, h - 18 - bh, bw * 0.6, bh, 4); ctx.fill();
    ctx.fillStyle = '#5B6E64'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], i * bw + bw / 2, h - 5);
    if (v) ctx.fillText(v, i * bw + bw / 2, h - 22 - bh);
  });
  if (target) {
    const ty = h - 18 - (target / max) * (h - 26);
    ctx.strokeStyle = '#B97E04'; ctx.setLineDash([4, 4]); ctx.beginPath();
    ctx.moveTo(0, ty); ctx.lineTo(w, ty); ctx.stroke(); ctx.setLineDash([]);
  }
}

// ============================================================
// ROUTEUR
// ============================================================
const routes = {};
function route(path, fn) { routes[path] = fn; }

function navigate() {
  const hash = location.hash.replace('#', '') || '/home';
  const [path, arg] = hash.split('@');
  if (!S.user) { renderAuth(); return; }
  if (!S.profile?.anamnese?.done && path !== '/onboarding') { location.hash = '#/onboarding'; return; }
  const fn = routes[path] || routes['/home'];
  $('#tabs').hidden = path === '/onboarding';
  $$('#tabs a').forEach(a => a.classList.toggle('on', path.startsWith('/' + a.dataset.tab)));
  window.scrollTo(0, 0);
  fn(arg);
}
window.addEventListener('hashchange', navigate);

function pageHead(eyebrow, title, extra = '') {
  return `<header class="page-head"><div class="eyebrow">${eyebrow}</div><div class="row between"><h1>${title}</h1>${extra}</div></header>`;
}

// ============================================================
// AUTH
// ============================================================
function renderAuth() {
  $('#tabs').hidden = true;
  app.innerHTML = `
  <div class="auth-wrap">
    <div class="logo-block">
      <img class="mark" src="icons/icon-192.png" alt="">
      <h1>RECOMP</h1>
      <p>Ton coach entraînement & nutrition.<br>${LOCAL_MODE ? '⚠️ Mode local (Supabase non configuré) — données sur cet appareil uniquement.' : 'Compte gratuit, données chiffrées au repos.'}</p>
    </div>
    <div class="card">
      ${LOCAL_MODE ? `
        <label class="field"><span>Ton prénom</span><input id="pseudo" placeholder="Axel"></label>
        <button class="btn" id="local-go">Commencer en mode local</button>
      ` : `
        <label class="field"><span>E-mail</span><input id="email" type="email" autocomplete="email" placeholder="toi@mail.com"></label>
        <label class="field"><span>Mot de passe</span><input id="pwd" type="password" autocomplete="current-password" placeholder="8 caractères min."></label>
        <button class="btn" id="login">Se connecter</button>
        <div style="height:8px"></div>
        <button class="btn secondary" id="signup">Créer un compte</button>
      `}
      <p class="muted small" style="margin-top:12px">Tes données t'appartiennent : export complet possible dans Réglages.</p>
    </div>
  </div>`;

  if (LOCAL_MODE) {
    $('#local-go').onclick = async () => {
      S.user = { id: 'local', email: 'local' };
      await dbLoadProfile(); await dbLoadLogs();
      if (!S.profile) await dbSaveProfile({ pseudo: $('#pseudo').value || 'Athlète', anamnese: {}, settings: {} });
      location.hash = '#/onboarding'; navigate();
    };
    return;
  }
  const doAuth = async (mode) => {
    const email = $('#email').value.trim(), password = $('#pwd').value;
    if (!email || password.length < 8) { toast('E-mail valide et mot de passe ≥ 8 caractères'); return; }
    const { data, error } = mode === 'in'
      ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password });
    if (error) { toast(error.message); return; }
    if (mode === 'up' && !data.session) { toast('Compte créé ! Vérifie ta boîte mail pour confirmer.'); return; }
    await onSignedIn(data.session.user);
  };
  $('#login').onclick = () => doAuth('in');
  $('#signup').onclick = () => doAuth('up');
}

async function onSignedIn(user) {
  S.user = { id: user.id, email: user.email };
  localStorage.setItem('rc_last_user', JSON.stringify(S.user));
  await dbLoadProfile();
  await dbLoadLogs();
  flushOutbox();
  if (!S.profile) await dbSaveProfile({ pseudo: user.email.split('@')[0], anamnese: {}, settings: {} });
  navigate();
}

// ============================================================
// ONBOARDING — Anamnèse en 4 étapes
// ============================================================
route('/onboarding', () => {
  const a = { sex: 'H', activity: 'leger', goal: 'perte', injuries: [], allergies: [], equipment: ['halteres', 'barre', 'chaise_romaine'], days: 2 };
  let step = 0;
  const steps = [stepBio, stepSante, stepLogistique, stepNutrition];

  function shell(inner, canNext = true) {
    app.innerHTML = `
      ${pageHead('Anamnèse', 'Faisons connaissance')}
      <div class="steps">${steps.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
      <div class="card">${inner}</div>
      <div class="row">
        ${step > 0 ? '<button class="btn ghost" id="prev">Retour</button>' : ''}
        <button class="btn grow" id="next" ${canNext ? '' : 'disabled'}>${step === steps.length - 1 ? 'Générer mon programme' : 'Continuer'}</button>
      </div>`;
    $('#prev') && ($('#prev').onclick = () => { step--; steps[step](); });
    $('#next').onclick = onNext;
  }

  function chips(name, options, multi = false) {
    return `<div class="choices" data-chips="${name}">${options.map(([v, l]) =>
      `<button type="button" class="chip ${multi ? (a[name].includes(v) ? 'on' : '') : (a[name] === v ? 'on' : '')}" data-v="${v}">${l}</button>`).join('')}</div>`;
  }
  function bindChips(multi = []) {
    $$('[data-chips]').forEach(box => {
      const name = box.dataset.chips;
      box.onclick = (e) => {
        const b = e.target.closest('.chip'); if (!b) return;
        if (multi.includes(name)) {
          const i = a[name].indexOf(b.dataset.v);
          i >= 0 ? a[name].splice(i, 1) : a[name].push(b.dataset.v);
          b.classList.toggle('on');
        } else {
          a[name] = b.dataset.v;
          $$('.chip', box).forEach(x => x.classList.toggle('on', x === b));
        }
      };
    });
  }

  function stepBio() {
    shell(`
      <h2>1 · Profil biométrique</h2>
      <label class="field"><span>Sexe biologique (pour le calcul calorique)</span>${chips('sex', [['H', 'Homme'], ['F', 'Femme']])}</label>
      <div class="row">
        <label class="field grow"><span>Âge</span><input id="age" type="number" inputmode="numeric" value="${a.age || ''}" placeholder="28"></label>
        <label class="field grow"><span>Taille (cm)</span><input id="height" type="number" inputmode="numeric" value="${a.height || ''}" placeholder="178"></label>
        <label class="field grow"><span>Poids (kg)</span><input id="weight" type="number" inputmode="decimal" step="0.1" value="${a.weight || ''}" placeholder="80"></label>
      </div>
      <label class="field"><span>Activité quotidienne (hors sport)</span>
        ${chips('activity', [['sedentaire', 'Sédentaire'], ['leger', 'Léger'], ['actif', 'Actif'], ['tres_actif', 'Très actif']])}
      </label>
      <label class="field"><span>Objectif</span>
        ${chips('goal', [['perte', '🔥 Perte de gras'], ['maintien', '⚖️ Recomposition'], ['prise', '💪 Prise de muscle']])}
      </label>`);
    bindChips();
  }

  function stepSante() {
    shell(`
      <h2>2 · Santé & articulations</h2>
      <p class="muted" style="margin-bottom:12px">Le programme s'adapte automatiquement : chaque zone cochée déclenche des remplacements d'exercices et des consignes de sécurité.</p>
      <label class="field"><span>Antécédents / douleurs (plusieurs choix possibles)</span>
        ${chips('injuries', [['epaule', 'Épaule / clavicule'], ['genou', 'Genou'], ['lombaires', 'Lombaires'], ['poignet', 'Poignet'], ['aucune', 'Aucune']], true)}
      </label>
      <label class="field"><span>Sommeil habituel (h/nuit)</span><input id="sleep" type="number" inputmode="decimal" step="0.5" value="${a.sleep || ''}" placeholder="7"></label>
      <label class="field"><span>Stress quotidien (1 = zen, 10 = surchauffe)</span><input id="stress" type="number" inputmode="numeric" min="1" max="10" value="${a.stress || ''}" placeholder="5"></label>`);
    bindChips(['injuries']);
  }

  function stepLogistique() {
    shell(`
      <h2>3 · Logistique & matériel</h2>
      <label class="field"><span>Matériel disponible</span>
        ${chips('equipment', [['halteres', 'Haltères'], ['barre', 'Barre de traction'], ['chaise_romaine', 'Chaise romaine'], ['banc', 'Banc'], ['elastiques', 'Élastiques']], true)}
      </label>
      <label class="field"><span>Charge d'haltères max (kg, par haltère)</span><input id="dbkg" type="number" inputmode="numeric" value="${a.dbkg || 16}"></label>
      <label class="field"><span>Séances par semaine</span>
        ${chips('days', [['2', '2'], ['3', '3'], ['4', '4']])}
      </label>`);
    bindChips(['equipment']);
  }

  function stepNutrition() {
    shell(`
      <h2>4 · Nutrition</h2>
      <label class="field"><span>Allergies / exclusions alimentaires</span>
        ${chips('allergies', [['oeufs', 'Œufs'], ['oignons', 'Oignons'], ['lactose', 'Lactose'], ['gluten', 'Gluten'], ['fruits_de_mer', 'Fruits de mer'], ['aucune', 'Aucune']], true)}
      </label>
      <label class="field"><span>Budget courses hebdo (€, approximatif)</span><input id="budget" type="number" inputmode="numeric" value="${a.budget || ''}" placeholder="50"></label>
      <p class="muted small">Les recettes embarquées sont déjà sans œufs et sans oignons. Les exclusions cochées filtreront les suggestions.</p>`);
    bindChips(['allergies']);
  }

  async function onNext() {
    // collecte des champs de l'étape
    ['age', 'height', 'weight', 'sleep', 'stress', 'dbkg', 'budget'].forEach(id => { const el = $('#' + id); if (el) a[id] = el.value; });
    if (step === 0 && (!+a.age || !+a.height || !+a.weight)) { toast('Âge, taille et poids sont nécessaires au calcul calorique'); return; }
    if (step < steps.length - 1) { step++; steps[step](); return; }
    // Génération finale
    a.days = +a.days || 2;
    a.done = true;
    const targets = computeTargets(a);
    const program = buildProgram(a);
    await dbSaveProfile({ anamnese: a, targets, program, settings: S.profile?.settings || {} });
    await dbSaveLog('journal', todayStr(), { weight: +a.weight, sleep: +a.sleep || null, energy: null, notes: 'Point de départ' }, { unique: true });
    toast('Programme généré ✅');
    location.hash = '#/home';
  }

  stepBio();
});

// ============================================================
// ACCUEIL
// ============================================================
route('/home', () => {
  const p = S.profile, t = p.targets || {};
  const week = S.logs.filter(l => l.kind === 'workout' && daysSince(l.day) < 7).length;
  const goalSessions = +p.anamnese?.days || 2;
  const meals = S.logs.find(l => l.kind === 'meals' && l.day === todayStr());
  const kcalDone = (meals?.payload.items || []).reduce((s, id) => s + (window.RECIPES.find(r => r.id === id)?.kcal || 0), 0);
  const ringPct = Math.min(1, week / goalSessions);
  const advice = window.Coach.dailyAdvice(S.logs, p)[0];
  const C = 2 * Math.PI * 50;

  app.innerHTML = `
    ${pageHead(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }), `Salut ${esc(p.pseudo || '')} 👋`)}
    <div class="card">
      <div class="hero-ring">
        <div class="ring">
          <svg width="116" height="116" viewBox="0 0 116 116">
            <circle cx="58" cy="58" r="50" fill="none" stroke="#E0E8E3" stroke-width="10"/>
            <circle cx="58" cy="58" r="50" fill="none" stroke="#0E8A5F" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ringPct)}"/>
          </svg>
          <div class="val"><b class="num">${week}/${goalSessions}</b><span>séances</span></div>
        </div>
        <div class="grow">
          <p class="muted small">Aujourd'hui</p>
          <p style="font-size:1.05rem"><b class="num">${kcalDone}</b> / <span class="num">${t.kcal || '—'}</span> kcal</p>
          <div class="mb" style="grid-template-columns:1fr; margin-top:6px">
            <div class="track"><div class="fill ${kcalDone > t.kcal ? 'over' : ''}" style="width:${Math.min(100, t.kcal ? kcalDone / t.kcal * 100 : 0)}%"></div></div>
          </div>
          <button class="btn sm secondary" style="margin-top:10px" onclick="location.hash='#/food'">Composer mes repas</button>
        </div>
      </div>
    </div>

    ${advice ? `<div class="advice ${advice.level}"><span class="ico">${advice.icon}</span><div>${esc(advice.text)} <a href="#/coach" style="color:var(--accent-deep);font-weight:700">Voir le coach →</a></div></div>` : ''}

    <div class="card">
      <div class="row between"><h2>Séance du jour</h2><span class="tagmeal">${esc(p.program?.name || '')}</span></div>
      ${nextSessionCard()}
    </div>

    <div class="card">
      <h2>💡 Tip du jour</h2>
      <p style="font-size:0.92rem">${esc(window.Coach.tipOfDay())}</p>
    </div>

    <button class="btn ghost" onclick="location.hash='#/settings'">⚙️ Réglages, rappels & export</button>`;
});

function daysSince(day) { return Math.round((Date.now() - new Date(day)) / 86400000); }

function nextSessionCard() {
  const sessions = S.profile.program?.sessions || [];
  if (!sessions.length) return '<p class="muted">Aucun programme.</p>';
  const lastW = S.logs.find(l => l.kind === 'workout');
  const lastId = lastW?.payload.sessionId;
  const idx = Math.max(0, sessions.findIndex(s => s.id === lastId) + 1) % sessions.length;
  const next = sessions[idx];
  return `
    <p style="font-weight:700; margin-bottom:4px">${esc(next.name)}</p>
    <p class="muted small">${next.exercises.length} exercices · ~45 min ${lastW ? `· dernière séance il y a ${daysSince(lastW.day)} j` : ''}</p>
    <button class="btn" style="margin-top:10px" onclick="location.hash='#/session@${next.id}'">▶️ Lancer la séance</button>`;
}

// ============================================================
// ENTRAÎNEMENT — liste + éditeur de programme
// ============================================================
route('/train', () => {
  const prog = S.profile.program;
  app.innerHTML = `
    ${pageHead('Programme', esc(prog?.name || 'Entraînement'))}
    <p class="muted" style="margin-bottom:12px">${esc(prog?.note || '')}</p>
    ${(prog?.sessions || []).map(s => `
      <div class="card">
        <div class="row between"><h2>${esc(s.name)}</h2></div>
        ${s.exercises.map((ex, i) => exCard(s.id, ex, i, true)).join('')}
        <button class="btn" onclick="location.hash='#/session@${s.id}'">▶️ Lancer</button>
      </div>`).join('')}
    <p class="muted small">↔ remplace un exercice par une variante · −/+ ajuste les séries. Tes modifications sont sauvegardées dans ton profil.</p>`;

  bindProgramEditing();
});

function exCard(sid, ex, i, editable) {
  return `
    <div class="ex ${ex.flag ? 'flagged' : ''}" data-sid="${sid}" data-i="${i}">
      <div class="row between">
        <span class="name">${i + 1}. ${esc(ex.name)}</span>
        ${editable ? `<span class="row">
          <button class="btn sm ghost act-swap" title="Variante">↔</button>
          <button class="btn sm ghost act-minus">−</button>
          <button class="btn sm ghost act-plus">+</button>
        </span>` : ''}
      </div>
      <div class="meta num">
        <span><b>${ex.sets}</b> × ${esc(ex.reps)}</span>
        <span>tempo <b>${esc(ex.tempo)}</b></span>
        <span>repos <b>${ex.rest}s</b></span>
        <span>RPE <b>${esc(ex.rpe)}</b></span>
      </div>
      <div class="cue">${esc(ex.cue)}</div>
    </div>`;
}

function bindProgramEditing() {
  $$('.ex').forEach(card => {
    const sid = card.dataset.sid, i = +card.dataset.i;
    const get = () => S.profile.program.sessions.find(s => s.id === sid).exercises[i];
    const save = () => dbSaveProfile({ program: S.profile.program }).then(() => navigate());
    $('.act-plus', card) && ($('.act-plus', card).onclick = () => { get().sets++; save(); });
    $('.act-minus', card) && ($('.act-minus', card).onclick = () => { const e = get(); if (e.sets > 1) { e.sets--; save(); } });
    $('.act-swap', card) && ($('.act-swap', card).onclick = () => {
      const e = get();
      const swaps = window.EXERCISE_SWAPS[e.id] || [];
      if (!swaps.length) { toast('Pas de variante pour cet exercice'); return; }
      const cur = swaps.indexOf(e.name);
      const next = swaps[(cur + 1) % swaps.length];
      if (!e._original) e._original = e.name;
      e.name = (next === e._original) ? e._original : next;
      // cycle : original → variantes → original
      if (cur === swaps.length - 1) e.name = e._original;
      save();
      toast('Exercice remplacé : ' + e.name);
    });
  });
}

// ============================================================
// LECTEUR DE SÉANCE
// ============================================================
route('/session', (sid) => {
  const base = S.profile.program.sessions.find(s => s.id === sid);
  if (!base) { location.hash = '#/train'; return; }
  const adapted = window.Coach.adaptSession(base, S.logs, S.profile);
  const sess = adapted.session;
  const draftKey = 'draft_' + sid + '_' + todayStr();
  const draft = cacheGet(draftKey, {});

  app.innerHTML = `
    ${pageHead('Séance en cours', esc(sess.name))}
    ${adapted.changed ? `<div class="advice warn"><span class="ico">🎚️</span><div>${esc(adapted.summary)}</div></div>`
      : `<div class="advice good"><span class="ico">✅</span><div>${esc(adapted.summary)}</div></div>`}
    ${sess.exercises.map((ex, ei) => `
      <div class="ex ${ex.flag ? 'flagged' : ''}">
        <span class="name">${ei + 1}. ${esc(ex.name)}</span>
        <div class="meta num"><span>cible <b>${ex.sets} × ${esc(ex.reps)}</b></span><span>tempo <b>${esc(ex.tempo)}</b></span><span>RPE <b>${esc(ex.rpe)}</b></span></div>
        <div class="cue">${esc(ex.cue)}</div>
        <div class="setline" style="margin-top:10px; font-size:0.72rem; color:var(--ink-soft)">
          <span></span><span style="text-align:center">KG</span><span style="text-align:center">REPS</span><span style="text-align:center">RPE</span><span></span>
        </div>
        ${Array.from({ length: ex.sets }, (_, si) => {
          const d = draft[`${ei}_${si}`] || {};
          return `
          <div class="setline" data-ei="${ei}" data-si="${si}">
            <span class="n">${si + 1}</span>
            <input inputmode="decimal" placeholder="kg" value="${d.weight ?? ''}" data-f="weight">
            <input inputmode="numeric" placeholder="reps" value="${d.reps ?? ''}" data-f="reps">
            <input inputmode="decimal" placeholder="RPE" value="${d.rpe ?? ''}" data-f="rpe">
            <button class="ok ${d.done ? 'done' : ''}">✓</button>
          </div>`;
        }).join('')}
      </div>`).join('')}
    <button class="btn" id="finish">🏁 Terminer & enregistrer la séance</button>
    <div style="height:70px"></div>`;

  const saveDraft = () => cacheSet(draftKey, draft);

  $$('.setline[data-ei]').forEach(line => {
    const k = `${line.dataset.ei}_${line.dataset.si}`;
    $$('input', line).forEach(inp => inp.oninput = () => {
      draft[k] = draft[k] || {}; draft[k][inp.dataset.f] = inp.value; saveDraft();
    });
    $('.ok', line).onclick = (e) => {
      draft[k] = draft[k] || {};
      draft[k].done = !draft[k].done;
      e.target.classList.toggle('done', draft[k].done);
      saveDraft();
      if (draft[k].done) {
        const ex = sess.exercises[+line.dataset.ei];
        startTimer(ex.rest);
        if (navigator.vibrate) navigator.vibrate(40);
      }
    };
  });

  $('#finish').onclick = async () => {
    const sets = [];
    Object.entries(draft).forEach(([k, v]) => {
      if (!v.done && !v.reps) return;
      const [ei, si] = k.split('_').map(Number);
      sets.push({ ex: sess.exercises[ei].name, n: si + 1, weight: +v.weight || 0, reps: +v.reps || 0, rpe: +v.rpe || 0 });
    });
    if (!sets.length) { toast('Valide au moins une série (✓) avant de terminer'); return; }
    await dbSaveLog('workout', todayStr(), { sessionId: sid, sessionName: sess.name, sets });
    localStorage.removeItem(lsKey(draftKey));
    stopTimer();
    toast('Séance enregistrée 💪');
    location.hash = '#/journal';
  };
});

// ---------- Minuteur de repos ----------
function startTimer(seconds) {
  stopTimer();
  let left = seconds;
  const bar = document.createElement('div');
  bar.className = 'timerbar';
  bar.innerHTML = `<span>⏱️ Repos</span><b class="num grow" id="tval"></b><button class="btn sm secondary" id="tskip">Passer</button>`;
  document.body.appendChild(bar);
  const render = () => { $('#tval').textContent = `${String(Math.floor(left / 60)).padStart(1, '0')}:${String(left % 60).padStart(2, '0')}`; };
  render();
  S.timer = setInterval(() => {
    left--;
    if (left <= 0) {
      stopTimer();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      fireNotif('⏱️ Repos terminé', 'Prochaine série !', 'rest');
    } else render();
  }, 1000);
  $('#tskip').onclick = stopTimer;
}
function stopTimer() {
  clearInterval(S.timer); S.timer = null;
  $$('.timerbar').forEach(b => b.remove());
}

// ============================================================
// REPAS — cibles, journée, recettes, courses
// ============================================================
route('/food', () => {
  const t = S.profile.targets || {};
  const allerg = S.profile.anamnese?.allergies || [];
  const recipes = window.RECIPES.filter(r => {
    if (allerg.includes('lactose') && /skyr|fromage blanc|lait|whey/i.test(r.ing.map(i => i[0]).join(' '))) return false;
    if (allerg.includes('gluten') && /pâtes|tortilla|flocons/i.test(r.ing.map(i => i[0]).join(' '))) return false;
    if (allerg.includes('fruits_de_mer') && /thon|sardine|saumon/i.test(r.ing.map(i => i[0]).join(' '))) return false;
    return true;
  });
  const meals = S.logs.find(l => l.kind === 'meals' && l.day === todayStr());
  const items = meals?.payload.items || [];
  const tot = items.reduce((s, id) => {
    const r = window.RECIPES.find(x => x.id === id);
    if (r) { s.kcal += r.kcal; s.p += r.p; s.c += r.c; s.f += r.f; }
    return s;
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const bar = (label, val, max) => `
    <div class="mb"><span>${label}</span>
      <div class="track"><div class="fill ${val > max ? 'over' : ''}" style="width:${Math.min(100, max ? val / max * 100 : 0)}%"></div></div>
      <span class="num" style="text-align:right">${val} / ${max || '—'} g</span>
    </div>`;

  app.innerHTML = `
    ${pageHead('Nutrition', 'Mes repas', `<button class="btn sm secondary" onclick="location.hash='#/shopping'">🛒 Courses</button>`)}
    <div class="card">
      <div class="row between"><h2>Aujourd'hui</h2><span class="num" style="font-family:Archivo;font-weight:800">${tot.kcal} / ${t.kcal || '—'} kcal</span></div>
      <div class="macro-bars">
        ${bar('Protéines', tot.p, t.p)}
        ${bar('Glucides', tot.c, t.c)}
        ${bar('Lipides', tot.f, t.f)}
      </div>
      <p class="muted small" style="margin-top:10px">Cibles calculées par Mifflin-St Jeor (BMR ${t.bmr || '—'} · TDEE ${t.tdee || '—'} kcal). Ajustables dans Réglages.</p>
    </div>

    <h2 style="font-size:1rem; margin:14px 0 8px">Recettes — appuie pour ajouter à ta journée</h2>
    ${recipes.map(r => {
      const n = items.filter(i => i === r.id).length;
      return `
      <div class="recipe">
        <div class="row1">
          <div>
            <span class="tagmeal">${r.meal}</span>
            <p style="font-weight:700; margin-top:5px">${esc(r.name)} ${n ? `<span style="color:var(--accent)">×${n}</span>` : ''}</p>
            <p class="muted small num">P ${r.p} · G ${r.c} · L ${r.f}</p>
          </div>
          <div style="text-align:right">
            <p class="kcal num">${r.kcal}<span class="muted small"> kcal</span></p>
            <div class="row" style="margin-top:6px; justify-content:flex-end">
              ${n ? `<button class="btn sm ghost rm" data-id="${r.id}">−</button>` : ''}
              <button class="btn sm secondary add" data-id="${r.id}">+ Ajouter</button>
            </div>
          </div>
        </div>
        <button class="btn sm ghost" style="margin-top:8px" onclick="location.hash='#/recipe@${r.id}'">📖 Recette & ingrédients</button>
      </div>`;
    }).join('')}`;

  const saveMeals = async (newItems) => {
    await dbSaveLog('meals', todayStr(), { items: newItems }, { unique: true });
    navigate();
  };
  $$('.add').forEach(b => b.onclick = () => saveMeals([...items, b.dataset.id]));
  $$('.rm').forEach(b => b.onclick = () => {
    const i = items.indexOf(b.dataset.id);
    const copy = [...items]; if (i >= 0) copy.splice(i, 1);
    saveMeals(copy);
  });
});

route('/recipe', (rid) => {
  const r = window.RECIPES.find(x => x.id === rid);
  if (!r) { location.hash = '#/food'; return; }
  app.innerHTML = `
    ${pageHead(r.meal, esc(r.name))}
    <div class="card">
      <div class="row" style="gap:16px">
        <span class="num"><b style="font-family:Archivo;font-size:1.3rem">${r.kcal}</b> kcal</span>
        <span class="muted num">P ${r.p} g · G ${r.c} g · L ${r.f} g</span>
      </div>
    </div>
    <div class="card">
      <h2>Ingrédients (1 portion)</h2>
      ${r.ing.map(([n, q]) => `<div class="checkline"><span class="grow">${esc(n)}</span><b class="num">${q} g</b></div>`).join('')}
    </div>
    <div class="card">
      <h2>Préparation</h2>
      <p style="font-size:0.92rem; line-height:1.55">${esc(r.steps)}</p>
    </div>
    <button class="btn ghost" onclick="location.hash='#/food'">← Retour aux repas</button>`;
});

// ---------- Liste de courses ----------
route('/shopping', () => {
  const plan = cacheGet('weekplan', {});   // { recipeId: nbPortions }
  const checks = cacheGet('shopchecks', {});
  const agg = {};
  Object.entries(plan).forEach(([rid, n]) => {
    const r = window.RECIPES.find(x => x.id === rid);
    if (!r || !n) return;
    r.ing.forEach(([name, q, cat]) => {
      const key = cat + '|' + name;
      agg[key] = (agg[key] || 0) + q * n;
    });
  });
  const cats = {};
  Object.entries(agg).forEach(([key, q]) => {
    const [cat, name] = key.split('|');
    (cats[cat] = cats[cat] || []).push([name, q]);
  });

  app.innerHTML = `
    ${pageHead('Courses', 'Ma semaine')}
    <div class="card">
      <h2>1 · Compose ton menu de la semaine</h2>
      <p class="muted small" style="margin-bottom:10px">Nombre de fois où tu prépares chaque recette. La liste de courses s'agrège automatiquement par rayon.</p>
      ${window.RECIPES.map(r => `
        <div class="checkline">
          <span class="grow">${esc(r.name)} <span class="muted small num">(${r.kcal} kcal)</span></span>
          <button class="btn sm ghost wp-m" data-id="${r.id}">−</button>
          <b class="num" style="width:22px;text-align:center">${plan[r.id] || 0}</b>
          <button class="btn sm secondary wp-p" data-id="${r.id}">+</button>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="row between"><h2>2 · Liste de courses</h2>
        <button class="btn sm ghost" id="resetchecks">Décocher tout</button></div>
      ${Object.keys(cats).length ? Object.entries(cats).map(([cat, items]) => `
        <div class="shop-cat">${esc(cat)}</div>
        ${items.map(([name, q]) => {
          const ck = checks[name] ? 'checked' : '';
          return `<label class="checkline ${ck ? 'done' : ''}"><input type="checkbox" data-n="${esc(name)}" ${ck}><span class="grow">${esc(name)}</span><b class="num">${q >= 1000 ? (q / 1000).toFixed(1) + ' kg' : q + ' g'}</b></label>`;
        }).join('')}`).join('')
      : '<p class="muted">Ajoute des recettes au menu ci-dessus : la liste apparaîtra ici, triée par rayon.</p>'}
    </div>`;

  const save = () => { cacheSet('weekplan', plan); navigate(); };
  $$('.wp-p').forEach(b => b.onclick = () => { plan[b.dataset.id] = (plan[b.dataset.id] || 0) + 1; save(); });
  $$('.wp-m').forEach(b => b.onclick = () => { plan[b.dataset.id] = Math.max(0, (plan[b.dataset.id] || 0) - 1); save(); });
  $$('input[type=checkbox]', app).forEach(c => c.onchange = () => {
    checks[c.dataset.n] = c.checked; cacheSet('shopchecks', checks);
    c.closest('.checkline').classList.toggle('done', c.checked);
  });
  $('#resetchecks').onclick = () => { cacheSet('shopchecks', {}); navigate(); };
});

// ============================================================
// COACH
// ============================================================
route('/coach', () => {
  const advice = window.Coach.dailyAdvice(S.logs, S.profile);
  app.innerHTML = `
    ${pageHead('Coach', 'Ton plan du jour')}
    ${advice.map(a => `<div class="advice ${a.level}"><span class="ico">${a.icon}</span><div>${esc(a.text)}</div></div>`).join('')}
    <div class="card">
      <h2>Discuter avec le coach</h2>
      <div class="chat" id="chat">
        <div class="bubble coach">Je m'appuie sur ton carnet (RPE, sommeil, poids, régularité) pour ajuster ton plan. Que veux-tu faire ?</div>
      </div>
      <div class="quick" id="quick">
        ${window.Coach.INTENTS.map(i => `<button class="chip" data-i="${i.id}">${i.label}</button>`).join('')}
      </div>
    </div>`;

  const chat = $('#chat');
  const push = (cls, text) => {
    const d = document.createElement('div');
    d.className = 'bubble ' + cls;
    d.textContent = text;
    chat.appendChild(d);
    d.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  $('#quick').onclick = (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    const intent = window.Coach.INTENTS.find(i => i.id === b.dataset.i);
    push('me', intent.label.replace(/^\S+\s/, ''));
    if (intent.id === 'adapt') {
      const sessions = S.profile.program.sessions;
      const lastId = S.logs.find(l => l.kind === 'workout')?.payload.sessionId;
      const next = sessions[Math.max(0, sessions.findIndex(s => s.id === lastId) + 1) % sessions.length];
      const a = window.Coach.adaptSession(next, S.logs, S.profile);
      push('coach', `${a.summary}\n\n${a.session.name} :\n` + a.session.exercises.map((x, i) => `${i + 1}. ${x.name} — ${x.sets}×${x.reps} (RPE ${x.rpe})`).join('\n') + `\n\nLance-la depuis l'onglet Entraîner : l'adaptation y est appliquée automatiquement.`);
    } else {
      push('coach', window.Coach.reply(intent.id, S.logs, S.profile));
    }
  };
});

// ============================================================
// CARNET
// ============================================================
route('/journal', () => {
  const t = todayStr();
  const entry = S.logs.find(l => l.kind === 'journal' && l.day === t)?.payload || {};
  // séries pour graphes
  const days30 = Array.from({ length: 30 }, (_, i) => new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10));
  const weights = days30.map(d => { const j = S.logs.find(l => l.kind === 'journal' && l.day === d); return +j?.payload.weight || null; });
  const weekLabels = [], weekVals = [];
  for (let w = 5; w >= 0; w--) {
    const start = Date.now() - (w + 1) * 7 * 86400000, end = Date.now() - w * 7 * 86400000;
    weekLabels.push(w === 0 ? 'sem.' : `S-${w}`);
    weekVals.push(S.logs.filter(l => l.kind === 'workout' && +new Date(l.day) > start && +new Date(l.day) <= end).length);
  }
  const history = S.logs.filter(l => l.kind === 'workout').slice(0, 6);

  app.innerHTML = `
    ${pageHead('Carnet', 'Suivi quotidien')}
    <div class="card">
      <h2>Aujourd'hui</h2>
      <div class="row">
        <label class="field grow"><span>Poids (kg, à jeun)</span><input id="j-weight" type="number" inputmode="decimal" step="0.1" value="${entry.weight ?? ''}"></label>
        <label class="field grow"><span>Sommeil (h)</span><input id="j-sleep" type="number" inputmode="decimal" step="0.5" value="${entry.sleep ?? ''}"></label>
      </div>
      <label class="field"><span>Énergie / motivation</span>
        <div class="scale5" id="j-energy">
          ${['😫', '😕', '😐', '🙂', '🔥'].map((e, i) => `<button data-v="${i + 1}" class="${entry.energy == i + 1 ? 'on' : ''}">${e}</button>`).join('')}
        </div>
      </label>
      <label class="field"><span>Notes (douleurs, ressenti, écarts…)</span><textarea id="j-notes" rows="2">${esc(entry.notes || '')}</textarea></label>
      <button class="btn" id="j-save">Enregistrer la journée</button>
    </div>

    <div class="card">
      <h2>Poids — 30 jours</h2>
      <canvas class="chart" id="c-weight"></canvas>
    </div>
    <div class="card">
      <h2>Séances par semaine</h2>
      <canvas class="chart" id="c-sessions"></canvas>
    </div>
    <div class="card">
      <h2>Dernières séances</h2>
      ${history.length ? history.map(h => {
        const vol = h.payload.sets.reduce((s, x) => s + (x.weight * x.reps), 0);
        const rpes = h.payload.sets.map(s => +s.rpe).filter(Boolean);
        const avg = rpes.length ? (rpes.reduce((a, b) => a + b) / rpes.length).toFixed(1) : '—';
        return `<div class="checkline"><span class="grow">${esc(h.payload.sessionName)}<br><span class="muted small">${h.day}</span></span><span class="num small" style="text-align:right">${h.payload.sets.length} séries · ${vol} kg vol.<br>RPE moy. ${avg}</span></div>`;
      }).join('') : '<p class="muted">Lance ta première séance depuis l\'onglet Entraîner : son résumé apparaîtra ici.</p>'}
    </div>`;

  let energy = entry.energy || null;
  $('#j-energy').onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    energy = +b.dataset.v;
    $$('#j-energy button').forEach(x => x.classList.toggle('on', x === b));
  };
  $('#j-save').onclick = async () => {
    await dbSaveLog('journal', t, {
      weight: +$('#j-weight').value || null,
      sleep: +$('#j-sleep').value || null,
      energy,
      notes: $('#j-notes').value
    }, { unique: true });
    toast('Journée enregistrée 📓');
    navigate();
  };

  requestAnimationFrame(() => {
    drawLine($('#c-weight'), weights);
    drawBars($('#c-sessions'), weekLabels, weekVals, { target: +S.profile.anamnese?.days || 2 });
  });
});

// ============================================================
// RÉGLAGES
// ============================================================
route('/settings', () => {
  const set = S.profile.settings || {};
  const r = set.reminders || { enabled: false, workoutDays: [1, 4], workoutTime: '18:00', weighTime: '07:30', hydrate: true };
  const t = S.profile.targets || {};
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  app.innerHTML = `
    ${pageHead('Réglages', 'Mon compte')}
    <div class="card">
      <h2>🔔 Rappels</h2>
      <p class="muted small" style="margin-bottom:10px">Les rappels se déclenchent quand l'app est installée/ouverte en arrière-plan récent. Android peut les retarder si l'app n'a pas été ouverte depuis longtemps.</p>
      <label class="checkline"><input type="checkbox" id="r-on" ${r.enabled ? 'checked' : ''}><span class="grow">Activer les rappels</span></label>
      <label class="field" style="margin-top:10px"><span>Jours de séance</span>
        <div class="choices" id="r-days">${dayNames.map((d, i) => `<button type="button" class="chip ${r.workoutDays.includes(i) ? 'on' : ''}" data-d="${i}">${d}</button>`).join('')}</div>
      </label>
      <div class="row">
        <label class="field grow"><span>Heure de séance</span><input id="r-time" type="time" value="${r.workoutTime}"></label>
        <label class="field grow"><span>Rappel pesée</span><input id="r-weigh" type="time" value="${r.weighTime}"></label>
      </div>
      <label class="checkline"><input type="checkbox" id="r-hyd" ${r.hydrate ? 'checked' : ''}><span class="grow">Rappels hydratation (10h, 13h, 16h, 19h)</span></label>
      <button class="btn" id="r-save" style="margin-top:10px">Enregistrer les rappels</button>
    </div>

    <div class="card">
      <h2>🎯 Cibles nutritionnelles</h2>
      <div class="row">
        <label class="field grow"><span>kcal/jour</span><input id="t-kcal" type="number" value="${t.kcal || ''}"></label>
        <label class="field grow"><span>Prot. (g)</span><input id="t-p" type="number" value="${t.p || ''}"></label>
      </div>
      <div class="row">
        <label class="field grow"><span>Gluc. (g)</span><input id="t-c" type="number" value="${t.c || ''}"></label>
        <label class="field grow"><span>Lip. (g)</span><input id="t-f" type="number" value="${t.f || ''}"></label>
      </div>
      <button class="btn secondary" id="t-save">Mettre à jour les cibles</button>
    </div>

    <div class="card">
      <h2>👤 Profil</h2>
      <p class="muted small" style="margin-bottom:10px">${LOCAL_MODE ? 'Mode local : données sur cet appareil.' : 'Connecté : ' + esc(S.user.email) + ' — données chiffrées au repos, isolées par compte (RLS).'}</p>
      <button class="btn ghost" id="redo">Refaire l'anamnèse (régénère le programme)</button>
      <div style="height:8px"></div>
      <button class="btn ghost" id="export">⬇️ Exporter toutes mes données (JSON)</button>
      <div style="height:8px"></div>
      ${LOCAL_MODE ? '' : '<button class="btn danger" id="logout">Se déconnecter</button>'}
    </div>`;

  $('#r-days').onclick = (e) => { const b = e.target.closest('.chip'); if (b) b.classList.toggle('on'); };
  $('#r-save').onclick = async () => {
    const enabled = $('#r-on').checked;
    if (enabled && !(await askNotifPermission())) return;
    const reminders = {
      enabled,
      workoutDays: $$('#r-days .chip.on').map(b => +b.dataset.d),
      workoutTime: $('#r-time').value,
      weighTime: $('#r-weigh').value,
      hydrate: $('#r-hyd').checked
    };
    await dbSaveProfile({ settings: { ...set, reminders } });
    toast('Rappels enregistrés 🔔');
  };
  $('#t-save').onclick = async () => {
    await dbSaveProfile({ targets: { ...t, kcal: +$('#t-kcal').value, p: +$('#t-p').value, c: +$('#t-c').value, f: +$('#t-f').value } });
    toast('Cibles mises à jour');
  };
  $('#redo').onclick = async () => {
    const a = { ...S.profile.anamnese, done: false };
    await dbSaveProfile({ anamnese: a });
    location.hash = '#/onboarding';
  };
  $('#export').onclick = () => {
    const blob = new Blob([JSON.stringify({ profile: S.profile, logs: S.logs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `recomp-export-${todayStr()}.json`;
    a.click();
  };
  $('#logout') && ($('#logout').onclick = async () => { await sb.auth.signOut(); S.user = null; S.profile = null; renderAuth(); });
});

// ============================================================
// DÉMARRAGE
// ============================================================
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

(async function boot() {
  offlinePill();
  if (LOCAL_MODE) {
    if (localStorage.getItem('rc_local_started')) {
      S.user = { id: 'local', email: 'local' };
      await dbLoadProfile(); await dbLoadLogs();
      if (S.profile) { navigate(); return; }
    }
    renderAuth();
    const btn = $('#local-go');
    if (btn) {
      const prev = btn.onclick;
      btn.onclick = async () => { localStorage.setItem('rc_local_started', '1'); await prev(); };
    }
    return;
  }
  await initSupabase();
  if (!sb) {
    // CDN/réseau indisponible : reprise sur cache local si une session a déjà existé
    const cachedUser = JSON.parse(localStorage.getItem('rc_last_user') || 'null');
    if (cachedUser) {
      S.user = cachedUser;
      await dbLoadProfile(); await dbLoadLogs();
      if (S.profile) { toast('Mode hors-ligne — synchronisation à la reconnexion'); navigate(); return; }
    }
    app.innerHTML = `
      <div class="auth-wrap"><div class="card" style="text-align:center">
        <h2 style="margin-bottom:8px">Connexion impossible</h2>
        <p class="muted" style="margin-bottom:14px">Le serveur est injoignable (réseau ou CDN). Réessaie une fois connecté.</p>
        <button class="btn" onclick="location.reload()">Réessayer</button>
      </div></div>`;
    return;
  }
  const { data } = await sb.auth.getSession();
  if (data?.session) await onSignedIn(data.session.user);
  else renderAuth();
  sb.auth.onAuthStateChange((_e, session) => {
    if (session && !S.user) onSignedIn(session.user);
  });
})();

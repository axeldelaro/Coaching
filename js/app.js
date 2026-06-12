// ============================================================
// RECOMP « FIGHT CAMP » — Application
// Navigation : deck horizontal à gestes (zéro barre d'icônes)
// ============================================================
const CFG = window.RECOMP_CONFIG || {};
const LOCAL_MODE = !CFG.SUPABASE_URL || CFG.SUPABASE_URL.includes('VOTRE-PROJET');
let sb = null;
async function initSupabase() {
  if (LOCAL_MODE) return;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    sb = createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  } catch { sb = null; }
}

const S = { user: null, profile: null, logs: [], outbox: JSON.parse(localStorage.getItem('rc_outbox') || '[]'), timer: null };

// ---------- Utilitaires ----------
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => crypto.randomUUID();
const daysSince = d => Math.round((Date.now() - new Date(d)) / 86400000);
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2400);
}
function lsKey(k) { return `rc_${S.user?.id || 'anon'}_${k}`; }
function cacheSet(k, v) { localStorage.setItem(lsKey(k), JSON.stringify(v)); }
function cacheGet(k, d = null) { try { return JSON.parse(localStorage.getItem(lsKey(k))) ?? d; } catch { return d; } }

// ---------- Thème + Accent + Taille ----------
const mqDark = matchMedia("(prefers-color-scheme: dark)");
function applyTheme() {
  const pref = S.profile?.settings?.theme || localStorage.getItem("rc_theme") || "light";
  const dark = pref === "dark" || (pref === "auto" && mqDark.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const meta = $("meta[name=theme-color]"); if (meta) meta.content = dark ? "#0F131A" : "#F4F6FA";
  const fs = S.profile?.settings?.fontSize || localStorage.getItem("rc_fontsize") || "16";
  document.documentElement.style.fontSize = fs + "px";
  const accent = S.profile?.settings?.accent || localStorage.getItem("rc_accent") || "#2F80ED";
  document.documentElement.style.setProperty("--accent", accent);
}
function applyAccent(color) { if (!color) return; document.documentElement.style.setProperty("--accent", color); localStorage.setItem("rc_accent", color); }
mqDark.addEventListener("change", () => { applyTheme(); });

// ---------- Données ----------
async function dbLoadProfile() {
  if (LOCAL_MODE || !sb) { S.profile = cacheGet('profile'); return; }
  const { data, error } = await sb.from('profiles').select('*').eq('id', S.user.id).maybeSingle();
  if (!error && data) { S.profile = data; cacheSet('profile', data); } else S.profile = cacheGet('profile');
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
  const since = new Date(Date.now() - 120 * 86400000).toISOString().slice(0, 10);
  if (LOCAL_MODE || !sb) { S.logs = cacheGet('logs', []); return; }
  const { data, error } = await sb.from('logs').select('*').gte('day', since).order('day', { ascending: false });
  if (!error && data) { S.logs = data; cacheSet('logs', data); } else S.logs = cacheGet('logs', []);
}
async function dbSaveLog(kind, day, payload, { unique = false } = {}) {
  let row = unique ? S.logs.find(l => l.kind === kind && l.day === day) : null;
  if (row) row.payload = payload;
  else { row = { id: uid(), user_id: S.user.id, day, kind, payload, created_at: new Date().toISOString() }; S.logs.unshift(row); }
  cacheSet('logs', S.logs);
  if (LOCAL_MODE) return row;
  if (!sb) { queueOp({ t: 'log', row }); return row; }
  const { error } = await sb.from('logs').upsert(row);
  if (error) queueOp({ t: 'log', row });
  return row;
}
function queueOp(op) { S.outbox.push(op); localStorage.setItem('rc_outbox', JSON.stringify(S.outbox)); }
async function flushOutbox() {
  if (LOCAL_MODE || !sb || !S.outbox.length || !navigator.onLine) return;
  const pending = [...S.outbox]; S.outbox = [];
  for (const op of pending) {
    const { error } = op.t === 'profile' ? await sb.from('profiles').upsert(op.row) : await sb.from('logs').upsert(op.row);
    if (error) S.outbox.push(op);
  }
  localStorage.setItem('rc_outbox', JSON.stringify(S.outbox));
  if (!S.outbox.length) toast('☁ Synchronisé');
}
window.addEventListener('online', flushOutbox);
function offlinePill() {
  let p = $('.offline-pill');
  if (!navigator.onLine && !p) { p = document.createElement('div'); p.className = 'offline-pill'; p.textContent = 'Hors-ligne — sync au retour'; document.body.appendChild(p); }
  else if (navigator.onLine && p) p.remove();
}
window.addEventListener('online', offlinePill);
window.addEventListener('offline', offlinePill);

// ---------- Bibliothèque / records ----------
const getExo = id => window.EXLIB.find(e => e.id === id);
const exoOf = set => set.exoId ? getExo(set.exoId) : window.findExercise(set.ex);
const setScore = s => (s.weight > 0 && s.reps > 0) ? s.weight * (1 + s.reps / 30) : (s.reps || 0);
const fmtPR = set => set.weight > 0 ? `${set.weight} kg × ${set.reps} (≈${Math.round(setScore(set))} 1RM)` : `${set.reps} reps`;
function bestBefore(exoId, beforeDay) {
  let best = null;
  S.logs.filter(l => l.kind === 'workout' && l.day <= beforeDay).forEach(w => {
    (w.payload.sets || []).forEach(s => {
      if (exoOf(s)?.id !== exoId) return;
      const sc = setScore(s);
      if (!best || sc > best.score) best = { score: sc, set: s, day: w.day };
    });
  });
  return best;
}
function lastPerf(exoId) {
  for (const w of S.logs.filter(l => l.kind === 'workout')) {
    const sets = (w.payload.sets || []).filter(s => exoOf(s)?.id === exoId);
    if (sets.length) return { ...sets.reduce((a, b) => setScore(b) > setScore(a) ? b : a), day: w.day };
  }
  return null;
}
function currentPRs() {
  const map = {};
  S.logs.filter(l => l.kind === 'workout').forEach(w => (w.payload.sets || []).forEach(s => {
    const e = exoOf(s); if (!e) return;
    const sc = setScore(s);
    if (!map[e.id] || sc > map[e.id].score) map[e.id] = { exo: e, score: sc, set: s, day: w.day };
  }));
  return Object.values(map).sort((a, b) => b.day.localeCompare(a.day));
}
function statsAll() {
  const f = window.RPG.fighter(S.logs, S.profile);
  const journal = S.logs.filter(l => l.kind === 'journal');
  return {
    workouts: f.workouts, totalSets: f.sets, totalVolume: f.volume, prCount: f.prCount,
    journalStreak: f.streak, journalDays: journal.length,
    weighWeek: journal.filter(j => +j.payload.weight > 0 && daysSince(j.day) < 7).length,
    bestPullups: Math.max(0, ...S.logs.filter(l => l.kind === 'workout').flatMap(w => w.payload.sets || []).filter(s => (exoOf(s)?.id || '').startsWith('pullup')).map(s => +s.reps || 0))
  };
}
const unlockedBadges = () => { const st = statsAll(); return window.BADGES.filter(b => b.check(st)); };

// ---------- Confettis (papier déchiré rouge/encre) ----------
function confetti(duration = 1700) {
  let c = $('#confetti');
  if (!c) { c = document.createElement('canvas'); c.id = 'confetti'; document.body.appendChild(c); }
  c.width = innerWidth; c.height = innerHeight;
  const ctx = c.getContext('2d');
  const acc = cssVar('--accent') || '#2F80ED';
  const colors = [acc, '#5B8DEF', '#FFD66B', acc, '#9D7BFF'];
  const parts = Array.from({ length: 110 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.4,
    w: 7 + Math.random() * 7, h: 9 + Math.random() * 9,
    vy: 3 + Math.random() * 4, vx: -1.5 + Math.random() * 3,
    rot: Math.random() * Math.PI, vr: -0.15 + Math.random() * 0.3,
    col: colors[Math.floor(Math.random() * colors.length)]
  }));
  const t0 = performance.now();
  (function frame(t) {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
    if (t - t0 < duration) requestAnimationFrame(frame); else c.remove();
  })(t0);
}

// ---------- Charts ----------
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function drawLine(canvas, values) {
  const color = cssVar('--accent'), inkc = cssVar('--mute');
  const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
  const vals = values.filter(v => v != null);
  if (vals.length < 2) { ctx.fillStyle = inkc; ctx.font = 'bold 12px Rajdhani, system-ui'; ctx.fillText('PAS ENCORE ASSEZ DE DONNÉES', 10, h / 2); return; }
  const min = Math.min(...vals), max = Math.max(...vals), pad = 10, span = (max - min) || 1;
  const X = i => pad + i / (values.length - 1) * (w - 2 * pad);
  const Y = v => h - pad - (v - min) / span * (h - 2 * pad);
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineJoin = 'miter'; ctx.beginPath();
  let started = false;
  values.forEach((v, i) => { if (v == null) return; if (!started) { ctx.moveTo(X(i), Y(v)); started = true; } else ctx.lineTo(X(i), Y(v)); });
  ctx.stroke();
  ctx.fillStyle = color;
  values.forEach((v, i) => { if (v != null) ctx.fillRect(X(i) - 3, Y(v) - 3, 6, 6); });
  ctx.fillStyle = inkc; ctx.font = 'bold 11px Rajdhani, system-ui';
  ctx.fillText(max.toFixed(1), 4, 12); ctx.fillText(min.toFixed(1), 4, h - 4);
}
function drawBars(canvas, labels, values, { target = null } = {}) {
  const color = cssVar('--ink'), red = cssVar('--accent'), mute = cssVar('--mute');
  const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, target || 0, 1), bw = w / values.length;
  values.forEach((v, i) => {
    const bh = v / max * (h - 28);
    ctx.fillStyle = document.documentElement.dataset.theme === 'dark' ? red : color;
    ctx.fillRect(i * bw + bw * 0.22, h - 18 - bh, bw * 0.56, bh);
    ctx.fillStyle = mute; ctx.font = "bold 11px 'Share Tech Mono', monospace"; ctx.textAlign = 'center';
    ctx.fillText(labels[i], i * bw + bw / 2, h - 5);
    if (v) ctx.fillText(v, i * bw + bw / 2, h - 23 - bh);
  });
  if (target) {
    const ty = h - 18 - target / max * (h - 28);
    ctx.strokeStyle = red; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(w, ty); ctx.stroke(); ctx.setLineDash([]);
  }
}

// ---------- Nutrition / programme ----------
function computeTargets(a) {
  const w = +a.weight, h = +a.height, age = +a.age;
  const bmr = Math.round(10 * w + 6.25 * h - 5 * age + (a.sex === 'F' ? -161 : 5));
  const tdee = Math.round(bmr * ({ sedentaire: 1.2, leger: 1.375, actif: 1.55, tres_actif: 1.725 }[a.activity] || 1.375));
  let kcal = Math.max(tdee + ({ perte: -350, maintien: 0, prise: 250 }[a.goal] ?? -350), a.sex === 'F' ? 1300 : 1500);
  const p = Math.round(1.8 * w), f = Math.round(0.9 * w);
  return { bmr, tdee, kcal, p, c: Math.max(0, Math.round((kcal - p * 4 - f * 9) / 4)), f };
}

function allowedRecipes() {
  const al = S.profile.anamnese?.allergies || [];
  // Lait animal sans confondre le lait de coco (sans lactose).
  const hasDairyMilk = ing => /\blait\b/i.test(ing) && !/lait de coco|lait d'?amande|lait de soja|lait d'?avoine/i.test(ing);
  return window.RECIPES.filter(r => {
    const ing = r.ing.map(i => i[0]).join(' ').toLowerCase();
    if (al.includes('oeufs') && /œuf|oeuf|omelette/i.test(ing)) return false;
    if (al.includes('lactose') && (/skyr|fromage|ricotta|cottage|mozzarell|féta|feta|parmesan|whey|yaourt|caséine|crème|creme|ghee/i.test(ing) || hasDairyMilk(ing))) return false;
    if (al.includes('gluten') && /pâtes|tortilla|flocons|pain|granola|muesli|boulgour|couscous|semoule|épeautre|epeautre|orge|seitan|chapelure|wrap|biscotte/i.test(ing)) return false;
    if (al.includes('fruits_de_mer') && /thon|sardine|saumon|crevette|poisson|maquereau|cabillaud|hareng|colin|haddock|moule|crabe|calamar|gambas|truite|lieu|anchois/i.test(ing)) return false;
    if (al.includes('viande_rouge') && /bœuf|boeuf|steak|rumsteck|veau|agneau/i.test(ing)) return false;
    if (al.includes('volaille') && /poulet|dinde|volaille|escalope/i.test(ing)) return false;
    if (al.includes('legumineuses') && /lentille|pois chiche|pois cassé|haricots? (rouge|noir|blanc)|edamame|flageolet|fève|feve/i.test(ing)) return false;
    if (al.includes('noix') && /amande|noisette|cacahuète|cacahuete|noix|cajou|pistache|pécan|pecan/i.test(ing)) return false;
    if (al.includes('soja') && /tofu|soja|edamame|miso|tempeh/i.test(ing)) return false;
    if (al.includes('porc') && /porc|lard|bacon|chorizo|saucisson|lardon/i.test(ing)) return false;
    if (al.includes('porc') && /jambon/i.test(ing) && !/jambon de (dinde|volaille|poulet)/i.test(ing)) return false;
    if (al.includes('vegan') && (/poulet|dinde|bœuf|boeuf|steak|rumsteck|veau|agneau|saumon|thon|sardine|maquereau|cabillaud|hareng|crevette|crabe|poisson|jambon|œuf|oeuf|whey|skyr|fromage|ricotta|cottage|mozzarell|féta|feta|parmesan|yaourt|caséine|crème|creme|miel|gélatine|gelatine/i.test(ing) || hasDairyMilk(ing))) return false;
    if (al.includes('cafe') && /café|cafe|caféine|cafeine/i.test(ing)) return false;
    if (al.includes('sucre') && /sucre|miel|sirop d'?érable|sirop d'?agave/i.test(ing)) return false;
    if (al.includes('alcool') && /vin|bière|biere|rhum|cognac|alcool/i.test(ing)) return false;
    return true;
  });
}
function generateDay(recipes, t) {
  const by = m => recipes.filter(r => r.meal === m);
  const [B, L, D, C] = [by('petit-déj'), by('déjeuner'), by('dîner'), by('collation')];
  if (!B.length || !L.length || !D.length) return null;
  let best = null, bestErr = Infinity;
  for (const b of B) for (const l of L) for (const d of D) for (const c of [...C, null]) {
    const combo = [b, l, d, c].filter(Boolean);
    const kcal = combo.reduce((x, r) => x + r.kcal, 0), p = combo.reduce((x, r) => x + r.p, 0);
    const err = Math.abs(kcal - (t.kcal || 2000)) + Math.abs(p - (t.p || 130)) * 3 + Math.random() * 12;
    if (err < bestErr) { bestErr = err; best = combo; }
  }
  return best.map(r => r.id);
}

// ---------- Rappels ----------
async function askNotifPermission() {
  if (!('Notification' in window)) { toast('Notifications non supportées'); return false; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { toast('Permission refusée'); return false; }
  return true;
}
async function fireNotif(title, body, tag) {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) reg.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag, vibrate: [120, 60, 120] });
  } catch { }
}
function checkReminders() {
  const r = S.profile?.settings?.reminders;
  if (!r || !r.enabled || Notification?.permission !== 'granted') return;
  const now = new Date(), hhmm = now.toTimeString().slice(0, 5), day = now.getDay(), t = todayStr();
  const key = lsKey('fired_' + t);
  const fired = JSON.parse(localStorage.getItem(key) || '{}');
  const mark = k => { fired[k] = 1; localStorage.setItem(key, JSON.stringify(fired)); };
  if (r.workoutDays?.includes(day) && hhmm === r.workoutTime && !fired.workout) { fireNotif('🏋 SÉANCE DU JOUR', 'C\'est l\'heure de ta séance. 45 minutes.', 'workout'); mark('workout'); }
  if (r.weighTime && hhmm === r.weighTime && !fired.weigh) { fireNotif('⚖ PESÉE OFFICIELLE', 'À jeun, mêmes conditions.', 'weigh'); mark('weigh'); }
  if (r.hydrate && ['10:00', '13:00', '16:00', '19:00'].includes(hhmm) && !fired['h' + hhmm]) { fireNotif('💧 HYDRATATION', "Un grand verre d'eau.", 'hyd'); mark('h' + hhmm); }
}
setInterval(checkReminders, 30000);

// ============================================================
// SHELL : bandeau + deck à 5 panneaux
// ============================================================
const PANELS = ['PROFIL', 'SÉANCE', 'NUTRITION', 'COACH', 'PROGRÈS'];
let deck, strip;

function mountShell() {
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="strip" id="strip">
      ${PANELS.map((p, i) => `<button class="strip-item ${i === 0 ? 'on' : ''}" data-i="${i}">${p}</button>`).join('')}
    </header>
    <div class="deck" id="deck">
      ${PANELS.map((_, i) => `<section class="panel" data-p="${i}"><div class="inner" id="panel-${i}"></div></section>`).join('')}
    </div>
    <div class="landscape-block"><span class="icon">📱</span><h2>TOURNE TON APPAREIL</h2><p>L'application est conçue pour le mode portrait.</p></div>
    <button class="fab-music" id="fab-music" title="Musique">🎵</button>`);
  deck = $('#deck'); strip = $('#strip');
  strip.onclick = e => {
    const b = e.target.closest('.strip-item'); if (!b) return;
    deck.scrollTo({ left: +b.dataset.i * deck.clientWidth, behavior: 'smooth' });
  };
  let raf = null;
  deck.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const i = Math.round(deck.scrollLeft / deck.clientWidth);
      $$('.strip-item').forEach((b, j) => b.classList.toggle('on', j === i));
      $$('.strip-item')[i]?.scrollIntoView({ inline: 'center', block: 'nearest' });
    });
  });
  const seen = +localStorage.getItem('rc_hint') || 0;
  if (seen < 2) {
    document.body.insertAdjacentHTML('beforeend', `<div class="swipe-hint">&lt; GLISSE POUR NAVIGUER &gt;</div>`);
    localStorage.setItem('rc_hint', seen + 1);
  }
  // Music FAB
  $('#fab-music').onclick = () => go('/music');
  initMusicUI();
}
const goPanel = i => deck?.scrollTo({ left: i * deck.clientWidth, behavior: 'smooth' });

function renderAll() {
  renderVestiaire($('#panel-0'));
  renderCombat($('#panel-1'));
  renderCantine($('#panel-2'));
  renderCoach($('#panel-3'));
  renderPalmares($('#panel-4'));
}

// ============================================================
// OVERLAYS (hash → fiches plein écran ; back Android = fermer)
// ============================================================
function closeSheets() { $$('.sheet, .levelup').forEach(x => x.remove()); stopTimer(); }
function openSheet(html, { closable = true } = {}) {
  const sh = document.createElement('div');
  sh.className = 'sheet';
  sh.innerHTML = `<div class="inner">${closable ? '<button class="sheet-close" data-close>✕</button>' : ''}${html}</div>`;
  if (closable) sh.querySelector('[data-close]').onclick = () => { location.hash = ''; };
  document.body.appendChild(sh);
  return sh;
}
function handleHash() {
  const h = location.hash.replace('#', '');
  const [path, arg] = h.split('@');
  closeSheets();
  if (!S.user || !S.profile) return;
  const map = { '/session': sheetSession, '/exo': sheetExo, '/recipe': sheetRecipe, '/shopping': sheetShopping, '/settings': sheetSettings, '/onboarding': sheetOnboarding, '/music': sheetMusic };
  if (map[path]) map[path](arg);
}
window.addEventListener('hashchange', handleHash);
const go = h => { if (('#' + h) === location.hash) handleHash(); else location.hash = h; };

// ============================================================
// PANNEAU 0 — LE VESTIAIRE
// ============================================================
function renderVestiaire(el) { renderStatut(el); }
function renderStatut(el) {
  const p = S.profile;
  const h = window.RPG.hunter(S.logs, p);
  const dq = window.RPG.dailyQuests(S.logs, p);
  const wq = window.RPG.weeklyQuests(S.logs, p);
  const advice = window.Coach.dailyAdvice(S.logs, p)[0];
  const hpMax = h.hp, mpMax = h.mp;
  const SK = window.RPG.STAT_KEYS, SL = window.RPG.STAT_LABEL;

  el.innerHTML = `
    <div class="label">VUE D'ENSEMBLE</div>
    <h1 class="title-xl">${esc((p.pseudo || 'TOI').toUpperCase())}</h1>
    <p class="glow mono" style="margin-top:4px;letter-spacing:0.12em">${esc(h.job.toUpperCase())}${h.streak >= 2 ? ` · SÉRIE ${h.streak}J` : ''}</p>

    <div class="win" style="margin-top:14px">
      <div class="win-tag">PROFIL</div>
      <div class="status-id">
        <div class="rank-badge" style="--rank:${h.rankColor}">
          <span class="r">${h.rank}</span><span class="rl">RANG</span>
        </div>
        <div class="id-lines">
          <div class="id-row"><span>Niveau</span><b class="lvl glow">${h.lvl}</b></div>
          <div class="id-row"><span>Classe</span><b>${esc(h.job)}</b></div>
          <div class="id-row"><span>XP</span><b class="num">${h.into} / ${h.need}</b></div>
        </div>
      </div>

      <div class="vital hp"><div class="lab"><span>PV</span><span class="num">${hpMax}</span></div><div class="track"><div class="fill" style="width:0%" data-w="100"></div></div></div>
      <div class="vital mp"><div class="lab"><span>PM</span><span class="num">${mpMax}</span></div><div class="track"><div class="fill" style="width:0%" data-w="100"></div></div></div>

      <hr class="divider">
      <div class="row between" style="margin-bottom:4px">
        <span class="label" style="margin:0">STATISTIQUES</span>
        <span class="label" style="margin:0">ENDURANCE <b class="glow num">${h.stamina}</b></span>
      </div>
      ${SK.map(k => `
        <div class="stat-line">
          <span class="nm">${SL[k]}</span>
          <span class="vals">
            <b class="tv glow">${h.total[k]}</b>
            ${(+(h.allocated[k]) || 0) > 0 ? `<span class="bonus">(+${h.allocated[k]})</span>` : ''}
          </span>
          <button class="stat-add" data-stat="${k}" ${h.pointsAvailable > 0 ? '' : 'disabled'}>+</button>
        </div>`).join('')}
      <div class="points-pill ${h.pointsAvailable > 0 ? '' : 'zero'}">POINTS À RÉPARTIR : ${h.pointsAvailable}</div>
      <p class="mute small" style="margin-top:8px">Tes stats montent avec ce que tu fais réellement. À chaque niveau, 3 points libres à répartir.</p>
    </div>

    ${advice ? `<div class="advice-b ${advice.level === 'warn' ? 'warn' : ''}">${advice.icon} ${esc(advice.text)}</div>` : ''}

    <div class="win">
      <div class="win-tag">OBJECTIFS DU JOUR</div>
      <h2>TA SÉANCE DU JOUR</h2>
      <p class="mute small" style="margin-bottom:4px">Compose librement ta séance d'aujourd'hui.</p>
      <button class="btn solid" style="margin-top:8px" onclick="goPanel(1)">⊳ CRÉER MA SÉANCE</button>
      <hr class="divider">
      ${dq.map(q => `<div class="quest ${q.done ? 'done' : ''}"><span class="box">${q.done ? '✓' : ''}</span><span class="t">${esc(q.t)}</span><span class="xp">+${q.xp}</span></div>`).join('')}
      <p class="mute small" style="margin-top:8px">Un objectif manqué n'est pas grave : le repos fait partie de la progression. Un jour off est tout à fait normal.</p>
    </div>

    <div class="win">
      <div class="win-tag">OBJECTIFS DE LA SEMAINE</div>
      ${wq.map(q => `<div class="quest ${q.done ? 'done' : ''}"><span class="box">${q.done ? '✓' : ''}</span><span class="t">${esc(q.t)} <span class="mute num">${q.prog}</span></span><span class="xp">+${q.xp}</span></div>`).join('')}
    </div>

    <div class="win">
      <h2>💬 CONSEIL DU JOUR</h2>
      <p style="font-size:0.92rem;font-weight:500;line-height:1.55">${esc(window.Coach.tipOfDay())}</p>
    </div>
    <button class="btn ghost" onclick="location.hash='#/settings'">⚙ RÉGLAGES</button>`;

  // Allocation de points d'aptitude
  $$('.stat-add', el).forEach(btn => btn.onclick = async () => {
    const cur = window.RPG.hunter(S.logs, S.profile);
    if (cur.pointsAvailable <= 0) return;
    const k = btn.dataset.stat;
    const alloc = { ...(S.profile.allocated || {}) };
    alloc[k] = (+alloc[k] || 0) + 1;
    await dbSaveProfile({ allocated: alloc });
    toast(`+1 ${window.RPG.STAT_LABEL[k]}`);
    if (navigator.vibrate) navigator.vibrate(30);
    renderStatut(el);
  });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('.vital .fill', el).forEach(i => i.style.width = i.dataset.w + '%');
  }));
}

// ============================================================
// PANNEAU 1 — LE COMBAT (constructeur de séance)
// ============================================================
function renderCombat(el) {
  const draft = cacheGet('session_draft', { exercises: [] });
  const saveDraft = () => cacheSet('session_draft', draft);
  const groups = window.EXLIB_GROUPS;
  const MAX_SETS_PER_EXO = 5;
  const MAX_SETS_PER_GROUP = 15;
  const BONUS_GROUPS = 3; // min groups for variety bonus

  // Count sets per group
  const groupSets = {};
  groups.forEach(g => { groupSets[g] = 0; });
  draft.exercises.forEach(pe => {
    const ex = getExo(pe.exo);
    if (ex) groupSets[ex.group] = (groupSets[ex.group] || 0) + pe.sets;
  });
  const totalSets = draft.exercises.reduce((s, e) => s + e.sets, 0);
  const activeGroups = Object.values(groupSets).filter(v => v > 0).length;
  const varietyBonus = activeGroups >= 5 ? 50 : activeGroups >= BONUS_GROUPS ? 20 : 0;

  const groupIcons = { 'Jambes': '🦵', 'Dos': '🔙', 'Poussée': '💪', 'Épaules': '🎯', 'Bras': '💎', 'Abdos': '🛡️', 'Cardio': '❤️🔥' };
  const effBar = (val, max) => `<div class="bar" style="flex:1;height:6px;border:1px solid var(--line);background:var(--surface-2);border-radius:999px;overflow:hidden"><i style="display:block;height:100%;width:${Math.min(100, max ? val/max*100 : 0)}%;background:${val > max ? 'var(--danger)' : 'var(--accent)'};transition:width 0.3s"></i></div>`;

  el.innerHTML = `
    <div class="label">PRÉPARER MA SÉANCE</div>
    <h1 class="title-xl">ENTRAÎNEMENT</h1>
    <p class="mute" style="margin:6px 0 14px;font-weight:700">Construis ta séance : choisis tes exercices par zone. L'équilibre est la clé.</p>

    ${varietyBonus ? `<div class="advice-b good">🎯 BONUS VARIÉTÉ +${varietyBonus}% XP — ${activeGroups} zones travaillées</div>` : 
      totalSets ? `<div class="advice-b warn">⚠ TRAVAILLE ${BONUS_GROUPS}+ ZONES POUR UN BONUS XP</div>` : ''}

    <div class="brick">
      <div class="row between"><h2>ZONES TRAVAILLÉES</h2><span class="sys num" style="color:var(--accent)">${totalSets} SÉRIES</span></div>
      <div class="eq-grid" id="group-grid">
        ${groups.map(g => `
          <div class="eq-item ${groupSets[g] ? 'on' : ''}" data-grp="${g}" style="flex-direction:column;align-items:center;text-align:center;padding:14px 8px">
            <span class="ico" style="font-size:1.6rem">${groupIcons[g] || '⚔️'}</span>
            <span style="margin-top:4px">${g.toUpperCase()}</span>
            <span class="mono small" style="color:${groupSets[g] ? 'var(--accent)' : 'var(--mute)'}">${groupSets[g] || 0}/${MAX_SETS_PER_GROUP}</span>
            ${effBar(groupSets[g], MAX_SETS_PER_GROUP)}
          </div>
        `).join('')}
      </div>
    </div>

    ${draft.exercises.length ? `
    <div class="brick">
      <h2>SÉANCE DU JOUR — ${draft.exercises.length} EXERCICES</h2>
      <div id="draft-list">
        ${draft.exercises.map((pe, i) => {
          const ex = getExo(pe.exo) || { name: pe.exo, group: '?' };
          const lp = lastPerf(pe.exo);
          const eff = pe.sets <= 3 ? '100%' : pe.sets <= 5 ? '80%' : '50%';
          return `
          <div class="gate" style="margin-bottom:10px">
            <div class="gate-head">
              <span class="n num">V${i+1}</span>
              <button class="t" style="text-align:left" onclick="go('/exo@${ex.id}')">${esc(ex.name.toUpperCase())} ＋</button>
            </div>
            <div class="gate-body">
              <div class="specs num">
                <span>ZONE <b>${ex.group.toUpperCase()}</b></span>
                <span>EFFICACITÉ <b>${eff}</b></span>
                ${lp ? `<span>RECORD <b>${fmtPR(lp)}</b></span>` : ''}
              </div>
              <div class="row" style="margin-top:10px;gap:6px">
                <button class="btn sm ghost" data-draft-minus="${i}" ${pe.sets <= 1 ? 'disabled' : ''}>−</button>
                <span class="sys num" style="font-size:1.1rem;min-width:80px;text-align:center">${pe.sets} × ${esc(pe.reps)}</span>
                <button class="btn sm ghost" data-draft-plus="${i}" ${pe.sets >= MAX_SETS_PER_EXO ? 'disabled' : ''}>+</button>
                <button class="btn sm ghost" data-draft-del="${i}" style="margin-left:auto;color:var(--danger)">✕</button>
              </div>
              ${pe.sets > 3 ? '<p class="mute small" style="margin-top:6px;font-weight:700">⚠ Au-delà de 3 séries, les rendements décroissent. Diversifie tes zones !</p>' : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
      <button class="btn solid" id="launch-session" style="margin-top:10px">⊳ DÉMARRER LA SÉANCE · ${draft.exercises.length} EXERCICES</button>
      <button class="btn ghost" id="clear-draft" style="margin-top:8px">VIDER LA SÉANCE</button>
    </div>` : ''}

    <hr class="divider">
    <div class="label">CATALOGUE — ${window.EXLIB.length} EXERCICES</div>
    <h2 class="sys" style="font-size:1.6rem;margin-bottom:10px">BIBLIOTHÈQUE D'EXERCICES</h2>
    <label class="field"><input id="lib-q" placeholder="RECHERCHER UN EXERCICE, UN MUSCLE…"></label>
    <div class="choices" id="lib-filters" style="margin-bottom:12px">
      <button class="chip on" data-g="">TOUS</button>
      ${window.EXLIB_GROUPS.map(g => `<button class="chip" data-g="${g}">${g.toUpperCase()}</button>`).join('')}
    </div>
    <div id="lib-list"></div>`;

  // Group grid click → add exercise picker
  $('#group-grid', el).onclick = e => {
    const item = e.target.closest('[data-grp]');
    if (!item) return;
    openExercisePicker(item.dataset.grp, draft, saveDraft, () => renderCombat(el));
  };

  // Draft controls
  el.onclick = async e => {
    const plus = e.target.closest('[data-draft-plus]');
    const minus = e.target.closest('[data-draft-minus]');
    const del = e.target.closest('[data-draft-del]');
    if (plus) {
      const pe = draft.exercises[+plus.dataset.draftPlus];
      const ex = getExo(pe.exo);
      if (pe.sets < MAX_SETS_PER_EXO && groupSets[ex?.group] < MAX_SETS_PER_GROUP) { pe.sets++; saveDraft(); renderCombat(el); }
      else toast('LIMITE ATTEINTE');
    } else if (minus) {
      const pe = draft.exercises[+minus.dataset.draftMinus];
      if (pe.sets > 1) { pe.sets--; saveDraft(); renderCombat(el); }
    } else if (del) {
      draft.exercises.splice(+del.dataset.draftDel, 1); saveDraft(); renderCombat(el);
    }
  };

  $('#launch-session', el)?.addEventListener('click', () => {
    if (!draft.exercises.length) { toast('AJOUTE DES EXERCICES'); return; }
    go('/session@custom');
  });
  $('#clear-draft', el)?.addEventListener('click', () => {
    draft.exercises = []; saveDraft(); renderCombat(el); toast('SÉANCE VIDÉE');
  });

  // Bibliothèque (grimoire)
  let q = '', grp = '';
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const drawLib = () => {
    const list = window.EXLIB.filter(x => (!grp || x.group === grp) && (!q || norm(x.name + ' ' + x.muscles.join(' ')).includes(norm(q))));
    $('#lib-list', el).innerHTML = list.map(x => `
      <button class="menu-item row" style="width:100%;text-align:left" onclick="go('/exo@${x.id}')">
        <span class="grow"><span class="ttl">${esc(x.name.toUpperCase())}</span><br><span class="mute small up" style="font-weight:700">${x.muscles.join(' · ')} — ${esc(x.equip)}</span></span>
        <span class="sys" style="color:var(--accent)">${'▮'.repeat(x.level)}${'▯'.repeat(3 - x.level)}</span>
      </button>`).join('') || '<p class="mute">AUCUN EXERCICE À CE NOM.</p>';
  };
  $('#lib-q', el).oninput = e => { q = e.target.value; drawLib(); };
  $('#lib-filters', el).addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    grp = b.dataset.g;
    $$('#lib-filters .chip', el).forEach(x => x.classList.toggle('on', x === b));
    drawLib();
  });
  drawLib();
}

function openExercisePicker(group, draft, saveDraft, afterAdd) {
  const MAX_SETS_PER_EXO = 5;
  const exos = window.EXLIB.filter(e => e.group === group);
  const sh = openSheet(`
    <div class="label">ZONE : ${group.toUpperCase()}</div>
    <h1 class="sys" style="font-size:1.6rem;margin-bottom:12px">CHOISIR UN EXERCICE</h1>
    <p class="mute small" style="margin-bottom:14px;font-weight:700">Tape pour ajouter. Max ${MAX_SETS_PER_EXO} séries par exercice, diversifie pour un meilleur XP.</p>
    ${exos.map(x => {
      const already = draft.exercises.find(e => e.exo === x.id);
      return `
      <button class="menu-item row" style="width:100%;text-align:left;${already ? 'border-color:var(--accent)' : ''}" data-pick="${x.id}">
        <span class="grow">
          <span class="ttl">${esc(x.name.toUpperCase())}${already ? ' <span style="color:var(--accent)">✓ AJOUTÉ</span>' : ''}</span><br>
          <span class="mute small up" style="font-weight:700">${x.muscles.join(' · ')} — ${esc(x.equip)} — NIV.${'▮'.repeat(x.level)}${'▯'.repeat(3-x.level)}</span>
        </span>
      </button>`;
    }).join('')}`);
  sh.addEventListener('click', e => {
    const pick = e.target.closest('[data-pick]');
    if (!pick) return;
    const exId = pick.dataset.pick;
    const existing = draft.exercises.find(e => e.exo === exId);
    if (existing) {
      if (existing.sets < MAX_SETS_PER_EXO) { existing.sets++; } else { toast('MAX 5 SÉRIES PAR EXERCICE'); return; }
    } else {
      draft.exercises.push({ exo: exId, sets: 3, reps: '8-12', tempo: '2010', rest: 90, rpe: '7-8' });
    }
    saveDraft();
    sh.remove(); location.hash = '';
    toast(`${esc(getExo(exId)?.name.toUpperCase())} AJOUTÉ ⚔️`);
    afterAdd();
  });
}

function swapPicker(pe, after) {
  const cur = getExo(pe.exo);
  const variants = window.EXLIB.filter(e => e.group === cur?.group && e.id !== pe.exo);
  const sh = openSheet(`
    <div class="label">SUBSTITUTION DE COMPÉTENCE</div>
    <h1 class="sys" style="font-size:1.6rem;margin-bottom:12px">REMPLACER<br>${esc((cur?.name || '').toUpperCase())}</h1>
    ${variants.map(v => `
      <button class="menu-item row" style="width:100%;text-align:left" data-pick="${v.id}">
        <span class="grow"><span class="ttl">${esc(v.name.toUpperCase())}</span><br><span class="mute small up" style="font-weight:700">${v.muscles.join(' · ')}</span></span>
        <span class="sys" style="color:var(--accent)">${'▮'.repeat(v.level)}${'▯'.repeat(3 - v.level)}</span>
      </button>`).join('')}`);
  sh.querySelector('[data-close]').onclick = () => sh.remove();
  sh.querySelectorAll('[data-pick]').forEach(b => b.onclick = async () => {
    pe.exo = b.dataset.pick;
    await dbSaveProfile({ program: S.profile.program });
    sh.remove(); toast('COMPÉTENCE REMPLACÉE');
    after();
  });
}

// ---------- Fiche technique (exo) ----------
function sheetExo(id) {
  const e = getExo(id);
  if (!e) return;
  const pr = currentPRs().find(p => p.exo.id === id);
  const history = [];
  [...S.logs.filter(l => l.kind === 'workout')].sort((a, b) => a.day.localeCompare(b.day)).forEach(w => {
    const sets = (w.payload.sets || []).filter(s => exoOf(s)?.id === id);
    if (sets.length) history.push(Math.max(...sets.map(setScore)));
  });
  openSheet(`
    <div class="label">${esc(e.group.toUpperCase())} · NIVEAU ${'▮'.repeat(e.level)}${'▯'.repeat(3 - e.level)}</div>
    <h1 class="title-xl" style="font-size:2.2rem">${esc(e.name.toUpperCase())}</h1>
    <p class="mute up small" style="font-weight:800;margin:6px 0 14px">${esc(e.equip)}</p>
    ${e.flag ? `<div class="flag-strip"></div><div class="warn-note" style="margin:0 0 14px">⚠ PROTOCOLE ${esc(e.flag.toUpperCase())} ACTIF</div>` : ''}
    <div class="brick">
      <h2>CIBLES</h2>
      <div class="row wrap">${e.muscles.map(m => `<span class="chip on">${esc(m.toUpperCase())}</span>`).join('')}${(e.secondary || []).map(m => `<span class="micro">${esc(m)}</span>`).join('')}</div>
    </div>
    <div class="brick">
      <h2>EXÉCUTION</h2>
      ${e.steps.map((s, i) => `
        <div class="row" style="align-items:flex-start;padding:8px 0;border-bottom:2px dashed var(--mute)">
          <span class="sys" style="font-size:1.4rem;color:var(--accent);width:34px;flex:none">${i + 1}</span>
          <span style="font-weight:600;font-size:0.93rem;line-height:1.5">${esc(s)}</span>
        </div>`).join('')}
      <div class="warn-note" style="background:var(--panel);border-color:var(--line);color:var(--ink)">🎯 ${esc(e.cues)}</div>
      <p class="mute small" style="margin-top:8px;font-weight:700">🫁 ${esc(e.breath)}</p>
    </div>
    <div class="brick">
      <h2 style="color:var(--accent)">FAUTES TECHNIQUES</h2>
      ${e.errors.map(x => `<p style="font-weight:700;font-size:0.9rem;padding:5px 0">✗ ${esc(x)}</p>`).join('')}
    </div>
    ${(e.easier || e.harder) ? `<div class="row" style="margin-bottom:18px">
      ${e.easier ? `<button class="btn ghost grow" onclick="go('/exo@${e.easier}')">⬇ ${esc(getExo(e.easier)?.name.toUpperCase() || '')}</button>` : ''}
      ${e.harder ? `<button class="btn solid grow" onclick="go('/exo@${e.harder}')">⬆ ${esc(getExo(e.harder)?.name.toUpperCase() || '')}</button>` : ''}
    </div>` : ''}
    ${pr ? `<div class="brick">
      <div class="row between"><h2>🏆 TON RECORD</h2><b class="sys num">${fmtPR(pr.set)}</b></div>
      ${history.length >= 2 ? '<canvas class="chart" id="exo-chart"></canvas>' : '<p class="mute small">ENCORE UNE SÉANCE ET LA COURBE APPARAÎT.</p>'}
    </div>` : ''}`);
  if (history.length >= 2) requestAnimationFrame(() => drawLine($('#exo-chart'), history));
}

// ============================================================
// SÉANCE = LE COMBAT (rounds)
// ============================================================
function sheetSession(sid) {
  if (sid !== 'custom') { toast('SÉANCE INVALIDE'); return; }
  const sessionDraft = cacheGet('session_draft', { exercises: [] });
  if (!sessionDraft.exercises.length) { toast('AJOUTE DES EXERCICES'); return; }
  const base = { id: 'custom', name: 'SÉANCE LIBRE', sub: `${sessionDraft.exercises.length} exercices · ${new Set(sessionDraft.exercises.map(e => getExo(e.exo)?.group)).size} zones`, exercises: sessionDraft.exercises };
  const adapted = window.Coach.adaptSession(base, S.logs, S.profile);
  const sess = adapted.session;
  const draftKey = 'draft_' + sid + '_' + todayStr();
  const draft = cacheGet(draftKey, {});
  if (!draft.startedAt) { draft.startedAt = Date.now(); cacheSet(draftKey, draft); }

  const sh = openSheet(`
    <div class="label danger">SÉANCE EN COURS</div>
    <h1 class="title-xl" style="font-size:2.4rem">${esc(sess.name.toUpperCase())}</h1>
    <p class="sys" style="color:var(--accent);margin:4px 0 14px">${esc((sess.sub || '').toUpperCase())} · ${sess.exercises.length} EXERCICES</p>
    <div class="advice-b ${adapted.changed ? 'warn' : 'good'}">${adapted.changed ? '🎚' : '✓'} ${esc(adapted.summary)}</div>
    ${sess.exercises.map((pe, ei) => {
      const ex = getExo(pe.exo) || { name: pe.exo };
      const lp = lastPerf(pe.exo);
      const best = bestBefore(pe.exo, todayStr());
      return `
      <div class="gate ${ex.flag ? 'flagged' : ''}">
        ${ex.flag ? '<div class="flag-strip"></div>' : ''}
        <div class="gate-head">
          <span class="n num">V${ei + 1}</span>
          <button class="t" style="text-align:left" onclick="go('/exo@${ex.id}')">${esc(ex.name.toUpperCase())} ＋</button>
        </div>
        <div class="gate-body">
          <div class="specs num"><span>CIBLE <b>${pe.sets}×${esc(pe.reps)}</b></span><span>TEMPO <b>${esc(pe.tempo)}</b></span><span>RPE <b>${esc(pe.rpe)}</b></span></div>
          ${ex.flag ? `<div class="warn-note">⚠ ${esc(ex.cues)}</div>` : ''}
          ${lp ? `<div class="prev">DERNIÈRE FOIS : ${fmtPR(lp)}${best ? ` · RECORD : ${fmtPR(best.set)}` : ''}</div>` : ''}
          <div class="setrow" style="font-size:0.64rem;font-weight:800;color:var(--mute)">
            <span></span><span style="text-align:center">KG</span><span style="text-align:center">REPS</span><span style="text-align:center">RPE</span><span></span>
          </div>
          ${Array.from({ length: pe.sets }, (_, si) => {
            const d = draft[`${ei}_${si}`] || {};
            return `
            <div class="setrow" data-ei="${ei}" data-si="${si}" data-exo="${ex.id}">
              <span class="n num">${si + 1}</span>
              <input inputmode="decimal" placeholder="${lp?.weight || 'KG'}" value="${d.weight ?? ''}" data-f="weight">
              <input inputmode="numeric" placeholder="${lp?.reps || 'REPS'}" value="${d.reps ?? ''}" data-f="reps">
              <input inputmode="decimal" placeholder="RPE" value="${d.rpe ?? ''}" data-f="rpe">
              <button class="ok ${d.done ? 'done' : ''}">✓</button>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
    <button class="btn" id="finish">🏁 TERMINER LA SÉANCE</button>
    <div style="height:84px"></div>`);

  const saveDraft = () => cacheSet(draftKey, draft);
  $$('.setrow[data-ei]', sh).forEach(line => {
    const k = `${line.dataset.ei}_${line.dataset.si}`;
    $$('input', line).forEach(inp => inp.oninput = () => { draft[k] = draft[k] || {}; draft[k][inp.dataset.f] = inp.value; saveDraft(); });
    $('.ok', line).onclick = ev => {
      draft[k] = draft[k] || {};
      draft[k].done = !draft[k].done;
      ev.target.classList.toggle('done', draft[k].done);
      saveDraft();
      if (draft[k].done) {
        startTimer(sess.exercises[+line.dataset.ei].rest);
        if (navigator.vibrate) navigator.vibrate(40);
        const s = { weight: +draft[k].weight || 0, reps: +draft[k].reps || 0 };
        const b = bestBefore(line.dataset.exo, todayStr());
        if (s.reps && b && setScore(s) > b.score) toast('🏆 RECORD EN VUE !');
      }
    };
  });

  $('#finish', sh).onclick = async () => {
    const sets = [];
    Object.entries(draft).forEach(([k, v]) => {
      if (k === 'startedAt' || (!v.done && !v.reps)) return;
      const [ei, si] = k.split('_').map(Number);
      const pe = sess.exercises[ei];
      sets.push({ exoId: pe.exo, ex: getExo(pe.exo)?.name || pe.exo, n: si + 1, weight: +v.weight || 0, reps: +v.reps || 0, rpe: +v.rpe || 0 });
    });
    if (!sets.length) { toast('VALIDE AU MOINS UNE SÉRIE (✓)'); return; }
    const prs = [], seen = new Set();
    sets.forEach(s => {
      if (seen.has(s.exoId) || !s.reps) return;
      const b = bestBefore(s.exoId, todayStr());
      const sc = setScore(s);
      const top = Math.max(...sets.filter(x => x.exoId === s.exoId).map(setScore));
      if (b && top > b.score && sc === top) { prs.push(s); seen.add(s.exoId); }
    });
    const durMin = Math.round((Date.now() - draft.startedAt) / 60000);
    const xpBefore = window.RPG.computeXP(S.logs).xp;
    const lvlBefore = window.RPG.hunter(S.logs, S.profile).lvl;
    const beltsBefore = unlockedBadges().map(b => b.id);
    await dbSaveLog('workout', todayStr(), { sessionId: sid, sessionName: sess.name, sets, durMin });
    if (sid === 'custom') localStorage.removeItem(lsKey('session_draft'));
    const xpGain = window.RPG.computeXP(S.logs).xp - xpBefore;
    const hAfter = window.RPG.hunter(S.logs, S.profile);
    const leveledTo = hAfter.lvl > lvlBefore ? hAfter.lvl : 0;
    const newBelts = unlockedBadges().filter(b => !beltsBefore.includes(b.id));
    localStorage.removeItem(lsKey(draftKey));
    stopTimer();
    history.replaceState(null, '', location.pathname); // hash vide sans nouvelle entrée
    closeSheets();
    showVictory({ sets, prs, durMin, xpGain, newBelts, leveledTo, rank: hAfter.rank });
    renderAll();
  };
}

function showVictory({ sets, prs, durMin, xpGain, newBelts, leveledTo, rank }) {
  const vol = sets.reduce((x, s) => x + s.weight * s.reps, 0);
  // Variety bonus
  const exoGroups = new Set(sets.map(s => getExo(s.exoId)?.group).filter(Boolean));
  const varietyPct = exoGroups.size >= 5 ? 50 : exoGroups.size >= 3 ? 20 : 0;
  const ov = document.createElement('div');
  ov.className = 'levelup';
  ov.innerHTML = `
    <div class="sys-line">SÉANCE TERMINÉE</div>
    ${leveledTo ? `
      <div class="big">NIVEAU ${leveledTo}</div>
      <div class="sub glow">TU PASSES AU NIVEAU SUPÉRIEUR</div>
      <p class="pts">+3 POINTS À RÉPARTIR</p>
    ` : `
      <div class="big">BRAVO</div>
      <div class="sub glow">${prs.length ? 'NETTOYÉ — RECORD ÉTABLI' : 'NETTOYÉ'}</div>
    `}
    <div class="vstats">
      <div class="cell"><b class="num">${sets.length}</b><span>séries</span></div>
      <div class="cell"><b class="num">${Math.round(vol).toLocaleString('fr-FR')}</b><span>kg volume</span></div>
      <div class="cell"><b class="num">${durMin || '—'}</b><span>min</span></div>
    </div>
    <div class="notif"><b class="glow num">+${xpGain} XP</b> &nbsp;·&nbsp; +${window.RPG.XP.workout} séance · +${window.RPG.XP.set}×${sets.length} séries${prs.length ? ` · +${window.RPG.XP.pr}×${prs.length} record${prs.length > 1 ? 's' : ''}` : ''}</div>
    ${varietyPct ? `<div class="notif gold">🎯 BONUS VARIÉTÉ +${varietyPct}% — ${exoGroups.size} zones travaillées</div>` : ''}
    ${prs.map(s => `<div class="notif">🏆 RECORD — ${esc((getExo(s.exoId)?.name || s.ex))} : ${fmtPR(s)}</div>`).join('')}
    ${newBelts.map(b => `<div class="notif gold">${b.icon} TITRE OBTENU : ${esc(b.name)}</div>`).join('')}
    ${leveledTo ? `<div class="notif gold">⬆ NIVEAU DE RANG : ${rank}</div>` : ''}
    <button class="btn solid" style="max-width:380px;margin-top:18px" id="v-ok">${leveledTo ? 'RÉPARTIR MES POINTS' : 'RETOUR AU PROFIL'}</button>`;
  document.body.appendChild(ov);
  confetti(leveledTo || prs.length || newBelts.length ? 2600 : 1600);
  if (navigator.vibrate) navigator.vibrate(leveledTo ? [120, 60, 120, 60, 220] : [90, 50, 90]);
  $('#v-ok', ov).onclick = () => { ov.remove(); goPanel(0); };
}

// ---------- Minuteur circulaire ----------
function startTimer(seconds) {
  stopTimer();
  let total = seconds, left = seconds;
  const C = 2 * Math.PI * 100;
  const ov = document.createElement('div');
  ov.className = 'timer-overlay';
  ov.innerHTML = `
    <div class="timer-ring">
      <svg viewBox="0 0 220 220"><circle class="bg" cx="110" cy="110" r="100"/><circle class="fg" cx="110" cy="110" r="100" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg>
      <div class="time-text"><span class="time-val" id="tval"></span><span class="time-label">REPOS</span></div>
    </div>
    <div class="timer-presets">
      ${[30,60,90,120].map(s => `<button class="${s === total ? 'on' : ''}" data-ts="${s}">${s}s</button>`).join('')}
    </div>
    <div class="timer-actions">
      <button class="btn ghost" id="tskip">PASSER</button>
      <button class="btn solid" id="tadd">+15s</button>
    </div>`;
  document.body.appendChild(ov);
  const fg = ov.querySelector('.fg');
  const render = () => {
    const el = $('#tval', ov);
    if (el) el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    fg.style.strokeDashoffset = C * (1 - left / total);
  };
  render();
  S.timer = setInterval(() => {
    left--;
    if (left <= 0) {
      stopTimer();
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      fireNotif('🔔 DING ! REPOS TERMINÉ', 'Round suivant.', 'rest');
    } else render();
  }, 1000);
  ov.querySelector('#tskip').onclick = stopTimer;
  ov.querySelector('#tadd').onclick = () => { left += 15; total += 15; render(); };
  ov.querySelectorAll('[data-ts]').forEach(b => b.onclick = () => {
    left = +b.dataset.ts; total = +b.dataset.ts;
    ov.querySelectorAll('[data-ts]').forEach(x => x.classList.toggle('on', x === b));
    render();
  });
}
function stopTimer() { clearInterval(S.timer); S.timer = null; $$('.timer-overlay, .timer-b').forEach(b => b.remove()); }

// ============================================================
// PANNEAU 2 — LA CANTINE
// ============================================================
function renderCantine(el) {
  const t = S.profile.targets || {};
  const recipes = allowedRecipes();
  const meals = S.logs.find(l => l.kind === 'meals' && l.day === todayStr());
  const items = meals?.payload.items || [];
  const tot = items.reduce((s, id) => {
    const r = window.RECIPES.find(x => x.id === id);
    if (r) { s.kcal += r.kcal; s.p += r.p; s.c += r.c; s.f += r.f; }
    return s;
  }, { kcal: 0, p: 0, c: 0, f: 0 });
  let mealFilter = '', recQ = '';
  const normR = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const bar = (label, val, max) => `
    <div class="mb-row"><span>${label}</span>
      <span class="bar"><i class="${val > max ? 'over' : ''}" style="width:${Math.min(100, max ? val / max * 100 : 0)}%"></i></span>
      <span class="num" style="text-align:right">${val}/${max || '—'} G</span>
    </div>`;

  el.innerHTML = `
    <div class="label">MES REPAS DU JOUR</div>
    <h1 class="title-xl">NUTRITION</h1>
    <div class="brick" style="margin-top:14px">
      <div class="row between"><h2>AUJOURD'HUI</h2><b class="sys num" style="font-size:1.2rem">${tot.kcal}/${t.kcal || '—'} KCAL</b></div>
      ${bar('PROTÉINES', tot.p, t.p)}${bar('GLUCIDES', tot.c, t.c)}${bar('LIPIDES', tot.f, t.f)}
      <div class="row" style="margin-top:14px">
        <button class="btn solid grow" id="gen-day">⚡ GÉNÉRER MA JOURNÉE</button>
        ${items.length ? '<button class="btn sm ghost" id="clear-day">VIDER</button>' : ''}
      </div>
      <button class="btn ghost" style="margin-top:8px" onclick="go('/shopping')">🛒 RÉAPPROVISIONNEMENT</button>
    </div>
    <div class="label" style="margin-bottom:6px">CATALOGUE — ${recipes.length} RECETTES</div>
    <label class="field"><input id="rec-q" placeholder="RECHERCHER UNE RECETTE, UN INGRÉDIENT…"></label>
    <div class="choices" id="meal-filters" style="margin-bottom:12px">
      ${['', 'petit-déj', 'déjeuner', 'dîner', 'collation', 'batch'].map(m =>
        `<button class="chip ${m === '' ? 'on' : ''}" data-m="${m}">${m === '' ? 'TOUT' : m === 'batch' ? '🍲 BATCH' : m.toUpperCase()}</button>`).join('')}
    </div>
    <div id="rec-list"></div>`;

  const drawList = () => {
    const list = recipes.filter(r => (!mealFilter || (mealFilter === 'batch' ? r.batch : r.meal === mealFilter))
      && (!recQ || normR(r.name + ' ' + r.ing.map(i => i[0]).join(' ') + ' ' + (r.tags || []).join(' ') + ' ' + (r.micros || []).join(' ')).includes(normR(recQ))));
    $('#rec-list', el).innerHTML = list.map(r => {
      const n = items.filter(i => i === r.id).length;
      return `
      <div class="menu-item">
        <div class="row between" style="align-items:flex-start">
          <div class="grow">
            <span class="row wrap" style="gap:5px"><span class="label" style="margin:0">${r.meal.toUpperCase()}</span>${r.batch ? '<span class="batch-b">🍲 BATCH</span>' : ''}</span>
            <p class="ttl" style="margin-top:6px">${esc(r.name.toUpperCase())} ${n ? `<span style="color:var(--accent)">×${n}</span>` : ''}</p>
            <p class="mute small num" style="font-weight:700">P${r.p} · G${r.c} · L${r.f} · ${r.time} MIN · ~${r.cost.toFixed(2).replace('.', ',')} €</p>
            <div class="row wrap" style="gap:4px;margin-top:6px">${(r.micros || []).map(m => `<span class="micro">${esc(m)}</span>`).join('')}</div>
          </div>
          <div style="text-align:right;flex:none">
            <p class="kcal-big num">${r.kcal}</p>
            <div class="row" style="margin-top:6px;justify-content:flex-end">
              ${n ? `<button class="btn sm ghost" data-rm="${r.id}">−</button>` : ''}
              <button class="btn sm solid" data-add="${r.id}">+</button>
            </div>
          </div>
        </div>
        <button class="btn sm ghost" style="margin-top:9px" onclick="go('/recipe@${r.id}')">📖 LA RECETTE</button>
      </div>`;
    }).join('') || '<p class="mute">RIEN DANS CE FILTRE.</p>';
  };
  drawList();
  $('#rec-q', el).oninput = e => { recQ = e.target.value; drawList(); };

  const saveMeals = async newItems => { await dbSaveLog('meals', todayStr(), { items: newItems }, { unique: true }); renderCantine(el); renderVestiaire($('#panel-0')); };
  el.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'), rm = e.target.closest('[data-rm]'), f = e.target.closest('[data-m]');
    if (add) saveMeals([...items, add.dataset.add]);
    else if (rm) { const c = [...items]; const i = c.indexOf(rm.dataset.rm); if (i >= 0) c.splice(i, 1); saveMeals(c); }
    else if (f) { mealFilter = f.dataset.m; $$('#meal-filters .chip', el).forEach(x => x.classList.toggle('on', x === f)); drawList(); }
  });
  $('#gen-day', el).onclick = () => {
    const gen = generateDay(recipes, t);
    if (!gen) { toast('PAS ASSEZ DE RECETTES COMPATIBLES'); return; }
    saveMeals(gen); toast('⚡ JOURNÉE GÉNÉRÉE');
  };
  $('#clear-day', el) && ($('#clear-day', el).onclick = () => saveMeals([]));
}

function sheetRecipe(rid) {
  const r = window.RECIPES.find(x => x.id === rid);
  if (!r) return;
  openSheet(`
    <div class="label">${r.meal.toUpperCase()}</div>
    <h1 class="title-xl" style="font-size:2.1rem">${esc(r.name.toUpperCase())}</h1>
    <div class="brick" style="margin-top:14px">
      <div class="row wrap" style="gap:14px">
        <b class="sys num" style="font-size:1.4rem">${r.kcal} KCAL</b>
        <span class="mute num" style="font-weight:800">P${r.p} · G${r.c} · L${r.f}</span>
        <span class="mute" style="font-weight:800">${r.time} MIN · ~${r.cost.toFixed(2).replace('.', ',')} €</span>
      </div>
      <div class="row wrap" style="gap:5px;margin-top:10px">${(r.micros || []).map(m => `<span class="micro">${esc(m)}</span>`).join('')}</div>
      ${(r.tags || []).length ? `<div class="row wrap" style="gap:5px;margin-top:8px">${r.tags.map(t => `<span class="chip on">${esc(t.toUpperCase())}</span>`).join('')}</div>` : ''}
    </div>
    ${r.batch ? `<div class="warn-note" style="margin-bottom:18px">🍲 BATCH : ${esc(r.batchNote || 'Multiplie les quantités.')}</div>` : ''}
    <div class="brick">
      <h2>INGRÉDIENTS (1 PORTION)</h2>
      ${r.ing.map(([n, q]) => `<div class="checkline"><span class="grow">${esc(n)}</span><b class="sys num">${q} G</b></div>`).join('')}
    </div>
    <div class="brick"><h2>PRÉPARATION</h2><p style="font-weight:600;font-size:0.94rem;line-height:1.65">${esc(r.steps)}</p></div>
    ${r.tip ? `<div class="warn-note" style="background:var(--panel);border-color:var(--line);color:var(--ink)">💡 ${esc(r.tip)}</div>` : ''}`);
}

function sheetShopping() {
  const plan = cacheGet('weekplan', {});
  const checks = cacheGet('shopchecks', {});
  const render = () => {
    const agg = {};
    Object.entries(plan).forEach(([rid, n]) => {
      const r = window.RECIPES.find(x => x.id === rid);
      if (!r || !n) return;
      r.ing.forEach(([name, q, cat]) => { const k = cat + '|' + name; agg[k] = (agg[k] || 0) + q * n; });
    });
    const cats = {};
    Object.entries(agg).forEach(([k, q]) => { const [cat, name] = k.split('|'); (cats[cat] = cats[cat] || []).push([name, q]); });
    const cost = Object.entries(plan).reduce((x, [rid, n]) => x + (window.RECIPES.find(r => r.id === rid)?.cost || 0) * n, 0);
    return { cats, cost };
  };
  const { cats, cost } = render();
  const sh = openSheet(`
    <div class="label">RAVITAILLEMENT</div>
    <h1 class="title-xl" style="font-size:2.2rem">LES COURSES</h1>
    ${cost ? `<p class="sys" style="color:var(--accent);margin:4px 0 12px">BUDGET ≈ ${cost.toFixed(0)} €</p>` : ''}
    <div class="brick">
      <h2>1 · MENU DE LA SEMAINE</h2>
      ${allowedRecipes().map(r => `
        <div class="checkline">
          <span class="grow">${esc(r.name)} ${r.batch ? '🍲' : ''}</span>
          <button class="btn sm ghost" data-wm="${r.id}">−</button>
          <b class="sys num" style="width:24px;text-align:center">${plan[r.id] || 0}</b>
          <button class="btn sm solid" data-wp="${r.id}">+</button>
        </div>`).join('')}
    </div>
    <div class="brick" id="shop-box">
      <h2>2 · LISTE PAR RAYON</h2>
      <div id="shop-list"></div>
    </div>`);
  const drawShop = () => {
    const { cats } = render();
    $('#shop-list', sh).innerHTML = Object.keys(cats).length ? Object.entries(cats).map(([cat, list]) => `
      <div class="shop-cat">${esc(cat.toUpperCase())}</div>
      ${list.map(([name, q]) => {
        const ck = checks[name] ? 'checked' : '';
        return `<label class="checkline ${ck ? 'done' : ''}"><input type="checkbox" data-n="${esc(name)}" ${ck}><span class="grow">${esc(name)}</span><b class="sys num">${q >= 1000 ? (q / 1000).toFixed(1) + ' KG' : q + ' G'}</b></label>`;
      }).join('')}`).join('')
      : '<p class="mute">AJOUTE DES RECETTES AU MENU CI-DESSUS.</p>';
    $$('#shop-list input[type=checkbox]', sh).forEach(c => c.onchange = () => {
      checks[c.dataset.n] = c.checked; cacheSet('shopchecks', checks);
      c.closest('.checkline').classList.toggle('done', c.checked);
    });
  };
  drawShop();
  sh.addEventListener('click', e => {
    const p = e.target.closest('[data-wp]'), m = e.target.closest('[data-wm]');
    if (p) { plan[p.dataset.wp] = (plan[p.dataset.wp] || 0) + 1; }
    else if (m) { plan[m.dataset.wm] = Math.max(0, (plan[m.dataset.wm] || 0) - 1); }
    else return;
    cacheSet('weekplan', plan);
    const b = e.target.closest('.checkline').querySelector('b');
    b.textContent = plan[(p || m).dataset.wp || (p || m).dataset.wm] || 0;
    drawShop();
  });
}

// ============================================================
// PANNEAU 3 — LE COACH
// ============================================================
function renderCoach(el) {
  const advice = window.Coach.dailyAdvice(S.logs, S.profile);
  const f = window.RPG.fighter(S.logs, S.profile);
  el.innerHTML = `
    <div class="label">TON COACH</div>
    <h1 class="title-xl">COACH</h1>
    <p class="mute" style="margin:6px 0 14px;font-weight:700">${window.KB.length} FICHES TECHNIQUES · ANALYSES SUR TES ${f.workouts} SÉANCES</p>
    ${advice.map(a => `<div class="advice-b ${a.level === 'warn' ? 'warn' : 'good'}">${a.icon} ${esc(a.text)}</div>`).join('')}
    <div class="brick">
      <div class="row between"><h2>🔬 ANALYSE HEBDOMADAIRE</h2><button class="btn sm solid" id="show-analysis">LANCER</button></div>
      <div id="analysis"></div>
    </div>
    <div class="brick">
      <h2>POSE TA QUESTION</h2>
      <div class="chat-b" id="chat">
        <div class="bub coach">Je connais ton palmarès (${f.workouts} combats, ${f.prCount} records, niveau ${f.lvl}). Pose ta question ou tape un thème 👇</div>
      </div>
      <div class="choices" id="kb-zone" style="margin-bottom:10px">
        <button class="chip" data-act="adapt">🎚 ADAPTER MA SÉANCE</button>
        ${window.KB_CATS.map(c => `<button class="chip" data-cat="${c}">${c.toUpperCase()}</button>`).join('')}
      </div>
      <div class="row">
        <input id="chat-q" class="grow" placeholder="EX : COMBIEN DE PROTÉINES PAR JOUR ?">
        <button class="btn sm" id="chat-send" style="height:48px">➤</button>
      </div>
    </div>`;

  const chat = $('#chat', el);
  const push = (cls, text) => {
    const d = document.createElement('div');
    d.className = 'bub ' + cls; d.textContent = text;
    chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
  };
  const pushRelated = entry => {
    const rel = window.Coach.related(entry);
    if (!rel.length) return;
    const d = document.createElement('div');
    d.className = 'choices'; d.style.alignSelf = 'flex-start';
    d.innerHTML = rel.map(k => `<button class="chip" data-kb="${k.id}">${esc(k.q)}</button>`).join('');
    chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
  };
  const answer = entry => { push('me', entry.q); setTimeout(() => { push('coach', entry.a); pushRelated(entry); }, 160); };

  $('#show-analysis', el).onclick = () => {
    const sections = window.Coach.analyze(S.logs, S.profile);
    $('#analysis', el).innerHTML = sections.map(s => `
      <div style="margin-top:12px"><b class="sys" style="font-size:0.95rem">${esc(s.title)}</b>
      ${s.lines.map(l => `<p style="font-size:0.88rem;font-weight:600;margin-top:5px;line-height:1.5">${esc(l)}</p>`).join('')}</div>`).join('');
  };
  el.addEventListener('click', e => {
    const cat = e.target.closest('[data-cat]'), kb = e.target.closest('[data-kb]'), act = e.target.closest('[data-act]');
    if (cat) {
      push('me', cat.dataset.cat);
      const d = document.createElement('div');
      d.className = 'choices'; d.style.alignSelf = 'flex-start';
      d.innerHTML = window.KB.filter(k => k.cat === cat.dataset.cat).slice(0, 8).map(k => `<button class="chip" data-kb="${k.id}">${esc(k.q)}</button>`).join('');
      chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
    } else if (kb) {
      const entry = window.KB.find(k => k.id === kb.dataset.kb);
      if (entry) answer(entry);
    } else if (act?.dataset.act === 'adapt') {
      const next = nextSession();
      const a = window.Coach.adaptSession(next, S.logs, S.profile);
      push('me', 'Adapter mon combat du jour');
      push('coach', `${a.summary}\n\n${a.session.name} :\n` + a.session.exercises.map((x, i) => `R${i + 1}. ${getExo(x.exo)?.name || x.exo} — ${x.sets}×${x.reps} (RPE ${x.rpe})`).join('\n') + `\n\nLance-le depuis l'onglet SÉANCE : l'adaptation y est appliquée.`);
    }
  });
  const send = () => {
    const q = $('#chat-q', el).value.trim();
    if (!q) return;
    $('#chat-q', el).value = '';
    push('me', q);
    const hit = window.Coach.ask(q);
    setTimeout(() => {
      if (hit) { push('coach', hit.a); pushRelated(hit); }
      else push('coach', "Pas de fiche précise là-dessus. Tape un thème ci-dessous ou reformule (ex : « plateau », « créatine », « douleur épaule »).");
    }, 180);
  };
  $('#chat-send', el).onclick = send;
  $('#chat-q', el).onkeydown = e => { if (e.key === 'Enter') send(); };
}

// ============================================================
// PANNEAU 4 — LE PALMARÈS
// ============================================================
function renderPalmares(el) {
  const t = todayStr();
  const entry = S.logs.find(l => l.kind === 'journal' && l.day === t)?.payload || {};
  const fight = window.RPG.weeklyFight(S.logs, S.profile);
  const days30 = Array.from({ length: 30 }, (_, i) => new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10));
  const weights = days30.map(d => +S.logs.find(l => l.kind === 'journal' && l.day === d)?.payload.weight || null);
  const weekLabels = [], weekVals = [];
  for (let w = 5; w >= 0; w--) {
    const start = Date.now() - (w + 1) * 7 * 86400000, end = Date.now() - w * 7 * 86400000;
    weekLabels.push(w === 0 ? 'SEM' : `S-${w}`);
    weekVals.push(S.logs.filter(l => l.kind === 'workout' && +new Date(l.day) > start && +new Date(l.day) <= end).length);
  }
  const prs = currentPRs();
  const unlocked = unlockedBadges().map(b => b.id);
  const skills = window.RPG.hunter(S.logs, S.profile).skills;
  const vd = fight.verdict;

  el.innerHTML = `
    <div class="label">SUIVI & PROGRÈS</div>
    <h1 class="title-xl">PROGRÈS</h1>

    <div class="win" style="margin-top:14px">
      <div class="win-tag">TON ÉVOLUTION</div>
      <p class="mute small" style="margin-bottom:6px">Toi cette semaine, comparé à toi il y a 7 jours.</p>
      <div class="vs-grid">
        <div class="vs-side"><h3>TOI</h3><span class="mono small">CETTE SEMAINE</span></div>
        <div class="vs-x">vs</div>
        <div class="vs-side shadow"><h3>SEMAINE −1</h3><span class="mono small">IL Y A 7 J</span></div>
      </div>
      <table class="tale num">
        <tr><td class="${fight.cur.vol > fight.old.vol ? 'win' : ''}">${Math.round(fight.cur.vol).toLocaleString('fr-FR')}</td><td class="mid">volume kg</td><td class="${fight.old.vol > fight.cur.vol ? 'win-s' : ''}">${Math.round(fight.old.vol).toLocaleString('fr-FR')}</td></tr>
        <tr><td class="${fight.cur.sessions > fight.old.sessions ? 'win' : ''}">${fight.cur.sessions}</td><td class="mid">séances</td><td class="${fight.old.sessions > fight.cur.sessions ? 'win-s' : ''}">${fight.old.sessions}</td></tr>
        <tr><td class="${fight.cur.sets > fight.old.sets ? 'win' : ''}">${fight.cur.sets}</td><td class="mid">séries</td><td class="${fight.old.sets > fight.cur.sets ? 'win-s' : ''}">${fight.old.sets}</td></tr>
        ${fight.wNow != null && fight.wOld != null ? `<tr><td>${fight.wNow.toFixed(1)}</td><td class="mid">poids moy.</td><td>${fight.wOld.toFixed(1)}</td></tr>` : ''}
      </table>
      <div class="verdict ${vd.code === 'win' || vd.code === 'first' ? '' : 'lose'}">${vd.txt}</div>
    </div>

    <div class="brick">
      <h2>MON JOURNAL — AUJOURD'HUI</h2>
      <div class="row">
        <label class="field grow"><span>POIDS (KG)</span><input id="j-weight" type="number" inputmode="decimal" step="0.1" value="${entry.weight ?? ''}"></label>
        <label class="field grow"><span>SOMMEIL (H)</span><input id="j-sleep" type="number" inputmode="decimal" step="0.5" value="${entry.sleep ?? ''}"></label>
      </div>
      <label class="field"><span>ÉNERGIE</span>
        <div class="scale5" id="j-energy">${['😫', '😕', '😐', '🙂', '🔥'].map((e2, i) => `<button data-v="${i + 1}" class="${entry.energy == i + 1 ? 'on' : ''}">${e2}</button>`).join('')}</div>
      </label>
      <label class="field"><span>NOTES</span><textarea id="j-notes" rows="2">${esc(entry.notes || '')}</textarea></label>
      <button class="btn" id="j-save">ENREGISTRER (+${window.RPG.XP.journal} XP)</button>
    </div>

    <div class="brick"><h2>PESÉE — 30 JOURS</h2><canvas class="chart" id="c-weight"></canvas></div>
    <div class="brick"><h2>SÉANCES / SEMAINE</h2><canvas class="chart" id="c-sessions"></canvas></div>

    <div class="brick">
      <h2>🏆 RECORDS (1RM ESTIMÉ — EPLEY)</h2>
      ${prs.length ? `
        <label class="field"><span>TECHNIQUE</span><select id="exo-sel">${prs.map(p => `<option value="${p.exo.id}">${esc(p.exo.name)}</option>`).join('')}</select></label>
        <canvas class="chart" id="c-prog"></canvas>
        <hr class="divider">
        ${prs.slice(0, 10).map(p => `<div class="pr-line"><span style="font-weight:700">${esc(p.exo.name.toUpperCase())}<br><span class="mute small">${p.day}</span></span><b class="v num">${fmtPR(p.set)}</b></div>`).join('')}`
      : '<p class="mute">TES RECORDS APPARAÎTRONT APRÈS TA PREMIÈRE SÉANCE.</p>'}
    </div>

    <div class="win">
      <h2>🎖 TITRES OBTENUS — ${unlocked.length}/${window.BADGES.length}</h2>
      <div class="belt-grid" style="margin-top:10px">
        ${window.BADGES.map(b => `<div class="belt ${unlocked.includes(b.id) ? '' : 'locked'}" title="${esc(b.desc)}"><span class="i">${b.icon}</span><b>${esc(b.name)}</b></div>`).join('')}
      </div>
    </div>

    <div class="win">
      <div class="win-tag">COMPÉTENCES</div>
      <h2 style="margin-bottom:10px">COMPÉTENCES DÉBLOQUÉES — ${skills.filter(s => s.unlocked).length}/${skills.length}</h2>
      <div class="skill-grid">
        ${skills.map(s => `<div class="skill ${s.unlocked ? '' : 'locked'}"><div class="sn">${s.unlocked ? '◆' : '🔒'} ${esc(s.name)}</div><div class="sd">${esc(s.desc)}</div></div>`).join('')}
      </div>
    </div>`;

  let energy = entry.energy || null;
  $('#j-energy', el).onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    energy = +b.dataset.v;
    $$('#j-energy button', el).forEach(x => x.classList.toggle('on', x === b));
  };
  $('#j-save', el).onclick = async () => {
    await dbSaveLog('journal', t, { weight: +$('#j-weight', el).value || null, sleep: +$('#j-sleep', el).value || null, energy, notes: $('#j-notes', el).value }, { unique: true });
    toast('CARNET SIGNÉ ✍'); confetti(900);
    renderAll();
  };
  const drawProg = () => {
    const sel = $('#exo-sel', el); if (!sel) return;
    const hist = [];
    [...S.logs.filter(l => l.kind === 'workout')].sort((a, b) => a.day.localeCompare(b.day)).forEach(w => {
      const sets = (w.payload.sets || []).filter(s => exoOf(s)?.id === sel.value);
      if (sets.length) hist.push(Math.max(...sets.map(setScore)));
    });
    const c = $('#c-prog', el); if (c) drawLine(c, hist);
  };
  $('#exo-sel', el) && ($('#exo-sel', el).onchange = drawProg);
  requestAnimationFrame(() => {
    drawLine($('#c-weight', el), weights);
    drawBars($('#c-sessions', el), weekLabels, weekVals, { target: +S.profile.anamnese?.days || 2 });
    drawProg();
  });
}

// ============================================================
// RÉGLAGES (sheet)
// ============================================================
function sheetSettings() {
  const set = S.profile.settings || {};
  const r = set.reminders || { enabled: false, workoutDays: [1, 4], workoutTime: '18:00', weighTime: '07:30', hydrate: true };
  const t = S.profile.targets || {};
  const theme = set.theme || localStorage.getItem('rc_theme') || 'auto';
  const curAccent = set.accent || localStorage.getItem('rc_accent') || '#2F80ED';
  const curFs = set.fontSize || localStorage.getItem('rc_fontsize') || '16';
  const dayNames = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  // Bloc thèmes enrichi injecté via buildSettingsHTML
  
  const sh = openSheet(`
    <div class="label">RÉGLAGES</div>
    <h1 class="title-xl" style="font-size:2.2rem">RÉGLAGES</h1>

    <div class="brick" style="margin-top:14px">
      <h2>🎨 THÈME</h2>
      <div class="choices" id="theme-pick">
        ${[['auto', '🌗 AUTO'], ['light', '☀ CLAIR'], ['dark', '🌙 SOMBRE']].map(([v, l]) => '<button class="chip ' + (theme === v ? 'on' : '') + '" data-t="' + v + '">' + l + '</button>').join('')}
      </div>
    </div>

    <div class="brick">
      <h2>🎨 COULEUR D'ACCENT</h2>
      <div class="accent-grid" id="accent-grid">
        ${window.ACCENT_PRESETS.map(p => '<div class="accent-btn ' + (curAccent === p.value ? 'on' : '') + '" data-ac="' + (p.value||'') + '"><div class="swatch" style="background:' + (p.value||curAccent) + '"></div>' + p.label + '</div>').join('')}
      </div>
      <label class="field" style="margin-top:10px" id="custom-color-wrap">
        <span>COULEUR LIBRE</span>
        <input type="color" id="custom-color" value="${curAccent}">
      </label>
    </div>

    <div class="brick">
      <h2>🔡 TAILLE DU TEXTE</h2>
      <div class="font-size-row">
        <button class="btn sm ghost" id="fs-minus">A−</button>
        <span class="val" id="fs-val">${curFs}</span>
        <button class="btn sm solid" id="fs-plus">A+</button>
      </div>
      <p class="mute small" style="margin-top:8px;font-weight:600">Plage : 14 px (compact) → 20 px (grand). Par défaut : 16 px.</p>
    </div>

    <div class="brick">
      <h2>🔔 RAPPELS</h2>
      <label class="checkline"><input type="checkbox" id="r-on" ${r.enabled ? 'checked' : ''}><span class="grow">ACTIVER LES RAPPELS</span></label>
      <label class="field" style="margin-top:10px"><span>JOURS D'ENTRAÎNEMENT</span>
        <div class="choices" id="r-days">${dayNames.map((d, i) => '<button type="button" class="chip ' + (r.workoutDays.includes(i) ? 'on' : '') + '" data-d="' + i + '">' + d + '</button>').join('')}</div>
      </label>
      <div class="row">
        <label class="field grow"><span>HEURE D'ENTRAÎNEMENT</span><input id="r-time" type="time" value="${r.workoutTime}"></label>
        <label class="field grow"><span>PESÉE</span><input id="r-weigh" type="time" value="${r.weighTime}"></label>
      </div>
      <label class="checkline"><input type="checkbox" id="r-hyd" ${r.hydrate ? 'checked' : ''}><span class="grow">HYDRATATION (10/13/16/19 H)</span></label>
      <button class="btn" id="r-save" style="margin-top:10px">ENREGISTRER LES RAPPELS</button>
      <p class="mute small" style="margin-top:8px;font-weight:600">Notifications locales : déclenchées si l'app est installée/récemment ouverte.</p>
    </div>

    <div class="brick">
      <h2>🎯 CIBLES NUTRITION</h2>
      <div class="row">
        <label class="field grow"><span>KCAL</span><input id="t-kcal" type="number" value="${t.kcal || ''}"></label>
        <label class="field grow"><span>PROT (G)</span><input id="t-p" type="number" value="${t.p || ''}"></label>
      </div>
      <div class="row">
        <label class="field grow"><span>GLUC (G)</span><input id="t-c" type="number" value="${t.c || ''}"></label>
        <label class="field grow"><span>LIP (G)</span><input id="t-f" type="number" value="${t.f || ''}"></label>
      </div>
      <button class="btn solid" id="t-save">METTRE À JOUR LES CIBLES</button>
    </div>

    <div class="brick">
      <h2>👤 MON COMPTE</h2>
      <p class="mute small" style="margin-bottom:10px;font-weight:600">${LOCAL_MODE ? 'MODE LOCAL : données sur cet appareil.' : 'CONNECTÉ : ' + esc(S.user.email) + ' · RLS + chiffrement au repos.'}</p>
      <button class="btn ghost" id="redo">REFAIRE L'INTRO</button>
      <div style="height:8px"></div>
      <button class="btn ghost" id="export">⬇ EXPORTER MES DONNÉES (JSON)</button>
      ${LOCAL_MODE ? '' : '<div style="height:8px"></div><button class="btn" id="logout" style="background:var(--ink);color:var(--paper)">SE DÉCONNECTER</button>'}
    </div>`);

  // Thème clair/sombre
  $('#theme-pick', sh).onclick = async e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    $$('#theme-pick .chip', sh).forEach(x => x.classList.toggle('on', x === b));
    localStorage.setItem('rc_theme', b.dataset.t);
    await dbSaveProfile({ settings: { ...S.profile.settings, theme: b.dataset.t } });
    applyTheme();
  };
  // Accent couleur
  $('#accent-grid', sh).onclick = async e => {
    const b = e.target.closest('.accent-btn'); if (!b) return;
    $$('.accent-btn', sh).forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const color = b.dataset.ac || $('#custom-color', sh).value;
    applyAccent(color);
    await dbSaveProfile({ settings: { ...S.profile.settings, accent: color } });
  };
  $('#custom-color', sh).oninput = async e => {
    applyAccent(e.target.value);
    await dbSaveProfile({ settings: { ...S.profile.settings, accent: e.target.value } });
  };
  // Taille de police
  let curFsNum = +curFs;
  const updateFs = async (n) => {
    curFsNum = Math.max(14, Math.min(20, n));
    $('#fs-val', sh).textContent = curFsNum;
    localStorage.setItem('rc_fontsize', curFsNum);
    document.documentElement.style.fontSize = curFsNum + 'px';
    await dbSaveProfile({ settings: { ...S.profile.settings, fontSize: String(curFsNum) } });
  };
  $('#fs-minus', sh).onclick = () => updateFs(curFsNum - 1);
  $('#fs-plus', sh).onclick = () => updateFs(curFsNum + 1);
  // Jours de rappel
  $('#r-days', sh).onclick = e => { const b = e.target.closest('.chip'); if (b) b.classList.toggle('on'); };
  $('#r-save', sh).onclick = async () => {
    const enabled = $('#r-on', sh).checked;
    if (enabled && !(await askNotifPermission())) return;
    const reminders = { enabled, workoutDays: $$('#r-days .chip.on', sh).map(b => +b.dataset.d), workoutTime: $('#r-time', sh).value, weighTime: $('#r-weigh', sh).value, hydrate: $('#r-hyd', sh).checked };
    await dbSaveProfile({ settings: { ...S.profile.settings, reminders } });
    toast('RAPPELS ENREGISTRÉS 🔔');
  };
  $('#t-save', sh).onclick = async () => {
    await dbSaveProfile({ targets: { ...t, kcal: +$('#t-kcal', sh).value, p: +$('#t-p', sh).value, c: +$('#t-c', sh).value, f: +$('#t-f', sh).value } });
    toast('CIBLES MISES À JOUR'); renderAll();
  };
  $('#redo', sh).onclick = async () => { await dbSaveProfile({ anamnese: { ...S.profile.anamnese, done: false } }); go('/onboarding'); };
  $('#export', sh).onclick = () => {
    const blob = new Blob([JSON.stringify({ profile: S.profile, logs: S.logs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `recomp-export-${todayStr()}.json`; a.click();
  };
  $('#logout', sh) && ($('#logout', sh).onclick = async () => { await sb.auth.signOut(); localStorage.removeItem('rc_last_user'); location.hash = ''; location.reload(); });
}

// ============================================================
// AUTH + ONBOARDING
// ============================================================
function renderAuth() {
  const w = document.createElement('div');
  w.className = 'auth-wrap';
  w.innerHTML = `
    <div class="inner">
      <div class="label">CONNEXION</div>
      <h1 class="title-xl" style="font-size:3.4rem">RECOMP<br>SYSTEM</h1>
      <p class="mute" style="margin:8px 0 18px;font-weight:700">${LOCAL_MODE ? '⚠ MODE LOCAL (SUPABASE NON CONFIGURÉ) — DONNÉES SUR CET APPAREIL.' : 'PROGRESSE À TON RYTHME, UN PAS APRÈS L\'AUTRE.'}</p>
      <div class="brick">
        ${LOCAL_MODE ? `
          <label class="field"><span>TON PRÉNOM</span><input id="pseudo" placeholder="AXEL"></label>
          <button class="btn" id="local-go">COMMENCER</button>
        ` : `
          <label class="field"><span>E-MAIL</span><input id="email" type="email" autocomplete="email"></label>
          <label class="field"><span>MOT DE PASSE</span><input id="pwd" type="password" autocomplete="current-password" placeholder="8 CARACTÈRES MIN."></label>
          <button class="btn" id="login">COMMENCER</button>
          <div style="height:8px"></div>
          <button class="btn solid" id="signup">CRÉER MON COMPTE</button>
        `}
      </div>
    </div>`;
  document.body.appendChild(w);
  if (LOCAL_MODE) {
    $('#local-go', w).onclick = async () => {
      localStorage.setItem('rc_local_started', '1');
      S.user = { id: 'local', email: 'local' };
      await dbLoadProfile(); await dbLoadLogs();
      if (!S.profile) await dbSaveProfile({ pseudo: $('#pseudo', w).value || 'FIGHTER', anamnese: {}, settings: {} });
      w.remove(); enterApp();
    };
    return;
  }
  const doAuth = async mode => {
    const email = $('#email', w).value.trim(), password = $('#pwd', w).value;
    if (!email || password.length < 8) { toast('E-MAIL + MOT DE PASSE ≥ 8 CARACTÈRES'); return; }
    const { data, error } = mode === 'in' ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password });
    if (error) { toast(error.message); return; }
    if (mode === 'up' && !data.session) { toast('COMPTE CRÉÉ — VÉRIFIE TA BOÎTE MAIL'); return; }
    w.remove(); await onSignedIn(data.session.user);
  };
  $('#login', w).onclick = () => doAuth('in');
  $('#signup', w).onclick = () => doAuth('up');
}
async function onSignedIn(user) {
  S.user = { id: user.id, email: user.email };
  localStorage.setItem('rc_last_user', JSON.stringify(S.user));
  await dbLoadProfile(); await dbLoadLogs(); flushOutbox(); applyTheme();
  if (!S.profile) await dbSaveProfile({ pseudo: user.email.split('@')[0].toUpperCase(), anamnese: {}, settings: {} });
  enterApp();
}
function enterApp() {
  if (!$('#deck')) mountShell();
  if (!S.profile?.anamnese?.done) { go('/onboarding'); return; }
  renderAll();
  handleHash();
}

function sheetOnboarding() {
  const prev = S.profile?.anamnese || {};
  const a = { sex: 'H', activity: 'leger', goal: 'perte', injuries: [], allergies: [], equipment: ['halteres', 'barre', 'chaise_romaine'], days: '2', ...prev, done: false };
  let step = 0;
  const sh = openSheet('<div id="ob"></div>', { closable: false });
  const ob = $('#ob', sh);
  const steps = [stepBio, stepSante, stepLogistique, stepNutrition];

  function shell(inner) {
    ob.innerHTML = `
      <div class="label">BIENVENUE</div>
      <h1 class="title-xl" style="font-size:2.2rem">FAISONS CONNAISSANCE</h1>
      <div class="steps-b" style="margin-top:12px">${steps.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
      <div class="brick">${inner}</div>
      <div class="row">
        ${step > 0 ? '<button class="btn ghost" id="prev" style="width:auto">RETOUR</button>' : ''}
        <button class="btn grow" id="next">${step === steps.length - 1 ? "⚡ COMMENCER" : 'CONTINUER'}</button>
      </div>`;
    $('#prev', ob) && ($('#prev', ob).onclick = () => { collect(); step--; steps[step](); });
    $('#next', ob).onclick = onNext;
  }
  const chips = (name, opts, multi = false) => `<div class="choices" data-chips="${name}">${opts.map(([v, l]) =>
    `<button type="button" class="chip ${multi ? (a[name].includes(v) ? 'on' : '') : (String(a[name]) === v ? 'on' : '')}" data-v="${v}">${l}</button>`).join('')}</div>`;
  function bindChips(multi = []) {
    $$('[data-chips]', ob).forEach(box => {
      const name = box.dataset.chips;
      box.onclick = e => {
        const b = e.target.closest('.chip'); if (!b) return;
        if (multi.includes(name)) {
          const i = a[name].indexOf(b.dataset.v);
          i >= 0 ? a[name].splice(i, 1) : a[name].push(b.dataset.v);
          b.classList.toggle('on');
        } else { a[name] = b.dataset.v; $$('.chip', box).forEach(x => x.classList.toggle('on', x === b)); }
      };
    });
  }
  const collect = () => ['age', 'height', 'weight', 'sleep', 'stress', 'dbkg', 'budget'].forEach(id => { const el = $('#' + id, ob); if (el) a[id] = el.value; });

  function stepBio() {
    shell(`
      <h2>1 · BIOMÉTRIE</h2>
      <label class="field"><span>SEXE (CALCUL CALORIQUE)</span>${chips('sex', [['H', 'HOMME'], ['F', 'FEMME']])}</label>
      <div class="row">
        <label class="field grow"><span>ÂGE</span><input id="age" type="number" inputmode="numeric" value="${a.age || ''}"></label>
        <label class="field grow"><span>TAILLE CM</span><input id="height" type="number" inputmode="numeric" value="${a.height || ''}"></label>
        <label class="field grow"><span>POIDS KG</span><input id="weight" type="number" inputmode="decimal" step="0.1" value="${a.weight || ''}"></label>
      </div>
      <label class="field"><span>ACTIVITÉ HORS SPORT</span>${chips('activity', [['sedentaire', 'SÉDENTAIRE'], ['leger', 'LÉGER'], ['actif', 'ACTIF'], ['tres_actif', 'TRÈS ACTIF']])}</label>
      <label class="field"><span>OBJECTIF</span>${chips('goal', [['perte', '🔥 PERTE DE GRAS'], ['maintien', '⚖ RECOMP'], ['prise', '💪 MASSE']])}</label>`);
    bindChips();
  }
  function stepSante() {
    shell(`
      <h2>2 · BLESSURES & ARTICULATIONS</h2>
      <p class="mute small" style="margin-bottom:12px;font-weight:600">Chaque zone cochée remplace automatiquement les techniques à risque.</p>
      <label class="field"><span>ANTÉCÉDENTS</span>${chips('injuries', [['epaule', 'ÉPAULE / CLAVICULE'], ['genou', 'GENOU'], ['lombaires', 'LOMBAIRES'], ['poignet', 'POIGNET']], true)}</label>
      <label class="field"><span>SOMMEIL (H/NUIT)</span><input id="sleep" type="number" inputmode="decimal" step="0.5" value="${a.sleep || ''}"></label>
      <label class="field"><span>STRESS (1–10)</span><input id="stress" type="number" inputmode="numeric" min="1" max="10" value="${a.stress || ''}"></label>`);
    bindChips(['injuries']);
  }
  function stepLogistique() {
    // Grille dynamique depuis le catalogue EQUIPMENT_OPTIONS
    const eqHtml = window.EQUIPMENT_OPTIONS.map(eq =>
      `<div class="eq-item ${a.equipment.includes(eq.id) ? 'on' : ''}" data-eq="${eq.id}"><span class="ico">${eq.icon}</span>${eq.label.toUpperCase()}</div>`
    ).join('');
    shell(`
      <h2>3 · ÉQUIPEMENT DISPONIBLE</h2>
      <p class="mute small" style="margin-bottom:12px;font-weight:600">Coche tout ce que tu as. Les exercices inadaptés seront remplacés automatiquement.</p>
      <div class="eq-grid" id="eq-grid">${eqHtml}</div>
      <label class="field" style="margin-top:14px"><span>CHARGE MAX / HALTÈRE (KG)</span><input id="dbkg" type="number" inputmode="numeric" value="${a.dbkg || 16}"></label>
      <label class="field"><span>SÉANCES / SEMAINE</span>${chips('days', [['2', '2'], ['3', '3'], ['4', '4']])}</label>`);
    bindChips([]);
    // Gestion grille équipement (toggle custom)
    ob.querySelector('#eq-grid').onclick = e => {
      const item = e.target.closest('.eq-item'); if (!item) return;
      const id = item.dataset.eq;
      const idx = a.equipment.indexOf(id);
      idx >= 0 ? a.equipment.splice(idx, 1) : a.equipment.push(id);
      item.classList.toggle('on', a.equipment.includes(id));
    };
  }
  function stepNutrition() {
    // Grille dynamique depuis le catalogue EXCLUSION_OPTIONS
    const exHtml = window.EXCLUSION_OPTIONS.map(ex =>
      `<div class="eq-item ${a.allergies.includes(ex.id) ? 'on' : ''}" data-ex="${ex.id}"><span class="ico">${ex.icon}</span>${ex.label.slice(0,22).toUpperCase()}</div>`
    ).join('');
    shell(`
      <h2>4 · LA CANTINE</h2>
      <p class="mute small" style="margin-bottom:12px;font-weight:600">Coche ce que tu ne manges pas. Les recettes incompatibles seront masquées.</p>
      <div class="eq-grid" id="ex-grid">${exHtml}</div>
      <label class="field" style="margin-top:14px"><span>BUDGET COURSES / SEM (€)</span><input id="budget" type="number" inputmode="numeric" value="${a.budget || ''}"></label>
      <p class="mute small" style="font-weight:600">Les ${window.RECIPES.length} recettes du camp sont déjà sans œufs ni oignons.</p>`);
    bindChips([]);
    ob.querySelector('#ex-grid').onclick = e => {
      const item = e.target.closest('[data-ex]'); if (!item) return;
      const id = item.dataset.ex;
      const idx = a.allergies.indexOf(id);
      idx >= 0 ? a.allergies.splice(idx, 1) : a.allergies.push(id);
      item.classList.toggle('on', a.allergies.includes(id));
    };
  }
  async function onNext() {
    collect();
    if (step === 0 && (!+a.age || !+a.height || !+a.weight)) { toast('ÂGE, TAILLE ET POIDS REQUIS'); return; }
    if (step < steps.length - 1) { step++; steps[step](); return; }
    a.days = +a.days || 2; a.done = true;
    await dbSaveProfile({ anamnese: a, targets: computeTargets(a), settings: S.profile?.settings || {} });
    await dbSaveLog('journal', todayStr(), { weight: +a.weight, sleep: +a.sleep || null, energy: null, notes: 'Éveil du joueur — point de départ' }, { unique: true });
    history.replaceState(null, '', location.pathname);
    closeSheets();
    confetti(1600);
    toast('⚡ C\'EST PARTI !');
    renderAll();
    goPanel(0);
  }
  stepBio();
}

// ============================================================
// MUSIQUE — UI
// ============================================================
function initMusicUI() {
  if (!window.MusicPlayer) return;
  window.MusicPlayer.setOnStateChange(st => {
    renderMusicMini(st);
    document.body.classList.toggle('music-on', st.isPlaying || st.count > 0);
    const fab = $('#fab-music');
    if (fab) fab.classList.toggle('has-mini', st.isPlaying);
  });
  const st = window.MusicPlayer.getState();
  if (st.count > 0) renderMusicMini(st);
}
function renderMusicMini(st) {
  let mini = $('.music-mini');
  if (!st || (!st.isPlaying && !st.count)) { if (mini) mini.remove(); return; }
  if (!mini) {
    mini = document.createElement('div');
    mini.className = 'music-mini';
    document.body.appendChild(mini);
  }
  const cur = st.current;
  mini.innerHTML = `
    <div class="track-info">
      <div class="track-title">${cur ? esc(cur.title) : 'AUCUNE PISTE'}</div>
      <div class="track-type">${cur ? (cur.type === 'youtube' ? '▶ YOUTUBE' : cur.type === 'youtube-playlist' ? '▶ PLAYLIST' : '♪ AUDIO') : '—'} · ${st.count} PISTE${st.count > 1 ? 'S' : ''}</div>
    </div>
    <button data-act="prev" title="Précédent">⏮</button>
    <button class="play-btn ${st.isPlaying ? 'playing' : ''}" data-act="toggle">${st.isPlaying ? '⏸' : '▶'}</button>
    <button data-act="next" title="Suivant">⏭</button>`;
  mini.onclick = e => {
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'toggle') window.MusicPlayer.toggle();
    else if (a === 'next') window.MusicPlayer.next();
    else if (a === 'prev') window.MusicPlayer.prev();
  };
}
function sheetMusic() {
  const MP = window.MusicPlayer;
  if (!MP) { toast('MODULE MUSIQUE NON DISPONIBLE'); return; }
  const st = MP.getState();
  const sh = openSheet(`
    <div class="label">MUSIQUE</div>
    <h1 class="title-xl" style="font-size:2.2rem">MUSIQUE</h1>
    <div class="brick" style="margin-top:14px">
      <h2>AJOUTER DE LA MUSIQUE</h2>
      <p class="mute small" style="margin-bottom:10px;font-weight:600">Colle un lien YouTube (vidéo ou playlist) ou tape un nom pour chercher.</p>
      <label class="field"><span>LIEN OU NOM</span><input id="m-url" placeholder="Lien YouTube, playlist, ou nom de musique..."></label>
      <label class="field"><span>TITRE (OPTIONNEL)</span><input id="m-title" placeholder="Ma musique"></label>
      <div class="row" style="gap:8px">
        <button class="btn solid grow" id="m-add">＋ AJOUTER</button>
        <button class="btn ghost" id="m-search" style="width:auto">🔍 CHERCHER</button>
      </div>
    </div>
    <div class="brick">
      <div class="row between"><h2>PLAYLIST — ${st.count} PISTE${st.count > 1 ? 'S' : ''}</h2>
        <button class="btn sm ${st.shuffle ? 'solid' : 'ghost'}" id="m-shuffle">🔀 ${st.shuffle ? 'ON' : 'OFF'}</button>
      </div>
      <div class="playlist-grid" id="pl-list"></div>
    </div>`);
  const drawList = () => {
    const s = MP.getState();
    $('#pl-list', sh).innerHTML = s.playlist.length ? s.playlist.map((t, i) => `
      <div class="playlist-item ${i === s.currentIndex && s.isPlaying ? 'active' : ''}" data-i="${i}">
        <span class="pi-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="pi-info"><div class="pi-title">${esc(t.title)}</div><div class="pi-type">${t.type === 'youtube' ? '▶ YOUTUBE' : t.type === 'youtube-playlist' ? '▶ PLAYLIST' : '♪ AUDIO'}</div></div>
        <button class="pi-del" data-del="${i}" title="Supprimer">✕</button>
      </div>`).join('') : '<p class="mute">AUCUNE PISTE. AJOUTE UN LIEN CI-DESSUS.</p>';
  };
  drawList();
  MP.setOnStateChange(s => { drawList(); renderMusicMini(s); });
  $('#m-add', sh).onclick = async () => {
    const url = $('#m-url', sh).value.trim();
    if (!url) { toast('COLLE UN LIEN OU UN NOM'); return; }
    // Check if it's a playlist URL
    if (MP.extractPlaylistId && MP.extractPlaylistId(url)) {
      await MP.addPlaylist(url);
      toast('PLAYLIST AJOUTÉE 🎵');
    } else if (MP.extractYTId(url) || url.startsWith('http')) {
      MP.addTrack(url, $('#m-title', sh).value.trim());
      toast('PISTE AJOUTÉE 🎵');
    } else {
      // Treat as search query - open YouTube search
      window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(url), '_blank');
      toast('CHERCHE SUR YOUTUBE, COPIE LE LIEN');
      return;
    }
    $('#m-url', sh).value = ''; $('#m-title', sh).value = '';
    drawList();
  };
  $('#m-search', sh).onclick = () => {
    const q = $('#m-url', sh).value.trim();
    if (!q) { toast('TAPE UN NOM DE MUSIQUE'); return; }
    window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), '_blank');
    toast('COPIE LE LIEN DEPUIS YOUTUBE');
  };
  $('#m-shuffle', sh).onclick = () => { MP.toggleShuffle(); const s = MP.getState(); $('#m-shuffle', sh).textContent = `🔀 ${s.shuffle ? 'ON' : 'OFF'}`; $('#m-shuffle', sh).className = `btn sm ${s.shuffle ? 'solid' : 'ghost'}`; };
  sh.addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) { MP.removeTrack(+del.dataset.del); drawList(); return; }
    const item = e.target.closest('.playlist-item');
    if (item && !e.target.closest('.pi-del')) { MP.playTrack(+item.dataset.i); drawList(); }
  });
}

// ============================================================
// DÉMARRAGE
// ============================================================
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { });
window.go = go; window.goPanel = goPanel;

// Portrait lock
try { screen.orientation?.lock?.('portrait-primary').catch(() => {}); } catch {}

(async function boot() {
  applyTheme();
  offlinePill();
  if (location.hash) history.replaceState(null, '', location.pathname);
  if (LOCAL_MODE) {
    if (localStorage.getItem('rc_local_started')) {
      S.user = { id: 'local', email: 'local' };
      await dbLoadProfile(); await dbLoadLogs(); applyTheme();
      if (S.profile) { enterApp(); return; }
    }
    renderAuth();
    return;
  }
  await initSupabase();
  if (!sb) {
    const cachedUser = JSON.parse(localStorage.getItem('rc_last_user') || 'null');
    if (cachedUser) {
      S.user = cachedUser;
      await dbLoadProfile(); await dbLoadLogs(); applyTheme();
      if (S.profile) { toast('HORS-LIGNE — SYNC AU RETOUR'); enterApp(); return; }
    }
    document.body.insertAdjacentHTML('beforeend', `
      <div class="auth-wrap"><div class="inner"><div class="brick" style="text-align:center">
        <h2>SERVEUR INJOIGNABLE</h2>
        <p class="mute" style="margin:10px 0;font-weight:600">Réseau ou CDN indisponible. Réessaie une fois connecté.</p>
        <button class="btn" onclick="location.reload()">RÉESSAYER</button>
      </div></div></div>`);
    return;
  }
  const { data } = await sb.auth.getSession();
  if (data?.session) await onSignedIn(data.session.user);
  else renderAuth();
  sb.auth.onAuthStateChange((_e, session) => { if (session && !S.user) onSignedIn(session.user); });
})();

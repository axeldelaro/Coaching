// ============================================================
// RECOMP — Moteur de jeu « SYSTÈME » (inspiration Solo Leveling)
// XP déterministe + stats dérivées de l'activité réelle + points
// d'aptitude à répartir librement, rangs de Chasseur, PV/PM,
// classe évolutive, compétences, quêtes, duel d'ombre.
// ============================================================

window.RPG = (() => {
  const DAY = 86400000;
  const since = (day) => Math.round((Date.now() - new Date(day)) / DAY);

  // ---------- Barème XP ----------
  const XP = { workout: 120, set: 6, pr: 80, journal: 30, meals: 20 };

  function computeXP(logs) {
    const workouts = [...logs.filter(l => l.kind === 'workout')].sort((a, b) => a.day.localeCompare(b.day));
    let xp = 0, prCount = 0;
    const best = {};
    workouts.forEach(w => {
      const sets = w.payload.sets || [];
      xp += XP.workout + XP.set * sets.length;
      const beaten = new Set();
      sets.forEach(s => {
        const e = s.exoId ? window.EXLIB.find(x => x.id === s.exoId) : window.findExercise(s.ex);
        if (!e) return;
        const sc = (s.weight > 0 && s.reps > 0) ? s.weight * (1 + s.reps / 30) : (s.reps || 0);
        if (best[e.id] != null && sc > best[e.id]) beaten.add(e.id);
        best[e.id] = Math.max(best[e.id] ?? 0, sc);
      });
      prCount += beaten.size;
      xp += XP.pr * beaten.size;
    });
    xp += XP.journal * logs.filter(l => l.kind === 'journal').length;
    xp += XP.meals * logs.filter(l => l.kind === 'meals' && (l.payload.items || []).length >= 2).length;
    return { xp, prCount };
  }

  // ---------- Niveaux ----------
  // Coût du niveau n → n+1 : 220 + 90 × (n-1)
  const levelCost = n => 220 + 90 * (n - 1);
  function levelFromXP(xp) {
    let lvl = 1, rest = xp;
    while (rest >= levelCost(lvl)) { rest -= levelCost(lvl); lvl++; }
    return { lvl, into: rest, need: levelCost(lvl) };
  }

  // ---------- Rangs de Chasseur ----------
  const RANKS = [
    [1, 'E', '#7E8AA8'], [5, 'D', '#46C2FF'], [10, 'C', '#2BD9FE'],
    [15, 'B', '#7C6BFF'], [20, 'A', '#C16BFF'], [25, 'S', '#FFD66B']
  ];
  function rankFor(lvl) {
    let r = RANKS[0];
    for (const x of RANKS) if (lvl >= x[0]) r = x;
    return { letter: r[1], color: r[2] };
  }
  function nextRankLevel(lvl) {
    const n = RANKS.find(x => x[0] > lvl);
    return n ? n[0] : null;
  }

  // ---------- Stats de base (dérivées du réel) ----------
  // Cinq stats façon Système. Plancher 10 (humain de base), plafond 99.
  function baseStats(logs) {
    const workouts = logs.filter(l => l.kind === 'workout');
    const journal = logs.filter(l => l.kind === 'journal');
    const meals = logs.filter(l => l.kind === 'meals' && (l.payload.items || []).length >= 2);
    const allSets = workouts.flatMap(w => w.payload.sets || []);
    let forceVol = 0, reps = 0, cardioSets = 0, rpeLogged = 0, prCount = 0;
    const best = {};
    [...workouts].sort((a, b) => a.day.localeCompare(b.day)).forEach(w => {
      (w.payload.sets || []).forEach(s => {
        const e = s.exoId ? window.EXLIB.find(x => x.id === s.exoId) : window.findExercise(s.ex);
        reps += +s.reps || 0;
        if (+s.rpe > 0) rpeLogged++;
        if (e && e.group === 'Cardio') cardioSets++;
        else forceVol += (s.weight || 0) * (s.reps || 0);
        if (e) {
          const sc = (s.weight > 0 && s.reps > 0) ? s.weight * (1 + s.reps / 30) : (s.reps || 0);
          if (best[e.id] != null && sc > best[e.id]) prCount++;
          best[e.id] = Math.max(best[e.id] ?? 0, sc);
        }
      });
    });
    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
      if (journal.find(j => j.day === d)) streak++; else break;
    }
    const cap = v => Math.max(10, Math.min(99, Math.round(v)));
    return {
      FOR: cap(10 + forceVol / 1500 + prCount * 2),
      AGI: cap(10 + reps / 40 + cardioSets * 2),
      VIT: cap(10 + workouts.length * 2 + forceVol / 4500),
      INT: cap(10 + journal.length + meals.length),
      PER: cap(10 + rpeLogged / 3 + streak * 2)
    };
  }

  const STAT_KEYS = ['FOR', 'AGI', 'VIT', 'INT', 'PER'];
  const STAT_LABEL = { FOR: 'FORCE', AGI: 'AGILITÉ', VIT: 'VITALITÉ', INT: 'INTELLIGENCE', PER: 'PERCEPTION' };

  // ---------- Points d'aptitude ----------
  const pointsEarned = lvl => (lvl - 1) * 3;               // 3 points par niveau
  function pointsSpent(profile) {
    const a = profile?.allocated || {};
    return STAT_KEYS.reduce((s, k) => s + (+a[k] || 0), 0);
  }

  function totalStats(logs, profile) {
    const base = baseStats(logs);
    const a = profile?.allocated || {};
    const total = {};
    STAT_KEYS.forEach(k => { total[k] = Math.min(99, base[k] + (+a[k] || 0)); });
    return { base, allocated: a, total };
  }

  // ---------- Vitalité dérivée (PV / PM / Endurance) ----------
  function vitals(total) {
    return {
      hp: 100 + total.VIT * 12,
      mp: 50 + total.INT * 8,
      stamina: 50 + (total.VIT + total.AGI) * 4
    };
  }

  // ---------- Classe (selon stat dominante + niveau) ----------
  function job(lvl, total) {
    const entries = STAT_KEYS.map(k => [k, total[k]]);
    entries.sort((a, b) => b[1] - a[1]);
    const [domK, domV] = entries[0];
    const minV = entries[entries.length - 1][1];
    if (domV - minV <= 4) return 'Chasseur Polyvalent';
    const tier = lvl < 10 ? 0 : (lvl < 20 ? 1 : 2);
    const lines = {
      FOR: ['Combattant', 'Berserker', 'Monarque de Fer'],
      AGI: ['Rôdeur', 'Assassin', 'Monarque des Ombres'],
      VIT: ['Sentinelle', 'Colosse', 'Forteresse Vivante'],
      INT: ['Apprenti', 'Mage', 'Archimage'],
      PER: ['Éclaireur', 'Traqueur', 'Œil du Système']
    };
    return lines[domK][tier];
  }

  // ---------- Compétences débloquées ----------
  function skills(h) {
    const defs = [
      { id: 'sk-strike', name: 'Frappe Basique', desc: 'Tu as rejoint le Système.', need: () => true },
      { id: 'sk-endure', name: 'Endurance du Chasseur', desc: 'Série de 3 jours de carnet.', need: () => h.streak >= 3 },
      { id: 'sk-breaker', name: 'Briseur de Limites', desc: '5 records personnels battus.', need: () => h.prCount >= 5 },
      { id: 'sk-rankD', name: 'Régénération Rapide', desc: 'Atteindre le rang D (niveau 5).', need: () => h.lvl >= 5 },
      { id: 'sk-iron', name: 'Corps de Fer', desc: 'FORCE ≥ 25.', need: () => h.total.FOR >= 25 },
      { id: 'sk-rankC', name: 'Domaine du Combattant', desc: 'Atteindre le rang C (niveau 10).', need: () => h.lvl >= 10 },
      { id: 'sk-swift', name: 'Pas de l\'Ombre', desc: 'AGILITÉ ≥ 25.', need: () => h.total.AGI >= 25 },
      { id: 'sk-volume', name: 'Porteur de Charges', desc: '50 000 kg de volume cumulé.', need: () => h.volume >= 50000 },
      { id: 'sk-rankB', name: 'Aura de Monarque', desc: 'Atteindre le rang B (niveau 15).', need: () => h.lvl >= 15 },
      { id: 'sk-monarch', name: 'Éveil du Souverain', desc: 'Atteindre le rang S (niveau 25).', need: () => h.lvl >= 25 }
    ];
    return defs.map(d => ({ ...d, unlocked: d.need() }));
  }

  // ---------- Fiche complète du Chasseur ----------
  function hunter(logs, profile) {
    const { xp, prCount } = computeXP(logs);
    const { lvl, into, need } = levelFromXP(xp);
    const { base, allocated, total } = totalStats(logs, profile);
    const workouts = logs.filter(l => l.kind === 'workout');
    const allSets = workouts.flatMap(w => w.payload.sets || []);
    const volume = allSets.reduce((x, s) => x + (s.weight || 0) * (s.reps || 0), 0);
    const journal = logs.filter(l => l.kind === 'journal');
    let streak = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
      if (journal.find(j => j.day === d)) streak++; else break;
    }
    const v = vitals(total);
    const rank = rankFor(lvl);
    const h = {
      xp, lvl, into, need, prCount, volume, streak,
      workouts: workouts.length, sets: allSets.length,
      base, allocated, total,
      pointsAvailable: Math.max(0, pointsEarned(lvl) - pointsSpent(profile)),
      pointsEarned: pointsEarned(lvl),
      hp: v.hp, mp: v.mp, stamina: v.stamina,
      rank: rank.letter, rankColor: rank.color, nextRank: nextRankLevel(lvl),
      job: job(lvl, total),
      // compat ascendante (anciens noms)
      title: job(lvl, total),
      stats: total
    };
    h.skills = skills(h);
    return h;
  }

  // ---------- Quêtes journalières (adaptées, sans coercition) ----------
  function dailyQuests(logs, profile) {
    const t = new Date().toISOString().slice(0, 10);
    const w = logs.find(l => l.kind === 'workout' && l.day === t);
    const j = logs.find(l => l.kind === 'journal' && l.day === t);
    const m = logs.find(l => l.kind === 'meals' && l.day === t);
    const kcal = (m?.payload.items || []).reduce((s, id) => s + (window.RECIPES.find(r => r.id === id)?.kcal || 0), 0);
    const target = profile?.targets?.kcal || 0;
    return [
      { id: 'q-train', t: 'Faire ta séance du jour', xp: XP.workout, done: !!w },
      { id: 'q-journal', t: 'Remplir ton journal du jour', xp: XP.journal, done: !!j && (j.payload.weight || j.payload.sleep || j.payload.energy) },
      { id: 'q-meals', t: 'Enregistrer ≥ 2 repas', xp: XP.meals, done: (m?.payload.items || []).length >= 2 },
      { id: 'q-kcal', t: 'Rester proche de ta cible calorique (±10 %)', xp: 25, done: target > 0 && kcal > 0 && Math.abs(kcal - target) <= target * 0.1 }
    ];
  }

  function weeklyQuests(logs, profile) {
    const goal = +profile?.anamnese?.days || 2;
    const w7 = logs.filter(l => l.kind === 'workout' && since(l.day) < 7).length;
    const weigh = logs.filter(l => l.kind === 'journal' && +l.payload.weight > 0 && since(l.day) < 7).length;
    const { prCount } = computeXP(logs.filter(l => since(l.day) < 7));
    return [
      { id: 'w-sessions', t: `${goal} séances cette semaine`, xp: 150, done: w7 >= goal, prog: `${w7}/${goal}` },
      { id: 'w-weigh', t: '4 pesées cette semaine', xp: 60, done: weigh >= 4, prog: `${Math.min(weigh, 4)}/4` },
      { id: 'w-pr', t: 'Battre 1 record', xp: 100, done: prCount >= 1, prog: prCount >= 1 ? '1/1' : '0/1' }
    ];
  }

  // ---------- Duel d'ombre : TOI vs TON OMBRE (toi il y a 7 j) ----------
  function weeklyFight(logs, profile) {
    const cur = { vol: 0, sets: 0, sessions: 0 };
    const old = { vol: 0, sets: 0, sessions: 0 };
    logs.filter(l => l.kind === 'workout').forEach(w => {
      const d = since(w.day);
      const tgt = d < 7 ? cur : (d < 14 ? old : null);
      if (!tgt) return;
      tgt.sessions++;
      (w.payload.sets || []).forEach(s => { tgt.sets++; tgt.vol += (s.weight || 0) * (s.reps || 0); });
    });
    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    const wNow = avg(logs.filter(l => l.kind === 'journal' && +l.payload.weight > 0 && since(l.day) < 7).map(l => +l.payload.weight));
    const wOld = avg(logs.filter(l => l.kind === 'journal' && +l.payload.weight > 0 && since(l.day) >= 7 && since(l.day) < 14).map(l => +l.payload.weight));
    const score = (cur.vol > old.vol ? 1 : 0) + (cur.sessions >= old.sessions && cur.sessions > 0 ? 1 : 0) + (cur.sets > old.sets ? 1 : 0);
    const verdict = old.sessions === 0 && old.vol === 0
      ? { code: 'first', txt: 'PREMIER DUEL — RÉVÈLE TA PUISSANCE' }
      : score >= 2 ? { code: 'win', txt: 'TU DOMINES TON OMBRE' }
        : score === 1 ? { code: 'draw', txt: 'COMBAT SERRÉ — ÉGALITÉ' }
          : { code: 'lose', txt: 'TON OMBRE MÈNE — RELÈVE-TOI' };
    return { cur, old, wNow, wOld, verdict };
  }

  return {
    XP, computeXP, levelFromXP, rankFor, nextRankLevel,
    baseStats, totalStats, vitals, job, skills, hunter,
    fighter: hunter, // alias compat
    dailyQuests, weeklyQuests, weeklyFight,
    STAT_KEYS, STAT_LABEL, pointsEarned
  };
})();

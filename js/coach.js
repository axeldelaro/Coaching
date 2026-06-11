// ============================================================
// RECOMP — Coach expert v2
// Signaux → conseils priorisés · adaptation de séance ·
// analyse hebdomadaire complète · chat avec recherche KB
// ============================================================

window.Coach = (() => {

  const DAY = 86400000;
  const today = () => new Date().toISOString().slice(0, 10);
  const daysAgo = (d1, d2) => Math.round((new Date(d1) - new Date(d2)) / DAY);
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // ---------- Signaux ----------
  function signals(logs, profile) {
    const t = today();
    const workouts = logs.filter(l => l.kind === 'workout').sort((a, b) => b.day.localeCompare(a.day));
    const journal = logs.filter(l => l.kind === 'journal').sort((a, b) => b.day.localeCompare(a.day));

    const lastWorkout = workouts[0] || null;
    const daysSinceWorkout = lastWorkout ? daysAgo(t, lastWorkout.day) : null;
    const workouts7 = workouts.filter(w => daysAgo(t, w.day) < 7).length;
    const workouts28 = workouts.filter(w => daysAgo(t, w.day) < 28).length;

    let lastRpe = null;
    if (lastWorkout?.payload.sets) {
      const r = lastWorkout.payload.sets.map(s => +s.rpe).filter(n => n > 0);
      if (r.length) lastRpe = avg(r);
    }

    const sleepAvg3 = avg(journal.slice(0, 3).map(j => +j.payload.sleep).filter(n => n > 0));
    const todayJ = journal.find(j => j.day === t);
    const energy = todayJ ? +todayJ.payload.energy || null : null;

    const weights = journal.filter(j => +j.payload.weight > 0).map(j => ({ day: j.day, w: +j.payload.weight }));
    const w7 = avg(weights.filter(x => daysAgo(t, x.day) < 7).map(x => x.w));
    const w14 = avg(weights.filter(x => { const d = daysAgo(t, x.day); return d >= 7 && d < 14; }).map(x => x.w));
    const weightDelta = (w7 != null && w14 != null) ? w7 - w14 : null;

    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
      if (journal.find(j => j.day === d)) streak++; else break;
    }

    // Corrélation sommeil ↔ performance : RPE moyen des séances selon le sommeil de la veille
    const rpeBySleep = { short: [], good: [] };
    workouts.forEach(w => {
      const prev = new Date(+new Date(w.day) - DAY).toISOString().slice(0, 10);
      const j = journal.find(x => x.day === prev || x.day === w.day);
      const sl = j ? +j.payload.sleep : null;
      const r = avg((w.payload.sets || []).map(s => +s.rpe).filter(n => n > 0));
      if (sl && r) (sl < 6.5 ? rpeBySleep.short : rpeBySleep.good).push(r);
    });
    const sleepEffect = (rpeBySleep.short.length >= 2 && rpeBySleep.good.length >= 2)
      ? avg(rpeBySleep.short) - avg(rpeBySleep.good) : null;

    return { daysSinceWorkout, workouts7, workouts28, lastRpe, sleepAvg3, energy, weightDelta, wNow: w7, streak, lastWorkout, sleepEffect };
  }

  // ---------- Conseils du jour ----------
  function dailyAdvice(logs, profile) {
    const s = signals(logs, profile);
    const goal = profile?.anamnese?.goal || 'perte';
    const out = [];

    if (s.daysSinceWorkout === null)
      out.push({ icon: '🚀', level: 'info', text: "Première séance à enregistrer ! Lance-la depuis l'onglet Entraîner — chaque série notée affine mes analyses (records, volume, fatigue)." });
    else if (s.daysSinceWorkout >= 4)
      out.push({ icon: '⏰', level: 'warn', text: `${s.daysSinceWorkout} jours sans séance. Reprise intelligente : -1 série partout, RPE plafonné à 7. L'objectif est de relancer le stimulus, pas de compenser.` });

    if (s.lastRpe != null && s.lastRpe >= 9)
      out.push({ icon: '🛑', level: 'warn', text: `RPE moyen ${s.lastRpe.toFixed(1)} sur ta dernière séance : tu travailles trop près de l'échec. Aujourd'hui, garde 2–3 reps en réserve — la littérature montre les mêmes gains avec moins de fatigue accumulée.` });

    if (s.sleepAvg3 != null && s.sleepAvg3 < 6.5)
      out.push({ icon: '😴', level: 'warn', text: `Sommeil moyen ${s.sleepAvg3.toFixed(1)} h sur 3 jours. La privation réduit la synthèse protéique de ~18 % et la force du lendemain. Volume -1 série partout + coucher avancé de 30 min.` });

    if (s.sleepEffect != null && s.sleepEffect > 0.7)
      out.push({ icon: '🔬', level: 'info', text: `Donnée intéressante dans TON historique : tes séances après une nuit courte sortent à RPE +${s.sleepEffect.toFixed(1)} en moyenne. Ton sommeil est ton premier supplément.` });

    if (s.energy != null && s.energy <= 2)
      out.push({ icon: '🔋', level: 'warn', text: "Énergie au plus bas aujourd'hui. Plan B validé : 50 % du volume prévu, ou 30 min de marche rapide. Les deux entretiennent l'habitude — c'est elle qui produit les résultats à 4 semaines." });

    if (s.weightDelta != null && goal === 'perte') {
      if (s.weightDelta > -0.1 && s.weightDelta < 0.3)
        out.push({ icon: '⚖️', level: 'info', text: `Poids stable sur 2 semaines (${s.weightDelta >= 0 ? '+' : ''}${s.weightDelta.toFixed(1)} kg). Protocole anti-plateau : +2 000 pas/jour pendant 7 jours AVANT de toucher aux calories. Le NEAT d'abord, le déficit ensuite.` });
      else if (s.weightDelta <= -1.2)
        out.push({ icon: '⚠️', level: 'warn', text: `Perte rapide : ${s.weightDelta.toFixed(1)} kg/semaine. Au-delà de ~1 % du poids corporel, le risque de fonte musculaire grimpe. Ajoute 150 kcal de glucides autour de tes séances.` });
      else if (s.weightDelta < -0.1)
        out.push({ icon: '✅', level: 'good', text: `Tendance ${s.weightDelta.toFixed(1)} kg sur 7 jours : rythme optimal pour perdre du gras en gardant le muscle. On ne touche à rien.` });
    }

    if (s.streak >= 3)
      out.push({ icon: '🔥', level: 'good', text: `${s.streak} jours de carnet d'affilée. Plus tu loggues, plus mes analyses sont précises — sommeil, RPE et poids commencent à raconter une histoire.` });

    if (s.workouts7 >= 2 && s.daysSinceWorkout <= 2 && (s.lastRpe == null || s.lastRpe < 9))
      out.push({ icon: '💪', level: 'good', text: `${s.workouts7} séances cette semaine, intensité maîtrisée. Consigne de surcharge : +1 répétition sur les 2 premiers exercices de ta prochaine séance.` });

    if (!out.length)
      out.push({ icon: '🎯', level: 'info', text: "Tout est dans les clous. Concentre-toi sur l'exécution : tempo respecté, amplitude complète, RPE noté à chaque série." });

    return out.slice(0, 3);
  }

  // ---------- Adaptation de séance ----------
  function adaptSession(session, logs, profile) {
    const s = signals(logs, profile);
    let factor = 1, capRpe = null, reasons = [];
    if (s.sleepAvg3 != null && s.sleepAvg3 < 6.5) { factor -= 0.25; reasons.push('sommeil court'); }
    if (s.energy != null && s.energy <= 2) { factor -= 0.25; reasons.push('énergie basse'); }
    if (s.lastRpe != null && s.lastRpe >= 9) { capRpe = 7; reasons.push('RPE élevé récemment'); }
    if (s.daysSinceWorkout != null && s.daysSinceWorkout >= 5) { factor -= 0.2; capRpe = 7; reasons.push('reprise après pause'); }
    factor = Math.max(0.5, factor);

    const adapted = JSON.parse(JSON.stringify(session));
    adapted.exercises.forEach(ex => {
      ex.sets = Math.max(2, Math.round(ex.sets * factor));
      if (capRpe) ex.rpe = `≤ ${capRpe}`;
    });
    return {
      session: adapted,
      changed: factor < 1 || capRpe !== null,
      summary: reasons.length
        ? `Séance auto-régulée (${reasons.join(', ')}) : volume ×${Math.round(factor * 100)} %${capRpe ? `, RPE plafonné à ${capRpe}` : ''}.`
        : "Aucun signal de fatigue : séance complète. Objectif du jour : +1 rép vs la dernière fois."
    };
  }

  // ---------- Analyse hebdomadaire complète ----------
  function analyze(logs, profile) {
    const s = signals(logs, profile);
    const t = today();
    const week = logs.filter(l => l.kind === 'workout' && daysAgo(t, l.day) < 7);
    const allSets = week.flatMap(w => w.payload.sets || []);
    const volume = allSets.reduce((x, set) => x + (set.weight || 0) * (set.reps || 0), 0);
    const rpes = allSets.map(x => +x.rpe).filter(Boolean);

    // Volume par groupe musculaire (via la bibliothèque)
    const byGroup = {};
    allSets.forEach(set => {
      const exo = set.exoId ? window.EXLIB.find(e => e.id === set.exoId) : window.findExercise(set.ex);
      const g = exo?.group || 'Autre';
      byGroup[g] = (byGroup[g] || 0) + 1;
    });

    const sections = [];
    sections.push({
      title: '📊 Charge de la semaine',
      lines: [
        `Séances : ${week.length}/${profile?.anamnese?.days || 2} · Séries : ${allSets.length} · Volume : ${Math.round(volume).toLocaleString('fr-FR')} kg`,
        rpes.length ? `Intensité moyenne : RPE ${avg(rpes).toFixed(1)} ${avg(rpes) > 8.5 ? '→ trop proche de l\'échec, vise 7–8' : avg(rpes) < 6 ? '→ marge énorme, tu peux pousser' : '→ zone productive 👌'}` : 'Intensité : note tes RPE pour activer cette analyse.',
        Object.keys(byGroup).length ? 'Répartition : ' + Object.entries(byGroup).sort((a, b) => b[1] - a[1]).map(([g, n]) => `${g} ${n}`).join(' · ') : ''
      ].filter(Boolean)
    });

    const recov = [];
    if (s.sleepAvg3 != null) recov.push(`Sommeil (3 j) : ${s.sleepAvg3.toFixed(1)} h ${s.sleepAvg3 >= 7 ? '✅' : '⚠️ sous les 7 h recommandées'}`);
    if (s.sleepEffect != null) recov.push(`Effet mesuré chez TOI : nuits courtes = RPE +${s.sleepEffect.toFixed(1)} à effort égal.`);
    if (s.streak) recov.push(`Régularité du carnet : ${s.streak} jours d'affilée.`);
    if (recov.length) sections.push({ title: '🛌 Récupération', lines: recov });

    const nut = [];
    if (s.wNow != null) nut.push(`Poids moyen 7 j : ${s.wNow.toFixed(1)} kg${s.weightDelta != null ? ` (${s.weightDelta >= 0 ? '+' : ''}${s.weightDelta.toFixed(1)} vs sem. précédente)` : ''}`);
    if (s.weightDelta != null) {
      const goal = profile?.anamnese?.goal || 'perte';
      if (goal === 'perte') nut.push(s.weightDelta < -0.1 && s.weightDelta > -1.2 ? 'Rythme de perte idéal : muscle préservé.' : s.weightDelta <= -1.2 ? '⚠️ Perte trop rapide : +150 kcal de glucides péri-training.' : 'Plateau : +2 000 pas/jour cette semaine avant tout ajustement calorique.');
    } else nut.push('Pèse-toi 4+ matins/semaine pour activer l\'analyse de tendance.');
    sections.push({ title: '⚖️ Tendance corporelle', lines: nut });

    // Recommandations finales
    const reco = [];
    if (week.length < (profile?.anamnese?.days || 2)) reco.push(`Priorité n°1 : sécuriser tes ${profile?.anamnese?.days || 2} séances. Le déficit ne préserve le muscle que si le stimulus est présent.`);
    else reco.push('Objectif : +1 répétition sur chaque exercice cette semaine (surcharge progressive).');
    if (s.sleepAvg3 != null && s.sleepAvg3 < 7) reco.push('Avance ton coucher de 30 min : meilleur retour sur investissement disponible.');
    if ((byGroup['Poussée'] || 0) === 0 && week.length > 0) reco.push('Aucune série de poussée cette semaine — vérifie la consigne dips/pompes surélevées (protocole clavicule).');
    sections.push({ title: '🎯 Plan de la semaine', lines: reco });

    return sections;
  }

  // ---------- Chat : recherche dans la base de connaissances ----------
  const SYNONYMS = [
    [/\bmal\b|\bdouloureux\w*\b|\bfait mal\b/g, 'douleur'],
    [/\bdor[st]\b|\bdormi\w*\b|\binsomnie\w*\b|\bnuits? courtes?\b/g, 'sommeil'],
    [/\bstagn\w*\b|\bplafonn\w*\b|\bbloqu\w*\b|\bprogresse plus\b/g, 'plateau'],
    [/\bmaigri\w*\b|\bmincir\b|\bperdre du poids\b/g, 'perdre gras'],
    [/\bgrossi\w*\b/g, 'prise poids'],
    [/\bcrampe\w*\b|\bcourbatur\w*\b/g, 'courbatures'],
    [/\bfatigu\w*\b|\bcreve\w*\b|\bepuis\w*\b/g, 'fatigue recuperation'],
    [/\bbouffe\w*\b|\bmanger\b|\brepas\b/g, 'nutrition manger'],
    [/\bcomplement\w*\b/g, 'supplement']
  ];
  function ask(text) {
    let q = norm(text);
    SYNONYMS.forEach(([re, rep]) => { q = q.replace(re, rep); });
    if (q.length < 3) return null;
    let best = null, bestScore = 0;
    window.KB.forEach(k => {
      let score = 0;
      k.keys.forEach(key => {
        const nk = norm(key);
        if (!q.includes(nk)) return;
        if (nk.length >= 5) score += 2;                                   // mot-clé spécifique
        else score += new RegExp('\\b' + nk + '\\b').test(q) ? 2 : 1;     // acronyme/mot court entier
      });
      const qWords = norm(k.q).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/);
      if (qWords.filter(w => w.length > 4 && q.includes(w)).length) score += 1;
      if (score > bestScore) { bestScore = score; best = k; }
    });
    return bestScore >= 2 ? best : null;
  }

  function related(entry) {
    return (entry.rel || []).map(id => window.KB.find(k => k.id === id)).filter(Boolean);
  }

  function tipOfDay() {
    const n = Math.floor(Date.now() / DAY);
    return window.TIPS[n % window.TIPS.length];
  }

  return { signals, dailyAdvice, adaptSession, analyze, ask, related, tipOfDay };
})();

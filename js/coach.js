// ============================================================
// RECOMP — Coach scripté (moteur de règles hors-ligne)
// Analyse les logs (séances, carnet, repas) et produit des
// conseils priorisés + réponses aux intentions du chat.
// ============================================================

window.Coach = (() => {

  const DAY = 86400000;
  const today = () => new Date().toISOString().slice(0, 10);
  const daysAgo = (d1, d2) => Math.round((new Date(d1) - new Date(d2)) / DAY);

  // --- Extraction de signaux depuis les logs --------------------------------
  function signals(logs, profile) {
    const t = today();
    const workouts = logs.filter(l => l.kind === 'workout').sort((a, b) => b.day.localeCompare(a.day));
    const journal = logs.filter(l => l.kind === 'journal').sort((a, b) => b.day.localeCompare(a.day));

    const lastWorkout = workouts[0] || null;
    const daysSinceWorkout = lastWorkout ? daysAgo(t, lastWorkout.day) : null;
    const workouts7 = workouts.filter(w => daysAgo(t, w.day) < 7).length;

    // RPE moyen de la dernière séance
    let lastRpe = null;
    if (lastWorkout && lastWorkout.payload.sets) {
      const rpes = lastWorkout.payload.sets.map(s => +s.rpe).filter(n => n > 0);
      if (rpes.length) lastRpe = rpes.reduce((a, b) => a + b, 0) / rpes.length;
    }

    // Sommeil moyen 3 derniers jours
    const sleeps = journal.slice(0, 3).map(j => +j.payload.sleep).filter(n => n > 0);
    const sleepAvg = sleeps.length ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : null;

    // Énergie du jour
    const todayJ = journal.find(j => j.day === t);
    const energy = todayJ ? +todayJ.payload.energy || null : null;

    // Tendance de poids : moyenne 7 j vs 7 j précédents
    const weights = journal.filter(j => +j.payload.weight > 0)
      .map(j => ({ day: j.day, w: +j.payload.weight }));
    const w7 = weights.filter(x => daysAgo(t, x.day) < 7).map(x => x.w);
    const w14 = weights.filter(x => { const d = daysAgo(t, x.day); return d >= 7 && d < 14; }).map(x => x.w);
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
    const wNow = avg(w7), wPrev = avg(w14);
    const weightDelta = (wNow != null && wPrev != null) ? wNow - wPrev : null;

    // Régularité du carnet
    const streak = (() => {
      let s = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(Date.now() - i * DAY).toISOString().slice(0, 10);
        if (journal.find(j => j.day === d)) s++; else break;
      }
      return s;
    })();

    return { daysSinceWorkout, workouts7, lastRpe, sleepAvg, energy, weightDelta, wNow, streak, lastWorkout };
  }

  // --- Conseils du jour (priorisés) -----------------------------------------
  function dailyAdvice(logs, profile) {
    const s = signals(logs, profile);
    const goal = profile?.anamnese?.goal || 'perte';
    const out = [];

    if (s.daysSinceWorkout === null)
      out.push({ icon: '🚀', level: 'info', text: "Première séance à enregistrer ! Lance la Séance A depuis l'onglet Entraînement — je calibrerai mes conseils sur tes RPE." });
    else if (s.daysSinceWorkout >= 4)
      out.push({ icon: '⏰', level: 'warn', text: `${s.daysSinceWorkout} jours sans séance. Reprends léger aujourd'hui : -1 série partout, RPE plafonné à 7. L'objectif est de relancer la machine, pas de rattraper.` });

    if (s.lastRpe != null && s.lastRpe >= 9)
      out.push({ icon: '🛑', level: 'warn', text: `RPE moyen de ta dernière séance : ${s.lastRpe.toFixed(1)}. Tu flirtes avec l'échec systématique. Aujourd'hui : garde 2–3 reps en réserve (RIR 2–3) pour préserver la récupération.` });

    if (s.sleepAvg != null && s.sleepAvg < 6.5)
      out.push({ icon: '😴', level: 'warn', text: `Sommeil moyen ${s.sleepAvg.toFixed(1)} h sur 3 jours. Réduis le volume de 1 série par exercice et avance ton coucher de 30 min : la récupération nerveuse prime.` });

    if (s.energy != null && s.energy <= 2)
      out.push({ icon: '🔋', level: 'warn', text: "Énergie au plus bas aujourd'hui. Option A : séance allégée (50 % du volume). Option B : 30 min de marche rapide. Les deux valent mieux que zéro ou que se cramer." });

    if (s.weightDelta != null && goal === 'perte') {
      if (s.weightDelta > -0.1 && s.weightDelta < 0.3)
        out.push({ icon: '⚖️', level: 'info', text: `Poids stable sur 2 semaines (${s.weightDelta >= 0 ? '+' : ''}${s.weightDelta.toFixed(1)} kg). Avant de couper des calories : +2 000 pas/jour pendant 1 semaine. Si toujours stable, on retirera 100 kcal.` });
      else if (s.weightDelta <= -1.5)
        out.push({ icon: '⚠️', level: 'warn', text: `Perte rapide (${s.weightDelta.toFixed(1)} kg/sem). Au-delà de ~1 % du poids/semaine, tu risques de perdre du muscle. Ajoute 150 kcal de glucides autour de l'entraînement.` });
      else if (s.weightDelta < -0.1)
        out.push({ icon: '✅', level: 'good', text: `Tendance : ${s.weightDelta.toFixed(1)} kg sur la semaine. Rythme idéal pour préserver le muscle. On ne change rien.` });
    }

    if (s.streak >= 3)
      out.push({ icon: '🔥', level: 'good', text: `${s.streak} jours de carnet d'affilée. C'est cette donnée qui rend mes ajustements précis — continue.` });

    if (s.workouts7 >= 2 && s.daysSinceWorkout <= 2 && (s.lastRpe == null || s.lastRpe < 9))
      out.push({ icon: '💪', level: 'good', text: `${s.workouts7} séances cette semaine, intensité maîtrisée. Cette semaine, vise +1 répétition sur tes 2 premiers exercices.` });

    if (!out.length)
      out.push({ icon: '🎯', level: 'info', text: "Tout est dans les clous. Concentre-toi sur l'exécution : tempo respecté, amplitude complète, RPE noté à chaque série." });

    return out.slice(0, 3);
  }

  // --- Adaptation de séance ---------------------------------------------------
  function adaptSession(session, logs, profile) {
    const s = signals(logs, profile);
    let factor = 1, capRpe = null, reasons = [];
    if (s.sleepAvg != null && s.sleepAvg < 6.5) { factor -= 0.25; reasons.push('sommeil court'); }
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
        ? `Séance ajustée (${reasons.join(', ')}) : volume ×${Math.round(factor * 100)} %${capRpe ? `, RPE plafonné à ${capRpe}` : ''}.`
        : "Aucun signal de fatigue : séance complète, vise +1 rép vs la dernière fois."
    };
  }

  // --- Intentions du chat -----------------------------------------------------
  const INTENTS = [
    { id: 'adapt', label: '🎚️ Adapter ma séance du jour' },
    { id: 'pain', label: '🩹 J\'ai une douleur' },
    { id: 'motivation', label: '😮‍💨 Je manque de motivation' },
    { id: 'food', label: '🍽️ Conseil nutrition' },
    { id: 'bilan', label: '📊 Bilan de la semaine' },
    { id: 'tip', label: '💡 Tip du jour' }
  ];

  function reply(intentId, logs, profile) {
    const s = signals(logs, profile);
    const t = profile?.targets || {};
    switch (intentId) {
      case 'pain':
        return "Règle absolue : une douleur articulaire > 3/10 pendant un exercice = on arrête cet exercice aujourd'hui.\n\n1. Localise : articulation (stop + remplacer) ou muscle (souvent OK si < 3/10).\n2. Remplace par la variante proposée dans l'éditeur (bouton ↔ sur l'exercice).\n3. Épaule/clavicule : zéro poussée au-dessus de 90°, bascule sur pompes surélevées.\n4. Si la douleur persiste 7 jours ou au repos → consulte un professionnel de santé. Je suis un coach, pas un médecin.";
      case 'motivation':
        return "Stratégie validée par la recherche comportementale : réduis l'objectif, pas l'habitude.\n\n→ Aujourd'hui, ta seule mission : faire les 2 PREMIERS exercices de la séance. C'est tout.\n\nDans 80 % des cas tu finiras la séance entière une fois lancé. Et si tu t'arrêtes après 2 exercices, c'est une séance validée quand même : la constance bat l'intensité sur 4 semaines."
        + (s.streak >= 2 ? `\n\nEt rappelle-toi : ${s.streak} jours de suivi d'affilée. Ne casse pas la chaîne.` : '');
      case 'food':
        return `Tes cibles du jour : ${t.kcal || '—'} kcal · ${t.p || '—'} g protéines · ${t.c || '—'} g glucides · ${t.f || '—'} g lipides.\n\nPriorités dans l'ordre :\n1. Atteindre les protéines (≥ 25 g par repas).\n2. Caler les glucides autour de la séance (avant/après).\n3. Le reste est de la flexibilité — aucun aliment n'est interdit, c'est le total qui compte.\n\nVa dans l'onglet Repas pour composer ta journée avec les recettes : la liste de courses se génère toute seule.`;
      case 'bilan': {
        const lines = [`📊 7 derniers jours :`,
          `• Séances : ${s.workouts7}/2 prévues`,
          s.wNow != null ? `• Poids moyen : ${s.wNow.toFixed(1)} kg${s.weightDelta != null ? ` (${s.weightDelta >= 0 ? '+' : ''}${s.weightDelta.toFixed(1)} kg vs sem. précédente)` : ''}` : `• Poids : pèse-toi pour activer le suivi`,
          s.sleepAvg != null ? `• Sommeil moyen : ${s.sleepAvg.toFixed(1)} h` : `• Sommeil : non renseigné`,
          `• Carnet : ${s.streak} jours d'affilée`];
        const verdict = s.workouts7 >= 2 && (s.weightDelta == null || s.weightDelta < 0)
          ? "\n✅ Semaine solide. Consigne : +1 répétition sur chaque exercice cette semaine."
          : "\n🎯 Axe de la semaine : sécurise tes 2 séances avant tout le reste. Le déficit ne préserve le muscle que si le stimulus est là.";
        return lines.join('\n') + verdict;
      }
      case 'tip':
        return '💡 ' + window.TIPS[Math.floor(Math.random() * window.TIPS.length)];
      default:
        return null; // 'adapt' est géré par l'app (rendu interactif)
    }
  }

  function tipOfDay() {
    const n = Math.floor(Date.now() / DAY);
    return window.TIPS[n % window.TIPS.length];
  }

  return { signals, dailyAdvice, adaptSession, reply, INTENTS, tipOfDay };
})();

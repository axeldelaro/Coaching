// ============================================================
// RECOMP — Données embarquées
// Programme par défaut (modulable), recettes, tips du jour
// ============================================================

// --- Programme par défaut --------------------------------------------------
// Conçu pour : haltères 2×16 kg + chaise romaine + barre de traction.
// Adapté automatiquement à l'anamnèse (blessures, matériel) lors de l'onboarding.
window.DEFAULT_PROGRAM = {
  name: 'Recomposition 4 semaines',
  weeks: 4,
  note: "Surcharge progressive : +1 rép par série chaque semaine à RPE constant, puis +charge quand le haut de fourchette est atteint.",
  sessions: [
    {
      id: 'A',
      name: 'Séance A — Bas du corps & abdos',
      exercises: [
        { id: 'a1', name: 'Goblet squat (haltère 16 kg)', sets: 4, reps: '10–12', tempo: '3010', rest: 90, rpe: '7–8',
          cue: "Haltère vertical contre le sternum, coudes sous la charge. Descente 3 s, talons ancrés, genoux dans l'axe des orteils." },
        { id: 'a2', name: 'Fentes arrière alternées (2×16 kg)', sets: 3, reps: '10/jambe', tempo: '2010', rest: 90, rpe: '7',
          cue: "Pas arrière contrôlé, tibia avant vertical, bassin neutre. Poussée talon avant." },
        { id: 'a3', name: 'Soulevé de terre roumain haltères', sets: 4, reps: '10', tempo: '3110', rest: 90, rpe: '7–8',
          cue: "Hanches en arrière, dos neutre, haltères au contact des cuisses. Étirement ischio net, pause 1 s en bas." },
        { id: 'a4', name: 'Extensions lombaires (chaise romaine)', sets: 3, reps: '12–15', tempo: '2012', rest: 60, rpe: '7',
          cue: "Amplitude contrôlée, pause 2 s en haut SANS hyperextension. Gainage abdominal constant." },
        { id: 'a5', name: 'Relevés de jambes (chaise romaine)', sets: 3, reps: '12–15', tempo: '2011', rest: 60, rpe: '7–8',
          cue: "Rétroversion du bassin en fin de montée : ce sont les abdos qui enroulent, pas les fléchisseurs de hanche seuls." },
        { id: 'a6', name: 'Mollets debout (haltères)', sets: 4, reps: '15–20', tempo: '2011', rest: 45, rpe: '8',
          cue: "Amplitude complète : étirement bas 1 s, contraction haute 1 s. Sur une marche si possible." }
      ]
    },
    {
      id: 'B',
      name: 'Séance B — Haut du corps & dos',
      exercises: [
        { id: 'b1', name: 'Tractions (prise neutre ou pronation)', sets: 4, reps: 'max 6–10', tempo: '2011', rest: 120, rpe: '8',
          cue: "Départ bras tendus, omoplates basses. Tire les coudes vers les hanches. Si <5 reps : négatives lentes 5 s." },
        { id: 'b2', name: 'Rowing unilatéral haltère 16 kg', sets: 4, reps: '10–12/bras', tempo: '2011', rest: 90, rpe: '7–8',
          cue: "Appui main/genou sur banc ou chaise, dos plat. Coude le long du corps, contraction omoplate 1 s." },
        { id: 'b3', name: 'Dips — PROTOCOLE CONDITIONNEL', sets: 3, reps: '8–10', tempo: '2010', rest: 90, rpe: '6–7', flag: 'clavicule',
          cue: "⚠️ Clavicule : buste quasi vertical, amplitude PARTIELLE (coudes à 90° max), descente contrôlée. Au MOINDRE inconfort articulaire → remplacer immédiatement par pompes surélevées (mains sur table)." },
        { id: 'b4', name: 'Curl haltères alterné', sets: 3, reps: '10–12', tempo: '2011', rest: 60, rpe: '8',
          cue: "Coudes fixes contre le buste, supination complète en haut, descente contrôlée 2 s." },
        { id: 'b5', name: 'Shrugs haltères (2×16 kg)', sets: 3, reps: '12–15', tempo: '2011', rest: 60, rpe: '7',
          cue: "Hausse verticale des épaules, pause 1 s en haut. Pas de rotation : montée/descente pure." },
        { id: 'b6', name: 'Planche (gainage)', sets: 3, reps: '45–60 s', tempo: '—', rest: 60, rpe: '7',
          cue: "Bassin rétroversé, fessiers serrés, respiration continue. Stop dès que le bassin tombe." }
      ]
    }
  ]
};

// Variantes de remplacement proposées dans l'éditeur de programme
window.EXERCISE_SWAPS = {
  a1: ['Squat bulgare (haltère 16 kg)', 'Squat sumo haltère', 'Box squat poids du corps'],
  a2: ['Fentes marchées', 'Step-up sur chaise (haltères)', 'Squat bulgare'],
  a3: ['SDT roumain unilatéral', 'Good morning haltère', 'Hip thrust haltère sur banc'],
  a4: ['Superman au sol', 'Hip hinge poids du corps'],
  a5: ['Crunch lesté (haltère)', 'Planche latérale', 'Dead bug'],
  a6: ['Mollets unilatéral sur marche', 'Mollets assis haltère sur genou'],
  b1: ['Négatives lentes 5 s', 'Rowing inversé sous table', 'Tractions assistées (pied sur chaise)'],
  b2: ['Rowing buste penché 2 haltères', 'Rowing inversé sous table'],
  b3: ['Pompes surélevées (mains sur table)', 'Pompes genoux', 'Planche dynamique'],
  b4: ['Curl marteau', 'Curl concentré', 'Curl prise serrée 1 haltère'],
  b5: ['Tirage horizontal serviette', 'Y-raise au sol (léger)'],
  b6: ['Planche latérale', 'Hollow hold', 'Dead bug']
};

// --- Recettes (sans œufs, sans oignons par défaut) --------------------------
// Macros approximatives par portion, sources type CIQUAL.
// ing: [nom, quantité en g (ou ml), rayon de courses]
window.RECIPES = [
  { id: 'r1', name: 'Poulet, riz & brocoli', meal: 'déjeuner', kcal: 520, p: 45, c: 55, f: 11,
    ing: [['Filet de poulet', 150, 'Boucherie'], ['Riz basmati (cru)', 70, 'Épicerie'], ['Brocoli', 200, 'Légumes'], ["Huile d'olive", 10, 'Épicerie']],
    steps: "Cuire le riz. Saisir le poulet en dés 6–8 min. Brocoli vapeur 5 min. Assembler, huile d'olive en finition, sel/paprika." },
  { id: 'r2', name: 'Bœuf 5%, patate douce & haricots verts', meal: 'dîner', kcal: 540, p: 42, c: 50, f: 14,
    ing: [['Steak haché 5%', 150, 'Boucherie'], ['Patate douce', 250, 'Légumes'], ['Haricots verts', 200, 'Légumes'], ["Huile d'olive", 8, 'Épicerie']],
    steps: "Patate douce en cubes au four 25 min (200 °C). Steak à la poêle. Haricots vapeur 8 min. Sel, poivre, cumin." },
  { id: 'r3', name: 'Bowl skyr, flocons & banane', meal: 'petit-déj', kcal: 430, p: 32, c: 55, f: 9,
    ing: [['Skyr nature', 250, 'Frais'], ["Flocons d'avoine", 50, 'Épicerie'], ['Banane', 120, 'Fruits'], ['Beurre de cacahuète', 10, 'Épicerie']],
    steps: "Mélanger skyr et flocons, laisser gonfler 5 min. Banane en rondelles, beurre de cacahuète en filet." },
  { id: 'r4', name: 'Pâtes au thon & tomate (sans oignon)', meal: 'déjeuner', kcal: 530, p: 38, c: 65, f: 11,
    ing: [['Pâtes complètes (crues)', 80, 'Épicerie'], ['Thon au naturel', 140, 'Conserves'], ['Coulis de tomate', 200, 'Conserves'], ["Huile d'olive", 8, 'Épicerie'], ['Ail (facultatif)', 5, 'Légumes']],
    steps: "Cuire les pâtes al dente. Chauffer le coulis avec l'ail et l'origan, ajouter le thon égoutté 2 min. Mélanger." },
  { id: 'r5', name: 'Wrap poulet crudités', meal: 'déjeuner', kcal: 480, p: 38, c: 45, f: 15,
    ing: [['Tortilla de blé', 70, 'Épicerie'], ['Filet de poulet', 120, 'Boucherie'], ['Carotte râpée', 60, 'Légumes'], ['Concombre', 60, 'Légumes'], ['Fromage blanc 3%', 40, 'Frais']],
    steps: "Poulet grillé en lamelles. Tartiner la tortilla de fromage blanc citronné, garnir, rouler serré." },
  { id: 'r6', name: 'Dahl de lentilles corail (sans oignon)', meal: 'dîner', kcal: 510, p: 26, c: 75, f: 10,
    ing: [['Lentilles corail (crues)', 90, 'Épicerie'], ['Riz basmati (cru)', 50, 'Épicerie'], ['Lait de coco léger', 100, 'Conserves'], ['Tomates concassées', 150, 'Conserves'], ['Curry/curcuma', 5, 'Épicerie']],
    steps: "Lentilles + tomates + épices + 250 ml d'eau, 15 min à feu doux. Lait de coco en fin de cuisson. Servir sur riz." },
  { id: 'r7', name: 'Sardines, pommes de terre & courgettes', meal: 'dîner', kcal: 500, p: 34, c: 45, f: 19,
    ing: [["Sardines à l'huile (égouttées)", 100, 'Conserves'], ['Pommes de terre', 300, 'Légumes'], ['Courgette', 200, 'Légumes'], ['Citron', 30, 'Fruits']],
    steps: "Pommes de terre vapeur 15 min, courgettes poêlées 6 min. Sardines tièdes dessus, citron, persil. Riche en oméga-3 et calcium." },
  { id: 'r8', name: 'Porridge protéiné fruits rouges', meal: 'petit-déj', kcal: 420, p: 34, c: 50, f: 8,
    ing: [["Flocons d'avoine", 60, 'Épicerie'], ['Whey (ou skyr 150 g)', 30, 'Épicerie'], ['Fruits rouges surgelés', 100, 'Surgelés'], ['Lait demi-écrémé', 150, 'Frais']],
    steps: "Flocons + lait 2 min au micro-ondes. Hors chauffe, incorporer la whey. Fruits rouges réchauffés dessus." },
  { id: 'r9', name: 'Chili express bœuf-haricots (sans oignon)', meal: 'dîner', kcal: 560, p: 44, c: 55, f: 15,
    ing: [['Steak haché 5%', 130, 'Boucherie'], ['Haricots rouges (égouttés)', 130, 'Conserves'], ['Tomates concassées', 200, 'Conserves'], ['Riz (cru)', 50, 'Épicerie'], ['Paprika fumé/cumin', 5, 'Épicerie']],
    steps: "Saisir la viande, ajouter tomates + haricots + épices, mijoter 10 min. Servir sur riz. Se prépare en lot ×3." },
  { id: 'r10', name: 'Collation fromage blanc, miel & amandes', meal: 'collation', kcal: 280, p: 22, c: 24, f: 11,
    ing: [['Fromage blanc 3%', 250, 'Frais'], ['Miel', 15, 'Épicerie'], ['Amandes', 15, 'Épicerie']],
    steps: "Assembler. Caséine à digestion lente : idéale le soir pour la récupération musculaire nocturne." }
];

// --- Tips du jour ------------------------------------------------------------
window.TIPS = [
  "Protéines : vise 1,6–2 g/kg/jour réparties sur 3–4 prises de ≥25 g pour maximiser la synthèse protéique.",
  "La progression se joue sur le carnet : bats tes chiffres de la semaine dernière d'1 rép ou 1 kg, pas plus.",
  "Sommeil < 6 h = -10 à -30 % de force le lendemain. La sieste de 20 min compense partiellement.",
  "RPE 8 = il te reste 2 répétitions en réserve. Si tu ne sais pas, c'est probablement un RPE 6.",
  "Hydratation : ~35 ml/kg/jour. Une perte de 2 % d'eau corporelle dégrade déjà la performance.",
  "Le déficit calorique se mesure sur la moyenne hebdo du poids, jamais sur un seul matin.",
  "Échauffement RAMP : élever la température, activer les muscles cibles, mobiliser les articulations, potentialiser avec 1–2 séries légères.",
  "Tempo 3010 : 3 s de descente contrôlée = plus de tension mécanique = plus d'hypertrophie à charge égale.",
  "Les courbatures ne mesurent pas l'efficacité d'une séance. La surcharge progressive, si.",
  "Pèse-toi le matin, à jeun, après être passé aux toilettes, dans les mêmes conditions chaque jour.",
  "Marche 7 000–10 000 pas/jour : le NEAT représente souvent plus de dépense que la séance elle-même.",
  "Une douleur articulaire qui dépasse 3/10 pendant un exercice = on régresse ou on remplace, jamais on serre les dents.",
  "Caféine 3–6 mg/kg, 45–60 min avant la séance : ergogène prouvé. Évite après 14 h si sommeil fragile.",
  "Plateau de poids depuis 2 semaines ? Ajoute d'abord 2 000 pas/jour avant de couper 100 kcal.",
  "Les glucides autour de l'entraînement (avant/après) soutiennent la performance et la récupération.",
  "Filme une série de temps en temps : la vidéo corrige la technique mieux que n'importe quel ressenti.",
  "La créatine monohydrate (3–5 g/jour, tous les jours) est le supplément le plus étudié et le plus efficace.",
  "Deload : toutes les 4–6 semaines, réduis le volume de 40–50 % pendant 1 semaine. Tu reviens plus fort.",
  "Mange tes protéines en premier dans l'assiette : satiété accrue, glycémie plus stable.",
  "Le muscle se construit pendant la récupération. La séance n'est que le stimulus.",
  "2 séances/semaine bien exécutées battent 5 séances bâclées. La constance gagne toujours.",
  "Étirements statiques longs AVANT la force = baisse de performance. Garde-les pour après ou le soir.",
  "Ton poids fluctue de ±1 kg avec l'eau, le sel et les glucides. Juge la tendance sur 7 jours.",
  "Respiration : inspire en descente, expire à l'effort. Gainage réflexe et tension maîtrisée.",
  "Prépare tes repas en lot 2×/semaine : la meilleure stratégie anti-craquage connue.",
  "Fibre : 25–35 g/jour (légumes, légumineuses, avoine) pour la satiété et la santé digestive.",
  "Si la motivation baisse : réduis l'objectif de la séance à 50 %. Une fois commencé, tu finiras souvent à 100 %.",
  "Oméga-3 (sardines, maquereau 2×/semaine) : anti-inflammatoire et soutien de la récupération.",
  "Le matériel ne fait pas le résultat : tension, effort proche de l'échec et progression suffisent.",
  "Note ton RPE à chaque série : c'est la donnée qui permet au coach d'ajuster ton volume."
];

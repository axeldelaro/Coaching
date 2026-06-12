// ============================================================
// RECOMP — Données : programme, recettes, badges, tips
// (la bibliothèque d'exercices vit dans exercises.js,
//  la base de connaissances du coach dans knowledge.js)
// ============================================================

// --- Programme par défaut ----------------------------------------------------
// Chaque exercice référence un id de la bibliothèque (EXLIB) + sa prescription.
window.DEFAULT_PROGRAM = {
  name: 'Recomposition 4 semaines',
  weeks: 4,
  note: "Surcharge progressive : +1 rép par série à RPE constant chaque semaine, puis +charge quand le haut de fourchette est atteint.",
  sessions: [
    {
      id: 'A', name: 'Séance A', sub: 'Bas du corps & abdos', emoji: '🦵',
      exercises: [
        { exo: 'goblet-squat',   sets: 4, reps: '10–12',   tempo: '3010', rest: 90,  rpe: '7–8' },
        { exo: 'rear-lunge',     sets: 3, reps: '10/jambe', tempo: '2010', rest: 90,  rpe: '7'   },
        { exo: 'romanian-dl',    sets: 4, reps: '10',      tempo: '3110', rest: 90,  rpe: '7–8' },
        { exo: 'back-ext',       sets: 3, reps: '12–15',   tempo: '2012', rest: 60,  rpe: '7'   },
        { exo: 'leg-raise',      sets: 3, reps: '12–15',   tempo: '2011', rest: 60,  rpe: '7–8' },
        { exo: 'calf-raise',     sets: 4, reps: '15–20',   tempo: '2011', rest: 45,  rpe: '8'   }
      ]
    },
    {
      id: 'B', name: 'Séance B', sub: 'Haut du corps & dos', emoji: '💪',
      exercises: [
        { exo: 'pullup-neutral', sets: 4, reps: 'max 6–10', tempo: '2011', rest: 120, rpe: '8'   },
        { exo: 'db-row',         sets: 4, reps: '10–12/bras', tempo: '2011', rest: 90, rpe: '7–8' },
        { exo: 'dips-partial',   sets: 3, reps: '8–10',    tempo: '2010', rest: 90,  rpe: '6–7' },
        { exo: 'db-curl',        sets: 3, reps: '10–12',   tempo: '2011', rest: 60,  rpe: '8'   },
        { exo: 'shrugs',         sets: 3, reps: '12–15',   tempo: '2011', rest: 60,  rpe: '7'   },
        { exo: 'plank',          sets: 3, reps: '45–60 s', tempo: '—',    rest: 60,  rpe: '7'   }
      ]
    }
  ]
};

// --- Recettes ------------------------------------------------------------------
// micros = points forts micronutritionnels · tags = labels rapides (protéines, vegan…)
// tip = astuce du chef (nutrition/technique) · cost = €/portion · time = minutes
// batch = adapté au batch cooking. Le filtrage par exclusion (œufs, lactose, vegan…)
// est géré dynamiquement par allowedRecipes() dans app.js selon le profil.
window.RECIPES = [
  {
    "id": "r-m1",
    "name": "Le Bowl Poulet & Féculents",
    "meal": "déjeuner",
    "kcal": 500,
    "p": 40,
    "c": 50,
    "f": 15,
    "time": 15,
    "cost": 2.5,
    "tags": [
      "sans lactose"
    ],
    "micros": [
      "Protéines maigres",
      "Fibres"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal",
        {
          "swaps": [
            "Dinde",
            "Tofu",
            "Crevettes",
            "Œufs (x3)"
          ]
        }
      ],
      [
        "Riz basmati",
        80,
        "Épicerie",
        {
          "swaps": [
            "Quinoa",
            "Pâtes complètes",
            "Boulgour",
            "Patate douce"
          ]
        }
      ],
      [
        "Brocoli",
        150,
        "Légumes",
        {
          "swaps": [
            "Courgette",
            "Haricots verts",
            "Épinards",
            "Tomates"
          ]
        }
      ],
      [
        "Sauce Soja & Sésame",
        10,
        "Divers",
        {
          "swaps": [
            "Huile d'olive",
            "Sauce Pimentée",
            "Vinaigrette légère"
          ]
        }
      ]
    ],
    "steps": "Cuis les féculents. Saisis la protéine. Ajoute les légumes. Mélange le tout avec la sauce."
  },
  {
    "id": "r-m2",
    "name": "Salade Fraîcheur Océane",
    "meal": "déjeuner",
    "kcal": 450,
    "p": 35,
    "c": 40,
    "f": 18,
    "time": 10,
    "cost": 3,
    "tags": [
      "sans lactose",
      "sans gluten"
    ],
    "micros": [
      "Oméga-3",
      "Vitamine D"
    ],
    "ing": [
      [
        "Saumon fumé",
        100,
        "Principal",
        {
          "swaps": [
            "Thon en boîte",
            "Maquereau",
            "Crevettes",
            "Sardines"
          ]
        }
      ],
      [
        "Lentilles",
        100,
        "Épicerie",
        {
          "swaps": [
            "Quinoa",
            "Riz brun",
            "Pois chiches"
          ]
        }
      ],
      [
        "Avocat",
        50,
        "Légumes",
        {
          "swaps": [
            "Olives",
            "Graines de courge",
            "Noix"
          ]
        }
      ],
      [
        "Tomates cerises",
        150,
        "Légumes",
        {
          "swaps": [
            "Concombre",
            "Poivron",
            "Radis"
          ]
        }
      ]
    ],
    "steps": "Mélange la base de féculents froids avec les légumes coupés. Ajoute la source d'Oméga-3 par-dessus."
  },
  {
    "id": "r-m3",
    "name": "Bowl Végétarien Protéiné",
    "meal": "dîner",
    "kcal": 480,
    "p": 25,
    "c": 55,
    "f": 16,
    "time": 15,
    "cost": 2,
    "tags": [
      "végétarien",
      "vegan"
    ],
    "micros": [
      "Fer",
      "Calcium"
    ],
    "ing": [
      [
        "Tofu ferme",
        150,
        "Principal",
        {
          "swaps": [
            "Tempeh",
            "Seitan",
            "Pois chiches",
            "Lentilles"
          ]
        }
      ],
      [
        "Quinoa",
        80,
        "Épicerie",
        {
          "swaps": [
            "Riz sauvage",
            "Patate douce",
            "Boulgour"
          ]
        }
      ],
      [
        "Épinards",
        100,
        "Légumes",
        {
          "swaps": [
            "Kale",
            "Mâche",
            "Roquette"
          ]
        }
      ],
      [
        "Sauce Cacahuète",
        15,
        "Divers",
        {
          "swaps": [
            "Tahini",
            "Sauce Soja",
            "Hummus"
          ]
        }
      ]
    ],
    "steps": "Fais dorer le tofu. Mélange avec le quinoa tiède et les épinards. Nappe de sauce."
  },
  {
    "id": "r-m4",
    "name": "Chili Express Modulable",
    "meal": "dîner",
    "batch": true,
    "kcal": 550,
    "p": 40,
    "c": 60,
    "f": 15,
    "time": 25,
    "cost": 2.5,
    "tags": [
      "sans gluten"
    ],
    "micros": [
      "Fer",
      "Zinc"
    ],
    "ing": [
      [
        "Bœuf haché 5%",
        150,
        "Principal",
        {
          "swaps": [
            "Dinde hachée",
            "Protéines de soja",
            "Poulet haché"
          ]
        }
      ],
      [
        "Haricots rouges",
        120,
        "Conserves",
        {
          "swaps": [
            "Lentilles",
            "Pois chiches",
            "Haricots noirs"
          ]
        }
      ],
      [
        "Coulis de tomate",
        150,
        "Conserves",
        {
          "swaps": [
            "Tomates pelées",
            "Sauce tomate maison"
          ]
        }
      ],
      [
        "Riz basmati",
        60,
        "Épicerie",
        {
          "swaps": [
            "Quinoa",
            "Pâtes",
            "Maïs"
          ]
        }
      ]
    ],
    "steps": "Fais revenir la viande. Ajoute les haricots et la sauce tomate, laisse mijoter avec des épices mexicaines. Sers sur la base."
  },
  {
    "id": "r-m5",
    "name": "Curry Coco Réconfortant",
    "meal": "dîner",
    "batch": true,
    "kcal": 580,
    "p": 35,
    "c": 55,
    "f": 20,
    "time": 20,
    "cost": 2.8,
    "tags": [
      "sans gluten",
      "sans lactose"
    ],
    "micros": [
      "Vitamine C"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal",
        {
          "swaps": [
            "Poulet",
            "Tofu",
            "Cabillaud",
            "Saumon"
          ]
        }
      ],
      [
        "Lait de coco léger",
        100,
        "Conserves",
        {
          "swaps": [
            "Crème de soja",
            "Crème légère 4%",
            "Lait d'amande"
          ]
        }
      ],
      [
        "Riz thaï",
        70,
        "Épicerie",
        {
          "swaps": [
            "Riz basmati",
            "Nouilles de riz",
            "Quinoa"
          ]
        }
      ],
      [
        "Poivron",
        150,
        "Légumes",
        {
          "swaps": [
            "Courgette",
            "Brocoli",
            "Carottes"
          ]
        }
      ]
    ],
    "steps": "Saisis la protéine et les légumes. Ajoute le lait de coco et du curry en poudre, laisse épaissir. Sers avec le riz."
  },
  {
    "id": "r-m6",
    "name": "Pâtes Carbonara Fitness",
    "meal": "déjeuner",
    "kcal": 520,
    "p": 45,
    "c": 60,
    "f": 12,
    "time": 15,
    "cost": 2,
    "tags": [],
    "micros": [
      "Calcium"
    ],
    "ing": [
      [
        "Bacon de dinde",
        100,
        "Principal",
        {
          "swaps": [
            "Jambon blanc",
            "Lardons allumettes",
            "Tofu fumé"
          ]
        }
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie",
        {
          "swaps": [
            "Pâtes classiques",
            "Gnocchis",
            "Pâtes de lentilles"
          ]
        }
      ],
      [
        "Crème légère 4%",
        50,
        "Divers",
        {
          "swaps": [
            "Crème de soja",
            "Fromage blanc 0%",
            "Ricotta"
          ]
        }
      ],
      [
        "Œuf",
        50,
        "Principal",
        {
          "swaps": [
            "Pas d'œuf (version crème seule)"
          ]
        }
      ]
    ],
    "steps": "Cuis les pâtes. Fais revenir le bacon. Mélange la crème, l'œuf et les pâtes hors du feu."
  },
  {
    "id": "r-m7",
    "name": "Steak & Frites de Patate Douce",
    "meal": "dîner",
    "kcal": 550,
    "p": 45,
    "c": 50,
    "f": 15,
    "time": 25,
    "cost": 3.5,
    "tags": [
      "sans lactose",
      "sans gluten"
    ],
    "micros": [
      "B12",
      "Fer"
    ],
    "ing": [
      [
        "Steak de Bœuf",
        150,
        "Principal",
        {
          "swaps": [
            "Steak de Cheval",
            "Steak végétal",
            "Filet de Poulet"
          ]
        }
      ],
      [
        "Patate douce",
        200,
        "Légumes",
        {
          "swaps": [
            "Pommes de terre",
            "Carottes",
            "Panais"
          ]
        }
      ],
      [
        "Huile d'olive",
        10,
        "Divers",
        {
          "swaps": [
            "Huile de coco",
            "Beurre",
            "Huile de colza"
          ]
        }
      ],
      [
        "Haricots verts",
        100,
        "Légumes",
        {
          "swaps": [
            "Salade verte",
            "Brocoli",
            "Asperges"
          ]
        }
      ]
    ],
    "steps": "Coupe les patates en frites, cuis au four avec un filet d'huile. Saisis le steak et sers avec la verdure."
  },
  {
    "id": "r-m8",
    "name": "Wrap Complet Express",
    "meal": "déjeuner",
    "kcal": 480,
    "p": 35,
    "c": 55,
    "f": 14,
    "time": 10,
    "cost": 2,
    "tags": [],
    "micros": [
      "Vitamines B"
    ],
    "ing": [
      [
        "Wrap au blé complet",
        70,
        "Épicerie",
        {
          "swaps": [
            "Wrap maïs",
            "Pain pita",
            "Pain de mie complet"
          ]
        }
      ],
      [
        "Blanc de poulet",
        100,
        "Principal",
        {
          "swaps": [
            "Jambon",
            "Saumon fumé",
            "Houmous"
          ]
        }
      ],
      [
        "Fromage frais à tartiner",
        30,
        "Frais",
        {
          "swaps": [
            "Avocat écrasé",
            "Tzatziki",
            "Moutarde"
          ]
        }
      ],
      [
        "Crudités (Salade, Tomate)",
        100,
        "Légumes",
        {
          "swaps": [
            "Carottes râpées",
            "Concombre",
            "Pousses d'épinard"
          ]
        }
      ]
    ],
    "steps": "Tartine le wrap, dépose la protéine et les crudités. Roule fermement et déguste."
  },
  {
    "id": "r-m9",
    "name": "Omelette Paysanne",
    "meal": "dîner",
    "kcal": 420,
    "p": 25,
    "c": 30,
    "f": 20,
    "time": 10,
    "cost": 1.5,
    "tags": [
      "sans gluten",
      "végétarien"
    ],
    "micros": [
      "Choline",
      "Vitamines A"
    ],
    "ing": [
      [
        "Œufs (x3)",
        150,
        "Principal",
        {
          "swaps": [
            "Tofu soyeux (brouillade)",
            "Blancs d'œufs (x5)"
          ]
        }
      ],
      [
        "Pommes de terre",
        150,
        "Légumes",
        {
          "swaps": [
            "Patate douce",
            "Pain complet (en accompagnement)"
          ]
        }
      ],
      [
        "Champignons",
        100,
        "Légumes",
        {
          "swaps": [
            "Poivrons",
            "Oignons",
            "Courgettes"
          ]
        }
      ],
      [
        "Fromage râpé",
        20,
        "Frais",
        {
          "swaps": [
            "Feta",
            "Chèvre",
            "Levure diététique (vegan)"
          ]
        }
      ]
    ],
    "steps": "Fais revenir les pommes de terre et champignons. Bats les œufs, verse dans la poêle, parsème de fromage et plie."
  },
  {
    "id": "r-m10",
    "name": "Porridge Protéiné du Matin",
    "meal": "petit-déj",
    "kcal": 380,
    "p": 25,
    "c": 50,
    "f": 8,
    "time": 5,
    "cost": 1,
    "tags": [
      "végétarien"
    ],
    "micros": [
      "Fibres",
      "Magnésium"
    ],
    "ing": [
      [
        "Flocons d'avoine",
        50,
        "Épicerie",
        {
          "swaps": [
            "Muesli",
            "Flocons de sarrasin",
            "Son d'avoine"
          ]
        }
      ],
      [
        "Lait végétal",
        150,
        "Divers",
        {
          "swaps": [
            "Lait de vache",
            "Eau",
            "Lait d'amande"
          ]
        }
      ],
      [
        "Protéine en poudre (Whey)",
        20,
        "Suppléments",
        {
          "swaps": [
            "Fromage blanc",
            "Skyr",
            "Protéine végétale"
          ]
        }
      ],
      [
        "Fruits rouges",
        80,
        "Fruits",
        {
          "swaps": [
            "Banane",
            "Pomme",
            "Kiwi"
          ]
        }
      ]
    ],
    "steps": "Fais chauffer l'avoine et le lait. Hors du feu, incorpore la protéine pour éviter les grumeaux. Ajoute les fruits sur le dessus."
  },
  {
    "id": "r-m11",
    "name": "Pancakes Healthy",
    "meal": "petit-déj",
    "kcal": 400,
    "p": 30,
    "c": 45,
    "f": 10,
    "time": 15,
    "cost": 1.5,
    "tags": [
      "végétarien"
    ],
    "micros": [
      "Calcium"
    ],
    "ing": [
      [
        "Flocons d'avoine mixés",
        40,
        "Épicerie",
        {
          "swaps": [
            "Farine complète",
            "Farine d'épeautre"
          ]
        }
      ],
      [
        "Œuf",
        50,
        "Principal",
        {
          "swaps": [
            "Graines de chia trempées (vegan)"
          ]
        }
      ],
      [
        "Fromage blanc",
        100,
        "Frais",
        {
          "swaps": [
            "Yaourt nature",
            "Skyr",
            "Compote de pomme"
          ]
        }
      ],
      [
        "Sirop d'érable",
        15,
        "Divers",
        {
          "swaps": [
            "Miel",
            "Sirop d'agave",
            "Confiture allégée"
          ]
        }
      ]
    ],
    "steps": "Mixe l'avoine, l'œuf et le fromage blanc pour obtenir une pâte. Cuis en petites crêpes à la poêle. Verse le sirop."
  },
  {
    "id": "r-m12",
    "name": "Mug Cake Cacao Express",
    "meal": "collation",
    "kcal": 280,
    "p": 20,
    "c": 30,
    "f": 8,
    "time": 3,
    "cost": 1,
    "tags": [
      "végétarien"
    ],
    "micros": [
      "Antioxydants"
    ],
    "ing": [
      [
        "Farine d'avoine",
        30,
        "Épicerie",
        {
          "swaps": [
            "Farine de blé",
            "Poudre d'amande"
          ]
        }
      ],
      [
        "Cacao en poudre sans sucre",
        10,
        "Divers",
        {
          "swaps": [
            "Pépites de chocolat",
            "Arôme vanille"
          ]
        }
      ],
      [
        "Blanc d'œuf",
        30,
        "Principal",
        {
          "swaps": [
            "Lait",
            "Compote de pomme"
          ]
        }
      ],
      [
        "Whey ou Skyr",
        20,
        "Suppléments",
        {
          "swaps": [
            "Protéine végétale",
            "Rien (macro ajustée)"
          ]
        }
      ]
    ],
    "steps": "Mélange tout dans un mug avec un peu d'eau ou de lait. Cuis 1 min à 1 min 30 au micro-ondes."
  },
  {
    "id": "r-m13",
    "name": "Bowl Fromage Blanc & Crunch",
    "meal": "collation",
    "kcal": 300,
    "p": 25,
    "c": 35,
    "f": 8,
    "time": 2,
    "cost": 1.2,
    "tags": [
      "végétarien"
    ],
    "micros": [
      "Calcium"
    ],
    "ing": [
      [
        "Fromage blanc 0% ou 3%",
        200,
        "Frais",
        {
          "swaps": [
            "Skyr",
            "Yaourt grec",
            "Yaourt de soja"
          ]
        }
      ],
      [
        "Granola / Muesli",
        40,
        "Épicerie",
        {
          "swaps": [
            "Céréales complètes",
            "Flocons d'avoine",
            "Riz soufflé"
          ]
        }
      ],
      [
        "Beurre de cacahuète",
        15,
        "Divers",
        {
          "swaps": [
            "Purée d'amande",
            "Noix concassées",
            "Chocolat noir"
          ]
        }
      ]
    ],
    "steps": "Verse le fromage blanc dans un bol. Ajoute le granola croquant et une cuillère de beurre d'oléagineux."
  },
  {
    "id": "r-m14",
    "name": "Poisson Blanc en Papillote",
    "meal": "dîner",
    "kcal": 400,
    "p": 35,
    "c": 45,
    "f": 8,
    "time": 20,
    "cost": 3.5,
    "tags": [
      "sans gluten",
      "sans lactose"
    ],
    "micros": [
      "Iode",
      "Sélénium"
    ],
    "ing": [
      [
        "Filet de cabillaud",
        150,
        "Principal",
        {
          "swaps": [
            "Lieu noir",
            "Colin",
            "Dorade"
          ]
        }
      ],
      [
        "Pommes de terre vapeur",
        150,
        "Légumes",
        {
          "swaps": [
            "Riz",
            "Quinoa",
            "Boulgour"
          ]
        }
      ],
      [
        "Courgette en rondelles",
        150,
        "Légumes",
        {
          "swaps": [
            "Poireau",
            "Tomates",
            "Fenouil"
          ]
        }
      ],
      [
        "Citron & Aneth",
        5,
        "Divers",
        {
          "swaps": [
            "Huile d'olive & Herbes",
            "Sauce soja",
            "Moutarde"
          ]
        }
      ]
    ],
    "steps": "Mets le poisson et les légumes dans du papier cuisson avec les aromates. Cuis au four 15-20 min."
  },
  {
    "id": "r-m15",
    "name": "Wok Asiatique Teriyaki",
    "meal": "déjeuner",
    "kcal": 500,
    "p": 35,
    "c": 65,
    "f": 10,
    "time": 15,
    "cost": 2.8,
    "tags": [
      "sans lactose"
    ],
    "micros": [
      "Antioxydants"
    ],
    "ing": [
      [
        "Émincé de porc maigre",
        150,
        "Principal",
        {
          "swaps": [
            "Poulet",
            "Bœuf",
            "Tofu",
            "Crevettes"
          ]
        }
      ],
      [
        "Nouilles de riz",
        80,
        "Épicerie",
        {
          "swaps": [
            "Nouilles aux œufs",
            "Spaghettis",
            "Riz"
          ]
        }
      ],
      [
        "Mélange wok (Chou, Carotte, Pousse)",
        200,
        "Légumes",
        {
          "swaps": [
            "Brocoli",
            "Poivrons",
            "Haricots plats"
          ]
        }
      ],
      [
        "Sauce Teriyaki",
        20,
        "Divers",
        {
          "swaps": [
            "Sauce aigre-douce",
            "Sauce Huitre",
            "Sauce Soja"
          ]
        }
      ]
    ],
    "steps": "Saisis la viande au wok. Ajoute les légumes croquants, puis les nouilles précuites et la sauce."
  }
];
// --- Badges --------------------------------------------------------------------
// check(s) reçoit les stats agrégées calculées par l'app.
window.BADGES = [
  { id: 'first-blood',  icon: '🩸', name: 'Première pierre',   desc: '1ʳᵉ séance enregistrée',            check: s => s.workouts >= 1 },
  { id: 'w5',           icon: '🔨', name: 'La machine démarre', desc: '5 séances',                         check: s => s.workouts >= 5 },
  { id: 'w15',          icon: '⚙️', name: 'Régulier',           desc: '15 séances',                        check: s => s.workouts >= 15 },
  { id: 'w30',          icon: '🏭', name: 'Infatigable',        desc: '30 séances',                        check: s => s.workouts >= 30 },
  { id: 'streak3',      icon: '✏️', name: 'Carnet ouvert',      desc: '3 jours de carnet d\'affilée',      check: s => s.journalStreak >= 3 },
  { id: 'streak7',      icon: '🔥', name: 'Semaine parfaite',   desc: '7 jours de carnet d\'affilée',      check: s => s.journalStreak >= 7 },
  { id: 'streak21',     icon: '🌋', name: 'Discipline de fer',  desc: '21 jours de carnet d\'affilée',     check: s => s.journalStreak >= 21 },
  { id: 'pr1',          icon: '🏆', name: 'Premier record',     desc: '1ᵉʳ record personnel battu',        check: s => s.prCount >= 1 },
  { id: 'pr10',         icon: '👑', name: 'Collectionneur',     desc: '10 records personnels',             check: s => s.prCount >= 10 },
  { id: 'vol10',        icon: '🐘', name: '10 tonnes',          desc: '10 000 kg de volume cumulé',        check: s => s.totalVolume >= 10000 },
  { id: 'vol50',        icon: '🚛', name: '50 tonnes',          desc: '50 000 kg de volume cumulé',        check: s => s.totalVolume >= 50000 },
  { id: 'sets100',      icon: '💯', name: 'Centurion',          desc: '100 séries validées',               check: s => s.totalSets >= 100 },
  { id: 'sets500',      icon: '🗿', name: 'Monument',           desc: '500 séries validées',               check: s => s.totalSets >= 500 },
  { id: 'weight7',      icon: '⚖️', name: 'Rigueur balance',    desc: '7 pesées sur une semaine',          check: s => s.weighWeek >= 7 },
  { id: 'pullup10',     icon: '🦍', name: 'Gorille',            desc: '10 tractions dans une série',       check: s => s.bestPullups >= 10 },
  { id: 'month1',       icon: '🌱', name: 'Un mois',            desc: '30 jours de carnet au total',       check: s => s.journalDays >= 30 },
  { id: 'w50',          icon: '🏛️', name: 'Titan',             desc: '50 séances',                        check: s => s.workouts >= 50 },
  { id: 'w100',         icon: '⚡', name: 'Légende',           desc: '100 séances',                       check: s => s.workouts >= 100 },
  { id: 'streak30',     icon: '💎', name: 'Habitude d\'acier',  desc: '30 jours de carnet d\'affilée',     check: s => s.journalStreak >= 30 },
  { id: 'streak60',     icon: '🌟', name: 'Incassable',        desc: '60 jours de carnet d\'affilée',     check: s => s.journalStreak >= 60 },
  { id: 'pr25',         icon: '🥇', name: 'Chasseur de records', desc: '25 records personnels',            check: s => s.prCount >= 25 },
  { id: 'pr50',         icon: '🏅', name: 'Briseur de limites', desc: '50 records personnels',             check: s => s.prCount >= 50 },
  { id: 'vol100',       icon: '🏔️', name: '100 tonnes',         desc: '100 000 kg de volume cumulé',       check: s => s.totalVolume >= 100000 },
  { id: 'sets1000',     icon: '🏰', name: 'Forteresse',        desc: '1 000 séries validées',             check: s => s.totalSets >= 1000 }
];

// --- Tips du jour ----------------------------------------------------------------
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
  "Fibres : 25–35 g/jour (légumes, légumineuses, avoine) pour la satiété et la santé digestive.",
  "Si la motivation baisse : réduis l'objectif de la séance à 50 %. Une fois commencé, tu finiras souvent à 100 %.",
  "Oméga-3 (sardines, maquereau 2×/semaine) : anti-inflammatoire et soutien de la récupération.",
  "Le matériel ne fait pas le résultat : tension, effort proche de l'échec et progression suffisent.",
  "Note ton RPE à chaque série : c'est la donnée qui permet au coach d'ajuster ton volume.",
  "Le stress chronique élève le cortisol et favorise le stockage abdominal. 5 min de respiration lente le soir : 4 s inspire, 6 s expire.",
  "La surcharge progressive ne veut pas dire +5 kg à chaque séance. +1 rép, +1 s de tempo, -10 s de repos : tout ça compte.",
  "Les fibres dans l'assiette ralentissent la vidange gastrique : tu as moins faim et tes glucides sont mieux gérés par l'insuline.",
  "Unilatéral = double la difficulté sans changer la charge. Passe au curl unilatéral, au step-up unilatéral, au SDT unilatéral.",
  "Photos de progression : même éclairage, même heure, même lieu. La comparaison objective bat le miroir quotidien.",
  "La marche post-repas (15 min) réduit le pic glycémique de 30 %. Prends l'habitude après le déjeuner.",
  "Ne sous-estime pas les légumineuses : 25 g de protéines, 15 g de fibres et quasi zéro gras pour 100 g de lentilles sèches.",
  "Le magnésium améliore le sommeil et réduit les crampes. Sources : amandes, chocolat noir, eaux minérales riches (Hépar, Contrex).",
  "Mange une protéine complète à chaque repas (animale, ou légumineuse + céréale) : c'est le profil d'acides aminés qui pilote la construction musculaire.",
  "Excentrique lent (3-4 s à la descente) = plus de micro-dommages utiles et plus de gains de force qu'une descente subie.",
  "L'amplitude complète bat la charge lourde tronquée : un mouvement complet à charge modérée recrute plus de fibres et protège mieux les articulations.",
  "Garde toujours 1 à 3 répétitions en réserve (RIR) sur tes séries de travail : tu progresses sans cramer ta récupération.",
  "Le poisson gras 2×/semaine (maquereau, sardines, saumon) couvre tes oméga-3 EPA/DHA, anti-inflammatoires et alliés de la récupération.",
  "La vitamine C des légumes crus (poivron, brocoli, agrumes) multiplie l'absorption du fer végétal des lentilles et épinards.",
  "Un échauffement de 5 min de mobilité ciblée (hanches, épaules, chevilles) débloque plus d'amplitude qu'il n'en fait perdre en fatigue.",
  "La constance bat l'intensité : 3 séances correctes chaque semaine pendant 3 mois transforment un physique. Une séance héroïque, non.",
  "Tes glucides ne te font pas grossir : c'est le surplus calorique total. Place-les surtout autour de l'entraînement pour la performance.",
  "Varie tes sources de protéines (œufs, poisson, volaille, légumineuses, laitages) : tu couvres mieux micronutriments et acides aminés.",
  "Le sommeil est ton premier anabolisant : 7-9 h régulières font plus pour tes muscles que n'importe quel complément.",
  "Bois un grand verre d'eau au réveil : on se réveille déshydraté, et la vigilance comme la performance en dépendent."
];

// --- Catalogue matériel (pour l'onboarding et les réglages) --------------------
window.EQUIPMENT_OPTIONS = [
  { id: 'halteres',       label: 'Haltères',              icon: '🏋️' },
  { id: 'barre',          label: 'Barre de traction',      icon: '🔱' },
  { id: 'chaise_romaine', label: 'Chaise romaine',         icon: '🪑' },
  { id: 'banc',           label: 'Banc plat/incliné',      icon: '📐' },
  { id: 'elastiques',     label: 'Élastiques/bandes',      icon: '🟩' },
  { id: 'kettlebell',     label: 'Kettlebell',              icon: '🔔' },
  { id: 'anneaux',        label: 'Anneaux de gym',         icon: '⭕' },
  { id: 'barre_sol',      label: 'Barre + disques',        icon: '🏗️' },
  { id: 'ab_wheel',       label: 'Roue abdominale',        icon: '☸️' },
  { id: 'corde',          label: 'Corde à sauter',         icon: '🪢' },
  { id: 'step',           label: 'Marche / step',          icon: '🪜' },
  { id: 'poids_corps',    label: 'Poids du corps seul',    icon: '🤸' }
];

// --- Catalogue exclusions alimentaires -----------------------------------------
window.EXCLUSION_OPTIONS = [
  { id: 'oeufs',          label: 'Œufs',                   icon: '🥚' },
  { id: 'oignons',        label: 'Oignons / ail',          icon: '🧅' },
  { id: 'lactose',        label: 'Lactose (lait, fromage)', icon: '🥛' },
  { id: 'gluten',         label: 'Gluten (blé, orge…)',    icon: '🌾' },
  { id: 'fruits_de_mer',  label: 'Poisson / fruits de mer',icon: '🐟' },
  { id: 'viande_rouge',   label: 'Viande rouge',           icon: '🥩' },
  { id: 'volaille',       label: 'Volaille',               icon: '🍗' },
  { id: 'legumineuses',   label: 'Légumineuses (pois, lentilles)', icon: '🫘' },
  { id: 'noix',           label: 'Fruits à coque',         icon: '🥜' },
  { id: 'soja',           label: 'Soja',                   icon: '🫛' },
  { id: 'sucre',          label: 'Sucre ajouté',           icon: '🍬' },
  { id: 'alcool',         label: 'Alcool (dans recettes)', icon: '🍾' },
  { id: 'cafe',           label: 'Caféine / café',         icon: '☕' },
  { id: 'porc',           label: 'Porc / charcuterie',     icon: '🐷' },
  { id: 'vegan',          label: 'Vegan (aucun produit animal)', icon: '🌱' }
];

// --- Catalogue thèmes visuels --------------------------------------------------
window.ACCENT_PRESETS = [
  { id: 'blue',    label: 'BLEU',      value: '#2F80ED' },
  { id: 'teal',    label: 'TURQUOISE', value: '#0FB5AE' },
  { id: 'green',   label: 'VERT',      value: '#16A34A' },
  { id: 'indigo',  label: 'INDIGO',    value: '#6366F1' },
  { id: 'purple',  label: 'VIOLET',    value: '#9333EA' },
  { id: 'coral',   label: 'CORAIL',    value: '#F2674E' },
  { id: 'rose',    label: 'ROSE',      value: '#EC4899' },
  { id: 'amber',   label: 'AMBRE',     value: '#D98A00' },
  { id: 'slate',   label: 'ARDOISE',   value: '#64748B' },
  { id: 'custom',  label: 'LIBRE',     value: null }
];

window.FONT_PRESETS = [
  { id: 'inter',   label: 'Inter',    family: '"Inter", system-ui, sans-serif',    url: 'Inter:wght@400;450;500;600;700;800' },
  { id: 'outfit',  label: 'Outfit',   family: '"Outfit", system-ui, sans-serif',   url: 'Outfit:wght@400;500;600;700;800' },
  { id: 'poppins', label: 'Poppins',  family: '"Poppins", system-ui, sans-serif',  url: 'Poppins:wght@400;500;600;700;800' },
  { id: 'nunito',  label: 'Nunito',   family: '"Nunito", system-ui, sans-serif',   url: 'Nunito:wght@400;500;600;700;800' },
  { id: 'roboto',  label: 'Roboto',   family: '"Roboto", system-ui, sans-serif',   url: 'Roboto:wght@400;500;700;900' },
  { id: 'system',  label: 'Système',  family: 'system-ui, -apple-system, "Segoe UI", sans-serif', url: null }
];

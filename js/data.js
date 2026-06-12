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
    "id": "r-gen-1",
    "name": "Poulet sauce Curry avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-2",
    "name": "Poulet sauce Soja & Gingembre avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-3",
    "name": "Poulet sauce Tomate & Basilic avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-4",
    "name": "Poulet sauce Crème légère & Moutarde avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-5",
    "name": "Poulet sauce Piment doux & Citron avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-6",
    "name": "Poulet sauce Lait de coco avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-7",
    "name": "Poulet sauce Huile d'olive & Herbes avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 72,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Poulet à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-8",
    "name": "Poulet sauce Curry avec Pâtes complètes et Poivron",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-9",
    "name": "Poulet sauce Soja & Gingembre avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-10",
    "name": "Poulet sauce Tomate & Basilic avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-11",
    "name": "Poulet sauce Crème légère & Moutarde avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-12",
    "name": "Poulet sauce Piment doux & Citron avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-13",
    "name": "Poulet sauce Lait de coco avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-14",
    "name": "Poulet sauce Huile d'olive & Herbes avec Pâtes complètes et Poivron",
    "meal": "dîner",
    "kcal": 555,
    "p": 50,
    "c": 62,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Poulet à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-15",
    "name": "Poulet sauce Curry avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-16",
    "name": "Poulet sauce Soja & Gingembre avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-17",
    "name": "Poulet sauce Tomate & Basilic avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-18",
    "name": "Poulet sauce Crème légère & Moutarde avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-19",
    "name": "Poulet sauce Piment doux & Citron avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-20",
    "name": "Poulet sauce Lait de coco avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-21",
    "name": "Poulet sauce Huile d'olive & Herbes avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 347,
    "p": 50,
    "c": 26,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Poulet à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-22",
    "name": "Poulet sauce Curry avec Quinoa et Poivron",
    "meal": "dîner",
    "kcal": 563,
    "p": 50,
    "c": 61,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Poulet à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-23",
    "name": "Poulet sauce Soja & Gingembre avec Quinoa et Carottes",
    "meal": "dîner",
    "kcal": 563,
    "p": 50,
    "c": 61,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Poulet à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-24",
    "name": "Poulet sauce Tomate & Basilic avec Quinoa et Épinards",
    "meal": "dîner",
    "kcal": 563,
    "p": 50,
    "c": 61,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Poulet à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-25",
    "name": "Poulet sauce Crème légère & Moutarde avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 563,
    "p": 50,
    "c": 61,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Poulet",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Poulet à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-26",
    "name": "Bœuf sauce Curry avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-27",
    "name": "Bœuf sauce Soja & Gingembre avec Riz basmati et Brocoli",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-28",
    "name": "Bœuf sauce Tomate & Basilic avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-29",
    "name": "Bœuf sauce Crème légère & Moutarde avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-30",
    "name": "Bœuf sauce Piment doux & Citron avec Riz basmati et Brocoli",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-31",
    "name": "Bœuf sauce Lait de coco avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-32",
    "name": "Bœuf sauce Huile d'olive & Herbes avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 72,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Bœuf à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-33",
    "name": "Bœuf sauce Curry avec Pâtes complètes et Carottes",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-34",
    "name": "Bœuf sauce Soja & Gingembre avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-35",
    "name": "Bœuf sauce Tomate & Basilic avec Pâtes complètes et Brocoli",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-36",
    "name": "Bœuf sauce Crème légère & Moutarde avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-37",
    "name": "Bœuf sauce Piment doux & Citron avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-38",
    "name": "Bœuf sauce Lait de coco avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-39",
    "name": "Bœuf sauce Huile d'olive & Herbes avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 705,
    "p": 44,
    "c": 62,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Bœuf à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-40",
    "name": "Bœuf sauce Curry avec Patates douces et Tomates cerises",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-41",
    "name": "Bœuf sauce Soja & Gingembre avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-42",
    "name": "Bœuf sauce Tomate & Basilic avec Patates douces et Courgette",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-43",
    "name": "Bœuf sauce Crème légère & Moutarde avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-44",
    "name": "Bœuf sauce Piment doux & Citron avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-45",
    "name": "Bœuf sauce Lait de coco avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-46",
    "name": "Bœuf sauce Huile d'olive & Herbes avec Patates douces et Tomates cerises",
    "meal": "dîner",
    "kcal": 497,
    "p": 44,
    "c": 26,
    "f": 33,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Bœuf à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-47",
    "name": "Bœuf sauce Curry avec Quinoa et Courgette",
    "meal": "dîner",
    "kcal": 713,
    "p": 44,
    "c": 61,
    "f": 37,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Bœuf à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-48",
    "name": "Bœuf sauce Soja & Gingembre avec Quinoa et Poivron",
    "meal": "dîner",
    "kcal": 713,
    "p": 44,
    "c": 61,
    "f": 37,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Bœuf à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-49",
    "name": "Bœuf sauce Tomate & Basilic avec Quinoa et Brocoli",
    "meal": "dîner",
    "kcal": 713,
    "p": 44,
    "c": 61,
    "f": 37,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Bœuf à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-50",
    "name": "Bœuf sauce Crème légère & Moutarde avec Quinoa et Épinards",
    "meal": "dîner",
    "kcal": 713,
    "p": 44,
    "c": 61,
    "f": 37,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Bœuf",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Bœuf à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-51",
    "name": "Saumon sauce Curry avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-52",
    "name": "Saumon sauce Soja & Gingembre avec Riz basmati et Chou-fleur",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-53",
    "name": "Saumon sauce Tomate & Basilic avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-54",
    "name": "Saumon sauce Crème légère & Moutarde avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-55",
    "name": "Saumon sauce Piment doux & Citron avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-56",
    "name": "Saumon sauce Lait de coco avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-57",
    "name": "Saumon sauce Huile d'olive & Herbes avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 72,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Saumon à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-58",
    "name": "Saumon sauce Curry avec Pâtes complètes et Brocoli",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-59",
    "name": "Saumon sauce Soja & Gingembre avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-60",
    "name": "Saumon sauce Tomate & Basilic avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-61",
    "name": "Saumon sauce Crème légère & Moutarde avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-62",
    "name": "Saumon sauce Piment doux & Citron avec Pâtes complètes et Carottes",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-63",
    "name": "Saumon sauce Lait de coco avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-64",
    "name": "Saumon sauce Huile d'olive & Herbes avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 630,
    "p": 35,
    "c": 62,
    "f": 31,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Saumon à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-65",
    "name": "Saumon sauce Curry avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-66",
    "name": "Saumon sauce Soja & Gingembre avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-67",
    "name": "Saumon sauce Tomate & Basilic avec Patates douces et Courgette",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-68",
    "name": "Saumon sauce Crème légère & Moutarde avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-69",
    "name": "Saumon sauce Piment doux & Citron avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-70",
    "name": "Saumon sauce Lait de coco avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-71",
    "name": "Saumon sauce Huile d'olive & Herbes avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 422,
    "p": 35,
    "c": 26,
    "f": 30,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Saumon à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-72",
    "name": "Saumon sauce Curry avec Quinoa et Chou-fleur",
    "meal": "dîner",
    "kcal": 638,
    "p": 35,
    "c": 61,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Saumon à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-73",
    "name": "Saumon sauce Soja & Gingembre avec Quinoa et Brocoli",
    "meal": "dîner",
    "kcal": 638,
    "p": 35,
    "c": 61,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Saumon à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-74",
    "name": "Saumon sauce Tomate & Basilic avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 638,
    "p": 35,
    "c": 61,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Saumon à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-75",
    "name": "Saumon sauce Crème légère & Moutarde avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 638,
    "p": 35,
    "c": 61,
    "f": 34,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Saumon",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Saumon à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-76",
    "name": "Tofu sauce Curry avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-77",
    "name": "Tofu sauce Soja & Gingembre avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-78",
    "name": "Tofu sauce Tomate & Basilic avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-79",
    "name": "Tofu sauce Crème légère & Moutarde avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-80",
    "name": "Tofu sauce Piment doux & Citron avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-81",
    "name": "Tofu sauce Lait de coco avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-82",
    "name": "Tofu sauce Huile d'olive & Herbes avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Tofu à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-83",
    "name": "Tofu sauce Curry avec Pâtes complètes et Carottes",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-84",
    "name": "Tofu sauce Soja & Gingembre avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-85",
    "name": "Tofu sauce Tomate & Basilic avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-86",
    "name": "Tofu sauce Crème légère & Moutarde avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-87",
    "name": "Tofu sauce Piment doux & Citron avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-88",
    "name": "Tofu sauce Lait de coco avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-89",
    "name": "Tofu sauce Huile d'olive & Herbes avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 510,
    "p": 26,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-90",
    "name": "Tofu sauce Curry avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-91",
    "name": "Tofu sauce Soja & Gingembre avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-92",
    "name": "Tofu sauce Tomate & Basilic avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-93",
    "name": "Tofu sauce Crème légère & Moutarde avec Patates douces et Courgette",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-94",
    "name": "Tofu sauce Piment doux & Citron avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-95",
    "name": "Tofu sauce Lait de coco avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-96",
    "name": "Tofu sauce Huile d'olive & Herbes avec Patates douces et Tomates cerises",
    "meal": "dîner",
    "kcal": 302,
    "p": 26,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Tofu à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-97",
    "name": "Tofu sauce Curry avec Quinoa et Poivron",
    "meal": "dîner",
    "kcal": 518,
    "p": 26,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Tofu à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-98",
    "name": "Tofu sauce Soja & Gingembre avec Quinoa et Chou-fleur",
    "meal": "dîner",
    "kcal": 518,
    "p": 26,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Tofu à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-99",
    "name": "Tofu sauce Tomate & Basilic avec Quinoa et Poivron",
    "meal": "dîner",
    "kcal": 518,
    "p": 26,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Tofu à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-100",
    "name": "Tofu sauce Crème légère & Moutarde avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 518,
    "p": 26,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Tofu",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Tofu à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-101",
    "name": "Dinde sauce Curry avec Riz basmati et Chou-fleur",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-102",
    "name": "Dinde sauce Soja & Gingembre avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-103",
    "name": "Dinde sauce Tomate & Basilic avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-104",
    "name": "Dinde sauce Crème légère & Moutarde avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-105",
    "name": "Dinde sauce Piment doux & Citron avec Riz basmati et Brocoli",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-106",
    "name": "Dinde sauce Lait de coco avec Riz basmati et Brocoli",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-107",
    "name": "Dinde sauce Huile d'olive & Herbes avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 72,
    "f": 14,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Dinde à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-108",
    "name": "Dinde sauce Curry avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-109",
    "name": "Dinde sauce Soja & Gingembre avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-110",
    "name": "Dinde sauce Tomate & Basilic avec Pâtes complètes et Courgette",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-111",
    "name": "Dinde sauce Crème légère & Moutarde avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-112",
    "name": "Dinde sauce Piment doux & Citron avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-113",
    "name": "Dinde sauce Lait de coco avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-114",
    "name": "Dinde sauce Huile d'olive & Herbes avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 495,
    "p": 41,
    "c": 62,
    "f": 15,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-115",
    "name": "Dinde sauce Curry avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-116",
    "name": "Dinde sauce Soja & Gingembre avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-117",
    "name": "Dinde sauce Tomate & Basilic avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-118",
    "name": "Dinde sauce Crème légère & Moutarde avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-119",
    "name": "Dinde sauce Piment doux & Citron avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-120",
    "name": "Dinde sauce Lait de coco avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-121",
    "name": "Dinde sauce Huile d'olive & Herbes avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 287,
    "p": 41,
    "c": 26,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Dinde à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-122",
    "name": "Dinde sauce Curry avec Quinoa et Carottes",
    "meal": "dîner",
    "kcal": 503,
    "p": 41,
    "c": 61,
    "f": 18,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Dinde à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-123",
    "name": "Dinde sauce Soja & Gingembre avec Quinoa et Courgette",
    "meal": "dîner",
    "kcal": 503,
    "p": 41,
    "c": 61,
    "f": 18,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Dinde à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-124",
    "name": "Dinde sauce Tomate & Basilic avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 503,
    "p": 41,
    "c": 61,
    "f": 18,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Dinde à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-125",
    "name": "Dinde sauce Crème légère & Moutarde avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 503,
    "p": 41,
    "c": 61,
    "f": 18,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Dinde",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Dinde à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-126",
    "name": "Crevettes sauce Curry avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-127",
    "name": "Crevettes sauce Soja & Gingembre avec Riz basmati et Chou-fleur",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-128",
    "name": "Crevettes sauce Tomate & Basilic avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-129",
    "name": "Crevettes sauce Crème légère & Moutarde avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-130",
    "name": "Crevettes sauce Piment doux & Citron avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-131",
    "name": "Crevettes sauce Lait de coco avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-132",
    "name": "Crevettes sauce Huile d'olive & Herbes avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Crevettes à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-133",
    "name": "Crevettes sauce Curry avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-134",
    "name": "Crevettes sauce Soja & Gingembre avec Pâtes complètes et Brocoli",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-135",
    "name": "Crevettes sauce Tomate & Basilic avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-136",
    "name": "Crevettes sauce Crème légère & Moutarde avec Pâtes complètes et Poivron",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-137",
    "name": "Crevettes sauce Piment doux & Citron avec Pâtes complètes et Brocoli",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-138",
    "name": "Crevettes sauce Lait de coco avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-139",
    "name": "Crevettes sauce Huile d'olive & Herbes avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 465,
    "p": 35,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Crevettes à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-140",
    "name": "Crevettes sauce Curry avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-141",
    "name": "Crevettes sauce Soja & Gingembre avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-142",
    "name": "Crevettes sauce Tomate & Basilic avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-143",
    "name": "Crevettes sauce Crème légère & Moutarde avec Patates douces et Haricots verts",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-144",
    "name": "Crevettes sauce Piment doux & Citron avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-145",
    "name": "Crevettes sauce Lait de coco avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-146",
    "name": "Crevettes sauce Huile d'olive & Herbes avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 257,
    "p": 35,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Crevettes à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-147",
    "name": "Crevettes sauce Curry avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 473,
    "p": 35,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Crevettes à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-148",
    "name": "Crevettes sauce Soja & Gingembre avec Quinoa et Carottes",
    "meal": "dîner",
    "kcal": 473,
    "p": 35,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Crevettes à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-149",
    "name": "Crevettes sauce Tomate & Basilic avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 473,
    "p": 35,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Crevettes à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-150",
    "name": "Crevettes sauce Crème légère & Moutarde avec Quinoa et Chou-fleur",
    "meal": "dîner",
    "kcal": 473,
    "p": 35,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Crevettes",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Crevettes à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-151",
    "name": "Lentilles sauce Curry avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-152",
    "name": "Lentilles sauce Soja & Gingembre avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-153",
    "name": "Lentilles sauce Tomate & Basilic avec Riz basmati et Tomates cerises",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-154",
    "name": "Lentilles sauce Crème légère & Moutarde avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-155",
    "name": "Lentilles sauce Piment doux & Citron avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-156",
    "name": "Lentilles sauce Lait de coco avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-157",
    "name": "Lentilles sauce Huile d'olive & Herbes avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 72,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Lentilles à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-158",
    "name": "Lentilles sauce Curry avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-159",
    "name": "Lentilles sauce Soja & Gingembre avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-160",
    "name": "Lentilles sauce Tomate & Basilic avec Pâtes complètes et Poivron",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-161",
    "name": "Lentilles sauce Crème légère & Moutarde avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-162",
    "name": "Lentilles sauce Piment doux & Citron avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-163",
    "name": "Lentilles sauce Lait de coco avec Pâtes complètes et Haricots verts",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-164",
    "name": "Lentilles sauce Huile d'olive & Herbes avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 855,
    "p": 43,
    "c": 62,
    "f": 13,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Lentilles à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-165",
    "name": "Lentilles sauce Curry avec Patates douces et Tomates cerises",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-166",
    "name": "Lentilles sauce Soja & Gingembre avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-167",
    "name": "Lentilles sauce Tomate & Basilic avec Patates douces et Tomates cerises",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-168",
    "name": "Lentilles sauce Crème légère & Moutarde avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-169",
    "name": "Lentilles sauce Piment doux & Citron avec Patates douces et Brocoli",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-170",
    "name": "Lentilles sauce Lait de coco avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-171",
    "name": "Lentilles sauce Huile d'olive & Herbes avec Patates douces et Chou-fleur",
    "meal": "dîner",
    "kcal": 647,
    "p": 43,
    "c": 26,
    "f": 12,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Lentilles à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-172",
    "name": "Lentilles sauce Curry avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 863,
    "p": 43,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Lentilles à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-173",
    "name": "Lentilles sauce Soja & Gingembre avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 863,
    "p": 43,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Lentilles à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-174",
    "name": "Lentilles sauce Tomate & Basilic avec Quinoa et Courgette",
    "meal": "dîner",
    "kcal": 863,
    "p": 43,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Lentilles à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-175",
    "name": "Lentilles sauce Crème légère & Moutarde avec Quinoa et Brocoli",
    "meal": "dîner",
    "kcal": 863,
    "p": 43,
    "c": 61,
    "f": 16,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Lentilles",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Brocoli",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Lentilles à la poêle. Ajoute le Brocoli coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-176",
    "name": "Pois chiches sauce Curry avec Riz basmati et Courgette",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-177",
    "name": "Pois chiches sauce Soja & Gingembre avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-178",
    "name": "Pois chiches sauce Tomate & Basilic avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-179",
    "name": "Pois chiches sauce Crème légère & Moutarde avec Riz basmati et Épinards",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-180",
    "name": "Pois chiches sauce Piment doux & Citron avec Riz basmati et Carottes",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-181",
    "name": "Pois chiches sauce Lait de coco avec Riz basmati et Haricots verts",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-182",
    "name": "Pois chiches sauce Huile d'olive & Herbes avec Riz basmati et Poivron",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 72,
    "f": 20,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Riz basmati",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Riz basmati. Saisis le Pois chiches à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-183",
    "name": "Pois chiches sauce Curry avec Pâtes complètes et Carottes",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-184",
    "name": "Pois chiches sauce Soja & Gingembre avec Pâtes complètes et Tomates cerises",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-185",
    "name": "Pois chiches sauce Tomate & Basilic avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-186",
    "name": "Pois chiches sauce Crème légère & Moutarde avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-187",
    "name": "Pois chiches sauce Piment doux & Citron avec Pâtes complètes et Poivron",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-188",
    "name": "Pois chiches sauce Lait de coco avec Pâtes complètes et Épinards",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-189",
    "name": "Pois chiches sauce Huile d'olive & Herbes avec Pâtes complètes et Chou-fleur",
    "meal": "dîner",
    "kcal": 870,
    "p": 34,
    "c": 62,
    "f": 21,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Pâtes complètes",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Pâtes complètes. Saisis le Pois chiches à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-190",
    "name": "Pois chiches sauce Curry avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-191",
    "name": "Pois chiches sauce Soja & Gingembre avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-192",
    "name": "Pois chiches sauce Tomate & Basilic avec Patates douces et Courgette",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Courgette",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Courgette coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-193",
    "name": "Pois chiches sauce Crème légère & Moutarde avec Patates douces et Épinards",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Épinards",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Épinards coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-194",
    "name": "Pois chiches sauce Piment doux & Citron avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Piment doux",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Piment doux & Citron et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-195",
    "name": "Pois chiches sauce Lait de coco avec Patates douces et Carottes",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Lait de coco",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Lait de coco et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-196",
    "name": "Pois chiches sauce Huile d'olive & Herbes avec Patates douces et Poivron",
    "meal": "dîner",
    "kcal": 662,
    "p": 34,
    "c": 26,
    "f": 19,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Patates douces",
        80,
        "Épicerie"
      ],
      [
        "Poivron",
        150,
        "Légumes"
      ],
      [
        "Huile d'olive",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Patates douces. Saisis le Pois chiches à la poêle. Ajoute le Poivron coupé en morceaux. Mélange avec la sauce Huile d'olive & Herbes et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-197",
    "name": "Pois chiches sauce Curry avec Quinoa et Chou-fleur",
    "meal": "dîner",
    "kcal": 878,
    "p": 34,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Chou-fleur",
        150,
        "Légumes"
      ],
      [
        "Curry",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Pois chiches à la poêle. Ajoute le Chou-fleur coupé en morceaux. Mélange avec la sauce Curry et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-198",
    "name": "Pois chiches sauce Soja & Gingembre avec Quinoa et Carottes",
    "meal": "dîner",
    "kcal": 878,
    "p": 34,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Carottes",
        150,
        "Légumes"
      ],
      [
        "Soja",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Pois chiches à la poêle. Ajoute le Carottes coupé en morceaux. Mélange avec la sauce Soja & Gingembre et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-199",
    "name": "Pois chiches sauce Tomate & Basilic avec Quinoa et Tomates cerises",
    "meal": "dîner",
    "kcal": 878,
    "p": 34,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Tomates cerises",
        150,
        "Légumes"
      ],
      [
        "Tomate",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Pois chiches à la poêle. Ajoute le Tomates cerises coupé en morceaux. Mélange avec la sauce Tomate & Basilic et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-gen-200",
    "name": "Pois chiches sauce Crème légère & Moutarde avec Quinoa et Haricots verts",
    "meal": "dîner",
    "kcal": 878,
    "p": 34,
    "c": 61,
    "f": 24,
    "time": 20,
    "cost": 2.5,
    "micros": [
      "Vitamines",
      "Fibres",
      "Minéraux"
    ],
    "ing": [
      [
        "Pois chiches",
        150,
        "Principal"
      ],
      [
        "Quinoa",
        80,
        "Épicerie"
      ],
      [
        "Haricots verts",
        150,
        "Légumes"
      ],
      [
        "Crème légère",
        10,
        "Divers"
      ]
    ],
    "steps": "Fais cuire le Quinoa. Saisis le Pois chiches à la poêle. Ajoute le Haricots verts coupé en morceaux. Mélange avec la sauce Crème légère & Moutarde et laisse mijoter quelques minutes. Sers chaud."
  },
  {
    "id": "r-s1",
    "name": "Muffins protéinés myrtille",
    "meal": "collation",
    "kcal": 250,
    "p": 20,
    "c": 30,
    "f": 5,
    "time": 25,
    "cost": 1.5,
    "micros": [
      "Antioxydants"
    ],
    "ing": [
      [
        "Avoine",
        50,
        "Epicerie"
      ],
      [
        "Whey",
        30,
        "Suppléments"
      ],
      [
        "Myrtilles",
        50,
        "Fruits"
      ]
    ],
    "steps": "Mélange, cuis 20 min au four."
  },
  {
    "id": "r-s2",
    "name": "Bowl Fromage blanc & Granola",
    "meal": "collation",
    "kcal": 300,
    "p": 25,
    "c": 35,
    "f": 8,
    "time": 5,
    "cost": 1,
    "micros": [
      "Calcium"
    ],
    "ing": [
      [
        "Fromage blanc",
        200,
        "Frais"
      ],
      [
        "Granola",
        40,
        "Epicerie"
      ]
    ],
    "steps": "Mélange."
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

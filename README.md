# RECOMP — Coach de remise en forme

Application web installable (PWA) de recomposition corporelle, pensée comme un **compagnon de remise en forme clair et accessible** : interface épurée façon app santé (cartes claires, ombres douces, palette apaisée, thème clair par défaut + variante sombre), avec une couche de **progression motivante** discrète — niveaux, XP, objectifs du jour, stats qui montent avec ton activité réelle.

100 % hors-ligne, personnalisable, et liée à tes exercices réels.

---

## La progression (motivante, jamais culpabilisante)

Tout ce que tu fais réellement nourrit ta progression :

| Élément | Comment ça monte |
|---|---|
| **XP / Niveau** | +120 par séance, +6 par série, +80 par record, +30 par journal, +20 par jour de repas enregistré |
| **Rangs** | E → D (niv 5) → C (niv 10) → B (niv 15) → A (niv 20) → S (niv 25) |
| **5 statistiques** | FORCE, AGILITÉ, VITALITÉ, INTELLIGENCE, PERCEPTION — **dérivées de ton activité réelle** |
| **Points à répartir** | 3 points libres à chaque niveau, à répartir manuellement dans tes stats |
| **PV / PM / Endurance** | calculés depuis VITALITÉ et INTELLIGENCE |
| **Compétences** | 10 compétences débloquées par paliers (niveau, série, records, volume) |
| **Ton évolution** | toi cette semaine, comparé à toi il y a 7 jours |

Les stats sont liées au **type** d'exercice : le volume en force nourrit la FORCE, le cardio et les répétitions l'AGILITÉ, la régularité la VITALITÉ, le journal/les repas l'INTELLIGENCE, le suivi du RPE et la série la PERCEPTION.

> **Bien-être d'abord.** Le programme intègre des jours de repos (2 à 4 séances/semaine). Un objectif manqué ne « punit » rien de réel — un jour off est explicitement normal et fait partie de la progression.

---

## Les 5 onglets (navigation par gestes)

On glisse horizontalement entre les panneaux ; la barre d'onglets du haut suit.

1. **Profil** — ta vue d'ensemble : rang, niveau, PV/PM, les 5 stats avec boutons `[+]`, objectifs du jour et de la semaine.
2. **Séance** — construis ta séance librement, édite les séries, et parcours le catalogue complet de **110 exercices** (8 catégories, dont une section **Mobilité / échauffement**) avec recherche par nom ou muscle.
3. **Nutrition** — générateur de journée selon tes cibles, **56 recettes** détaillées (micros, tags, astuce du chef, coût, batch), recherche par recette ou ingrédient, liste de courses par rayon.
4. **Coach** — l'assistant hors-ligne : conseils du jour corrélés à ton sommeil/RPE, analyse hebdo, et réponses à tes questions (base de 52 fiches).
5. **Progrès** — ton évolution semaine sur semaine, journal (poids/sommeil/énergie), courbes 30 jours, records (1RM Epley), titres et compétences débloqués.

---

## Personnalisation (réglages)

- **Couleur d'accent** : 6 presets (Bleu, Turquoise, Vert, Indigo, Corail, Ambre) + **couleur libre** (sélecteur natif). Toute l'interface s'adapte.
- **Taille du texte** : 14 → 20 px.
- **Thème** : Clair (par défaut), Sombre, ou Auto (suit le système).
- **Matériel** : 12 options (haltères, barre de traction, chaise romaine, banc, élastiques, kettlebell, anneaux, barre+disques, roue abdominale, corde, step, poids du corps).
- **Exclusions alimentaires** : 15 (œufs, oignons/ail, lactose, gluten, poisson, viande rouge, volaille, légumineuses, fruits à coque, soja, sucre, alcool, caféine, porc, vegan).
- **Cibles nutrition** éditables, **rappels** locaux, **export JSON**.

Le programme se régénère automatiquement selon ton matériel et tes blessures (la contrainte clavicule remplace tout développé standard par des variantes adaptées : développé épaules → pompes pike, dips → pompes surélevées).

---

## Structure des fichiers

```
recomp/
├── index.html              Shell + anti-flash thème + police
├── manifest.webmanifest     PWA (clair #F4F6FA)
├── sw.js                    Service worker (cache recomp-v11, hors-ligne)
├── css/
│   └── style.css            Interface « santé » : cartes claires arrondies, ombres douces
├── js/
│   ├── config.js            Clés Supabase (mode LOCAL auto si absentes)
│   ├── exercises.js         110 exercices détaillés (technique, erreurs, régressions, mobilité)
│   ├── knowledge.js         52 fiches de connaissance (coach)
│   ├── data.js              Programme, 56 recettes, badges, tips, catalogues matériel/exclusions/couleurs
│   ├── coach.js             Moteur du coach scripté (signaux, conseils, analyse, Q/R)
│   ├── rpg.js               Moteur de progression : XP, niveaux, rangs, stats, points, compétences
│   └── app.js               Application (données, rendu, hors-ligne, charts)
├── icons/                   Icône de l'app (192, 512, maskable)
└── supabase/
    └── schema.sql           Schéma multi-comptes (profiles + logs, RLS)
```

## Police

Inter (interface santé, très lisible) — chargée depuis Google Fonts, avec repli sur la police système.

## Installation

1. Héberger le dossier (GitHub Pages, Netlify, ou tout serveur statique).
2. Ouvrir sur mobile → « Ajouter à l'écran d'accueil ».
3. **Mode LOCAL** par défaut (données sur l'appareil). Pour le multi-appareils : créer un projet Supabase gratuit, exécuter `supabase/schema.sql`, renseigner l'URL + clé anon dans `js/config.js`.

Aucune dépendance, aucun build. Fonctionne entièrement hors-ligne après la première visite.

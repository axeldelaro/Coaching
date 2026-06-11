# RECOMP — « LE SYSTÈME »

Application web installable (PWA) de recomposition corporelle, transformée en **véritable jeu de progression** inspiré de l'interface de *Solo Leveling* : fenêtres « Système » translucides et lumineuses, montées de niveau, points d'aptitude à répartir, rangs de Chasseur, PV/PM, classe qui évolue selon ton style d'entraînement.

100 % hors-ligne, personnalisable, et liée à tes exercices réels.

---

## Le jeu de progression

Tout ce que tu fais réellement nourrit ta fiche de Chasseur :

| Élément | Comment ça monte |
|---|---|
| **XP / Niveau** | +120 par donjon (séance), +6 par série, +80 par record, +30 par carnet, +20 par jour de repas loggé |
| **Rang de Chasseur** | E → D (niv 5) → C (niv 10) → B (niv 15) → A (niv 20) → S (niv 25) |
| **5 statistiques** | FORCE, AGILITÉ, VITALITÉ, INTELLIGENCE, PERCEPTION — **dérivées de ton activité réelle** |
| **Points d'aptitude** | 3 points libres à chaque niveau, à répartir manuellement dans tes stats |
| **PV / PM / Endurance** | calculés depuis VITALITÉ et INTELLIGENCE |
| **Classe** | évolue selon ta stat dominante : Combattant→Berserker→Monarque de Fer, Rôdeur→Assassin→Monarque des Ombres, etc. |
| **Compétences** | 10 compétences débloquées par paliers (niveau, série, records, volume) |
| **Duel d'Ombre** | toi (cette semaine) vs ton ombre (toi il y a 7 jours) |

Les stats sont liées au **type** d'exercice : le volume en force nourrit la FORCE, le cardio et les répétitions l'AGILITÉ, la régularité la VITALITÉ, le carnet/les repas l'INTELLIGENCE, le suivi du RPE et la série la PERCEPTION.

> **Bien-être d'abord.** Le programme intègre des jours de repos (2 à 4 donjons/semaine). Les quêtes ratées ne « punissent » rien de réel — un jour off est explicitement normal et fait partie de la progression.

---

## Les 5 fenêtres (navigation par gestes, sans barre d'icônes)

On glisse horizontalement entre les panneaux ; le bandeau du haut suit.

1. **STATUT** — la fenêtre iconique : rang, niveau, classe, PV/PM, les 5 stats avec boutons `[+]` d'allocation, quête journalière (« entrer dans le donjon ») et hebdomadaire.
2. **DONJON** — ton programme (les « portails »), édition des séries, substitution de compétences, et le grimoire complet de **67 exercices**.
3. **RATION** — nutrition : générateur de journée selon tes cibles, recettes (micros/coût/batch), liste de réapprovisionnement par rayon.
4. **SYSTÈME** — le coach scripté hors-ligne : conseils du jour corrélés à ton sommeil/RPE, analyse hebdo, et réponses à tes questions (base de 52 fiches).
5. **ARCHIVES** — duel d'ombre, carnet (poids/sommeil/énergie), courbes 30 jours, records (1RM Epley), titres et compétences débloqués.

---

## Personnalisation (réglages)

- **Couleur du Système** : 6 presets (Cyan Système, Bleu Mana, Violet Monarque, Or Rang S, Vert Portail, Magenta Ombre) + **couleur libre** (sélecteur natif). Le glow de toute l'interface s'adapte.
- **Taille du texte** : 14 → 20 px.
- **Thème** : Nuit (par défaut), Papier (clair), ou Auto (suit le système).
- **Matériel** : 12 options (haltères, barre de traction, chaise romaine, banc, élastiques, kettlebell, anneaux, barre+disques, roue abdominale, corde, step, poids du corps).
- **Exclusions alimentaires** : 15 (œufs, oignons/ail, lactose, gluten, poisson, viande rouge, volaille, légumineuses, fruits à coque, soja, sucre, alcool, caféine, porc, vegan).
- **Cibles nutrition** éditables, **rappels** locaux, **export JSON**.

Le programme se régénère automatiquement selon ton matériel et tes blessures (la contrainte clavicule remplace tout développé standard par des variantes adaptées : développé épaules → pompes pike, dips → pompes surélevées).

---

## Structure des fichiers

```
recomp/
├── index.html              Shell + anti-flash thème + polices Système
├── manifest.webmanifest     PWA (sombre #04060E)
├── sw.js                    Service worker (cache recomp-v4, hors-ligne)
├── css/
│   └── style.css            Interface « Système » : fenêtres lumineuses, coins angulaires
├── js/
│   ├── config.js            Clés Supabase (mode LOCAL auto si absentes)
│   ├── exercises.js         67 exercices détaillés (technique, erreurs, régressions)
│   ├── knowledge.js         52 fiches de connaissance (coach)
│   ├── data.js              Programme, 25 recettes, badges, tips, catalogues matériel/exclusions/couleurs
│   ├── coach.js             Moteur du coach scripté (signaux, conseils, analyse, Q/R)
│   ├── rpg.js               Moteur de jeu : XP, niveaux, rangs, stats, points, PV/PM, classe, compétences, duel
│   └── app.js               Application (données, rendu, hors-ligne, charts)
├── icons/                   Portail lumineux (192, 512, maskable)
└── supabase/
    └── schema.sql           Schéma multi-comptes (profiles + logs, RLS)
```

## Polices

Orbitron (affichage/chiffres), Rajdhani (texte), Share Tech Mono (terminal « [ SYSTÈME ] »).

## Installation

1. Héberger le dossier (GitHub Pages, Netlify, ou tout serveur statique).
2. Ouvrir sur mobile → « Ajouter à l'écran d'accueil ».
3. **Mode LOCAL** par défaut (données sur l'appareil). Pour le multi-appareils : créer un projet Supabase gratuit, exécuter `supabase/schema.sql`, renseigner l'URL + clé anon dans `js/config.js`.

Aucune dépendance, aucun build. Fonctionne entièrement hors-ligne après la première visite.

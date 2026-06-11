# RECOMP — Coach entraînement & nutrition (PWA)

Application web installable (Android/iOS/desktop) : programme d'entraînement modulable, suivi de séances avec RPE et minuteur de repos, nutrition avec recettes et liste de courses auto-générée, coach scripté qui s'adapte à tes données, carnet avec graphiques, rappels.

- **100 % gratuit** : hébergement GitHub Pages + Supabase (offre gratuite).
- **Multi-comptes** : chaque utilisateur (toi + tes amis) a son compte, son anamnèse, son programme adapté.
- **Hors-ligne** : l'app fonctionne sans réseau ; les données se synchronisent au retour de la connexion.
- **Sécurité** : données chiffrées au repos (AES-256) côté Supabase, isolation par compte via Row Level Security.

---

## 1 · Créer la base Supabase (5 min)

1. Crée un compte gratuit sur [supabase.com](https://supabase.com) → **New project** (choisis une région UE).
2. Dans le projet : **SQL Editor** → colle le contenu de `supabase/schema.sql` → **Run**. Cela crée les tables `profiles` et `logs` avec les règles de sécurité.
3. **Authentication → Providers → Email** : vérifie que Email est activé.
   - Optionnel : désactive « Confirm email » pour que tes amis puissent se connecter sans clic de confirmation.
4. **Project Settings → API** : copie **Project URL** et **anon public key**.
5. Ouvre `js/config.js` et colle les deux valeurs.

> La clé « anon » est publique par conception : la sécurité repose sur les policies RLS du schéma (chaque utilisateur ne peut lire/écrire que ses propres lignes), pas sur le secret de la clé.

**Sans configuration**, l'app démarre en *mode local* : tout fonctionne mais les données restent sur l'appareil (pratique pour tester).

## 2 · Déployer sur GitHub Pages (5 min)

1. Crée un dépôt GitHub (public) et pousse tout le contenu de ce dossier à la racine.
2. **Settings → Pages → Source : Deploy from a branch** → branche `main`, dossier `/ (root)` → **Save**.
3. Ton app est en ligne sous `https://ton-pseudo.github.io/ton-repo/` après ~1 minute.

Le routage utilise des ancres (`#/...`) : aucune configuration serveur nécessaire, pas de 404.

## 3 · Installer sur Android

1. Ouvre l'URL dans **Chrome**.
2. Menu ⋮ → **Ajouter à l'écran d'accueil** (ou bannière « Installer l'application »).
3. L'app s'ouvre en plein écran, fonctionne hors-ligne, et apparaît comme une app native.

## Partager avec des amis

Envoie-leur simplement l'URL. Chacun crée son compte ; l'anamnèse (blessures, matériel, allergies, objectif) génère un programme et des cibles caloriques personnalisés. Les données sont strictement isolées par compte.

---

## Fonctionnalités

| Onglet | Contenu |
|---|---|
| **Accueil** | Anneau de progression hebdo, kcal du jour, séance suivante, conseil prioritaire du coach, tip du jour |
| **Entraîner** | Programme modulable (variantes ↔, séries −/+), lecteur de séance avec saisie kg/reps/RPE, minuteur de repos (vibration + notification), brouillon auto-sauvegardé |
| **Repas** | Cibles Mifflin-St Jeor, barres de macros en temps réel, 10 recettes filtrées selon allergies, fiches recettes |
| **Courses** | Menu de la semaine → liste agrégée par rayon, cases à cocher persistantes |
| **Coach** | Conseils quotidiens priorisés (pause, RPE, sommeil, tendance de poids, régularité), chat à réponses rapides, adaptation automatique de la séance du jour |
| **Carnet** | Poids/sommeil/énergie/notes quotidiens, graphique poids 30 j, séances/semaine vs objectif, historique des séances |
| **Réglages** | Rappels (séance, pesée, hydratation), cibles éditables, refaire l'anamnèse, export JSON complet, déconnexion |

## Limites connues (offre 100 % gratuite)

- **Rappels** : notifications locales uniquement (pas de serveur push). Elles se déclenchent si l'app est ouverte ou récemment ouverte en arrière-plan ; Android peut les retarder sur certaines surcouches agressives (Xiaomi, etc.).
- **Supabase free tier** : le projet se met en pause après ~1 semaine sans requête — il redémarre automatiquement à la prochaine connexion (quelques secondes de latence).
- **iOS** : installation possible via Safari → Partager → « Sur l'écran d'accueil » ; les notifications web y sont plus restreintes qu'Android.

## Pistes d'évolution

- Chiffrement côté client (WebCrypto) des notes du carnet avant envoi à Supabase.
- Notifications push serveur via Supabase Edge Functions + FCM.
- Partage de programmes entre amis (table `programs` publique en lecture).

## Structure

```
index.html              Shell de l'app
css/style.css           Design system (thème clair « clinique athlétique »)
js/config.js            ⚠️ À remplir : URL + clé anon Supabase
js/data.js              Programme par défaut, variantes, recettes, tips
js/coach.js             Moteur de règles du coach
js/app.js               Routeur, vues, couche données, rappels
sw.js                   Service worker (hors-ligne)
manifest.webmanifest    Manifest PWA
icons/                  Icônes 192/512 + maskable
supabase/schema.sql     Schéma + Row Level Security
```

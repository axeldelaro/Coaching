const fs = require('fs');
global.window = {};
require('./js/exercises.js');
const db = JSON.parse(fs.readFileSync('remote_db.json'));

const dict = {
  "pompes": "Push-up",
  "pompes_diamant": "Diamond_Push-up",
  "dips": "Triceps_Dip",
  "traction_barre": "Pull-up",
  "traction_australienne": "Inverted_Row",
  "squat_pdc": "Bodyweight_Squat",
  "fentes": "Dumbbell_Lunge",
  "gainage": "Plank",
  "burpees": "Burpee",
  "developpe_couche": "Barbell_Bench_Press",
  "souleve_de_terre": "Barbell_Deadlift",
  "squat_arriere": "Barbell_Squat",
  "curl_biceps": "Dumbbell_Bicep_Curl",
  "extension_triceps": "Cable_Triceps_Pushdown",
  "presse_cuisses": "Leg_Press",
  "leg_extension": "Leg_Extension",
  "leg_curl": "Seated_Leg_Curl",
  "oiseau": "Dumbbell_Rear_Delt_Row",
  "developpe_militaire": "Barbell_Overhead_Press",
  "tirage_poitrine": "Cable_Pulldown",
  "rowing_barre": "Barbell_Row",
  "elevation_laterale": "Dumbbell_Lateral_Raise",
  "mollets_debout": "Standing_Calf_Raise",
  "crunch": "Crunch",
  "ab_wheel": "Ab_Roller",
  "hip_thrust": "Barbell_Hip_Thrust",
  "developpe_incline": "Barbell_Incline_Bench_Press",
  "ecarte_couche": "Dumbbell_Fly",
  "pull_over": "Dumbbell_Pullover",
  "shrugs": "Dumbbell_Shrug"
};

const groupFallback = {
  "Pecs": "Barbell_Bench_Press",
  "Dos": "Pull-up",
  "Jambes": "Barbell_Squat",
  "Epaules": "Dumbbell_Seated_Shoulder_Press",
  "Bras": "Dumbbell_Bicep_Curl",
  "Abdos": "Crunch",
  "Cardio": "Burpee"
};

const exercises = window.EXLIB;
let mapped = 0;
exercises.forEach(e => {
  let eng = dict[e.id];
  let match = eng ? db.find(x => x.id === eng || x.id.includes(eng)) : null;
  if (!match) {
    const fallback = groupFallback[e.group] || "Push-up";
    match = db.find(x => x.id === fallback || x.id.includes(fallback));
  }
  
  if (match && match.images && match.images.length > 0) {
    e.img = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${match.images[0]}`;
    e.img_end = match.images.length > 1 ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${match.images[1]}` : e.img;
    mapped++;
  }
});

fs.writeFileSync('./js/exercises.js', 'window.EXLIB = ' + JSON.stringify(exercises, null, 2) + ';\n');
console.log(`Mapped ${mapped} exercises.`);

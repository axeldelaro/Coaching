const fs = require('fs');
global.window = {};
require('./js/exercises.js');
const db = JSON.parse(fs.readFileSync('remote_db.json', 'utf8'));

// Simple dictionary of English keywords for French IDs
const translationMap = {
  "goblet-squat": "goblet squat",
  "bulgarian-split": "bulgarian split squat",
  "rear-lunge": "reverse lunge",
  "walking-lunge": "walking lunge",
  "romanian-dl": "romanian deadlift",
  "single-rdl": "single leg romanian deadlift",
  "hip-thrust": "hip thrust",
  "calf-raise": "calf raise",
  "calf-single": "single leg calf raise",
  "sumo-squat": "sumo squat",
  "box-squat": "box squat",
  "pullup": "pull-up",
  "pullup-neutral": "neutral grip pull-up",
  "pullup-neg": "negative pull-up",
  "inverted-row": "inverted row",
  "db-row": "dumbbell row",
  "bent-row": "bent over row",
  "shrugs": "shrug",
  "superman": "superman",
  "back-ext": "back extension",
  "incline-pushup": "incline push-up",
  "pushup": "push-up",
  "dips-partial": "triceps dip",
  "knee-pushup": "kneeling push-up",
  "db-curl": "dumbbell curl",
  "conc-curl": "concentration curl",
  "kickback": "triceps kickback",
  "plank": "plank",
  "plank-side": "side plank",
  "hollow": "hollow body hold",
  "leg-raise": "leg raise",
  "weighted-crunch": "weighted crunch",
  "russian-twist": "russian twist",
  "wall-sit": "wall sit",
  "step-up": "step up",
  "kb-swing": "kettlebell swing",
  "hip-thrust-db": "dumbbell hip thrust",
  "glute-bridge": "glute bridge",
  "lateral-lunge": "lateral lunge",
  "pullup-supine": "chin-up",
  "pullup-weighted": "weighted pull-up",
  "band-row": "band row",
  "face-pull-band": "face pull",
  "ring-row": "ring row",
  "pike-pushup": "pike push-up",
  "handstand-pushup": "handstand push-up",
  "db-press": "dumbbell bench press",
  "db-shoulder-press": "dumbbell shoulder press",
  "db-fly": "dumbbell fly",
  "band-pushdown": "band pushdown",
  "hammer-curl": "hammer curl",
  "overhead-tricep": "overhead triceps extension",
  "band-curl": "band curl",
  "dead-bug": "dead bug",
  "ab-wheel": "ab roller",
  "bicycle-crunch": "bicycle crunch",
  "hanging-knee-raise": "hanging knee raise",
  "toes-to-bar": "toes to bar",
  "burpee": "burpee",
  "mountain-climber": "mountain climber",
  "jump-rope": "jump rope",
  "lateral-raise": "lateral raise",
  "rear-delt-fly": "rear delt fly",
  "band-pull-apart": "band pull apart",
  "y-raise": "y raise",
  "nordic-curl": "nordic curl",
  "pistol-squat": "pistol squat",
  "frog-pump": "frog pump",
  "pallof-press": "pallof press",
  "bear-crawl": "bear crawl",
  "bird-dog": "bird dog",
  "diamond-pushup": "diamond push-up",
  "wrist-curl": "wrist curl",
  "high-knees": "high knees",
  "plank-jack": "plank jack",
  "cossack-squat": "cossack squat",
  "jump-squat": "jump squat",
  "curtsy-lunge": "curtsy lunge",
  "single-glute-bridge": "single leg glute bridge",
  "sissy-squat": "sissy squat",
  "kb-goblet-clean": "kettlebell clean",
  "deadlift": "deadlift",
  "good-morning": "good morning",
  "band-lat-pulldown": "band lat pulldown",
  "pullover-db": "dumbbell pullover",
  "decline-pushup": "decline push-up",
  "archer-pushup": "archer push-up",
  "band-chest-press": "band chest press",
  "ring-pushup": "ring push-up",
  "arnold-press": "arnold press",
  "front-raise": "front raise",
  "band-lateral-raise": "band lateral raise",
  "cuban-rotation": "cuban rotation",
  "reverse-curl": "reverse curl",
  "zottman-curl": "zottman curl",
  "bench-dip": "bench dip",
  "spider-curl": "spider curl",
  "v-up": "v-up",
  "flutter-kicks": "flutter kicks",
  "copenhagen-plank": "copenhagen plank",
  "hollow-rock": "hollow rock",
  "jumping-jack": "jumping jack",
  "skater": "skater",
  "shadow-box": "shadow box",
  "cat-cow": "cat cow",
  "world-greatest": "world's greatest stretch",
  "hip-flexor-stretch": "hip flexor stretch",
  "thoracic-rotation": "thoracic rotation",
  "shoulder-dislocate": "shoulder dislocate",
  "ankle-mobility": "ankle mobility",
  "hack-squat-db": "hack squat",
  "db-leg-curl": "dumbbell leg curl",
  "split-squat": "split squat",
  "seal-row": "seal row",
  "meadows-row": "meadows row",
  "superman-hold": "superman hold",
  "floor-press": "floor press",
  "svend-press": "svend press",
  "close-grip-pushup": "close grip push-up",
  "upright-row": "upright row",
  "lu-raise": "lu raise",
  "scarecrow": "scarecrow",
  "preacher-curl": "preacher curl",
  "cross-body-curl": "cross body curl",
  "skull-crusher": "skull crusher",
  "jm-press": "jm press",
  "dragon-flag": "dragon flag",
  "suitcase-carry": "suitcase carry",
  "box-jump": "box jump",
  "sprawl": "sprawl"
};

// Fuzzy match function
function findMatch(keyword) {
  if (!keyword) return null;
  const kw = keyword.toLowerCase().replace(/-/g, ' ');
  let exact = db.find(e => e.name.toLowerCase() === kw || e.id.toLowerCase() === kw.replace(/ /g, '_'));
  if (exact) return exact;
  
  // Try partial
  let partial = db.find(e => e.name.toLowerCase().includes(kw));
  if (partial) return partial;

  // Try split parts
  const parts = kw.split(' ');
  for (let p of parts) {
    if (p.length > 3) {
      let pMatch = db.find(e => e.name.toLowerCase().includes(p));
      if (pMatch) return pMatch;
    }
  }
  return null;
}

let mappedCount = 0;
window.EXLIB.forEach(ex => {
  const trans = translationMap[ex.id] || ex.id;
  const match = findMatch(trans);
  if (match && match.images && match.images.length > 0) {
    ex.img = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + match.images[0];
    ex.img_end = match.images.length > 1 ? 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + match.images[1] : ex.img;
    mappedCount++;
  } else {
    // If no match found, don't fallback to group generic, let it be empty or use a very generic default
    // We will leave it empty if not found so we don't have dupes
    ex.img = null;
    ex.img_end = null;
  }
});

let output = 'window.EXLIB = ' + JSON.stringify(window.EXLIB, null, 2) + ';\nwindow.EXLIB_GROUPS = [...new Set(window.EXLIB.map(e => e.group))];';
fs.writeFileSync('./js/exercises.js', output);
console.log(`Mapped ${mappedCount} out of ${window.EXLIB.length} exercises precisely.`);

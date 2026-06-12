const fs = require('fs');

const bases = [
  { p: 'Poulet', type: 'viande', kcal: 150, pro: 30, f: 3 },
  { p: 'Bœuf', type: 'viande', kcal: 250, pro: 26, f: 15 },
  { p: 'Saumon', type: 'poisson', kcal: 200, pro: 20, f: 13 },
  { p: 'Tofu', type: 'végé', kcal: 120, pro: 14, f: 6 },
  { p: 'Dinde', type: 'viande', kcal: 110, pro: 24, f: 2 },
  { p: 'Crevettes', type: 'poisson', kcal: 90, pro: 20, f: 1 },
  { p: 'Lentilles', type: 'végé', kcal: 350, pro: 25, f: 1 }, // 100g cru
  { p: 'Pois chiches', type: 'végé', kcal: 360, pro: 19, f: 6 }
];

const carbs = [
  { c: 'Riz basmati', kcal: 350, car: 78, f: 1 },
  { c: 'Pâtes complètes', kcal: 350, car: 65, f: 2 },
  { c: 'Patates douces', kcal: 90, car: 20, f: 0 },
  { c: 'Quinoa', kcal: 360, car: 64, f: 6 },
  { c: 'Semoule', kcal: 360, car: 72, f: 2 },
  { c: 'Pommes de terre', kcal: 85, car: 19, f: 0 }
];

const veggies = ['Brocoli', 'Courgette', 'Poivron', 'Épinards', 'Carottes', 'Haricots verts', 'Chou-fleur', 'Tomates cerises'];
const sauces = ['Curry', 'Soja & Gingembre', 'Tomate & Basilic', 'Crème légère & Moutarde', 'Piment doux & Citron', 'Lait de coco', 'Huile d\'olive & Herbes'];

let recipes = [];
let idCount = 1;

for (let base of bases) {
  let count = 0;
  for (let carb of carbs) {
    for (let sauce of sauces) {
      if (count >= 25) break; // 25 recipes per food base
      let veg = veggies[Math.floor(Math.random() * veggies.length)];
      
      // Calculate realistic macros for a meal
      let rKcal = Math.round(base.kcal * 1.5 + carb.kcal * 0.8 + 50); // 150g meat + 80g carb + sauce/veg
      let rPro = Math.round(base.pro * 1.5 + 5);
      let rCar = Math.round(carb.car * 0.8 + 10);
      let rFat = Math.round(base.f * 1.5 + carb.f * 0.8 + 10);
      
      recipes.push({
        id: `r-gen-${idCount++}`,
        name: `${base.p} sauce ${sauce} avec ${carb.c} et ${veg}`,
        meal: 'dîner',
        kcal: rKcal, p: rPro, c: rCar, f: rFat,
        time: 20, cost: 2.5,
        micros: ['Vitamines', 'Fibres', 'Minéraux'],
        ing: [
          [base.p, 150, 'Principal'],
          [carb.c, 80, 'Épicerie'],
          [veg, 150, 'Légumes'],
          [sauce.split(' & ')[0], 10, 'Divers']
        ],
        steps: `Fais cuire le ${carb.c}. Saisis le ${base.p} à la poêle. Ajoute le ${veg} coupé en morceaux. Mélange avec la sauce ${sauce} et laisse mijoter quelques minutes. Sers chaud.`
      });
      count++;
    }
  }
}

// Generate breakfast and snacks to round out the DB
const snacks = [
  { id: 'r-s1', name: 'Muffins protéinés myrtille', meal: 'collation', kcal: 250, p: 20, c: 30, f: 5, time: 25, cost: 1.5, micros: ['Antioxydants'], ing: [['Avoine', 50, 'Epicerie'], ['Whey', 30, 'Suppléments'], ['Myrtilles', 50, 'Fruits']], steps: 'Mélange, cuis 20 min au four.' },
  { id: 'r-s2', name: 'Bowl Fromage blanc & Granola', meal: 'collation', kcal: 300, p: 25, c: 35, f: 8, time: 5, cost: 1.0, micros: ['Calcium'], ing: [['Fromage blanc', 200, 'Frais'], ['Granola', 40, 'Epicerie']], steps: 'Mélange.' }
];

recipes.push(...snacks);

let code = fs.readFileSync('./js/data.js', 'utf8');
code = code.replace(/window\.RECIPES\s*=\s*\[[\s\S]*?\];/g, `window.RECIPES = ${JSON.stringify(recipes, null, 2)};`);
fs.writeFileSync('./js/data.js', code);

console.log(`Generated and injected ${recipes.length} recipes.`);

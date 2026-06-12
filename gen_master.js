const fs = require('fs');

const masterRecipes = [
  // 1. Bowls & Salades
  { id: 'r-m1', name: 'Le Bowl Poulet & Féculents', meal: 'déjeuner', kcal: 500, p: 40, c: 50, f: 15, time: 15, cost: 2.5, tags: ['sans lactose'], micros: ['Protéines maigres', 'Fibres'],
    ing: [
      ['Poulet', 150, 'Principal', { swaps: ['Dinde', 'Tofu', 'Crevettes', 'Œufs (x3)'] }],
      ['Riz basmati', 80, 'Épicerie', { swaps: ['Quinoa', 'Pâtes complètes', 'Boulgour', 'Patate douce'] }],
      ['Brocoli', 150, 'Légumes', { swaps: ['Courgette', 'Haricots verts', 'Épinards', 'Tomates'] }],
      ['Sauce Soja & Sésame', 10, 'Divers', { swaps: ['Huile d\'olive', 'Sauce Pimentée', 'Vinaigrette légère'] }]
    ], steps: 'Cuis les féculents. Saisis la protéine. Ajoute les légumes. Mélange le tout avec la sauce.' },

  { id: 'r-m2', name: 'Salade Fraîcheur Océane', meal: 'déjeuner', kcal: 450, p: 35, c: 40, f: 18, time: 10, cost: 3.0, tags: ['sans lactose', 'sans gluten'], micros: ['Oméga-3', 'Vitamine D'],
    ing: [
      ['Saumon fumé', 100, 'Principal', { swaps: ['Thon en boîte', 'Maquereau', 'Crevettes', 'Sardines'] }],
      ['Lentilles', 100, 'Épicerie', { swaps: ['Quinoa', 'Riz brun', 'Pois chiches'] }],
      ['Avocat', 50, 'Légumes', { swaps: ['Olives', 'Graines de courge', 'Noix'] }],
      ['Tomates cerises', 150, 'Légumes', { swaps: ['Concombre', 'Poivron', 'Radis'] }]
    ], steps: 'Mélange la base de féculents froids avec les légumes coupés. Ajoute la source d\'Oméga-3 par-dessus.' },

  { id: 'r-m3', name: 'Bowl Végétarien Protéiné', meal: 'dîner', kcal: 480, p: 25, c: 55, f: 16, time: 15, cost: 2.0, tags: ['végétarien', 'vegan'], micros: ['Fer', 'Calcium'],
    ing: [
      ['Tofu ferme', 150, 'Principal', { swaps: ['Tempeh', 'Seitan', 'Pois chiches', 'Lentilles'] }],
      ['Quinoa', 80, 'Épicerie', { swaps: ['Riz sauvage', 'Patate douce', 'Boulgour'] }],
      ['Épinards', 100, 'Légumes', { swaps: ['Kale', 'Mâche', 'Roquette'] }],
      ['Sauce Cacahuète', 15, 'Divers', { swaps: ['Tahini', 'Sauce Soja', 'Hummus'] }]
    ], steps: 'Fais dorer le tofu. Mélange avec le quinoa tiède et les épinards. Nappe de sauce.' },

  // 2. Plats Chauds & Mijotés
  { id: 'r-m4', name: 'Chili Express Modulable', meal: 'dîner', batch: true, kcal: 550, p: 40, c: 60, f: 15, time: 25, cost: 2.5, tags: ['sans gluten'], micros: ['Fer', 'Zinc'],
    ing: [
      ['Bœuf haché 5%', 150, 'Principal', { swaps: ['Dinde hachée', 'Protéines de soja', 'Poulet haché'] }],
      ['Haricots rouges', 120, 'Conserves', { swaps: ['Lentilles', 'Pois chiches', 'Haricots noirs'] }],
      ['Coulis de tomate', 150, 'Conserves', { swaps: ['Tomates pelées', 'Sauce tomate maison'] }],
      ['Riz basmati', 60, 'Épicerie', { swaps: ['Quinoa', 'Pâtes', 'Maïs'] }]
    ], steps: 'Fais revenir la viande. Ajoute les haricots et la sauce tomate, laisse mijoter avec des épices mexicaines. Sers sur la base.' },

  { id: 'r-m5', name: 'Curry Coco Réconfortant', meal: 'dîner', batch: true, kcal: 580, p: 35, c: 55, f: 20, time: 20, cost: 2.8, tags: ['sans gluten', 'sans lactose'], micros: ['Vitamine C'],
    ing: [
      ['Crevettes', 150, 'Principal', { swaps: ['Poulet', 'Tofu', 'Cabillaud', 'Saumon'] }],
      ['Lait de coco léger', 100, 'Conserves', { swaps: ['Crème de soja', 'Crème légère 4%', 'Lait d\'amande'] }],
      ['Riz thaï', 70, 'Épicerie', { swaps: ['Riz basmati', 'Nouilles de riz', 'Quinoa'] }],
      ['Poivron', 150, 'Légumes', { swaps: ['Courgette', 'Brocoli', 'Carottes'] }]
    ], steps: 'Saisis la protéine et les légumes. Ajoute le lait de coco et du curry en poudre, laisse épaissir. Sers avec le riz.' },

  { id: 'r-m6', name: 'Pâtes Carbonara Fitness', meal: 'déjeuner', kcal: 520, p: 45, c: 60, f: 12, time: 15, cost: 2.0, tags: [], micros: ['Calcium'],
    ing: [
      ['Bacon de dinde', 100, 'Principal', { swaps: ['Jambon blanc', 'Lardons allumettes', 'Tofu fumé'] }],
      ['Pâtes complètes', 80, 'Épicerie', { swaps: ['Pâtes classiques', 'Gnocchis', 'Pâtes de lentilles'] }],
      ['Crème légère 4%', 50, 'Divers', { swaps: ['Crème de soja', 'Fromage blanc 0%', 'Ricotta'] }],
      ['Œuf', 50, 'Principal', { swaps: ['Pas d\'œuf (version crème seule)'] }]
    ], steps: 'Cuis les pâtes. Fais revenir le bacon. Mélange la crème, l\'œuf et les pâtes hors du feu.' },

  { id: 'r-m7', name: 'Steak & Frites de Patate Douce', meal: 'dîner', kcal: 550, p: 45, c: 50, f: 15, time: 25, cost: 3.5, tags: ['sans lactose', 'sans gluten'], micros: ['B12', 'Fer'],
    ing: [
      ['Steak de Bœuf', 150, 'Principal', { swaps: ['Steak de Cheval', 'Steak végétal', 'Filet de Poulet'] }],
      ['Patate douce', 200, 'Légumes', { swaps: ['Pommes de terre', 'Carottes', 'Panais'] }],
      ['Huile d\'olive', 10, 'Divers', { swaps: ['Huile de coco', 'Beurre', 'Huile de colza'] }],
      ['Haricots verts', 100, 'Légumes', { swaps: ['Salade verte', 'Brocoli', 'Asperges'] }]
    ], steps: 'Coupe les patates en frites, cuis au four avec un filet d\'huile. Saisis le steak et sers avec la verdure.' },

  // 3. Sur le pouce / Wraps
  { id: 'r-m8', name: 'Wrap Complet Express', meal: 'déjeuner', kcal: 480, p: 35, c: 55, f: 14, time: 10, cost: 2.0, tags: [], micros: ['Vitamines B'],
    ing: [
      ['Wrap au blé complet', 70, 'Épicerie', { swaps: ['Wrap maïs', 'Pain pita', 'Pain de mie complet'] }],
      ['Blanc de poulet', 100, 'Principal', { swaps: ['Jambon', 'Saumon fumé', 'Houmous'] }],
      ['Fromage frais à tartiner', 30, 'Frais', { swaps: ['Avocat écrasé', 'Tzatziki', 'Moutarde'] }],
      ['Crudités (Salade, Tomate)', 100, 'Légumes', { swaps: ['Carottes râpées', 'Concombre', 'Pousses d\'épinard'] }]
    ], steps: 'Tartine le wrap, dépose la protéine et les crudités. Roule fermement et déguste.' },

  { id: 'r-m9', name: 'Omelette Paysanne', meal: 'dîner', kcal: 420, p: 25, c: 30, f: 20, time: 10, cost: 1.5, tags: ['sans gluten', 'végétarien'], micros: ['Choline', 'Vitamines A'],
    ing: [
      ['Œufs (x3)', 150, 'Principal', { swaps: ['Tofu soyeux (brouillade)', 'Blancs d\'œufs (x5)'] }],
      ['Pommes de terre', 150, 'Légumes', { swaps: ['Patate douce', 'Pain complet (en accompagnement)'] }],
      ['Champignons', 100, 'Légumes', { swaps: ['Poivrons', 'Oignons', 'Courgettes'] }],
      ['Fromage râpé', 20, 'Frais', { swaps: ['Feta', 'Chèvre', 'Levure diététique (vegan)'] }]
    ], steps: 'Fais revenir les pommes de terre et champignons. Bats les œufs, verse dans la poêle, parsème de fromage et plie.' },

  // 4. Petits-déjeuners & Collations
  { id: 'r-m10', name: 'Porridge Protéiné du Matin', meal: 'petit-déj', kcal: 380, p: 25, c: 50, f: 8, time: 5, cost: 1.0, tags: ['végétarien'], micros: ['Fibres', 'Magnésium'],
    ing: [
      ['Flocons d\'avoine', 50, 'Épicerie', { swaps: ['Muesli', 'Flocons de sarrasin', 'Son d\'avoine'] }],
      ['Lait végétal', 150, 'Divers', { swaps: ['Lait de vache', 'Eau', 'Lait d\'amande'] }],
      ['Protéine en poudre (Whey)', 20, 'Suppléments', { swaps: ['Fromage blanc', 'Skyr', 'Protéine végétale'] }],
      ['Fruits rouges', 80, 'Fruits', { swaps: ['Banane', 'Pomme', 'Kiwi'] }]
    ], steps: 'Fais chauffer l\'avoine et le lait. Hors du feu, incorpore la protéine pour éviter les grumeaux. Ajoute les fruits sur le dessus.' },

  { id: 'r-m11', name: 'Pancakes Healthy', meal: 'petit-déj', kcal: 400, p: 30, c: 45, f: 10, time: 15, cost: 1.5, tags: ['végétarien'], micros: ['Calcium'],
    ing: [
      ['Flocons d\'avoine mixés', 40, 'Épicerie', { swaps: ['Farine complète', 'Farine d\'épeautre'] }],
      ['Œuf', 50, 'Principal', { swaps: ['Graines de chia trempées (vegan)'] }],
      ['Fromage blanc', 100, 'Frais', { swaps: ['Yaourt nature', 'Skyr', 'Compote de pomme'] }],
      ['Sirop d\'érable', 15, 'Divers', { swaps: ['Miel', 'Sirop d\'agave', 'Confiture allégée'] }]
    ], steps: 'Mixe l\'avoine, l\'œuf et le fromage blanc pour obtenir une pâte. Cuis en petites crêpes à la poêle. Verse le sirop.' },

  { id: 'r-m12', name: 'Mug Cake Cacao Express', meal: 'collation', kcal: 280, p: 20, c: 30, f: 8, time: 3, cost: 1.0, tags: ['végétarien'], micros: ['Antioxydants'],
    ing: [
      ['Farine d\'avoine', 30, 'Épicerie', { swaps: ['Farine de blé', 'Poudre d\'amande'] }],
      ['Cacao en poudre sans sucre', 10, 'Divers', { swaps: ['Pépites de chocolat', 'Arôme vanille'] }],
      ['Blanc d\'œuf', 30, 'Principal', { swaps: ['Lait', 'Compote de pomme'] }],
      ['Whey ou Skyr', 20, 'Suppléments', { swaps: ['Protéine végétale', 'Rien (macro ajustée)'] }]
    ], steps: 'Mélange tout dans un mug avec un peu d\'eau ou de lait. Cuis 1 min à 1 min 30 au micro-ondes.' },

  { id: 'r-m13', name: 'Bowl Fromage Blanc & Crunch', meal: 'collation', kcal: 300, p: 25, c: 35, f: 8, time: 2, cost: 1.2, tags: ['végétarien'], micros: ['Calcium'],
    ing: [
      ['Fromage blanc 0% ou 3%', 200, 'Frais', { swaps: ['Skyr', 'Yaourt grec', 'Yaourt de soja'] }],
      ['Granola / Muesli', 40, 'Épicerie', { swaps: ['Céréales complètes', 'Flocons d\'avoine', 'Riz soufflé'] }],
      ['Beurre de cacahuète', 15, 'Divers', { swaps: ['Purée d\'amande', 'Noix concassées', 'Chocolat noir'] }]
    ], steps: 'Verse le fromage blanc dans un bol. Ajoute le granola croquant et une cuillère de beurre d\'oléagineux.' },

  // 5. Poisson Blanc & Variantes
  { id: 'r-m14', name: 'Poisson Blanc en Papillote', meal: 'dîner', kcal: 400, p: 35, c: 45, f: 8, time: 20, cost: 3.5, tags: ['sans gluten', 'sans lactose'], micros: ['Iode', 'Sélénium'],
    ing: [
      ['Filet de cabillaud', 150, 'Principal', { swaps: ['Lieu noir', 'Colin', 'Dorade'] }],
      ['Pommes de terre vapeur', 150, 'Légumes', { swaps: ['Riz', 'Quinoa', 'Boulgour'] }],
      ['Courgette en rondelles', 150, 'Légumes', { swaps: ['Poireau', 'Tomates', 'Fenouil'] }],
      ['Citron & Aneth', 5, 'Divers', { swaps: ['Huile d\'olive & Herbes', 'Sauce soja', 'Moutarde'] }]
    ], steps: 'Mets le poisson et les légumes dans du papier cuisson avec les aromates. Cuis au four 15-20 min.' },

  { id: 'r-m15', name: 'Wok Asiatique Teriyaki', meal: 'déjeuner', kcal: 500, p: 35, c: 65, f: 10, time: 15, cost: 2.8, tags: ['sans lactose'], micros: ['Antioxydants'],
    ing: [
      ['Émincé de porc maigre', 150, 'Principal', { swaps: ['Poulet', 'Bœuf', 'Tofu', 'Crevettes'] }],
      ['Nouilles de riz', 80, 'Épicerie', { swaps: ['Nouilles aux œufs', 'Spaghettis', 'Riz'] }],
      ['Mélange wok (Chou, Carotte, Pousse)', 200, 'Légumes', { swaps: ['Brocoli', 'Poivrons', 'Haricots plats'] }],
      ['Sauce Teriyaki', 20, 'Divers', { swaps: ['Sauce aigre-douce', 'Sauce Huitre', 'Sauce Soja'] }]
    ], steps: 'Saisis la viande au wok. Ajoute les légumes croquants, puis les nouilles précuites et la sauce.' }
];

let code = fs.readFileSync('./js/data.js', 'utf8');
// Remplacer l'ancien tableau window.RECIPES
code = code.replace(/window\.RECIPES\s*=\s*\[[\s\S]*?\];\s*\n/g, `window.RECIPES = ${JSON.stringify(masterRecipes, null, 2)};\n`);
fs.writeFileSync('./js/data.js', code);
console.log('Master recipes injected successfully!');

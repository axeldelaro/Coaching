const fs = require('fs');
global.window = {};
require('./js/exercises.js');
console.log(window.EXLIB.map(e => e.id).join(', '));

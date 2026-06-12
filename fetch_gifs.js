const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const db = JSON.parse(data);
      console.log(`Loaded ${db.length} exercises from remote DB.`);
      console.log(db.slice(0, 3).map(e => ({ name: e.name, id: e.id, images: e.images })));
      fs.writeFileSync('remote_db.json', JSON.stringify(db, null, 2));
    } catch (e) {
      console.error(e);
    }
  });
});

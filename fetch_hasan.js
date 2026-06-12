const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/exercises.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const db = JSON.parse(data);
      console.log(`Loaded ${db.length} exercises from Hasan dataset.`);
      console.log(db.slice(0, 3).map(e => ({ name: e.name, gifUrl: e.gifUrl })));
      fs.writeFileSync('remote_db2.json', JSON.stringify(db, null, 2));
    } catch (e) {
      console.error(e);
    }
  });
});

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function addCol() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN prescription_image TEXT;');
    console.log('Column added');
  } catch(e) {
    console.log('Column might exist', e.message);
  }
}
addCol();

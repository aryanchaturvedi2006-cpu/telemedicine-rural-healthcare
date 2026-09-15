const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function clean() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  const res = await db.run("DELETE FROM appointments WHERE patient_id = 'local-temp-id'");
  console.log(`Deleted ${res.changes} appointments with 'local-temp-id'.`);
}

clean().catch(console.error);

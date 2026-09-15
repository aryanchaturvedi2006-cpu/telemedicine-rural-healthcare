const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function test() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  const patients = await db.all('SELECT * FROM patients');
  console.log('Patients:', patients);

  const appointments = await db.all('SELECT * FROM appointments');
  console.log('Appointments:', appointments);
}

test();

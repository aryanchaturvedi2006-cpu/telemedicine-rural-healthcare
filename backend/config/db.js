const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
}).then(async (db) => {
  // Initialize tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      gender TEXT,
      mobile TEXT UNIQUE,
      street TEXT,
      village TEXT,
      state TEXT
    );
    
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      mobile TEXT,
      specialization TEXT,
      hospital_name TEXT,
      area TEXT,
      state TEXT,
      password TEXT,
      is_available BOOLEAN DEFAULT 1
    );

    
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      name TEXT,
      category TEXT,
      file_path TEXT,
      file_type TEXT,
      file_size INTEGER,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS emergency_profiles (
      patient_id INTEGER PRIMARY KEY,
      blood_group TEXT,
      allergies TEXT,
      emergency_contact TEXT,
      chronic_diseases TEXT,
      current_medicines TEXT
    );

    CREATE TABLE IF NOT EXISTS vaccinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      name TEXT,
      date TEXT,
      dose TEXT
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      doctor_id INTEGER,
      date TEXT,
      time TEXT,
      mode TEXT,
      symptoms TEXT,
      symptom_audio TEXT,
      injury_photo TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      call_started BOOLEAN DEFAULT 0,
      scheduled_time TEXT,
      patient_message_audio TEXT,
      prescription_text TEXT,
      medicines TEXT,
      prescription_image TEXT
    );
  `);
  
  // Alter existing table to add column if it doesn't exist
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN injury_photo TEXT;');
  } catch (err) {
    // Ignored: column likely already exists
  }
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN scheduled_time TEXT;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN patient_message_audio TEXT;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN call_started BOOLEAN DEFAULT 0;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN prescription_text TEXT;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN medicines TEXT;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN symptom_audio TEXT;');
  } catch (err) {
    // Ignored: column likely already exists
  }
  try {
    await db.exec('ALTER TABLE appointments ADD COLUMN prescription_image TEXT;');
  } catch (err) {}
  try {
    await db.exec('ALTER TABLE doctors ADD COLUMN latitude REAL;');
  } catch (err) {
    // Ignored: column likely already exists
  }
  try {
    await db.exec('ALTER TABLE doctors ADD COLUMN longitude REAL;');
  } catch (err) {
    // Ignored: column likely already exists
  }
  return db;
});

const pool = {
  query: async (sql, params = []) => {
    const db = await dbPromise;
    const safeParams = params.map(p => typeof p === 'boolean' ? (p ? 1 : 0) : p);
    
    const isInsertOrUpdate = sql.trim().toUpperCase().match(/^(INSERT|UPDATE|DELETE|PATCH)/);
    
    if (isInsertOrUpdate) {
      const result = await db.run(sql, safeParams);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    } else {
      const rows = await db.all(sql, safeParams);
      return [rows]; // mimicking MySQL [rows, fields]
    }
  },
  getConnection: async () => {
    // Mimic connection so server.js connection test passes
    await dbPromise;
    return {
      release: () => {}
    };
  }
};

module.exports = pool;

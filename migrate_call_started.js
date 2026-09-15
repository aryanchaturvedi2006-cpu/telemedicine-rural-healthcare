const pool = require('./backend/config/db');

async function migrate() {
  try {
    console.log("Adding call_started column...");
    await pool.query('ALTER TABLE appointments ADD COLUMN call_started BOOLEAN DEFAULT FALSE');
    console.log("Migration successful");
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists. Skipping.");
    } else {
      console.error("Migration failed:", error);
    }
  } finally {
    process.exit(0);
  }
}

migrate();

require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
  });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("TABLES:", res.rows.map(r => r.table_name));
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await client.end();
  }
}

main();

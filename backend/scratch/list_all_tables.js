require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    `;
    console.log("ALL TABLES:", res);
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

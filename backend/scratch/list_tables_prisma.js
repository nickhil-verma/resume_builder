require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("TABLES:", res.map(r => r.table_name));
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

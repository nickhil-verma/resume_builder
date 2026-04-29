require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get a user first
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found. Please create a user first.");
      return;
    }

    const res = await prisma.resume.create({
      data: {
        userId: user.id,
        title: "Test Resume",
        jobTitle: "Software Engineer",
        template: "modern",
        personalInfo: { name: "Test User", email: "test@example.com" },
        education: [],
        skills: ["JS", "React"],
        projects: [],
        experience: [],
        summary: "Test Summary",
        achievements: [],
        certifications: []
      }
    });
    console.log("SUCCESS:", res.id);
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const { PrismaClient } = require("./prisma/.prisma/generated");
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");

    const now = await prisma.$queryRaw`SELECT NOW()`;

    console.log("✅ Connected successfully!");
    console.log("Database time:", now);
  } catch (error) {
    console.error("❌ Failed to connect to the database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

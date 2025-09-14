require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)

  try {
    const users = await prisma.FoodCart.findMany({ take: 1 })
    console.log("DB Connected ✅, Sample User:", users)
  } catch (err) {
    console.error("❌ DB connection failed:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()

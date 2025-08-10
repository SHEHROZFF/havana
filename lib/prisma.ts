import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Configure connection pooling for better connection management
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Enable logging for debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Gracefully disconnect on process termination
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  
  // Clean up connections on exit
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
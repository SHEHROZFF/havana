import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Only configure custom datasources in production (let Prisma use schema.prisma in dev)
  ...(process.env.NODE_ENV === 'production' && process.env.DATABASE_URL ? {
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`
      }
    }
  } : {}),
  // Enable logging for debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Add global disconnect handling for production
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Clean up connections on exit (both dev and production)
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Retry mechanism for database operations in production
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation()
  } catch (error: any) {
    // Only retry on connection-related errors
    const isConnectionError = error.code === 'P1017' || 
      error.message.includes('Server has closed the connection') ||
      error.message.includes('Connection pool timeout')
      
    if (retries > 0 && isConnectionError) {
      console.warn(`Database operation failed, retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return withRetry(operation, retries - 1, delay * 1.5) // Exponential backoff
    }
    
    throw error
  }
}
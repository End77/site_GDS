import { PrismaClient } from '@prisma/client'
import { config } from '@/config'
import { join } from 'path'

// Ensure we have a proper database URL
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    // If it's already an absolute path, use it as is
    if (process.env.DATABASE_URL.startsWith('file:/')) {
      return process.env.DATABASE_URL
    }
    // If it's a relative path, convert to absolute
    if (process.env.DATABASE_URL.startsWith('file:')) {
      const relativePath = process.env.DATABASE_URL.replace('file:', '')
      const absolutePath = join(process.cwd(), relativePath)
      return `file:${absolutePath}`
    }
  }
  // Use config fallback
  return config.databases.main.url
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.server.development ? ['query'] : ['error'],
    datasources: {
      db: {
        url: getDatabaseUrl()
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
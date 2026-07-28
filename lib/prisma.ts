import { PrismaClient } from '@prisma/client'

const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
const urlWithLimit = dbUrl && !dbUrl.includes('connection_limit') 
  ? (dbUrl.includes('?') ? `${dbUrl}&connection_limit=2` : `${dbUrl}?connection_limit=2`)
  : dbUrl

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: urlWithLimit,
    log: ['error'],
  })

globalForPrisma.prisma = prisma

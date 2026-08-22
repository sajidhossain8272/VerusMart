import { PrismaClient } from '@prisma/client'

const dbUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
const urlWithLimit = dbUrl && !dbUrl.includes('connection_limit') 
  ? (dbUrl.includes('?') ? `${dbUrl}&connection_limit=2` : `${dbUrl}?connection_limit=2`)
  : dbUrl

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaConfig: any = {
  log: ['error'],
}
if (urlWithLimit) {
  prismaConfig.datasourceUrl = urlWithLimit
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig)


globalForPrisma.prisma = prisma

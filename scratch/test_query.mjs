import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const where = { category_id: 14 }
    const orderBy = { created_at: 'desc' }
    const products = await prisma.products.findMany({ where, orderBy, skip: 0, take: 24 })
    console.log('Query Success! Found products:', products.length)
  } catch (err) {
    console.error('Query Error:', err)
  }
}

main().finally(() => prisma.$disconnect())

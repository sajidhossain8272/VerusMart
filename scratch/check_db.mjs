import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.categories.findMany()
  console.log('--- CATEGORIES ---')
  console.log(categories)

  const productsCount = await prisma.products.count()
  console.log('--- TOTAL PRODUCTS ---', productsCount)

  const sampleProducts = await prisma.products.findMany({ take: 10 })
  console.log('--- SAMPLE PRODUCTS ---')
  console.log(sampleProducts.map(p => ({ id: p.id, name: p.name, category_id: p.category_id, status: p.status })))
}

main().catch(console.error).finally(() => prisma.$disconnect())

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.products.findMany({ orderBy: { id: 'asc' } })
  console.log('Current products:')
  products.forEach(p => console.log(`ID: ${p.id} | image: ${p.image} | name: ${p.name.substring(0, 50)}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())

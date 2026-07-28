const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up database products...')
  try {
    await prisma.wishlist.deleteMany({})
    await prisma.product_colors.deleteMany({})
    await prisma.product_gallery.deleteMany({})
    await prisma.product_sizes.deleteMany({})
    await prisma.product_variants.deleteMany({})
    const deleted = await prisma.products.deleteMany({})
    console.log(`Successfully deleted ${deleted.count} products from database.`)
  } catch (err) {
    console.error('Error deleting products:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()

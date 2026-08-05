import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Running raw SQL cleanup...')
  await prisma.$executeRawUnsafe(`UPDATE orders SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);`)
  await prisma.$executeRawUnsafe(`UPDATE order_items SET order_id = NULL WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM orders);`)
  await prisma.$executeRawUnsafe(`UPDATE order_items SET product_id = NULL WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM products);`)
  await prisma.$executeRawUnsafe(`DELETE FROM wishlist WHERE user_id NOT IN (SELECT id FROM users) OR product_id NOT IN (SELECT id FROM products);`)
  await prisma.$executeRawUnsafe(`UPDATE product_variants SET product_id = 0 WHERE product_id NOT IN (SELECT id FROM products);`)
  await prisma.$executeRawUnsafe(`DELETE FROM product_variants WHERE product_id = 0;`)
  console.log('Raw SQL cleanup finished successfully.')
}

main()
  .catch(e => console.error('Cleanup error:', e))
  .finally(() => prisma.$disconnect())

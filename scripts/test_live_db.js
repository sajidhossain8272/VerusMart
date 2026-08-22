const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB connection...');
  const cats = await prisma.categories.findMany();
  console.log('Categories count:', cats.length);
  if (cats.length > 0) {
    console.log('Sample category:', cats[0]);
  }
  const prods = await prisma.products.findMany({ take: 3 });
  console.log('Products count:', prods.length);
  if (prods.length > 0) {
    console.log('Sample product:', prods[0]);
  }
  const banners = await prisma.banners.findMany();
  console.log('Banners count:', banners.length);
}

main()
  .catch(err => {
    console.error('DATABASE ERROR:', err);
  })
  .finally(() => {
    prisma.$disconnect();
  });

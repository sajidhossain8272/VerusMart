import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map the 10 perfumes (IDs 111-120) to the 10 actual webp images available
// Images in admin_uploads/products/ starting with prod_1781*
const imageMap = [
  { id: 111, image: 'prod_1781105673_279_0.webp' },  // Vampire Blood
  { id: 112, image: 'prod_1781106015_705_0.webp' },  // Dior Sauvage
  { id: 113, image: 'prod_1781106363_800_0.webp' },  // Pink Chiffon
  { id: 114, image: 'prod_1781106758_510_0.webp' },  // Bleu de Chanel
  { id: 115, image: 'prod_1781107529_719_0.webp' },  // Hudson Valley
  { id: 116, image: 'prod_1781107880_955_0.webp' },  // Creed Aventus
  { id: 117, image: 'prod_1781109018_981_0.webp' },  // Coffee Perfume
  { id: 118, image: 'prod_1781109444_825_0.webp' },  // Club de Nuit
  { id: 119, image: 'prod_1781109811_695_0.webp' },  // Good Girl
  { id: 120, image: 'prod_1781110150_693_0.webp' },  // Magical Charlie
]

async function main() {
  for (const item of imageMap) {
    await prisma.products.update({
      where: { id: item.id },
      data: { image: item.image }
    })
    console.log(`Updated product ${item.id} → ${item.image}`)
  }
  console.log('✅ All product images updated!')
}

main().catch(console.error).finally(() => prisma.$disconnect())

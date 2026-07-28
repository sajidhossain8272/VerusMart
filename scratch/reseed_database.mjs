import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('--- STARTING CLEAN DATABASE RESET & RE-UPLOAD ---')

  await prisma.order_items.deleteMany({})
  await prisma.product_variants.deleteMany({})
  await prisma.products.deleteMany({})
  await prisma.categories.deleteMany({})

  console.log('Creating fresh categories...')
  const perfCat = await prisma.categories.create({
    data: {
      name: 'Perfume',
      priority: 1,
      status: 'active',
      image: 'icon_1777582072_345.png',
      banner: 'banner_1777582072_438.webp'
    }
  })

  const elecCat = await prisma.categories.create({
    data: {
      name: 'Electronics',
      priority: 2,
      status: 'active',
      image: 'icon_1775642949_257.jfif',
      banner: 'banner_1775214843_991.png'
    }
  })

  const homeCat = await prisma.categories.create({
    data: {
      name: 'Home & Living',
      priority: 3,
      status: 'active',
      image: 'icon_1775639123_556.png',
      banner: 'banner_1774381983_499.jpg'
    }
  })

  const toysCat = await prisma.categories.create({
    data: {
      name: 'Toys & Games',
      priority: 4,
      status: 'active',
      image: 'icon_1775639143_695.png',
      banner: ''
    }
  })

  const perfumesList = [
    { name: 'Vampire Blood Perfume – Long Lasting Sweet Fruity Luxury Fragrance', price: 550, old_price: 750, image: '1777582072_1.webp' },
    { name: 'Dior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Luxury Fragrance', price: 650, old_price: 900, image: '1777582072_2.webp' },
    { name: 'Pink Chiffon Inspired Perfume for Women – Long Lasting Sweet & Floral Luxury Fragrance', price: 500, old_price: 700, image: '1777582072_3.webp' },
    { name: 'Bleu de Chanel Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance', price: 600, old_price: 850, image: '1777582072_4.webp' },
    { name: 'Hudson Valley – Long Lasting Fresh & Elegant Luxury Perfume', price: 700, old_price: 950, image: '1777582072_5.webp' },
    { name: 'Creed Aventus Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance', price: 650, old_price: 900, image: '1777582072_6.webp' },
    { name: 'Coffee Perfume – Long Lasting Rich & Warm Luxury Fragrance', price: 480, old_price: 650, image: '1777582072_7.webp' },
    { name: 'Club de Nuit Intense Man Inspired By Creed Aventus – Long Lasting Fresh & Woody Luxury Perfume for Men', price: 680, old_price: 920, image: '1777582072_8.webp' },
    { name: 'Inspired By Good Girl – Long Lasting Sweet & Sensual Luxury Perfume for Women', price: 520, old_price: 750, image: '1777582072_9.webp' },
    { name: 'Magical Charlie – Long Lasting Premium Luxury Perfume', price: 450, old_price: 600, image: '1777582072_10.webp' },
  ]

  let uploadedCount = 0
  for (const item of perfumesList) {
    const createdProd = await prisma.products.create({
      data: {
        name: item.name,
        description: `Buy ${item.name} at Verus Mart Bangladesh with fast home delivery and cash on delivery. Premium quality guaranteed long lasting fragrance.`,
        category_id: perfCat.id,
        brand_id: 0,
        price: item.price,
        old_price: item.old_price,
        stock: 50,
        status: 'active',
        image: item.image,
        is_recommended: true,
        is_featured: true,
        is_trending: true,
        is_best_seller: true,
        is_weekday_deal: true,
        meta_title: `${item.name} | Verus Mart`,
        meta_description: `Shop ${item.name} online in Bangladesh at best price with cash on delivery from Verus Mart.`
      }
    })

    await prisma.product_variants.create({
      data: {
        product_id: createdProd.id,
        variant_name: 'Regular (100ml)',
        price: item.price,
        old_price: item.old_price
      }
    })

    uploadedCount++
  }

  console.log(`=== RE-UPLOAD COMPLETE: Added ${uploadedCount} perfumes to Category ID ${perfCat.id} (${perfCat.name}) ===`)
}

seed().catch(console.error).finally(() => prisma.$disconnect())

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProductImageUrl, getCategoryImageUrl, getBannerImageUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const report: Record<string, any> = {
    time: new Date().toISOString(),
    env: {
      has_database_url: !!process.env.DATABASE_URL,
      has_prisma_url: !!process.env.PRISMA_DATABASE_URL,
      has_cloudinary_name: !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME),
    },
    tests: {}
  }

  try {
    report.tests.prisma_query = await prisma.$queryRaw`SELECT 1 as val`
  } catch (err: any) {
    report.tests.prisma_query_error = { message: err.message, stack: err.stack }
  }

  try {
    const cats = await prisma.categories.findMany({ take: 3 })
    report.tests.categories = { count: cats.length, sample: cats[0] }
  } catch (err: any) {
    report.tests.categories_error = { message: err.message, stack: err.stack }
  }

  try {
    const prods = await prisma.products.findMany({ take: 3 })
    report.tests.products = { count: prods.length, sample: prods[0] }
  } catch (err: any) {
    report.tests.products_error = { message: err.message, stack: err.stack }
  }

  try {
    const banners = await prisma.banners.findMany({ take: 3 })
    report.tests.banners = { count: banners.length, sample: banners[0] }
  } catch (err: any) {
    report.tests.banners_error = { message: err.message, stack: err.stack }
  }

  try {
    report.tests.utils = {
      product_img: getProductImageUrl('test.jpg'),
      category_img: getCategoryImageUrl('icon.png'),
      banner_img: getBannerImageUrl('banner.webp'),
    }
  } catch (err: any) {
    report.tests.utils_error = { message: err.message, stack: err.stack }
  }

  return NextResponse.json(report, { status: 200 })
}

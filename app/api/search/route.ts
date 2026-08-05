import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = (searchParams.get('q') || searchParams.get('search') || '').trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], categories: [] })
    }

    const [products, categories] = await Promise.all([
      prisma.products.findMany({
        where: {
          status: 'active',
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { meta_title: { contains: query, mode: 'insensitive' } },
            { meta_description: { contains: query, mode: 'insensitive' } },
            { unit: { contains: query, mode: 'insensitive' } },
            { category: { is: { name: { contains: query, mode: 'insensitive' } } } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          old_price: true,
          image: true,
          unit: true,
        },
        take: 6,
        orderBy: { id: 'desc' },
      }).catch(() => []),

      prisma.categories.findMany({
        where: {
          status: 'active',
          name: { contains: query, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
        take: 4,
      }).catch(() => []),
    ])

    const serializedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price || 0),
      old_price: Number(p.old_price || 0),
      image: p.image,
      unit: p.unit,
    }))

    return NextResponse.json({
      products: serializedProducts,
      categories,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ products: [], categories: [] }, { status: 500 })
  }
}

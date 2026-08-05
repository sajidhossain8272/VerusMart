import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const adminSession = await getAdminSession()
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allEntries = await prisma.wishlist.findMany({
      include: {
        user: { select: { full_name: true, email: true } },
        product: { select: { id: true, name: true, price: true, image: true } }
      },
      orderBy: { id: 'desc' },
      take: 200
    })

    // Count per product
    const countMap: Record<number, { productId: number; name: string; image: string | null; count: number }> = {}
    for (const entry of allEntries) {
      if (entry.product) {
        if (!countMap[entry.product_id]) {
          countMap[entry.product_id] = { productId: entry.product_id, name: entry.product.name, image: entry.product.image, count: 0 }
        }
        countMap[entry.product_id].count++
      }
    }

    const topProducts = Object.values(countMap).sort((a, b) => b.count - a.count)

    const serialized = allEntries.map(e => ({
      id: e.id,
      product_id: e.product_id,
      user_id: e.user_id,
      created_at: e.created_at?.toISOString() ?? null,
      user: e.user ? { full_name: e.user.full_name, email: e.user.email } : null,
      product: e.product ? { id: e.product.id, name: e.product.name, price: Number(e.product.price || 0), image: e.product.image } : null,
    }))

    return NextResponse.json({
      totalWishlisted: allEntries.length,
      topProducts,
      entries: serialized
    })
  } catch (error) {
    console.error('Wishlist stats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

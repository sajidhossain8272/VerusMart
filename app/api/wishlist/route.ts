import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'

// GET user wishlist items
export async function GET() {
  try {
    const userSession = await getUserSession()
    if (!userSession) {
      return NextResponse.json({ authenticated: false, items: [] })
    }

    const items = await prisma.wishlist.findMany({
      where: { user_id: userSession.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            old_price: true,
            image: true,
            unit: true,
            status: true,
          }
        }
      },
      orderBy: { id: 'desc' }
    })

    const serializedItems = items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price || 0),
        old_price: Number(item.product.old_price || 0),
        image: item.product.image,
        unit: item.product.unit,
        status: item.product.status,
      }
    }))

    return NextResponse.json({
      authenticated: true,
      items: serializedItems
    })
  } catch (error) {
    console.error('Fetch wishlist error:', error)
    return NextResponse.json({ authenticated: false, items: [] }, { status: 500 })
  }
}

// POST toggle product in wishlist
export async function POST(req: Request) {
  try {
    const userSession = await getUserSession()
    const { productId } = await req.json()
    const pId = parseInt(productId)

    if (isNaN(pId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 })
    }

    if (!userSession) {
      return NextResponse.json({
        success: false,
        requiresLogin: true,
        error: 'Please log in to save products to your wishlist.'
      }, { status: 401 })
    }

    // Check if item is already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        user_id: userSession.id,
        product_id: pId
      }
    })

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return NextResponse.json({ success: true, added: false, message: 'Removed from wishlist' })
    } else {
      await prisma.wishlist.create({
        data: {
          user_id: userSession.id,
          product_id: pId
        }
      })
      return NextResponse.json({ success: true, added: true, message: 'Added to wishlist!' })
    }
  } catch (error: any) {
    console.error('Toggle wishlist error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

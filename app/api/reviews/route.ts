import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUserSession()
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in to submit a review.' }, { status: 401 })
    }

    const { productId, rating, comment } = await req.json()
    const numericProductId = parseInt(productId)
    const numericRating = Math.min(5, Math.max(1, parseInt(rating) || 5))

    if (isNaN(numericProductId)) {
      return NextResponse.json({ success: false, error: 'Invalid product ID' }, { status: 400 })
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        product_id: numericProductId,
        user_id: user.id,
        rating: numericRating,
        comment: (comment || '').trim(),
        status: 'approved'
      }
    })

    // Update product rating average & total reviews count
    const allReviews = await prisma.reviews.findMany({
      where: { product_id: numericProductId, status: 'approved' }
    })

    const avgRating = Math.round(
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1)
    )

    await prisma.products.update({
      where: { id: numericProductId },
      data: {
        rating: avgRating,
        total_reviews: allReviews.length
      }
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully!'
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 })
  }
}

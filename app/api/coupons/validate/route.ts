import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const coupon = await prisma.coupons.findUnique({
      where: { code: cleanCode }
    })

    if (!coupon || coupon.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 400 })
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 })
    }

    if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 })
    }

    const numericSubtotal = Number(subtotal || 0)
    const minOrder = Number(coupon.min_order_amount || 0)

    if (numericSubtotal < minOrder) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount of ৳${minOrder} required for this coupon.`
      }, { status: 400 })
    }

    let discount = 0
    if (coupon.discount_type === 'percentage') {
      discount = (numericSubtotal * Number(coupon.discount_amount)) / 100
      if (coupon.max_discount && discount > Number(coupon.max_discount)) {
        discount = Number(coupon.max_discount)
      }
    } else {
      discount = Number(coupon.discount_amount)
    }

    // Ensure discount does not exceed subtotal
    discount = Math.min(discount, numericSubtotal)

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountAmount: discount,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Coupon validation failed' }, { status: 500 })
  }
}

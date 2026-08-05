import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/auth'

interface ClientCartItem {
  id: number
  name: string
  price: number
  variantName?: string
  quantity: number
  image?: string | null
}

export async function POST(req: Request) {
  try {
    const userSession = await getUserSession()
    
    // Parse request body (supports JSON or FormData)
    let body: any = {}
    const contentType = req.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      body = await req.json()
    } else {
      const formData = await req.formData()
      body = {
        customer_name: formData.get('customer_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        area: formData.get('area') || formData.get('serving_area'),
        order_note: formData.get('order_note'),
        payment_method: formData.get('payment_method'),
        coupon_code: formData.get('coupon_code'),
        cart_items: formData.get('cart_items') ? JSON.parse(formData.get('cart_items') as string) : []
      }
    }

    const customer_name = (body.customer_name || '').trim()
    const email = (body.email || userSession?.email || '').trim().toLowerCase()
    const phone = (body.phone || userSession?.phone || '').trim()
    const address = (body.address || '').trim()
    const city = (body.city || 'Dhaka').trim()
    const area = (body.area || '').trim()
    const order_note = (body.order_note || '').trim()
    const payment_method = (body.payment_method || 'cod').trim()
    const coupon_code = (body.coupon_code || '').trim().toUpperCase()
    const cartItems: ClientCartItem[] = Array.isArray(body.cart_items) ? body.cart_items : []

    // Required fields validation
    if (!customer_name || !phone || !address) {
      return NextResponse.json({
        success: false,
        error: 'Full name, phone number, and delivery address are required.'
      }, { status: 400 })
    }

    if (cartItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Your shopping cart is empty.'
      }, { status: 400 })
    }

    // Server-side product price & stock verification
    const productIds = cartItems.map(item => Number(item.id)).filter(id => !isNaN(id))
    const dbProducts = await prisma.products.findMany({
      where: { id: { in: productIds } },
      include: { product_variants: true }
    })

    const productMap = new Map(dbProducts.map(p => [p.id, p]))

    let subtotal = 0
    const verifiedOrderItems: Array<{
      product_id: number
      product_name: string
      variant_name: string
      price: number
      quantity: number
      subtotal: number
      image: string | null
    }> = []

    for (const item of cartItems) {
      const dbProduct = productMap.get(item.id)

      if (!dbProduct || dbProduct.status !== 'active') {
        return NextResponse.json({
          success: false,
          error: `Product "${item.name}" is no longer available.`
        }, { status: 400 })
      }

      // Stock check
      const requestedQty = Math.max(1, Number(item.quantity) || 1)
      const currentStock = dbProduct.stock ?? 0

      if (currentStock < requestedQty) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for "${dbProduct.name}". Only ${currentStock} item(s) available.`
        }, { status: 400 })
      }

      // Determine price from DB
      let itemPrice = Number(dbProduct.price || 0)
      let variantName = item.variantName || 'Regular'

      if (variantName !== 'Regular' && dbProduct.product_variants.length > 0) {
        const matchedVariant = dbProduct.product_variants.find(
          v => v.variant_name.toLowerCase() === variantName.toLowerCase()
        )
        if (matchedVariant) {
          itemPrice = Number(matchedVariant.price)
        }
      }

      const itemSubtotal = itemPrice * requestedQty
      subtotal += itemSubtotal

      verifiedOrderItems.push({
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        variant_name: variantName,
        price: itemPrice,
        quantity: requestedQty,
        subtotal: itemSubtotal,
        image: dbProduct.image || item.image || null
      })
    }

    // Delivery Fee calculation
    const settings = await prisma.business_settings.findFirst({ where: { id: 1 } })
    const freeShippingThreshold = 1000
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : Number(settings?.shipping_inside || 60)

    // Coupon discount calculation
    let discountAmount = 0
    let appliedCoupon = null

    if (coupon_code) {
      appliedCoupon = await prisma.coupons.findUnique({ where: { code: coupon_code } })
      if (appliedCoupon && appliedCoupon.status === 'active') {
        const minOrder = Number(appliedCoupon.min_order_amount || 0)
        if (subtotal >= minOrder) {
          if (appliedCoupon.discount_type === 'percentage') {
            discountAmount = (subtotal * Number(appliedCoupon.discount_amount)) / 100
            if (appliedCoupon.max_discount && discountAmount > Number(appliedCoupon.max_discount)) {
              discountAmount = Number(appliedCoupon.max_discount)
            }
          } else {
            discountAmount = Number(appliedCoupon.discount_amount)
          }
          discountAmount = Math.min(discountAmount, subtotal)
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount)
    const trackingNumber = `VM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Execute atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.orders.create({
        data: {
          user_id: userSession?.id || null,
          customer_name,
          email: email || null,
          phone,
          address,
          city,
          area: area || null,
          order_note: order_note || null,
          subtotal,
          shipping_fee: shippingFee,
          discount_amount: discountAmount,
          coupon_code: coupon_code || null,
          total_amount: totalAmount,
          payment_method,
          payment_status: payment_method === 'cod' ? 'unpaid' : 'pending',
          status: 'pending',
          tracking_number: trackingNumber,
        }
      })

      // 2. Create Order Items
      await tx.order_items.createMany({
        data: verifiedOrderItems.map(item => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          product_name: item.product_name,
          variant_name: item.variant_name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
          image: item.image,
        }))
      })

      // 3. Decrement Inventory Stock
      for (const item of verifiedOrderItems) {
        await tx.products.update({
          where: { id: item.product_id },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // 4. Update Coupon used_count if applied
      if (appliedCoupon) {
        await tx.coupons.update({
          where: { id: appliedCoupon.id },
          data: { used_count: { increment: 1 } }
        })
      }

      return newOrder
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      trackingNumber: order.tracking_number,
      message: 'Order placed successfully!'
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred while processing your order.'
    }, { status: 500 })
  }
}
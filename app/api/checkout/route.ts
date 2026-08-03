import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CartItem {
  id: number
  name: string
  price: number
  image: string | null
  variantName?: string
  quantity: number
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const customer_name = (formData.get('customer_name') as string || '').trim()
    const email = (formData.get('email') as string || '').trim()
    const phone = (formData.get('phone') as string || '').trim()
    const address = (formData.get('address') as string || '').trim()
    const order_note = (formData.get('order_note') as string || '').trim()
    const payment_method = formData.get('payment_method') as string
    const serving_area = formData.get('serving_area') as string

    // Parse cart items from hidden input
    let cartItems: CartItem[] = []
    try {
      const cartJson = formData.get('cart_items') as string || '[]'
      cartItems = JSON.parse(cartJson)
    } catch {
      cartItems = []
    }

    if (!customer_name || !phone || !address || !payment_method) {
      return NextResponse.redirect(new URL('/checkout?error=missingfields', req.url))
    }

    if (cartItems.length === 0) {
      return NextResponse.redirect(new URL('/checkout?error=emptycart', req.url))
    }

    // Calculate total from cart items (server-side, not trusting client)
    const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)

    // Get delivery fee from business settings
    const settings = await prisma.business_settings.findFirst({ where: { id: 1 } })
    const freeDeliveryLimit = 100 // Free delivery threshold
    const deliveryFee = subtotal >= freeDeliveryLimit ? 0 : Number(settings?.shipping_inside || 60)
    const total_amount = subtotal + deliveryFee

    // Create the order
    const order = await prisma.orders.create({
      data: {
        customer_name,
        email: email || null,
        phone,
        address,
        order_note: order_note || null,
        total_amount,
        status: 'pending'
      }
    })

    // Create order items
    if (order.id) {
      await prisma.order_items.createMany({
        data: cartItems.map(item => ({
          order_id: order.id,
          product_name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image
        }))
      })
    }

    // After success, redirect to success page
    return NextResponse.redirect(new URL(`/?order=success&id=${order.id}`, req.url))
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.redirect(new URL('/checkout?error=servererror', req.url))
  }
}
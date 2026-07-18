import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const customer_name = formData.get('customer_name') as string
    const email = (formData.get('email') as string) || ''
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const order_note = (formData.get('order_note') as string) || ''
    const payment_method = formData.get('payment_method') as string
    
    // In a real implementation, we would extract items from session/cookie/body.
    // For this simulation, we insert a placeholder amount.
    const total_amount = 100.00 // Needs to be calculated from cart

    if (!customer_name || !phone || !address || !payment_method) {
      return NextResponse.redirect(new URL('/checkout?error=missingfields', req.url))
    }

    const order = await prisma.orders.create({
      data: {
        customer_name,
        email,
        phone,
        address,
        order_note,
        total_amount,
        status: 'pending'
      }
    })

    // After success, clear cart and show success page
    return NextResponse.redirect(new URL('/?order=success', req.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/checkout?error=servererror', req.url))
  }
}

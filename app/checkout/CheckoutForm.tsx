'use client'

import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'
import { useEffect, useState } from 'react'

interface ServingArea {
  id: number
  zone_name: string
}

interface PaymentMethod {
  id: number
  name: string
  logo: string | null
}

interface Props {
  servingAreas: ServingArea[]
  paymentMethods: PaymentMethod[]
}

export default function CheckoutForm({ servingAreas, paymentMethods }: Props) {
  const { cartItems, cartTotal } = useCart()
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    const fee = cartTotal >= 100 ? 0 : 9.99
    setDeliveryFee(fee)
    setGrandTotal(cartTotal + fee)
  }, [cartTotal])

  return (
    <form action="/api/checkout" method="post" className="flex-1 bg-white p-[25px] rounded-[8px] shadow-[0_2px_15px_rgba(0,0,0,0.08)] border border-[#f0f0f0]">
      <input type="hidden" name="cart_items" value={JSON.stringify(cartItems)} />
      <input type="hidden" name="total_amount" value={grandTotal.toFixed(2)} />
      <input type="hidden" name="delivery_fee" value={deliveryFee.toFixed(2)} />

      <div className="grid gap-[20px]">
        <div>
          <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Full name</label>
          <input
            name="customer_name"
            required
            className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-[20px]">
          <div>
            <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Phone</label>
            <input
              name="phone"
              required
              className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
              placeholder="Phone number"
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Delivery address</label>
          <textarea
            name="address"
            required
            rows={4}
            className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
            placeholder="Enter your delivery address"
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Serving area</label>
          <select
            name="serving_area"
            className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
          >
            <option value="">Select area</option>
            {servingAreas.map(area => (
              <option key={area.id} value={area.id}>{area.zone_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Payment method</label>
          <div className="grid gap-[10px]">
            {paymentMethods.map(method => (
              <label key={method.id} className="flex items-center gap-[10px] rounded-[6px] border border-[#eee] px-[12px] py-[10px]">
                <input type="radio" name="payment_method" value={method.id} required />
                <span className="text-[14px] text-[#333]">{method.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#212121] mb-[8px]">Order note</label>
          <textarea
            name="order_note"
            rows={3}
            className="w-full rounded-[6px] border border-[#ddd] px-[14px] py-[12px] text-[14px] outline-none focus:border-[#f85606]"
            placeholder="Any instructions for the delivery?"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-[6px] bg-[#f85606] px-[16px] py-[14px] text-[15px] font-semibold text-white transition hover:bg-[#e24a00]"
        >
          Place Order
        </button>

        <p className="text-[13px] text-[#777]">
          By placing your order, you agree to our{' '}
          <Link href="/" className="text-[#f85606] underline">
            Terms & Conditions
          </Link>
        </p>
      </div>
    </form>
  )
}
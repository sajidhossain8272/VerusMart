'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'
import { useState, useEffect } from 'react'

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
  const router = useRouter()
  const { cartItems, cartTotal, clearCart } = useCart()

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    area: '',
    payment_method: 'cod',
    order_note: '',
    coupon_code: '',
  })

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Prefill user data if logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setFormData(prev => ({
            ...prev,
            customer_name: prev.customer_name || data.user.full_name || '',
            email: prev.email || data.user.email || '',
            phone: prev.phone || data.user.phone || '',
          }))
        }
      })
      .catch(() => {})
  }, [])

  const handleApplyCoupon = async () => {
    if (!formData.coupon_code.trim()) return
    setValidatingCoupon(true)
    setCouponError('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.coupon_code.trim(),
          subtotal: cartTotal
        })
      })
      const data = await res.json()
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.coupon.discountAmount
        })
      } else {
        setCouponError(data.error || 'Invalid coupon code')
        setAppliedCoupon(null)
      }
    } catch {
      setCouponError('Failed to validate coupon code')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add products before placing an order.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')

    try {
      const payload = {
        ...formData,
        coupon_code: appliedCoupon ? appliedCoupon.code : '',
        cart_items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          variantName: item.variantName,
          quantity: item.quantity,
          image: item.image
        }))
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success && data.orderId) {
        clearCart()
        router.push(`/checkout/success/${data.orderId}`)
      } else {
        setErrorMessage(data.error || 'Failed to place order. Please try again.')
      }
    } catch (err: any) {
      console.error('Order placement error:', err)
      setErrorMessage('A network or server error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/80">
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-base shrink-0"></i>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={formData.customer_name}
            onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium"
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium"
              placeholder="017XXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium"
            placeholder="House/Road no, Area, Thana, City"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
              City / Region
            </label>
            <select
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium bg-white"
            >
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
              Serving Zone
            </label>
            <select
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium bg-white"
            >
              <option value="">Select Serving Zone (Optional)</option>
              {servingAreas.map(area => (
                <option key={area.id} value={area.zone_name}>{area.zone_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Coupon Redemption Input */}
        <div>
          <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
            Discount Coupon
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.coupon_code}
              onChange={e => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
              placeholder="Enter Code (e.g. VERUS10)"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#f85606] font-bold"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || !formData.coupon_code.trim()}
              className="px-5 py-2.5 bg-[#002b5b] hover:bg-[#001f42] text-white text-xs font-black rounded-xl transition-all disabled:opacity-50"
            >
              {validatingCoupon ? 'Validating...' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="text-xs text-red-500 mt-1.5 font-semibold">{couponError}</p>}
          {appliedCoupon && (
            <p className="text-xs text-green-600 mt-1.5 font-bold flex items-center gap-1">
              ✓ Coupon applied! Discount: ৳{appliedCoupon.discountAmount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-3">
            Payment Method <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-3">
            <label className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              formData.payment_method === 'cod' ? 'border-[#f85606] bg-[#fff6f2] shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment_method"
                value="cod"
                checked={formData.payment_method === 'cod'}
                onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                className="accent-[#f85606] w-4 h-4"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                <span className="text-xs text-gray-500">Pay cash upon receiving your order at home.</span>
              </div>
            </label>

            {paymentMethods.map(method => (
              <label key={method.id} className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                formData.payment_method === method.name.toLowerCase() ? 'border-[#f85606] bg-[#fff6f2] shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="payment_method"
                  value={method.name.toLowerCase()}
                  checked={formData.payment_method === method.name.toLowerCase()}
                  onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                  className="accent-[#f85606] w-4 h-4"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-900 block">{method.name}</span>
                  <span className="text-xs text-gray-500">Online payment via mobile banking or card.</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#002b5b] uppercase tracking-wider mb-2">
            Delivery Instructions / Order Notes
          </label>
          <textarea
            rows={2}
            value={formData.order_note}
            onChange={e => setFormData({ ...formData, order_note: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f85606] focus:ring-2 focus:ring-orange-500/10 transition-all text-gray-800 font-medium"
            placeholder="Special instructions for delivery rider (e.g. Leave at gate)"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || cartItems.length === 0}
          className="w-full rounded-2xl bg-[#f85606] hover:bg-[#d04300] text-white py-4 text-base font-black tracking-wide shadow-lg shadow-orange-500/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Processing Order...
            </>
          ) : (
            <>
              Confirm Order & Place Now <i className="fa-solid fa-arrow-right text-sm"></i>
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By confirming your order, you agree to our{' '}
          <Link href="/terms-conditions" className="text-[#f85606] underline font-semibold">
            Terms & Conditions
          </Link>{' '}
          and Privacy Policy.
        </p>

      </div>
    </form>
  )
}
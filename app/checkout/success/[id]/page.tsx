import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/utils'


export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params
  const orderId = parseInt(id)

  if (isNaN(orderId)) return notFound()

  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      order_items: true,
      user: true
    }
  })

  if (!order) return notFound()

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  return (
    <div className="w-[92%] max-w-[850px] mx-auto py-10 font-sans">
      
      {/* Confirmation Header Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 text-center mb-8">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
          <i className="fa-solid fa-check"></i>
        </div>

        <span className="bg-orange-50 text-[#f85606] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-3">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-[#002b5b] tracking-tight mb-2">
          Thank You For Your Order!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
          Your order <strong className="text-gray-800">#{order.id}</strong> has been successfully placed. We have sent confirmation details to your phone/email.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href={`/track-order?orderId=${order.id}`}
            className="px-6 py-3.5 bg-[#f85606] hover:bg-[#d04300] text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-truck-fast"></i> Track Order Status
          </Link>
          <Link
            href="/products"
            className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-extrabold rounded-2xl transition-all flex items-center gap-2"
          >
            Continue Shopping <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>

      {/* Order Summary & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Itemized Order Breakdown */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base sm:text-lg font-black text-[#002b5b] uppercase tracking-wide border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-bag-shopping text-[#f85606]"></i> Order Summary
          </h2>

          <div className="divide-y divide-gray-100 mb-6 max-h-[350px] overflow-y-auto pr-2">
            {order.order_items.map((item) => {
              const itemPrice = Number(item.price || 0)
              const qty = item.quantity || 1
              const itemTotal = Number(item.subtotal || itemPrice * qty)

              return (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={getProductImageUrl(item.image)}
                        alt={item.product_name || ''}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <i className="fa-solid fa-box text-gray-300"></i>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                    {item.variant_name && item.variant_name !== 'Regular' && (
                      <span className="text-xs text-gray-400">Variant: {item.variant_name}</span>
                    )}
                    <div className="text-xs text-gray-500 mt-0.5">
                      {qty} × {formatTk(itemPrice)}
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-900">{formatTk(itemTotal)}</span>
                </div>
              )
            })}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">{formatTk(Number(order.subtotal || 0))}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-gray-800">
                {Number(order.shipping_fee) === 0 ? <strong className="text-green-600">FREE</strong> : formatTk(Number(order.shipping_fee))}
              </span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({order.coupon_code || 'Coupon'})</span>
                <span className="font-bold">-{formatTk(Number(order.discount_amount))}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-base">
              <span className="font-black text-[#002b5b]">Total Paid / Payable</span>
              <span className="text-xl font-black text-[#f85606]">{formatTk(Number(order.total_amount))}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta Sidebar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div>
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Tracking Number</span>
            <span className="text-sm font-black text-[#002b5b] bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">
              {order.tracking_number || `VM-${order.id}`}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Delivery Address</span>
            <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
            <p className="text-xs text-gray-600 leading-relaxed mt-1">{order.address}</p>
            <p className="text-xs font-semibold text-gray-700 mt-2">📞 {order.phone}</p>
            {order.email && <p className="text-xs text-gray-500">✉️ {order.email}</p>}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Payment Info</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase">{order.payment_method}</span>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {order.payment_status || 'unpaid'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface TrackOrderPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams
  const orderIdQuery = params.orderId?.trim() || ''

  let order = null
  let orderItems: any[] = []
  let errorMsg = ''

  if (orderIdQuery) {
    const numericId = parseInt(orderIdQuery)
    if (isNaN(numericId)) {
      errorMsg = 'Please enter a valid numeric Order ID.'
    } else {
      const foundOrder = await prisma.orders.findUnique({
        where: { id: numericId }
      })

      if (foundOrder) {
        order = {
          ...foundOrder,
          order_date: formatDate(foundOrder.order_date),
          total_amount: Number(foundOrder.total_amount)
        }

        const rawItems = await prisma.order_items.findMany({
          where: { order_id: numericId }
        })

        orderItems = rawItems.map(item => ({
          ...item,
          price: Number(item.price)
        }))
      } else {
        errorMsg = `No order found with ID #${orderIdQuery}. Please check and try again.`
      }
    }
  }

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-12 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#fff6f2] text-[#f85606] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#002b5b] tracking-tight">Track Your Order</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your Order ID to check real-time status and delivery updates.</p>
        </div>

        {/* Tracking Search Form */}
        <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            name="orderId"
            defaultValue={orderIdQuery}
            placeholder="e.g. 10042"
            required
            className="flex-1 px-5 py-4 bg-[#f8f9fa] border-2 border-gray-100 rounded-2xl text-base outline-none focus:border-[#f85606] focus:bg-white transition-all text-gray-800 font-semibold"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-[#f85606] hover:bg-[#d04300] text-white font-black rounded-2xl tracking-wide shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-base whitespace-nowrap cursor-pointer"
          >
            Track Status <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100 text-sm mb-6 font-semibold">
            <i className="fa-solid fa-circle-exclamation text-lg"></i>
            {errorMsg}
          </div>
        )}

        {/* Tracking Information Display */}
        {order && (
          <div className="border-t border-gray-100 pt-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-[#fdfdfd] p-5 rounded-2xl border border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Order Reference</span>
                <span className="text-xl font-extrabold text-[#002b5b]">#{order.id}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Order Date</span>
                <span className="text-sm font-bold text-gray-700">{order.order_date}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Current Status</span>
                <span className={`inline-block text-xs font-extrabold px-3.5 py-1.5 rounded-full mt-1 uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                  order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                  'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {order.status || 'pending'}
                </span>
              </div>
            </div>

            {/* Stepper tracking progress bar */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pl-6 md:pl-0 border-l-2 md:border-l-0 md:border-t-2 border-dashed border-gray-150 py-4">
              {[
                { label: 'Pending', status: 'pending', icon: 'fa-regular fa-clock', active: true },
                { label: 'Processing', status: 'processing', icon: 'fa-solid fa-gears', active: order.status !== 'pending' && order.status !== 'cancelled' },
                { label: 'Shipped', status: 'shipped', icon: 'fa-solid fa-truck-ramp-box', active: ['shipped', 'delivered'].includes(order.status || '') },
                { label: 'Delivered', status: 'delivered', icon: 'fa-solid fa-circle-check', active: order.status === 'delivered' }
              ].map((step, idx) => (
                <div key={idx} className="relative md:text-center flex md:flex-col items-center gap-4 md:gap-2 -ml-[31px] md:ml-0 md:-mt-[17px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step.active ? 'bg-[#f85606] text-white ring-4 ring-orange-100' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <i className={step.icon}></i>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <span className={`text-sm font-extrabold ${step.active ? 'text-[#002b5b]' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery address & items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h4 className="text-sm font-extrabold text-[#002b5b] uppercase tracking-wider mb-3">Delivery Information</h4>
                <div className="bg-[#fafafa] p-5 rounded-2xl space-y-3 text-sm text-gray-700">
                  <div>
                    <span className="text-gray-400 font-medium block text-xs">Customer Name</span>
                    <span className="font-bold text-gray-800">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block text-xs">Delivery Address</span>
                    <span className="font-semibold text-gray-800">{order.address}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium block text-xs">Phone Number</span>
                    <span className="font-semibold text-gray-800">{order.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#002b5b] uppercase tracking-wider mb-3">Order Items</h4>
                <div className="bg-[#fafafa] p-5 rounded-2xl text-sm">
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100/60 last:border-0">
                        <div>
                          <p className="font-bold text-gray-800 line-clamp-1">{item.product_name || 'Product Item'}</p>
                          <span className="text-xs text-gray-400">Qty: {item.quantity || 1} × {formatTk(item.price)}</span>
                        </div>
                        <span className="font-extrabold text-gray-900">{formatTk((item.quantity || 1) * item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-extrabold text-[#002b5b]">Total Amount</span>
                    <span className="text-lg font-black text-[#f85606]">{formatTk(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

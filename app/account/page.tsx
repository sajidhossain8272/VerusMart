import { getUserSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getUserSession()

  if (!user) {
    redirect('/login?redirect=/account')
  }

  // Fetch customer orders & addresses
  const [orders, addresses] = await Promise.all([
    prisma.orders.findMany({
      where: { user_id: user.id },
      include: { order_items: true },
      orderBy: { id: 'desc' }
    }),
    prisma.addresses.findMany({
      where: { user_id: user.id },
      orderBy: { is_default: 'desc' }
    })
  ])

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  return (
    <div className="w-[92%] max-w-[1240px] mx-auto py-8 font-sans">
      
      {/* Header Profile Info Banner */}
      <div className="bg-gradient-to-r from-[#002b5b] to-[#001f42] rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl border-2 border-white/20 flex items-center justify-center text-2xl sm:text-3xl font-black text-[#f85606] shadow-inner">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">{user.full_name}</h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 flex items-center gap-3">
              <span>✉️ {user.email}</span>
              <span>📞 {user.phone}</span>
            </p>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </form>
      </div>

      {/* Account Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
          <span className="text-2xl font-black text-[#002b5b] mt-2">{orders.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</span>
          <span className="text-2xl font-black text-[#f85606] mt-2">
            {orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</span>
          <span className="text-2xl font-black text-[#002b5b] mt-2">{addresses.length}</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</span>
          <span className="text-2xl font-black text-green-600 mt-2">
            {formatTk(orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0))}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order History Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
              <i className="fa-solid fa-box text-[#f85606]"></i> Order History
            </h2>
            <span className="text-xs text-gray-400 font-bold">{orders.length} Orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🛍️</div>
              <h3 className="text-base font-bold text-gray-800">No orders yet</h3>
              <p className="text-xs text-gray-400 mt-1 mb-4">Place your first order and track it right here!</p>
              <Link href="/products" className="inline-block bg-[#f85606] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-all bg-gray-50/50">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Order ID</span>
                      <span className="text-base font-black text-[#002b5b]">#{order.id}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Date</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {order.order_date ? formatDate(order.order_date) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Status</span>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block mt-0.5 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  {/* Order items line summary */}
                  <div className="border-t border-gray-100 pt-3 pb-2 text-xs text-gray-600 space-y-1">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}× {item.product_name}</span>
                        <span className="font-bold text-gray-800">{formatTk(Number(item.subtotal || 0))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500">Total: <strong className="text-sm font-black text-[#f85606]">{formatTk(Number(order.total_amount))}</strong></span>
                    <Link
                      href={`/checkout/success/${order.id}`}
                      className="text-xs font-black text-[#002b5b] hover:text-[#f85606] underline"
                    >
                      View Receipt →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addresses Sidebar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-black text-[#002b5b] uppercase tracking-wide flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-[#f85606]"></i> Saved Address
            </h2>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400">
              No saved address found. Your delivery address will be saved automatically upon checkout.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-[#002b5b]">{addr.title || 'Home'}</span>
                    {addr.is_default && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Default</span>}
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">{addr.address}</p>
                  <p className="text-[11px] text-gray-500 mt-1">📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

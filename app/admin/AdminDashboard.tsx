'use client'

import React, { useState, useTransition } from 'react'
import { 
  resetProducts, 
  updateOrderStatus, 
  updateStoreSettings, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  login,
  logout,
  createCategory,
  updateCategory,
  deleteCategory,
  createBanner,
  deleteBanner,
  createCoupon,
  deleteCoupon,
  updateReviewStatus,
  deleteReview
} from './actions'

interface Product {
  id: number
  name: string
  description: string | null
  category_id: number | null
  brand_id: number | null
  price: number
  old_price: number
  stock: number | null
  image: string | null
  unit: string | null
  is_recommended: boolean | null
  is_featured: boolean | null
  is_trending: boolean | null
  is_best_seller: boolean | null
  is_weekday_deal: boolean | null
}

interface Category {
  id: number
  name: string
  priority: number | null
  image: string | null
  status: string | null
  banner: string | null
}

interface Banner {
  id: number
  title: string | null
  image: string
  position: string | null
  status: string | null
}

interface OrderItem {
  id: number
  product_name: string | null
  variant_name?: string | null
  price: number
  quantity: number | null
  subtotal?: number | null
  image: string | null
}

interface Order {
  id: number
  customer_name: string
  email: string | null
  phone: string | null
  address: string | null
  order_note: string | null
  total_amount: number
  subtotal?: number
  shipping_fee?: number
  discount_amount?: number
  coupon_code?: string | null
  tracking_number?: string | null
  payment_method?: string | null
  payment_status?: string | null
  status: string | null
  order_date: string | Date | null
  items: OrderItem[]
}

interface Settings {
  id: number
  company_name: string | null
  logo: string | null
  phone: string | null
  email: string | null
  address: string | null
  shipping_inside: number
  shipping_outside: number
}

interface Variant {
  id: number
  product_id: number
  variant_name: string
  price: number
  old_price: number
}

interface Coupon {
  id: number
  code: string
  discount_type: string
  discount_amount: number
  min_order_amount: number
  max_discount: number
  usage_limit: number
  used_count: number
  expires_at: string | Date | null
  status: string
}

interface Customer {
  id: number
  full_name: string
  email: string
  phone: string
  created_at: string | Date | null
}

interface Review {
  id: number
  rating: number
  comment: string | null
  status: string
  created_at: string | Date | null
  product?: { name: string } | null
  user?: { full_name: string } | null
}

interface AdminDashboardProps {
  isAuthenticated: boolean
  initialProducts: Product[]
  initialCategories: Category[]
  initialOrders: Order[]
  initialSettings: Settings | null
  initialBanners: Banner[]
  initialVariants?: Variant[]
  initialCoupons?: Coupon[]
  initialCustomers?: Customer[]
  initialReviews?: Review[]
}

export default function AdminDashboard({
  isAuthenticated,
  initialProducts,
  initialCategories,
  initialOrders,
  initialSettings,
  initialBanners,
  initialVariants = [],
  initialCoupons = [],
  initialCustomers = [],
  initialReviews = []
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'add-product' | 'categories' | 'coupons' | 'customers' | 'reviews' | 'marketing' | 'settings'
  >('dashboard')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [variants, setVariants] = useState<Variant[]>(initialVariants)
  const [variantInputs, setVariantInputs] = useState<{ variant_name: string; price: string; old_price: string }[]>([])
  
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all')

  const [isPending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const showMsg = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000)
  }

  // Auth Handlers
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await login(formData)
      if (res.success) window.location.reload()
      else showMsg('error', res.error || 'Login failed.')
    })
  }

  const handleLogout = async () => {
    startTransition(async () => {
      const res = await logout()
      if (res.success) window.location.reload()
      else showMsg('error', 'Logout failed.')
    })
  }

  const handleResetProducts = async () => {
    if (!confirm('CONFIRM RESET: This will remove all products and their configurations permanently. Proceed?')) return
    startTransition(async () => {
      const res = await resetProducts()
      if (res.success) {
        setProducts([])
        showMsg('success', 'All products removed.')
      } else showMsg('error', res.error || 'Failed to remove products.')
    })
  }

  const handleStatusChange = async (orderId: number, status: string) => {
    const res = await updateOrderStatus(orderId, status)
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      showMsg('success', `Order #${orderId} status set to ${status}.`)
    } else showMsg('error', res.error || 'Failed to update status.')
  }

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await updateStoreSettings(formData)
      if (res.success) {
        showMsg('success', 'Settings updated.')
        setTimeout(() => window.location.reload(), 1000)
      } else showMsg('error', res.error || 'Failed to save settings.')
    })
  }

  const handleCreateCouponSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    startTransition(async () => {
      const res = await createCoupon(formData)
      if (res.success) {
        showMsg('success', 'Coupon code created.')
        form.reset()
        window.location.reload()
      } else showMsg('error', res.error || 'Failed to create coupon.')
    })
  }

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm('Delete this coupon?')) return
    startTransition(async () => {
      const res = await deleteCoupon(id)
      if (res.success) {
        setCoupons(prev => prev.filter(c => c.id !== id))
        showMsg('success', 'Coupon deleted.')
      } else showMsg('error', res.error || 'Failed to delete coupon.')
    })
  }

  const handleReviewAction = async (id: number, action: 'approved' | 'rejected' | 'delete') => {
    startTransition(async () => {
      if (action === 'delete') {
        const res = await deleteReview(id)
        if (res.success) setReviews(prev => prev.filter(r => r.id !== id))
      } else {
        const res = await updateReviewStatus(id, action)
        if (res.success) setReviews(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
      }
    })
  }

  // Metrics
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length

  const filteredOrders = orderStatusFilter === 'all' 
    ? orders 
    : orders.filter(o => (o.status || 'pending').toLowerCase() === orderStatusFilter)

  // 1. UNAUTHENTICATED RENDER
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#eff0f5] text-black flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-sm border border-gray-200 p-8 bg-white space-y-6 shadow-xl rounded-2xl">
          <div className="text-center space-y-2 border-b border-gray-100 pb-5">
            <img src="/admin_uploads/logo.png" alt="VerusMart Logo" className="h-[45px] mx-auto object-contain mb-3" />
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-bold">Secure Access Console</p>
          </div>

          {statusMsg.text && (
            <div className="border border-red-200 p-3 text-xs uppercase bg-red-50 text-red-700 text-center font-bold rounded-lg">
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider block text-gray-700">Admin Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] focus:border-[#f85606] text-xs font-mono"
                placeholder="admin@verusmart.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider block text-gray-700">Access Key</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] focus:border-[#f85606] text-xs font-mono"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-[#002b5b] hover:bg-[#f85606] text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-all shadow-md disabled:bg-neutral-300 cursor-pointer"
            >
              {isPending ? 'VERIFYING...' : 'ENTER SYSTEM'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 2. MAIN ADMIN SYSTEM DASHBOARD
  return (
    <div className="min-h-screen bg-[#eff0f5] text-black flex font-sans">
      
      {/* Side Navigation */}
      <aside className="w-[260px] bg-[#002b5b] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#001c3d]">
        <div>
          <div className="p-6 border-b border-[#003d80] text-center bg-[#001f40]">
            <div className="bg-white p-3 rounded-xl flex items-center justify-center mb-3 shadow-md">
              <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[30px] w-auto object-contain" />
            </div>
            <span className="text-[10px] text-blue-200 uppercase block tracking-widest font-black mt-1">Administration Panel</span>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: '📊 DASHBOARD' },
              { id: 'products', label: '📦 PRODUCTS' },
              { id: 'add-product', label: '➕ ADD PRODUCT' },
              { id: 'categories', label: '🏷 CATEGORIES' },
              { id: 'coupons', label: '🎟 COUPONS' },
              { id: 'customers', label: '👥 CUSTOMERS' },
              { id: 'reviews', label: '⭐ REVIEWS' },
              { id: 'marketing', label: '✨ MARKETING' },
              { id: 'settings', label: '⚙️ SETTINGS' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setEditingProduct(null); setEditingCategory(null); }}
                className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${
                  activeTab === tab.id
                    ? 'bg-[#f85606] text-white border-[#f85606] shadow-md'
                    : 'text-blue-100 border-transparent hover:bg-[#003d80]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#003d80] bg-[#001f40]">
          <button 
            onClick={handleLogout}
            className="w-full text-center p-3 text-xs uppercase tracking-widest font-bold border border-white/20 text-white hover:bg-white hover:text-[#002b5b] transition-all bg-white/5 rounded-lg cursor-pointer"
          >
            🚪 LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#eff0f5]">
        
        <header className="border-b border-gray-200 p-6 flex justify-between items-center bg-white shadow-sm">
          <h1 className="text-sm font-black uppercase tracking-widest text-[#002b5b]">
            SYSTEM // {activeTab.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase">Status: <strong className="text-green-600">Online</strong></span>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          
          {statusMsg.text && (
            <div className={`p-4 text-xs uppercase tracking-wider font-bold rounded-xl border ${
              statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {statusMsg.text}
            </div>
          )}

          {/* TAB 1: DASHBOARD OVERVIEW & ORDERS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Metrics Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Gross Sales</span>
                  <div className="text-2xl font-black text-[#f85606] mt-2">৳{totalSales.toLocaleString('en-BD')}</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Total Orders</span>
                  <div className="text-2xl font-black text-[#002b5b] mt-2">{orders.length}</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Pending Fulfillment</span>
                  <div className="text-2xl font-black text-amber-600 mt-2">{pendingOrders}</div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Completed Orders</span>
                  <div className="text-2xl font-black text-green-600 mt-2">{completedOrders}</div>
                </div>
              </div>

              {/* Order Management Table */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#001f40] text-white">
                  <div>
                    <h2 className="font-black text-sm uppercase tracking-wider">ORDERS MANAGEMENT</h2>
                    <p className="text-[10px] text-blue-200 uppercase mt-0.5">Filter, update statuses, and print itemized customer invoices</p>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-200 font-bold uppercase">Filter:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="bg-white text-[#002b5b] font-bold text-xs p-2 rounded-lg outline-none"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-extrabold uppercase">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Info</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Items Purchased</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-400 font-bold uppercase">No order records found.</td>
                        </tr>
                      ) : (
                        filteredOrders.map(o => (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-black text-[#002b5b]">
                              #{o.id}
                              <span className="block text-[10px] text-gray-400 font-normal">
                                {o.order_date ? new Date(o.order_date).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">{o.customer_name}</div>
                              <div className="text-[11px] text-gray-500">📞 {o.phone}</div>
                              {o.email && <div className="text-[10px] text-gray-400">✉️ {o.email}</div>}
                            </td>
                            <td className="p-4 text-gray-600 max-w-[180px] truncate" title={o.address || ''}>
                              {o.address || 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1 text-[11px]">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="text-gray-800">
                                    • <strong className="font-bold">{item.product_name}</strong> × {item.quantity} (৳{item.price.toLocaleString('en-BD')})
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 font-black text-[#f85606]">
                              ৳{o.total_amount.toLocaleString('en-BD')}
                            </td>
                            <td className="p-4">
                              <select
                                value={o.status || 'pending'}
                                onChange={e => handleStatusChange(o.id, e.target.value)}
                                className={`p-2 border rounded-xl font-black text-[10px] uppercase cursor-pointer outline-none ${
                                  o.status === 'delivered' || o.status === 'completed'
                                    ? 'border-green-300 text-green-700 bg-green-50'
                                    : o.status === 'cancelled'
                                    ? 'border-red-300 text-red-700 bg-red-50'
                                    : 'border-amber-300 text-amber-700 bg-amber-50'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setInvoiceOrder(o)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-[11px] px-3 py-1.5 rounded-lg border border-gray-200 transition-all cursor-pointer inline-flex items-center gap-1.5"
                              >
                                🖨️ Print Invoice
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-sm font-black text-[#002b5b] uppercase">Product Catalog ({products.length})</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleResetProducts}
                    className="bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-xl border border-red-200 cursor-pointer"
                  >
                    ⚠️ Reset All Products
                  </button>
                  <button
                    onClick={() => { setEditingProduct(null); setActiveTab('add-product'); }}
                    className="bg-[#f85606] text-white hover:bg-[#d04300] font-bold text-xs px-4 py-2 rounded-xl shadow-md cursor-pointer"
                  >
                    + Add New Product
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Image</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <div className="w-12 h-12 bg-gray-50 border rounded-lg overflow-hidden flex items-center justify-center">
                            {p.image ? <img src={`/admin_uploads/products/${p.image}`} alt={p.name} className="max-h-full max-w-full object-contain" /> : 'No Img'}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-gray-900">{p.name}</td>
                        <td className="p-3 font-bold text-[#f85606]">৳{p.price.toLocaleString('en-BD')}</td>
                        <td className="p-3 font-semibold text-gray-700">{p.stock ?? 0} {p.unit}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={async () => {
                              if (confirm(`Delete "${p.name}"?`)) {
                                const res = await deleteProduct(p.id)
                                if (res.success) setProducts(prev => prev.filter(item => item.id !== p.id))
                              }
                            }}
                            className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg text-[10px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-8">
              {/* Add Coupon Form */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#002b5b] uppercase tracking-wider mb-4">Create Discount Coupon</h3>
                <form onSubmit={handleCreateCouponSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Coupon Code</label>
                    <input
                      name="code"
                      required
                      placeholder="e.g. SUMMER20"
                      className="w-full border p-2.5 rounded-xl text-xs uppercase font-bold outline-none focus:border-[#f85606]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Discount Type</label>
                    <select name="discount_type" className="w-full border p-2.5 rounded-xl text-xs font-semibold outline-none">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Discount Value</label>
                    <input
                      type="number"
                      step="0.01"
                      name="discount_amount"
                      required
                      placeholder="e.g. 15 or 100"
                      className="w-full border p-2.5 rounded-xl text-xs font-semibold outline-none focus:border-[#f85606]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Min Order Amount (৳)</label>
                    <input
                      type="number"
                      name="min_order_amount"
                      placeholder="0"
                      className="w-full border p-2.5 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Usage Limit</label>
                    <input
                      type="number"
                      name="usage_limit"
                      defaultValue="100"
                      className="w-full border p-2.5 rounded-xl text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-[#f85606] hover:bg-[#d04300] text-white font-bold text-xs py-3 rounded-xl shadow-md cursor-pointer"
                    >
                      Create Coupon Code
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-sm font-black text-[#002b5b] uppercase tracking-wider mb-4">Active Store Coupons ({coupons.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b text-gray-700 font-bold uppercase">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Used / Limit</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="p-3 font-black text-[#002b5b] uppercase">{c.code}</td>
                          <td className="p-3 font-semibold text-gray-700">{c.discount_type}</td>
                          <td className="p-3 font-bold text-[#f85606]">
                            {c.discount_type === 'percentage' ? `${c.discount_amount}%` : `৳${c.discount_amount}`}
                          </td>
                          <td className="p-3 text-gray-600">{c.used_count || 0} / {c.usage_limit || '∞'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg text-[10px]"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-black text-[#002b5b] uppercase tracking-wider mb-4">Registered Customers ({customers.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b text-gray-700 font-bold uppercase">
                    <tr>
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-3 font-black text-[#002b5b]">#{c.id}</td>
                        <td className="p-3 font-bold text-gray-900">{c.full_name}</td>
                        <td className="p-3 text-gray-600">{c.email}</td>
                        <td className="p-3 font-semibold text-gray-800">{c.phone}</td>
                        <td className="p-3 text-gray-400">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-black text-[#002b5b] uppercase tracking-wider mb-4">Product Reviews Moderation</h3>
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-400 font-bold">No product reviews submitted yet.</p>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="border p-4 rounded-xl flex justify-between items-center bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{r.user?.full_name || 'Customer'}</span>
                          <span className="text-amber-500 font-black text-xs">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">{r.comment}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewAction(r.id, 'approved')}
                          className="bg-green-100 text-green-700 font-bold text-[10px] px-3 py-1 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewAction(r.id, 'delete')}
                          className="bg-red-100 text-red-700 font-bold text-[10px] px-3 py-1 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-black text-[#002b5b] uppercase tracking-wider mb-4">Store Business Settings</h3>
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Company Name</label>
                  <input
                    name="companyName"
                    defaultValue={initialSettings?.company_name || 'Verus Mart'}
                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Store Phone</label>
                  <input
                    name="phone"
                    defaultValue={initialSettings?.phone || ''}
                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Store Email</label>
                  <input
                    name="email"
                    defaultValue={initialSettings?.email || ''}
                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Inside City Shipping Fee (৳)</label>
                  <input
                    name="shippingInside"
                    defaultValue={initialSettings?.shipping_inside || 60}
                    className="w-full border p-2.5 rounded-xl text-xs font-bold outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#f85606] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* PRINT INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-[#002b5b]">Verus Mart Official Invoice</h2>
                <p className="text-xs text-gray-400">Order Reference: #{invoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs space-y-1">
              <div>
                <strong className="text-gray-800 block">Customer Information:</strong>
                <p>{invoiceOrder.customer_name}</p>
                <p>Phone: {invoiceOrder.phone}</p>
                <p>Address: {invoiceOrder.address}</p>
              </div>
              <div className="text-right">
                <strong className="text-gray-800 block">Order Summary:</strong>
                <p>Tracking: {invoiceOrder.tracking_number || `VM-${invoiceOrder.id}`}</p>
                <p>Date: {invoiceOrder.order_date ? new Date(invoiceOrder.order_date).toLocaleDateString() : 'N/A'}</p>
                <p>Payment: {invoiceOrder.payment_method?.toUpperCase()}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border-t border-b">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-bold uppercase">
                  <th className="py-2">Item</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 font-bold">{item.product_name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">৳{item.price.toLocaleString('en-BD')}</td>
                    <td className="py-2 text-right font-bold">
                      ৳{((item.quantity || 1) * item.price).toLocaleString('en-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-xs space-y-1 font-bold">
              <p className="text-gray-600">Subtotal: ৳{(invoiceOrder.subtotal || invoiceOrder.total_amount).toLocaleString('en-BD')}</p>
              <p className="text-gray-600">Shipping Fee: ৳{(invoiceOrder.shipping_fee || 0).toLocaleString('en-BD')}</p>
              {Number(invoiceOrder.discount_amount) > 0 && (
                <p className="text-green-600">Discount: -৳{invoiceOrder.discount_amount?.toLocaleString('en-BD')}</p>
              )}
              <p className="text-lg font-black text-[#f85606] border-t pt-2">
                Grand Total: ৳{invoiceOrder.total_amount.toLocaleString('en-BD')}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => window.print()}
                className="bg-[#002b5b] text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
              >
                🖨️ Print Now
              </button>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="bg-gray-200 text-gray-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

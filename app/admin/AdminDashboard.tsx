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
  deleteBanner
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
  price: number
  quantity: number | null
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
  status: string | null
  order_date: Date | null
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

interface AdminDashboardProps {
  isAuthenticated: boolean
  initialProducts: Product[]
  initialCategories: Category[]
  initialOrders: Order[]
  initialSettings: Settings | null
  initialBanners: Banner[]
}

export default function AdminDashboard({
  isAuthenticated,
  initialProducts,
  initialCategories,
  initialOrders,
  initialSettings,
  initialBanners
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'categories' | 'marketing' | 'settings'>('dashboard')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // Transition states
  const [isPending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const showMsg = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000)
  }

  // Auth: Login
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const res = await login(formData)
      if (res.success) {
        window.location.reload()
      } else {
        showMsg('error', res.error || 'Login failed.')
      }
    })
  }

  // Auth: Logout
  const handleLogout = async () => {
    startTransition(async () => {
      const res = await logout()
      if (res.success) {
        window.location.reload()
      } else {
        showMsg('error', 'Logout failed.')
      }
    })
  }

  // Action: Reset all products
  const handleResetProducts = async () => {
    if (!confirm('CONFIRM RESET: This will remove all products and their configurations permanently. Proceed?')) return
    
    startTransition(async () => {
      const res = await resetProducts()
      if (res.success) {
        setProducts([])
        showMsg('success', 'All products removed.')
      } else {
        showMsg('error', res.error || 'Failed to remove products.')
      }
    })
  }

  // Action: Change Order Status
  const handleStatusChange = async (orderId: number, status: string) => {
    const res = await updateOrderStatus(orderId, status)
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      showMsg('success', `Order #${orderId} status set to ${status}.`)
    } else {
      showMsg('error', res.error || 'Failed to update status.')
    }
  }

  // Action: Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const res = await updateStoreSettings(formData)
      if (res.success) {
        showMsg('success', 'Settings updated.')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        showMsg('error', res.error || 'Failed to save settings.')
      }
    })
  }

  // Action: Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      let res
      if (editingProduct) {
        res = await updateProduct(editingProduct.id, formData)
      } else {
        res = await createProduct(formData)
      }

      if (res.success) {
        showMsg('success', editingProduct ? 'Product updated.' : 'Product created.')
        setEditingProduct(null)
        setActiveTab('products')
        form.reset()
        setTimeout(() => window.location.reload(), 1000)
      } else {
        showMsg('error', res.error || 'Failed to save product.')
      }
    })
  }

  // Action: Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    startTransition(async () => {
      const res = await deleteProduct(id)
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        showMsg('success', 'Product deleted.')
      } else {
        showMsg('error', res.error || 'Failed to delete product.')
      }
    })
  }

  // Action: Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      let res
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, formData)
      } else {
        res = await createCategory(formData)
      }

      if (res.success) {
        showMsg('success', editingCategory ? 'Category updated.' : 'Category created.')
        setEditingCategory(null)
        form.reset()
        setTimeout(() => window.location.reload(), 1000)
      } else {
        showMsg('error', res.error || 'Failed to save category.')
      }
    })
  }

  // Action: Delete Category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will be unlinked.')) return
    
    startTransition(async () => {
      const res = await deleteCategory(id)
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id))
        showMsg('success', 'Category deleted.')
      } else {
        showMsg('error', res.error || 'Failed to delete category.')
      }
    })
  }

  // Action: Save Banner
  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const res = await createBanner(formData)
      if (res.success) {
        showMsg('success', 'Banner created successfully.')
        form.reset()
        setTimeout(() => window.location.reload(), 1000)
      } else {
        showMsg('error', res.error || 'Failed to create banner.')
      }
    })
  }

  // Action: Delete Banner
  const handleDeleteBanner = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    startTransition(async () => {
      const res = await deleteBanner(id)
      if (res.success) {
        setBanners(prev => prev.filter(b => b.id !== id))
        showMsg('success', 'Banner deleted successfully.')
      } else {
        showMsg('error', res.error || 'Failed to delete banner.')
      }
    })
  }

  // Calculate Metrics
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0)
  
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length

  // RENDERING 1: LOGIN COMPONENT (BRAND ACCENTED DESIGN)
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

  // RENDERING 2: SYSTEM DASHBOARD (SIDE-NAV & MULTI-VIEW)
  return (
    <div className="min-h-screen bg-[#eff0f5] text-black flex font-sans">
      
      {/* 2.1 Side Navigation */}
      <aside className="w-[260px] bg-[#002b5b] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#001c3d]">
        <div>
          {/* Logo Brand Box */}
          <div className="p-6 border-b border-[#003d80] text-center bg-[#001f40]">
            <div className="bg-white p-3 rounded-xl flex items-center justify-center mb-3 shadow-md">
              <img src="/admin_uploads/logo.png" alt="VerusMart" className="h-[30px] w-auto object-contain" />
            </div>
            <span className="text-[10px] text-blue-200 uppercase block tracking-widest font-black mt-1">Administration Panel</span>
          </div>

          {/* Links list */}
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => { setActiveTab('dashboard'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'dashboard' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              📊 DASHBOARD
            </button>
            <button 
              onClick={() => { setActiveTab('products'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'products' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              📦 ALL PRODUCTS
            </button>
            <button 
              onClick={() => { setActiveTab('add-product'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'add-product' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              ➕ ADD PRODUCT
            </button>
            <button 
              onClick={() => { setActiveTab('categories'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'categories' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              🏷 CATEGORIES
            </button>
            <button 
              onClick={() => { setActiveTab('marketing'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'marketing' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              ✨ MARKETING
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setEditingProduct(null); setEditingCategory(null); }}
              className={`w-full text-left p-3 text-xs uppercase tracking-wider font-bold transition-all rounded-lg border ${activeTab === 'settings' ? 'bg-[#f85606] text-white border-[#f85606] shadow-md' : 'text-blue-100 border-transparent hover:bg-[#003d80]'}`}
            >
              ⚙️ SETTINGS
            </button>
          </nav>
        </div>

        {/* Logout Bottom Trigger */}
        <div className="p-4 border-t border-[#003d80] bg-[#001f40]">
          <button 
            onClick={handleLogout}
            className="w-full text-center p-3 text-xs uppercase tracking-widest font-bold border border-white/20 text-white hover:bg-white hover:text-[#002b5b] transition-all bg-white/5 rounded-lg cursor-pointer"
          >
            🚪 LOG OUT
          </button>
        </div>
      </aside>

      {/* 2.2 Main Dashboard Panel Container */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#eff0f5]">
        
        {/* Top Header Row */}
        <header className="border-b border-gray-200 p-6 flex justify-between items-center bg-white shadow-sm">
          <h1 className="text-sm font-black uppercase tracking-widest text-[#002b5b]">
            SYSTEM // {activeTab} {editingProduct && '// EDIT_ITEM'}
          </h1>
          {isPending && (
            <span className="text-xs uppercase font-bold bg-[#f85606] text-white px-2.5 py-1 tracking-wider animate-pulse rounded-md">
              [Syncing Database]
            </span>
          )}
        </header>

        {/* Content Box */}
        <div className="p-8 flex-1 space-y-8 max-w-[1200px] w-full mx-auto">
          
          {/* Status Message */}
          {statusMsg.text && (
            <div className={`p-4 text-xs font-bold uppercase rounded-xl border text-center shadow-sm ${statusMsg.type === 'success' ? 'bg-[#001f40] text-white border-[#002b5b]' : 'bg-red-50 text-red-700 border-red-200'}`}>
              [STATUS] {statusMsg.text}
            </div>
          )}

          {/* TAB CONTENT: 1. DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">SALES REVENUE</span>
                  <span className="text-2xl font-black text-[#002b5b]">${totalSales.toFixed(2)}</span>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">TOTAL INVOICES</span>
                  <span className="text-2xl font-black text-[#002b5b]">{orders.length}</span>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">PENDING PROCESS</span>
                  <span className="text-2xl font-black text-amber-600">{pendingOrders}</span>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">COMPLETED DISPATCH</span>
                  <span className="text-2xl font-black text-green-600">{completedOrders}</span>
                </div>
              </div>

              {/* Recent Orders log */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider">INVOICE LOG FILE</h3>
                  <span className="text-[10px] text-blue-200 font-bold uppercase">{orders.length} ITEMS TOTAL</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase">
                      <tr>
                        <th className="p-4">INVOICE</th>
                        <th className="p-4">BUYER INFO</th>
                        <th className="p-4">DESTINATION</th>
                        <th className="p-4">ITEMS LIST</th>
                        <th className="p-4">TOTAL</th>
                        <th className="p-4">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-neutral-400 uppercase tracking-widest font-bold">Log is empty. No purchase records.</td>
                        </tr>
                      ) : (
                        orders.map(o => (
                          <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-4 font-bold text-black">#{o.id}</td>
                            <td className="p-4">
                              <div className="font-bold text-black">{o.customer_name}</div>
                              <div className="text-[10px] text-neutral-500">{o.phone || o.email}</div>
                            </td>
                            <td className="p-4 max-w-[200px] truncate text-neutral-500" title={o.address || ''}>
                              {o.address || 'N/A'}
                            </td>
                            <td className="p-4 text-xs">
                              <div className="space-y-1 text-[10px] text-neutral-600">
                                {o.items.map((item, idx) => (
                                  <div key={idx}>
                                    • <span className="font-semibold text-black">{item.product_name}</span> x {item.quantity} (${item.price.toFixed(2)})
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 font-black text-[#002b5b]">${o.total_amount.toFixed(2)}</td>
                            <td className="p-4">
                              <select 
                                value={o.status || 'pending'} 
                                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                className={`p-2 border rounded-lg font-bold text-[10px] uppercase cursor-pointer bg-white outline-none ${
                                  o.status === 'completed' || o.status === 'delivered'
                                    ? 'border-green-300 text-green-700 bg-green-50'
                                    : o.status === 'cancelled'
                                    ? 'border-red-300 text-red-700 bg-red-50'
                                    : 'border-amber-300 text-amber-700 bg-amber-50'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
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

          {/* TAB CONTENT: 2. ALL PRODUCTS LIST */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-fade-in">
              {/* Top Bar with Add Product CTA */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#002b5b]">CATALOG MANAGEMENT</h3>
                  <p className="text-[10px] text-neutral-500 uppercase mt-0.5">Manage existing store items or create new ones</p>
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setActiveTab('add-product'); }}
                  className="bg-[#f85606] hover:bg-[#d04300] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus"></i> ADD NEW PRODUCT
                </button>
              </div>

              {/* Items List Table */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider">PRODUCT CATALOG LOG</h3>
                  <span className="text-[10px] text-blue-200 font-bold uppercase">{products.length} PRODUCTS LISTED</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase">
                      <tr>
                        <th className="p-4 w-[70px]">Image</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Inventory</th>
                        <th className="p-4">Badges</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-neutral-400 uppercase tracking-widest font-bold">Catalog file is empty.</td>
                        </tr>
                      ) : (
                        products.map(p => (
                          <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="p-4">
                              <div className="w-[50px] h-[50px] bg-neutral-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {p.image ? (
                                  <img src={`/admin_uploads/products/${p.image}`} alt={p.name} className="max-h-full max-w-full object-contain" />
                                ) : (
                                  <span className="text-[9px] text-neutral-400 uppercase font-bold">No Img</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-black">{p.name}</div>
                              <div className="text-[10px] text-neutral-500 truncate max-w-[250px]">{p.description || 'No description'}</div>
                            </td>
                            <td className="p-4 font-bold text-black">
                              ৳{p.price.toLocaleString('en-BD')}
                              {p.old_price > 0 && <span className="text-[10px] text-neutral-400 line-through ml-1.5">৳{p.old_price.toLocaleString('en-BD')}</span>}
                            </td>
                            <td className="p-4 text-neutral-700">
                              {p.stock !== null ? `${p.stock} (${p.unit || 'units'})` : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {p.is_recommended && <span className="border border-gray-300 text-neutral-700 text-[9px] font-bold px-1.5 py-0.5 uppercase rounded">Rec</span>}
                                {p.is_featured && <span className="border border-gray-300 text-neutral-700 text-[9px] font-bold px-1.5 py-0.5 uppercase rounded">Feat</span>}
                                {p.is_trending && <span className="border border-gray-300 text-neutral-700 text-[9px] font-bold px-1.5 py-0.5 uppercase rounded">Trend</span>}
                                {p.is_best_seller && <span className="border border-gray-300 text-neutral-700 text-[9px] font-bold px-1.5 py-0.5 uppercase rounded">Best</span>}
                                {p.is_weekday_deal && <span className="border border-gray-300 text-neutral-700 text-[9px] font-bold px-1.5 py-0.5 uppercase rounded">Week</span>}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => setEditingProduct(p)} 
                                  className="bg-white hover:bg-neutral-50 border border-gray-300 text-neutral-700 font-bold text-[10px] py-1 px-3 rounded-lg uppercase transition-all cursor-pointer shadow-xs"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)} 
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] py-1 px-3 rounded-lg uppercase transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wipe Button section */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-red-600">DANGER ZONE</h3>
                  <p className="text-[10px] text-neutral-500 uppercase mt-0.5">Wipe entire inventory catalog</p>
                </div>
                <button 
                  onClick={handleResetProducts}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  [ RESET ENTIRE CATALOG ]
                </button>
              </div>
            </div>
          )}

          {/* EDIT PRODUCT MODAL OVERLAY */}
          {editingProduct && (
            <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
              <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col my-auto relative">
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center sticky top-0 z-20">
                  <div>
                    <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider">EDIT CATALOG PRODUCT</h3>
                    <p className="text-[10px] text-blue-200 uppercase font-mono mt-0.5">ID: {editingProduct.id} — {editingProduct.name}</p>
                  </div>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSaveProduct} className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Item Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={editingProduct.name} 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Item name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Price (৳) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        defaultValue={editingProduct.price} 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Original Price (৳)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="oldPrice" 
                        defaultValue={editingProduct.old_price || ''} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Quantity in Stock</label>
                      <input 
                        type="number" 
                        name="stock" 
                        defaultValue={editingProduct.stock || 0} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Unit (e.g. per lb)</label>
                      <input 
                        type="text" 
                        name="unit" 
                        defaultValue={editingProduct.unit || 'per lb'} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <select 
                        name="categoryId" 
                        defaultValue={editingProduct.category_id || ''}
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs bg-white font-mono"
                      >
                        <option value="">No Category</option>
                        {initialCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Product Description</label>
                    <textarea 
                      name="description" 
                      defaultValue={editingProduct.description || ''} 
                      rows={3}
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      placeholder="Write descriptive specifications..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">SEO Meta Title (Optional)</label>
                      <input 
                        type="text" 
                        name="metaTitle" 
                        defaultValue={(editingProduct as any)?.meta_title || ''} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Custom browser title"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">SEO Meta Description (Optional)</label>
                      <input 
                        type="text" 
                        name="metaDescription" 
                        defaultValue={(editingProduct as any)?.meta_description || ''} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Custom search snippet"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Replace Image (Optional)</label>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-gray-700">Promotional Badges Configuration</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isRecommended" value="true" defaultChecked={editingProduct.is_recommended || false} className="w-3.5 h-3.5 accent-[#f85606]" />
                        Recommended
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isFeatured" value="true" defaultChecked={editingProduct.is_featured || false} className="w-3.5 h-3.5 accent-[#f85606]" />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isTrending" value="true" defaultChecked={editingProduct.is_trending || false} className="w-3.5 h-3.5 accent-[#f85606]" />
                        Trending
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isBestSeller" value="true" defaultChecked={editingProduct.is_best_seller || false} className="w-3.5 h-3.5 accent-[#f85606]" />
                        Best Seller
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isWeekdayDeal" value="true" defaultChecked={editingProduct.is_weekday_deal || false} className="w-3.5 h-3.5 accent-[#f85606]" />
                        Weekday Deal
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)} 
                      className="border border-gray-300 hover:bg-neutral-50 font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-[#f85606] hover:bg-[#d04300] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2.1 ADD NEW PRODUCT FORM */}
          {activeTab === 'add-product' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    CREATE NEW CATALOG PRODUCT
                  </h3>
                  <button
                    onClick={() => { setEditingProduct(null); setActiveTab('products'); }}
                    className="text-xs font-bold text-blue-200 hover:text-white uppercase"
                  >
                    ← Back to Products List
                  </button>
                </div>
                <form onSubmit={handleSaveProduct} className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Item Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Item name"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Price (৳) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="price" 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Original Price (৳)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        name="oldPrice" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Quantity in Stock</label>
                      <input 
                        type="number" 
                        name="stock" 
                        defaultValue={0} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Unit (e.g. per lb)</label>
                      <input 
                        type="text" 
                        name="unit" 
                        defaultValue="per lb" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Category</label>
                      <select 
                        name="categoryId" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs bg-white font-mono"
                      >
                        <option value="">No Category</option>
                        {initialCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Product Description</label>
                    <textarea 
                      name="description" 
                      rows={3}
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      placeholder="Write descriptive specifications..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">SEO Meta Title (Optional)</label>
                      <input 
                        type="text" 
                        name="metaTitle" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Custom browser title (defaults to Product Name)"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">SEO Meta Description (Optional)</label>
                      <input 
                        type="text" 
                        name="metaDescription" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="Custom search snippet (defaults to Product Description)"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Upload Product Image</label>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-gray-700">Promotional Badges Configuration</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isRecommended" value="true" className="w-3.5 h-3.5 accent-[#f85606]" />
                        Recommended
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isFeatured" value="true" className="w-3.5 h-3.5 accent-[#f85606]" />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isTrending" value="true" className="w-3.5 h-3.5 accent-[#f85606]" />
                        Trending
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isBestSeller" value="true" className="w-3.5 h-3.5 accent-[#f85606]" />
                        Best Seller
                      </label>
                      <label className="flex items-center gap-2 text-[10px] uppercase font-bold cursor-pointer text-gray-700">
                        <input type="checkbox" name="isWeekdayDeal" value="true" className="w-3.5 h-3.5 accent-[#f85606]" />
                        Weekday Deal
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('products')} 
                      className="border border-gray-300 hover:bg-neutral-50 font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-[#002b5b] hover:bg-[#f85606] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      Create Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white">
                <h3 className="font-bold text-xs uppercase tracking-wider">SYSTEM REGISTRY SETTINGS</h3>
              </div>
              <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Company / Store Name</label>
                    <input 
                      type="text" 
                      name="companyName" 
                      defaultValue={initialSettings?.company_name || 'Verus Mart'} 
                      required 
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Update Store Logo File</label>
                    <input 
                      type="file" 
                      name="logo" 
                      accept="image/*"
                      className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Support Telephone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      defaultValue={initialSettings?.phone || ''} 
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Support Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      defaultValue={initialSettings?.email || ''} 
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Courier Shipping Inside Dhaka ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="shippingInside" 
                      defaultValue={initialSettings?.shipping_inside || 60.00} 
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Courier Shipping Outside Dhaka ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="shippingOutside" 
                      defaultValue={initialSettings?.shipping_outside || 120.00} 
                      className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Physical Office Location Address</label>
                  <textarea 
                    name="address" 
                    defaultValue={initialSettings?.address || ''} 
                    rows={3}
                    className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <button 
                    type="submit" 
                    className="bg-[#002b5b] hover:bg-[#f85606] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB CONTENT: 4. CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-8 animate-fade-in">
              {/* Add / Edit Category Form */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white">
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    {editingCategory ? `EDIT CATEGORY // ID: ${editingCategory.id}` : 'NEW CATEGORY'}
                  </h3>
                </div>
                <form onSubmit={handleSaveCategory} className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Category Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={editingCategory?.name || ''} 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="e.g. Fresh Produce"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Priority Order</label>
                      <input 
                        type="number" 
                        name="priority" 
                        defaultValue={editingCategory?.priority || 0} 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Status</label>
                      <select 
                        name="status" 
                        defaultValue={editingCategory?.status || 'active'}
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs bg-white font-mono"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Category Icon/Thumbnail Image</label>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*"
                        className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                      />
                      {editingCategory?.image && (
                        <div className="text-[10px] text-gray-500 mt-1">Current Icon: {editingCategory.image}</div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Category Banner (Used for Homepage Promo slots)</label>
                      <input 
                        type="file" 
                        name="banner" 
                        accept="image/*"
                        className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                      />
                      {editingCategory?.banner && (
                        <div className="text-[10px] text-gray-500 mt-1">Current Banner: {editingCategory.banner}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
                    {editingCategory && (
                      <button 
                        type="button" 
                        onClick={() => setEditingCategory(null)} 
                        className="border border-gray-300 hover:bg-neutral-50 font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="bg-[#002b5b] hover:bg-[#f85606] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Category Table */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider">EXISTING CATEGORIES</h3>
                  <span className="text-[10px] text-blue-200 font-bold uppercase">{categories.length} ITEMS TOTAL</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase">
                      <tr>
                        <th className="p-4 w-[60px]">Icon</th>
                        <th className="p-4 w-[160px]">Banner Promo</th>
                        <th className="p-4">Category Name</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                      {categories.map(c => (
                        <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4">
                            <div className="w-[40px] h-[40px] bg-neutral-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                              {c.image ? (
                                <img src={`/admin_uploads/category/${c.image}`} alt={c.name} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-[8px] text-neutral-400 uppercase font-bold">No Icon</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-[120px] h-[45px] bg-neutral-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                              {c.banner ? (
                                <img src={`/admin_uploads/category/${c.banner}`} alt="Banner" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[8px] text-neutral-400 uppercase font-bold">No Promo Banner</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-bold text-black">{c.name}</td>
                          <td className="p-4">{c.priority || 0}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  setEditingCategory(c)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }} 
                                className="bg-white hover:bg-neutral-50 border border-gray-300 text-neutral-700 font-bold text-[10px] py-1 px-3 rounded-lg uppercase transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(c.id)} 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] py-1 px-3 rounded-lg uppercase transition-all cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. MARKETING BANNERS & PROMOS */}
          {activeTab === 'marketing' && (
            <div className="space-y-8 animate-fade-in">
              {/* Homepage Slider Banners */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white">
                  <h3 className="font-bold text-xs uppercase tracking-wider">NEW HOMEPAGE BANNER</h3>
                </div>
                <form onSubmit={handleSaveBanner} className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Banner Title / Hook</label>
                      <input 
                        type="text" 
                        name="title" 
                        required 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs font-mono"
                        placeholder="e.g. Summer Mega Sale"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Display Position</label>
                      <select 
                        name="position" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs bg-white font-mono"
                      >
                        <option value="main">Main Slider Banner</option>
                        <option value="side_top">Side Top Banner Slot</option>
                        <option value="side_bottom">Side Bottom Banner Slot</option>
                      </select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Status</label>
                      <select 
                        name="status" 
                        className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#f85606] text-xs bg-white font-mono"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Select Banner Image File *</label>
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*"
                      required
                      className="border border-gray-300 rounded-lg p-2 text-xs bg-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end border-t border-gray-100 pt-4">
                    <button 
                      type="submit" 
                      className="bg-[#002b5b] hover:bg-[#f85606] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      Publish Banner
                    </button>
                  </div>
                </form>
              </div>

              {/* Banner list table */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider">HOMEPAGE BANNER REGISTRY</h3>
                  <span className="text-[10px] text-blue-200 font-bold uppercase">{banners.length} BANNERS</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase">
                      <tr>
                        <th className="p-4 w-[160px]">Banner Graphic</th>
                        <th className="p-4">Title / Name</th>
                        <th className="p-4">Position</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                      {banners.map(b => (
                        <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-4">
                            <div className="w-[120px] h-[55px] bg-neutral-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                              <img src={`/admin_uploads/banners/${b.image}`} alt="Banner" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 font-bold text-black">{b.title || 'Untitled Banner'}</td>
                          <td className="p-4">
                            <span className="bg-gray-100 border border-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                              {b.position || 'main'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleDeleteBanner(b.id)} 
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] py-1 px-3 rounded-lg uppercase transition-all cursor-pointer"
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

              {/* Special Offers Section */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-[#001f40] text-white">
                  <h3 className="font-bold text-xs uppercase tracking-wider">HOMEPAGE SPECIAL OFFERS SLOTS</h3>
                </div>
                <div className="p-6">
                  <p className="text-xs text-neutral-500 mb-4 uppercase font-bold">
                    The homepage layout reserves 4 slots (Category IDs 17, 18, 19, 20) to showcase Special Offers. Edit them below to configure what gets displayed.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories
                      .filter(c => [17, 18, 19, 20].includes(c.id))
                      .map((c, idx) => (
                        <div key={c.id} className="border border-gray-200 p-4 rounded-xl flex items-center justify-between bg-neutral-50">
                          <div>
                            <span className="text-[10px] font-bold text-[#f85606] block">SLOT #{idx + 1} (Category ID: {c.id})</span>
                            <span className="text-sm font-bold text-[#002b5b]">{c.name}</span>
                            <div className="mt-2 w-[120px] h-[50px] bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                              {c.banner ? (
                                <img src={`/admin_uploads/category/${c.banner}`} alt="Offer banner" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[8px] text-neutral-400 font-bold uppercase">No Banner</span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setEditingCategory(c)
                              setActiveTab('categories')
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className="bg-white hover:bg-neutral-50 border border-gray-300 text-neutral-700 font-bold text-xs uppercase py-2 px-4 rounded-lg cursor-pointer"
                          >
                            Configure Slot
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

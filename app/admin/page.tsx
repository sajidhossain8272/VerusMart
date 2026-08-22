import { prisma } from '@/lib/prisma'
import { checkAuth } from './actions'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'


export default async function AdminPage() {
  try {
    const authenticated = await checkAuth()

    if (!authenticated) {
      return (
        <AdminDashboard 
          isAuthenticated={false}
          initialProducts={[]}
          initialCategories={[]}
          initialOrders={[]}
          initialSettings={null}
          initialBanners={[]}
          initialVariants={[]}
          initialCoupons={[]}
          initialCustomers={[]}
          initialReviews={[]}
        />
      )
    }

    const [
      categories,
      products,
      orders,
      orderItems,
      siteSettings,
      variants,
      banners,
      coupons,
      customers,
      reviews
    ] = await Promise.all([
      prisma.categories.findMany({ orderBy: { priority: 'asc' } }).catch(() => []),
      prisma.products.findMany({ orderBy: { id: 'desc' } }).catch(() => []),
      prisma.orders.findMany({ orderBy: { id: 'desc' } }).catch(() => []),
      prisma.order_items.findMany({}).catch(() => []),
      prisma.business_settings.findFirst({ where: { id: 1 } }).catch(() => null),
      prisma.product_variants.findMany({}).catch(() => []),
      prisma.banners.findMany({ orderBy: { id: 'desc' } }).catch(() => []),
      prisma.coupons.findMany({ orderBy: { id: 'desc' } }).catch(() => []),
      prisma.users.findMany({ select: { id: true, full_name: true, email: true, phone: true, created_at: true }, orderBy: { id: 'desc' } }).catch(() => []),
      prisma.reviews.findMany({ include: { product: true, user: true }, orderBy: { id: 'desc' } }).catch(() => [])
    ])

    const serializedCategories = JSON.parse(JSON.stringify(categories))

    const ordersWithItems = orders.map(order => ({
      id: order.id,
      customer_name: order.customer_name || 'Guest',
      email: order.email || null,
      phone: order.phone || null,
      address: order.address || null,
      order_note: order.order_note || null,
      total_amount: Number(order.total_amount || 0),
      subtotal: Number(order.subtotal || 0),
      shipping_fee: Number(order.shipping_fee || 0),
      discount_amount: Number(order.discount_amount || 0),
      coupon_code: order.coupon_code || null,
      tracking_number: order.tracking_number || null,
      payment_method: order.payment_method || 'cod',
      payment_status: order.payment_status || 'unpaid',
      status: order.status || 'pending',
      order_date: order.order_date ? new Date(order.order_date).toISOString() : null,
      items: orderItems
        .filter(item => item.order_id === order.id)
        .map(item => ({
          id: item.id,
          product_name: item.product_name || 'Item',
          variant_name: item.variant_name || null,
          price: Number(item.price || 0),
          quantity: item.quantity || 1,
          subtotal: Number(item.subtotal || 0),
          image: item.image || null
        }))
    }))

    const serializedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || null,
      category_id: p.category_id || null,
      brand_id: p.brand_id || null,
      price: Number(p.price || 0),
      old_price: Number(p.old_price || 0),
      stock: p.stock ?? 0,
      image: p.image || null,
      unit: p.unit || 'per lb',
      is_recommended: !!p.is_recommended,
      is_featured: !!p.is_featured,
      is_trending: !!p.is_trending,
      is_best_seller: !!p.is_best_seller,
      is_weekday_deal: !!p.is_weekday_deal,
      meta_title: p.meta_title || null,
      meta_description: p.meta_description || null
    }))

    const serializedBanners = JSON.parse(JSON.stringify(banners))

    const serializedVariants = variants.map(v => ({
      id: v.id,
      product_id: v.product_id,
      variant_name: v.variant_name,
      price: Number(v.price || 0),
      old_price: Number(v.old_price || 0)
    }))

    const serializedCoupons = coupons.map(c => ({
      id: c.id,
      code: c.code,
      discount_type: c.discount_type || 'percentage',
      discount_amount: Number(c.discount_amount || 0),
      min_order_amount: Number(c.min_order_amount || 0),
      max_discount: Number(c.max_discount || 0),
      usage_limit: c.usage_limit || 100,
      used_count: c.used_count || 0,
      expires_at: c.expires_at ? new Date(c.expires_at).toISOString() : null,
      status: c.status || 'active'
    }))

    const serializedCustomers = customers.map(c => ({
      id: c.id,
      full_name: c.full_name,
      email: c.email,
      phone: c.phone,
      created_at: c.created_at ? new Date(c.created_at).toISOString() : null
    }))

    const serializedReviews = reviews.map(r => ({
      id: r.id,
      rating: r.rating || 5,
      comment: r.comment || null,
      status: r.status || 'approved',
      created_at: r.created_at ? new Date(r.created_at).toISOString() : null,
      product: r.product ? { name: r.product.name } : null,
      user: r.user ? { full_name: r.user.full_name } : null
    }))

    const serializedSettings = siteSettings ? {
      id: siteSettings.id,
      company_name: siteSettings.company_name || null,
      logo: siteSettings.logo || null,
      phone: siteSettings.phone || null,
      email: siteSettings.email || null,
      address: siteSettings.address || null,
      shipping_inside: Number(siteSettings.shipping_inside || 60),
      shipping_outside: Number(siteSettings.shipping_outside || 120)
    } : null

    return (
      <AdminDashboard 
        isAuthenticated={true}
        initialProducts={serializedProducts}
        initialCategories={serializedCategories}
        initialOrders={ordersWithItems}
        initialSettings={serializedSettings}
        initialBanners={serializedBanners}
        initialVariants={serializedVariants}
        initialCoupons={serializedCoupons}
        initialCustomers={serializedCustomers}
        initialReviews={serializedReviews}
      />
    )
  } catch (error) {
    console.error('Error rendering AdminPage:', error)
    return (
      <AdminDashboard 
        isAuthenticated={false}
        initialProducts={[]}
        initialCategories={[]}
        initialOrders={[]}
        initialSettings={null}
        initialBanners={[]}
        initialVariants={[]}
        initialCoupons={[]}
        initialCustomers={[]}
        initialReviews={[]}
      />
    )
  }
}


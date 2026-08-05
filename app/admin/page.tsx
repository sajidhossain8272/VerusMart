import { prisma } from '@/lib/prisma'
import { checkAuth } from './actions'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
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
    prisma.categories.findMany({ orderBy: { priority: 'asc' } }),
    prisma.products.findMany({ orderBy: { id: 'desc' } }),
    prisma.orders.findMany({ orderBy: { id: 'desc' } }),
    prisma.order_items.findMany({}),
    prisma.business_settings.findFirst({ where: { id: 1 } }),
    prisma.product_variants.findMany({}),
    prisma.banners.findMany({ orderBy: { id: 'desc' } }),
    prisma.coupons.findMany({ orderBy: { id: 'desc' } }).catch(() => []),
    prisma.users.findMany({ select: { id: true, full_name: true, email: true, phone: true, created_at: true }, orderBy: { id: 'desc' } }).catch(() => []),
    prisma.reviews.findMany({ include: { product: true, user: true }, orderBy: { id: 'desc' } }).catch(() => [])
  ])

  const serializedCategories = JSON.parse(JSON.stringify(categories))

  const ordersWithItems = JSON.parse(JSON.stringify(orders.map(order => ({
    ...order,
    total_amount: Number(order.total_amount),
    subtotal: Number(order.subtotal || 0),
    shipping_fee: Number(order.shipping_fee || 0),
    discount_amount: Number(order.discount_amount || 0),
    items: orderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.subtotal || 0)
      }))
  }))))

  const serializedProducts = JSON.parse(JSON.stringify(products.map(p => ({
    ...p,
    price: Number(p.price),
    old_price: Number(p.old_price)
  }))))

  const serializedBanners = JSON.parse(JSON.stringify(banners))

  const serializedVariants = JSON.parse(JSON.stringify(variants.map(v => ({
    ...v,
    price: Number(v.price),
    old_price: Number(v.old_price)
  }))))

  const serializedCoupons = JSON.parse(JSON.stringify(coupons.map(c => ({
    ...c,
    discount_amount: Number(c.discount_amount),
    min_order_amount: Number(c.min_order_amount || 0),
    max_discount: Number(c.max_discount || 0)
  }))))

  const serializedCustomers = JSON.parse(JSON.stringify(customers))
  const serializedReviews = JSON.parse(JSON.stringify(reviews))

  const serializedSettings = siteSettings ? JSON.parse(JSON.stringify({
    ...siteSettings,
    shipping_inside: Number(siteSettings.shipping_inside),
    shipping_outside: Number(siteSettings.shipping_outside)
  })) : null

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
}

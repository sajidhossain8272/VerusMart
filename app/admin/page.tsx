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
      />
    )
  }

  const categories = await prisma.categories.findMany({
    orderBy: { priority: 'asc' }
  })

  const products = await prisma.products.findMany({
    orderBy: { id: 'desc' }
  })

  const orders = await prisma.orders.findMany({
    orderBy: { id: 'desc' }
  })

  const orderItems = await prisma.order_items.findMany({})

  const siteSettings = await prisma.business_settings.findFirst({
    where: { id: 1 }
  })

  const banners = await prisma.banners.findMany({
    orderBy: { id: 'desc' }
  })

  const serializedCategories = categories.map(c => ({
    ...c,
    status: c.status ? String(c.status) : 'active',
  }))

  const ordersWithItems = orders.map(order => ({
    ...order,
    status: order.status ? String(order.status) : 'pending',
    order_date: order.order_date ? order.order_date.toISOString() : null,
    total_amount: Number(order.total_amount),
    items: orderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        ...item,
        price: Number(item.price)
      }))
  }))

  const serializedProducts = products.map(p => ({
    ...p,
    created_at: p.created_at ? p.created_at.toISOString() : null,
    price: Number(p.price),
    old_price: Number(p.old_price)
  }))

  const serializedBanners = banners.map(b => ({
    ...b,
    position: b.position ? String(b.position) : 'main',
    status: b.status ? String(b.status) : 'active',
    created_at: b.created_at ? b.created_at.toISOString() : null,
  }))

  const serializedSettings = siteSettings ? {
    ...siteSettings,
    shipping_inside: Number(siteSettings.shipping_inside),
    shipping_outside: Number(siteSettings.shipping_outside)
  } : null

  return (
    <AdminDashboard 
      isAuthenticated={true}
      initialProducts={serializedProducts}
      initialCategories={serializedCategories}
      initialOrders={ordersWithItems}
      initialSettings={serializedSettings}
      initialBanners={serializedBanners}
    />
  )
}

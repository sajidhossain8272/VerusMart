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

  const variants = await prisma.product_variants.findMany({})

  const banners = await prisma.banners.findMany({
    orderBy: { id: 'desc' }
  })

  // Deep JSON serialization ensures zero non-plain objects, dates or Prisma symbols pass into Client Components
  const serializedCategories = JSON.parse(JSON.stringify(categories))

  const ordersWithItems = JSON.parse(JSON.stringify(orders.map(order => ({
    ...order,
    total_amount: Number(order.total_amount),
    items: orderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        ...item,
        price: Number(item.price)
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
    />
  )
}

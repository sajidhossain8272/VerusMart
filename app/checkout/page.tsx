import { prisma } from '@/lib/prisma'
import CheckoutCartSummary from './CheckoutCartSummary'
import CheckoutForm from './CheckoutForm'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const servingAreas = await prisma.serving_areas.findMany({
    where: { status: 'active' }
  }).catch(() => [])
  
  const paymentMethods = await prisma.payment_methods.findMany({
    where: { status: 'active' }
  }).catch(() => [])

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-[30px] font-roboto">
      <h1 className="mb-[30px] text-[#212121] text-[24px] font-medium border-b border-[#eee] pb-[10px]">Secure Checkout</h1>

      <div className="flex flex-col md:flex-row gap-[30px] items-start">
        
        <CheckoutForm servingAreas={servingAreas.map(sa => ({ id: sa.id, zone_name: sa.zone_name }))} paymentMethods={paymentMethods.map(pm => ({ id: pm.id, name: pm.name, logo: pm.logo ?? null }))} />

        {/* Order summary sidebar */}
        <div className="flex-1 bg-white p-[25px] rounded-[8px] shadow-[0_2px_15px_rgba(0,0,0,0.08)] sticky top-[80px] border-t-[4px] border-t-[#f85606]">
          <h3 className="text-[18px] font-bold text-[#212121] mb-[15px] border-b border-[#eee] pb-[12px]">Order Summary</h3>
          <CheckoutCartSummary />
        </div>

      </div>
    </div>
  )
}

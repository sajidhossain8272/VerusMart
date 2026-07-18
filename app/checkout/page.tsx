import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function CheckoutPage() {
  const servingAreas = await prisma.serving_areas.findMany({
    where: { status: 'active' }
  })
  
  const paymentMethods = await prisma.payment_methods.findMany({
    where: { status: 'active' }
  })

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-[30px] font-roboto">
      <h2 className="mb-[30px] text-[#212121] text-[24px] font-medium border-b border-[#eee] pb-[10px]">Secure Checkout</h2>

      <div className="flex flex-col md:flex-row gap-[30px] items-start">
        <form action="/api/checkout" method="POST" className="flex-[1.5] flex flex-col gap-[20px]">
          
          <div className="bg-white p-[25px] rounded-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#f5f5f5]">
            <h3 className="text-[16px] text-[#f85606] font-bold mb-[20px] uppercase tracking-[1px]"><i className="fa-solid fa-location-dot"></i> Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px]">
              <div>
                <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="customer_name" required className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" name="phone" required className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Select Zone <span className="text-red-500">*</span></label>
                <select name="zone_id" required className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white text-[#444]">
                  <option value="">Select Zone</option>
                  {servingAreas.map(sa => (
                    <option key={sa.id} value={sa.id}>{sa.zone_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Email Address</label>
                <input type="email" name="email" className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white" />
              </div>
            </div>
            <div className="mt-[15px]">
              <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Delivery Address <span className="text-red-500">*</span></label>
              <textarea name="address" rows={3} required className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white resize-y"></textarea>
            </div>
          </div>

          <div className="bg-white p-[25px] rounded-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#f5f5f5]">
            <h3 className="text-[16px] text-[#f85606] font-bold mb-[20px] uppercase tracking-[1px]"><i className="fa-solid fa-credit-card"></i> Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px]">
              {paymentMethods.map(pm => (
                <label key={pm.id} className="relative block border border-[#eee] rounded-[6px] p-[10px] text-center cursor-pointer transition-all hover:border-[#f85606] has-[:checked]:border-2 has-[:checked]:border-[#f85606] has-[:checked]:bg-[#fff6f2]">
                  <input type="radio" name="payment_method" value={pm.name} required className="absolute opacity-0" />
                  {pm.logo ? <img src={`/admin_uploads/payments/${pm.logo}`} alt={pm.name} className="max-w-[60px] h-[40px] object-contain mx-auto mb-[5px]" /> : <div className="text-[24px] text-gray-500 mb-[5px]"><i className="fa-solid fa-money-bill-wave"></i></div>}
                  <div className="text-[12px] font-bold text-[#444] uppercase">{pm.name}</div>
                </label>
              ))}
            </div>
            
            <div className="mt-[20px] p-[15px] bg-[#e3f2fd] border border-[#bbdefb] rounded-[6px] hidden">
               <h4 className="m-[0_0_10px] text-[15px] text-[#1565c0]">Account Details</h4>
               <p className="m-0 text-[13px] whitespace-pre-line"></p>
            </div>

            <div className="mt-[20px]">
              <label className="block text-[13px] font-bold text-[#444] mb-[8px]">Transaction ID / Number (If Mobile Banking)</label>
              <input type="text" name="transaction_id" placeholder="e.g. TRXR123456" className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white" />
            </div>
          </div>
          
           <div className="bg-white p-[25px] rounded-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#f5f5f5]">
            <h3 className="text-[16px] text-[#f85606] font-bold mb-[20px] uppercase tracking-[1px]"><i className="fa-solid fa-comment"></i> Order Notes (Optional)</h3>
            <textarea name="order_note" rows={2} placeholder="Notes about your order, e.g. special notes for delivery." className="w-full p-[12px] bg-[#f9f9f9] border border-[#ddd] rounded-[4px] outline-none transition-colors focus:border-[#f85606] focus:bg-white resize-y"></textarea>
          </div>

        </form>

        <div className="flex-1 bg-white p-[25px] rounded-[8px] shadow-[0_2px_15px_rgba(0,0,0,0.08)] sticky top-[80px] border-t-[4px] border-t-[#f85606]">
          <h3 className="text-[18px] font-bold text-[#212121] mb-[20px] border-b border-[#eee] pb-[15px]">Order Summary</h3>
          <div className="max-h-[300px] overflow-y-auto mb-[20px] pr-[5px]">
            {/* Cart Items Loop (Client Side) */}
          </div>
          
          <div className="flex justify-between py-[12px] border-t border-[#eee] text-[14px]">
            <span className="text-[#666]">Subtotal</span>
            <span className="font-bold text-[#212121]">$0.00</span>
          </div>
          <div className="flex justify-between py-[12px] border-b border-[#eee] text-[14px]">
            <span className="text-[#666]">Delivery Fee</span>
            <span className="font-bold text-[#10b981]" id="deliveryChargeDisplay">$0.00</span>
          </div>
          <div className="flex justify-between items-center py-[20px]">
            <span className="text-[16px] font-bold text-[#212121]">Total to Pay</span>
            <span className="text-[24px] font-black text-[#f85606]" id="finalTotalDisplay">$0.00</span>
          </div>
          <button type="submit" form="checkoutForm" className="w-full bg-[#f85606] text-white py-[15px] border-none rounded-[6px] font-bold text-[16px] uppercase tracking-[1px] cursor-pointer shadow-[0_4px_10px_rgba(248,86,6,0.3)] transition-all hover:bg-[#d04000] hover:-translate-y-[2px]">Place Order</button>
        </div>
      </div>
    </div>
  )
}

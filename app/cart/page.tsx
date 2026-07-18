import Link from 'next/link'

export default function CartPage() {
  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-[30px]">
      <h2 className="font-medium mb-[20px] text-[24px]">Your Shopping Cart</h2>

      {/* Cart Placeholder - Client Side Logic Should Apply Here */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-[20px] items-start">
        <div className="flex flex-col gap-[12px]">
          <div className="bg-white rounded-[8px] p-[30px] border border-[#f0f0f0] text-center shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <h3 className="mb-[15px] font-bold">Your cart is empty</h3>
            <Link href="/" className="inline-block bg-[#10b981] text-white px-[20px] py-[10px] rounded-[4px] font-bold shadow-[0_2px_5px_rgba(16,185,129,0.3)]">Continue Shopping</Link>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px]">
          <h3 className="text-[18px] mb-[15px] pb-[10px] border-b border-[#eee] font-bold">Order Summary</h3>
          <div className="flex justify-between mb-[10px] text-[#444] text-[14px]">
            <span>Subtotal (0 items)</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between mb-[15px] text-[#444] text-[14px]">
            <span>Delivery Fee</span>
            <span className="text-[#10b981] font-bold">Free</span>
          </div>
          <div className="flex justify-between items-center py-[15px] border-t border-[#eee] mt-[10px]">
            <span className="font-bold text-[#212121]">Total Amount</span>
            <span className="text-[22px] font-bold text-[#f85606]">$0.00</span>
          </div>
          <Link href="/checkout" className="block w-full bg-[#f85606] text-white text-center no-underline p-[14px] rounded-[4px] font-bold mt-[20px] transition-all hover:bg-[#d04000]">PROCEED TO CHECKOUT</Link>
        </div>
      </div>
    </div>
  )
}

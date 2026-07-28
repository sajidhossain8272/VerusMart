import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HowToBuyPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">How to Buy</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          How to Buy
        </h1>

        <p className="text-[#444] text-[15px] leading-[1.8] mb-[25px]">
          Shopping at <strong>Verus Mart</strong> is fast, secure, and easy! Follow these simple steps to place your order:
        </p>

        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#f85606] text-white font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <h3 className="text-[16px] font-bold text-[#002b5b]">Browse &amp; Select Products</h3>
              <p className="text-[#555] text-[14px] leading-[1.6]">Search or browse categories to find your desired products and click <strong>Add to Cart</strong>.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#f85606] text-white font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <h3 className="text-[16px] font-bold text-[#002b5b]">Review Cart &amp; Checkout</h3>
              <p className="text-[#555] text-[14px] leading-[1.6]">Go to your cart, confirm quantities, and proceed to the <strong>Checkout</strong> page.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#f85606] text-white font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <h3 className="text-[16px] font-bold text-[#002b5b]">Enter Delivery Address &amp; Place Order</h3>
              <p className="text-[#555] text-[14px] leading-[1.6]">Provide your delivery details, select <strong>Cash on Delivery</strong> or online payment, and confirm your order!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function HowToBuyPage() {
  const steps = [
    {
      title: '1. Browse & Add to Cart',
      desc: 'Explore our catalog by searching for specific items or filtering by categories. When you find an item you want to purchase, select details like quantity and click "Add to Cart".'
    },
    {
      title: '2. Review Your Cart',
      desc: 'Click on the Shopping Cart icon at the top right corner to verify the products, pricing, and quantities. When you are ready, click "Proceed to Checkout".'
    },
    {
      title: '3. Enter Shipping Details',
      desc: 'Provide your full name, mobile phone number, and detailed shipping address in Dhaka or other divisions in Bangladesh. Double-check your delivery details to ensure fast arrival.'
    },
    {
      title: '4. Select Payment Method & Place Order',
      desc: 'Select payment options: Cash on Delivery (COD) or mobile financial services (bKash/Nagad). Review your order summary and click "Place Order". You will receive a confirmation call or email shortly.'
    }
  ]

  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">How to Buy</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          How to Buy
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[30px]">
          Shopping at <strong>Verus Mart</strong> is simple and hassle-free. Follow our quick step-by-step guide to place your order in minutes.
        </p>

        <div className="space-y-[30px] relative before:absolute before:left-[17px] before:top-[10px] before:bottom-[10px] before:w-[2px] before:bg-[#eff0f5]">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-[45px]">
              <div className="absolute left-[8px] top-[4px] w-[20px] h-[20px] rounded-full bg-[#f85606] border-4 border-white shadow-[0_0_0_2px_#f85606] flex items-center justify-center"></div>
              <h3 className="font-bold text-[#002b5b] text-[16px] mb-[6px]">{step.title}</h3>
              <p className="text-[#666] text-[14px] leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#fff6f2] p-[20px] mt-[40px] rounded-xl border border-[#ffe1d2]">
          <h4 className="font-bold text-[#f85606] text-[15px] mb-[5px]">⚠️ Need Assistance?</h4>
          <p className="text-[#555] text-[13px] leading-[1.6]">
            Our support agents can help walk you through the purchasing process. Call us at <strong>+880 1628083370</strong> (9 AM to 10 PM) or message us on WhatsApp for rapid assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

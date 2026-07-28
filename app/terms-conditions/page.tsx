import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function TermsConditionsPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Terms &amp; Conditions</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Terms &amp; Conditions
        </h1>

        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Welcome to <strong>Verus Mart</strong>. By accessing or using our website, placing an order, or utilizing any of our services, you agree to be bound by the following terms and conditions.
        </p>

        <h3 className="text-[16px] font-bold text-[#002b5b] mt-[25px] mb-[10px]">1. General Terms</h3>
        <p className="text-[#555] text-[14px] leading-[1.7] mb-[15px]">
          All products and services listed on Verus Mart are subject to availability. We reserve the right to modify prices, discontinue items, or update terms without prior notice.
        </p>

        <h3 className="text-[16px] font-bold text-[#002b5b] mt-[25px] mb-[10px]">2. Orders &amp; Payments</h3>
        <p className="text-[#555] text-[14px] leading-[1.7] mb-[15px]">
          Orders can be placed via Cash on Delivery or supported digital payment methods. Prices are listed in Bangladeshi Taka (৳).
        </p>

        <h3 className="text-[16px] font-bold text-[#002b5b] mt-[25px] mb-[10px]">3. Delivery &amp; Shipping</h3>
        <p className="text-[#555] text-[14px] leading-[1.7] mb-[15px]">
          We aim to deliver orders within 24-48 hours in Dhaka and 2-4 business days nationwide. Shipping fees apply based on location.
        </p>
      </div>
    </div>
  )
}

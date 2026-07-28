import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">About Us</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          About Us
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Welcome to <strong className="text-[#002b5b]">Verus Mart</strong>, your trusted online shopping destination in Bangladesh. We are committed to offering high-quality products ranging from premium fragrances and electronics to home essentials and trending lifestyle items at competitive prices.
        </p>

        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          At Verus Mart, customer satisfaction is our top priority. We provide fast nationwide delivery, cash on delivery payment options, and hassle-free returns to ensure a seamless shopping experience for all our customers.
        </p>

        <div className="mt-[30px] p-[20px] bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
          <h3 className="text-[16px] font-bold text-[#002b5b] mb-[10px]">Why Choose Us?</h3>
          <ul className="list-disc pl-[20px] text-[14px] text-[#555] space-y-2">
            <li>100% Authentic and Carefully Selected Products</li>
            <li>Fast Home Delivery Across Bangladesh</li>
            <li>Cash on Delivery & Secure Online Payments</li>
            <li>Dedicated Customer Support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HelpCenterPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Help Center</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Help Center &amp; FAQs
        </h1>

        <div className="space-y-6 mt-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-[16px] font-bold text-[#002b5b] mb-2">Q: How do I track my order status?</h3>
            <p className="text-[#555] text-[14px]">You can track your order status anytime by clicking <Link href="/track-order" className="text-[#f85606] font-bold underline">Track My Order</Link> in the navigation header.</p>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-[16px] font-bold text-[#002b5b] mb-2">Q: What payment methods are accepted?</h3>
            <p className="text-[#555] text-[14px]">We accept Cash on Delivery (COD), bKash, Nagad, and major debit/credit cards.</p>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-[16px] font-bold text-[#002b5b] mb-2">Q: How long does delivery take?</h3>
            <p className="text-[#555] text-[14px]">Inside Dhaka: 24 to 48 hours. Outside Dhaka: 2 to 4 business days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ReturnsRefundsPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Returns &amp; Refunds</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Returns &amp; Refunds Policy
        </h1>

        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          We want you to be completely satisfied with your purchase from <strong>Verus Mart</strong>. If you receive a damaged, defective, or incorrect product, our simple return and refund process is here to help.
        </p>

        <h3 className="text-[16px] font-bold text-[#002b5b] mt-[25px] mb-[10px]">Return Eligibility</h3>
        <ul className="list-disc pl-[20px] text-[#555] text-[14px] leading-[1.7] space-y-2 mb-[20px]">
          <li>Items must be reported within 7 days of delivery.</li>
          <li>Products must be unused, in original packaging, with all seals and tags intact.</li>
          <li>Proof of purchase (Order ID / Receipt) is required.</li>
        </ul>

        <h3 className="text-[16px] font-bold text-[#002b5b] mt-[25px] mb-[10px]">Refund Process</h3>
        <p className="text-[#555] text-[14px] leading-[1.7] mb-[15px]">
          Approved refunds will be processed within 5-7 business days back to your original payment method or Mobile Financial Service account (bKash/Nagad).
        </p>
      </div>
    </div>
  )
}

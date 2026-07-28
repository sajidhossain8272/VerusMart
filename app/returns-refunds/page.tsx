import Link from 'next/link'

export default function ReturnsRefundsPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Returns & Refunds</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Returns & Refunds
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          At <strong>Verus Mart</strong>, we want to make sure you are completely satisfied with your purchase. We offer a <strong>7-day Return Policy</strong> for items meeting our criteria.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">Valid Reasons for Return</h3>
        <ul className="list-disc pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[10px] mb-[20px]">
          <li>The product is damaged, defective, or physically broken at the time of delivery.</li>
          <li>The product is incorrect (wrong size, color, design, or brand).</li>
          <li>The product does not match the specifications or description advertised on the store page.</li>
        </ul>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">Conditions for Return</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[15px]">
          To ensure your return is accepted, please make sure:
        </p>
        <ul className="list-disc pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[10px] mb-[20px]">
          <li>The product remains unused and in its original packaging.</li>
          <li>All original tags, user manuals, warranty cards, and freebies are included.</li>
          <li>The invoice or proof of purchase is returned alongside the item.</li>
        </ul>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">How to Initiate a Return</h3>
        <ol className="list-decimal pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[10px] mb-[20px]">
          <li>Contact our Customer Care at <strong>+880 1628083370</strong> or email us at <strong>verusmart4@gmail.com</strong> within 7 days of delivery.</li>
          <li>Provide your Order ID, clear photos or videos of the issue, and details of the claim.</li>
          <li>Once approved, you can send the product back to our Dhaka warehouse via any local courier service, or we can arrange a pickup in select Dhaka areas (charges may apply).</li>
        </ol>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">Refund Timeline</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Once we receive and inspect the returned item, we will process your refund:
          <br />
          • **Mobile Financial Services (bKash/Nagad):** 3-5 business days.
          <br />
          • **Bank Transfers / Cards:** 7-10 business days.
        </p>
      </div>
    </div>
  )
}

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function PrivacyPolicyPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Privacy Policy</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Privacy Policy
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          At <strong>Verus Mart</strong>, we value the privacy of our visitors and customers. This Privacy Policy details the types of personal data we collect, how we use it, and the security measures we deploy in Dhaka, Bangladesh.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">1. Data We Collect</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[15px]">
          We collect info when you register, order, or submit messages:
        </p>
        <ul className="list-disc pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[8px] mb-[20px]">
          <li><strong>Contact details:</strong> Name, delivery address, phone number, and email address.</li>
          <li><strong>Usage activity:</strong> IP addresses, browser types, page viewing duration, and cookies.</li>
        </ul>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">2. How We Use Data</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[15px]">
          The collected information is used to:
        </p>
        <ul className="list-disc pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[8px] mb-[20px]">
          <li>Process, fulfill, and ship your orders to your location in Bangladesh.</li>
          <li>Send order updates and communicate regarding customer support queries.</li>
          <li>Improve store features, visual presentation, and browsing security.</li>
        </ul>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">3. Data Sharing & Security</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          We do not sell, rent, or trade your personal data to third parties. We only share details with trusted logistics partners (like local Bangladeshi courier companies) to deliver your orders. All transaction and customer data is securely stored.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">4. Cookies</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          We use cookies to maintain your shopping cart state, login sessions, and to provide custom user experiences. You can disable cookies inside your browser settings, though some shop features may stop working.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">5. Revisions</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Verus Mart reserves the right to modify this Privacy Policy statement at any time. Changes take effect instantly upon publication.
        </p>
      </div>
    </div>
  )
}

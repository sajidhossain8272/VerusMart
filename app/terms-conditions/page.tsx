import Link from 'next/link'

export default function TermsConditionsPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Terms & Conditions</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Terms & Conditions
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Please read these Terms & Conditions carefully before using the <strong>Verus Mart</strong> online shopping platform. By accessing or making a purchase on this website, you agree to be bound by these policies.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">1. General Policies</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Verus Mart operates in accordance with the e-commerce regulations of Bangladesh. We reserve the right to restrict access to services, terminate accounts, or cancel orders at our sole discretion.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">2. Order Placement & Verification</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          All orders are subject to stock availability and price verification. Once you place an order, our team in Dhaka will call or message your phone number to verify purchase details before packing and shipping.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">3. Shipping & Pricing</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          We strive to show accurate pricing on all products. If an error is found, we will contact you before delivery. Delivery charges (৳60 inside Dhaka, ৳120 outside Dhaka) will be added to the invoice at checkout.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">4. Customer Obligations</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Customers must provide accurate contact and shipping information. Refusal to accept verified Cash on Delivery orders without valid reason may lead to suspension of the customer account.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">5. Governing Law</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          These Terms and Conditions are governed by the laws of the People's Republic of Bangladesh. Any dispute arising from using these services shall be settled within the jurisdiction of the courts of Dhaka.
        </p>
      </div>
    </div>
  )
}

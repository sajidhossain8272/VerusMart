import Link from 'next/link'

export default function HelpCenterPage() {
  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Browse products, click "Add to Cart", proceed to checkout, enter your delivery address in Dhaka or other regions, select a payment method, and place the order.'
    },
    {
      q: 'What are your delivery charges?',
      a: 'We offer a flat delivery rate of ৳60 within Dhaka Metropolitan area and ৳120 for deliveries outside Dhaka.'
    },
    {
      q: 'Can I pay using bKash or Nagad?',
      a: 'Yes, we accept bKash, Nagad, credit/debit cards, and Cash on Delivery (COD) nationwide.'
    },
    {
      q: 'How long does shipping take?',
      a: 'Deliveries inside Dhaka take 24 to 48 hours. Shipments to other cities across Bangladesh take 3 to 5 business days.'
    },
    {
      q: 'How do I track my order?',
      a: 'Go to the "Track My Order" page in the header navigation, enter your order details to view live updates.'
    }
  ]

  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-[40px] font-sans">
      <div className="text-[13px] text-[#757575] mb-[15px] font-medium">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; <span className="text-[#212121]">Help Center</span>
      </div>
      
      <div className="bg-white rounded-2xl p-[30px] md:p-[50px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#eee]">
        <h1 className="text-[28px] font-black text-[#002b5b] mb-[20px] uppercase tracking-wide border-b-2 border-[#f85606] pb-[10px] w-fit">
          Help Center
        </h1>
        
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[30px]">
          Have questions about shopping, shipping, or returns? Find answers to the most common queries below. If you need further assistance, feel free to reach our customer support desk.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mb-[20px] uppercase tracking-wider">Frequently Asked Questions</h3>
        
        <div className="space-y-[20px]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-[#f5f5f5] pb-[15px]">
              <h4 className="font-bold text-[#212121] text-[15px] mb-[8px] flex gap-[8px] items-start">
                <span className="text-[#f85606]">Q.</span> {faq.q}
              </h4>
              <p className="text-[#666] text-[14px] leading-[1.6] pl-[20px]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[40px] bg-[#eff0f5] p-[25px] rounded-xl text-center">
          <h4 className="font-bold text-[#002b5b] text-[16px] mb-[5px]">Still need help?</h4>
          <p className="text-[#666] text-[14px] mb-[15px]">Our customer support team in Dhaka is available everyday from 9:00 AM to 10:00 PM.</p>
          <Link href="/contact" className="bg-[#f85606] hover:bg-[#d04300] text-white font-bold text-sm py-2 px-6 rounded-lg transition-colors inline-block">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

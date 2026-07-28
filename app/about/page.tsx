import Link from 'next/link'

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
          Welcome to <strong>Verus Mart</strong>, one of Bangladesh's fastest-growing e-commerce platforms. Based in the heart of Dhaka, we are dedicated to bringing high-quality products directly to your doorstep with unmatched reliability and top-tier service.
        </p>

        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          Our collection features curated items ranging from beauty products, home essentials, to electronics. We focus on ensuring authenticity in every product we deliver, addressing the core need of Bangladeshi shoppers for genuine quality.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">Our Mission</h3>
        <p className="text-[#444] text-[15px] leading-[1.8] mb-[20px]">
          To redefine online shopping in Bangladesh by establishing trust, providing authentic goods, ensuring super-fast deliveries, and maintaining customer-first support services.
        </p>

        <h3 className="text-[18px] font-bold text-[#002b5b] mt-[30px] mb-[10px]">Why Shop With Us?</h3>
        <ul className="list-disc pl-[20px] text-[#444] text-[15px] leading-[1.8] space-y-[10px]">
          <li><strong>100% Authentic Products:</strong> Directly sourced or verified through official channels.</li>
          <li><strong>Super-fast Delivery:</strong> Next-day delivery within Dhaka metropolitan area and rapid shipping nationwide.</li>
          <li><strong>Flexible Payment Methods:</strong> Cash on Delivery (COD), bKash, Nagad, and secure online bank transfers.</li>
          <li><strong>Easy Returns:</strong> 7-day hassle-free return policy if products do not match descriptions.</li>
        </ul>

        <div className="bg-[#fff6f2] border-l-4 border-[#f85606] p-[20px] mt-[40px] rounded-r-xl">
          <h4 className="text-[#f85606] font-bold text-[16px] mb-[5px]">Contact Corporate Office</h4>
          <p className="text-[#555] text-[14px] leading-[1.6]">
            Verus Mart Headquarters<br />
            Kawla, Dhaka - 1229, Bangladesh<br />
            Email: <span className="font-semibold text-[#002b5b]">verusmart4@gmail.com</span><br />
            Hotline: <span className="font-semibold text-[#002b5b]">+880 1628083370</span>
          </p>
        </div>
      </div>
    </div>
  )
}

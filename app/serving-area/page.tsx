import Link from 'next/link'

export default function ServingAreaPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-16 text-center font-sans">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-blue-50 text-[#002b5b] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fa-solid fa-location-dot"></i>
        </div>
        <h2 className="text-2xl font-black text-[#002b5b] mb-2">Our Serving Area</h2>
        <p className="text-gray-500 text-sm mb-6">We deliver nationwide across all 64 districts in Bangladesh with fast home delivery.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8 max-w-md mx-auto">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <i className="fa-solid fa-truck text-[#f85606] text-lg"></i>
            <div>
              <h4 className="font-bold text-xs text-[#002b5b]">Inside Dhaka</h4>
              <p className="text-xs text-gray-500">24 - 48 Hours Delivery</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
            <i className="fa-solid fa-[#f85606] fa-plane text-[#f85606] text-lg"></i>
            <div>
              <h4 className="font-bold text-xs text-[#002b5b]">Outside Dhaka</h4>
              <p className="text-xs text-gray-500">2 - 4 Days Delivery</p>
            </div>
          </div>
        </div>
        <Link href="/products" className="bg-[#f85606] text-white px-6 py-3 rounded-xl font-bold text-sm inline-block shadow-md hover:bg-[#d04300] transition-colors">
          Start Shopping
        </Link>
      </div>
    </div>
  )
}

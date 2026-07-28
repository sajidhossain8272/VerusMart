import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-[#eff0f5] font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center">
        {/* Animated Icon / Illustration */}
        <div className="w-24 h-24 bg-[#ffe1d2] text-[#f85606] rounded-full flex items-center justify-center text-4xl font-black mb-6 animate-bounce">
          404
        </div>
        
        <h1 className="text-2xl font-black text-[#002b5b] mb-3 uppercase tracking-wide">
          Page Not Found
        </h1>
        
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link 
            href="/" 
            className="flex-1 bg-[#f85606] hover:bg-[#d04300] text-white font-bold text-sm py-3 px-6 rounded-lg transition-colors text-center shadow-sm"
          >
            Go back Home
          </Link>
          <Link 
            href="/products" 
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm py-3 px-6 rounded-lg transition-colors text-center"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}

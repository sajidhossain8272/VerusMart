import Link from 'next/link'

export default function WishlistPage() {
  return (
    <div className="w-[92%] max-w-[800px] mx-auto py-16 text-center font-sans">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          <i className="fa-regular fa-heart"></i>
        </div>
        <h2 className="text-2xl font-black text-[#002b5b] mb-2">My Wishlist</h2>
        <p className="text-gray-500 text-sm mb-6">Your saved favorite items will appear here.</p>
        <Link href="/products" className="bg-[#f85606] text-white px-6 py-3 rounded-xl font-bold text-sm inline-block shadow-md hover:bg-[#d04300] transition-colors">
          Browse Products
        </Link>
      </div>
    </div>
  )
}

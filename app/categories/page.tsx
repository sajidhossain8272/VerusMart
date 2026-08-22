import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getCategoryImageUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  try {
    const rawCats = await prisma.categories.findMany({
      orderBy: { priority: 'asc' }
    }).catch(() => [])

    const categories = (rawCats || []).filter(c => c && (!c.status || String(c.status) === 'active'))

    return (
      <div className="w-[92%] max-w-[1200px] mx-auto mt-[40px] pb-[100px]">
        <h1 className="text-[28px] font-extrabold text-[#1e293b] mb-[30px] text-center">All Categories</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[20px]">
          {categories.map(c => (
            <Link href={`/products?category=${c.id}`} key={c.id} className="bg-white rounded-[20px] p-[20px] text-center no-underline text-[#1e293b] border border-[#e2e8f0] transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:border-[#f85606] group flex flex-col items-center">
               <div className="w-[80px] h-[80px] mx-auto mb-[15px] bg-[#f8fafc] rounded-full flex justify-center items-center overflow-hidden border-2 border-transparent transition-all group-hover:border-[#f85606] p-[10px]">
                  <img
                    src={getCategoryImageUrl(c.image)}
                    alt={c.name}
                    className="max-w-[100%] max-h-[100%] object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/150x150.png'
                    }}
                  />
               </div>

               <h3 className="text-[16px] font-bold m-0 transition-colors group-hover:text-[#f85606]">{c.name}</h3>
               <span className="text-[12px] text-gray-500 font-medium mt-[5px] block opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">View Products &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    )
  } catch (err) {
    console.error('Error in CategoriesPage:', err)
    return (
      <div className="w-[92%] max-w-[1200px] mx-auto mt-[40px] text-center py-12">
        <h1 className="text-2xl font-black text-[#1e293b] mb-4">Categories</h1>
        <Link href="/products" className="bg-[#f85606] text-white font-bold py-2.5 px-6 rounded-xl">
          Browse All Products
        </Link>
      </div>
    )
  }
}

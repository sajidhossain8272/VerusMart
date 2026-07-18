import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productId = parseInt(id)
  
  if (isNaN(productId)) {
    return notFound()
  }

  const product = await prisma.products.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return notFound()
  }

  const cat = product.category_id ? await prisma.categories.findUnique({
    where: { id: product.category_id }
  }) : null

  const variants = await prisma.product_variants.findMany({
    where: { product_id: productId },
    orderBy: { id: 'asc' }
  })

  const related = await prisma.products.findMany({
    where: { category_id: product.category_id, id: { not: productId } },
    take: 6
  })

  const defaultPrice = Number(product.price || variants[0]?.price || 0)
  const defaultOldPrice = Number(product.old_price || variants[0]?.old_price || 0)
  const defaultVName = variants[0]?.variant_name || 'Regular'

  const window = new JSDOM('').window
  const purify = DOMPurify(window)
  const cleanDescription = purify.sanitize(product.description || '')

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto py-[20px]">
      
      {/* Breadcrumb */}
      <div className="bg-white p-[15px_20px] rounded-[8px] mb-[15px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] text-[13px] font-medium text-[#757575]">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; 
        <Link href={`/products?category=${product.category_id}`} className="text-[#1a9cb7] hover:underline mx-2">{cat?.name || 'Category'}</Link> &gt; 
        <span className="text-[#212121]">{product.name}</span>
      </div>

      <div className="bg-white rounded-[12px] p-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-[40px] mb-[30px]">
        {/* Images */}
        <div className="flex-1 md:max-w-[40%] flex flex-col gap-[15px]">
          <div className="w-full aspect-square border border-[#e0e0e0] rounded-[8px] flex items-center justify-center p-[10px] bg-[#fafafa]">
             <img src={product.image ? `/admin_uploads/products/${product.image}` : 'https://placehold.jp/500x500.png'} className="w-full h-full object-contain" alt={product.name} />
          </div>
          {/* Thumbnails placeholder */}
          <div className="flex gap-[10px]">
            {product.image && (
               <div className="w-[80px] h-[80px] border border-[#e0e0e0] rounded p-[5px] cursor-pointer hover:border-[#f85606] transition-colors"><img src={`/admin_uploads/products/${product.image}`} className="w-full h-full object-contain" /></div>
            )}
            {product.image_2 && (
               <div className="w-[80px] h-[80px] border border-[#e0e0e0] rounded p-[5px] cursor-pointer hover:border-[#f85606] transition-colors"><img src={`/admin_uploads/products/${product.image_2}`} className="w-full h-full object-contain" /></div>
            )}
            {product.image_3 && (
               <div className="w-[80px] h-[80px] border border-[#e0e0e0] rounded p-[5px] cursor-pointer hover:border-[#f85606] transition-colors"><img src={`/admin_uploads/products/${product.image_3}`} className="w-full h-full object-contain" /></div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-[1.5]">
          <h1 className="text-[22px] font-black text-[#212121] leading-[1.3] mb-[15px]">{product.name}</h1>
          <div className="text-[14px] text-[#1a9cb7] mb-[20px] font-medium">Brand: <Link href="#" className="hover:underline">No Brand</Link></div>
          
          <hr className="border-[#f1f1f1] my-[20px]" />

          <div className="mb-[25px]">
            <div className="text-[32px] text-[#f85606] font-black leading-[1]">${defaultPrice.toFixed(2)}</div>
            {defaultOldPrice > 0 && defaultOldPrice > defaultPrice && (
              <div className="text-[14px] text-[#9e9e9e] line-through mt-[5px] font-medium">
                ${defaultOldPrice.toFixed(2)} 
                <span className="text-[#212121] ml-[10px] bg-[#ffe1d2] p-[2px_6px] rounded text-[12px] font-bold no-underline">
                   -{Math.round(((defaultOldPrice - defaultPrice) / defaultOldPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          <hr className="border-[#f1f1f1] my-[20px]" />

          <div className="flex gap-[15px] mt-[30px] flex-col md:flex-row">
            <button className="flex-1 p-[15px] text-[15px] font-bold uppercase rounded-[8px] cursor-pointer border-none bg-[#2fc5f1] text-white hover:bg-[#1a9cb7] transition-colors">Buy Now</button>
            <button className="flex-1 p-[15px] text-[15px] font-bold uppercase rounded-[8px] cursor-pointer border-none bg-[#f85606] text-white hover:bg-[#d04000] transition-colors">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-[12px] p-[30px] mb-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
        <h3 className="text-[18px] font-bold mb-[20px] bg-[#fafafa] p-[15px] rounded-[8px] border-l-4 border-[#f85606]">Product Details</h3>
        <div className="text-[#444] leading-[1.8] text-[15px]" dangerouslySetInnerHTML={{ __html: cleanDescription }}></div>
      </div>

      {/* Related */}
      {related.length > 0 && (
         <div className="bg-white rounded-[12px] p-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
            <h3 className="text-[18px] font-bold mb-[20px] border-l-4 border-[#f85606] pl-[15px]">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-[12px]">
               {related.map(p => (
                  <div key={p.id} className="bg-white rounded overflow-hidden relative border border-[#f0f0f0]">
                     <Link href={`/product/${p.id}`} className="block">
                     <div className="h-[160px] flex items-center justify-center p-2">
                        <img src={p.image ? `/admin_uploads/products/${p.image}` : 'https://placehold.jp/300x300.png'} alt={p.name} className="max-h-full max-w-full object-contain" />
                     </div>
                     <div className="p-[10px]">
                        <div className="text-[12px] text-[#212121] h-[32px] overflow-hidden mb-1">{p.name}</div>
                        <div className="text-[17px] text-[#f85606] font-medium block mb-2">${Number(p.price).toFixed(2)}</div>
                     </div>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  )
}

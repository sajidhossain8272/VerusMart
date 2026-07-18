import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import ProductActions from './ProductActions'

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

  // Serialize variants for client component (Decimal → number)
  const serializedVariants = variants.map(v => ({
    id: v.id,
    variant_name: v.variant_name,
    price: Number(v.price),
    old_price: Number(v.old_price ?? 0),
  }))

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto py-[20px]">
      
      {/* Breadcrumb */}
      <div className="bg-white p-[15px_20px] rounded-[8px] mb-[15px] shadow-[0_2px_5px_rgba(0,0,0,0.05)] text-[13px] font-medium text-[#757575]">
        <Link href="/" className="text-[#1a9cb7] hover:underline">Home</Link> &gt; 
        <Link href={`/products?category=${product.category_id}`} className="text-[#1a9cb7] hover:underline mx-2">{cat?.name || 'Category'}</Link> &gt; 
        <span className="text-[#212121]">{product.name}</span>
      </div>

      {/* Main product card - ProductActions renders both image gallery and info side by side */}
      <div className="bg-white rounded-[12px] p-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-[40px] mb-[30px]">
        <ProductActions
          product={{
            id: product.id,
            name: product.name,
            image: product.image ?? null,
            image_2: product.image_2 ?? null,
            image_3: product.image_3 ?? null,
            price: defaultPrice,
            old_price: defaultOldPrice,
          }}
          variants={serializedVariants}
          defaultPrice={defaultPrice}
          defaultOldPrice={defaultOldPrice}
          defaultVName={defaultVName}
        />
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

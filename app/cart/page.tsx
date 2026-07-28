'use client'

import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQty, clearCart } = useCart()

  const deliveryFee = cartTotal >= 100 ? 0 : 9.99
  const grandTotal = cartTotal + deliveryFee

  if (cartItems.length === 0) {
    return (
      <div className="w-[90%] max-w-[1200px] mx-auto my-[30px]">
        <h1 className="font-medium mb-[20px] text-[24px]">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-[20px] items-start">
          <div className="bg-white rounded-[8px] p-[60px] border border-[#f0f0f0] text-center shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="text-[60px] mb-[15px]">🛒</div>
            <h2 className="mb-[10px] font-bold text-[20px]">Your cart is empty</h2>
            <p className="text-[#888] mb-[20px] text-[14px]">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" className="inline-block bg-[#f85606] text-white px-[25px] py-[12px] rounded-[6px] font-bold shadow-[0_2px_5px_rgba(248,86,6,0.3)] hover:bg-[#d04000] transition-colors">
              Start Shopping
            </Link>
          </div>
          <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px]">
            <h3 className="text-[18px] mb-[15px] pb-[10px] border-b border-[#eee] font-bold">Order Summary</h3>
            <div className="flex justify-between mb-[10px] text-[#444] text-[14px]"><span>Subtotal (0 items)</span><span>৳0</span></div>
            <div className="flex justify-between mb-[15px] text-[#444] text-[14px]"><span>Delivery Fee</span><span className="text-[#10b981] font-bold">—</span></div>
            <div className="flex justify-between items-center py-[15px] border-t border-[#eee]"><span className="font-bold text-[#212121]">Total Amount</span><span className="text-[22px] font-bold text-[#f85606]">৳0</span></div>
            <Link href="/products" className="block w-full bg-[#f0f0f0] text-[#888] text-center no-underline p-[14px] rounded-[4px] font-bold mt-[20px] cursor-not-allowed">PROCEED TO CHECKOUT</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto my-[30px]">
      <div className="flex items-center justify-between mb-[20px]">
        <h1 className="font-medium text-[24px]">Your Shopping Cart <span className="text-[16px] text-[#888] font-normal">({cartCount} item{cartCount !== 1 ? 's' : ''})</span></h1>
        <button onClick={clearCart} className="text-[13px] text-[#e53935] hover:underline cursor-pointer bg-none border-none font-medium">
          <i className="fa-solid fa-trash mr-[5px]"></i>Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-[20px] items-start">

        {/* Cart items */}
        <div className="flex flex-col gap-[12px]">
          {cartItems.map(item => (
            <div key={`${item.id}-${item.variantName}`} className="bg-white rounded-[8px] p-[15px] border border-[#f0f0f0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex gap-[15px] items-center">
              <Link href={`/product/${item.id}`} className="shrink-0">
                <div className="w-[80px] h-[80px] border border-[#eee] rounded-[6px] flex items-center justify-center overflow-hidden bg-[#fafafa]">
                  {item.image ? (
                    <img src={`/admin_uploads/products/${item.image}`} alt={item.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <img src="https://placehold.jp/150x150.png" alt={item.name} className="max-w-full max-h-full object-contain" />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`} className="text-[14px] font-medium text-[#212121] hover:text-[#f85606] transition-colors line-clamp-2 block mb-[4px]">
                  {item.name}
                </Link>
                {item.variantName && item.variantName !== 'Regular' && (
                  <div className="text-[12px] text-[#888] mb-[8px]">Variant: <span className="text-[#555] font-medium">{item.variantName}</span></div>
                )}
                <div className="text-[16px] text-[#f85606] font-bold">৳{item.price.toLocaleString('en-BD')}</div>
              </div>

              <div className="flex flex-col items-end gap-[10px] shrink-0">
                {/* Qty controls */}
                <div className="flex items-center border border-[#ddd] rounded-[6px] overflow-hidden">
                  <button
                    onClick={() => updateQty(item.id, item.variantName, item.quantity - 1)}
                    className="w-[32px] h-[32px] bg-[#f5f5f5] border-none text-[16px] cursor-pointer hover:bg-[#ffe1d2] hover:text-[#f85606] transition-colors font-bold"
                  >
                    −
                  </button>
                  <span className="px-[12px] text-[14px] font-bold text-[#212121]">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.variantName, item.quantity + 1)}
                    className="w-[32px] h-[32px] bg-[#f5f5f5] border-none text-[16px] cursor-pointer hover:bg-[#ffe1d2] hover:text-[#f85606] transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-[14px] font-bold text-[#333]">
                  ৳{(item.price * item.quantity).toLocaleString('en-BD')}
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.variantName)}
                  className="text-[12px] text-[#e53935] hover:underline cursor-pointer bg-none border-none font-medium"
                >
                  <i className="fa-solid fa-trash-can mr-[4px]"></i>Remove
                </button>
              </div>
            </div>
          ))}

          <Link href="/products" className="text-[13px] text-[#1a9cb7] hover:underline font-medium mt-[5px] inline-flex items-center gap-[5px]">
            <i className="fa-solid fa-arrow-left text-[11px]"></i> Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-[8px] p-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] sticky top-[80px]">
          <h3 className="text-[18px] mb-[15px] pb-[10px] border-b border-[#eee] font-bold">Order Summary</h3>

          <div className="flex justify-between mb-[10px] text-[#444] text-[14px]">
            <span>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
            <span className="font-medium">৳{cartTotal.toLocaleString('en-BD')}</span>
          </div>
          <div className="flex justify-between mb-[15px] text-[#444] text-[14px]">
            <span>Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-[#10b981] font-bold">Free 🎉</span>
            ) : (
              <span className="font-medium">৳{deliveryFee.toLocaleString('en-BD')}</span>
            )}
          </div>

          {deliveryFee > 0 && (
            <div className="text-[12px] text-[#888] mb-[10px] bg-[#f9f9f9] p-[8px] rounded-[6px]">
              Add ৳{(100 - cartTotal).toLocaleString('en-BD')} more to get <strong className="text-[#10b981]">FREE delivery</strong>!
            </div>
          )}

          <div className="flex justify-between items-center py-[15px] border-t border-[#eee] mt-[10px]">
            <span className="font-bold text-[#212121]">Total Amount</span>
            <span className="text-[22px] font-bold text-[#f85606]">৳{grandTotal.toLocaleString('en-BD')}</span>
          </div>

          <Link href="/checkout" className="block w-full bg-[#f85606] text-white text-center no-underline p-[14px] rounded-[4px] font-bold mt-[20px] transition-all hover:bg-[#d04000]">
            PROCEED TO CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useCart } from '@/app/context/CartContext'
import { getProductImageUrl } from '@/lib/utils'

export default function CheckoutCartSummary() {
  const { cartItems, cartCount, cartTotal } = useCart()
  const deliveryFee = cartTotal >= 100 ? 0 : 9.99
  const grandTotal = cartTotal + deliveryFee

  return (
    <>
      {/* Cart item list */}
      <div className="max-h-[300px] overflow-y-auto mb-[15px] pr-[5px] flex flex-col gap-[10px]">
        {cartItems.length === 0 ? (
          <div className="text-[14px] text-[#888] text-center py-[20px]">Your cart is empty</div>
        ) : (
          cartItems.map(item => (
            <div key={`${item.id}-${item.variantName}`} className="flex items-center gap-[10px] py-[8px] border-b border-[#f5f5f5]">
              <div className="w-[45px] h-[45px] rounded-[4px] border border-[#eee] overflow-hidden shrink-0 bg-[#fafafa] flex items-center justify-center">
                <img
                  src={getProductImageUrl(item.image)}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.jp/100x100.png'
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-[#333] line-clamp-1 font-medium">{item.name}</div>
                {item.variantName && item.variantName !== 'Regular' && (
                  <div className="text-[11px] text-[#888]">{item.variantName}</div>
                )}
                <div className="text-[11px] text-[#555]">{item.quantity} × ৳{item.price.toLocaleString('en-BD')}</div>
              </div>
              <div className="text-[13px] font-bold text-[#212121] shrink-0">
                ৳{(item.price * item.quantity).toLocaleString('en-BD')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="flex justify-between py-[10px] border-t border-[#eee] text-[14px]">
        <span className="text-[#666]">Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
        <span className="font-bold text-[#212121]">৳{cartTotal.toLocaleString('en-BD')}</span>
      </div>
      <div className="flex justify-between py-[10px] border-b border-[#eee] text-[14px]">
        <span className="text-[#666]">Delivery Fee</span>
        <span className={`font-bold ${deliveryFee === 0 ? 'text-[#10b981]' : 'text-[#212121]'}`}>
          {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee.toLocaleString('en-BD')}`}
        </span>
      </div>
      <div className="flex justify-between items-center py-[18px]">
        <span className="text-[16px] font-bold text-[#212121]">Total to Pay</span>
        <span className="text-[24px] font-black text-[#f85606]">৳{grandTotal.toLocaleString('en-BD')}</span>
      </div>
    </>
  )
}
/**
 * Format date consistently on both server and client to prevent React hydration errors (Error #418).
 */
export function formatDate(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return 'N/A'
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return 'N/A'
  
  // Using explicit 'en-US' locale with specified options produces exact same string on Node SSR and client browser
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format price in BDT currency (৳)
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0))
  const validNum = isNaN(num) ? 0 : num
  return `৳${validNum.toLocaleString('en-BD')}`
}

/**
 * Resolve product image URL cleanly across local dev & production environments
 */
export function getProductImageUrl(image: string | null | undefined): string {
  if (!image) return 'https://placehold.jp/300x300.png'
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image
  }
  if (image.startsWith('/')) {
    return image
  }
  return `/admin_uploads/products/${image}`
}

/**
 * Resolve category image URL
 */
export function getCategoryImageUrl(image: string | null | undefined): string {
  if (!image) return 'https://placehold.jp/300x200.png'
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image
  }
  if (image.startsWith('/')) {
    return image
  }
  return `/admin_uploads/category/${image}`
}

/**
 * Resolve banner image URL
 */
export function getBannerImageUrl(image: string | null | undefined): string {
  if (!image) return 'https://placehold.jp/1200x400.png'
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image
  }
  if (image.startsWith('/')) {
    return image
  }
  return `/admin_uploads/banners/${image}`
}

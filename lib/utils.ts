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
  let cleanImg = String(image).trim()
  if (!cleanImg) return 'https://placehold.jp/300x300.png'

  if (cleanImg.startsWith('https:/') && !cleanImg.startsWith('https://')) {
    cleanImg = cleanImg.replace('https:/', 'https://')
  }
  if (cleanImg.startsWith('http:/') && !cleanImg.startsWith('http://')) {
    cleanImg = cleanImg.replace('http:/', 'http://')
  }
  if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://') || cleanImg.startsWith('data:')) {
    return cleanImg
  }
  if (cleanImg.startsWith('/')) {
    return cleanImg
  }
  // Cloudinary public ID shorthand
  if (cleanImg.startsWith('verusmart/')) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dson1fyr'
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanImg}`
  }
  return `/admin_uploads/products/${cleanImg}`
}

/**
 * Resolve category image URL
 */
export function getCategoryImageUrl(image: string | null | undefined): string {
  if (!image) return 'https://placehold.jp/300x200.png'
  let cleanImg = String(image).trim()
  if (!cleanImg) return 'https://placehold.jp/300x200.png'

  if (cleanImg.startsWith('https:/') && !cleanImg.startsWith('https://')) {
    cleanImg = cleanImg.replace('https:/', 'https://')
  }
  if (cleanImg.startsWith('http:/') && !cleanImg.startsWith('http://')) {
    cleanImg = cleanImg.replace('http:/', 'http://')
  }
  if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://') || cleanImg.startsWith('data:')) {
    return cleanImg
  }
  if (cleanImg.startsWith('/')) {
    return cleanImg
  }
  if (cleanImg.startsWith('verusmart/')) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dson1fyr'
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanImg}`
  }
  return `/admin_uploads/category/${cleanImg}`
}

/**
 * Resolve banner image URL
 */
export function getBannerImageUrl(image: string | null | undefined): string {
  if (!image) return 'https://placehold.jp/1200x400.png'
  let cleanImg = String(image).trim()
  if (!cleanImg) return 'https://placehold.jp/1200x400.png'

  if (cleanImg.startsWith('https:/') && !cleanImg.startsWith('https://')) {
    cleanImg = cleanImg.replace('https:/', 'https://')
  }
  if (cleanImg.startsWith('http:/') && !cleanImg.startsWith('http://')) {
    cleanImg = cleanImg.replace('http:/', 'http://')
  }
  if (cleanImg.startsWith('http://') || cleanImg.startsWith('https://') || cleanImg.startsWith('data:')) {
    return cleanImg
  }
  if (cleanImg.startsWith('/')) {
    return cleanImg
  }
  if (cleanImg.startsWith('verusmart/')) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dson1fyr'
    return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanImg}`
  }
  return `/admin_uploads/banners/${cleanImg}`
}

/**
 * Resolve store logo URL
 */
export function getStoreLogoUrl(logo: string | null | undefined): string {
  if (!logo) return '/admin_uploads/logo.png'
  const clean = String(logo).trim()
  if (!clean) return '/admin_uploads/logo.png'
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean
  }
  if (clean.startsWith('/')) {
    return clean
  }
  return `/admin_uploads/${clean}`
}


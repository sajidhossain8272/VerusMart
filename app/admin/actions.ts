'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Validate required env vars in production
function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_JWT_SECRET

  if (process.env.NODE_ENV === 'production') {
    if (!email || !password || !secret) {
      throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_JWT_SECRET must be set in production.')
    }
    if (secret.length < 32) {
      throw new Error('ADMIN_JWT_SECRET must be at least 32 characters long.')
    }
  }

  return {
    email: email || 'admin@verusmart.com',
    password: password || 'verusMartAdminSecurePass2026!',
  }
}

// Constant-time string comparison that handles different lengths safely
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

// Validate uploaded image files
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function validateImageFile(file: File | null): string | null {
  if (!file || file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max size: 5MB`
  }
  return null
}

// Sanitize a string input to prevent XSS
function sanitizeInput(value: string, maxLength = 5000): string {
  return value
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;')
    .trim()
    .slice(0, maxLength)
}

// Parse variants from form data (JSON string in 'variants' field)
// Format: [{ variant_name: string, price: number, old_price: number }]
function parseVariants(formData: FormData): { variant_name: string; price: number; old_price: number }[] {
  const raw = formData.get('variants') as string || '[]'
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(v => v && typeof v.variant_name === 'string' && v.variant_name.trim())
      .map(v => ({
        variant_name: sanitizeInput(v.variant_name, 100),
        price: parseFloat(v.price) || 0,
        old_price: parseFloat(v.old_price) || 0,
      }))
  } catch {
    return []
  }
}

// Generate a random session token (not a deterministic hash)
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Store active sessions in memory (single-instance). For multi-instance, use Redis/DB.
const activeAdminSessions = new Set<string>()

// Authentication verification
export async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    return !!token && activeAdminSessions.has(token)
  } catch (e) {
    return false
  }
}

// Internal auth enforcement for mutating actions
async function enforceAuth() {
  const authenticated = await checkAuth()
  if (!authenticated) {
    throw new Error('Unauthorized action. Admin session is invalid or expired.')
  }
}

// Login action
export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const { email: expectedEmail, password: expectedPassword } = getAdminCredentials()

    // Constant-time comparison to prevent timing attacks
    const emailMatch = safeEqual(email.toLowerCase(), expectedEmail.toLowerCase())
    const pwdMatch = safeEqual(password, expectedPassword)

    if (emailMatch && pwdMatch) {
      const sessionToken = generateSessionToken()
      activeAdminSessions.add(sessionToken)
      const cookieStore = await cookies()
      cookieStore.set('admin_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      })
      return { success: true }
    }

    return { success: false, error: 'Invalid admin credentials.' }
  } catch (error: any) {
    console.error('Admin login error:', error)
    return { success: false, error: error.message || 'Authentication failed.' }
  }
}

// Logout action
export async function logout() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (token) {
      activeAdminSessions.delete(token)
    }
    cookieStore.delete('admin_token')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Delete all products and their references
export async function resetProducts() {
  await enforceAuth()
  try {
    // Delete references first to avoid foreign key constraints
    await prisma.wishlist.deleteMany({})
    await prisma.product_colors.deleteMany({})
    await prisma.product_gallery.deleteMany({})
    await prisma.product_sizes.deleteMany({})
    await prisma.product_variants.deleteMany({})
    await prisma.products.deleteMany({})
    
    revalidatePath('/')
    revalidatePath('/products')
    return { success: true, message: 'All products removed successfully.' }
  } catch (error: any) {
    console.error('Reset products error:', error)
    return { success: false, error: error.message || 'Failed to remove products.' }
  }
}

// Update order status
export async function updateOrderStatus(orderId: number, status: string) {
  await enforceAuth()
  try {
    await prisma.orders.update({
      where: { id: orderId },
      data: { status }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update Business/Store settings and upload Logo if provided
export async function updateStoreSettings(formData: FormData) {
  await enforceAuth()
  try {
    const companyName = sanitizeInput(formData.get('companyName') as string || '', 255)
    const phone = sanitizeInput(formData.get('phone') as string || '', 50)
    const email = sanitizeInput(formData.get('email') as string || '', 100)
    const address = sanitizeInput(formData.get('address') as string || '', 2000)
    const shippingInside = parseFloat(formData.get('shippingInside') as string || '0')
    const shippingOutside = parseFloat(formData.get('shippingOutside') as string || '0')
    const logoFile = formData.get('logo') as File | null

    // Validate logo file if provided
    const logoError = validateImageFile(logoFile)
    if (logoError) {
      return { success: false, error: logoError }
    }

    // Update DB settings
    await prisma.business_settings.upsert({
      where: { id: 1 },
      update: {
        company_name: companyName,
        phone,
        email,
        address,
        shipping_inside: shippingInside,
        shipping_outside: shippingOutside,
      },
      create: {
        id: 1,
        company_name: companyName,
        phone,
        email,
        address,
        shipping_inside: shippingInside,
        shipping_outside: shippingOutside,
      }
    })

    // Handle Logo Upload to public/admin_uploads/logo.png
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'logo.png')
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Update settings error:', error)
    return { success: false, error: error.message }
  }
}

// Add a Product
export async function createProduct(formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    const description = sanitizeInput(formData.get('description') as string || '', 10000)
    const price = parseFloat(formData.get('price') as string)
    const oldPrice = parseFloat(formData.get('oldPrice') as string || '0')
    const stock = parseInt(formData.get('stock') as string || '0')
    const categoryId = parseInt(formData.get('categoryId') as string || '0')
    const unit = sanitizeInput(formData.get('unit') as string || 'per lb', 50)
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = sanitizeInput(formData.get('metaTitle') as string || '', 255) || null
    const metaDescription = sanitizeInput(formData.get('metaDescription') as string || '', 2000) || null
    const imageFile = formData.get('image') as File | null
    const variants = parseVariants(formData)

    // Validate image file if provided
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    let imageName = ''
    if (imageFile && imageFile.size > 0) {
      imageName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'products', imageName)
      
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        old_price: oldPrice,
        stock,
        category_id: categoryId > 0 ? categoryId : null,
        unit,
        is_recommended: isRecommended,
        is_featured: isFeatured,
        is_trending: isTrending,
        is_best_seller: isBestSeller,
        is_weekday_deal: isWeekdayDeal,
        meta_title: metaTitle,
        meta_description: metaDescription,
        image: imageName ? imageName : null,
        status: 'active'
      }
    })

    // Save product variants
    if (variants.length > 0 && product.id) {
      await prisma.product_variants.createMany({
        data: variants.map(v => ({
          product_id: product.id,
          variant_name: v.variant_name,
          price: v.price,
          old_price: v.old_price,
        }))
      })
    }

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Create product error:', error)
    return { success: false, error: error.message }
  }
}

// Edit a Product
export async function updateProduct(id: number, formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    const description = sanitizeInput(formData.get('description') as string || '', 10000)
    const price = parseFloat(formData.get('price') as string)
    const oldPrice = parseFloat(formData.get('oldPrice') as string || '0')
    const stock = parseInt(formData.get('stock') as string || '0')
    const categoryId = parseInt(formData.get('categoryId') as string || '0')
    const unit = sanitizeInput(formData.get('unit') as string || 'per lb', 50)
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = sanitizeInput(formData.get('metaTitle') as string || '', 255) || null
    const metaDescription = sanitizeInput(formData.get('metaDescription') as string || '', 2000) || null
    const imageFile = formData.get('image') as File | null
    const variants = parseVariants(formData)

    const existingProduct = await prisma.products.findUnique({ where: { id } })
    if (!existingProduct) throw new Error('Product not found')

    // Validate image file if provided
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    let imageName = existingProduct.image
    if (imageFile && imageFile.size > 0) {
      imageName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'products', imageName)
      
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    await prisma.products.update({
      where: { id },
      data: {
        name,
        description,
        price,
        old_price: oldPrice,
        stock,
        category_id: categoryId > 0 ? categoryId : null,
        unit,
        is_recommended: isRecommended,
        is_featured: isFeatured,
        is_trending: isTrending,
        is_best_seller: isBestSeller,
        is_weekday_deal: isWeekdayDeal,
        meta_title: metaTitle,
        meta_description: metaDescription,
        image: imageName,
      }
    })

    // Replace product variants (delete old, insert new)
    await prisma.product_variants.deleteMany({ where: { product_id: id } })
    if (variants.length > 0) {
      await prisma.product_variants.createMany({
        data: variants.map(v => ({
          product_id: id,
          variant_name: v.variant_name,
          price: v.price,
          old_price: v.old_price,
        }))
      })
    }

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Update product error:', error)
    return { success: false, error: error.message }
  }
}

// Delete a Product
export async function deleteProduct(id: number) {
  await enforceAuth()
  try {
    // Delete product references first
    await prisma.wishlist.deleteMany({ where: { product_id: id } })
    await prisma.product_colors.deleteMany({ where: { product_id: id } })
    await prisma.product_gallery.deleteMany({ where: { product_id: id } })
    await prisma.product_sizes.deleteMany({ where: { product_id: id } })
    await prisma.product_variants.deleteMany({ where: { product_id: id } })
    
    await prisma.products.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Delete product error:', error)
    return { success: false, error: error.message }
  }
}

// Create a Category
export async function createCategory(formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    const priority = parseInt(formData.get('priority') as string || '0')
    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

    // Validate image files if provided
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }
    const bannerError = validateImageFile(bannerFile)
    if (bannerError) {
      return { success: false, error: bannerError }
    }

    let imageName = ''
    if (imageFile && imageFile.size > 0) {
      imageName = `${Date.now()}_icon_${imageFile.name.replace(/\s+/g, '_')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'category', imageName)
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    let bannerName = ''
    if (bannerFile && bannerFile.size > 0) {
      bannerName = `${Date.now()}_banner_${bannerFile.name.replace(/\s+/g, '_')}`
      const bytes = await bannerFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'category', bannerName)
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    await prisma.categories.create({
      data: {
        name,
        priority,
        status: status as any,
        image: imageName ? imageName : null,
        banner: bannerName ? bannerName : null
      }
    })

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Create category error:', error)
    return { success: false, error: error.message }
  }
}

// Update a Category
export async function updateCategory(id: number, formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    const priority = parseInt(formData.get('priority') as string || '0')
    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

    const existingCategory = await prisma.categories.findUnique({ where: { id } })
    if (!existingCategory) throw new Error('Category not found')

    // Validate image files if provided
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }
    const bannerError = validateImageFile(bannerFile)
    if (bannerError) {
      return { success: false, error: bannerError }
    }

    let imageName = existingCategory.image
    if (imageFile && imageFile.size > 0) {
      imageName = `${Date.now()}_icon_${imageFile.name.replace(/\s+/g, '_')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'category', imageName)
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    let bannerName = existingCategory.banner
    if (bannerFile && bannerFile.size > 0) {
      bannerName = `${Date.now()}_banner_${bannerFile.name.replace(/\s+/g, '_')}`
      const bytes = await bannerFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'category', bannerName)
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    await prisma.categories.update({
      where: { id },
      data: {
        name,
        priority,
        status: status as any,
        image: imageName,
        banner: bannerName
      }
    })

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Update category error:', error)
    return { success: false, error: error.message }
  }
}

// Delete a Category
export async function deleteCategory(id: number) {
  await enforceAuth()
  try {
    // Unlink products associated with this category
    await prisma.products.updateMany({
      where: { category_id: id },
      data: { category_id: null }
    })

    await prisma.categories.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/products')
    return { success: true }
  } catch (error: any) {
    console.error('Delete category error:', error)
    return { success: false, error: error.message }
  }
}

// Create a Banner
export async function createBanner(formData: FormData) {
  await enforceAuth()
  try {
    const title = sanitizeInput(formData.get('title') as string || '', 255)
    const position = sanitizeInput(formData.get('position') as string || 'main', 20)
    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null

    if (!imageFile || imageFile.size === 0) {
      throw new Error('Image file is required for banners')
    }

    // Validate banner image
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    const imageName = `${Date.now()}_banner_${imageFile.name.replace(/\s+/g, '_')}`
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'banners', imageName)
    await fs.mkdir(path.dirname(uploadPath), { recursive: true })
    await fs.writeFile(uploadPath, buffer)

    await prisma.banners.create({
      data: {
        title,
        position: position as any,
        status: status as any,
        image: imageName
      }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Create banner error:', error)
    return { success: false, error: error.message }
  }
}

// Delete a Banner
export async function deleteBanner(id: number) {
  await enforceAuth()
  try {
    await prisma.banners.delete({
      where: { id }
    })
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Delete banner error:', error)
    return { success: false, error: error.message }
  }
}
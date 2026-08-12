'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'
import { getAdminSession, setAdminSession, clearAdminSession } from '@/lib/auth'

import os from 'os'

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

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function validateImageFile(file: File | null): string | null {
  if (!file || file.size === 0 || !file.name) return null
  const ext = path.extname(file.name).toLowerCase()
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']
  const fileType = (file.type || '').toLowerCase()
  
  if (!allowedExts.includes(ext) && !fileType.startsWith('image/')) {
    return `Invalid file type for ${file.name}. Allowed image formats: JPG, PNG, WebP, GIF, SVG`
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`
  }
  return null
}

async function saveUploadedFile(file: File, folder: string): Promise<string> {
  const sanitizeFileName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const imageName = `${Date.now()}_${sanitizeFileName}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  try {
    const uploadPath1 = path.join(process.cwd(), 'public', 'admin_uploads', folder, imageName)
    await fs.mkdir(path.dirname(uploadPath1), { recursive: true })
    await fs.writeFile(uploadPath1, buffer)

    if (folder === 'products') {
      const uploadPath2 = path.join(process.cwd(), 'public', 'products', imageName)
      await fs.mkdir(path.dirname(uploadPath2), { recursive: true })
      await fs.writeFile(uploadPath2, buffer)
    }
    return imageName
  } catch (fsErr: any) {
    console.warn('Local disk write notice (read-only filesystem or serverless):', fsErr.message)
    const mimeType = file.type || 'image/jpeg'
    const base64Str = buffer.toString('base64')
    return `data:${mimeType};base64,${base64Str}`
  }
}

function sanitizeInput(value: string, maxLength = 5000): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .slice(0, maxLength)
}

function parseVariants(formData: FormData): { variant_name: string; price: number; old_price: number }[] {
  const raw = formData.get('variants') as string || '[]'
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(v => v && typeof v.variant_name === 'string' && v.variant_name.trim())
      .map(v => ({
        variant_name: sanitizeInput(v.variant_name, 100),
        price: isNaN(parseFloat(v.price)) ? 0 : parseFloat(v.price),
        old_price: isNaN(parseFloat(v.old_price)) ? 0 : parseFloat(v.old_price),
      }))
  } catch {
    return []
  }
}

export async function checkAuth() {
  try {
    const session = await getAdminSession()
    return !!session
  } catch {
    return false
  }
}

async function enforceAuth() {
  const authenticated = await checkAuth()
  if (!authenticated) {
    throw new Error('Unauthorized action. Admin session is invalid or expired.')
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const { email: expectedEmail, password: expectedPassword } = getAdminCredentials()

    const emailMatch = safeEqual(email.toLowerCase(), expectedEmail.toLowerCase())
    const pwdMatch = safeEqual(password, expectedPassword)

    if (emailMatch && pwdMatch) {
      await setAdminSession({ email })
      return { success: true }
    }

    return { success: false, error: 'Invalid admin credentials.' }
  } catch (error: any) {
    console.error('Admin login error:', error)
    return { success: false, error: error.message || 'Authentication failed.' }
  }
}

export async function logout() {
  try {
    await clearAdminSession()
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resetProducts() {
  await enforceAuth()
  try {
    await prisma.wishlist.deleteMany({})
    await prisma.product_colors.deleteMany({})
    await prisma.product_gallery.deleteMany({})
    await prisma.product_sizes.deleteMany({})
    await prisma.product_variants.deleteMany({})
    await prisma.products.deleteMany({})
    
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin')
    return { success: true, message: 'All products removed successfully.' }
  } catch (error: any) {
    console.error('Reset products error:', error)
    return { success: false, error: error.message || 'Failed to remove products.' }
  }
}

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

export async function updateStoreSettings(formData: FormData) {
  await enforceAuth()
  try {
    const companyName = sanitizeInput(formData.get('companyName') as string || '', 255)
    const phone = sanitizeInput(formData.get('phone') as string || '', 50)
    const email = sanitizeInput(formData.get('email') as string || '', 100)
    const address = sanitizeInput(formData.get('address') as string || '', 2000)
    
    const shippingInsideRaw = parseFloat(formData.get('shippingInside') as string || '0')
    const shippingInside = isNaN(shippingInsideRaw) ? 60 : shippingInsideRaw

    const shippingOutsideRaw = parseFloat(formData.get('shippingOutside') as string || '0')
    const shippingOutside = isNaN(shippingOutsideRaw) ? 120 : shippingOutsideRaw

    const logoFile = formData.get('logo') as File | null
    const logoError = validateImageFile(logoFile)
    if (logoError) {
      return { success: false, error: logoError }
    }

    let logoName: string | null = null
    if (logoFile && logoFile.size > 0 && logoFile.name) {
      const bytes = await logoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'logo.png')
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
      logoName = 'logo.png'
    }

    const settingsData: Record<string, any> = {
      company_name: companyName,
      phone,
      email,
      address,
      shipping_inside: shippingInside,
      shipping_outside: shippingOutside,
    }
    if (logoName) {
      settingsData.logo = logoName
    }

    const updated = await prisma.business_settings.upsert({
      where: { id: 1 },
      update: settingsData,
      create: {
        id: 1,
        ...settingsData
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { 
      success: true, 
      settings: {
        ...updated,
        shipping_inside: Number(updated.shipping_inside),
        shipping_outside: Number(updated.shipping_outside)
      }
    }
  } catch (error: any) {
    console.error('Update settings error:', error)
    return { success: false, error: error.message }
  }
}

export async function createProduct(formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    if (!name) {
      return { success: false, error: 'Product name is required.' }
    }

    const description = sanitizeInput(formData.get('description') as string || '', 10000)
    const variants = parseVariants(formData)
    
    const priceRaw = parseFloat(formData.get('price') as string)
    let price = isNaN(priceRaw) ? 0 : priceRaw
    if (price <= 0 && variants.length > 0) {
      price = variants[0].price
    }
    if (price <= 0) {
      return { success: false, error: 'A valid product price or size variant price is required.' }
    }

    const oldPriceRaw = parseFloat(formData.get('oldPrice') as string || '0')
    const oldPrice = isNaN(oldPriceRaw) ? 0 : oldPriceRaw

    const stockRaw = parseInt(formData.get('stock') as string || '0')
    const stock = isNaN(stockRaw) ? 0 : stockRaw

    const categoryIdRaw = parseInt(formData.get('categoryId') as string || '0')
    const categoryId = isNaN(categoryIdRaw) ? 0 : categoryIdRaw

    const unit = sanitizeInput(formData.get('unit') as string || 'per lb', 50)
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = sanitizeInput(formData.get('metaTitle') as string || '', 255) || null
    const metaDescription = sanitizeInput(formData.get('metaDescription') as string || '', 2000) || null

    const imageUrlInput = sanitizeInput(formData.get('imageUrl') as string || '', 500)
    const imageFile = formData.get('image') as File | null
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    let imageName: string | null = null
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageName = await saveUploadedFile(imageFile, 'products')
    } else if (imageUrlInput) {
      imageName = imageUrlInput
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
        image: imageName,
        status: 'active'
      }
    })

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
    revalidatePath('/admin')

    const serializedProduct = JSON.parse(JSON.stringify({
      ...product,
      price: Number(product.price),
      old_price: Number(product.old_price),
      stock: product.stock ?? 0,
      is_recommended: !!product.is_recommended,
      is_featured: !!product.is_featured,
      is_trending: !!product.is_trending,
      is_best_seller: !!product.is_best_seller,
      is_weekday_deal: !!product.is_weekday_deal,
      created_at: product.created_at ? product.created_at.toISOString() : null
    }))

    return { success: true, product: serializedProduct }
  } catch (error: any) {
    console.error('Create product error:', error)
    return { success: false, error: error.message || 'Failed to create product.' }
  }
}

export async function updateProduct(id: number, formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    if (!name) {
      return { success: false, error: 'Product name is required.' }
    }

    const description = sanitizeInput(formData.get('description') as string || '', 10000)
    const variants = parseVariants(formData)

    const priceRaw = parseFloat(formData.get('price') as string)
    let price = isNaN(priceRaw) ? 0 : priceRaw
    if (price <= 0 && variants.length > 0) {
      price = variants[0].price
    }
    if (price <= 0) {
      return { success: false, error: 'A valid product price or size variant price is required.' }
    }

    const oldPriceRaw = parseFloat(formData.get('oldPrice') as string || '0')
    const oldPrice = isNaN(oldPriceRaw) ? 0 : oldPriceRaw

    const stockRaw = parseInt(formData.get('stock') as string || '0')
    const stock = isNaN(stockRaw) ? 0 : stockRaw

    const categoryIdRaw = parseInt(formData.get('categoryId') as string || '0')
    const categoryId = isNaN(categoryIdRaw) ? 0 : categoryIdRaw

    const unit = sanitizeInput(formData.get('unit') as string || 'per lb', 50)
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = sanitizeInput(formData.get('metaTitle') as string || '', 255) || null
    const metaDescription = sanitizeInput(formData.get('metaDescription') as string || '', 2000) || null

    const existingProduct = await prisma.products.findUnique({ where: { id } })
    if (!existingProduct) throw new Error('Product not found')

    const imageUrlInput = sanitizeInput(formData.get('imageUrl') as string || '', 500)
    const imageFile = formData.get('image') as File | null
    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    let imageName = existingProduct.image
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageName = await saveUploadedFile(imageFile, 'products')
    } else if (imageUrlInput) {
      imageName = imageUrlInput
    }

    const updatedProduct = await prisma.products.update({
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
    revalidatePath('/admin')

    const serializedProduct = JSON.parse(JSON.stringify({
      ...updatedProduct,
      price: Number(updatedProduct.price),
      old_price: Number(updatedProduct.old_price),
      stock: updatedProduct.stock ?? 0,
      is_recommended: !!updatedProduct.is_recommended,
      is_featured: !!updatedProduct.is_featured,
      is_trending: !!updatedProduct.is_trending,
      is_best_seller: !!updatedProduct.is_best_seller,
      is_weekday_deal: !!updatedProduct.is_weekday_deal,
      created_at: updatedProduct.created_at ? updatedProduct.created_at.toISOString() : null
    }))

    return { success: true, product: serializedProduct }
  } catch (error: any) {
    console.error('Update product error:', error)
    return { success: false, error: error.message || 'Failed to update product.' }
  }
}

export async function deleteProduct(id: number) {
  await enforceAuth()
  try {
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
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Delete product error:', error)
    return { success: false, error: error.message }
  }
}

export async function createCategory(formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    if (!name) {
      return { success: false, error: 'Category name is required.' }
    }

    const priorityRaw = parseInt(formData.get('priority') as string || '0')
    const priority = isNaN(priorityRaw) ? 0 : priorityRaw

    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }
    const bannerError = validateImageFile(bannerFile)
    if (bannerError) {
      return { success: false, error: bannerError }
    }

    let imageName: string | null = null
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageName = await saveUploadedFile(imageFile, 'category')
    }

    let bannerName: string | null = null
    if (bannerFile && bannerFile.size > 0 && bannerFile.name) {
      bannerName = await saveUploadedFile(bannerFile, 'category')
    }

    const newCategory = await prisma.categories.create({
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
    revalidatePath('/admin')

    return { success: true, category: JSON.parse(JSON.stringify(newCategory)) }
  } catch (error: any) {
    console.error('Create category error:', error)
    return { success: false, error: error.message }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  await enforceAuth()
  try {
    const name = sanitizeInput(formData.get('name') as string || '', 255)
    if (!name) {
      return { success: false, error: 'Category name is required.' }
    }

    const priorityRaw = parseInt(formData.get('priority') as string || '0')
    const priority = isNaN(priorityRaw) ? 0 : priorityRaw

    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

    const existingCategory = await prisma.categories.findUnique({ where: { id } })
    if (!existingCategory) throw new Error('Category not found')

    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }
    const bannerError = validateImageFile(bannerFile)
    if (bannerError) {
      return { success: false, error: bannerError }
    }

    let imageName = existingCategory.image
    if (imageFile && imageFile.size > 0 && imageFile.name) {
      imageName = await saveUploadedFile(imageFile, 'category')
    }

    let bannerName = existingCategory.banner
    if (bannerFile && bannerFile.size > 0 && bannerFile.name) {
      bannerName = await saveUploadedFile(bannerFile, 'category')
    }

    const updatedCategory = await prisma.categories.update({
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
    revalidatePath('/admin')

    return { success: true, category: JSON.parse(JSON.stringify(updatedCategory)) }
  } catch (error: any) {
    console.error('Update category error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(id: number) {
  await enforceAuth()
  try {
    await prisma.products.updateMany({
      where: { category_id: id },
      data: { category_id: null }
    })

    await prisma.categories.delete({
      where: { id }
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Delete category error:', error)
    return { success: false, error: error.message }
  }
}

export async function createBanner(formData: FormData) {
  await enforceAuth()
  try {
    const title = sanitizeInput(formData.get('title') as string || '', 255)
    const position = sanitizeInput(formData.get('position') as string || 'main', 20)
    const status = sanitizeInput(formData.get('status') as string || 'active', 20)
    const imageFile = formData.get('image') as File | null

    if (!imageFile || imageFile.size === 0 || !imageFile.name) {
      return { success: false, error: 'Image file is required for banners.' }
    }

    const imageError = validateImageFile(imageFile)
    if (imageError) {
      return { success: false, error: imageError }
    }

    const imageName = await saveUploadedFile(imageFile, 'banners')

    const newBanner = await prisma.banners.create({
      data: {
        title,
        position: position as any,
        status: status as any,
        image: imageName
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, banner: JSON.parse(JSON.stringify(newBanner)) }
  } catch (error: any) {
    console.error('Create banner error:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteBanner(id: number) {
  await enforceAuth()
  try {
    await prisma.banners.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Delete banner error:', error)
    return { success: false, error: error.message }
  }
}

export async function createCoupon(formData: FormData) {
  await enforceAuth()
  try {
    const code = (formData.get('code') as string || '').trim().toUpperCase()
    const discount_type = (formData.get('discount_type') as string || 'percentage')
    const discount_amount = parseFloat(formData.get('discount_amount') as string || '0')
    const min_order_amount = parseFloat(formData.get('min_order_amount') as string || '0')
    const max_discount = parseFloat(formData.get('max_discount') as string || '0') || null
    const usage_limit = parseInt(formData.get('usage_limit') as string || '100')
    const expires_at_raw = formData.get('expires_at') as string

    if (!code || isNaN(discount_amount) || discount_amount <= 0) {
      return { success: false, error: 'Coupon code and a valid discount amount are required.' }
    }

    const expires_at = expires_at_raw ? new Date(expires_at_raw) : null

    const newCoupon = await prisma.coupons.create({
      data: {
        code,
        discount_type,
        discount_amount,
        min_order_amount: isNaN(min_order_amount) ? 0 : min_order_amount,
        max_discount: isNaN(max_discount as any) ? null : max_discount,
        usage_limit: isNaN(usage_limit) ? 100 : usage_limit,
        expires_at,
        status: 'active'
      }
    })

    revalidatePath('/admin')

    return { 
      success: true, 
      coupon: {
        ...newCoupon,
        discount_amount: Number(newCoupon.discount_amount),
        min_order_amount: Number(newCoupon.min_order_amount || 0),
        max_discount: Number(newCoupon.max_discount || 0),
        expires_at: newCoupon.expires_at ? newCoupon.expires_at.toISOString() : null
      } 
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create coupon' }
  }
}

export async function deleteCoupon(id: number) {
  await enforceAuth()
  try {
    await prisma.coupons.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateReviewStatus(id: number, status: 'approved' | 'rejected') {
  await enforceAuth()
  try {
    await prisma.reviews.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteReview(id: number) {
  await enforceAuth()
  try {
    await prisma.reviews.delete({ where: { id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
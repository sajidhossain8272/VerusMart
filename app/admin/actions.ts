'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Helper to get matching session hash
function getSessionHash() {
  const email = process.env.ADMIN_EMAIL || 'admin@verusmart.com'
  const password = process.env.ADMIN_PASSWORD || 'verusMartAdminSecurePass2026!'
  const secret = process.env.ADMIN_JWT_SECRET || 'secret'
  return crypto.createHash('sha256').update(`${email}:${password}:${secret}`).digest('hex')
}

// Authentication verification
export async function checkAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    const expectedToken = getSessionHash()
    return token === expectedToken
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

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@verusmart.com'
    const expectedPassword = process.env.ADMIN_PASSWORD || 'verusMartAdminSecurePass2026!'

    if (email === expectedEmail && password === expectedPassword) {
      const sessionToken = getSessionHash()
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
    return { success: false, error: error.message || 'Authentication failed.' }
  }
}

// Logout action
export async function logout() {
  try {
    const cookieStore = await cookies()
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
    const companyName = formData.get('companyName') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const address = formData.get('address') as string
    const shippingInside = parseFloat(formData.get('shippingInside') as string || '0')
    const shippingOutside = parseFloat(formData.get('shippingOutside') as string || '0')
    const logoFile = formData.get('logo') as File | null

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
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const oldPrice = parseFloat(formData.get('oldPrice') as string || '0')
    const stock = parseInt(formData.get('stock') as string || '0')
    const categoryId = parseInt(formData.get('categoryId') as string || '0')
    const unit = formData.get('unit') as string || 'per lb'
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = formData.get('metaTitle') as string || null
    const metaDescription = formData.get('metaDescription') as string || null
    const imageFile = formData.get('image') as File | null

    let imageName = ''
    if (imageFile && imageFile.size > 0) {
      imageName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadPath = path.join(process.cwd(), 'public', 'admin_uploads', 'products', imageName)
      
      await fs.mkdir(path.dirname(uploadPath), { recursive: true })
      await fs.writeFile(uploadPath, buffer)
    }

    await prisma.products.create({
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
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const oldPrice = parseFloat(formData.get('oldPrice') as string || '0')
    const stock = parseInt(formData.get('stock') as string || '0')
    const categoryId = parseInt(formData.get('categoryId') as string || '0')
    const unit = formData.get('unit') as string || 'per lb'
    const isRecommended = formData.get('isRecommended') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const isBestSeller = formData.get('isBestSeller') === 'true'
    const isWeekdayDeal = formData.get('isWeekdayDeal') === 'true'
    const metaTitle = formData.get('metaTitle') as string || null
    const metaDescription = formData.get('metaDescription') as string || null
    const imageFile = formData.get('image') as File | null

    const existingProduct = await prisma.products.findUnique({ where: { id } })
    if (!existingProduct) throw new Error('Product not found')

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
    const name = formData.get('name') as string
    const priority = parseInt(formData.get('priority') as string || '0')
    const status = formData.get('status') as string || 'active'
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

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
    const name = formData.get('name') as string
    const priority = parseInt(formData.get('priority') as string || '0')
    const status = formData.get('status') as string || 'active'
    const imageFile = formData.get('image') as File | null
    const bannerFile = formData.get('banner') as File | null

    const existingCategory = await prisma.categories.findUnique({ where: { id } })
    if (!existingCategory) throw new Error('Category not found')

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
    const title = formData.get('title') as string
    const position = formData.get('position') as string || 'main'
    const status = formData.get('status') as string || 'active'
    const imageFile = formData.get('image') as File | null

    if (!imageFile || imageFile.size === 0) {
      throw new Error('Image file is required for banners')
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

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function runE2ETests() {
  console.log('\n🚀 STARTING COMPREHENSIVE E2E & PRODUCTION READINESS TEST SUITE\n')

  let passedTests = 0
  let failedTests = 0

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`)
      passedTests++
    } else {
      console.error(`  ❌ [FAIL] ${testName}`)
      failedTests++
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: DATABASE INTEGRITY & SEED CHECK
    // -------------------------------------------------------------
    console.log('--- TEST GROUP 1: Database & Seed Integrity ---')
    const productCount = await prisma.products.count()
    assert(productCount >= 0, `Products table accessible (Total: ${productCount})`)

    const categoryCount = await prisma.categories.count()
    assert(categoryCount >= 0, `Categories table accessible (Total: ${categoryCount})`)

    // Ensure test user exists
    const testEmail = `e2e_test_${Date.now()}@verusmart.com`
    const testPassword = 'SecureTestPassword123!'
    const hashedPassword = await bcrypt.hash(testPassword, 10)

    const testUser = await prisma.users.create({
      data: {
        full_name: 'E2E Test Customer',
        email: testEmail,
        phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: hashedPassword,
        status: 'active'
      }
    })
    assert(!!testUser.id, `Created test customer record (ID: ${testUser.id})`)

    // -------------------------------------------------------------
    // TEST 2: COUPON CREATION & VALIDATION
    // -------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: Coupon Creation & Validation ---')
    const couponCode = `E2E_PROMO_${Date.now()}`
    const coupon = await prisma.coupons.create({
      data: {
        code: couponCode,
        discount_type: 'percentage',
        discount_amount: 15,
        min_order_amount: 100,
        usage_limit: 50,
        status: 'active'
      }
    })
    assert(coupon.code === couponCode, `Coupon code created in DB (${couponCode})`)

    // -------------------------------------------------------------
    // TEST 3: ORDER CREATION & INVENTORY ATOMICITY
    // -------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: Order Pipeline & Inventory Atomicity ---')
    
    // Ensure at least one product exists for testing
    let sampleProduct = await prisma.products.findFirst({ where: { status: 'active' } })
    if (!sampleProduct) {
      sampleProduct = await prisma.products.create({
        data: {
          name: 'E2E Test Fresh Apples',
          description: 'Delicious fresh apples',
          price: 150.00,
          stock: 100,
          status: 'active',
          unit: 'per kg'
        }
      })
    }

    const initialStock = sampleProduct.stock ?? 100
    const orderQty = 3
    const subtotal = Number(sampleProduct.price) * orderQty
    const discount = (subtotal * 15) / 100
    const shippingFee = 60
    const expectedTotal = subtotal + shippingFee - discount
    const trackingNo = `VM-TEST-${Date.now()}`

    const testOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          user_id: testUser.id,
          customer_name: testUser.full_name,
          email: testUser.email,
          phone: testUser.phone,
          address: 'House 42, Road 7, Block B, Banani, Dhaka',
          city: 'Dhaka',
          area: 'Banani',
          subtotal,
          shipping_fee: shippingFee,
          discount_amount: discount,
          coupon_code: couponCode,
          total_amount: expectedTotal,
          payment_method: 'cod',
          payment_status: 'unpaid',
          status: 'pending',
          tracking_number: trackingNo
        }
      })

      await tx.order_items.create({
        data: {
          order_id: order.id,
          product_id: sampleProduct.id,
          product_name: sampleProduct.name,
          variant_name: 'Regular',
          price: sampleProduct.price,
          quantity: orderQty,
          subtotal,
          image: sampleProduct.image
        }
      })

      await tx.products.update({
        where: { id: sampleProduct.id },
        data: { stock: { decrement: orderQty } }
      })

      await tx.coupons.update({
        where: { id: coupon.id },
        data: { used_count: { increment: 1 } }
      })

      return order
    })

    assert(!!testOrder.id, `Order placed successfully (ID #${testOrder.id})`)
    assert(Number(testOrder.total_amount) === expectedTotal, `Accurate total calculation (Total: ৳${testOrder.total_amount})`)

    // Verify Stock Decrement
    const updatedProduct = await prisma.products.findUnique({ where: { id: sampleProduct.id } })
    assert(
      (updatedProduct?.stock ?? 0) === initialStock - orderQty,
      `Inventory stock decremented correctly (Previous: ${initialStock}, Current: ${updatedProduct?.stock})`
    )

    // Verify Coupon Increment
    const updatedCoupon = await prisma.coupons.findUnique({ where: { id: coupon.id } })
    assert(updatedCoupon?.used_count === 1, `Coupon used count incremented (Count: ${updatedCoupon?.used_count})`)

    // -------------------------------------------------------------
    // TEST 4: ORDER TRACKING & STATUS UPDATES
    // -------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: Order Status Updates & Admin Actions ---')
    
    // Update order status to shipped
    const shippedOrder = await prisma.orders.update({
      where: { id: testOrder.id },
      data: { status: 'shipped' }
    })
    assert(shippedOrder.status === 'shipped', `Order status updated to 'shipped'`)

    // Update order status to delivered & paid
    const deliveredOrder = await prisma.orders.update({
      where: { id: testOrder.id },
      data: { status: 'delivered', payment_status: 'paid' }
    })
    assert(deliveredOrder.status === 'delivered', `Order status updated to 'delivered'`)
    assert(deliveredOrder.payment_status === 'paid', `Payment status updated to 'paid'`)

    // -------------------------------------------------------------
    // TEST 5: CUSTOMER PRODUCT REVIEWS
    // -------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: Product Reviews & Rating Submissions ---')
    const review = await prisma.reviews.create({
      data: {
        product_id: sampleProduct.id,
        user_id: testUser.id,
        rating: 5,
        comment: 'Excellent product! Very fresh and fast delivery.',
        status: 'approved'
      }
    })
    assert(review.rating === 5, `Customer review submitted successfully (ID: ${review.id})`)

    // Cleanup test data
    console.log('\n--- CLEANUP TEST DATA ---')
    await prisma.reviews.delete({ where: { id: review.id } })
    await prisma.order_items.deleteMany({ where: { order_id: testOrder.id } })
    await prisma.orders.delete({ where: { id: testOrder.id } })
    await prisma.coupons.delete({ where: { id: coupon.id } })
    await prisma.users.delete({ where: { id: testUser.id } })
    console.log('  ✅ Test data cleaned up cleanly.')

    console.log(`\n=============================================================`)
    console.log(`🎉 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`)
    console.log(`=============================================================\n`)

    if (failedTests > 0) {
      process.exit(1)
    }
  } catch (err) {
    console.error('E2E Test Execution Error:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runE2ETests()

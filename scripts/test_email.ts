import fs from 'fs'
import path from 'path'

// Simple env loader for test script
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=')
      const key = parts[0].trim()
      let val = parts.slice(1).join('=').trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      process.env[key] = val
    }
  })
} catch (e) {
  console.error('Failed to read .env file', e)
}

import { sendOrderNotificationEmail } from '../lib/email'

async function testEmail() {
  console.log('Sending test order notification email...')
  console.log('Using SMTP_USER:', process.env.SMTP_USER)
  console.log('Using SMTP_PASS:', process.env.SMTP_PASS ? '***[SET]***' : '[NOT SET]')

  const res = await sendOrderNotificationEmail({
    id: 9999,
    customer_name: 'Test Customer',
    email: 'verusmart4@gmail.com',
    phone: '01712345678',
    address: 'Kawla, Dhaka - 1229',
    city: 'Dhaka',
    area: 'Kawla',
    order_note: 'Please deliver quickly',
    subtotal: 1200,
    shipping_fee: 60,
    discount_amount: 0,
    total_amount: 1260,
    payment_method: 'Cash on Delivery',
    tracking_number: 'VM-TEST-9999'
  }, [
    {
      product_name: 'Fresh Mangoes',
      variant_name: 'Regular',
      quantity: 2,
      price: 600,
      subtotal: 1200
    }
  ])

  console.log('Test email result:', res)
}

testEmail()

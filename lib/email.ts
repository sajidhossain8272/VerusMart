import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'verusmart4@gmail.com'

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    return null
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function sendOTPEmail(toEmail: string, otpCode: string, name?: string) {
  console.log(`[AUTH] Generating Password Reset OTP: ${otpCode} for ${toEmail}`)

  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[AUTH] SMTP_USER or SMTP_PASS not configured in .env. Logging OTP code for dev testing.')
    return { success: true, simulated: true }
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 20px; border: 1px solid #eaeaea; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #002b5b; font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase;">VERUS MART</h1>
        <p style="color: #f85606; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">Password Reset Verification</p>
      </div>

      <p style="color: #333333; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
        Hello <strong>${name || 'Valued Customer'}</strong>,
      </p>

      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
        We received a request to reset your Verus Mart account password. Please use the 6-digit verification code below to proceed:
      </p>

      <div style="background-color: #fff6f2; border: 2px dashed #f85606; padding: 20px; border-radius: 16px; text-align: center; margin-bottom: 25px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #f85606;">${otpCode}</span>
        <p style="color: #888888; font-size: 11px; font-weight: 600; margin-top: 8px; margin-bottom: 0;">Code expires in 10 minutes</p>
      </div>

      <p style="color: #777777; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
        If you did not request a password reset, please ignore this email or contact support if you have security concerns.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0 20px 0;" />

      <p style="color: #aaaaaa; font-size: 11px; text-align: center; margin: 0;">
        &copy; ${new Date().getFullYear()} Verus Mart Bangladesh. All rights reserved.
      </p>
    </div>
  `

  await transporter.sendMail({
    from: `"Verus Mart Security" <${SMTP_USER}>`,
    to: toEmail,
    subject: `${otpCode} is your Verus Mart Password Reset Code`,
    html: htmlContent,
  })

  return { success: true }
}

export async function sendOrderNotificationEmail(order: {
  id: number
  customer_name: string
  email?: string | null
  phone: string
  address: string
  city?: string | null
  area?: string | null
  order_note?: string | null
  subtotal: number
  shipping_fee: number
  discount_amount: number
  total_amount: number
  payment_method?: string | null
  tracking_number?: string | null
}, items: Array<{
  product_name: string
  variant_name?: string
  quantity: number
  price: number
  subtotal: number
}>) {
  console.log(`[ORDER EMAIL] Sending Order Notification for Order #${order.id} to ${ADMIN_EMAIL}`)

  const transporter = getTransporter()
  if (!transporter) {
    console.warn('[ORDER EMAIL] SMTP_USER or SMTP_PASS not configured in .env. Skipping live email dispatch.')
    return { success: false, simulated: true }
  }

  const formatTk = (num: number) => `৳${num.toLocaleString('en-BD')}`

  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #f0f0f0;">
      <td style="padding: 10px; font-[#212121]; font-size: 13px; font-weight: 700;">
        ${item.product_name} ${item.variant_name && item.variant_name !== 'Regular' ? `<br/><span style="color: #888; font-size: 11px; font-weight: normal;">Variant: ${item.variant_name}</span>` : ''}
      </td>
      <td style="padding: 10px; font-size: 13px; text-align: center; font-weight: 600; color: #555;">${item.quantity}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: 600; color: #555;">${formatTk(item.price)}</td>
      <td style="padding: 10px; font-size: 13px; text-align: right; font-weight: 800; color: #f85606;">${formatTk(item.subtotal)}</td>
    </tr>
  `).join('')

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 20px; border: 1px solid #eaeaea; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #002b5b; font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase;">VERUS MART</h1>
        <p style="color: #2e7d32; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">🛒 New Order Placed Successfully!</p>
      </div>

      <div style="background-color: #f8f9fa; border-radius: 16px; padding: 20px; margin-bottom: 25px; border: 1px solid #eeeeee;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 12px; font-weight: 700; color: #777;">ORDER ID:</span>
          <span style="font-size: 14px; font-weight: 900; color: #002b5b;">#${order.id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 12px; font-weight: 700; color: #777;">TRACKING REF:</span>
          <span style="font-size: 12px; font-weight: 800; color: #f85606;">${order.tracking_number || `VM-${order.id}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 12px; font-weight: 700; color: #777;">PAYMENT METHOD:</span>
          <span style="font-size: 12px; font-weight: 800; color: #333; text-transform: uppercase;">${order.payment_method || 'Cash on Delivery'}</span>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; font-weight: 900; color: #002b5b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 2px solid #002b5b; padding-bottom: 5px;">Delivery Details</h3>
        <p style="margin: 4px 0; font-size: 13px; color: #333;"><strong>Customer Name:</strong> ${order.customer_name}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #333;"><strong>Phone Number:</strong> ${order.phone}</p>
        ${order.email ? `<p style="margin: 4px 0; font-size: 13px; color: #333;"><strong>Email:</strong> ${order.email}</p>` : ''}
        <p style="margin: 4px 0; font-size: 13px; color: #333;"><strong>Delivery Address:</strong> ${order.address} ${order.city ? `, ${order.city}` : ''} ${order.area ? `(${order.area})` : ''}</p>
        ${order.order_note ? `<p style="margin: 4px 0; font-size: 13px; color: #d84315;"><strong>Order Note:</strong> ${order.order_note}</p>` : ''}
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 13px; font-weight: 900; color: #002b5b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 2px solid #002b5b; padding-bottom: 5px;">Itemized Order Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left; font-size: 11px; color: #475569; text-transform: uppercase;">
              <th style="padding: 8px 10px;">Item</th>
              <th style="padding: 8px 10px; text-align: center;">Qty</th>
              <th style="padding: 8px 10px; text-align: right;">Price</th>
              <th style="padding: 8px 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div style="background-color: #fafafa; border-radius: 12px; padding: 15px; margin-bottom: 25px; text-align: right; font-size: 13px; border: 1px solid #eee;">
        <p style="margin: 4px 0; color: #666;">Subtotal: <strong>${formatTk(order.subtotal)}</strong></p>
        <p style="margin: 4px 0; color: #666;">Shipping Fee: <strong>${order.shipping_fee === 0 ? 'FREE' : formatTk(order.shipping_fee)}</strong></p>
        ${order.discount_amount > 0 ? `<p style="margin: 4px 0; color: #2e7d32;">Discount: <strong>-${formatTk(order.discount_amount)}</strong></p>` : ''}
        <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: 900; color: #f85606; border-top: 1px solid #e0e0e0; padding-top: 8px;">
          Grand Total: ${formatTk(order.total_amount)}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0 20px 0;" />
      <p style="color: #aaaaaa; font-size: 11px; text-align: center; margin: 0;">
        Verus Mart Automated Order Notification &bull; verusmart4@gmail.com
      </p>
    </div>
  `

  // Send to both admin (verusmart4@gmail.com) and customer (if customer email is provided)
  const recipients = [ADMIN_EMAIL]
  if (order.email && order.email.includes('@') && !recipients.includes(order.email)) {
    recipients.push(order.email)
  }

  try {
    await transporter.sendMail({
      from: `"Verus Mart Store" <${SMTP_USER}>`,
      to: recipients.join(', '),
      subject: `🛒 New Order #${order.id} Received - ${order.customer_name} (${formatTk(order.total_amount)})`,
      html: htmlContent,
    })
    console.log(`[ORDER EMAIL] Order notification email sent successfully to ${recipients.join(', ')}`)
    return { success: true }
  } catch (err) {
    console.error('[ORDER EMAIL] Failed to dispatch order email:', err)
    return { success: false, error: err }
  }
}

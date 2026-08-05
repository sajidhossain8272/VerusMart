import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''

export async function sendOTPEmail(toEmail: string, otpCode: string, name?: string) {
  console.log(`[AUTH] Generating Password Reset OTP: ${otpCode} for ${toEmail}`)

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('[AUTH] SMTP_USER or SMTP_PASS not configured in .env. Logging OTP code for dev testing.')
    return { success: true, simulated: true }
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 20px; border: 1px solid #eaeaea; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #002b5b; font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase; tracking: 1px;">VERUS MART</h1>
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

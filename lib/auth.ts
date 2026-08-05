import { cookies } from 'next/headers'
import crypto from 'crypto'
import { prisma } from './prisma'

const SESSION_SECRET = process.env.ADMIN_JWT_SECRET || process.env.SESSION_SECRET || 'verusmart-production-secure-session-key-2026'

// Create HMAC signature for payloads
function signPayload(payload: string): string {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET)
  hmac.update(payload)
  return hmac.digest('hex')
}

// Verify token signature and timestamp
function verifyToken(token: string): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [type, payload, signature] = parts
  const expectedSig = signPayload(`${type}.${payload}`)
  
  // Constant-time check
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null
  }

  // Check expiration (7 days)
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.exp && Date.now() > data.exp) {
      return null
    }
    return JSON.stringify(data)
  } catch {
    return null
  }
}

function createToken(type: 'user' | 'admin', data: Record<string, any>, expiresInDays = 7): string {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000
  const payloadData = { ...data, exp, type }
  const payloadB64 = Buffer.from(JSON.stringify(payloadData)).toString('base64url')
  const signature = signPayload(`${type}.${payloadB64}`)
  return `${type}.${payloadB64}.${signature}`
}

/* ================= CUSTOMER AUTH ================= */

export async function setUserSession(user: { id: number; name: string; email: string }) {
  const token = createToken('user', { id: user.id, email: user.email, name: user.name })
  const cookieStore = await cookies()
  cookieStore.set('user_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

export async function getUserSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_session')?.value
    if (!token) return null

    const verified = verifyToken(token)
    if (!verified) return null

    const data = JSON.parse(verified)
    if (data.type !== 'user' || !data.id) return null

    // Fetch user from DB to ensure account is active
    const dbUser = await prisma.users.findUnique({
      where: { id: data.id },
      select: { id: true, full_name: true, email: true, phone: true, status: true }
    })

    if (!dbUser || dbUser.status !== 'active') return null
    return dbUser
  } catch {
    return null
  }
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete('user_session')
}

/* ================= ADMIN AUTH ================= */

export async function setAdminSession(admin: { email: string }) {
  const token = createToken('admin', { email: admin.email })
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 1 day
  })
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null

    const verified = verifyToken(token)
    if (!verified) return null

    const data = JSON.parse(verified)
    if (data.type !== 'admin') return null

    return { email: data.email, isAdmin: true }
  } catch {
    return null
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

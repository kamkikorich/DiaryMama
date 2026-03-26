import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.AUTH_SECRET || 'diary-mama-secret-key'
const key = new TextEncoder().encode(SECRET_KEY)

export interface SessionData {
  isAuthenticated: boolean
  expiresAt: Date
}

export async function encrypt(payload: SessionData): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    const data = payload as unknown as SessionData
    if (typeof data.isAuthenticated === 'boolean' && data.expiresAt) {
      return data
    }
    return null
  } catch {
    return null
  }
}

export async function createSession(rememberMe = false) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ isAuthenticated: true, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: rememberMe ? expiresAt : undefined,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null
  return decrypt(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session?.isAuthenticated === true
}
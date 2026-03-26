import { NextRequest, NextResponse } from 'next/server'
import { checkPasscode } from '@/lib/supabase/queries'
import { createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { passcode, rememberMe } = await request.json()

    if (!passcode) {
      return NextResponse.json(
        { success: false, error: 'Passcode diperlukan' },
        { status: 400 }
      )
    }

    const isValid = await checkPasscode(passcode)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Passcode salah' },
        { status: 401 }
      )
    }

    await createSession(rememberMe)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Ralat server' },
      { status: 500 }
    )
  }
}
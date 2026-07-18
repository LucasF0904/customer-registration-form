import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const apiRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await apiRes.json()

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status })
  }

  const token: string = data.data?.token
  const response = NextResponse.json({ success: true, admin: data.data?.admin })

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8h
    path: '/',
  })

  return response
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt:', { email, password })

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Hardcoded admin credentials for demo/development
    const validCredentials = (
      (email === 'admin@havana.com' && password === 'admin123') ||
      (email === 'admin@example.com' && password === 'admin123') ||
      (email === 'admin' && password === 'admin')
    )

    if (!validCredentials) {
      console.log('Invalid credentials provided')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate a simple token (not JWT for now)
    const token = `admin-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    console.log('Login successful for:', email, 'Token:', token)

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: 'admin-1',
        email: email,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
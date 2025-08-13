import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET current payment config
export async function GET() {
  try {
    const config = await prisma.paymentConfig.findFirst({
      orderBy: { updatedAt: 'desc' }
    })
    if (!config) {
      return NextResponse.json({
        environment: 'live',
        clientId: '',
        updatedAt: null
      })
    }
    return NextResponse.json({
      environment: config.environment,
      clientId: config.clientId.replace(/.(?=.{4})/g, '*'), // mask
      updatedAt: config.updatedAt
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load payment config' }, { status: 500 })
  }
}

// PUT update payment config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { environment, clientId, clientSecret } = body as {
      environment: 'live' | 'sandbox'
      clientId: string
      clientSecret: string
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'clientId and clientSecret are required' }, { status: 400 })
    }

    const saved = await prisma.paymentConfig.create({
      data: { environment, clientId, clientSecret }
    })

    return NextResponse.json({
      environment: saved.environment,
      updatedAt: saved.updatedAt
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update payment config' }, { status: 500 })
  }
}


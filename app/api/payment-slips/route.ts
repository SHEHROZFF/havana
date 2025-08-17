import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Note: POST endpoint removed - payment slip URLs are now handled during booking creation

// GET /api/payment-slips - Get all payment slips (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let whereClause: any = {}

    if (status && status !== 'all') {
      whereClause.status = status
    }

    if (search) {
      whereClause.OR = [
        { fileName: { contains: search, mode: 'insensitive' } },
        { booking: { customerFirstName: { contains: search, mode: 'insensitive' } } },
        { booking: { customerLastName: { contains: search, mode: 'insensitive' } } },
        { booking: { customerEmail: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const paymentSlips = await (prisma as any).paymentSlip.findMany({
      where: whereClause,
      include: {
        booking: {
          select: {
            id: true,
            customerFirstName: true,
            customerLastName: true,
            customerEmail: true,
            totalAmount: true,
            cartId: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      paymentSlips
    })
  } catch (error) {
    console.error('Error fetching payment slips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment slips' },
      { status: 500 }
    )
  }
}
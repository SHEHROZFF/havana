import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// PUT /api/payment-slips/[id]/verify - Verify or reject payment slip
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()
    const { action, adminNotes, verifiedBy } = body

    if (!action || !['verify', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "verify" or "reject"' },
        { status: 400 }
      )
    }

    // Find the payment slip
    const paymentSlip = await (prisma as any).paymentSlip.findUnique({
      where: { id },
      include: {
        booking: true
      }
    })

    if (!paymentSlip) {
      return NextResponse.json(
        { error: 'Payment slip not found' },
        { status: 404 }
      )
    }

    const isVerified = action === 'verify'
    const newStatus = isVerified ? 'VERIFIED' : 'REJECTED'

    // Update payment slip
    const updatedSlip = await (prisma as any).paymentSlip.update({
      where: { id },
      data: {
        status: newStatus,
        verifiedAt: new Date(),
        verifiedBy: verifiedBy || 'admin',
        adminNotes: adminNotes || null
      }
    })

    // Update booking status based on verification
    await prisma.booking.update({
      where: { id: paymentSlip.bookingId },
      data: {
        paymentStatus: isVerified ? 'PAID' : 'FAILED',
        status: isVerified ? 'CONFIRMED' : 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      paymentSlip: updatedSlip,
      message: isVerified 
        ? 'Payment slip verified and booking confirmed'
        : 'Payment slip rejected'
    })
  } catch (error) {
    console.error('Error verifying payment slip:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment slip' },
      { status: 500 }
    )
  }
}
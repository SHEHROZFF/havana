import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/availability - Check cart availability for specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    const date = searchParams.get('date')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    if (!cartId || !date) {
      return NextResponse.json(
        { error: 'cartId and date are required' },
        { status: 400 }
      )
    }

    // Validate and parse the date
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date provided' },
        { status: 400 }
      )
    }

    // Get existing bookings for the cart on the specified date
    const existingBookings = await prisma.booking.findMany({
      where: {
        cartId: cartId,
        bookingDate: parsedDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        bookingDate: true
      }
    })

    // If specific time range is provided, check for conflicts with that time
    if (startTime && endTime) {
      const conflictingBooking = existingBookings.find((booking: any) => {
        // Use the EXACT same logic as in booking creation
        return (
          (booking.startTime <= startTime && booking.endTime > startTime) ||
          (booking.startTime < endTime && booking.endTime >= endTime) ||
          (booking.startTime >= startTime && booking.endTime <= endTime)
        )
      })

      return NextResponse.json({
        cartId,
        date,
        startTime,
        endTime,
        isAvailable: !conflictingBooking,
        conflictingBooking: conflictingBooking || null,
        bookedSlots: existingBookings
      })
    }

    // Default behavior - return all bookings for the date
    return NextResponse.json({
      cartId,
      date,
      bookedSlots: existingBookings,
      availableSlots: [] // No predefined slots, using custom time selection
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
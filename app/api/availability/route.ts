import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/availability - Check cart availability for specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    const date = searchParams.get('date')

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
        startTime: true,
        endTime: true
      }
    })

    // Define all possible time slots (you can make this configurable)
    const allTimeSlots = [
      { startTime: '09:00', endTime: '13:00', price: 150 },
      { startTime: '14:00', endTime: '18:00', price: 150 },
      { startTime: '19:00', endTime: '23:00', price: 180 }, // Evening premium
      { startTime: '10:00', endTime: '16:00', price: 200 }, // Extended day slot
    ]

    // Check which slots are available
    const availableSlots = allTimeSlots.map(slot => {
      const isBooked = existingBookings.some((booking: any) => {
        // Check for time overlap
        return (
          (booking.startTime <= slot.startTime && booking.endTime > slot.startTime) ||
          (booking.startTime < slot.endTime && booking.endTime >= slot.endTime) ||
          (booking.startTime >= slot.startTime && booking.endTime <= slot.endTime)
        )
      })

      return {
        ...slot,
        isAvailable: !isBooked
      }
    })

    return NextResponse.json({
      cartId,
      date,
      availableSlots,
      bookedSlots: existingBookings
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
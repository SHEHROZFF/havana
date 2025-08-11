import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bookings - Get bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    const where: any = {}

    if (cartId) {
      where.cartId = cartId
    }

    if (date) {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        where.bookingDate = parsedDate
      }
    }

    if (status) {
      where.status = status
    }

    // Add search functionality
    const search = searchParams.get('search')
    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          customerEmail: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          cart: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    // Get pagination params
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get total count for pagination (before applying pagination)
    const totalCount = await prisma.booking.count({ where })

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        cart: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        bookingItems: {
          include: {
            foodItem: {
              select: {
                id: true,
                name: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })



    // Transform bookings to match expected format
    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      eventType: booking.eventType,
      eventDate: booking.bookingDate?.toISOString().split('T')[0] || '',
      startTime: booking.startTime,
      endTime: booking.endTime,
      guestCount: booking.guestCount,
      totalHours: booking.totalHours,
      totalAmount: booking.totalAmount,
      status: booking.status,
      cartId: booking.cartId,
      cartName: booking.cart?.name || '',
      selectedItems: booking.bookingItems || [],
      selectedServices: booking.bookingServices || [],
      createdAt: booking.createdAt?.toISOString() || '',
      updatedAt: booking.updatedAt?.toISOString() || ''
    }))

    return NextResponse.json({
      bookings: transformedBookings,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit: limit
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      selectedCartId,
      bookingDate,
      startTime,
      endTime,
      totalHours,
      totalAmount,
      cartServiceAmount,
      servicesAmount,
      foodAmount,
      isCustomTiming,
      timeSlotType,
      customerName,
      customerEmail,
      customerPhone,
      eventType,
      guestCount,
      specialNotes,
      selectedItems,
      selectedServices,
      paymentMethod
    } = body
    
    const cartId = selectedCartId // Map to expected field name

    // Validate required fields
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Customer information is required' },
        { status: 400 }
      )
    }

    if (!bookingDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Booking date and time are required' },
        { status: 400 }
      )
    }

    // Validate and parse the booking date
    const parsedBookingDate = new Date(bookingDate)
    if (isNaN(parsedBookingDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid booking date provided' },
        { status: 400 }
      )
    }

    // Validate that the cart exists
    const cartExists = await prisma.foodCart.findUnique({
      where: { id: cartId }
    })

    if (!cartExists) {
      return NextResponse.json(
        { error: 'Selected cart not found' },
        { status: 404 }
      )
    }

    // Start a database transaction
    const booking = await prisma.$transaction(async (tx: any) => {
      // Check if the cart is available for the requested time slot
      const existingBooking = await tx.booking.findFirst({
        where: {
          cartId,
          bookingDate: parsedBookingDate,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ],
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        }
      })

      if (existingBooking) {
        throw new Error('Time slot is already booked')
      }

      // Create the booking (without userId since users are not managed)
      const newBooking = await tx.booking.create({
        data: {
          cart: {
            connect: { id: cartId }
          },
          bookingDate: parsedBookingDate,
          startTime,
          endTime,
          totalHours,
          totalAmount,
          cartServiceAmount: cartServiceAmount || 0,
          servicesAmount: servicesAmount || 0,
          foodAmount: foodAmount || 0,
          isCustomTiming: isCustomTiming ?? true,
          timeSlotType,
          customerName,
          customerEmail,
          customerPhone,
          eventType,
          guestCount,
          specialNotes,
          paymentMethod,
          status: 'PENDING',
          paymentStatus: paymentMethod === 'cash' ? 'PENDING' : 'PENDING'
        }
      })

      // Create booking items
      if (selectedItems && selectedItems.length > 0) {
        await tx.bookingItem.createMany({
          data: selectedItems.map((item: any) => ({
            bookingId: newBooking.id,
            foodItemId: item.itemId,
            quantity: item.quantity,
            price: item.price
          }))
        })
      }

      // Create booking services
      if (selectedServices && selectedServices.length > 0) {
        await tx.bookingService.createMany({
          data: selectedServices.map((service: any) => ({
            bookingId: newBooking.id,
            serviceId: service.serviceId,
            quantity: service.quantity,
            hours: service.hours,
            pricePerHour: service.pricePerHour,
            totalPrice: service.quantity * service.hours * service.pricePerHour
          }))
        })
      }

      return newBooking
    })

    // TODO: Send confirmation email
    // TODO: Process payment if not cash

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    
    if (error instanceof Error && error.message === 'Time slot is already booked') {
      return NextResponse.json(
        { error: 'The selected time slot is no longer available' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
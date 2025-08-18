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
          customerFirstName: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          customerLastName: {
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



    // Get payment slips for all bookings (if table exists)
    let paymentSlipMap: Record<string, any> = {}
    try {
      const bookingIds = bookings.map((b: any) => b.id)
      const paymentSlips = await (prisma as any).paymentSlip.findMany({
        where: {
          bookingId: {
            in: bookingIds
          }
        }
      })

      // Create a map of payment slips by booking ID
      paymentSlipMap = paymentSlips.reduce((acc: any, slip: any) => {
        acc[slip.bookingId] = slip
        return acc
      }, {} as Record<string, any>)
    } catch (error) {
      // PaymentSlip table doesn't exist yet, skip
      console.log('PaymentSlip table not found, skipping payment slip data')
    }

    // Get booking dates for all bookings (if table exists)
    let bookingDatesMap: Record<string, any[]> = {}
    try {
      const bookingIds = bookings.map((b: any) => b.id)
      const bookingDates = await (prisma as any).bookingDate.findMany({
        where: {
          bookingId: {
            in: bookingIds
          }
        },
        orderBy: {
          date: 'asc'
        }
      })

      // Create a map of booking dates by booking ID
      bookingDatesMap = bookingDates.reduce((acc: any, bookingDate: any) => {
        if (!acc[bookingDate.bookingId]) {
          acc[bookingDate.bookingId] = []
        }
        acc[bookingDate.bookingId].push(bookingDate)
        return acc
      }, {} as Record<string, any[]>)
    } catch (error) {
      // BookingDate table doesn't exist yet, skip
      console.log('BookingDate table not found, skipping booking dates data')
    }

    // Transform bookings to match expected format
    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      customerFirstName: booking.customerFirstName,
      customerLastName: booking.customerLastName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      customerAddress: booking.customerAddress,
      customerCity: booking.customerCity,
      customerState: booking.customerState,
      customerZip: booking.customerZip,
      customerCountry: booking.customerCountry,
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
      paymentMethod: booking.paymentMethod,
      deliveryMethod: booking.deliveryMethod,
      paymentSlip: paymentSlipMap[booking.id] || null,
      bookingDates: bookingDatesMap[booking.id] || [], // NEW: Multiple dates per booking
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

// POST /api/bookings - Create a new booking (or multiple bookings for multiple dates)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      selectedCartId,
      selectedDates, // NEW: Array of BookingDate objects
      bookingDate, // Legacy: single date for backward compatibility
      startTime, // Legacy
      endTime, // Legacy
      totalHours, // Legacy
      totalAmount,
      cartServiceAmount,
      servicesAmount,
      foodAmount,
      isCustomTiming,
      timeSlotType,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerState,
      customerZip,
      customerCountry,
      eventType,
      guestCount,
      specialNotes,
      selectedItems,
      selectedServices,
      paymentMethod,
      paymentStatus,
      transactionId,
      paymentSlipUrl,
      deliveryMethod,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingAmount
    } = body
    
    const cartId = selectedCartId // Map to expected field name

    // Support both multiple dates and single date (backward compatibility)
    const datesToBook = selectedDates && selectedDates.length > 0 
      ? selectedDates 
      : [{
          date: bookingDate,
          startTime,
          endTime,
          totalHours,
          cartCost: cartServiceAmount || 0
        }]

    // Validate required fields
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    if (!customerFirstName || !customerLastName || !customerEmail || !customerPhone || !customerAddress || !customerCity || !customerState || !customerZip || !customerCountry) {
      return NextResponse.json(
        { error: 'All customer information fields are required' },
        { status: 400 }
      )
    }

    if (!datesToBook || datesToBook.length === 0) {
      return NextResponse.json(
        { error: 'At least one booking date is required' },
        { status: 400 }
      )
    }

    // Validate payment slip URL for bank transfers
    if (paymentMethod === 'bank_transfer' && !paymentSlipUrl) {
      return NextResponse.json(
        { error: 'Payment slip URL is required for bank transfers' },
        { status: 400 }
      )
    }

    // Validate all dates
    for (const dateData of datesToBook) {
      if (!dateData.date || !dateData.startTime || !dateData.endTime) {
        return NextResponse.json(
          { error: 'All booking dates must have date, start time, and end time' },
          { status: 400 }
        )
      }

      const parsedDate = new Date(dateData.date)
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: `Invalid booking date provided: ${dateData.date}` },
          { status: 400 }
        )
      }
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

    // Start a database transaction to create ONE booking with multiple dates
    const booking = await prisma.$transaction(async (tx: any) => {
      // Validate each date entry and check availability
      for (const dateData of datesToBook) {
        if (!dateData.date || !dateData.startTime || !dateData.endTime) {
          throw new Error('All booking dates must have date, start time, and end time')
        }

        const parsedDate = new Date(dateData.date)
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Invalid booking date provided: ${dateData.date}`)
        }

        // Check if the cart is available for this specific time slot
        const existingBookingConflict = await tx.bookingDate.findFirst({
        where: {
            date: parsedDate,
            startTime: dateData.startTime,
            endTime: dateData.endTime,
            booking: {
              cartId: cartId,
          status: {
            in: ['PENDING', 'CONFIRMED']
              }
          }
        }
      })

        if (existingBookingConflict) {
          throw new Error(`Time slot is already booked for ${dateData.date} ${dateData.startTime}-${dateData.endTime}`)
        }
      }

      // Create the main booking record
      const newBooking = await tx.booking.create({
        data: {
          userId,
          cartId,
          totalAmount,
          status: paymentMethod === 'reservation' ? 'PENDING' : 'PENDING',
          paymentStatus: paymentStatus || 'PENDING',
          paymentMethod,
          transactionId,
          cartServiceAmount,
          servicesAmount,
          foodAmount,
          isCustomTiming,
          timeSlotType,
          customerFirstName,
          customerLastName,
          customerEmail,
          customerPhone,
          customerAddress,
          customerCity,
          customerState,
          customerZip,
          customerCountry,
          eventType,
          guestCount,
          specialNotes,
          deliveryMethod,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          shippingAmount,
          // For backward compatibility, set legacy fields from the first selected date
          bookingDate: datesToBook[0] ? new Date(datesToBook[0].date) : null,
          startTime: datesToBook[0] ? datesToBook[0].startTime : null,
          endTime: datesToBook[0] ? datesToBook[0].endTime : null,
          totalHours: datesToBook[0] ? datesToBook[0].totalHours : null,
        }
      })

      // Create associated BookingDate records
      const createdBookingDates = []
      for (const dateData of datesToBook) {
        const parsedBookingDate = new Date(dateData.date)
        
        const newBookingDate = await tx.bookingDate.create({
          data: {
            bookingId: newBooking.id,
            date: parsedBookingDate,
            startTime: dateData.startTime,
            endTime: dateData.endTime,
            totalHours: dateData.totalHours,
            cartCost: dateData.cartCost,
            isAvailable: dateData.isAvailable
          }
        })
        createdBookingDates.push(newBookingDate)
      }

      // Create booking items (these are for the entire booking, not per date)
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

      // Create booking services (these are for the entire booking, not per date)
      if (selectedServices && selectedServices.length > 0) {
        await tx.bookingService.createMany({
          data: selectedServices.map((service: any) => ({
            bookingId: newBooking.id,
            serviceId: service.serviceId,
            quantity: service.quantity,
            hours: service.hours,
            pricePerHour: service.pricePerHour
          }))
        })
      }

      // Create payment slip record if URL is provided (for bank transfers)
      if (paymentSlipUrl && paymentMethod === 'bank_transfer') {
        await (tx as any).paymentSlip.create({
          data: {
            bookingId: newBooking.id,
            fileName: 'Payment Receipt Link',
            filePath: paymentSlipUrl,
            fileSize: 0,
            mimeType: 'application/url',
            status: 'PENDING'
          }
        })
      }

      return newBooking
    })

    // TODO: Send confirmation email
    // TODO: Process payment if not cash

    return NextResponse.json({
      success: true,
      booking,
      message: `Successfully created booking for ${datesToBook.length} date${datesToBook.length !== 1 ? 's' : ''}`
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    
    if (error instanceof Error && (error.message === 'Time slot is already booked' || error.message.includes('Time slot is already booked for'))) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
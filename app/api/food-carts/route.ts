import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Default van images from Havana website
const DEFAULT_VAN_IMAGES = [
  'https://havana.gr/wp-content/uploads/2025/06/Desktop.d7abe289.vw_t2_lissabon.webp',
  'https://havana.gr/wp-content/uploads/2025/06/vintage-van-on-transparent-background-free-png.webp'
]

// GET /api/food-carts - Get all food carts (admin sees all, customers see only active)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const foodCarts = await prisma.foodCart.findMany({
      where: includeInactive ? {} : {
        isActive: true
      },
      include: {
        foodItems: {
          where: {
            isAvailable: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(foodCarts)
  } catch (error) {
    console.error('Error fetching food carts:', error)
    
    // Return empty array when database unavailable - admin needs to add carts
    return NextResponse.json([])
  }
}

// POST /api/food-carts - Create a new food cart (admin only)
export async function POST(request: NextRequest) {
  let body: any
  
  try {
    body = await request.json()
    const { name, description, image, location, pricePerHour, extraHourPrice, shippingPrice, pickupAvailable, shippingAvailable, capacity } = body

    // TODO: Add authentication and authorization checks for admin users

    // Use default van image if none provided
    const cartImage = image || DEFAULT_VAN_IMAGES[Math.floor(Math.random() * DEFAULT_VAN_IMAGES.length)]

    const foodCart = await prisma.foodCart.create({
      data: {
        name,
        description,
        image: cartImage,
        location,
        pricePerHour: parseFloat(pricePerHour),
        extraHourPrice: parseFloat(extraHourPrice || 0),
        shippingPrice: parseFloat(shippingPrice || 0),
        pickupAvailable: pickupAvailable !== false,
        shippingAvailable: shippingAvailable !== false,
        capacity: parseInt(capacity),
        isActive: true
      }
    })

    return NextResponse.json(foodCart, { status: 201 })
  } catch (error) {
    console.error('Error creating food cart:', error)
    
    // Return error message for admin to handle
    return NextResponse.json(
      { error: 'Failed to create food cart. Please check database connection.' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Default van images from Havana website
const DEFAULT_VAN_IMAGES = [
  'https://havana.gr/wp-content/uploads/2025/06/Desktop.d7abe289.vw_t2_lissabon.webp',
  'https://havana.gr/wp-content/uploads/2025/06/vintage-van-on-transparent-background-free-png.webp'
]

// GET /api/food-carts - Get all active food carts
export async function GET() {
  try {
    const foodCarts = await prisma.foodCart.findMany({
      where: {
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
    const { name, description, image, location, pricePerHour, capacity } = body

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
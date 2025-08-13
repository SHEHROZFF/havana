import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/food-items - Get all food items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const where: any = {}
    
    // Only filter by isAvailable if not including inactive items
    if (!includeInactive) {
      where.isAvailable = true
    }
    
    if (cartId) {
      where.cartId = cartId
    }

    const foodItems = await prisma.foodItem.findMany({
      where,
      include: {
        cart: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error('Error fetching food items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food items' },
      { status: 500 }
    )
  }
}

// POST /api/food-items - Create a new food item (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, image, category, cartId } = body

    // TODO: Add authentication and authorization checks for admin users

    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || '/images/placeholder-food.jpg',
        category,
        cartId,
        isAvailable: true
      },
      include: {
        cart: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(foodItem, { status: 201 })
  } catch (error) {
    console.error('Error creating food item:', error)
    return NextResponse.json(
      { error: 'Failed to create food item' },
      { status: 500 }
    )
  }
}
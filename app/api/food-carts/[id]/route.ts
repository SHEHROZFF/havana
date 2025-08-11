import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/food-carts/[id] - Get specific food cart with food items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const foodCart = await prisma.foodCart.findUnique({
      where: {
        id: id
      },
      include: {
        foodItems: {
          where: {
            isAvailable: true
          },
          orderBy: {
            category: 'asc'
          }
        },
        services: {
          where: {
            isActive: true
          },
          orderBy: {
            name: 'asc'
          }
        }
      }
    })

    if (!foodCart) {
      return NextResponse.json(
        { error: 'Food cart not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(foodCart)
  } catch (error) {
    console.error('Error fetching food cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food cart' },
      { status: 500 }
    )
  }
}

// PUT /api/food-carts/[id] - Update food cart (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, image, location, pricePerHour, capacity, isActive } = body

    // TODO: Add authentication and authorization checks for admin users

    const foodCart = await prisma.foodCart.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        image,
        location,
        pricePerHour: parseFloat(pricePerHour),
        capacity: parseInt(capacity),
        isActive
      }
    })

    return NextResponse.json(foodCart)
  } catch (error) {
    console.error('Error updating food cart:', error)
    return NextResponse.json(
      { error: 'Failed to update food cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/food-carts/[id] - Delete food cart (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // TODO: Add authentication and authorization checks for admin users

    await prisma.foodCart.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Food cart deleted successfully' })
  } catch (error) {
    console.error('Error deleting food cart:', error)
    return NextResponse.json(
      { error: 'Failed to delete food cart' },
      { status: 500 }
    )
  }
}
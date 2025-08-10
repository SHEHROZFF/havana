import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/food-items/[id] - Get specific food item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const foodItem = await prisma.foodItem.findUnique({
      where: {
        id: id
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

    if (!foodItem) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(foodItem)
  } catch (error) {
    console.error('Error fetching food item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food item' },
      { status: 500 }
    )
  }
}

// PUT /api/food-items/[id] - Update food item (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, price, image, category, cartId, isAvailable } = body

    // TODO: Add authentication and authorization checks for admin users

    const foodItem = await prisma.foodItem.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        cartId,
        isAvailable
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

    return NextResponse.json(foodItem)
  } catch (error) {
    console.error('Error updating food item:', error)
    return NextResponse.json(
      { error: 'Failed to update food item' },
      { status: 500 }
    )
  }
}

// DELETE /api/food-items/[id] - Delete food item (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // TODO: Add authentication and authorization checks for admin users

    await prisma.foodItem.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Food item deleted successfully' })
  } catch (error) {
    console.error('Error deleting food item:', error)
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    )
  }
}
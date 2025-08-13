import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('cartId')
    const category = searchParams.get('category')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where: any = {}
    
    // Only filter by isActive if not including inactive items
    if (!includeInactive) {
      where.isActive = true
    }

    if (cartId) {
      where.OR = [
        { cartId: cartId },
        { cartId: null } // Global services
      ]
    }

    if (category) {
      where.category = category
    }

    const services = await prisma.service.findMany({
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

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, pricePerHour, category, cartId } = body

    // TODO: Add authentication and authorization checks for admin users

    const service = await prisma.service.create({
      data: {
        name,
        description,
        pricePerHour: parseFloat(pricePerHour),
        category,
        cartId: cartId || null,
        isActive: true
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

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
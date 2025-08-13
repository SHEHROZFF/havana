import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/services/[id] - Get specific service
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const service = await prisma.service.findUnique({
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

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update service (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, pricePerHour, category, cartId, isActive } = body

    // TODO: Add authentication and authorization checks for admin users

    // Build update data object with only provided fields
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (pricePerHour !== undefined) updateData.pricePerHour = parseFloat(pricePerHour)
    if (category !== undefined) updateData.category = category
    if (cartId !== undefined) updateData.cartId = cartId || null
    if (isActive !== undefined) updateData.isActive = isActive

    const service = await prisma.service.update({
      where: {
        id: id
      },
      data: updateData,
      include: {
        cart: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete service (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // TODO: Add authentication and authorization checks for admin users

    await prisma.service.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
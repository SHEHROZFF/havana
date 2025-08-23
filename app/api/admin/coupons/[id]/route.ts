import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  id: string
}

// GET /api/admin/coupons/[id] - Get specific coupon
export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const resolvedParams = await params
    const coupon = await (prisma as any).coupon.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: { usages: true }
        },
        usages: {
          orderBy: { usedAt: 'desc' },
          include: {
            booking: {
              select: {
                id: true,
                customerEmail: true,
                customerFirstName: true,
                customerLastName: true,
                totalAmount: true,
                createdAt: true
              }
            }
          }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        usageCount: coupon._count.usages
      }
    })
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/coupons/[id] - Update coupon
export async function PUT(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const {
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      // perUserLimit and isFirstTimeOnly removed - no authentication system
      validFrom,
      validUntil,
      status,
      applicableToCartIds,
      applicableToServiceIds
    } = body

    // Check if coupon exists
    const existingCoupon = await (prisma as any).coupon.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    // Validate dates if provided
    let validFromDate, validUntilDate
    if (validFrom) validFromDate = new Date(validFrom)
    if (validUntil) validUntilDate = new Date(validUntil)
    
    if (validFromDate && validUntilDate && validFromDate >= validUntilDate) {
      return NextResponse.json(
        { error: 'Valid until date must be after valid from date' },
        { status: 400 }
      )
    }

    // Update coupon
    const updatedCoupon = await (prisma as any).coupon.update({
      where: { id: resolvedParams.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(type && { type: type.toUpperCase() }),
        ...(value !== undefined && { value: parseFloat(value) }),
        ...(minOrderAmount !== undefined && { minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null }),
        ...(maxDiscount !== undefined && { maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit ? parseInt(usageLimit) : null }),
        // perUserLimit and isFirstTimeOnly removed - no authentication system
        ...(validFromDate && { validFrom: validFromDate }),
        ...(validUntilDate && { validUntil: validUntilDate }),
        ...(status && { status: status.toUpperCase() }),
        ...(applicableToCartIds !== undefined && { applicableToCartIds: applicableToCartIds ? JSON.stringify(applicableToCartIds) : null }),
        ...(applicableToServiceIds !== undefined && { applicableToServiceIds: applicableToServiceIds ? JSON.stringify(applicableToServiceIds) : null })
      }
    })

    return NextResponse.json({
      success: true,
      coupon: updatedCoupon,
      message: 'Coupon updated successfully'
    })
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/coupons/[id] - Delete coupon
export async function DELETE(request: NextRequest, { params }: { params: Promise<Params> }) {
  try {
    const resolvedParams = await params
    // Check if coupon exists
    const existingCoupon = await (prisma as any).coupon.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: { usages: true }
        }
      }
    })

    if (!existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      )
    }

    // Check if coupon has been used
    if (existingCoupon._count.usages > 0) {
      // Instead of deleting, set status to inactive
      await (prisma as any).coupon.update({
        where: { id: resolvedParams.id },
        data: { status: 'INACTIVE' }
      })

      return NextResponse.json({
        success: true,
        message: 'Coupon has been deactivated (cannot delete used coupons)'
      })
    }

    // Delete coupon if never used
    await (prisma as any).coupon.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
}

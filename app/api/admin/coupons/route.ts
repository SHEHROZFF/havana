import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/coupons - Get all coupons for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Get total count for pagination
    const totalCount = await (prisma as any).coupon.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    // Get coupons with usage stats
    const coupons = await (prisma as any).coupon.findMany({
      where,
      include: {
        _count: {
          select: {
            usages: true
          }
        },
        usages: {
          take: 5,
          orderBy: { usedAt: 'desc' },
          include: {
            booking: {
              select: {
                id: true,
                customerEmail: true,
                customerFirstName: true,
                customerLastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      coupons: coupons.map((coupon: any) => ({
        ...coupon,
        usageCount: coupon._count.usages,
        recentUsages: coupon.usages
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

// POST /api/admin/coupons - Create a new coupon
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      code,
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
      applicableToCartIds,
      applicableToServiceIds,
      createdBy
    } = body

    // Validation
    if (!code || !name || !type || !value || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // Check if coupon code already exists
    const existingCoupon = await (prisma as any).coupon.findUnique({
      where: { code }
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    // Validate dates
    const validFromDate = new Date(validFrom)
    const validUntilDate = new Date(validUntil)
    
    if (validFromDate >= validUntilDate) {
      return NextResponse.json(
        { error: 'Valid until date must be after valid from date' },
        { status: 400 }
      )
    }

    // Create coupon
    const coupon = await (prisma as any).coupon.create({
      data: {
        code: code.toUpperCase(),
        name,
        description,
        type: type.toUpperCase(),
        value: parseFloat(value),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        validFrom: validFromDate,
        validUntil: validUntilDate,
        applicableToCartIds: applicableToCartIds ? JSON.stringify(applicableToCartIds) : null,
        applicableToServiceIds: applicableToServiceIds ? JSON.stringify(applicableToServiceIds) : null,
        createdBy
      }
    })

    return NextResponse.json({
      success: true,
      coupon,
      message: 'Coupon created successfully'
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
}

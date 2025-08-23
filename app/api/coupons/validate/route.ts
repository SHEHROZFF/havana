import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/coupons/validate - Validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      couponCode,
      customerEmail,
      orderAmount,
      cartIds = [],
      serviceIds = [],
      isFirstTime = false
    } = body

    if (!couponCode || !customerEmail || orderAmount === undefined) {
      return NextResponse.json(
        { error: 'Coupon code, customer email, and order amount are required' },
        { status: 400 }
      )
    }

    // Find coupon by code
    const coupon = await (prisma as any).coupon.findUnique({
      where: { 
        code: couponCode.toUpperCase() 
      },
      include: {
        _count: {
          select: { usages: true }
        }
      }
    })

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code'
      })
    }

    // Check if coupon is active
    if (coupon.status !== 'ACTIVE') {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is no longer active'
      })
    }

    // Check expiry dates
    const now = new Date()
    if (now < new Date(coupon.validFrom)) {
      return NextResponse.json({
        valid: false,
        error: `This coupon is not valid until ${new Date(coupon.validFrom).toLocaleDateString()}`
      })
    }

    if (now > new Date(coupon.validUntil)) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has expired'
      })
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount of €${coupon.minOrderAmount.toFixed(2)} required`
      })
    }

    // Check usage limit - Get real-time count to avoid race conditions
    if (coupon.usageLimit) {
      const currentUsageCount = await (prisma as any).couponUsage.count({
        where: { couponId: coupon.id }
      })
      
      if (currentUsageCount >= coupon.usageLimit) {
        return NextResponse.json({
          valid: false,
          error: 'This coupon has reached its usage limit'
        })
      }
    }

    // NOTE: Per-user limit and first-time-only features removed 
    // because there's no reliable authentication system to track users

    // Check cart restrictions
    if (coupon.applicableToCartIds) {
      const applicableCartIds = JSON.parse(coupon.applicableToCartIds)
      if (cartIds.length > 0 && !cartIds.some((id: string) => applicableCartIds.includes(id))) {
        return NextResponse.json({
          valid: false,
          error: 'This coupon is not applicable to the selected cart'
        })
      }
    }

    // Check service restrictions
    if (coupon.applicableToServiceIds) {
      const applicableServiceIds = JSON.parse(coupon.applicableToServiceIds)
      if (serviceIds.length > 0 && !serviceIds.some((id: string) => applicableServiceIds.includes(id))) {
        return NextResponse.json({
          valid: false,
          error: 'This coupon is not applicable to the selected services'
        })
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (orderAmount * coupon.value) / 100
      // Apply max discount limit if specified
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount
      }
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(coupon.value, orderAmount)
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount)
    const finalAmount = Math.max(0, orderAmount - discountAmount)

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value
      },
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
      finalAmount: Math.round(finalAmount * 100) / 100,
      originalAmount: orderAmount,
      message: `Coupon applied! You saved €${(Math.round(discountAmount * 100) / 100).toFixed(2)}`
    })

  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    )
  }
}

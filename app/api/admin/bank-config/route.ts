import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/bank-config - Get bank configuration
export async function GET() {
  try {
    const bankConfig = await (prisma as any).bankConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      bankConfig
    })
  } catch (error) {
    console.error('Error fetching bank config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank configuration' },
      { status: 500 }
    )
  }
}

// POST /api/admin/bank-config - Create or update bank configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bankName,
      accountHolder,
      iban,
      swiftCode,
      accountNumber,
      bankAddress,
      instructions
    } = body

    // Validate required fields
    if (!bankName || !accountHolder || !iban) {
      return NextResponse.json(
        { error: 'Bank name, account holder, and IBAN are required' },
        { status: 400 }
      )
    }

    // Deactivate existing bank configs
    await (prisma as any).bankConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Create new bank config
    const bankConfig = await (prisma as any).bankConfig.create({
      data: {
        bankName,
        accountHolder,
        iban,
        swiftCode: swiftCode || null,
        accountNumber: accountNumber || null,
        bankAddress: bankAddress || null,
        instructions: instructions || null,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      bankConfig,
      message: 'Bank configuration updated successfully'
    })
  } catch (error) {
    console.error('Error updating bank config:', error)
    return NextResponse.json(
      { error: 'Failed to update bank configuration' },
      { status: 500 }
    )
  }
}
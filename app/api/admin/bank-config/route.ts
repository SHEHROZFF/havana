import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/bank-config - Get all bank configurations
export async function GET() {
  try {
    const bankConfigs = await (prisma as any).bankConfig.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      bankConfigs,
      // Backward compatibility: return first bank as bankConfig
      bankConfig: bankConfigs[0] || null
    })
  } catch (error) {
    console.error('Error fetching bank configs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bank configurations' },
      { status: 500 }
    )
  }
}

// POST /api/admin/bank-config - Create new bank configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      bankName,
      accountHolder,
      iban,
      swiftCode,
      accountNumber,
      bankAddress,
      instructions,
      isActive = true
    } = body

    // Validate required fields
    if (!bankName || !accountHolder || !iban) {
      return NextResponse.json(
        { error: 'Bank name, account holder, and IBAN are required' },
        { status: 400 }
      )
    }

    let bankConfig

    if (id) {
      // Update existing bank config
      bankConfig = await (prisma as any).bankConfig.update({
        where: { id },
        data: {
          bankName,
          accountHolder,
          iban,
          swiftCode: swiftCode || null,
          accountNumber: accountNumber || null,
          bankAddress: bankAddress || null,
          instructions: instructions || null,
          isActive
        }
      })
    } else {
      // Create new bank config
      bankConfig = await (prisma as any).bankConfig.create({
        data: {
          bankName,
          accountHolder,
          iban,
          swiftCode: swiftCode || null,
          accountNumber: accountNumber || null,
          bankAddress: bankAddress || null,
          instructions: instructions || null,
          isActive
        }
      })
    }

    return NextResponse.json({
      success: true,
      bankConfig,
      message: id ? 'Bank configuration updated successfully' : 'Bank configuration created successfully'
    })
  } catch (error) {
    console.error('Error saving bank config:', error)
    return NextResponse.json(
      { error: 'Failed to save bank configuration' },
      { status: 500 }
    )
  }
}
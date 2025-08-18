import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Interface for route parameters
interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE /api/admin/bank-config/[id] - Deactivate a specific bank
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Deactivate the bank config instead of deleting
    const bankConfig = await (prisma as any).bankConfig.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Bank configuration deactivated successfully'
    })
  } catch (error) {
    console.error('Error deactivating bank config:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate bank configuration' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/bank-config/[id] - Update a specific bank
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
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

    // Update existing bank config
    const bankConfig = await (prisma as any).bankConfig.update({
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
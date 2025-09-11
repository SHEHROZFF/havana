import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 DEBUGGING DATABASE CONTENT...')

    // Check raw counts
    const totalCarts = await prisma.foodCart.count()
    const activeCarts = await prisma.foodCart.count({ where: { isActive: true } })
    const inactiveCarts = await prisma.foodCart.count({ where: { isActive: false } })

    const totalItems = await prisma.foodItem.count()
    const availableItems = await prisma.foodItem.count({ where: { isAvailable: true } })
    const unavailableItems = await prisma.foodItem.count({ where: { isAvailable: false } })

    const totalServices = await prisma.service.count()
    const activeServices = await prisma.service.count({ where: { isActive: true } })
    const inactiveServices = await prisma.service.count({ where: { isActive: false } })

    const totalBookings = await prisma.booking.count()

    // Sample data
    const sampleCarts = totalCarts > 0 ? await prisma.foodCart.findMany({ take: 3 }) : []
    const sampleItems = totalItems > 0 ? await prisma.foodItem.findMany({ take: 3 }) : []
    const sampleServices = totalServices > 0 ? await prisma.service.findMany({ take: 3 }) : []

    // Simulate API calls
    const apiCarts = await prisma.foodCart.findMany({ where: { isActive: true } })
    const allCarts = await prisma.foodCart.findMany()
    const apiItems = await prisma.foodItem.findMany({ where: { isAvailable: true } })
    const apiServices = await prisma.service.findMany({ where: { isActive: true } })

    const debugResult = {
      database_status: "✅ Connected",
      counts: {
        food_carts: {
          total: totalCarts,
          active: activeCarts,
          inactive: inactiveCarts
        },
        food_items: {
          total: totalItems,
          available: availableItems,
          unavailable: unavailableItems
        },
        services: {
          total: totalServices,
          active: activeServices,
          inactive: inactiveServices
        },
        bookings: totalBookings
      },
      sample_data: {
        carts: sampleCarts.map(c => ({ name: c.name, isActive: c.isActive })),
        items: sampleItems.map(i => ({ name: i.name, isAvailable: i.isAvailable })),
        services: sampleServices.map(s => ({ name: s.name, isActive: s.isActive }))
      },
      api_simulation: {
        "GET /api/food-carts (filtered)": apiCarts.length,
        "GET /api/food-carts (all)": allCarts.length,
        "GET /api/food-items (filtered)": apiItems.length,
        "GET /api/services (filtered)": apiServices.length
      },
      diagnosis: {
        problem_found: activeCarts === 0 || availableItems === 0 || activeServices === 0,
        issues: [
          activeCarts === 0 ? "❌ No active food carts (isActive: true)" : "✅ Active food carts found",
          availableItems === 0 ? "❌ No available food items (isAvailable: true)" : "✅ Available food items found", 
          activeServices === 0 ? "❌ No active services (isActive: true)" : "✅ Active services found"
        ],
        solution: activeCarts === 0 || availableItems === 0 || activeServices === 0 
          ? "Your database items have isActive/isAvailable set to FALSE. Either update the database or modify your API filters."
          : "Database items are properly configured."
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        database_url_exists: !!process.env.DATABASE_URL,
        database_url_preview: process.env.DATABASE_URL?.substring(0, 20) + "...",
      }
    }

    console.log('Debug result:', JSON.stringify(debugResult, null, 2))
    return NextResponse.json(debugResult)

  } catch (error) {
    console.error('❌ Debug API Error:', error)
    return NextResponse.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      database_status: "❌ Failed"
    }, { status: 500 })
  }
}

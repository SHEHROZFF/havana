import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET() {
  try {
    console.log('Dashboard API called - fetching real data from database')
    
    // Get real data from database
    const [bookingsCount, activeCartsCount, totalRevenueResult] = await Promise.all([
      prisma.booking.count(),
      prisma.foodCart.count({ where: { isActive: true } }),
      prisma.booking.aggregate({
        where: {
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: { totalAmount: true }
      })
    ])

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        bookingDate: true,
        totalAmount: true,
        status: true,
        cart: { select: { name: true } }
      }
    })

    // Get popular carts with real booking counts
    const allCarts = await prisma.foodCart.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { bookings: true } }
      }
    })

    const popularCarts = allCarts
      .map((cart: any) => ({
        name: cart.name,
        bookings: cart._count.bookings,
        revenue: cart._count.bookings * 150 // Estimate based on average booking
      }))
      .sort((a: any, b: any) => b.bookings - a.bookings)
      .slice(0, 3)

    // Calculate today's bookings
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayBookings = await prisma.booking.count({
      where: {
        createdAt: { gte: today }
      }
    })

    // Get monthly revenue for current year
    const currentYear = new Date().getFullYear()
    const monthlyBookings = await prisma.booking.groupBy({
      by: ['bookingDate'],
      where: {
        bookingDate: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1)
        },
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      },
      _sum: {
        totalAmount: true
      }
    })

    // Process monthly revenue
    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(currentYear, index).toLocaleString('default', { month: 'short' })
      const monthData = monthlyBookings.filter((booking: any) => 
        booking.bookingDate && booking.bookingDate.getMonth() === index
      )
      const revenue = monthData.reduce((sum: number, item: any) => sum + (item._sum.totalAmount || 0), 0)
      
      return { month, revenue }
    })

    const dashboardData = {
      totalBookings: bookingsCount,
      totalRevenue: totalRevenueResult._sum.totalAmount || 0,
      activeCarts: activeCartsCount,
      todayBookings: todayBookings,
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.id,
        customerName: booking.customerName,
        eventDate: booking.bookingDate?.toISOString().split('T')[0] || '',
        total: booking.totalAmount,
        status: booking.status.toLowerCase()
      })),
      popularCarts,
      monthlyRevenue
    }

    console.log('Successfully fetched real dashboard data:', dashboardData)
    return NextResponse.json(dashboardData)
    
  } catch (error) {
    console.error('Error in dashboard API:', error)
    
    // Return empty state when database is unavailable
    const emptyDashboard = {
      totalBookings: 0,
      totalRevenue: 0,
      activeCarts: 0,
      todayBookings: 0,
      recentBookings: [],
      popularCarts: [],
      monthlyRevenue: []
    }

    return NextResponse.json(emptyDashboard)
  }
}
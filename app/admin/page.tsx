'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { clsx } from 'clsx'
import { useGetDashboardStatsQuery } from '../../lib/api/bookingsApi'
import { 
  Calendar, 
  DollarSign, 
  Truck, 
  BarChart3, 
  FileText, 
  Plus, 
  ChefHat,
  TrendingUp,
  Users,
  AlertTriangle
} from 'lucide-react'

export default function AdminDashboard() {
  const {
    data: stats = {
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      activeCarts: 0,
      todayBookings: 0,
      recentBookings: [],
      popularCarts: []
    },
    isLoading: loading,
    error,
    refetch
  } = useGetDashboardStatsQuery()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const isEmpty = stats.totalBookings === 0 && stats.activeCarts === 0 && stats.recentBookings.length === 0

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      trend: stats.totalBookings > 0 ? '+12%' : 'No data',
      color: 'from-blue-500 to-blue-600',
      isEmpty: stats.totalBookings === 0
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: stats.totalRevenue > 0 ? '+8%' : 'No sales',
      color: 'from-green-500 to-green-600',
      isEmpty: stats.totalRevenue === 0
    },
    {
      title: 'Active Carts',
      value: stats.activeCarts.toString(),
      icon: Truck,
      trend: stats.activeCarts > 0 ? 'Available' : 'Add carts',
      color: 'from-purple-500 to-purple-600',
      isEmpty: stats.activeCarts === 0
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayBookings.toString(),
      icon: BarChart3,
      trend: stats.todayBookings > 0 ? 'Active' : 'No bookings',
      color: 'from-teal-500 to-teal-600',
      isEmpty: stats.todayBookings === 0
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400">
            {isEmpty 
              ? 'Welcome! Get started by setting up your food cart business.'
              : 'Here\'s what\'s happening with your food cart business.'}
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <p className="text-red-400 text-sm">Failed to load dashboard data</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 lg:mt-0">
          <Link href="/admin/food-carts">
            <Button size="sm">
              {stats.activeCarts === 0 ? (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Add First Cart
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-slate-700/50 backdrop-blur-sm border-slate-600 hover:border-slate-500 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className={clsx(
                    "text-2xl font-bold",
                    stat.isEmpty ? "text-gray-500" : "text-white"
                  )}>
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={clsx(
                      "text-sm font-medium",
                      stat.isEmpty ? "text-gray-500" : "text-green-400"
                    )}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg ${stat.isEmpty ? 'opacity-50' : ''}`}>
                                          <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      {isEmpty ? (
        /* Getting Started Guide */
        <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Havana Admin!</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Your food cart booking system is ready! Follow these steps to get started and begin accepting bookings.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-600/50 rounded-xl p-6">
                <div className="mb-4">
              <Truck className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Add Food Carts</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Create your first food cart with Havana van images, pricing, and location details.
                </p>
                <Link href="/admin/food-carts">
                  <Button size="sm" className="w-full">
                    Add Food Carts
                  </Button>
                </Link>
              </div>
              
              <div className="bg-slate-600/50 rounded-xl p-6">
                <div className="mb-4">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Create Menu Items</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Add delicious food items with descriptions, prices, and categories for each cart.
                </p>
                <Link href="/admin/food-items">
                  <Button size="sm" variant="outline" className="w-full">
                    Add Menu Items
                  </Button>
                </Link>
              </div>
              
              <div className="bg-slate-600/50 rounded-xl p-6">
                <div className="mb-4">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Monitor Bookings</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Once customers start booking, manage all reservations and track your business.
                </p>
                <Link href="/admin/bookings">
                  <Button size="sm" variant="outline" className="w-full">
                    View Bookings
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Active Dashboard */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Recent Bookings</span>
                <Link href="/admin/bookings">
                  <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-2">
                    <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
                  </div>
                  <p className="text-gray-400">No bookings yet</p>
                  <p className="text-gray-500 text-sm">Bookings will appear here once customers start booking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentBookings.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg border border-slate-500/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {booking.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{booking.customerName}</p>
                          <p className="text-sm text-gray-400">{booking.eventDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">${booking.totalAmount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'CONFIRMED' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Carts */}
          <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Food Carts Performance</span>
                <Link href="/admin/food-carts">
                  <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
                    Manage
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.popularCarts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-2">
                    <Truck className="w-10 h-10 text-gray-400 mx-auto" />
                  </div>
                  <p className="text-gray-400">No cart data available</p>
                  <p className="text-gray-500 text-sm">Add food carts to see performance metrics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.popularCarts.map((cart: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-600/50 rounded-lg border border-slate-500/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{cart.name}</p>
                          <p className="text-sm text-gray-400">{cart.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">${cart.revenue.toLocaleString()}</p>
                        <p className="text-sm text-teal-400">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/bookings">
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto w-full">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="text-sm">View Bookings</span>
              </Button>
            </Link>
            <Link href="/admin/food-carts">
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto w-full">
                <Truck className="w-8 h-8 mb-2" />
                <span className="text-sm">Manage Carts</span>
              </Button>
            </Link>
            <Link href="/admin/food-items">
              <Button variant="outline" className="flex flex-col items-center p-6 h-auto w-full">
                <ChefHat className="w-8 h-8 mb-2" />
                <span className="text-sm">Edit Menu</span>
              </Button>
            </Link>
            <Button variant="outline" className="flex flex-col items-center p-6 h-auto" disabled={isEmpty}>
              <BarChart3 className="w-8 h-8 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
              <span className="text-sm text-gray-300">
                {error ? 'System experiencing issues' : 'All systems operational'}
              </span>
            </div>
            {error && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => refetch()}
              >
                🔄 Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
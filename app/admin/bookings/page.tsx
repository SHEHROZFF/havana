'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  cartName: string
  eventDate: string
  startTime: string
  endTime: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  eventType: string
  guestCount: number
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        } else {
          // Mock data for demo
          const mockBookings: Booking[] = [
            {
              id: '1',
              customerName: 'John Doe',
              customerEmail: 'john@example.com',
              customerPhone: '+1-555-123-4567',
              cartName: 'Havana Street Tacos',
              eventDate: '2024-01-25',
              startTime: '14:00',
              endTime: '18:00',
              totalAmount: 245.00,
              status: 'confirmed',
              eventType: 'birthday',
              guestCount: 50,
              createdAt: '2024-01-20T10:30:00Z'
            },
            {
              id: '2',
              customerName: 'Sarah Wilson',
              customerEmail: 'sarah@example.com',
              customerPhone: '+1-555-987-6543',
              cartName: 'Cuban Coffee Cart',
              eventDate: '2024-01-26',
              startTime: '09:00',
              endTime: '13:00',
              totalAmount: 340.00,
              status: 'pending',
              eventType: 'corporate',
              guestCount: 80,
              createdAt: '2024-01-21T14:15:00Z'
            },
            {
              id: '3',
              customerName: 'Mike Johnson',
              customerEmail: 'mike@example.com',
              customerPhone: '+1-555-456-7890',
              cartName: 'Tropical Smoothie Bar',
              eventDate: '2024-01-27',
              startTime: '19:00',
              endTime: '23:00',
              totalAmount: 180.00,
              status: 'confirmed',
              eventType: 'wedding',
              guestCount: 35,
              createdAt: '2024-01-22T09:45:00Z'
            }
          ]
          setBookings(mockBookings)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.cartName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      // In real app, this would make an API call
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus as any } : booking
      ))
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bookings Management
          </h1>
          <p className="text-gray-400">
            Manage all customer bookings and reservations
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button>
            ➕ New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Button variant="outline">
              📊 Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">
            All Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or add a new booking.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-600/50 border border-slate-500/50 rounded-xl p-6 hover:border-slate-400/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {booking.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {booking.customerName}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {booking.customerEmail} • {booking.customerPhone}
                          </p>
                        </div>
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-xs font-medium border',
                          getStatusColor(booking.status)
                        )}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Event Details</p>
                          <p className="text-white font-medium">{booking.cartName}</p>
                          <p className="text-gray-300">{booking.eventType} • {booking.guestCount} guests</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Date & Time</p>
                          <p className="text-white font-medium">{booking.eventDate}</p>
                          <p className="text-gray-300">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Amount</p>
                          <p className="text-white font-bold text-lg">${booking.totalAmount}</p>
                          <p className="text-gray-300">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            ✓ Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            ✕ Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          ✓ Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        👁 View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
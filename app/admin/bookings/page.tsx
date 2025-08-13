'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useGetBookingsQuery, useUpdateBookingStatusMutation, useCancelBookingMutation } from '../../../lib/api/bookingsApi'
import type { Booking } from '../../../types/booking'
import { Plus, FileText, Calendar } from 'lucide-react'

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // RTK Query hooks
  const {
    data: bookingsData,
    isLoading: loading,
    error,
    refetch
  } = useGetBookingsQuery({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: 1,
    limit: 50
  })

  const [updateBookingStatusMutation] = useUpdateBookingStatusMutation()
  const [cancelBookingMutation] = useCancelBookingMutation()

  const bookings = bookingsData?.bookings || []

  // Handle status update
  const handleStatusUpdate = async (bookingId: string, newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      await updateBookingStatusMutation({ id: bookingId, status: newStatus }).unwrap()
      // RTK Query will automatically refetch and update the UI
    } catch (error) {
      console.error('Failed to update booking status:', error)
    }
  }

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBookingMutation(bookingId).unwrap()
      // RTK Query will automatically refetch and update the UI
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  // Use only real data from database
  const displayBookings = bookings

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const filteredBookings = displayBookings.filter(booking => {
    const name = (booking as any).customerName || `${(booking as any).customerFirstName || ''} ${(booking as any).customerLastName || ''}`.trim()
    const email = (booking as any).customerEmail || ''
    const cart = (booking as any).cartName || ''

    const search = searchTerm.toLowerCase()
    const matchesSearch = name.toLowerCase().includes(search) ||
                          email.toLowerCase().includes(search) ||
                          cart.toLowerCase().includes(search)

    const status = (booking as any).status || ''
    const matchesStatus = statusFilter === 'all' || status.toUpperCase() === statusFilter.toUpperCase()
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
                          <Plus className="w-4 h-4 mr-2" />
              New Booking
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
              <div className="mb-4">
            <Calendar className="w-24 h-24 text-gray-400 mx-auto" />
          </div>
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
                            {`${(booking as any).customerFirstName || ''}${(booking as any).customerLastName ? ' ' + (booking as any).customerLastName : ''}`.trim().charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {`${(booking as any).customerFirstName || ''} ${(booking as any).customerLastName || ''}`.trim()}
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
                      {booking.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            ✓ Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            ✕ Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
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
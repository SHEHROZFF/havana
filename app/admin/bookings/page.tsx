'use client'

import { useState, useEffect, useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'
import { useGetBookingsQuery, useUpdateBookingStatusMutation, useCancelBookingMutation } from '../../../lib/api/bookingsApi'
import { useAdminI18n } from '../../../lib/i18n/admin-context'
import type { Booking } from '../../../types/booking'
import { Calendar } from 'lucide-react'

export default function BookingsPage() {
  const { t } = useAdminI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const itemsPerPage = 10

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // RTK Query hooks with proper pagination and debounced search
  const {
    data: bookingsData,
    isLoading: loading,
    error,
    refetch
  } = useGetBookingsQuery({
    search: debouncedSearchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage,
    limit: itemsPerPage
  })

  const [updateBookingStatusMutation] = useUpdateBookingStatusMutation()
  const [cancelBookingMutation] = useCancelBookingMutation()

  const bookings = bookingsData?.bookings || []
  const totalPages = bookingsData?.totalPages || 1
  const totalBookings = bookingsData?.total || 0

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

  // Reset to page 1 when debounced search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const statusOptions = [
    { value: 'all', label: t('all_statuses') },
    { value: 'pending', label: t('pending') },
    { value: 'confirmed', label: t('confirmed') },
    { value: 'completed', label: t('completed') },
    { value: 'cancelled', label: t('cancelled') }
  ]

  // Translate status function
  const getTranslatedStatus = (status: string) => {
    const statusKey = status.toLowerCase() as 'pending' | 'confirmed' | 'completed' | 'cancelled'
    return t(statusKey)
  }

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
            {t('bookings_management')}
          </h1>
          <p className="text-gray-400">
            {t('manage_customer_bookings')}
          </p>
        </div>

      </div>

      {/* Filters */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder={t('search_bookings')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            />

          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <Card className="bg-slate-700/50 backdrop-blur-sm border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">
            {t('all_bookings_count').replace('{count}', totalBookings.toString())}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
            <Calendar className="w-24 h-24 text-gray-400 mx-auto" />
          </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('no_bookings_found')}</h3>
              <p className="text-gray-400">{t('try_adjusting_search')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
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
                          getStatusColor(booking.status.toLowerCase())
                        )}>
                          {getTranslatedStatus(booking.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">{t('event_details')}</p>
                          <p className="text-white font-medium">{booking.cartName}</p>
                          <p className="text-gray-300">{booking.eventType} • {booking.guestCount} {t('guests')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">{t('date_time')}</p>
                          <p className="text-white font-medium">{booking.eventDate}</p>
                          <p className="text-gray-300">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">{t('total_amount')}</p>
                          <p className="text-white font-bold text-lg">€{booking.totalAmount}</p>
                          <p className="text-gray-300">{t('booked_on').replace('{date}', new Date(booking.createdAt).toLocaleDateString())}</p>
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
                            {t('confirm')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                          >
                            {t('cancel')}
                          </Button>
                        </>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {t('complete')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        {t('view_details')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {t('showing_results')
                  .replace('{start}', ((currentPage - 1) * itemsPerPage + 1).toString())
                  .replace('{end}', Math.min(currentPage * itemsPerPage, totalBookings).toString())
                  .replace('{total}', totalBookings.toString())}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t('previous')}
                </Button>
                
                <span className="text-sm text-gray-300">
                  {t('page_of')
                    .replace('{current}', currentPage.toString())
                    .replace('{total}', totalPages.toString())}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t('next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
import { apiSlice } from './apiSlice'
import type { BookingFormData, Booking } from '../../types/booking'

export const bookingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bookings with filters
    getBookings: builder.query<{
      bookings: Booking[]
      total: number
      totalPages: number
    }, {
      page?: number
      limit?: number
      status?: string
      search?: string
    }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
        return `/bookings?${searchParams.toString()}`
      },
      providesTags: ['Booking'],
    }),

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Create new booking
    createBooking: builder.mutation<Booking, BookingFormData>({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation<Booking, {
      id: string
      status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        'Booking',
        'Dashboard'
      ],
    }),

    // Cancel booking
    cancelBooking: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        'Booking',
        'Dashboard'
      ],
    }),

    // Check availability for a cart on a specific date and time
    getAvailability: builder.query<{
      bookedSlots: Array<{
        startTime: string
        endTime: string
        id: string
        bookingDate?: string
      }>
      availableSlots?: string[]
      isAvailable?: boolean
      conflictingBooking?: any
    }, { cartId: string; date: string; startTime?: string; endTime?: string }>({
      query: ({ cartId, date, startTime, endTime }) => {
        let url = `/availability?cartId=${cartId}&date=${date}`
        if (startTime && endTime) {
          url += `&startTime=${startTime}&endTime=${endTime}`
        }
        return url
      },
      providesTags: ['Booking'],
    }),

    // Get all booked dates for a cart within a date range (optimized for bulk checking)
    getBulkAvailability: builder.query<{
      cartId: string
      startDate: string
      endDate: string
      bookedDates: { [date: string]: Array<{
        id: string
        startTime: string
        endTime: string
        bookingId: string
        customerName: string
        status: string
      }> }
      totalBookings: number
    }, { cartId: string; startDate: string; endDate: string }>({
      query: ({ cartId, startDate, endDate }) => 
        `/availability/bulk?cartId=${cartId}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ['Booking'],
      // Cache for 5 minutes since booking data doesn't change frequently
      keepUnusedDataFor: 300
    }),

    // Get dashboard statistics
    getDashboardStats: builder.query<{
      totalBookings: number
      pendingBookings: number
      confirmedBookings: number
      totalRevenue: number
      activeCarts: number
      todayBookings: number
      recentBookings: Booking[]
      popularCarts: Array<{
        id: string
        name: string
        bookings: number
        revenue: number
      }>
    }, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useGetAvailabilityQuery,
  useGetBulkAvailabilityQuery,
  useGetDashboardStatsQuery,
} = bookingsApi
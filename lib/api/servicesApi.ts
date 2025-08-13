import { apiSlice } from './apiSlice'
import type { Service } from '../../types/booking'

export const servicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all services
    getServices: builder.query<Service[], { cartId?: string; category?: string; includeInactive?: boolean }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.cartId) {
          searchParams.append('cartId', params.cartId)
        }
        if (params.category) {
          searchParams.append('category', params.category)
        }
        if (params.includeInactive) {
          searchParams.append('includeInactive', 'true')
        }
        return `/services?${searchParams.toString()}`
      },
      providesTags: ['Service'],
    }),

    // Get service by ID
    getServiceById: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),

    // Create new service
    createService: builder.mutation<Service, {
      name: string
      description: string
      pricePerHour: number
      category: 'STAFF' | 'KITCHEN' | 'SUPPORT' | 'MANAGEMENT' | 'SPECIAL'
      cartId?: string
      isActive?: boolean
    }>({
      query: (serviceData) => ({
        url: '/services',
        method: 'POST',
        body: serviceData,
      }),
      invalidatesTags: ['Service'],
    }),

    // Update service
    updateService: builder.mutation<Service, {
      id: string
      name?: string
      description?: string
      pricePerHour?: number
      category?: 'STAFF' | 'KITCHEN' | 'SUPPORT' | 'MANAGEMENT' | 'SPECIAL'
      cartId?: string
      isActive?: boolean
    }>({
      query: ({ id, ...serviceData }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: serviceData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Service', id },
        'Service',
      ],
    }),

    // Delete service
    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Service', id },
        'Service',
      ],
    }),

    // Bulk update services availability
    bulkUpdateServices: builder.mutation<{ message: string }, {
      ids: string[]
      isActive: boolean
    }>({
      query: (data) => ({
        url: '/services/bulk-update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Service'],
    }),

    // Get services by cart ID
    getServicesByCart: builder.query<Service[], string>({
      query: (cartId) => `/services?cartId=${cartId}`,
      providesTags: (result, error, cartId) => [
        { type: 'Service', id: `cart-${cartId}` }
      ],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useBulkUpdateServicesMutation,
  useGetServicesByCartQuery,
} = servicesApi
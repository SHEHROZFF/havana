import { apiSlice } from './apiSlice'
import type { FoodCart } from '../../types/booking'

export const foodCartsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all food carts
    getFoodCarts: builder.query<FoodCart[], void>({
      query: () => '/food-carts',
      providesTags: ['FoodCart'],
    }),

    // Get food cart by ID with details
    getFoodCartById: builder.query<FoodCart, string>({
      query: (id) => `/food-carts/${id}`,
      providesTags: (result, error, id) => [{ type: 'FoodCart', id }],
    }),

    // Create new food cart
    createFoodCart: builder.mutation<FoodCart, {
      name: string
      description: string
      cuisine: string
      pricePerHour: number
      extraHourPrice?: number
      shippingPrice?: number
      pickupAvailable?: boolean
      shippingAvailable?: boolean
      image?: string
      capacity: number
      features: string[]
    }>({
      query: (cartData) => ({
        url: '/food-carts',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['FoodCart'],
    }),

    // Update food cart
    updateFoodCart: builder.mutation<FoodCart, {
      id: string
      name?: string
      description?: string
      cuisine?: string
      pricePerHour?: number
      extraHourPrice?: number
      shippingPrice?: number
      pickupAvailable?: boolean
      shippingAvailable?: boolean
      image?: string
      capacity?: number
      features?: string[]
      isActive?: boolean
    }>({
      query: ({ id, ...cartData }) => ({
        url: `/food-carts/${id}`,
        method: 'PUT',
        body: cartData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FoodCart', id },
        'FoodCart',
      ],
    }),

    // Delete food cart
    deleteFoodCart: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/food-carts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'FoodCart', id },
        'FoodCart',
      ],
    }),

    // Check cart availability
    checkCartAvailability: builder.query<{
      available: boolean
      timeSlots: Array<{
        slot: string
        startTime: string
        endTime: string
        isAvailable: boolean
      }>
    }, {
      cartId: string
      date: string
    }>({
      query: ({ cartId, date }) => `/availability?cartId=${cartId}&date=${date}`,
      providesTags: (result, error, { cartId, date }) => [
        { type: 'FoodCart', id: `${cartId}-${date}` }
      ],
    }),
  }),
})

export const {
  useGetFoodCartsQuery,
  useGetFoodCartByIdQuery,
  useCreateFoodCartMutation,
  useUpdateFoodCartMutation,
  useDeleteFoodCartMutation,
  useCheckCartAvailabilityQuery,
} = foodCartsApi
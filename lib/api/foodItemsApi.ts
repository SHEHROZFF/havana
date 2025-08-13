import { apiSlice } from './apiSlice'
import type { FoodItem } from '../../types/booking'

export const foodItemsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all food items
    getFoodItems: builder.query<FoodItem[], { cartId?: string; includeInactive?: boolean }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.cartId) {
          searchParams.append('cartId', params.cartId)
        }
        if (params.includeInactive) {
          searchParams.append('includeInactive', 'true')
        }
        return `/food-items?${searchParams.toString()}`
      },
      providesTags: ['FoodItem'],
    }),

    // Get food item by ID
    getFoodItemById: builder.query<FoodItem, string>({
      query: (id) => `/food-items/${id}`,
      providesTags: (result, error, id) => [{ type: 'FoodItem', id }],
    }),

    // Create new food item
    createFoodItem: builder.mutation<FoodItem, {
      name: string
      description: string
      price: number
      image?: string
      category: string
      cartId?: string
      isAvailable?: boolean
    }>({
      query: (itemData) => ({
        url: '/food-items',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['FoodItem'],
    }),

    // Update food item
    updateFoodItem: builder.mutation<FoodItem, {
      id: string
      name?: string
      description?: string
      price?: number
      image?: string
      category?: string
      cartId?: string
      isAvailable?: boolean
    }>({
      query: ({ id, ...itemData }) => ({
        url: `/food-items/${id}`,
        method: 'PUT',
        body: itemData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FoodItem', id },
        'FoodItem',
      ],
    }),

    // Delete food item
    deleteFoodItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/food-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'FoodItem', id },
        'FoodItem',
      ],
    }),

    // Bulk update food items availability
    bulkUpdateFoodItems: builder.mutation<{ message: string }, {
      ids: string[]
      isAvailable: boolean
    }>({
      query: (data) => ({
        url: '/food-items/bulk-update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['FoodItem'],
    }),
  }),
})

export const {
  useGetFoodItemsQuery,
  useGetFoodItemByIdQuery,
  useCreateFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation,
  useBulkUpdateFoodItemsMutation,
} = foodItemsApi
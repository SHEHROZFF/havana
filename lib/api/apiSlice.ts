import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if authenticated
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Booking', 'FoodCart', 'FoodItem', 'Service', 'Dashboard'],
  // Enhanced caching configuration
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnMountOrArgChange: 30, // 30 seconds
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})
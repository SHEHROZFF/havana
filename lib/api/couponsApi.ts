import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usageCount: number
  perUserLimit?: number
  validFrom: string
  validUntil: string
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  isFirstTimeOnly: boolean
  applicableToCartIds?: string
  applicableToServiceIds?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  recentUsages?: CouponUsage[]
}

export interface CouponUsage {
  id: string
  couponId: string
  bookingId: string
  customerEmail: string
  discountAmount: number
  usedAt: string
  booking: {
    id: string
    customerEmail: string
    customerFirstName: string
    customerLastName: string
    totalAmount?: number
    createdAt?: string
  }
}

export interface CouponValidationRequest {
  couponCode: string
  customerEmail: string
  orderAmount: number
  cartIds?: string[]
  serviceIds?: string[]
  // isFirstTime removed - no authentication system
}

export interface CouponValidationResponse {
  valid: boolean
  error?: string
  coupon?: {
    id: string
    code: string
    name: string
    description?: string
    type: string
    value: number
  }
  discountAmount?: number
  finalAmount?: number
  originalAmount?: number
  message?: string
}

export interface CreateCouponRequest {
  code: string
  name: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  // perUserLimit and isFirstTimeOnly removed - no authentication system
  validFrom: string
  validUntil: string
  applicableToCartIds?: string[]
  applicableToServiceIds?: string[]
  createdBy?: string
}

export interface UpdateCouponRequest {
  name?: string
  description?: string
  type?: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value?: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  // perUserLimit and isFirstTimeOnly removed - no authentication system
  validFrom?: string
  validUntil?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  applicableToCartIds?: string[]
  applicableToServiceIds?: string[]
}

export const couponsApi = createApi({
  reducerPath: 'couponsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['Coupon'],
  endpoints: (builder) => ({
    // Admin endpoints
    getCoupons: builder.query<{
      success: boolean
      coupons: Coupon[]
      pagination: {
        currentPage: number
        totalPages: number
        totalCount: number
        hasMore: boolean
      }
    }, { search?: string; status?: string; page?: number; limit?: number }>({
      query: ({ search, status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        })
        if (search) params.append('search', search)
        if (status) params.append('status', status)
        return `admin/coupons?${params.toString()}`
      },
      providesTags: ['Coupon']
    }),

    getCoupon: builder.query<{
      success: boolean
      coupon: Coupon
    }, string>({
      query: (id) => `admin/coupons/${id}`,
      providesTags: ['Coupon']
    }),

    createCoupon: builder.mutation<{
      success: boolean
      coupon: Coupon
      message: string
    }, CreateCouponRequest>({
      query: (couponData) => ({
        url: 'admin/coupons',
        method: 'POST',
        body: couponData
      }),
      invalidatesTags: ['Coupon']
    }),

    updateCoupon: builder.mutation<{
      success: boolean
      coupon: Coupon
      message: string
    }, { id: string; data: UpdateCouponRequest }>({
      query: ({ id, data }) => ({
        url: `admin/coupons/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Coupon']
    }),

    deleteCoupon: builder.mutation<{
      success: boolean
      message: string
    }, string>({
      query: (id) => ({
        url: `admin/coupons/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Coupon']
    }),

    // User endpoints
    validateCoupon: builder.mutation<CouponValidationResponse, CouponValidationRequest>({
      query: (validationData) => ({
        url: 'coupons/validate',
        method: 'POST',
        body: validationData
      })
    })
  })
})

export const {
  useGetCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation
} = couponsApi

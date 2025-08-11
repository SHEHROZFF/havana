import { apiSlice } from './apiSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin login
    adminLogin: builder.mutation<{
      success: boolean
      token: string
      message: string
    }, {
      email: string
      password: string
    }>({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Verify token (optional endpoint for token validation)
    verifyToken: builder.query<{
      valid: boolean
      user?: any
    }, string>({
      query: (token) => ({
        url: '/admin/auth/verify',
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
})

export const {
  useAdminLoginMutation,
  useVerifyTokenQuery,
} = authApi
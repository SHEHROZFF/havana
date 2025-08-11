import { useCallback } from 'react'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type RTKError = FetchBaseQueryError | SerializedError | undefined

interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  defaultMessage?: string
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: RTKError,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      defaultMessage = 'An unexpected error occurred'
    } = options

    let errorMessage = defaultMessage
    let statusCode: number | undefined

    if (error) {
      if ('status' in error) {
        // FetchBaseQueryError
        statusCode = typeof error.status === 'number' ? error.status : undefined
        
        if (error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage = (error.data as any).message
        } else if (error.data && typeof error.data === 'string') {
          errorMessage = error.data
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Bad request. Please check your input.'
              break
            case 401:
              errorMessage = 'Unauthorized. Please log in again.'
              break
            case 403:
              errorMessage = 'Access denied. You don\'t have permission.'
              break
            case 404:
              errorMessage = 'Resource not found.'
              break
            case 500:
              errorMessage = 'Server error. Please try again later.'
              break
            default:
              errorMessage = `Request failed with status ${error.status}`
          }
        }
      } else if ('message' in error) {
        // SerializedError
        errorMessage = error.message || defaultMessage
      }
    }

    if (logError) {
      console.error('Error occurred:', {
        error,
        message: errorMessage,
        statusCode,
        timestamp: new Date().toISOString()
      })
    }

    if (showToast) {
      // In a real app, you might use a toast library here
      // For now, we'll just use alert
      alert(`❌ ${errorMessage}`)
    }

    return {
      message: errorMessage,
      statusCode,
      originalError: error
    }
  }, [])

  const getErrorMessage = useCallback((error: RTKError): string => {
    const handled = handleError(error, { showToast: false, logError: false })
    return handled.message
  }, [handleError])

  return {
    handleError,
    getErrorMessage
  }
}
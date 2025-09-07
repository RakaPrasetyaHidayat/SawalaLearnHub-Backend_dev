// API Error Handler Utility

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export class ApiErrorHandler {
  static handleError(error: unknown): ApiError {
    console.log('Handling error:', error)
    
    if (error instanceof Error) {
      // Network or fetch errors
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        return {
          message: 'Network error. Please check your internet connection and ensure the API server is running.',
          code: 'NETWORK_ERROR'
        }
      }
      
      // CORS errors
      if (error.message.includes('CORS')) {
        return {
          message: 'CORS error. The API server may not be configured to accept requests from this domain.',
          code: 'CORS_ERROR'
        }
      }
      
      // HTTP errors
      if (error.message.includes('HTTP error')) {
        const statusMatch = error.message.match(/status: (\d+)/)
        const status = statusMatch ? parseInt(statusMatch[1]) : undefined
        
        switch (status) {
          case 401:
            return {
              message: 'Unauthorized. Please log in again.',
              status: 401,
              code: 'UNAUTHORIZED'
            }
          case 403:
            return {
              message: 'Access denied. You do not have permission to view this data.',
              status: 403,
              code: 'FORBIDDEN'
            }
          case 404:
            return {
              message: 'Data not found.',
              status: 404,
              code: 'NOT_FOUND'
            }
          case 500:
            return {
              message: 'Server error. Please try again later.',
              status: 500,
              code: 'SERVER_ERROR'
            }
          default:
            return {
              message: `Request failed with status ${status}`,
              status,
              code: 'HTTP_ERROR'
            }
        }
      }
      
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR'
      }
    }
    
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    }
  }

  static isRetryableError(error: ApiError): boolean {
    const retryableCodes = ['NETWORK_ERROR', 'SERVER_ERROR']
    const retryableStatuses = [500, 502, 503, 504]
    
    return retryableCodes.includes(error.code || '') || 
           (error.status ? retryableStatuses.includes(error.status) : false)
  }
}
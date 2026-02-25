/**
 * Error handling utilities for API calls
 */

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

class ErrorHandler {
  /**
   * Handle API response errors consistently
   * @param response The fetch response object
   * @returns A promise that resolves to an ApiError object
   */
  static async handleErrorResponse(response: Response): Promise<ApiError> {
    const contentType = response.headers.get('content-type');

    let errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
    let detail: string | undefined;

    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        detail = errorData.detail || errorData.message || errorData.error;

        if (detail) {
          errorMessage = detail;
        }
      } else {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      }
    } catch (e) {
      // If parsing fails, use the default error message
      console.warn('Could not parse error response:', e);
    }

    return {
      status: response.status,
      message: errorMessage,
      detail
    };
  }

  /**
   * Throw a consistent error based on response status
   * @param response The fetch response object
   */
  static async throwError(response: Response): Promise<void> {
    const errorInfo = await this.handleErrorResponse(response);

    switch (response.status) {
      case 400:
        throw new Error(`Bad Request: ${errorInfo.message}`);
      case 401:
        // Clear auth token if unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        throw new Error(`Unauthorized: ${errorInfo.message}`);
      case 403:
        throw new Error(`Forbidden: ${errorInfo.message}`);
      case 404:
        throw new Error(`Not Found: ${errorInfo.message}`);
      case 409:
        throw new Error(`Conflict: ${errorInfo.message}`);
      case 500:
        throw new Error(`Internal Server Error: ${errorInfo.message}`);
      default:
        throw new Error(`Unexpected error: ${errorInfo.message}`);
    }
  }

  /**
   * Log error to console in development
   * @param error The error object
   */
  static logError(error: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
  }
}

export default ErrorHandler;
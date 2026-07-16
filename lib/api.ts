import { ApiResponse } from './types';

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function createApiResponse<T>(data: T, success: boolean = true): ApiResponse<T> {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : 'An error occurred',
  };
}

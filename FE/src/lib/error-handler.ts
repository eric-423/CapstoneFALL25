import { NextResponse } from 'next/server';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'CustomError';
  }
}

export function createErrorResponse(error: AppError | Error): NextResponse {
  const customError = error as AppError;
  const statusCode = customError.statusCode || 500;
  const code = customError.code || 'INTERNAL_ERROR';

  // Log error for monitoring
  console.error('Application Error:', {
    message: error.message,
    statusCode,
    code,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && statusCode >= 500
    ? 'Đã xảy ra lỗi hệ thống'
    : error.message;

  return NextResponse.json(
    {
      error: message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
    { status: statusCode }
  );
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof CustomError) {
    return createErrorResponse(error);
  }

  if (error instanceof Error) {
    return createErrorResponse(error);
  }

  return createErrorResponse(
    new CustomError('Unknown error occurred', 500, 'UNKNOWN_ERROR')
  );
}

// Common error types
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

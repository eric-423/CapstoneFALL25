import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    const limit = request.nextUrl.searchParams.get('limit') || '20';

    if (!address) {
      return createErrorResponse(
        new CustomError('Missing address', 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const params = new URLSearchParams({ address, limit });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/branches/nearby?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return createErrorResponse(
        new CustomError('Failed to fetch nearby branches', response.status)
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

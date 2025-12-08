import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return createErrorResponse(
        new CustomError('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const status = searchParams.get('status');

    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/orders?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return createErrorResponse(
        new CustomError('Failed to fetch orders', response.status)
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}




export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return createErrorResponse(
        new CustomError('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const body = await request.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      return createErrorResponse(
        new CustomError('Failed to create order', backendRes.status)
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}
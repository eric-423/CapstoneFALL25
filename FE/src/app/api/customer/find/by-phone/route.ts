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
        const phone = searchParams.get('phone');

        if (!phone) {
            return createErrorResponse(
                new CustomError('Phone number is required', 400, ErrorCodes.VALIDATION_ERROR)
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/customers/find/by-phone?phone=${phone}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(
                new CustomError('Failed to find customer by phone', response.status)
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}


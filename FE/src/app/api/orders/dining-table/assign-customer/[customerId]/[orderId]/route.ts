import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ customerId: string; orderId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(
                new CustomError('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)
            );
        }

        const { customerId, orderId } = await params;

        if (!customerId || !orderId) {
            return createErrorResponse(
                new CustomError('Customer ID and Order ID are required', 400, ErrorCodes.VALIDATION_ERROR)
            );
        }


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/dining-table/assign-customer/${customerId}/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return createErrorResponse(
                new CustomError(`Failed to assign customer to order: ${errorText}`, response.status)
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error assigning customer to order:', error);
        return createErrorResponse(error as Error);
    }
}


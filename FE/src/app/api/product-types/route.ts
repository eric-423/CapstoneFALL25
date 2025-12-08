import { NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET() {
    try {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/product-types`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch product types'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Product Types API Error:', error);
        return createErrorResponse(error as Error);
    }
}

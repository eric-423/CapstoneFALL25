import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/table/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch table data');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Table API Error:', error);
        return createErrorResponse(error as Error);
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Forward to external API (public endpoint, no auth required)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/payment-method`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch payment methods');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Payment Method API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment methods' },
            { status: 500 }
        );
    }
}

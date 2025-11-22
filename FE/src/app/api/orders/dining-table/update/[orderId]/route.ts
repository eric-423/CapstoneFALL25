import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const body = await request.json();

        // Forward to external API (public endpoint, no auth required)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/orders/dining-table/update/${orderId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update order');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Update Dining Table Order API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}

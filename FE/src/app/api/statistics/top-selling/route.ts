import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');
        const limit = searchParams.get('limit') || '5';

        // Build query params
        const params = new URLSearchParams();
        if (branchId) params.append('branchId', branchId);
        params.append('limit', limit);

        // Forward to external API (public endpoint, no auth required)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/statistics/top-selling?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch top selling items' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Top Selling Items API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch top selling items' },
            { status: 500 }
        );
    }
}

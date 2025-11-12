import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const branchId = searchParams.get('branchId');
        const date = searchParams.get('date');
        const comparisonType = searchParams.get('comparisonType') || 'DAILY';

        if (!branchId) {
            return NextResponse.json(
                { error: 'branchId is required' },
                { status: 400 }
            );
        }

        // Build query params
        const params = new URLSearchParams();
        params.append('branchId', branchId);
        params.append('comparisonType', comparisonType);
        if (date) params.append('date', date);

        // Forward to external API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/statistics/service-time?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch service time statistics' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Service Time Statistics API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch service time statistics' },
            { status: 500 }
        );
    }
}

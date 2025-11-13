import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        let accessToken = request.cookies.get('token')?.value;

        console.log('🔑 Raw Token from cookie:', accessToken);

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        console.log('🔑 Token length:', accessToken?.length);
        console.log('🔑 Token preview:', accessToken ? `${accessToken.substring(0, 50)}...` : 'NOT FOUND');

        const { searchParams } = new URL(request.url);
        const comparisonType = searchParams.get('comparisonType') || 'DAILY';

        // Build query params
        const params = new URLSearchParams();
        params.append('comparisonType', comparisonType);

        console.log('📤 Calling backend:', `${process.env.NEXT_PUBLIC_BASE_URL}/statistics/new-customers?${params.toString()}`);
        console.log('📤 Authorization header:', `Bearer ${accessToken.substring(0, 30)}...`);

        // Forward to external API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/statistics/new-customers?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                cache: 'no-store',
            }
        );

        console.log('📥 Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Backend error (raw):', errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Failed to fetch new customers statistics' };
            }

            console.log('❌ Backend error (parsed):', errorData);
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('New Customers Statistics API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch new customers statistics' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function GET() {
    try {
        const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        const url = `${baseUrl}/payment-method`;

        console.log('🔄 Fetching payment methods');

        // Forward to external API (public endpoint, no auth required)
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
            cache: 'no-store',
        });

        console.log('📥 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Failed to fetch payment methods' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const responseText = await response.text();
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : { data: [] };
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            data = { data: [] };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Payment Method API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch payment methods' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        const url = `${baseUrl}/orders/dining-table/payment`;

        console.log('🔄 Processing dining table payment:', body);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': '*/*',
            },
            body: JSON.stringify(body),
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
                errorData = { error: errorText || 'Failed to process payment' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const responseText = await response.text();
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : { success: true };
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            data = { success: true };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Dining Table Payment API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process payment' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const url = `${baseUrl}/orders/cheff/cooked/${orderId}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': '*/*',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Unknown error', status: response.status };
            }
            
            return NextResponse.json(
                {
                    error: errorData.error || errorData.message || 'Failed to mark order as cooked',
                    details: errorData,
                    status: response.status
                },
                { status: response.status }
            );
        }

        const responseText = await response.text();
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : { success: true };
        } catch (parseError) {
            data = { success: true };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Mark Order as Cooked API Error:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to mark order as cooked',
                type: 'UnexpectedError'
            },
            { status: 500 }
        );
    }
}


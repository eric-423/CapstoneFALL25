import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const url = `${baseUrl}/orders/waiter/confirm`;

        const body = await request.json();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Backend error:', errorBody);
            return NextResponse.json(
                { error: errorBody || 'Failed to confirm order' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error confirming order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

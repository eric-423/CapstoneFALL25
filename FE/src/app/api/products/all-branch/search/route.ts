import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
            params.append(key, value);
        });

        const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        const url = `${baseUrl}/products/all-branch/search?${params.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Backend error:', errorBody);
            return NextResponse.json(
                { error: errorBody || 'Failed to fetch products' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

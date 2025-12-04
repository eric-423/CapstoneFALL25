import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const url = `${baseUrl}/units`;

        console.log('🔄 Fetching units');

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
                errorData = { error: errorText || 'Failed to fetch units' };
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
        console.error('Units API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}

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

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        const url = `${baseUrl}/units`;

        console.log('🔄 Creating unit:', body);

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
                errorData = { error: errorText || 'Failed to create unit' };
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
        console.error('Create Unit API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}

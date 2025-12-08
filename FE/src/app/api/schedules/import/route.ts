import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        const url = `${baseUrl}/schedules/import`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'accept': '*/*',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const responseText = await response.text();
        let responseData;

        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch {
            responseData = { message: responseText || 'Unknown error' };
        }

        if (!response.ok) {
            return NextResponse.json(
                {
                    status: response.status,
                    desc: responseData.desc || responseData.message || responseData.error || 'Failed to import schedules',
                    error: responseData,
                },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('Error importing schedules:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


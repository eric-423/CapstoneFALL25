import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        const url = `${baseUrl}/shifts/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
            body: JSON.stringify(body),
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
                    error: errorData.error || errorData.message || 'Failed to update shift',
                    details: errorData,
                    status: response.status
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Update Shift API Error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to update shift',
                type: 'UnexpectedError'
            },
            { status: 500 }
        );
    }
}


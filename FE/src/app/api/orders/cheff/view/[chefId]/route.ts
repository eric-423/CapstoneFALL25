import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JwtDecode from '@/utils/jwtDecode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ chefId: string }> }
) {
    try {
        const { chefId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const decodedToken = JwtDecode(token);
        if (!decodedToken) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        let url = `${baseUrl}/orders/cheff/view/${chefId}`;

        if (status && status.trim() !== '' && status !== 'ALL') {
            const params = new URLSearchParams();
            params.append('status', status);
            url = `${url}?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
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
                    error: errorData.error || errorData.message || 'Failed to fetch chef orders',
                    details: errorData,
                    status: response.status
                },
                { status: response.status }
            );
        }

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            throw new Error('Invalid JSON response from server');
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Get Chef Orders API Error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch chef orders',
                type: 'UnexpectedError'
            },
            { status: 500 }
        );
    }
}


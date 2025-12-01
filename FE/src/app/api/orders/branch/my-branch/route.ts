import { NextRequest, NextResponse } from 'next/server';
import JwtDecode from '@/utils/jwtDecode';
import { getToken } from '@/utils/cookies.server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';


export async function GET(request: NextRequest) {
    try {
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const decodedToken = JwtDecode(token);
        if (!decodedToken) {
            return NextResponse.json(
                { error: 'Unauthorized - No decoded token found' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
        let url = `${baseUrl}/orders/branch/my-branch`;

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

            const userRole = decodedToken?.r ?? 'Unknown';
            const errorMessage = response.status === 403
                ? `Access denied. This endpoint requires MANAGER/ADMIN/STAFF role, but your role is: ${userRole}. Please contact administrator.`
                : errorData.error || errorData.message || 'Failed to fetch branch orders';

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: errorData,
                    status: response.status,
                    userRole
                },
                { status: response.status }
            );
        }

        const responseText = await response.text();

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error('Invalid JSON response from server');
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch branch orders',
                type: 'UnexpectedError'
            },
            { status: 500 }
        );
    }
}


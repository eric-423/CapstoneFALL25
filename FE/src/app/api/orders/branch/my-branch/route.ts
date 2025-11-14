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

        console.log('📥 [Branch Orders API] Response status:', response.status, response.statusText);
        console.log('📥 [Branch Orders API] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [Branch Orders API] Error response status:', response.status);
            console.error('❌ [Branch Orders API] Error response text:', errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Unknown error', status: response.status };
            }

            console.error('❌ [Branch Orders API] Parsed error data:', errorData);
            console.error('❌ [Branch Orders API] User role when error occurred:', decodedToken?.role || 'Unknown');
            console.error('❌ [Branch Orders API] This endpoint may require MANAGER/ADMIN role, but user has:', decodedToken?.role || 'Unknown');

            const errorMessage = response.status === 403
                ? `Access denied. This endpoint requires MANAGER/ADMIN role, but your role is: ${decodedToken?.role || 'Unknown'}. Please contact administrator.`
                : errorData.error || errorData.message || 'Failed to fetch branch orders';

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: errorData,
                    status: response.status,
                    userRole: decodedToken?.role || 'Unknown'
                },
                { status: response.status }
            );
        }

        const responseText = await response.text();
        console.log('✅ [Branch Orders API] Response text length:', responseText.length);
        console.log('✅ [Branch Orders API] Response text preview:', responseText.substring(0, 300));

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ [Branch Orders API] Failed to parse JSON:', parseError);
            console.error('❌ [Branch Orders API] Response text:', responseText);
            throw new Error('Invalid JSON response from server');
        }

        console.log('✅ [Branch Orders API] Successfully parsed response');
        return NextResponse.json(data);
    } catch (error) {
        console.error('💥 [Branch Orders API] Unexpected error:', error);
        console.error('💥 [Branch Orders API] Error stack:', error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch branch orders',
                type: 'UnexpectedError'
            },
            { status: 500 }
        );
    }
}


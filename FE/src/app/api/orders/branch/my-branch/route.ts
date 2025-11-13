import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
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

        console.log('🔍 Fetching branch orders from:', url);
        console.log('🔍 Status parameter received:', status);
        console.log('🔍 Token preview:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN');
        console.log('🔍 Full URL:', url);

        const response = await fetch(url, {
            method: 'GET',
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
                errorData = { error: errorText || 'Unknown error' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const responseText = await response.text();
        console.log('✅ Response text:', responseText.substring(0, 200));
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('❌ Failed to parse JSON:', parseError);
            throw new Error('Invalid JSON response from server');
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Get Branch Orders API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch branch orders' },
            { status: 500 }
        );
    }
}


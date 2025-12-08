import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ endpoint: string }> }
) {
    try {
        const { endpoint } = await params;
        const searchParams = request.nextUrl.searchParams;

        // Lấy token từ cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        // Tạo query string từ search params
        const queryString = searchParams.toString();
        const url = `${API_BASE_URL}/statistics/${endpoint}${queryString ? `?${queryString}` : ''}`;

        console.log('🔑 Token preview:', token?.substring(0, 50) + '...');
        console.log('� Calling backend:', url);

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Thêm Authorization header nếu có token (trừ top-selling là public)
        if (token && endpoint !== 'top-selling') {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('🔐 Added Authorization header');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || 'Failed to fetch statistics';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

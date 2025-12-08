import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

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
        const queryString = searchParams.toString();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/overview/peak-hours${queryString ? `?${queryString}` : ''}`, {
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
            return NextResponse.json({ error: errorText || 'Lỗi Không Xác ĐịNH' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching peak hours:', error);
        return createErrorResponse(error as Error);
    }
}

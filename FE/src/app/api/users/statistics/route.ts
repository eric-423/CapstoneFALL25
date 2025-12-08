import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const branchId = searchParams.get('branchId');

        const url = branchId
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/users/statistics?branchId=${branchId}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/users/statistics`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch user statistics'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        return createErrorResponse(error as Error);
    }
}

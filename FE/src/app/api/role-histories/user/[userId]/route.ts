import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { userId } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/role-histories/user/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch role history' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching role history:', error);
        return createErrorResponse(error as Error);
    }
}

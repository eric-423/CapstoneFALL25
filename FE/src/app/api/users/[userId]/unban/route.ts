import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/unban`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to unban user'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error unbanning user:', error);
        return createErrorResponse(error as Error);
    }
}

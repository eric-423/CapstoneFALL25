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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch user'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching user:', error);
        return createErrorResponse(error as Error);
    }
}

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
        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to update user'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error updating user:', error);
        return createErrorResponse(error as Error);
    }
}

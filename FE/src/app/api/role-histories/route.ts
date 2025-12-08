import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';


export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/role-histories`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to create role history' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating role history:', error);
        return createErrorResponse(error as Error);
    }
}

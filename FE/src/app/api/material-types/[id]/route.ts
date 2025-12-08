import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new Error('Unauthorized'));
        }

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/material-types/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Material type PUT error:', error);
        return createErrorResponse(error as Error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new Error('Unauthorized'));
        }

        const { id } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/material-types/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Material type DELETE error:', error);
        return createErrorResponse(error as Error);
    }
}

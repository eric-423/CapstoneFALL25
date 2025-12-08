import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ documentId: string }> }
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

        const { documentId } = await params;
        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/documents/admin/${documentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to update document'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error updating document:', error);
        return createErrorResponse(error as Error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ documentId: string }> }
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

        const { documentId } = await params;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/documents/admin/${documentId}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to delete document'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error deleting document:', error);
        return createErrorResponse(error as Error);
    }
}


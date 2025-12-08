import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/utensils-types/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching utensil type:', error);
        return createErrorResponse(error as Error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/utensils-types/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error updating utensil type:', error);
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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/utensils-types/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error deleting utensil type:', error);
        return createErrorResponse(error as Error);
    }
}

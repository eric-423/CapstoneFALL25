import { createErrorResponse } from '@/lib/error-handler';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ warehouseId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { warehouseId } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/warehouses/${warehouseId}/utensils`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching warehouse utensils:', error);
        return createErrorResponse(error as Error);
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ warehouseId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { warehouseId } = await params;
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/warehouses/${warehouseId}/utensils`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating warehouse utensils:', error);
        return createErrorResponse(error as Error);
    }
}

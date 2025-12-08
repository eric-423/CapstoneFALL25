import { createErrorResponse } from '@/lib/error-handler';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/warehouses`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return createErrorResponse(error as Error);
    }
}

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
            `${process.env.NEXT_PUBLIC_BASE_URL}/warehouses`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating warehouse:', error);
        return createErrorResponse(error as Error);
    }
}

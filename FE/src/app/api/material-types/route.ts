import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new Error('Unauthorized'));
        }

        const { searchParams } = new URL(request.url);
        const includeDeleted = searchParams.get('includeDeleted') || 'false';

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/material-types?includeDeleted=${includeDeleted}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch material types'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Material types GET error:', error);
        return createErrorResponse(error as Error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new Error('Unauthorized'));
        }

        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/material-types`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to create material type'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Material types POST error:', error);
        return createErrorResponse(error as Error);
    }
}

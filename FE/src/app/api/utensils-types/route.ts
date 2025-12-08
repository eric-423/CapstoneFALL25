import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/utensils-types${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': '*/*',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch utensil types'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching utensil types:', error);
        return createErrorResponse(error as Error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/utensils-types`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'accept': '*/*',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to create utensil type'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating utensil type:', error);
        return createErrorResponse(error as Error);
    }
}

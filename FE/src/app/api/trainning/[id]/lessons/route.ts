import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params;

        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const response = await fetch(
            `${API_URL}/lessons/admin/trainings/${id}/lessons${queryString ? `?${queryString}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                payload ?? { error: 'Failed to fetch lessons' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Get Training Lessons API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch lessons' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(
            `${API_URL}/lessons/admin/trainings/${id}/lessons`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                payload ?? { error: 'Failed to create lesson' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Create Training Lesson API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create lesson' },
            { status: 500 }
        );
    }
}


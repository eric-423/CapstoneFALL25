import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
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

        const { lessonId } = await params;

        const response = await fetch(
            `${API_URL}/lessons/admin/lessons/${lessonId}`,
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
                payload ?? { error: 'Failed to fetch lesson detail' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Get Lesson Detail API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch lesson detail' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
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

        const { lessonId } = await params;
        const body = await request.json();

        const response = await fetch(
            `${API_URL}/lessons/admin/lessons/${lessonId}`,
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

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                payload ?? { error: 'Failed to update lesson' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Update Lesson API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update lesson' },
            { status: 500 }
        );
    }
}


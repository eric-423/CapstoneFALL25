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
            `${API_URL}/documents/admin/lessons/${lessonId}`,
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
                payload ?? { error: 'Failed to fetch lesson documents' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Get Lesson Documents API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch lesson documents' },
            { status: 500 }
        );
    }
}

export async function POST(
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
            `${API_URL}/documents/admin/lessons/${lessonId}`,
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
                payload ?? { error: 'Failed to create document' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Create Lesson Document API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create document' },
            { status: 500 }
        );
    }
}


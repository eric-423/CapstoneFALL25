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

        const response = await fetch(
            `${API_URL}/trainings/admin/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch training' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Get Training By ID API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch training' },
            { status: 500 }
        );
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
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(
            `${API_URL}/trainings/admin/${id}`,
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
                payload ?? { error: 'Failed to update training' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Update Training API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update training' },
            { status: 500 }
        );
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
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const response = await fetch(
            `${API_URL}/trainings/admin/${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': '*/*',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                payload ?? { error: 'Failed to delete training' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            payload ?? { status: 0, desc: 'Training deleted successfully', data: null }
        );
    } catch (error) {
        console.error('Delete Training API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete training' },
            { status: 500 }
        );
    }
}


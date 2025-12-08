import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();

        const response = await fetch(
            `${API_URL}/trainings/admin${queryString ? `?${queryString}` : ''}`,
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
            if (response.status === 404 && payload && typeof payload === 'object' && 'data' in payload) {
                return NextResponse.json(payload, { status: 200 });
            }

            return NextResponse.json(
                payload ?? { error: 'Failed to fetch trainings' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Get Trainings API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch trainings' },
            { status: 500 }
        );
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

        const response = await fetch(`${API_URL}/trainings/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return NextResponse.json(
                payload ?? { error: 'Failed to create training' },
                { status: response.status }
            );
        }

        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('Create Training API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create training' },
            { status: 500 }
        );
    }
}


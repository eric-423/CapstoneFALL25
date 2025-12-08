import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cooking-method-nutrients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Backend error:', errorBody);
            return NextResponse.json(
                { error: errorBody || 'Failed to fetch cooking method nutrients' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching cooking method nutrients:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cooking-method-nutrients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Backend error:', errorBody);
            return NextResponse.json(
                { error: errorBody || 'Failed to create cooking method nutrient' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating cooking method nutrient:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


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

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/cooking-utensils${queryString ? `?${queryString}` : ''}`;


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
            const errorBody = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorBody);
            } catch {
                errorData = { error: errorBody || 'Failed to fetch cooking utensils' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching cooking utensils:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/cooking-utensils`;

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
            const errorBody = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorBody);
            } catch {
                errorData = { error: errorBody || 'Failed to create cooking utensil' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating cooking utensil:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

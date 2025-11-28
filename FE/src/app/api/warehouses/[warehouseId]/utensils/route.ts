import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ warehouseId: string }> }
) {
    try {
        const { warehouseId } = await params;

        const response = await fetch(`${API_URL}/api/warehouses/${warehouseId}/utensils`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: request.headers.get('cookie') || '',
            },
            credentials: 'include',
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error fetching warehouse utensils:', error);
        return NextResponse.json(
            { status: 500, desc: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ warehouseId: string }> }
) {
    try {
        const { warehouseId } = await params;
        const body = await request.json();

        const response = await fetch(`${API_URL}/api/warehouses/${warehouseId}/utensils`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: request.headers.get('cookie') || '',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error adding utensils to warehouse:', error);
        return NextResponse.json(
            { status: 500, desc: 'Internal server error' },
            { status: 500 }
        );
    }
}

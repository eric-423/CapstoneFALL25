import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cooking-utensils/${id}`, {
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
        console.error('Error fetching cooking utensil:', error);
        return NextResponse.json(
            { status: 500, desc: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cooking-utensils/${id}`, {
            method: 'PUT',
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
        console.error('Error updating cooking utensil:', error);
        return NextResponse.json(
            { status: 500, desc: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cooking-utensils/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Cookie: request.headers.get('cookie') || '',
            },
            credentials: 'include',
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error deleting cooking utensil:', error);
        return NextResponse.json(
            { status: 500, desc: 'Internal server error' },
            { status: 500 }
        );
    }
}

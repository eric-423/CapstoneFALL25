import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/product-types`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch product types');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Product Types API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product types' },
            { status: 500 }
        );
    }
}

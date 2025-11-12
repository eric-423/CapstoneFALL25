import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Build query params
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
            params.append(key, value);
        });

        // Forward to external API (public endpoint, no auth required)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/combos/search?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search combos');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Combos Search API Error:', error);
        return NextResponse.json(
            { error: 'Failed to search combos' },
            { status: 500 }
        );
    }
}

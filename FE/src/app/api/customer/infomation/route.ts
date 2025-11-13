import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const response = await http.get(`/customers/${userId}/informations`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Customer informations API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer informations' },
            { status: 500 },
        );
    }
}

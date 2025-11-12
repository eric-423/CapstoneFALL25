import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    const limit = request.nextUrl.searchParams.get('limit') || '20';

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    const response = await http.get('/branches/nearby', {
      params: {
        address,
        limit,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Nearby branches API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby branches' },
      { status: 500 },
    );
  }
}

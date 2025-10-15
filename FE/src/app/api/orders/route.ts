import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const status = searchParams.get('status');

    const params: any = { page, size };
    if (status) params.status = status;

    // Forward to external API
    const response = await http.get('/orders', { params });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Orders API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to external API
    const response = await http.post('/orders', body);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Create Order API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

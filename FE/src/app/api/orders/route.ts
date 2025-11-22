import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';
    const status = searchParams.get('status');

    const params: Record<string, string> = { page, size };
    if (status) params.status = status;


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
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({}));
      return NextResponse.json(errorBody, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create Order API Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
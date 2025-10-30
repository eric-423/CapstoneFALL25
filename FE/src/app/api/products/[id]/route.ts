import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Forward to external API
    const response = await http.get(`/products/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Product API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

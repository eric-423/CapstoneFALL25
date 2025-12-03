import { NextRequest, NextResponse } from 'next/server';

import { getToken } from '@/utils/cookies.server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

const buildUpstreamUrl = (orderId: string) => {
  const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
  return `${baseUrl}/orders/${orderId}`;
};

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    const token = await getToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token found' }, { status: 401 });
    }

    const upstreamUrl = buildUpstreamUrl(orderId);

    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData: unknown;

      try {
        errorData = responseText ? JSON.parse(responseText) : {};
      } catch {
        errorData = { error: responseText || 'Unknown error' };
      }

      const errorMessage =
        (typeof errorData === 'object' &&
          errorData !== null &&
          'error' in errorData &&
          typeof (errorData as { error?: string }).error === 'string' &&
          (errorData as { error?: string }).error) ||
        'Failed to fetch order detail';

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorData,
          status: response.status,
        },
        { status: response.status },
      );
    }

    const data = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Customer Order Detail API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch order detail',
        type: 'UnexpectedError',
      },
      { status: 500 },
    );
  }
}















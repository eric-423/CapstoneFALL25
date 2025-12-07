import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const scheduleId = (await context.params).id;

    const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
    const url = `${baseUrl}/schedules/${scheduleId}`;

    const response = await fetch(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();

    interface ParsedData {
      status?: number;
      desc?: string;
      message?: string;
      error?: unknown;
      [key: string]: unknown;
    }

    let parsedData: ParsedData = {};

    try {
      parsedData = responseText ? (JSON.parse(responseText) as ParsedData) : {};
    } catch (e) {
      return NextResponse.json(
        {
          status: 500,
          desc: 'Failed to parse response from server',
          error: responseText
        },
        { status: 500 }
      );
    }

    // Kiểm tra nếu response body có status 200, coi như thành công (ngay cả khi response.ok = false)
    if (parsedData.status === 200 || response.ok) {
      return NextResponse.json(parsedData, { status: 200 });
    }

    // Xử lý lỗi
    return NextResponse.json(
      {
        status: response.status || parsedData.status || 500,
        desc: parsedData.desc || parsedData.message || parsedData.error || 'Failed to update schedule',
        error: parsedData
      },
      { status: response.status || 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value || cookieStore.get('token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const scheduleId = (await context.params).id;
    const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
    const url = `${baseUrl}/schedules/${scheduleId}`;

    const response = await fetch(
      url,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ status: 200, desc: 'Deleted successfully' }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


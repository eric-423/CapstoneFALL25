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
      console.error('No token found in cookies');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const scheduleId = (await context.params).id;

    console.log('Updating schedule:', { scheduleId, body, tokenLength: accessToken.length });

    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
    const url = `${baseUrl}/schedules/${scheduleId}`;

    console.log('Calling backend API:', url, 'with token:', accessToken.substring(0, 20) + '...');

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
    console.log('BE Response:', {
      status: response.status,
      ok: response.ok,
      responseText: responseText.substring(0, 200)
    });

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
      console.error('Failed to parse response:', responseText, e);
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
    console.error('Update schedule failed:', {
      status: response.status,
      statusText: response.statusText,
      parsedData,
      body
    });

    return NextResponse.json(
      {
        status: response.status || parsedData.status || 500,
        desc: parsedData.desc || parsedData.message || parsedData.error || 'Failed to update schedule',
        error: parsedData
      },
      { status: response.status || 500 }
    );
  } catch (error) {
    console.error('Error updating schedule:', error);
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
    const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
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
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


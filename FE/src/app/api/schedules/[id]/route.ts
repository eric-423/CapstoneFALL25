import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com';

export async function PUT(
  request: NextRequest,
  context: any,
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

        const response = await fetch(
          `${API_URL}/api/schedules/${context.params.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
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
  context: any,
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

        const response = await fetch(
          `${API_URL}/api/schedules/${context.params.id}`,
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


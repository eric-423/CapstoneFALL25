import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// PUT: Cập nhật role
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ roleId: string }> }
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

        const { roleId } = await params;
        const body = await request.json();

        // Forward to external API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/roles/${roleId}`,
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
            const errorData = await response.json().catch(() => ({ error: 'Failed to update role' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Update Role API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update role' },
            { status: 500 }
        );
    }
}
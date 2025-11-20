import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ informationId: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { informationId } = await params;
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (!informationId) {
            return NextResponse.json({ error: 'Missing informationId' }, { status: 400 });
        }

        const body = await request.json();
        const { name, address, phoneNumber, isDefault } = body ?? {};

        if (!name || !address || !phoneNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const response = await http.put(
            `/customers/${userId}/informations/${informationId}`,
            {
                name,
                address,
                phoneNumber,
                isDefault: Boolean(isDefault),
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        console.error('Update customer information error:', error);
        const errorMessage =
            (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
            (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
            'Failed to update customer information';
        return NextResponse.json(
            { error: errorMessage },
            { status: (error as { response?: { status?: number } })?.response?.status || 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ informationId: string }> }
) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { informationId } = await params;
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (!informationId) {
            return NextResponse.json({ error: 'Missing informationId' }, { status: 400 });
        }

        const response = await http.delete(`/customers/${userId}/informations/${informationId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        console.error('Delete customer information error:', error);
        const errorMessage =
            (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
            (error as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
            'Failed to delete customer information';
        return NextResponse.json(
            { error: errorMessage },
            { status: (error as { response?: { status?: number } })?.response?.status || 500 },
        );
    }
}


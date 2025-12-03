import { NextRequest, NextResponse } from 'next/server';

import { apiBaseURL } from '@/utils/configs/environment';

const BASE_URL = apiBaseURL || process.env.NEXT_PUBLIC_API_URL || 'https://tam-tac.com/api';

export async function PUT(request: NextRequest, { params }: { params: { orderId?: string } }) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orderId = params?.orderId;
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }

        const upstreamBase = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
        const url = `${upstreamBase}/orders/staff/pickup/comleted/${orderId}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                accept: '*/*',
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorBody: unknown = null;
            try {
                errorBody = responseText ? JSON.parse(responseText) : null;
            } catch {
                errorBody = { error: responseText || 'Failed to complete pickup order' };
            }

            return NextResponse.json(
                {
                    error: 'Failed to complete pickup order',
                    details: errorBody,
                    status: response.status,
                },
                { status: response.status },
            );
        }

        const data = responseText ? JSON.parse(responseText) : null;
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Complete Pickup Order API] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Failed to complete pickup order', type: 'UnexpectedError' },
            { status: 500 },
        );
    }
}


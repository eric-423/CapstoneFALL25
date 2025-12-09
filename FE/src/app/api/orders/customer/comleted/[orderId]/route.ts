import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tam-tac.com/api';

type CompleteCustomerOrderRouteContext = {
    params: Promise<{ orderId?: string | string[] }>;
};

export async function PUT(request: NextRequest, context: CompleteCustomerOrderRouteContext) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;


        const resolvedParams = await context.params;
        const rawOrderId = resolvedParams?.orderId;
        const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
        }


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/customer/comleted/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorBody: unknown = null;
            try {
                errorBody = responseText ? JSON.parse(responseText) : null;
            } catch {
                errorBody = { error: responseText || 'Failed to complete customer order' };
            }

            return NextResponse.json(
                {
                    error: 'Failed to complete customer order',
                    details: errorBody,
                    status: response.status,
                },
                { status: response.status },
            );
        }

        const data = responseText ? JSON.parse(responseText) : null;
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Complete Customer Order API] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Failed to complete customer order', type: 'UnexpectedError' },
            { status: 500 },
        );
    }
}


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';



export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/dining-table/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });


        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Failed to process payment' };
            }
            return NextResponse.json(errorData, { status: response.status });
        }

        const responseText = await response.text();
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : { success: true };
        } catch (error) {
            console.log('Failed to parse JSON:', error);
            data = { success: true };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Dining Table Payment API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to process payment' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';
import { PromotionsResponse } from '@/apis/promotion.api';


export async function GET(request: NextRequest): Promise<NextResponse<PromotionsResponse>> {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ status: 401, desc: 'Unauthorized', data: [] }, { status: 401 });
        }

        const response = await http.get(`/promotions/customer/my-promotions`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.log('Customer promotions API error:', error);
        return NextResponse.json(
            { status: 500, desc: 'Failed to fetch customer promotions', data: [] },
            { status: 500 },
        );
    }
}
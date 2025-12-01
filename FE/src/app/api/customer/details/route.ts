import { NextRequest, NextResponse } from 'next/server';
import http from '@/utils/http';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get userId from token
        const { jwtDecode } = await import('jwt-decode');
        const decodedToken = jwtDecode<{ i?: number }>(token);
        const userId = decodedToken.i;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const response = await http.get(`/customers/${userId}/base-info`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Backend trả về data trực tiếp trong response.data
        const responseData = response.data;
        
        console.log('🔍 API Route - Raw response.data:', responseData);
        
        // Kiểm tra xem có phải là wrapped response không
        if (responseData && typeof responseData === 'object' && 'data' in responseData && 'status' in responseData) {
            // Đã có wrapper, trả về trực tiếp
            console.log('🔍 API Route - Response đã có wrapper');
            return NextResponse.json(responseData);
        } else {
            // Không có wrapper, wrap lại để match với interface
            console.log('🔍 API Route - Wrap response data');
            return NextResponse.json({
                status: 200,
                desc: 'Success',
                data: responseData,
            });
        }

    } catch (error) {
        console.error('Customer details API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer details' },
            { status: 500 },
        );
    }
}


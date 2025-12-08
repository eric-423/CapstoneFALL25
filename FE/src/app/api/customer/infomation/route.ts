import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập' }, { status: 401 });
        }

        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/informations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return NextResponse.json({ error: errorBody || 'Lỗi Không Xác Định' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching customer informations:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Bạn Chưa Đăng Nhập' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, name, address, phoneNumber, isDefault } = body ?? {};

        if (!userId || !name || !address || !phoneNumber) {
            return NextResponse.json({ error: 'Thiếu các trường bắt buộc' }, { status: 400 });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/informations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, address, phoneNumber, isDefault: Boolean(isDefault) }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            return NextResponse.json({ error: errorBody || 'Lỗi Không Xác Định' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating customer information:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        );
    }
}
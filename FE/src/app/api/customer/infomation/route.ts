import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new CustomError('Bạn chưa đăng nhập', 401, ErrorCodes.AUTHENTICATION_ERROR));
        }

        const userId = request.nextUrl.searchParams.get('userId');
        if (!userId) {
            return createErrorResponse(new CustomError('Thiếu userId', 400, ErrorCodes.VALIDATION_ERROR));
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/informations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            const errorBody = contentType?.includes('application/json') ? await response.json() : await response.text();
            const message = typeof errorBody === 'string' ? errorBody : errorBody?.message || 'Lỗi không xác định';
            return createErrorResponse(new CustomError(message, response.status, ErrorCodes.NETWORK_ERROR));
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching customer informations:', error);
        return createErrorResponse(new CustomError('Internal Server Error', 500, ErrorCodes.INTERNAL_ERROR));
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return createErrorResponse(new CustomError('Bạn chưa đăng nhập', 401, ErrorCodes.AUTHENTICATION_ERROR));
        }

        const body = await request.json();
        const { userId, name, address, phoneNumber, isDefault } = body ?? {};

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/informations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, address, phoneNumber, isDefault: Boolean(isDefault) }),
        });

        const contentType = response.headers.get('content-type') ?? '';
        const rawBody = await response.text();

        const parseJsonSafely = () => {
            if (!contentType.includes('application/json')) return null;
            try {
                return JSON.parse(rawBody);
            } catch {
                return null;
            }
        };

        const parsed = parseJsonSafely();

        if (!response.ok) {
            const message = typeof parsed === 'object' && parsed !== null && 'message' in parsed
                ? (parsed as { message?: string }).message ?? 'Lỗi không xác định'
                : rawBody || 'Lỗi không xác định';
            return createErrorResponse(new CustomError(message, response.status, ErrorCodes.NETWORK_ERROR));
        }

        if (parsed !== null) {
            return NextResponse.json(parsed);
        }

        // If backend returned non-JSON, forward as text payload
        return new NextResponse(rawBody, { status: response.status, headers: { 'content-type': contentType || 'text/plain' } });
    } catch (error) {
        return createErrorResponse(new CustomError((error as Error).message, 500, ErrorCodes.INTERNAL_ERROR));
    }
}
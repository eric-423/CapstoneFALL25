import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JwtDecode from '@/utils/jwtDecode';
import { createErrorResponse } from '@/lib/error-handler';


export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decodedToken = JwtDecode(token);
        const userRole = decodedToken.r?.toUpperCase();

        const isManager = userRole === 'MANAGER' || userRole === 'BRANCH_MANAGER';
        let branchIdFromCookie: string | undefined;

        if (isManager) {
            branchIdFromCookie = cookieStore.get('branchId')?.value;
        }

        const searchParams = request.nextUrl.searchParams;

        if (isManager && branchIdFromCookie && !searchParams.has('branchId')) {
            searchParams.set('branchId', branchIdFromCookie);
        }

        const queryString = searchParams.toString();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users${queryString ? `?${queryString}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch users'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error fetching users:', error);
        return createErrorResponse(error as Error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to create user'));
        }

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating user:', error);
        return createErrorResponse(error as Error);
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import JwtDecode from '@/utils/jwtDecode';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token =  cookieStore.get('token')?.value;

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
            `${API_URL}/users${queryString ? `?${queryString}` : ''}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to fetch users' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch users' },
            { status: 500 }
        );
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
            `${API_URL}/users`,
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
            const errorData = await response.json().catch(() => ({ error: 'Failed to create user' }));
            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Create User API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create user' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }


        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/employee/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });


        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.message || errorData?.error || 'Đăng nhập thất bại. Vui lòng thử lại.';
            return NextResponse.json(errorMessage, { status: response.status });
        }

        const responseData = await response.json();

        if (responseData?.token) {
            const expiresIn = responseData.expiresIn || responseData.data?.expiresIn || 7 * 24 * 60 * 60 * 1000;
            const maxAgeInSeconds = Math.floor(expiresIn / 1000);

            cookieStore.set('token', responseData.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: maxAgeInSeconds,
            });

            cookieStore.set('branchId', responseData.userInfo?.branchId, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: maxAgeInSeconds,
            });

            if (responseData.userInfo?.id) {
                cookieStore.set('userId', responseData.userInfo.id.toString(), {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: maxAgeInSeconds,
                });
            }

            if (responseData.userInfo?.role) {
                cookieStore.set('role', responseData.userInfo.role, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: maxAgeInSeconds,
                });
            }

            if (responseData.userInfo?.branchId !== undefined && responseData.userInfo?.branchId !== null) {
                cookieStore.set('branchId', responseData.userInfo.branchId.toString(), {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: maxAgeInSeconds,
                });
            }
        }

        return NextResponse.json(responseData);

    } catch (error: unknown) {
        console.error('Login API Error:', error);

        let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
        let statusCode = 500;

        if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra lại.';
                statusCode = 503;
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

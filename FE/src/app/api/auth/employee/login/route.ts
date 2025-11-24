import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { apiBaseURL } from '@/utils/configs/environment';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const baseURL = apiBaseURL;
        const fullUrl = `${baseURL}/auth/employee/login`;

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.post(fullUrl, {
            email,
            password,
        }, {
            headers,
            timeout: 10000,
        });

        const responseData = NextResponse.json(response.data);

        if (response.data?.token) {

            const maxAgeInSeconds = Math.floor(response.data.expiresIn / 1000);

            responseData.cookies.set('token', response.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: maxAgeInSeconds,
            });

            responseData.cookies.set('branchId', response.data.userInfo?.branchId, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: maxAgeInSeconds,
            });

            if (response.data.userInfo?.role) {
                responseData.cookies.set('role', response.data.userInfo.role, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: maxAgeInSeconds,
                });
            }
        }

        return responseData;

    } catch (error: unknown) {
        const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message
            || (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error
            || (axios.isAxiosError(error) && error.code === 'ECONNREFUSED' ? 'Không thể kết nối đến server. Vui lòng kiểm tra lại.' : 'Đăng nhập thất bại. Vui lòng thử lại.');

        const statusCode = (error as { response?: { status?: number } })?.response?.status || 401;

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

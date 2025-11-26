import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { token: null, error: 'Token not found' },
                { status: 401 }
            );
        }

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Failed to read token from cookies', error);
        return NextResponse.json(
            { token: null, error: 'Failed to read token' },
            { status: 500 }
        );
    }
}


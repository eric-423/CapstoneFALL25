import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { apiBaseURL } from '@/utils/configs/environment';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const { branchId } = await params;

        if (!branchId) {
            return NextResponse.json(
                { error: 'Branch ID is required' },
                { status: 400 }
            );
        }

        const baseURL = apiBaseURL;
        const fullUrl = `${baseURL}/table/branch/${branchId}`;

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(fullUrl, {
            headers,
            timeout: 10000,
        });

        return NextResponse.json(response.data);

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching tables by branch:', error.message);
            console.error('Response:', error.response?.data);
        }

        const errorMessage = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message
            || (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error
            || 'Failed to fetch tables';

        const statusCode = (error as { response?: { status?: number } })?.response?.status || 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

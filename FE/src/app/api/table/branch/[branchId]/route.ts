import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { branchId } = await params;

        if (!branchId) {
            return createErrorResponse(new Error('Branch ID is required'));
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/branch/${branchId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return createErrorResponse(new Error('Failed to fetch tables by branch'));
        }

        return NextResponse.json(await response.json());

    } catch (error: unknown) {
        console.error('Error fetching tables by branch:', error);
        return createErrorResponse(error as Error);
    }
}

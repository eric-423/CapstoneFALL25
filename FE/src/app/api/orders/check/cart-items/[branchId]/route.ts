import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ branchId: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        const { branchId } = await params;
        const cartItems = await request.json();

        if (!branchId) {
            return NextResponse.json(
                { error: "Missing branchId" },
                { status: 400 }
            );
        }

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token found" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/cart-items/check/cart-item/${branchId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    accept: "*/*",
                },
                cache: "no-store",
                body: JSON.stringify(cartItems),
            }
        );

        const result = await response.json().catch(() => null);
        return NextResponse.json(result ?? {}, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to check cart items",
            },
            { status: 500 }
        );
    }
}


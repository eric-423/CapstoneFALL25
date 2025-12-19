import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ orderId: string }> },
) {
    try {
        const { orderId } = await context.params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token found" },
                { status: 401 },
            );
        }

        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 },
            );
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}/chat-messages`, {
            method: "GET",
            headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const text = await response.text();

        if (!response.ok) {
            let errorData: unknown;

            try {
                errorData = text ? JSON.parse(text) : {};
            } catch {
                errorData = { error: text || "Unknown error" };
            }

            const errorMessage =
                (typeof errorData === "object" &&
                    errorData !== null &&
                    "desc" in errorData &&
                    typeof (errorData as { desc?: string }).desc === "string" &&
                    (errorData as { desc?: string }).desc) ||
                (typeof errorData === "object" &&
                    errorData !== null &&
                    "message" in errorData &&
                    typeof (errorData as { message?: string }).message === "string" &&
                    (errorData as { message?: string }).message) ||
                (typeof errorData === "object" &&
                    errorData !== null &&
                    "error" in errorData &&
                    typeof (errorData as { error?: string }).error === "string" &&
                    (errorData as { error?: string }).error) ||
                "Failed to fetch chat messages";

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: errorData,
                    status: response.status,
                },
                { status: response.status },
            );
        }

        const data = text ? JSON.parse(text) : null;
        return NextResponse.json(data);
    } catch (error) {
        console.error("[Order Chat Messages API] Unexpected error:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch chat messages",
                type: "UnexpectedError",
            },
            { status: 500 },
        );
    }
}


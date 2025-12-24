import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse, CustomError, ErrorCodes } from "@/lib/error-handler";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return createErrorResponse(
                new CustomError("Unauthorized", 401, ErrorCodes.AUTHENTICATION_ERROR)
            );
        }

        const { pathname } = request.nextUrl;
        const segments = pathname.split("/");
        const promotionCode = segments[segments.length - 1];

        if (!promotionCode) {
            return createErrorResponse(
                new CustomError(
                    "Thiếu promotionCode",
                    400,
                    ErrorCodes.VALIDATION_ERROR
                )
            );
        }

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/promotions/${encodeURIComponent(promotionCode)}`;

        const backendRes = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!backendRes.ok) {
            const errorBody = await backendRes.json().catch(() => ({}));
            const message =
                errorBody?.message ||
                errorBody?.error ||
                errorBody?.desc ||
                "Không thể lấy thông tin khuyến mãi";

            return createErrorResponse(
                new CustomError(message, backendRes.status, ErrorCodes.INTERNAL_ERROR)
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (error) {
        return createErrorResponse(error as Error);
    }
}


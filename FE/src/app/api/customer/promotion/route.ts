import { NextResponse } from "next/server";
import { PromotionsResponse } from "@/apis/promotion.api";
import { cookies } from "next/headers";
import { createErrorResponse } from "@/lib/error-handler";

export async function GET(): Promise<NextResponse<PromotionsResponse | { error: string; code: string }>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/promotions/customer/my-promotions`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to fetch customer promotions')) as NextResponse<{ error: string; code: string }>;
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error fetching customer promotions:", error);
    return createErrorResponse(error as Error) as NextResponse<{ error: string; code: string }>;
  }
}

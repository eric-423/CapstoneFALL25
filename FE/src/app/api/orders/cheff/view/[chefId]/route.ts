import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import JwtDecode from "@/utils/jwtDecode";
import { createErrorResponse, CustomError, ErrorCodes } from "@/lib/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chefId: string }> }
) {
  try {
    const { chefId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return createErrorResponse(
        new CustomError("Unauthorized - No token found", 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const decodedToken = JwtDecode(token);
    if (!decodedToken) {
      return createErrorResponse(
        new CustomError("Unauthorized - Invalid token", 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let url = `${process.env.NEXT_PUBLIC_BASE_URL}/orders/cheff/view/${chefId}`;

    if (status && status.trim() !== "" && status !== "ALL") {
      const params = new URLSearchParams();
      params.append("status", status);
      url = `${url}?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = {
          error: errorText || "Unknown error",
          status: response.status,
        };
      }

      return createErrorResponse(
        new CustomError(
          errorData.error || errorData.message || "Failed to fetch chef orders",
          response.status
        )
      );
    }

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : { data: [] };
    } catch (parseError) {
      console.error("❌ Failed to parse JSON:", parseError);
      return createErrorResponse(
        new CustomError("Invalid JSON response from server", 500, ErrorCodes.INTERNAL_ERROR)
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get Chef Orders API Error:", error);
    return createErrorResponse(error as Error);
  }
}

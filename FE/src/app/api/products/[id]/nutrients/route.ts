import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse, CustomError, ErrorCodes } from "@/lib/error-handler";

type RouteContext = {
  params: Promise<{ id?: string | string[] }>;
};

const resolveProductId = async (context: RouteContext) => {
  const resolvedParams = await context.params;
  const rawId = resolvedParams?.id;
  return Array.isArray(rawId) ? rawId[0] : rawId;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const id = await resolveProductId(context);

    if (!id) {
      return createErrorResponse(
        new CustomError("Product ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}/nutrients`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const errorBody = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
      const message =
        typeof errorBody === "string"
          ? errorBody
          : errorBody?.message || "Failed to fetch product nutrients";
      console.error("Product Nutrients API Error:", response.status, message);
      return createErrorResponse(
        new CustomError(message, response.status, ErrorCodes.NETWORK_ERROR)
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product Nutrients API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch product nutrients";
    return createErrorResponse(
      new CustomError(message, 500, ErrorCodes.INTERNAL_ERROR)
    );
  }
}


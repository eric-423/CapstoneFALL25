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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return createErrorResponse(
        new CustomError("Unauthorized", 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const productId = await resolveProductId(context);
    if (!productId) {
      return createErrorResponse(
        new CustomError("Product ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}/paired`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || "Failed to get paired products" };
      }

      return createErrorResponse(
        new CustomError(
          errorData.error || errorData.message || "Failed to get paired products",
          response.status,
          ErrorCodes.NETWORK_ERROR
        )
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting paired products:", error);
    const message = error instanceof Error ? error.message : "Failed to get paired products";
    return createErrorResponse(new CustomError(message, 500, ErrorCodes.INTERNAL_ERROR));
  }
}



export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return createErrorResponse(
        new CustomError("Unauthorized", 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    const productId = await resolveProductId(context);
    if (!productId) {
      return createErrorResponse(
        new CustomError("Product ID is required", 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const body = await request.json();

    // Validate body is an array of product IDs
    if (!Array.isArray(body)) {
      return createErrorResponse(
        new CustomError("Body must be an array of product IDs", 400, ErrorCodes.VALIDATION_ERROR)
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}/paired`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || "Failed to update paired products" };
      }

      return createErrorResponse(
        new CustomError(
          errorData.error || errorData.message || "Failed to update paired products",
          response.status,
          ErrorCodes.NETWORK_ERROR
        )
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating paired products:", error);
    const message = error instanceof Error ? error.message : "Failed to update paired products";
    return createErrorResponse(new CustomError(message, 500, ErrorCodes.INTERNAL_ERROR));
  }
}


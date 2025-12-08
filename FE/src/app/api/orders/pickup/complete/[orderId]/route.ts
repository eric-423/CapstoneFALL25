import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type CompletePickupRouteContext = {
  params: Promise<{ orderId?: string | string[] }>;
};

export async function PUT(
  request: NextRequest,
  context: CompletePickupRouteContext
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const rawOrderId = resolvedParams?.orderId;
    const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const url = `${API_BASE_URL}/orders/staff/pickup/completed/${orderId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorBody: unknown = null;
      try {
        errorBody = responseText ? JSON.parse(responseText) : null;
      } catch {
        errorBody = {
          error: responseText || "Failed to complete pickup order",
        };
      }

      return NextResponse.json(
        {
          error: "Failed to complete pickup order",
          details: errorBody,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Complete Pickup Order API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to complete pickup order", type: "UnexpectedError" },
      { status: 500 }
    );
  }
}

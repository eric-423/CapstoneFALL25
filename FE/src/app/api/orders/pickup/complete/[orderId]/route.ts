import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


type CompletePickupRouteContext = {
  params: Promise<{ orderId?: string | string[] }>;
};

export async function PUT(
  request: NextRequest,
  context: CompletePickupRouteContext
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const rawOrderId = resolvedParams?.orderId;
    const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }


    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/staff/pickup/comleted/${orderId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

      console.error("[Complete Pickup Order API] Backend error:", {
        status: response.status,
        statusText: response.statusText,
        errorBody,
      });

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
      {
        error: "Failed to complete pickup order",
        type: "UnexpectedError",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

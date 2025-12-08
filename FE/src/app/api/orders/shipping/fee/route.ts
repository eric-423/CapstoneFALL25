import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerAddress = searchParams.get("customerAddress");
    const branchAddress = searchParams.get("branchAddress");

    if (!customerAddress || !branchAddress) {
      return NextResponse.json(
        { error: "Missing customerAddress or branchAddress" },
        { status: 400 }
      );
    }

    const upstreamUrl = `${BASE_URL}/orders/shipping/fee?${new URLSearchParams({
      customerAddress,
      branchAddress,
    }).toString()}`;

    const response = await fetch(upstreamUrl, {
      method: "GET",
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
        errorBody = { error: responseText || "Failed to fetch shipping fee" };
      }

      return NextResponse.json(
        {
          error: "Failed to fetch shipping fee",
          details: errorBody,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Shipping Fee API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping fee", type: "UnexpectedError" },
      { status: 500 }
    );
  }
}

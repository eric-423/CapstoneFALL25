import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tam-tac.com/api/v1";

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const promotionCode = searchParams.get("promotionCode");
    const status = searchParams.get("status");

    if (!promotionCode || status === null) {
      return NextResponse.json(
        { message: "promotionCode và status là bắt buộc" },
        { status: 400 }
      );
    }

    const backendUrl = `${BACKEND_BASE_URL}/api/promotions/${promotionCode}/status?status=${status}`;

    const authorization = req.headers.get("authorization");

    const res = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        accept: "*/*",
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error changing promotion status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

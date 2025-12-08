import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tam-tac.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const size = searchParams.get("size") || "100";
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");

    const queryParams = new URLSearchParams();
    queryParams.set("page", page);
    queryParams.set("size", size);
    if (sortBy) queryParams.set("sortBy", sortBy);
    if (sortDirection) queryParams.set("sortDirection", sortDirection);

    const response = await fetch(
      `${API_BASE_URL}/promotions/all?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get All Promotions API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch promotions",
      },
      { status: 500 }
    );
  }
}

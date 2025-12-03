import { NextRequest, NextResponse } from "next/server";
import http from "@/utils/http";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { jwtDecode } = await import("jwt-decode");
    const decodedToken = jwtDecode<{ i?: number }>(token);
    const userId = decodedToken.i;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const response = await http.get(`/customers/${userId}/base-info`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = response.data;
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      "status" in responseData
    ) {
      return NextResponse.json(responseData);
    } else {
      return NextResponse.json({
        status: 200,
        desc: "Success",
        data: responseData,
      });
    }
  } catch (error) {
    console.error("Customer details API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}

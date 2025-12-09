import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("access_token")?.value || cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const response = await fetch(
      `${API_URL}/transactions${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

      return NextResponse.json(
        {
          error:
            errorData.error ||
            errorData.message ||
            "Failed to fetch transactions",
          details: errorData,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid JSON response from server", error);
      return NextResponse.json(
        {
          error: "Invalid JSON response from server",
          type: "UnexpectedError",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Transactions GET error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch transactions",
        type: "UnexpectedError",
      },
      { status: 500 }
    );
  }
}

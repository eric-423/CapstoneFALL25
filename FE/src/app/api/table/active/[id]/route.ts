import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiBaseURL } from "@/utils/configs/environment";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Table ID is required" },
        { status: 400 }
      );
    }

    const baseURL = apiBaseURL;
    const fullUrl = `${baseURL}/table/active/${id}`;

    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to activate table" }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json().catch(() => ({ success: true }));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Activate Table API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to activate table",
      },
      { status: 500 }
    );
  }
}

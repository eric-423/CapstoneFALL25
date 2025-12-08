import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId } = await params;
    const body = await request.json();
    const url = `${API_BASE_URL}/material-nutrients/${materialId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Backend error:", errorBody);
      return NextResponse.json(
        { error: errorBody || "Failed to update material nutrients" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating material nutrients:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

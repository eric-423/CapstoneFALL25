import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from "@/lib/error-handler";

export async function PUT(
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

    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error updating table:", error);
    return createErrorResponse(error as Error);
  }
}

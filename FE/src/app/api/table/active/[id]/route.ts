import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from "@/lib/error-handler";

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

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/active/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to activate table'));
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error activating table:", error);
    return createErrorResponse(error as Error);
  }
}

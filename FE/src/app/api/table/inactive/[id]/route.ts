import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from "@/lib/error-handler";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return createErrorResponse(new Error('Unauthorized'));
    }

    const { id } = await params;

    if (!id) {
      return createErrorResponse(new Error('Table ID is required'));
    }


    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/table/inactive/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to deactivate table'));
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

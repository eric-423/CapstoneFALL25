import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from '@/lib/error-handler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string; nutrientId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId, nutrientId } = await params;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/material-nutrients/${materialId}/${nutrientId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to delete material nutrient'));
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting material nutrient:", error);
    return createErrorResponse(error as Error);
  }
}

// GET /api/material-nutrients/{materialId}/{nutrientId}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string; nutrientId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { materialId, nutrientId } = await params;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/material-nutrients/${materialId}/${nutrientId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to fetch material nutrient'));
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching material nutrient:", error);
    return createErrorResponse(error as Error);
  }
}

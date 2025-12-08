import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from '@/lib/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/lessons/me/lessons/${lessonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to fetch lesson detail'));
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Error fetching lesson detail:", error);
    return createErrorResponse(error as Error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tam-tac.com/api";

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

    const backendUrl = `${API_URL}/user-trainings/me/lessons/${lessonId}/documents`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        payload ?? { error: "Failed to fetch lesson documents" },
        { status: response.status }
      );
    }

    return NextResponse.json(payload ?? {});
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch lesson documents",
      },
      { status: 500 }
    );
  }
}

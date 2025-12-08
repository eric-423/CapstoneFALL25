import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://tam-tac.com/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userTrainingId: string; lessonId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userTrainingId, lessonId } = await params;

    const response = await fetch(
      `${API_URL}/user-trainings/me/user-trainings/${userTrainingId}/lessons/${lessonId}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(payload ?? { error: "Failed to start lesson" }, {
        status: response.status,
      });
    }

    return NextResponse.json(payload ?? {});
  } catch (error) {
    console.error("Start Lesson API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to start lesson",
      },
      { status: 500 }
    );
  }
}

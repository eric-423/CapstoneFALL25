import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tam-tac.com/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainingId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { trainingId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const backendUrl = `${API_URL}/lessons/me/trainings/${trainingId}/lessons${queryString ? `?${queryString}` : ""}`;
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
        payload ?? { error: "Failed to fetch my training lessons" },
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
            : "Failed to fetch my training lessons",
      },
      { status: 500 }
    );
  }
}

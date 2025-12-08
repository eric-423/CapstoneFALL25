import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from '@/lib/error-handler';

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

    const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/lessons/me/trainings/${trainingId}/lessons${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return createErrorResponse(new Error('Failed to fetch my training lessons'));
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error fetching my training lessons:', error);
    return createErrorResponse(error as Error);
  }
}

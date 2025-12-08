import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(
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
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/user-trainings/admin/trainings/${id}/assign-users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        payload ?? { error: "Failed to assign user to training" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      payload ?? {
        status: 0,
        desc: "User assigned to training successfully",
        data: null,
      }
    );
  } catch (error) {
    console.error("Assign User To Training API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to assign user to training",
      },
      { status: 500 }
    );
  }
}

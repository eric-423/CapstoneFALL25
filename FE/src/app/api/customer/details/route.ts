import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Bạn Chưa Đăng Nhập" }, { status: 401 });
    }
    const { jwtDecode } = await import("jwt-decode");
    const decodedToken = jwtDecode<{ i?: number }>(token);
    const userId = decodedToken.i;

    if (!userId) {
      return NextResponse.json({ error: "Token Không Hợp Lệ" }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/base-info`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ error: errorBody || 'Lỗi Không Xác Định' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

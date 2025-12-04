import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import http from "@/utils/http";

interface DecodedToken {
  r?: string;
  i?: number;
  p?: string;
  m?: string;
  n?: string;
  name?: string;
  fn?: string;
  isNewUser?: boolean;
  exp?: number;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }

      const userId = decodedToken.i;
      if (!decodedToken || !userId) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      let fullName = "";
      if (decodedToken.fullName) {
      } else if (decodedToken.name) {
        fullName = decodedToken.name;
      } else if (decodedToken.n) {
        fullName = decodedToken.n;
      } else if (decodedToken.fn) {
        fullName = decodedToken.fn;
      }
      if (!fullName && decodedToken.r === "CUSTOMER") {
        try {
          const customerResponse = await http.get(
            `/customers/${userId}/base-info`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const customerData =
            customerResponse.data?.data || customerResponse.data;
          if (customerData) {
            fullName = customerData.name || customerData.fullName || "";
          }
        } catch (customerError) {
          console.log("Failed to fetch customer details:", customerError);
        }
      }

      return NextResponse.json({
        id: userId,
        phoneNumber: decodedToken.p ?? "",
        fullName: fullName,
        role: decodedToken.r ?? "CUSTOMER",
        isNewUser: decodedToken.isNewUser ?? false,
        exp: decodedToken.exp,
      });
    } catch (decodeError) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}

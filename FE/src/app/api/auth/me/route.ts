import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { createErrorResponse, CustomError, ErrorCodes } from '@/lib/error-handler';

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

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return createErrorResponse(
        new CustomError('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return createErrorResponse(
          new CustomError('Token expired', 401, ErrorCodes.AUTHENTICATION_ERROR)
        );
      }

      const userId = decodedToken.i;
      if (!decodedToken || !userId) {
        return createErrorResponse(
          new CustomError('Invalid token', 401, ErrorCodes.AUTHENTICATION_ERROR)
        );
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
          const customerResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${userId}/base-info`,
            {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            const data = customerData?.data || customerData;
            if (data) {
              fullName = data.name || data.fullName || "";
            }
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
      return createErrorResponse(
        new CustomError('Invalid token format', 401, ErrorCodes.AUTHENTICATION_ERROR)
      );
    }
  } catch (error) {
    return createErrorResponse(error as Error);
  }
}

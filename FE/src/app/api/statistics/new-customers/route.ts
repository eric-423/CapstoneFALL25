import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        let accessToken = request.cookies.get('token')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized - No token found' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const comparisonType = searchParams.get('comparisonType') || 'DAILY';

        const params = new URLSearchParams();
        params.append('comparisonType', comparisonType);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/statistics/new-customers?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Failed to fetch new customers statistics' };
            }

            return NextResponse.json(
                errorData,
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch new customers statistics' },
            { status: 500 }
        );

    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("New Customers Statistics API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch new customers statistics",
      },
      { status: 500 }
    );
  }
}

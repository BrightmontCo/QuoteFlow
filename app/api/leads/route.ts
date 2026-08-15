import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}` +
      `/rest/v1/leads?select=*`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

        Authorization:
          `Bearer ${
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
          }`,
      },

      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );

  }
}

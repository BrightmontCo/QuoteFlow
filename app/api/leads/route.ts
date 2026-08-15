import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?select=*`;

    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        error: "SUPABASE URL is missing",
      });
    }

    if (!key) {
      return NextResponse.json({
        error: "SUPABASE ANON KEY is missing",
      });
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();

    return NextResponse.json({
      status: response.status,
      success: response.ok,
      supabaseResponse: text,
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    });
  }
}

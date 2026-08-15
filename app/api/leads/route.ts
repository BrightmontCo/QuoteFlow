import { NextResponse } from "next/server";

export async function GET() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/leads?select=*`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      Authorization: `Bearer ${
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      }`,
    },
    cache: "no-store",
  });

  const data = await response.json();

  return NextResponse.json({
    success: response.ok,
    data,
  });
}

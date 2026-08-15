import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { success: false, error: "Supabase variables are missing" },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    let supabaseUrl =
      `${SUPABASE_URL}/rest/v1/leads?select=*`;

    if (id) {
      supabaseUrl += `&id=eq.${encodeURIComponent(id)}`;
    }

    const response = await fetch(supabaseUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      data: response.ok ? data : [],
      error: response.ok ? null : data?.message,
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

export async function PATCH(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { success: false, error: "Supabase variables are missing" },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Customer ID is missing" },
        { status: 400 }
      );
    }

    const update = {
      status: body.status || "New",
      "quote amount":
        body.quoteAmount === ""
          ? null
          : body.quoteAmount == null
          ? null
          : Number(body.quoteAmount),
      "appointment date":
        body.appointmentDate || null,
      notes: body.notes || null,
    };

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?id=eq.${encodeURIComponent(
        body.id
      )}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(update),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      data,
      error: response.ok ? null : data?.message,
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

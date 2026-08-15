import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY || "",
          Authorization: `Bearer ${SUPABASE_KEY || ""}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { id, status, quoteAmount, appointmentDate, notes } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead ID is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?ID=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY || "",
          Authorization: `Bearer ${SUPABASE_KEY || ""}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          Status: status,
          "Quote Amount": quoteAmount
            ? Number(quoteAmount)
            : null,
          "Appointment Date": appointmentDate || null,
          Notes: notes || null,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
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

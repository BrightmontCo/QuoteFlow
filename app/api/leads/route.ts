import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let url = `${SUPABASE_URL}/rest/v1/leads?select=*`;

    if (id) {
      url += `&id=eq.${encodeURIComponent(id)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || "Unable to load leads.",
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

export async function PATCH(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer ID is missing.",
        },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    if (body.quoteAmount !== undefined) {
      updateData["quote amount"] =
        body.quoteAmount === ""
          ? null
          : Number(body.quoteAmount);
    }

    if (body.appointmentDate !== undefined) {
      updateData["appointment date"] =
        body.appointmentDate === ""
          ? null
          : body.appointmentDate;
    }

    if (body.notes !== undefined) {
      updateData.notes =
        body.notes === ""
          ? null
          : body.notes;
    }

    const url =
      `${SUPABASE_URL}/rest/v1/leads` +
      `?id=eq.${encodeURIComponent(body.id)}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updateData),
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data?.message ||
            data?.error ||
            "Supabase could not update the customer.",
          supabaseResponse: data,
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

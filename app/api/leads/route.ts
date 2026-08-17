import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase-server";

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function clean(value: unknown) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function GET(request: Request) {
  try {
    const db = getSupabaseAdmin();
    const id = new URL(request.url).searchParams.get("id");
    let query = db.from("leads").select("*").order("created_at", { ascending: false });
    if (id) query = query.eq("id", id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage(error, "Failed to load leads") }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getSupabaseAdmin();
    const body = await request.json();
    const name = clean(body.name);

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      name,
      phone: clean(body.phone),
      email: clean(body.email),
      address: clean(body.address),
      service: clean(body.service),
      problem: clean(body.problem),
      status: clean(body.status) || "New",
      notes: clean(body.notes),
      "quote amount": body["quote amount"] ?? body.quoteAmount ?? null,
      "appointment date": body["appointment date"] ?? body.appointmentDate ?? null,
    };

    const amount = payload["quote amount"];
    if (amount !== null && amount !== undefined && amount !== "") {
      const number = Number(amount);
      if (!Number.isFinite(number)) {
        return NextResponse.json({ success: false, error: "Quote amount must be a number" }, { status: 400 });
      }
      payload["quote amount"] = number;
    } else {
      payload["quote amount"] = null;
    }

    const { data, error } = await db.from("leads").insert(payload).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: [data] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage(error, "Failed to create lead") }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getSupabaseAdmin();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });

    const update: Record<string, unknown> = {};
    for (const field of ["name", "phone", "email", "address", "service", "problem", "status", "notes"]) {
      if (body[field] !== undefined) update[field] = field === "name" ? clean(body[field]) : clean(body[field]);
    }

    if (body.quoteAmount !== undefined || body["quote amount"] !== undefined) {
      const value = body.quoteAmount ?? body["quote amount"];
      if (value === "" || value === null || value === undefined) update["quote amount"] = null;
      else {
        const number = Number(value);
        if (!Number.isFinite(number)) return NextResponse.json({ success: false, error: "Quote amount must be a number" }, { status: 400 });
        update["quote amount"] = number;
      }
    }

    if (body.appointmentDate !== undefined || body["appointment date"] !== undefined) {
      update["appointment date"] = body.appointmentDate ?? body["appointment date"] ?? null;
    }

    if (!Object.keys(update).length) return NextResponse.json({ success: false, error: "No changes supplied" }, { status: 400 });

    const { data, error } = await db.from("leads").update(update).eq("id", body.id).select();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    if (!data?.length) return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage(error, "Failed to update lead") }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = getSupabaseAdmin();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });

    const { error } = await db.from("leads").delete().eq("id", id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: errorMessage(error, "Failed to delete lead") }, { status: 500 });
  }
}

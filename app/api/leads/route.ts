import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing");
  return createClient(url, key);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    const id = new URL(request.url).searchParams.get("id");
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (id) query = query.eq("id", id);
    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to load leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const payload = {
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      service: body.service || null,
      problem: body.problem || null,
      status: body.status || "New",
      "quote amount": body["quote amount"] ?? body.quoteAmount ?? null,
      "appointment date": body["appointment date"] ?? body.appointmentDate ?? null,
      notes: body.notes || null,
    };
    if (!payload.name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    const { data, error } = await supabase.from("leads").insert(payload).select().single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: [data] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to create lead" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, error: "Lead ID is required" }, { status: 400 });
    const updates: Record<string, unknown> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.quoteAmount !== undefined) updates["quote amount"] = body.quoteAmount === "" ? null : Number(body.quoteAmount);
    if (body.appointmentDate !== undefined) updates["appointment date"] = body.appointmentDate || null;
    if (body.notes !== undefined) updates.notes = body.notes || null;
    const { data, error } = await supabase.from("leads").update(updates).eq("id", body.id).select();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update lead" }, { status: 500 });
  }
}

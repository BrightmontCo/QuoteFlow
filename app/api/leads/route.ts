import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase-server";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status });
const text = (value: unknown) => typeof value === "string" ? (value.trim() || null) : value == null ? null : String(value);
const amount = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : NaN;
};

export async function GET(request: Request) {
  try {
    const db = getSupabaseAdmin();
    const id = new URL(request.url).searchParams.get("id");
    let query = db.from("leads").select("*").order("created_at", { ascending: false });
    if (id) query = query.eq("id", id);
    const { data, error } = await query;
    if (error) return json({ success: false, error: error.message }, 500);
    return json({ success: true, data: data ?? [] });
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : "Database connection failed" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = text(body.name);
    if (!name) return json({ success: false, error: "Customer name is required." }, 400);
    const quote = amount(body.quoteAmount ?? body["quote amount"]);
    if (Number.isNaN(quote)) return json({ success: false, error: "Quote amount must be a valid number." }, 400);
    const payload = {
      name,
      phone: text(body.phone),
      email: text(body.email),
      address: text(body.address),
      service: text(body.service),
      problem: text(body.problem),
      status: text(body.status) || "New",
      notes: text(body.notes),
      "quote amount": quote,
      "appointment date": text(body.appointmentDate ?? body["appointment date"]),
    };
    const { data, error } = await getSupabaseAdmin().from("leads").insert(payload).select().single();
    if (error) return json({ success: false, error: error.message }, 500);
    return json({ success: true, data: [data] }, 201);
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : "Unable to create lead." }, 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return json({ success: false, error: "Lead ID is required." }, 400);
    const update: Record<string, unknown> = {};
    for (const field of ["name", "phone", "email", "address", "service", "problem", "status", "notes"]) {
      if (body[field] !== undefined) update[field] = text(body[field]);
    }
    if (body.quoteAmount !== undefined || body["quote amount"] !== undefined) {
      const quote = amount(body.quoteAmount ?? body["quote amount"]);
      if (Number.isNaN(quote)) return json({ success: false, error: "Quote amount must be a valid number." }, 400);
      update["quote amount"] = quote;
    }
    if (body.appointmentDate !== undefined || body["appointment date"] !== undefined) {
      update["appointment date"] = text(body.appointmentDate ?? body["appointment date"]);
    }
    if (!Object.keys(update).length) return json({ success: false, error: "No changes were supplied." }, 400);
    const { data, error } = await getSupabaseAdmin().from("leads").update(update).eq("id", body.id).select();
    if (error) return json({ success: false, error: error.message }, 500);
    if (!data?.length) return json({ success: false, error: "Lead not found." }, 404);
    return json({ success: true, data });
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : "Unable to update lead." }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return json({ success: false, error: "Lead ID is required." }, 400);
    const { error } = await getSupabaseAdmin().from("leads").delete().eq("id", id);
    if (error) return json({ success: false, error: error.message }, 500);
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : "Unable to delete lead." }, 500);
  }
}

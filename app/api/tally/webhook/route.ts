import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing");
  return createClient(url, key);
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : value ?? null;
}

function fieldValue(fields: any[], names: string[]) {
  const wanted = names.map((n) => n.toLowerCase().trim());
  const field = fields.find((f) => {
    const label = String(f.label ?? f.name ?? f.key ?? "").toLowerCase().trim();
    return wanted.includes(label);
  });
  if (!field) return null;
  if (field.value !== undefined) return field.value;
  if (field.answer !== undefined) return field.answer;
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data ?? body;
    const fields = Array.isArray(data?.fields) ? data.fields : [];

    const name = clean(fieldValue(fields, ["Full name", "Name", "Customer name"]));
    const phone = clean(fieldValue(fields, ["Phone", "Phone number"]));
    const email = clean(fieldValue(fields, ["Email", "Email address"]));
    const address = clean(fieldValue(fields, ["Address", "Service address"]));
    const service = clean(fieldValue(fields, ["Service", "Service needed"]));
    const problem = clean(fieldValue(fields, ["Problem", "Describe your problem", "Issue"]));

    if (!name) {
      return NextResponse.json({ success: false, error: "Tally webhook received no customer name" }, { status: 400 });
    }

    const client = supabase();
    const { data: existing } = await client
      .from("leads")
      .select("id")
      .eq("email", email)
      .limit(1);

    const payload = {
      name,
      phone,
      email,
      address,
      service,
      problem,
      status: "New",
      notes: "Created from Tally quote request",
    };

    if (existing?.[0]?.id) {
      const { error } = await client.from("leads").update(payload).eq("id", existing[0].id);
      if (error) throw error;
      return NextResponse.json({ success: true, action: "updated", id: existing[0].id });
    }

    const { data: created, error } = await client.from("leads").insert(payload).select("id").single();
    if (error) throw error;

    return NextResponse.json({ success: true, action: "created", id: created.id });
  } catch (error) {
    console.error("Tally webhook error", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Webhook failed" }, { status: 500 });
  }
}

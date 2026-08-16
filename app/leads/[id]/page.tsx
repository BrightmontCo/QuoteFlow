"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  service: string | null;
  problem: string | null;
  status: string | null;
  "quote amount": number | null;
  "appointment date": string | null;
  notes: string | null;
};

type Meta = { appointmentTime?: string; followUpStage?: number; followUpStartedAt?: string; lastContactedAt?: string };

function parseNotes(value: string | null) {
  if (!value) return { text: "", meta: {} as Meta };
  const match = value.match(/^\[QuoteFlow Meta\] (\{.*\})\n?([\s\S]*)$/);
  if (!match) return { text: value, meta: {} as Meta };
  try { return { text: match[2] || "", meta: JSON.parse(match[1]) as Meta }; } catch { return { text: value, meta: {} as Meta }; }
}

function buildNotes(text: string, meta: Meta) {
  return `[QuoteFlow Meta] ${JSON.stringify(meta)}\n${text}`;
}

function followUpInfo(status: string, meta: Meta) {
  if (status.toLowerCase() !== "quoted") return null;
  if (!meta.followUpStartedAt) return { stage: 0, label: "Start follow-up", due: "Now" };
  const start = new Date(meta.followUpStartedAt);
  const days = Math.floor((Date.now() - start.getTime()) / 86400000);
  if (meta.followUpStage && meta.followUpStage >= 2) return { stage: 2, label: "Final follow-up", due: "Day 5+" };
  if (days >= 5) return { stage: 2, label: "Final follow-up due", due: "Today" };
  if (days >= 2) return { stage: 1, label: "First follow-up due", due: "Today" };
  return { stage: 0, label: "First follow-up", due: `In ${Math.max(1, 2 - days)} day(s)` };
}

export default function CustomerPage() {
  const params = useParams();
  const id = String(params.id);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("New");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [meta, setMeta] = useState<Meta>({});

  async function loadCustomer() {
    try {
      const response = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { cache: "no-store" });
      const result = await response.json();
      if (result.success && result.data?.length) {
        const customer = result.data[0] as Lead;
        const parsed = parseNotes(customer.notes);
        setLead(customer); setStatus(customer.status || "New");
        setQuoteAmount(customer["quote amount"] == null ? "" : String(customer["quote amount"]));
        setAppointmentDate(customer["appointment date"] || "");
        setAppointmentTime(parsed.meta.appointmentTime || ""); setNotes(parsed.text); setMeta(parsed.meta);
      }
    } catch (error) { console.error("Customer loading error:", error); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadCustomer(); }, [id]);

  async function saveChanges(nextMeta = meta) {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status, quoteAmount, appointmentDate, notes: buildNotes(notes, { ...nextMeta, appointmentTime }) }) });
      const result = await response.json();
      if (!response.ok || !result.success) { setMessage(result.error || "Unable to save changes."); return; }
      setMessage("Changes saved successfully!"); await loadCustomer();
    } catch { setMessage("Unable to save changes."); } finally { setSaving(false); }
  }

  function startFollowUp() {
    const next = { ...meta, followUpStage: 0, followUpStartedAt: new Date().toISOString() };
    setMeta(next); saveChanges(next);
  }

  function markFollowUpSent() {
    const current = followUpInfo(status, meta);
    const next = { ...meta, followUpStage: Math.min(2, (current?.stage || 0) + 1), lastContactedAt: new Date().toISOString() };
    setMeta(next); saveChanges(next);
  }

  if (loading) return <main style={styles.page}><div style={styles.container}><p style={styles.muted}>Loading customer...</p></div></main>;
  if (!lead) return <main style={styles.page}><div style={styles.container}><a href="/leads" style={styles.back}>← Back to Leads</a><div style={styles.card}><h1>Customer not found</h1><code>{id}</code></div></div></main>;

  const followUp = followUpInfo(status, meta);
  const quote = Number(quoteAmount || 0);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}><a href="/" style={styles.navLink}>Dashboard</a><a href="/leads" style={styles.navLink}>Leads</a><a href="/quotes" style={styles.navLink}>Quotes</a><a href="/appointments" style={styles.navLink}>Appointments</a></nav>
        <a href="/leads" style={styles.back}>← Back to Leads</a>
        <div style={styles.header}><div><h1 style={styles.title}>{lead.name}</h1><p style={styles.subtitle}>{lead.service || "HVAC Service"} {quote ? `• $${quote.toFixed(2)}` : ""}</p></div><span style={styles.status}>{status}</span></div>

        <div style={styles.grid}>
          <section style={styles.card}><h2 style={styles.cardTitle}>Customer Information</h2><Info label="Full Name" value={lead.name}/><Info label="Phone" value={lead.phone || "—"}/><Info label="Email" value={lead.email || "—"}/><Info label="Address" value={lead.address || "—"}/></section>
          <section style={styles.card}><h2 style={styles.cardTitle}>Service Request</h2><Info label="Service" value={lead.service || "—"}/><div style={styles.label}>Problem</div><div style={styles.problem}>{lead.problem || "No problem description"}</div></section>
          <section style={styles.card}><h2 style={styles.cardTitle}>Quote & Status</h2><label style={styles.label}>Status</label><select value={status} onChange={e => setStatus(e.target.value)} style={styles.input}><option>New</option><option>Contacted</option><option>Quoted</option><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select><label style={styles.label}>Quote Amount</label><input type="number" min="0" step="0.01" value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)} style={styles.input}/></section>
          <section style={styles.card}><h2 style={styles.cardTitle}>Appointment</h2><label style={styles.label}>Date</label><input type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} style={styles.input}/><label style={styles.label}>Time</label><input type="time" value={appointmentTime} onChange={e => setAppointmentTime(e.target.value)} style={styles.input}/>{appointmentDate && appointmentTime && <div style={styles.confirm}>📅 {appointmentDate} at {appointmentTime}</div>}</section>
        </div>

        <section style={styles.card}><div style={styles.cardHeader}><div><h2 style={styles.cardTitle}>Follow-ups</h2><p style={styles.muted}>Keep quoted customers from slipping through the cracks.</p></div>{followUp && <span style={styles.due}>{followUp.due}</span>}</div>{status.toLowerCase() !== "quoted" ? <p style={styles.muted}>Set the status to <strong>Quoted</strong> to start a follow-up sequence.</p> : !meta.followUpStartedAt ? <div><p style={styles.message}>No follow-up sequence started.</p><button onClick={startFollowUp} style={styles.button}>Start 2-day follow-up</button></div> : <div style={styles.followRow}><div><strong>{followUp?.label}</strong><p style={styles.muted}>Suggested message: “Hi {lead.name.split(" ")[0]}, just checking in about your HVAC quote. Let us know if you'd like to schedule.”</p>{meta.lastContactedAt && <small style={styles.muted}>Last marked contacted: {new Date(meta.lastContactedAt).toLocaleString()}</small>}</div>{followUp && followUp.stage < 2 && <button onClick={markFollowUpSent} style={styles.button}>Mark Follow-up Sent</button>}</div>}</section>

        <section style={styles.card}><h2 style={styles.cardTitle}>Notes</h2><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this customer..." style={styles.textarea}/></section>
        <div style={styles.saveArea}>{message && <div style={message.includes("successfully") ? styles.success : styles.error}>{message}</div>}<button onClick={() => saveChanges()} disabled={saving} style={styles.button}>{saving ? "Saving..." : "Save Changes"}</button></div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div style={styles.info}><div style={styles.label}>{label}</div><div>{value}</div></div>; }

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", paddingBottom: "60px" },
  container: { maxWidth: "1120px", margin: "0 auto", padding: "0 28px" },
  nav: { height: "70px", display: "flex", alignItems: "center", justifyContent: "center", gap: "28px", borderBottom: "1px solid #e2e8f0", marginBottom: "30px" },
  navLink: { color: "#475569", textDecoration: "none", fontSize: "13px", fontWeight: 400 },
  back: { display: "inline-block", color: "#475569", textDecoration: "none", fontSize: "13px", marginBottom: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "32px", letterSpacing: "-1px" },
  subtitle: { margin: "7px 0 0", color: "#64748b", fontSize: "14px" },
  status: { background: "#eef2ff", color: "#4338ca", padding: "8px 13px", borderRadius: "999px", fontSize: "12px", fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "18px" },
  card: { background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "22px", marginBottom: "18px", boxShadow: "0 1px 2px rgba(15,23,42,.03)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "20px" },
  cardTitle: { margin: "0 0 18px", fontSize: "16px" },
  info: { marginBottom: "16px", fontSize: "14px" },
  label: { display: "block", color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "7px" },
  muted: { color: "#64748b", fontSize: "12px", lineHeight: 1.6 },
  problem: { background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "13px", minHeight: "45px" },
  input: { width: "100%", boxSizing: "border-box" as const, padding: "11px", border: "1px solid #cbd5e1", borderRadius: "8px", marginBottom: "16px", background: "white", color: "#0f172a" },
  textarea: { width: "100%", boxSizing: "border-box" as const, minHeight: "130px", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "12px", resize: "vertical" as const, fontFamily: "inherit" },
  confirm: { background: "#ecfdf5", color: "#047857", padding: "10px", borderRadius: "8px", fontSize: "12px" },
  due: { background: "#fff7ed", color: "#c2410c", padding: "7px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 },
  message: { background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "13px" },
  followRow: { display: "flex", justifyContent: "space-between", gap: "25px", alignItems: "center" },
  button: { background: "#0f172a", color: "white", border: 0, borderRadius: "8px", padding: "11px 16px", fontSize: "12px", fontWeight: 700, cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const },
  saveArea: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px" },
  success: { background: "#dcfce7", color: "#166534", padding: "9px 12px", borderRadius: "8px", fontSize: "12px" },
  error: { background: "#fee2e2", color: "#991b1b", padding: "9px 12px", borderRadius: "8px", fontSize: "12px" },
};

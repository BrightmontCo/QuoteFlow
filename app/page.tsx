"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  problem: string | null;
  status: string | null;
  "quote amount": number | null;
  "appointment date": string | null;
  created_at?: string | null;
};

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const dateValue = (v: string) => new Date(v.includes("T") ? v : `${v}T00:00:00`);

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Could not load leads");
      setLeads(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadLeads(); }, []);

  const data = useMemo(() => {
    const count = (status: string) => leads.filter((l) => (l.status || "new").toLowerCase() === status).length;
    const quoted = leads.filter((l) => Number(l["quote amount"] || 0) > 0);
    const pipeline = quoted.filter((l) => !["completed", "cancelled"].includes((l.status || "new").toLowerCase())).reduce((sum, l) => sum + Number(l["quote amount"] || 0), 0);
    const won = leads.filter((l) => (l.status || "").toLowerCase() === "completed").reduce((sum, l) => sum + Number(l["quote amount"] || 0), 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = leads.filter((l) => l["appointment date"] && (l.status || "").toLowerCase() !== "cancelled" && dateValue(l["appointment date"]!) >= today).sort((a, b) => dateValue(a["appointment date"]!).getTime() - dateValue(b["appointment date"]!).getTime()).slice(0, 5);
    const recent = [...leads].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 6);
    return { newLeads: count("new"), contacted: count("contacted"), quoted: count("quoted"), scheduled: count("scheduled"), completed: count("completed"), quotes: quoted.length, pipeline, won, upcoming, recent };
  }, [leads]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.nav}>
          <a href="/" style={styles.logo}><span style={styles.logoMark}>Q</span>QuoteFlow</a>
          <nav style={styles.links}>
            <a href="/" style={styles.active}>Dashboard</a>
            <a href="/leads" style={styles.link}>Leads</a>
            <a href="/quotes" style={styles.link}>Quotes</a>
            <a href="/appointments" style={styles.link}>Appointments</a>
          </nav>
          <a href="/leads/new" style={styles.primary}>+ New Lead</a>
        </header>

        <section style={styles.hero}>
          <div><div style={styles.eyebrow}>HVAC LEAD MANAGEMENT</div><h1 style={styles.title}>Dashboard</h1><p style={styles.subtitle}>Track leads, quotes, appointments, and jobs in one place.</p></div>
          <button onClick={() => void loadLeads()} style={styles.refresh}>↻ Refresh</button>
        </section>

        {error && <div style={styles.error}>{error}<button onClick={() => void loadLeads()} style={styles.retry}>Try again</button></div>}

        <section style={styles.stats}>
          <Stat href="/leads" label="New Leads" value={loading ? "—" : data.newLeads} detail="Ready for follow-up" icon="↗" />
          <Stat href="/quotes" label="Open Quotes" value={loading ? "—" : data.quotes} detail={`${data.quoted} quoted`} icon="$" />
          <Stat href="/appointments" label="Upcoming Jobs" value={loading ? "—" : data.upcoming.length} detail={`${data.scheduled} scheduled total`} icon="✓" />
          <Stat href="/quotes" label="Pipeline Value" value={loading ? "—" : money(data.pipeline)} detail={`${money(data.won)} completed`} icon="◈" />
        </section>

        <section style={styles.grid}>
          <Card title="Recent Leads" subtitle="The latest customer requests." href="/leads" link="View all →">
            {loading ? <Center>Loading leads...</Center> : data.recent.length ? data.recent.map((lead) => <LeadRow key={lead.id} lead={lead} />) : <Empty />}
          </Card>
          <Card title="Upcoming Jobs" subtitle="Your next scheduled appointments." href="/appointments" link="Calendar →">
            {loading ? <Center>Loading appointments...</Center> : data.upcoming.length ? data.upcoming.map((lead) => <AppointmentRow key={lead.id} lead={lead} />) : <Center><div style={styles.emptyIcon}>✓</div><strong>No upcoming jobs</strong><span style={styles.muted}>Scheduled appointments will appear here.</span></Center>}
          </Card>
        </section>

        <section style={styles.grid}>
          <Card title="Sales Pipeline" subtitle="See where your leads stand." href="/leads" link="Manage →">
            <div style={styles.pipelineBox}>
              {[["New", data.newLeads], ["Contacted", data.contacted], ["Quoted", data.quoted], ["Scheduled", data.scheduled], ["Completed", data.completed]].map(([label, count]) => <Pipeline key={String(label)} label={String(label)} count={Number(count)} total={leads.length} />)}
            </div>
          </Card>
          <div style={styles.action}><span style={styles.actionLabel}>QUICK ACTION</span><div style={styles.actionIcon}>+</div><h2 style={styles.actionTitle}>Add a customer</h2><p style={styles.actionText}>Create a lead, add service details, and keep the job moving.</p><a href="/leads/new" style={styles.actionButton}>Create New Lead →</a></div>
        </section>
      </div>
    </main>
  );
}

function Stat({ href, label, value, detail, icon }: { href: string; label: string; value: string | number; detail: string; icon: string }) { return <a href={href} style={styles.stat}><div style={styles.statTop}><span style={styles.statLabel}>{label}</span><span style={styles.statIcon}>{icon}</span></div><div style={styles.statValue}>{value}</div><div style={styles.statDetail}>{detail}</div></a>; }
function Card({ title, subtitle, href, link, children }: { title: string; subtitle: string; href: string; link: string; children: ReactNode }) { return <div style={styles.card}><div style={styles.cardHeader}><div><h2 style={styles.cardTitle}>{title}</h2><p style={styles.cardSubtitle}>{subtitle}</p></div><a href={href} style={styles.view}>{link}</a></div>{children}</div>; }
function LeadRow({ lead }: { lead: Lead }) { return <a href={`/leads/${lead.id}`} style={styles.row}><div style={styles.avatar}>{(lead.name || "?")[0].toUpperCase()}</div><div style={styles.rowMain}><strong>{lead.name || "Unnamed customer"}</strong><span style={styles.muted}>{lead.service || "Service not specified"}</span></div><span style={statusStyle(lead.status)}>{lead.status || "New"}</span><span style={styles.contact}>{lead.phone || lead.email || "No contact"}</span><span>→</span></a>; }
function AppointmentRow({ lead }: { lead: Lead }) { const d = dateValue(lead["appointment date"]!); return <a href={`/leads/${lead.id}`} style={styles.appointment}><div style={styles.dateBox}><strong>{d.toLocaleDateString("en-US", { day: "2-digit" })}</strong><span>{d.toLocaleDateString("en-US", { month: "short" })}</span></div><div style={styles.rowMain}><strong>{lead.name}</strong><span style={styles.muted}>{lead.service || "HVAC Service"}</span></div><span>→</span></a>; }
function Pipeline({ label, count, total }: { label: string; count: number; total: number }) { const percent = total ? Math.round((count / total) * 100) : 0; return <div style={styles.pipeline}><div style={styles.pipelineTop}><span>{label}</span><strong>{count}</strong></div><div style={styles.track}><div style={{ ...styles.fill, width: `${percent}%` }} /></div></div>; }
function Center({ children }: { children: ReactNode }) { return <div style={styles.center}>{children}</div>; }
function Empty() { return <Center><div style={styles.emptyIcon}>+</div><strong>No leads yet</strong><span style={styles.muted}>Create your first customer to get started.</span><a href="/leads/new" style={styles.smallButton}>Create Lead</a></Center>; }
function statusStyle(value: string | null): CSSProperties { const s = (value || "new").toLowerCase(); const colors: Record<string, CSSProperties> = { new: { background: "#fff7ed", color: "#c2410c" }, contacted: { background: "#eff6ff", color: "#2563eb" }, quoted: { background: "#f5f3ff", color: "#7c3aed" }, scheduled: { background: "#f0fdf4", color: "#15803d" }, completed: { background: "#ecfdf5", color: "#059669" }, cancelled: { background: "#f1f5f9", color: "#64748b" } }; return { ...styles.status, ...(colors[s] || colors.new) }; }

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f7f8fa", color: "#111827", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" },
  container: { maxWidth: 1200, margin: "0 auto", padding: "0 28px 60px" },
  nav: { height: 72, display: "flex", alignItems: "center", gap: 28, borderBottom: "1px solid #e5e7eb" },
  logo: { display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "#111827", fontWeight: 800, fontSize: 19 },
  logoMark: { width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, background: "#111827", color: "white", fontSize: 14 },
  links: { display: "flex", justifyContent: "center", gap: 26, flex: 1 },
  link: { color: "#6b7280", textDecoration: "none", fontSize: 13, fontWeight: 600 },
  active: { color: "#111827", textDecoration: "none", fontSize: 13, fontWeight: 700, borderBottom: "2px solid #111827", paddingBottom: 7 },
  primary: { color: "white", background: "#111827", textDecoration: "none", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontWeight: 700 },
  hero: { display: "flex", justifyContent: "space-between", alignItems: "end", padding: "40px 0 24px" },
  eyebrow: { color: "#6b7280", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, marginBottom: 7 },
  title: { margin: 0, fontSize: 32, letterSpacing: -1 },
  subtitle: { margin: "7px 0 0", color: "#6b7280", fontSize: 13 },
  refresh: { background: "white", border: "1px solid #d9dee6", borderRadius: 8, padding: "9px 13px", cursor: "pointer", fontWeight: 700, color: "#374151" },
  error: { padding: 13, marginBottom: 16, borderRadius: 8, background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", fontSize: 12 },
  retry: { marginLeft: 10, border: 0, background: "none", textDecoration: "underline", cursor: "pointer", color: "inherit" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 },
  stat: { background: "white", border: "1px solid #e3e7ed", borderRadius: 10, padding: 17, textDecoration: "none", color: "#111827" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { color: "#6b7280", fontSize: 11, fontWeight: 700 },
  statIcon: { width: 27, height: 27, display: "grid", placeItems: "center", background: "#f3f4f6", borderRadius: 7, fontWeight: 800, fontSize: 12 },
  statValue: { fontSize: 26, fontWeight: 800, marginTop: 12 },
  statDetail: { color: "#9ca3af", fontSize: 10, marginTop: 4 },
  grid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 },
  card: { background: "white", border: "1px solid #e3e7ed", borderRadius: 10, overflow: "hidden" },
  cardHeader: { padding: "16px 18px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #edf0f3" },
  cardTitle: { margin: 0, fontSize: 14 },
  cardSubtitle: { margin: "4px 0 0", color: "#9ca3af", fontSize: 10 },
  view: { color: "#4b5563", textDecoration: "none", fontSize: 10, fontWeight: 700 },
  row: { display: "grid", gridTemplateColumns: "34px minmax(0,1fr) auto 120px 14px", gap: 10, alignItems: "center", padding: "12px 18px", color: "#111827", textDecoration: "none", borderBottom: "1px solid #f3f4f6", fontSize: 12 },
  avatar: { width: 32, height: 32, borderRadius: 8, display: "grid", placeItems: "center", background: "#eef1f5", fontWeight: 800, fontSize: 12 },
  rowMain: { minWidth: 0, display: "flex", flexDirection: "column", gap: 3 },
  muted: { color: "#9ca3af", fontSize: 10 },
  status: { borderRadius: 999, padding: "5px 8px", fontSize: 9, fontWeight: 800, textTransform: "capitalize", whiteSpace: "nowrap" },
  contact: { color: "#9ca3af", fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  appointment: { display: "grid", gridTemplateColumns: "42px minmax(0,1fr) 14px", gap: 12, alignItems: "center", padding: "13px 18px", color: "#111827", textDecoration: "none", borderBottom: "1px solid #f3f4f6", fontSize: 12 },
  dateBox: { width: 40, height: 40, borderRadius: 8, background: "#f5f6f8", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 10 },
  center: { minHeight: 190, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 5, fontSize: 12 },
  emptyIcon: { width: 38, height: 38, borderRadius: 10, background: "#f1f5f9", display: "grid", placeItems: "center", marginBottom: 6, fontWeight: 800, color: "#475569" },
  smallButton: { marginTop: 10, background: "#111827", color: "white", textDecoration: "none", borderRadius: 7, padding: "8px 12px", fontSize: 10, fontWeight: 700 },
  pipelineBox: { padding: 18 },
  pipeline: { marginBottom: 14 },
  pipelineTop: { display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#4b5563", fontSize: 10 },
  track: { height: 7, background: "#eef0f3", borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", background: "#374151", borderRadius: 999 },
  action: { background: "#111827", color: "white", borderRadius: 10, padding: 26, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 235 },
  actionLabel: { fontSize: 9, fontWeight: 800, letterSpacing: 1.3, opacity: 0.6 },
  actionIcon: { marginTop: 18, width: 38, height: 38, borderRadius: 9, background: "#374151", display: "grid", placeItems: "center", fontSize: 20 },
  actionTitle: { margin: "12px 0 5px", fontSize: 21 },
  actionText: { margin: 0, color: "#9ca3af", fontSize: 11, lineHeight: 1.6 },
  actionButton: { marginTop: 18, alignSelf: "start", background: "white", color: "#111827", textDecoration: "none", borderRadius: 7, padding: "9px 12px", fontSize: 10, fontWeight: 800 }
};

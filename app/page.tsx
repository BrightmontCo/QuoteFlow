"use client";

import { useEffect, useMemo, useState } from "react";

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

const money = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setError("");
      const response = await fetch("/api/leads", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Unable to load dashboard");
      setLeads(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeads(); }, []);

  const metrics = useMemo(() => {
    const normalized = leads.map((lead) => ({ ...lead, normalizedStatus: (lead.status || "new").toLowerCase() }));
    const newLeads = normalized.filter((l) => l.normalizedStatus === "new").length;
    const contacted = normalized.filter((l) => l.normalizedStatus === "contacted").length;
    const scheduled = normalized.filter((l) => l.normalizedStatus === "scheduled").length;
    const completed = normalized.filter((l) => l.normalizedStatus === "completed").length;
    const quotes = normalized.filter((l) => l["quote amount"] != null && l["quote amount"] !== 0);
    const pipeline = quotes.filter((l) => !["completed", "cancelled"].includes(l.normalizedStatus)).reduce((sum, l) => sum + Number(l["quote amount"] || 0), 0);
    const won = normalized.filter((l) => l.normalizedStatus === "completed").reduce((sum, l) => sum + Number(l["quote amount"] || 0), 0);
    const upcoming = normalized.filter((l) => {
      if (!l["appointment date"] || l.normalizedStatus === "cancelled") return false;
      const date = new Date(l["appointment date"]!);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      return date >= today;
    }).sort((a, b) => new Date(a["appointment date"]!).getTime() - new Date(b["appointment date"]!).getTime()).slice(0, 5);
    const conversion = leads.length ? Math.round((completed / leads.length) * 100) : 0;
    return { newLeads, contacted, scheduled, completed, quotes: quotes.length, pipeline, won, upcoming, conversion };
  }, [leads]);

  const recentLeads = leads.slice(0, 6);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.nav}>
          <a href="/" style={styles.logo}><span style={styles.logoMark}>Q</span> QuoteFlow</a>
          <nav style={styles.navLinks}>
            <a href="/" style={styles.active}>Dashboard</a>
            <a href="/leads">Leads</a>
            <a href="/quotes">Quotes</a>
            <a href="/appointments">Appointments</a>
          </nav>
          <a href="/leads/new" style={styles.navButton}>+ New Lead</a>
        </header>

        <section style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>CONTRACTOR CRM</div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Everything you need to turn leads into booked jobs.</p>
          </div>
          <button onClick={loadLeads} style={styles.refresh}>↻ Refresh</button>
        </section>

        {error && <div style={styles.error}>⚠ {error} <button onClick={loadLeads} style={styles.retry}>Try again</button></div>}

        <section style={styles.stats}>
          <Stat href="/leads" label="New Leads" value={loading ? "—" : metrics.newLeads} detail="Need follow-up" icon="↗" />
          <Stat href="/quotes" label="Quotes" value={loading ? "—" : metrics.quotes} detail={`${metrics.conversion}% close rate`} icon="$" />
          <Stat href="/appointments" label="Upcoming Jobs" value={loading ? "—" : metrics.upcoming.length} detail={`${metrics.scheduled} scheduled total`} icon="✓" />
          <Stat href="/quotes" label="Pipeline Value" value={loading ? "—" : money(metrics.pipeline)} detail={`${money(metrics.won)} won`} icon="◈" />
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}><div><h2 style={styles.cardTitle}>Recent Leads</h2><p style={styles.cardSub}>Your newest customer requests.</p></div><a href="/leads" style={styles.viewAll}>View all →</a></div>
            {loading ? <div style={styles.center}>Loading leads...</div> : recentLeads.length === 0 ? <Empty /> : <div>{recentLeads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}</div>}
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}><div><h2 style={styles.cardTitle}>Upcoming Appointments</h2><p style={styles.cardSub}>Your next scheduled jobs.</p></div><a href="/appointments" style={styles.viewAll}>Calendar →</a></div>
            {loading ? <div style={styles.center}>Loading...</div> : metrics.upcoming.length === 0 ? <div style={styles.center}><div style={styles.bigIcon}>✓</div><strong>No upcoming appointments</strong><p style={styles.cardSub}>Scheduled jobs will appear here.</p></div> : <div>{metrics.upcoming.map((lead) => <AppointmentRow key={lead.id} lead={lead} />)}</div>}
          </div>
        </section>

        <section style={styles.bottomGrid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}><div><h2 style={styles.cardTitle}>Sales Pipeline</h2><p style={styles.cardSub}>Lead status breakdown.</p></div><a href="/leads" style={styles.viewAll}>Manage →</a></div>
            <PipelineRow label="New" count={metrics.newLeads} total={leads.length} />
            <PipelineRow label="Contacted" count={metrics.contacted} total={leads.length} />
            <PipelineRow label="Scheduled" count={metrics.scheduled} total={leads.length} />
            <PipelineRow label="Completed" count={metrics.completed} total={leads.length} />
          </div>
          <div style={styles.actionCard}>
            <div style={styles.actionIcon}>+</div>
            <h2 style={styles.actionTitle}>Add a new customer</h2>
            <p style={styles.cardSub}>Create a lead, add pricing, and schedule the job.</p>
            <a href="/leads/new" style={styles.actionButton}>Create Lead →</a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ href, label, value, detail, icon }: { href: string; label: string; value: string | number; detail: string; icon: string }) {
  return <a href={href} style={styles.stat}><div style={styles.statTop}><span style={styles.statLabel}>{label}</span><span style={styles.statIcon}>{icon}</span></div><div style={styles.statValue}>{value}</div><div style={styles.statDetail}>{detail}</div></a>;
}

function LeadRow({ lead }: { lead: Lead }) {
  return <a href={`/leads/${lead.id}`} style={styles.row}><div style={styles.avatar}>{(lead.name || "?").charAt(0).toUpperCase()}</div><div style={styles.rowMain}><strong style={styles.name}>{lead.name}</strong><span style={styles.meta}>{lead.service || "Service not specified"}</span></div><span style={statusStyle(lead.status)}>{lead.status || "New"}</span><span style={styles.rowContact}>{lead.phone || lead.email || "No contact"}</span><span style={styles.arrow}>→</span></a>;
}

function AppointmentRow({ lead }: { lead: Lead }) {
  const date = new Date(lead["appointment date"]!);
  return <a href={`/leads/${lead.id}`} style={styles.appointment}><div style={styles.dateBox}><strong>{date.toLocaleDateString("en-US", { day: "2-digit" })}</strong><span>{date.toLocaleDateString("en-US", { month: "short" })}</span></div><div><strong style={styles.name}>{lead.name}</strong><div style={styles.meta}>{lead.service || "HVAC Service"}</div></div><span style={styles.arrow}>→</span></a>;
}

function PipelineRow({ label, count, total }: { label: string; count: number; total: number }) {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return <div style={styles.pipeline}><div style={styles.pipelineTop}><span>{label}</span><strong>{count}</strong></div><div style={styles.track}><div style={{ ...styles.fill, width: `${percent}%` }} /></div></div>;
}

function Empty() { return <div style={styles.center}><div style={styles.bigIcon}>+</div><strong>No leads yet</strong><p style={styles.cardSub}>Create your first customer to get started.</p><a href="/leads/new" style={styles.smallButton}>Create Lead</a></div>; }

function statusStyle(status: string | null) {
  const s = (status || "new").toLowerCase();
  const map: Record<string, { background: string; color: string }> = { new: { background: "#fff7ed", color: "#c2410c" }, contacted: { background: "#eff6ff", color: "#2563eb" }, scheduled: { background: "#f5f3ff", color: "#7c3aed" }, completed: { background: "#ecfdf5", color: "#059669" }, cancelled: { background: "#f3f4f6", color: "#6b7280" } };
  return { ...styles.status, ...(map[s] || map.new) };
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" },
  container: { maxWidth: "1240px", margin: "0 auto", padding: "0 28px 70px" },
  nav: { height: "76px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", gap: "25px" },
  logo: { display: "flex", alignItems: "center", gap: "9px", color: "#0f172a", textDecoration: "none", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" },
  logoMark: { width: "30px", height: "30px", display: "grid", placeItems: "center", background: "#0f172a", color: "white", borderRadius: "8px", fontSize: "15px" },
  navLinks: { display: "flex", gap: "27px", alignItems: "center", flex: 1, justifyContent: "center" },
  active: { color: "#0f172a", textDecoration: "none", fontSize: "13px", fontWeight: 700 },
  navButton: { background: "#0f172a", color: "white", textDecoration: "none", padding: "10px 15px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 },
  hero: { display: "flex", justifyContent: "space-between", alignItems: "end", padding: "42px 0 28px" },
  eyebrow: { color: "#64748b", fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", marginBottom: "8px" },
  title: { margin: 0, fontSize: "34px", letterSpacing: "-1px" },
  subtitle: { margin: "8px 0 0", color: "#64748b", fontSize: "14px" },
  refresh: { border: "1px solid #cbd5e1", background: "white", color: "#334155", borderRadius: "8px", padding: "9px 13px", cursor: "pointer", fontWeight: 600 },
  error: { marginBottom: "20px", padding: "13px 16px", background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3", borderRadius: "9px", fontSize: "13px" },
  retry: { border: 0, background: "transparent", color: "inherit", textDecoration: "underline", cursor: "pointer", marginLeft: "8px" },
  stats: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "15px", marginBottom: "20px" },
  stat: { background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "19px", color: "#0f172a", textDecoration: "none", boxShadow: "0 1px 2px rgba(15,23,42,.03)" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statLabel: { color: "#64748b", fontSize: "12px", fontWeight: 600 },
  statIcon: { width: "27px", height: "27px", display: "grid", placeItems: "center", borderRadius: "7px", background: "#f1f5f9", color: "#475569", fontWeight: 800, fontSize: "12px" },
  statValue: { fontSize: "28px", fontWeight: 800, marginTop: "12px", letterSpacing: "-0.7px" },
  statDetail: { color: "#94a3b8", fontSize: "11px", marginTop: "5px" },
  grid: { display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "20px", marginBottom: "20px" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "20px" },
  card: { background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 2px rgba(15,23,42,.03)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 19px", borderBottom: "1px solid #f1f5f9" },
  cardTitle: { margin: 0, fontSize: "15px", letterSpacing: "-0.2px" },
  cardSub: { margin: "5px 0 0", color: "#94a3b8", fontSize: "11px" },
  viewAll: { color: "#475569", textDecoration: "none", fontSize: "11px", fontWeight: 700 },
  row: { display: "grid", gridTemplateColumns: "36px 1fr auto 125px 18px", gap: "12px", alignItems: "center", padding: "13px 19px", borderBottom: "1px solid #f8fafc", color: "#0f172a", textDecoration: "none" },
  avatar: { width: "34px", height: "34px", borderRadius: "9px", display: "grid", placeItems: "center", background: "#f1f5f9", color: "#334155", fontSize: "12px", fontWeight: 800 },
  rowMain: { minWidth: 0, display: "flex", flexDirection: "column" as const, gap: "3px" },
  name: { fontSize: "12px", fontWeight: 700 },
  meta: { color: "#94a3b8", fontSize: "10px" },
  rowContact: { color: "#64748b", fontSize: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  arrow: { color: "#94a3b8", fontSize: "14px" },
  status: { padding: "5px 8px", borderRadius: "999px", fontSize: "9px", fontWeight: 800, textTransform: "capitalize" as const },
  center: { minHeight: "190px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", color: "#475569", fontSize: "13px", textAlign: "center" as const, padding: "20px" },
  bigIcon: { width: "38px", height: "38px", display: "grid", placeItems: "center", borderRadius: "50%", background: "#f1f5f9", color: "#64748b", marginBottom: "10px", fontWeight: 700 },
  smallButton: { marginTop: "10px", background: "#0f172a", color: "white", textDecoration: "none", padding: "8px 12px", borderRadius: "7px", fontSize: "11px", fontWeight: 700 },
  appointment: { display: "grid", gridTemplateColumns: "42px 1fr 18px", gap: "12px", alignItems: "center", padding: "13px 19px", borderBottom: "1px solid #f8fafc", textDecoration: "none", color: "#0f172a" },
  dateBox: { width: "40px", height: "40px", borderRadius: "9px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" },
  pipeline: { padding: "14px 19px 0" },
  pipelineTop: { display: "flex", justifyContent: "space-between", color: "#475569", fontSize: "11px", fontWeight: 600 },
  track: { height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden", marginTop: "8px", marginBottom: "2px" },
  fill: { height: "100%", background: "#334155", borderRadius: "99px" },
  actionCard: { borderRadius: "12px", padding: "28px", background: "#0f172a", color: "white", minHeight: "190px", boxSizing: "border-box" as const },
  actionIcon: { width: "34px", height: "34px", display: "grid", placeItems: "center", borderRadius: "9px", background: "#334155", fontSize: "20px" },
  actionTitle: { margin: "22px 0 6px", fontSize: "18px" },
  actionButton: { display: "inline-block", marginTop: "18px", padding: "9px 13px", borderRadius: "7px", background: "white", color: "#0f172a", textDecoration: "none", fontSize: "11px", fontWeight: 800 },
};

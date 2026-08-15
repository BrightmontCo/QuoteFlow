"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  status: string | null;
  "quote amount": number | null;
  "appointment date": string | null;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leads", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Unable to load leads");
        setLeads(result.data || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load leads"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <a href="/" style={styles.logo}>QuoteFlow</a>
          <div style={styles.links}>
            <a href="/">Dashboard</a><a href="/leads" style={styles.active}>Leads</a><a href="/quotes">Quotes</a><a href="/appointments">Appointments</a>
          </div>
        </nav>
        <div style={styles.header}>
          <div><h1 style={styles.title}>Leads</h1><p style={styles.muted}>Manage your customers and quote requests.</p></div>
          <a href="/leads/new" style={styles.button}>+ New Lead</a>
        </div>
        <section style={styles.card}>
          {loading ? <p style={styles.empty}>Loading leads...</p> : error ? <p style={styles.error}>{error}</p> : leads.length === 0 ? <div style={styles.empty}><h2>No leads yet</h2><p>New customers will appear here.</p><a href="/leads/new" style={styles.button}>Create your first lead</a></div> : (
            <div style={{ overflowX: "auto" }}><table style={styles.table}><thead><tr><th>Customer</th><th>Service</th><th>Status</th><th>Quote</th><th>Appointment</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><a href={`/leads/${lead.id}`} style={styles.customer}>{lead.name}</a><div style={styles.small}>{lead.phone || lead.email || "No contact"}</div></td><td>{lead.service || "—"}</td><td><span style={styles.status}>{lead.status || "New"}</span></td><td>{lead["quote amount"] == null ? "—" : `$${Number(lead["quote amount"]).toLocaleString()}`}</td><td>{lead["appointment date"] ? new Date(lead["appointment date"]).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fa", color: "#111827", fontFamily: "Arial, Helvetica, sans-serif" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 30px 60px" },
  nav: { height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", marginBottom: "40px" },
  logo: { color: "#111827", textDecoration: "none", fontSize: "22px", fontWeight: 800 },
  links: { display: "flex", gap: "28px" },
  active: { color: "#111827", fontWeight: 700 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "32px" },
  muted: { color: "#6b7280", marginTop: "8px" },
  button: { background: "#111827", color: "white", textDecoration: "none", padding: "11px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600 },
  card: { background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" as const, textAlign: "left" as const },
  status: { display: "inline-block", background: "#fef3c7", color: "#92400e", padding: "6px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700 },
  customer: { color: "#111827", textDecoration: "none", fontWeight: 600 },
  small: { color: "#6b7280", fontSize: "12px", marginTop: "4px" },
  empty: { padding: "60px 20px", textAlign: "center" as const, color: "#6b7280" },
  error: { padding: "30px", color: "#991b1b" },
};

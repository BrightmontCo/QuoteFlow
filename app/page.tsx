"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  problem: string;
  status: string;
  quote_amount: number | null;
  appointment_date: string | null;
  notes: string | null;
  created_at: string;
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLeads() {
      try {
        const response = await fetch("/api/leads");

        if (!response.ok) {
          throw new Error("Failed to load leads");
        }

        const data = await response.json();

        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getLeads();
  }, []);

  const newLeads = leads.filter(
    (lead) => lead.status?.toLowerCase() === "new"
  );

  const quotes = leads.filter(
    (lead) => lead.status?.toLowerCase() === "quote sent"
  );

  const booked = leads.filter(
    (lead) => lead.status?.toLowerCase() === "booked"
  );

  const pipeline = leads.reduce(
    (total, lead) => total + (Number(lead.quote_amount) || 0),
    0
  );

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>QuoteFlow</div>

        <nav>
          <div style={styles.activeNav}>Dashboard</div>
          <div style={styles.navItem}>Leads</div>
          <div style={styles.navItem}>Quotes</div>
          <div style={styles.navItem}>Appointments</div>
        </nav>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.smallText}>Contractor CRM</p>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>
              Manage your leads, quotes, and jobs.
            </p>
          </div>

          <div style={styles.account}>
            <div style={styles.avatar}>QF</div>
            QuoteFlow
          </div>
        </header>

        <section style={styles.stats}>
          <Stat title="New Leads" value={String(newLeads.length)} />
          <Stat title="Quotes Awaiting" value={String(quotes.length)} />
          <Stat title="Appointments" value={String(booked.length)} />
          <Stat
            title="Pipeline Value"
            value={`$${pipeline.toLocaleString()}`}
          />
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Recent Leads</h2>

            <span style={styles.muted}>
              {loading ? "Loading..." : `${leads.length} customers`}
            </span>
          </div>

          {loading ? (
            <div style={styles.message}>Loading leads...</div>
          ) : leads.length === 0 ? (
            <div style={styles.message}>
              No leads yet. Submit your Tally quote form to create one.
            </div>
          ) : (
            <div>
              <div style={styles.tableHeader}>
                <span>Customer</span>
                <span>Service</span>
                <span>Status</span>
                <span>Quote</span>
              </div>

              {leads.map((lead) => (
                <div style={styles.tableRow} key={lead.id}>
                  <div>
                    <strong>{lead.name}</strong>
                    <div style={styles.email}>{lead.email}</div>
                  </div>

                  <span>{lead.service}</span>

                  <span style={styles.status}>{lead.status}</span>

                  <span>
                    {lead.quote_amount
                      ? `$${Number(lead.quote_amount).toLocaleString()}`
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div style={styles.stat}>
      <p style={styles.statTitle}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f6f8fb",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
    display: "flex",
  },

  sidebar: {
    width: "240px",
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "28px 16px",
  },

  logo: {
    fontSize: "23px",
    fontWeight: 800,
    marginBottom: "35px",
    paddingLeft: "10px",
  },

  navItem: {
    padding: "12px",
    marginBottom: "6px",
    color: "#667085",
    fontSize: "14px",
  },

  activeNav: {
    padding: "12px",
    marginBottom: "6px",
    background: "#eef1f5",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "14px",
  },

  content: {
    flex: 1,
    padding: "35px",
    maxWidth: "1400px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
  },

  smallText: {
    color: "#667085",
    fontSize: "13px",
    margin: 0,
  },

  title: {
    fontSize: "30px",
    margin: "5px 0",
  },

  subtitle: {
    color: "#667085",
    margin: 0,
  },

  account: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    padding: "8px 12px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 600,
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#172033",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "22px",
  },

  stat: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },

  statTitle: {
    color: "#667085",
    fontSize: "13px",
    margin: 0,
  },

  statValue: {
    fontSize: "28px",
    margin: "10px 0 0",
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  panelHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
  },

  panelTitle: {
    fontSize: "16px",
    margin: 0,
  },

  muted: {
    color: "#667085",
    fontSize: "12px",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr",
    padding: "13px 20px",
    color: "#667085",
    fontSize: "12px",
    borderBottom: "1px solid #eef0f4",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 2fr 1fr 1fr",
    padding: "16px 20px",
    borderBottom: "1px solid #eef0f4",
    fontSize: "14px",
    alignItems: "center",
  },

  status: {
    background: "#eef1f5",
    borderRadius: "20px",
    padding: "5px 9px",
    fontSize: "11px",
    fontWeight: 700,
    width: "fit-content",
  },

  email: {
    color: "#667085",
    fontSize: "12px",
    marginTop: "4px",
  },

  message: {
    padding: "50px",
    textAlign: "center",
    color: "#667085",
  },
};

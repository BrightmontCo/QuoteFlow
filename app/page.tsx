"use client";

import { useEffect, useState } from "react";

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

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (result.success) {
          setLeads(result.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const newLeads = leads.filter(
    (lead) => (lead.status || "New") === "New"
  ).length;

  const quotesAwaiting = leads.filter(
    (lead) => lead.status === "Quoted"
  ).length;

  const appointments = leads.filter(
    (lead) =>
      lead["appointment date"] !== null &&
      lead["appointment date"] !== ""
  ).length;

  const pipelineValue = leads.reduce(
    (total, lead) =>
      total + Number(lead["quote amount"] || 0),
    0
  );

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* TOP NAVIGATION */}

        <nav style={styles.nav}>
          <div style={styles.logo}>
            QuoteFlow
          </div>

          <div style={styles.navLinks}>
            <a href="/" style={styles.activeLink}>
              Dashboard
            </a>

            <a href="/leads" style={styles.navLink}>
              Leads
            </a>

            <a href="/quotes" style={styles.navLink}>
              Quotes
            </a>

            <a href="/appointments" style={styles.navLink}>
              Appointments
            </a>

            <span style={styles.navLink}>
              Contractor CRM
            </span>
          </div>
        </nav>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Dashboard
            </h1>

            <p style={styles.subtitle}>
              Manage your leads, quotes, and jobs.
            </p>
          </div>

          <a href="/leads" style={styles.newLeadButton}>
            View Leads
          </a>
        </div>

        {/* STAT CARDS */}

        <div style={styles.stats}>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              New Leads
            </div>

            <div style={styles.statNumber}>
              {loading ? "—" : newLeads}
            </div>

            <div style={styles.statDescription}>
              New customer requests
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Quotes Awaiting
            </div>

            <div style={styles.statNumber}>
              {loading ? "—" : quotesAwaiting}
            </div>

            <div style={styles.statDescription}>
              Quotes to follow up
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Appointments
            </div>

            <div style={styles.statNumber}>
              {loading ? "—" : appointments}
            </div>

            <div style={styles.statDescription}>
              Scheduled appointments
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Pipeline Value
            </div>

            <div style={styles.statNumber}>
              {loading
                ? "—"
                : `$${pipelineValue.toLocaleString()}`}
            </div>

            <div style={styles.statDescription}>
              Total quoted value
            </div>
          </div>

        </div>

        {/* RECENT LEADS */}

        <section style={styles.section}>

          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>
                Recent Leads
              </h2>

              <p style={styles.sectionSubtitle}>
                {leads.length} customer
                {leads.length === 1 ? "" : "s"}
              </p>
            </div>

            <a href="/leads" style={styles.viewAll}>
              View all →
            </a>
          </div>

          {loading ? (
            <div style={styles.empty}>
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div style={styles.empty}>
              <h3 style={styles.emptyTitle}>
                No leads yet
              </h3>

              <p style={styles.emptyText}>
                Customer requests will appear here
                when they are submitted.
              </p>
            </div>
          ) : (
            <div style={styles.leadsList}>
              {leads.slice(0, 5).map((lead) => (
                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  style={styles.leadRow}
                >

                  <div style={styles.customerIcon}>
                    {lead.name
                      ? lead.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>

                  <div style={styles.leadInfo}>
                    <div style={styles.leadName}>
                      {lead.name}
                    </div>

                    <div style={styles.leadService}>
                      {lead.service || "HVAC Service"}
                    </div>
                  </div>

                  <div style={styles.leadProblem}>
                    {lead.problem || "No description"}
                  </div>

                  <div>
                    <span style={styles.status}>
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div style={styles.leadArrow}>
                    →
                  </div>

                </a>
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    color: "#111827",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "0 30px 50px",
  },

  nav: {
    height: "72px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "40px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  navLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
  },

  activeLink: {
    color: "#111827",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },

  newLeadButton: {
    background: "#111827",
    color: "white",
    textDecoration: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "35px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "10px",
  },

  statNumber: {
    fontSize: "30px",
    fontWeight: 700,
    marginBottom: "7px",
  },

  statDescription: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  section: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  sectionHeader: {
    padding: "22px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "18px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#9ca3af",
    fontSize: "13px",
  },

  viewAll: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },

  leadsList: {
    display: "flex",
    flexDirection: "column" as const,
  },

  leadRow: {
    display: "grid",
    gridTemplateColumns:
      "44px 1.2fr 1.5fr 120px 30px",
    alignItems: "center",
    gap: "18px",
    padding: "18px 24px",
    borderBottom: "1px solid #f0f0f0",
    textDecoration: "none",
    color: "#111827",
  },

  customerIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  leadInfo: {
    minWidth: 0,
  },

  leadName: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "4px",
  },

  leadService: {
    fontSize: "12px",
    color: "#6b7280",
  },

  leadProblem: {
    fontSize: "13px",
    color: "#6b7280",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  status: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
  },

  leadArrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  empty: {
    padding: "60px 30px",
    textAlign: "center" as const,
  },

  emptyTitle: {
    margin: 0,
    fontSize: "18px",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
  },
};

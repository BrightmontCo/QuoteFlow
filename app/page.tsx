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
        console.error("Unable to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const newLeads = leads.filter(
    (lead) =>
      !lead.status ||
      lead.status.toLowerCase() === "new"
  );

  const quotesAwaiting = leads.filter(
    (lead) =>
      lead["quote amount"] !== null &&
      lead["quote amount"] !== undefined &&
      lead.status?.toLowerCase() !== "completed"
  );

  const upcomingAppointments = leads.filter(
    (lead) => {
      if (!lead["appointment date"]) {
        return false;
      }

      const appointmentDate = new Date(
        lead["appointment date"]
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return appointmentDate >= today;
    }
  );

  const pipelineValue = leads.reduce(
    (total, lead) =>
      total + Number(lead["quote amount"] || 0),
    0
  );

  const recentLeads = [...leads].slice(0, 5);

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* NAVIGATION */}

        <nav style={styles.nav}>
          <a href="/" style={styles.logo}>
            QuoteFlow
          </a>

          <div style={styles.navLinks}>
            <a
              href="/"
              style={styles.activeLink}
            >
              Dashboard
            </a>

            <a
              href="/leads"
              style={styles.navLink}
            >
              Leads
            </a>

            <a
              href="/quotes"
              style={styles.navLink}
            >
              Quotes
            </a>

            <a
              href="/appointments"
              style={styles.navLink}
            >
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

          <a
            href="/leads"
            style={styles.viewLeadsButton}
          >
            View Leads
          </a>
        </div>

        {/* STATS */}

        <div style={styles.stats}>

          <a
            href="/leads"
            style={styles.statCard}
          >
            <div style={styles.statLabel}>
              New Leads
            </div>

            <div style={styles.statValue}>
              {loading ? "—" : newLeads.length}
            </div>

            <div style={styles.statLink}>
              View leads →
            </div>
          </a>

          <a
            href="/quotes"
            style={styles.statCard}
          >
            <div style={styles.statLabel}>
              Quotes Awaiting
            </div>

            <div style={styles.statValue}>
              {loading
                ? "—"
                : quotesAwaiting.length}
            </div>

            <div style={styles.statLink}>
              View quotes →
            </div>
          </a>

          <a
            href="/appointments"
            style={styles.statCard}
          >
            <div style={styles.statLabel}>
              Appointments
            </div>

            <div style={styles.statValue}>
              {loading
                ? "—"
                : upcomingAppointments.length}
            </div>

            <div style={styles.statLink}>
              View appointments →
            </div>
          </a>

          <a
            href="/quotes"
            style={styles.statCard}
          >
            <div style={styles.statLabel}>
              Pipeline Value
            </div>

            <div style={styles.statValue}>
              {loading
                ? "—"
                : `$${pipelineValue.toLocaleString()}`}
            </div>

            <div style={styles.statLink}>
              View pipeline →
            </div>
          </a>

        </div>

        {/* RECENT LEADS */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Recent Leads
              </h2>

              <p style={styles.cardSubtitle}>
                Your most recent customers.
              </p>
            </div>

            <a
              href="/leads"
              style={styles.viewAll}
            >
              View all →
            </a>
          </div>

          {loading ? (
            <div style={styles.loading}>
              Loading leads...
            </div>
          ) : recentLeads.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                +
              </div>

              <h3 style={styles.emptyTitle}>
                No leads yet
              </h3>

              <p style={styles.emptyText}>
                New customers will appear here
                when they submit a quote request.
              </p>

              <a
                href="/leads"
                style={styles.button}
              >
                Go to Leads
              </a>
            </div>
          ) : (
            <div>

              {recentLeads.map((lead) => (

                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  style={styles.leadRow}
                >

                  <div style={styles.avatar}>
                    {lead.name
                      ? lead.name
                          .charAt(0)
                          .toUpperCase()
                      : "?"}
                  </div>

                  <div style={styles.leadInfo}>

                    <div style={styles.leadName}>
                      {lead.name}
                    </div>

                    <div style={styles.leadService}>
                      {lead.service ||
                        "Service not specified"}
                    </div>

                  </div>

                  <div style={styles.problem}>
                    {lead.problem
                      ? lead.problem
                      : "No problem description"}
                  </div>

                  <div>
                    <span
                      style={getStatusStyle(
                        lead.status
                      )}
                    >
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div style={styles.contact}>
                    {lead.phone ||
                      lead.email ||
                      "No contact"}
                  </div>

                  <div style={styles.arrow}>
                    →
                  </div>

                </a>

              ))}

            </div>
          )}

        </section>

        {/* QUICK ACTIONS */}

        <section style={styles.quickSection}>

          <h2 style={styles.quickTitle}>
            Quick Actions
          </h2>

          <div style={styles.quickGrid}>

            <a
              href="/leads"
              style={styles.quickCard}
            >
              <div style={styles.quickIcon}>
                +
              </div>

              <div>
                <div style={styles.quickName}>
                  View Leads
                </div>

                <div style={styles.quickDescription}>
                  Manage your customers
                </div>
              </div>
            </a>

            <a
              href="/quotes"
              style={styles.quickCard}
            >
              <div style={styles.quickIcon}>
                $
              </div>

              <div>
                <div style={styles.quickName}>
                  View Quotes
                </div>

                <div style={styles.quickDescription}>
                  Manage customer pricing
                </div>
              </div>
            </a>

            <a
              href="/appointments"
              style={styles.quickCard}
            >
              <div style={styles.quickIcon}>
                📅
              </div>

              <div>
                <div style={styles.quickName}>
                  Appointments
                </div>

                <div style={styles.quickDescription}>
                  View scheduled jobs
                </div>
              </div>
            </a>

          </div>

        </section>

      </div>
    </main>
  );
}

function getStatusStyle(status: string | null) {
  const normalized =
    status?.toLowerCase();

  if (normalized === "completed") {
    return {
      ...styles.status,
      ...styles.completed,
    };
  }

  if (normalized === "contacted") {
    return {
      ...styles.status,
      ...styles.contacted,
    };
  }

  if (normalized === "scheduled") {
    return {
      ...styles.status,
      ...styles.scheduled,
    };
  }

  if (normalized === "cancelled") {
    return {
      ...styles.status,
      ...styles.cancelled,
    };
  }

  return styles.status;
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
    padding: "0 30px 60px",
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
    color: "#111827",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: 800,
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
  },

  activeLink: {
    color: "#111827",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    fontSize: "15px",
  },

  viewLeadsButton: {
    background: "#111827",
    color: "white",
    textDecoration: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
    textDecoration: "none",
    color: "#111827",
  },

  statLabel: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "10px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "12px",
  },

  statLink: {
    color: "#6b7280",
    fontSize: "12px",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "30px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "22px 20px",
    borderBottom: "1px solid #e5e7eb",
  },

  cardTitle: {
    margin: 0,
    fontSize: "18px",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  viewAll: {
    color: "#4f46e5",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },

  leadRow: {
    display: "grid",
    gridTemplateColumns:
      "42px 1.5fr 2fr 1fr 1.4fr 25px",
    gap: "15px",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    color: "#111827",
    textDecoration: "none",
  },

  avatar: {
    width: "38px",
    height: "38px",
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
    color: "#6b7280",
    fontSize: "12px",
  },

  problem: {
    color: "#4b5563",
    fontSize: "13px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },

  contact: {
    color: "#6b7280",
    fontSize: "12px",
  },

  status: {
    display: "inline-block",
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },

  contacted: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  completed: {
    background: "#dcfce7",
    color: "#166534",
  },

  scheduled: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  loading: {
    padding: "50px",
    textAlign: "center" as const,
    color: "#6b7280",
  },

  empty: {
    textAlign: "center" as const,
    padding: "65px 30px",
  },

  emptyIcon: {
    width: "48px",
    height: "48px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 700,
  },

  emptyTitle: {
    margin: 0,
    fontSize: "19px",
  },

  emptyText: {
    maxWidth: "450px",
    margin: "10px auto 20px",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  button: {
    display: "inline-block",
    background: "#111827",
    color: "white",
    textDecoration: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },

  quickSection: {
    marginTop: "10px",
  },

  quickTitle: {
    fontSize: "18px",
    marginBottom: "15px",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    textDecoration: "none",
    color: "#111827",
  },

  quickIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 700,
  },

  quickName: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "4px",
  },

  quickDescription: {
    color: "#6b7280",
    fontSize: "12px",
  },
};

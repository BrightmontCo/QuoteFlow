```tsx
"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  service?: string | null;
  problem?: string | null;
  status?: string | null;
  "appointment date"?: string | null;
  "quote amount"?: number | null;
};

export default function LeadsPage() {
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

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <nav style={styles.nav}>
          <a href="/" style={styles.logo}>
            QuoteFlow
          </a>

          <div style={styles.navLinks}>
            <a href="/" style={styles.navLink}>
              Dashboard
            </a>

            <a href="/leads" style={styles.activeLink}>
              Leads
            </a>

            <a href="/quotes" style={styles.navLink}>
              Quotes
            </a>

            <a href="/appointments" style={styles.navLink}>
              Appointments
            </a>
          </div>
        </nav>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Leads</h1>

            <p style={styles.subtitle}>
              Manage your customers and leads.
            </p>
          </div>

          <a href="/leads/new" style={styles.newButton}>
            + New Lead
          </a>
        </div>

        <section style={styles.card}>

          {loading ? (
            <div style={styles.message}>
              Loading leads...
            </div>
          ) : leads.length === 0 ? (
            <div style={styles.empty}>
              <h2>No leads yet</h2>

              <p>
                Add your first customer to get started.
              </p>

              <a href="/leads/new" style={styles.newButton}>
                + New Lead
              </a>
            </div>
          ) : (
            <div>

              {leads.map((lead) => (
                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  style={styles.lead}
                >
                  <div style={styles.avatar}>
                    {(lead.name || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div style={styles.info}>
                    <div style={styles.name}>
                      {lead.name}
                    </div>

                    <div style={styles.service}>
                      {lead.service || "No service"}
                    </div>
                  </div>

                  <div style={styles.problem}>
                    {lead.problem || "No description"}
                  </div>

                  <div>
                    <span style={styles.status}>
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div style={styles.phone}>
                    {lead.phone || lead.email || ""}
                  </div>

                  <div style={styles.arrow}>
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
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  container: {
    maxWidth: "1200px",
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
    gap: "28px",
    alignItems: "center",
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
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  newButton: {
    background: "#111827",
    color: "white",
    padding: "11px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  lead: {
    display: "grid",
    gridTemplateColumns:
      "45px 1.5fr 2fr 1fr 1.5fr 25px",
    gap: "15px",
    alignItems: "center",
    padding: "17px 20px",
    borderBottom: "1px solid #f0f0f0",
    textDecoration: "none",
    color: "#111827",
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

  info: {
    minWidth: 0,
  },

  name: {
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: "4px",
  },

  service: {
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

  status: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },

  phone: {
    color: "#6b7280",
    fontSize: "12px",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  message: {
    padding: "50px",
    textAlign: "center" as const,
    color: "#6b7280",
  },

  empty: {
    textAlign: "center" as const,
    padding: "60px 20px",
  },
};
```

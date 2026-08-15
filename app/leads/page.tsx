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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Unable to load leads.");
          return;
        }

        setLeads(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load leads.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Leads</h1>
          <p style={styles.muted}>Loading leads...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Leads</h1>
            <p style={styles.subtitle}>
              Manage your customers and service requests.
            </p>
          </div>

          <a href="/" style={styles.dashboardButton}>
            Dashboard
          </a>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!error && leads.length === 0 && (
          <div style={styles.empty}>
            <h2>No leads yet</h2>
            <p>
              Customer requests will appear here when they are submitted.
            </p>
          </div>
        )}

        <div style={styles.grid}>
          {leads.map((lead) => (
            <a
              key={lead.id}
              href={`/leads/${lead.id}`}
              style={styles.leadCard}
            >
              <div style={styles.cardTop}>
                <div>
                  <h2 style={styles.name}>
                    {lead.name}
                  </h2>

                  <p style={styles.service}>
                    {lead.service || "HVAC Service"}
                  </p>
                </div>

                <span style={styles.status}>
                  {lead.status || "New"}
                </span>
              </div>

              <div style={styles.problem}>
                {lead.problem || "No problem description"}
              </div>

              <div style={styles.details}>
                {lead.phone && (
                  <div>
                    <strong>Phone:</strong>{" "}
                    {lead.phone}
                  </div>
                )}

                {lead.email && (
                  <div>
                    <strong>Email:</strong>{" "}
                    {lead.email}
                  </div>
                )}

                {lead["appointment date"] && (
                  <div>
                    <strong>Appointment:</strong>{" "}
                    {lead["appointment date"]}
                  </div>
                )}
              </div>

              <div style={styles.view}>
                View Customer →
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "40px",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#111827",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
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

  muted: {
    color: "#6b7280",
  },

  dashboardButton: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "10px 16px",
    textDecoration: "none",
    color: "#374151",
    fontSize: "14px",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  leadCard: {
    display: "block",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    textDecoration: "none",
    color: "#111827",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "18px",
  },

  name: {
    margin: 0,
    fontSize: "20px",
  },

  service: {
    marginTop: "6px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  status: {
    background: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  problem: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "18px",
    color: "#4b5563",
    fontSize: "14px",
  },

  details: {
    display: "grid",
    gap: "8px",
    color: "#4b5563",
    fontSize: "13px",
  },

  view: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: 600,
  },

  empty: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "50px",
    textAlign: "center" as const,
    color: "#6b7280",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
  },
};

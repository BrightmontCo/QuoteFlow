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
    async function load() {
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
      } catch {
        setError("Unable to load leads.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Leads</h1>
            <p style={styles.subtitle}>
              Manage your customers and service requests.
            </p>
          </div>

          <a href="/" style={styles.button}>
            Dashboard
          </a>
        </div>

        {loading && (
          <div style={styles.card}>
            Loading leads...
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {!loading && !error && leads.length === 0 && (
          <div style={styles.card}>
            <h2>No leads yet</h2>
            <p>
              Customer requests will appear here.
            </p>
          </div>
        )}

        <div style={styles.grid}>
          {leads.map((lead) => (
            <a
              key={lead.id}
              href={`/leads/${lead.id}`}
              style={styles.lead}
            >
              <div style={styles.leadHeader}>
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

              <p style={styles.problem}>
                {lead.problem || "No problem description"}
              </p>

              {lead.phone && (
                <p style={styles.detail}>
                  📞 {lead.phone}
                </p>
              )}

              {lead.email && (
                <p style={styles.detail}>
                  ✉️ {lead.email}
                </p>
              )}

              {lead["appointment date"] && (
                <p style={styles.detail}>
                  📅 {lead["appointment date"]}
                </p>
              )}

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
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    color: "#6b7280",
  },

  button: {
    background: "#111827",
    color: "white",
    padding: "11px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  lead: {
    display: "block",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    color: "#111827",
    textDecoration: "none",
  },

  leadHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  name: {
    margin: 0,
    fontSize: "20px",
  },

  service: {
    color: "#6b7280",
    marginTop: "6px",
  },

  status: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },

  problem: {
    background: "#f9fafb",
    padding: "12px",
    borderRadius: "8px",
    color: "#4b5563",
  },

  detail: {
    color: "#4b5563",
    fontSize: "14px",
  },

  view: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
    color: "#2563eb",
    fontWeight: 600,
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "25px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

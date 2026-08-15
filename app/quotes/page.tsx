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

export default function QuotesPage() {
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
        console.error("Unable to load quotes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const quotes = leads.filter(
    (lead) =>
      lead["quote amount"] !== null &&
      lead["quote amount"] !== undefined
  );

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

            <a href="/leads" style={styles.navLink}>
              Leads
            </a>

            <a href="/quotes" style={styles.activeLink}>
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

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Quotes
            </h1>

            <p style={styles.subtitle}>
              Manage customer quotes and pricing.
            </p>
          </div>

          <div style={styles.total}>
            {quotes.length} quotes
          </div>
        </div>

        <div style={styles.stats}>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Total Quotes
            </div>

            <div style={styles.statValue}>
              {quotes.length}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Pipeline Value
            </div>

            <div style={styles.statValue}>
              $
              {quotes
                .reduce(
                  (total, lead) =>
                    total +
                    Number(
                      lead["quote amount"] || 0
                    ),
                  0
                )
                .toLocaleString()}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Average Quote
            </div>

            <div style={styles.statValue}>
              $
              {quotes.length
                ? Math.round(
                    quotes.reduce(
                      (total, lead) =>
                        total +
                        Number(
                          lead["quote amount"] || 0
                        ),
                      0
                    ) / quotes.length
                  ).toLocaleString()
                : "0"}
            </div>
          </div>

        </div>

        <section style={styles.card}>

          {loading ? (
            <div style={styles.empty}>
              Loading quotes...
            </div>
          ) : quotes.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                $
              </div>

              <h2 style={styles.emptyTitle}>
                No quotes yet
              </h2>

              <p style={styles.emptyText}>
                Add a quote amount to a customer
                from their customer profile and
                it will appear here.
              </p>

              <a
                href="/leads"
                style={styles.button}
              >
                View Leads
              </a>
            </div>
          ) : (
            <div>

              <div style={styles.tableHeader}>
                <div>Customer</div>
                <div>Service</div>
                <div>Status</div>
                <div>Quote</div>
                <div>Appointment</div>
                <div></div>
              </div>

              {quotes.map((lead) => (
                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  style={styles.row}
                >

                  <div style={styles.customer}>
                    <div style={styles.avatar}>
                      {lead.name
                        ? lead.name
                            .charAt(0)
                            .toUpperCase()
                        : "?"}
                    </div>

                    <div>
                      <div style={styles.customerName}>
                        {lead.name}
                      </div>

                      <div style={styles.contact}>
                        {lead.phone ||
                          lead.email ||
                          "No contact"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.service}>
                    {lead.service || "—"}
                  </div>

                  <div>
                    <span style={styles.status}>
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div style={styles.amount}>
                    $
                    {Number(
                      lead["quote amount"]
                    ).toLocaleString()}
                  </div>

                  <div style={styles.date}>
                    {lead["appointment date"]
                      ? formatDate(
                          lead["appointment date"]
                        )
                      : "Not scheduled"}
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

function formatDate(date: string) {
  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[1]}/${parts[2]}/${parts[0]}`;
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

  total: {
    color: "#6b7280",
    fontSize: "14px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "22px",
  },

  statLabel: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "8px",
  },

  statValue: {
    fontSize: "26px",
    fontWeight: 700,
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1.3fr 1fr 1fr 1.3fr 30px",
    gap: "15px",
    padding: "14px 20px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
  },

  row: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1.3fr 1fr 1fr 1.3fr 30px",
    gap: "15px",
    alignItems: "center",
    padding: "17px 20px",
    borderBottom: "1px solid #f0f0f0",
    color: "#111827",
    textDecoration: "none",
  },

  customer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
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

  customerName: {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "3px",
  },

  contact: {
    color: "#9ca3af",
    fontSize: "12px",
  },

  service: {
    fontSize: "13px",
    color: "#374151",
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

  amount: {
    fontSize: "15px",
    fontWeight: 700,
  },

  date: {
    fontSize: "13px",
    color: "#374151",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  empty: {
    textAlign: "center" as const,
    padding: "75px 30px",
  },

  emptyIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: 700,
  },

  emptyTitle: {
    margin: 0,
    fontSize: "20px",
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
};

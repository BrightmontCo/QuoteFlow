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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(searchText) ||
      lead.phone?.toLowerCase().includes(searchText) ||
      lead.email?.toLowerCase().includes(searchText) ||
      lead.service?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      (lead.status || "New") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* NAVIGATION */}

        <nav style={styles.nav}>
          <div style={styles.logo}>
            QuoteFlow
          </div>

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

            <span style={styles.navLink}>
              Contractor CRM
            </span>
          </div>
        </nav>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Leads
            </h1>

            <p style={styles.subtitle}>
              Manage your customer requests and opportunities.
            </p>
          </div>

          <div style={styles.total}>
            {leads.length} total leads
          </div>
        </div>

        {/* FILTER BAR */}

        <div style={styles.filterBar}>

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={styles.search}
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={styles.filter}
          >
            <option value="All">
              All statuses
            </option>

            <option value="New">
              New
            </option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Quoted">
              Quoted
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>

        {/* LEADS TABLE */}

        <section style={styles.card}>

          {loading ? (
            <div style={styles.empty}>
              Loading leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={styles.empty}>
              <h2 style={styles.emptyTitle}>
                No leads found
              </h2>

              <p style={styles.emptyText}>
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div style={styles.table}>

              <div style={styles.tableHeader}>
                <div>Customer</div>
                <div>Service</div>
                <div>Status</div>
                <div>Appointment</div>
                <div>Quote</div>
                <div></div>
              </div>

              {filteredLeads.map((lead) => (

                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  style={styles.row}
                >

                  <div style={styles.customer}>
                    <div style={styles.avatar}>
                      {lead.name
                        ? lead.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>

                    <div>
                      <div style={styles.customerName}>
                        {lead.name}
                      </div>

                      <div style={styles.customerContact}>
                        {lead.phone || lead.email || "No contact"}
                      </div>
                    </div>
                  </div>

                  <div style={styles.service}>
                    {lead.service || "—"}
                  </div>

                  <div>
                    <span
                      style={{
                        ...styles.status,
                        ...(lead.status === "Completed"
                          ? styles.completed
                          : lead.status === "Quoted"
                          ? styles.quoted
                          : lead.status === "Scheduled"
                          ? styles.scheduled
                          : {}),
                      }}
                    >
                      {lead.status || "New"}
                    </span>
                  </div>

                  <div style={styles.appointment}>
                    {lead["appointment date"]
                      ? formatDate(
                          lead["appointment date"]
                        )
                      : "Not scheduled"}
                  </div>

                  <div style={styles.quote}>
                    {lead["quote amount"] !== null &&
                    lead["quote amount"] !== undefined
                      ? `$${Number(
                          lead["quote amount"]
                        ).toLocaleString()}`
                      : "—"}
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
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },

  total: {
    color: "#6b7280",
    fontSize: "14px",
  },

  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },

  search: {
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },

  filter: {
    width: "180px",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    fontSize: "14px",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  table: {
    width: "100%",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1.2fr 1fr 1.2fr 1fr 30px",
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
      "2fr 1.2fr 1fr 1.2fr 1fr 30px",
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

  customerContact: {
    color: "#9ca3af",
    fontSize: "12px",
  },

  service: {
    fontSize: "13px",
    color: "#374151",
  },

  status: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },

  completed: {
    background: "#dcfce7",
    color: "#166534",
  },

  quoted: {
    background: "#fef3c7",
    color: "#92400e",
  },

  scheduled: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  appointment: {
    fontSize: "13px",
    color: "#374151",
  },

  quote: {
    fontSize: "13px",
    fontWeight: 600,
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  empty: {
    padding: "70px 20px",
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

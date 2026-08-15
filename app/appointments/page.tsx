"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  status: string | null;
  "appointment date": string | null;
};

export default function AppointmentsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Upcoming");

  useEffect(() => {
    async function loadAppointments() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (result.success) {
          setLeads(result.data || []);
        }
      } catch (error) {
        console.error(
          "Unable to load appointments:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  const appointments = leads
    .filter(
      (lead) =>
        lead["appointment date"] !== null &&
        lead["appointment date"] !== ""
    )
    .sort((a, b) => {
      return (
        new Date(
          a["appointment date"] || ""
        ).getTime() -
        new Date(
          b["appointment date"] || ""
        ).getTime()
      );
    });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments =
    appointments.filter((appointment) => {
      const appointmentDate = new Date(
        appointment["appointment date"] || ""
      );

      appointmentDate.setHours(0, 0, 0, 0);

      if (filter === "Upcoming") {
        return appointmentDate >= today;
      }

      if (filter === "Past") {
        return appointmentDate < today;
      }

      return true;
    });

  const upcomingCount = appointments.filter(
    (appointment) => {
      const date = new Date(
        appointment["appointment date"] || ""
      );

      date.setHours(0, 0, 0, 0);

      return date >= today;
    }
  ).length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* NAVIGATION */}

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

            <a href="/quotes" style={styles.navLink}>
              Quotes
            </a>

            <a
              href="/appointments"
              style={styles.activeLink}
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
              Appointments
            </h1>

            <p style={styles.subtitle}>
              Keep track of scheduled customer jobs.
            </p>
          </div>

          <div style={styles.total}>
            {upcomingCount} upcoming
          </div>
        </div>

        {/* STATS */}

        <div style={styles.stats}>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Total Appointments
            </div>

            <div style={styles.statValue}>
              {appointments.length}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Upcoming
            </div>

            <div style={styles.statValue}>
              {upcomingCount}
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              Completed
            </div>

            <div style={styles.statValue}>
              {
                leads.filter(
                  (lead) =>
                    lead.status === "Completed" &&
                    lead["appointment date"]
                ).length
              }
            </div>
          </div>

        </div>

        {/* FILTERS */}

        <div style={styles.filters}>

          <button
            type="button"
            onClick={() => setFilter("Upcoming")}
            style={{
              ...styles.filterButton,
              ...(filter === "Upcoming"
                ? styles.activeFilter
                : {}),
            }}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setFilter("All")}
            style={{
              ...styles.filterButton,
              ...(filter === "All"
                ? styles.activeFilter
                : {}),
            }}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFilter("Past")}
            style={{
              ...styles.filterButton,
              ...(filter === "Past"
                ? styles.activeFilter
                : {}),
            }}
          >
            Past
          </button>

        </div>

        {/* APPOINTMENTS */}

        <section style={styles.card}>

          {loading ? (
            <div style={styles.empty}>
              Loading appointments...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div style={styles.empty}>

              <div style={styles.calendarIcon}>
                📅
              </div>

              <h2 style={styles.emptyTitle}>
                No appointments
              </h2>

              <p style={styles.emptyText}>
                Customers with an appointment date
                will appear here automatically.
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

              {/* TABLE HEADER */}

              <div style={styles.tableHeader}>
                <div>Date</div>
                <div>Customer</div>
                <div>Service</div>
                <div>Status</div>
                <div>Contact</div>
                <div></div>
              </div>

              {/* ROWS */}

              {filteredAppointments.map(
                (appointment) => (

                  <a
                    key={appointment.id}
                    href={`/leads/${appointment.id}`}
                    style={styles.row}
                  >

                    <div style={styles.dateBox}>

                      <div style={styles.month}>
                        {getMonth(
                          appointment[
                            "appointment date"
                          ] || ""
                        )}
                      </div>

                      <div style={styles.day}>
                        {getDay(
                          appointment[
                            "appointment date"
                          ] || ""
                        )}
                      </div>

                    </div>

                    <div style={styles.customer}>

                      <div style={styles.avatar}>
                        {appointment.name
                          ? appointment.name
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                      <div>
                        <div
                          style={
                            styles.customerName
                          }
                        >
                          {appointment.name}
                        </div>

                        <div
                          style={styles.email}
                        >
                          {appointment.email ||
                            "No email"}
                        </div>
                      </div>

                    </div>

                    <div style={styles.service}>
                      {appointment.service ||
                        "—"}
                    </div>

                    <div>
                      <span
                        style={getStatusStyle(
                          appointment.status
                        )}
                      >
                        {appointment.status ||
                          "New"}
                      </span>
                    </div>

                    <div style={styles.phone}>
                      {appointment.phone ||
                        "No phone"}
                    </div>

                    <div style={styles.arrow}>
                      →
                    </div>

                  </a>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

function getMonth(date: string) {
  const parts = date.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const month = Number(parts[1]);

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return months[month - 1] || "";
}

function getDay(date: string) {
  const parts = date.split("-");

  if (parts.length !== 3) {
    return "";
  }

  return Number(parts[2]).toString();
}

function getStatusStyle(status: string | null) {
  if (status === "Completed") {
    return {
      ...styles.status,
      ...styles.completed,
    };
  }

  if (status === "Scheduled") {
    return {
      ...styles.status,
      ...styles.scheduled,
    };
  }

  if (status === "Cancelled") {
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

  filters: {
    display: "flex",
    gap: "8px",
    marginBottom: "18px",
  },

  filterButton: {
    border: "1px solid #d1d5db",
    background: "white",
    color: "#6b7280",
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  },

  activeFilter: {
    background: "#111827",
    color: "white",
    borderColor: "#111827",
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
      "1fr 2fr 1.3fr 1fr 1.5fr 30px",
    gap: "15px",
    alignItems: "center",
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
      "1fr 2fr 1.3fr 1fr 1.5fr 30px",
    gap: "15px",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    color: "#111827",
    textDecoration: "none",
  },

  dateBox: {
    width: "48px",
    textAlign: "center" as const,
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  },

  month: {
    background: "#f3f4f6",
    color: "#6b7280",
    fontSize: "10px",
    fontWeight: 700,
    padding: "4px",
  },

  day: {
    fontSize: "18px",
    fontWeight: 700,
    padding: "6px",
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

  email: {
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

  scheduled: {
    background: "#ede9fe",
    color: "#6d28d9",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  phone: {
    color: "#374151",
    fontSize: "13px",
  },

  arrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },

  empty: {
    textAlign: "center" as const,
    padding: "75px 30px",
  },

  calendarIcon: {
    fontSize: "35px",
    marginBottom: "12px",
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

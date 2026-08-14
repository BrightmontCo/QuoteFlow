"use client";

import { useState } from "react";

const leads = [
  {
    name: "John Smith",
    service: "AC Repair",
    status: "New",
    quote: "—",
  },
  {
    name: "Sarah Miller",
    service: "AC Installation",
    status: "Quote Sent",
    quote: "$3,500",
  },
  {
    name: "Mike Davis",
    service: "AC Repair",
    status: "Booked",
    quote: "$350",
  },
];

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>QuoteFlow</div>

        <nav>
          {["Dashboard", "Leads", "Quotes", "Appointments"].map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              style={{
                ...styles.navButton,
                ...(activePage === item ? styles.activeNav : {}),
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <p style={styles.smallText}>Contractor CRM</p>
            <h1 style={styles.title}>{activePage}</h1>
            <p style={styles.subtitle}>
              Manage your leads, quotes, and jobs in one place.
            </p>
          </div>

          <div style={styles.account}>
            <div style={styles.avatar}>QF</div>
            <span>QuoteFlow</span>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section style={styles.stats}>
              <Stat title="New Leads" value="3" />
              <Stat title="Quotes Awaiting" value="5" />
              <Stat title="Appointments" value="4" />
              <Stat title="Pipeline Value" value="$6,420" />
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Recent Leads</h2>
                <span style={styles.muted}>3 customers</span>
              </div>

              <div style={styles.table}>
                <div style={styles.tableRowHeader}>
                  <span>Customer</span>
                  <span>Service</span>
                  <span>Status</span>
                  <span>Quote</span>
                </div>

                {leads.map((lead) => (
                  <div style={styles.tableRow} key={lead.name}>
                    <strong>{lead.name}</strong>
                    <span>{lead.service}</span>
                    <span>
                      <Status status={lead.status} />
                    </span>
                    <span>{lead.quote}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activePage !== "Dashboard" && (
          <section style={styles.panel}>
            <div style={styles.empty}>
              <h2>{activePage}</h2>
              <p>
                This section will be connected to your CRM in the next step.
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.stat}>
      <p style={styles.statTitle}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

function Status({ status }: { status: string }) {
  return <span style={styles.status}>{status}</span>;
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
  navButton: {
    width: "100%",
    padding: "12px",
    marginBottom: "6px",
    border: "none",
    background: "transparent",
    borderRadius: "8px",
    textAlign: "left",
    cursor: "pointer",
    color: "#667085",
    fontSize: "14px",
  },
  activeNav: {
    background: "#eef1f5",
    color: "#172033",
    fontWeight: 700,
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
  table: {
    width: "100%",
  },
  tableRowHeader: {
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
  },
  empty: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#667085",
  },
};

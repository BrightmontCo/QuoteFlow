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
  "created At": string | null;
};

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads", { cache: "no-store" })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLeads(result.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const newLeads = leads.filter(
    (lead) => (lead.status || "").toLowerCase() === "new"
  );

  const appointments = leads.filter(
    (lead) => lead["appointment date"]
  );

  const pipelineValue = leads.reduce(
    (total, lead) => total + Number(lead["quote amount"] || 0),
    0
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f5f7fa;
          color: #111827;
        }

        .app {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: white;
          border-right: 1px solid #e5e7eb;
          padding: 28px 20px;
          flex-shrink: 0;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 40px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav a {
          display: block;
          padding: 12px 14px;
          border-radius: 8px;
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
        }

        .nav a:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .nav a.active {
          background: #111827;
          color: white;
          font-weight: 600;
        }

        .content {
          flex: 1;
          padding: 40px;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          margin: 0;
          font-size: 30px;
        }

        .header p {
          color: #6b7280;
          margin-top: 8px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .label {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .number {
          font-size: 30px;
          font-weight: 700;
        }

        .leads {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .leads-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .leads-header h2 {
          margin: 0;
        }

        .leads-header p {
          color: #6b7280;
          margin-bottom: 0;
        }

        .lead {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .lead:last-child {
          border-bottom: none;
        }

        .lead-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lead-name {
          font-weight: 600;
          font-size: 17px;
        }

        .lead-service {
          color: #6b7280;
          margin-top: 5px;
        }

        .right {
          text-align: right;
        }

        .status {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .phone {
          color: #6b7280;
          margin-top: 8px;
          font-size: 14px;
        }

        .appointment {
          color: #6b7280;
          font-size: 13px;
          margin-top: 4px;
        }

        .problem {
          margin-top: 14px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          color: #4b5563;
        }

        .empty {
          padding: 40px 24px;
          color: #6b7280;
        }

        @media (max-width: 1000px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .sidebar {
            width: 180px;
          }

          .content {
            padding: 24px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .lead-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .right {
            text-align: left;
          }
        }
      `}</style>

      <div className="app">

        <aside className="sidebar">

          <div className="logo">
            QuoteFlow
          </div>

          <nav className="nav">

            <a href="/" className="active">
              Dashboard
            </a>

            <a href="/leads">
              Leads
            </a>

            <a href="#">
              Quotes
            </a>

            <a href="#">
              Appointments
            </a>

            <a href="#">
              Contractor CRM
            </a>

          </nav>

        </aside>

        <main className="content">

          <div className="header">
            <h1>Dashboard</h1>
            <p>Manage your leads, quotes, and jobs.</p>
          </div>

          <div className="stats">

            <div className="card">
              <div className="label">New Leads</div>
              <div className="number">
                {loading ? "..." : newLeads.length}
              </div>
            </div>

            <div className="card">
              <div className="label">Quotes Awaiting</div>
              <div className="number">0</div>
            </div>

            <div className="card">
              <div className="label">Appointments</div>
              <div className="number">
                {loading ? "..." : appointments.length}
              </div>
            </div>

            <div className="card">
              <div className="label">Pipeline Value</div>
              <div className="number">
                ${pipelineValue.toLocaleString()}
              </div>
            </div>

          </div>

          <section className="leads">

            <div className="leads-header">
              <h2>Recent Leads</h2>
              <p>
                {loading
                  ? "Loading..."
                  : `${leads.length} customers`}
              </p>
            </div>

            {loading ? (

              <div className="empty">
                Loading leads...
              </div>

            ) : leads.length === 0 ? (

              <div className="empty">
                No leads yet.
              </div>

            ) : (

              leads.map((lead) => (

                <div className="lead" key={lead.id}>

                  <div className="lead-top">

                    <div>
                      <div className="lead-name">
                        {lead.name}
                      </div>

                      <div className="lead-service">
                        {lead.service || "Service not specified"}
                      </div>
                    </div>

                    <div className="right">

                      <span className="status">
                        {lead.status || "New"}
                      </span>

                      {lead.phone && (
                        <div className="phone">
                          {lead.phone}
                        </div>
                      )}

                      {lead["appointment date"] && (
                        <div className="appointment">
                          Appointment:{" "}
                          {lead["appointment date"]}
                        </div>
                      )}

                    </div>

                  </div>

                  {lead.problem && (
                    <div className="problem">
                      <strong>Problem:</strong>{" "}
                      {lead.problem}
                    </div>
                  )}

                </div>

              ))

            )}

          </section>

        </main>

      </div>
    </>
  );
}

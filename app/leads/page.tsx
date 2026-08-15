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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLeads(result.data || []);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f5f7fa;
          color: #111827;
        }

        .page {
          min-height: 100vh;
          padding: 40px;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        h1 {
          margin: 0;
          font-size: 30px;
        }

        .count {
          color: #6b7280;
          margin-top: 8px;
        }

        .back {
          padding: 10px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #374151;
          text-decoration: none;
        }

        .back:hover {
          background: #f9fafb;
        }

        .card {
          display: block;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 16px;
          text-decoration: none;
          color: inherit;
          transition: 0.15s;
        }

        .card:hover {
          border-color: #9ca3af;
          transform: translateY(-1px);
        }

        .top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .name {
          font-size: 20px;
          font-weight: 700;
        }

        .service {
          color: #6b7280;
          margin-top: 6px;
        }

        .status {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 22px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .detail {
          color: #4b5563;
          font-size: 14px;
        }

        .detail strong {
          color: #111827;
        }

        .problem {
          margin-top: 20px;
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          color: #4b5563;
        }

        .empty {
          background: white;
          padding: 40px;
          border-radius: 12px;
          color: #6b7280;
        }

        @media (max-width: 700px) {
          .page {
            padding: 20px;
          }

          .top {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .top-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">

          <div className="top">
            <div>
              <h1>Leads</h1>

              <div className="count">
                {loading
                  ? "Loading..."
                  : `${leads.length} customers`}
              </div>
            </div>

            <a href="/" className="back">
              ← Dashboard
            </a>
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
              <a
                href={`/leads/${lead.id}`}
                className="card"
                key={lead.id}
              >

                <div className="top-row">

                  <div>
                    <div className="name">
                      {lead.name}
                    </div>

                    <div className="service">
                      {lead.service || "No service specified"}
                    </div>
                  </div>

                  <span className="status">
                    {lead.status || "New"}
                  </span>

                </div>

                <div className="details">

                  <div className="detail">
                    <strong>Phone:</strong>{" "}
                    {lead.phone || "—"}
                  </div>

                  <div className="detail">
                    <strong>Email:</strong>{" "}
                    {lead.email || "—"}
                  </div>

                  <div className="detail">
                    <strong>Address:</strong>{" "}
                    {lead.address || "—"}
                  </div>

                  <div className="detail">
                    <strong>Appointment:</strong>{" "}
                    {lead["appointment date"] || "—"}
                  </div>

                </div>

                {lead.problem && (
                  <div className="problem">
                    <strong>Problem:</strong>{" "}
                    {lead.problem}
                  </div>
                )}

              </a>
            ))
          )}

        </div>
      </div>
    </>
  );
}

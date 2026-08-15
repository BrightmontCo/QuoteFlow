"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function LeadDetails() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLead() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (result.success) {
          const found = result.data.find(
            (item: Lead) => item.id === id
          );

          setLead(found || null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <p>Loading customer...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="page">
        <div className="container">
          <h1>Customer not found</h1>

          <a href="/leads" className="back">
            ← Back to Leads
          </a>
        </div>
      </div>
    );
  }

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

        .back {
          display: inline-block;
          margin-bottom: 30px;
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

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .title {
          margin: 0;
          font-size: 32px;
        }

        .subtitle {
          margin-top: 8px;
          color: #6b7280;
          font-size: 16px;
        }

        .status {
          padding: 8px 14px;
          border-radius: 999px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .card-title {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .info {
          margin-bottom: 18px;
        }

        .info:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .value {
          font-size: 15px;
          word-break: break-word;
        }

        .quote {
          font-size: 32px;
          font-weight: 700;
        }

        .notes {
          color: #4b5563;
          line-height: 1.6;
        }

        @media (max-width: 700px) {
          .page {
            padding: 20px;
          }

          .header {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">

          <a href="/leads" className="back">
            ← Back to Leads
          </a>

          <div className="header">
            <div>
              <h1 className="title">
                {lead.name}
              </h1>

              <div className="subtitle">
                {lead.service || "HVAC Service"}
              </div>
            </div>

            <span className="status">
              {lead.status || "New"}
            </span>
          </div>

          <div className="grid">

            <div className="card">
              <h2 className="card-title">
                Customer Information
              </h2>

              <Info
                label="Phone"
                value={lead.phone}
              />

              <Info
                label="Email"
                value={lead.email}
              />

              <Info
                label="Address"
                value={lead.address}
              />
            </div>

            <div className="card">
              <h2 className="card-title">
                Service Request
              </h2>

              <Info
                label="Service"
                value={lead.service}
              />

              <Info
                label="Problem"
                value={lead.problem}
              />
            </div>

            <div className="card">
              <h2 className="card-title">
                Appointment
              </h2>

              <Info
                label="Date"
                value={lead["appointment date"]}
              />

              <Info
                label="Status"
                value={lead.status || "New"}
              />
            </div>

            <div className="card">
              <h2 className="card-title">
                Quote
              </h2>

              <div className="quote">
                {lead["quote amount"] !== null
                  ? `$${lead["quote amount"]}`
                  : "$0"}
              </div>

              <div className="label">
                Quote amount
              </div>
            </div>

          </div>

          <div className="card">
            <h2 className="card-title">
              Notes
            </h2>

            <div className="notes">
              {lead.notes || "No notes yet."}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="info">
      <div className="label">
        {label}
      </div>

      <div className="value">
        {value || "—"}
      </div>
    </div>
  );
}

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
};

export default function LeadDetails() {
  const params = useParams();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

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

          if (found) {
            setLead(found);
            setStatus(found.status || "New");
            setQuoteAmount(
              found["quote amount"] !== null
                ? String(found["quote amount"])
                : ""
            );
            setAppointmentDate(
              found["appointment date"] || ""
            );
            setNotes(found.notes || "");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id]);

  async function saveChanges() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          quoteAmount,
          appointmentDate,
          notes,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error || "Unable to save changes"
        );
      }

      setMessage("Changes saved successfully.");

      setLead((current) =>
        current
          ? {
              ...current,
              status,
              "quote amount": quoteAmount
                ? Number(quoteAmount)
                : null,
              "appointment date": appointmentDate || null,
              notes: notes || null,
            }
          : current
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

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

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 20px;
        }

        .title {
          margin: 0;
          font-size: 32px;
        }

        .subtitle {
          margin-top: 8px;
          color: #6b7280;
        }

        .status-badge {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 8px 14px;
          border-radius: 999px;
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

        .label {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .value {
          font-size: 15px;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 11px 12px;
          font-size: 14px;
          font-family: inherit;
          background: white;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #2563eb;
        }

        .quote {
          font-size: 28px;
          font-weight: 700;
        }

        .save-section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-top: 0;
        }

        .save-button {
          border: none;
          background: #111827;
          color: white;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .save-button:hover {
          background: #374151;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          margin-top: 14px;
          color: #166534;
          font-size: 14px;
        }

        .problem {
          color: #4b5563;
          line-height: 1.6;
        }

        @media (max-width: 700px) {
          .page {
            padding: 20px;
          }

          .header {
            align-items: flex-start;
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

            <div className="status-badge">
              {status || "New"}
            </div>
          </div>

          <div className="grid">

            <div className="card">
              <h2 className="card-title">
                Customer Information
              </h2>

              <Info label="Phone" value={lead.phone} />
              <Info label="Email" value={lead.email} />
              <Info label="Address" value={lead.address} />
            </div>

            <div className="card">
              <h2 className="card-title">
                Service Request
              </h2>

              <Info label="Service" value={lead.service} />

              <div className="info">
                <div className="label">
                  Problem
                </div>

                <div className="problem">
                  {lead.problem || "—"}
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">
                Manage Appointment
              </h2>

              <div className="info">
                <div className="label">
                  Appointment Date
                </div>

                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) =>
                    setAppointmentDate(e.target.value)
                  }
                />
              </div>

              <div className="info">
                <div className="label">
                  Status
                </div>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">
                Quote
              </h2>

              <div className="info">
                <div className="label">
                  Quote Amount
                </div>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={quoteAmount}
                  onChange={(e) =>
                    setQuoteAmount(e.target.value)
                  }
                />
              </div>

              <div className="quote">
                $
                {quoteAmount
                  ? Number(quoteAmount).toFixed(2)
                  : "0.00"}
              </div>
            </div>

          </div>

          <div className="card">
            <h2 className="card-title">
              Notes
            </h2>

            <textarea
              placeholder="Add notes about this customer..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />
          </div>

          <div className="save-section">
            <button
              className="save-button"
              onClick={saveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <div className="message">
                {message}
              </div>
            )}
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

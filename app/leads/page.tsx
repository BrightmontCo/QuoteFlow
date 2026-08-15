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
  const id = String(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadLead() {
      try {
        const response = await fetch(
          `/api/leads?id=${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!result.success) {
          setError(result.error || "Unable to load customer.");
          return;
        }

        if (!result.data || result.data.length === 0) {
          setError("Customer not found.");
          return;
        }

        const found = result.data[0];

        setLead(found);
        setStatus(found.status || "New");
        setQuoteAmount(
          found["quote amount"] != null
            ? String(found["quote amount"])
            : ""
        );
        setAppointmentDate(
          found["appointment date"] || ""
        );
        setNotes(found.notes || "");
      } catch (err) {
        console.error(err);
        setError("Unable to load customer.");
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id]);

  async function saveChanges() {
    setSaving(true);

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
        alert(result.error || "Unable to save changes.");
        return;
      }

      setLead((current) =>
        current
          ? {
              ...current,
              status,
              "quote amount":
                quoteAmount === ""
                  ? null
                  : Number(quoteAmount),
              "appointment date":
                appointmentDate || null,
              notes: notes || null,
            }
          : current
      );

      alert("Changes saved!");
    } catch (err) {
      console.error(err);
      alert("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p>Loading customer...</p>
        </div>
      </main>
    );
  }

  if (error || !lead) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <a href="/leads" style={styles.back}>
            ← Back to Leads
          </a>

          <div style={styles.card}>
            <h1>Customer not found</h1>
            <p>{error}</p>
            <p style={styles.small}>
              Customer ID: {id}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <a href="/leads" style={styles.back}>
          ← Back to Leads
        </a>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {lead.name}
            </h1>

            <p style={styles.subtitle}>
              {lead.service || "HVAC Service"}
            </p>
          </div>

          <span style={styles.badge}>
            {status || "New"}
          </span>
        </div>

        <div style={styles.grid}>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Customer Information
            </h2>

            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email} />
            <Info label="Address" value={lead.address} />
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Service Request
            </h2>

            <Info label="Service" value={lead.service} />
            <Info label="Problem" value={lead.problem} />
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Appointment
            </h2>

            <label style={styles.label}>
              Appointment Date
            </label>

            <input
              type="date"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              style={styles.input}
            />

            <label style={styles.label}>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              style={styles.input}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Quoted</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Quote
            </h2>

            <label style={styles.label}>
              Quote Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={quoteAmount}
              onChange={(e) =>
                setQuoteAmount(e.target.value)
              }
              placeholder="0.00"
              style={styles.input}
            />

            <div style={styles.quote}>
              $
              {quoteAmount
                ? Number(quoteAmount).toFixed(2)
                : "0.00"}
            </div>
          </div>

        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            Notes
          </h2>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Add notes..."
            style={styles.textarea}
          />
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          style={styles.button}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div style={styles.info}>
      <div style={styles.label}>
        {label}
      </div>

      <div style={styles.value}>
        {value || "—"}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  back: {
    display: "inline-block",
    marginBottom: "30px",
    color: "#374151",
    textDecoration: "none",
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

  badge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "18px",
  },

  info: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "7px",
    marginTop: "15px",
  },

  value: {
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
  },

  quote: {
    marginTop: "20px",
    fontSize: "28px",
    fontWeight: 700,
  },

  button: {
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "13px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  small: {
    color: "#6b7280",
    fontSize: "13px",
  },
};

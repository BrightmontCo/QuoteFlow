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

export default function CustomerPage() {
  const params = useParams();
  const id = String(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState("New");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await fetch(
          `/api/leads?id=${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (
          result.success &&
          result.data &&
          result.data.length > 0
        ) {
          const customer = result.data[0];

          setLead(customer);

          setStatus(customer.status || "New");

          setQuoteAmount(
            customer["quote amount"] !== null &&
              customer["quote amount"] !== undefined
              ? String(customer["quote amount"])
              : ""
          );

          setAppointmentDate(
            customer["appointment date"] || ""
          );

          setNotes(customer.notes || "");
        }
      } catch (error) {
        console.error("Customer loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
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
          id: id,
          status: status,
          quoteAmount: quoteAmount,
          appointmentDate: appointmentDate,
          notes: notes,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(
          result.error || "Unable to save changes."
        );
        return;
      }

      setMessage("Changes saved successfully!");

      if (result.data && result.data.length > 0) {
        setLead(result.data[0]);
      }
    } catch (error) {
      console.error("Save error:", error);

      setMessage("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loading}>
            Loading customer...
          </p>
        </div>
      </main>
    );
  }

  if (!lead) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <a href="/leads" style={styles.back}>
            ← Back to Leads
          </a>

          <div style={styles.card}>
            <h1 style={styles.notFoundTitle}>
              Customer not found
            </h1>

            <p style={styles.muted}>
              Customer ID:
            </p>

            <code style={styles.code}>
              {id}
            </code>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* BACK BUTTON */}

        <a href="/leads" style={styles.back}>
          ← Back to Leads
        </a>

        {/* CUSTOMER HEADER */}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {lead.name}
            </h1>

            <p style={styles.subtitle}>
              {lead.service || "HVAC Service"}
            </p>
          </div>

          <div style={styles.statusBadge}>
            {status}
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

        <div style={styles.grid}>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Customer Information
            </h2>

            <div style={styles.info}>
              <div style={styles.label}>
                Full Name
              </div>

              <div style={styles.value}>
                {lead.name}
              </div>
            </div>

            <div style={styles.info}>
              <div style={styles.label}>
                Phone
              </div>

              <div style={styles.value}>
                {lead.phone || "—"}
              </div>
            </div>

            <div style={styles.info}>
              <div style={styles.label}>
                Email
              </div>

              <div style={styles.value}>
                {lead.email || "—"}
              </div>
            </div>

            <div style={styles.info}>
              <div style={styles.label}>
                Address
              </div>

              <div style={styles.value}>
                {lead.address || "—"}
              </div>
            </div>
          </section>

          {/* SERVICE */}

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Service Request
            </h2>

            <div style={styles.info}>
              <div style={styles.label}>
                Service
              </div>

              <div style={styles.value}>
                {lead.service || "—"}
              </div>
            </div>

            <div style={styles.info}>
              <div style={styles.label}>
                Problem
              </div>

              <div style={styles.problem}>
                {lead.problem || "No problem description"}
              </div>
            </div>
          </section>

          {/* EDITABLE APPOINTMENT */}

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Appointment
            </h2>

            <label style={styles.label}>
              Appointment Date
            </label>

            <input
              type="date"
              value={appointmentDate}
              onChange={(event) => {
                setAppointmentDate(
                  event.target.value
                );
              }}
              style={styles.input}
            />

            <label style={styles.label}>
              Status
            </label>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
              }}
              style={styles.input}
            >
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
          </section>

          {/* EDITABLE QUOTE */}

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Quote
            </h2>

            <label style={styles.label}>
              Quote Amount
            </label>

            <div style={styles.moneyInput}>
              <span style={styles.dollar}>
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={quoteAmount}
                onChange={(event) => {
                  setQuoteAmount(
                    event.target.value
                  );
                }}
                style={styles.moneyField}
              />
            </div>

            <div style={styles.quotePreview}>
              $
              {quoteAmount
                ? Number(quoteAmount).toFixed(2)
                : "0.00"}
            </div>
          </section>

        </div>

        {/* NOTES */}

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            Notes
          </h2>

          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
            }}
            placeholder="Add notes about this customer..."
            style={styles.textarea}
          />
        </section>

        {/* SAVE */}

        <div style={styles.saveArea}>

          {message && (
            <div
              style={
                message.includes("successfully")
                  ? styles.success
                  : styles.error
              }
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            style={{
              ...styles.saveButton,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    color: "#111827",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  loading: {
    fontSize: "16px",
    color: "#6b7280",
  },

  back: {
    display: "inline-block",
    marginBottom: "25px",
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
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
    fontWeight: 700,
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "15px",
  },

  statusBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "9px 15px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
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
    margin: "0 0 20px",
    fontSize: "18px",
    fontWeight: 700,
  },

  info: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "7px",
  },

  value: {
    fontSize: "15px",
    color: "#111827",
  },

  problem: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    color: "#374151",
    minHeight: "40px",
  },

  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    color: "#111827",
    fontSize: "14px",
    cursor: "pointer",
  },

  moneyInput: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
    background: "white",
    marginBottom: "15px",
  },

  dollar: {
    paddingLeft: "12px",
    color: "#6b7280",
    fontSize: "15px",
  },

  moneyField: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "12px",
    fontSize: "14px",
    background: "white",
    color: "#111827",
  },

  quotePreview: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },

  textarea: {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: "130px",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    resize: "vertical" as const,
    outline: "none",
  },

  saveArea: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "5px",
  },

  saveButton: {
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "13px 24px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },

  success: {
    color: "#166534",
    background: "#dcfce7",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
  },

  error: {
    color: "#991b1b",
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
  },

  notFoundTitle: {
    marginTop: 0,
  },

  muted: {
    color: "#6b7280",
    marginBottom: "5px",
  },

  code: {
    background: "#f3f4f6",
    padding: "8px",
    borderRadius: "6px",
  },
};

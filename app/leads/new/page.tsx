"use client";

import { FormEvent, useState } from "react";

export default function NewLeadPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "AC Repair",
    problem: "",
    status: "New",
    quoteAmount: "",
    appointmentDate: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            service: form.service,
            problem: form.problem,
            status: form.status,
            "quote amount":
              form.quoteAmount
                ? Number(form.quoteAmount)
                : null,
            "appointment date":
              form.appointmentDate || null,
            notes: form.notes || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to create lead."
        );
      }

      setMessage(
        "Lead created successfully!"
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        service: "AC Repair",
        problem: "",
        status: "New",
        quoteAmount: "",
        appointmentDate: "",
        notes: "",
      });
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <nav style={styles.nav}>
          <a href="/" style={styles.logo}>
            QuoteFlow
          </a>

          <div style={styles.navLinks}>
            <a
              href="/"
              style={styles.navLink}
            >
              Dashboard
            </a>

            <a
              href="/leads"
              style={styles.activeLink}
            >
              Leads
            </a>

            <a
              href="/quotes"
              style={styles.navLink}
            >
              Quotes
            </a>

            <a
              href="/appointments"
              style={styles.navLink}
            >
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
              New Lead
            </h1>

            <p style={styles.subtitle}>
              Add a new customer to QuoteFlow.
            </p>
          </div>

          <a
            href="/leads"
            style={styles.backButton}
          >
            ← Back to Leads
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          <section style={styles.card}>

            <h2 style={styles.sectionTitle}>
              Customer Information
            </h2>

            <div style={styles.grid}>

              <div style={styles.field}>
                <label style={styles.label}>
                  Full Name *
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="John Smith"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Phone
                </label>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="(555) 123-4567"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="customer@email.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Address
                </label>

                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="123 Main Street"
                  style={styles.input}
                />
              </div>

            </div>

          </section>

          <section style={styles.card}>

            <h2 style={styles.sectionTitle}>
              Service
            </h2>

            <div style={styles.grid}>

              <div style={styles.field}>
                <label style={styles.label}>
                  Service *
                </label>

                <select
                  required
                  value={form.service}
                  onChange={(event) =>
                    updateField(
                      "service",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option>
                    AC Repair
                  </option>

                  <option>
                    AC Installation
                  </option>

                  <option>
                    AC Maintenance
                  </option>

                  <option>
                    Heating
                  </option>

                  <option>
                    Ductwork
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  style={styles.input}
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Problem Description
              </label>

              <textarea
                value={form.problem}
                onChange={(event) =>
                  updateField(
                    "problem",
                    event.target.value
                  )
                }
                placeholder="Describe the customer's problem..."
                style={styles.textarea}
              />
            </div>

          </section>

          <section style={styles.card}>

            <h2 style={styles.sectionTitle}>
              Quote & Appointment
            </h2>

            <div style={styles.grid}>

              <div style={styles.field}>
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
                    value={form.quoteAmount}
                    onChange={(event) =>
                      updateField(
                        "quoteAmount",
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    style={styles.moneyField}
                  />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Appointment Date
                </label>

                <input
                  type="date"
                  value={
                    form.appointmentDate
                  }
                  onChange={(event) =>
                    updateField(
                      "appointmentDate",
                      event.target.value
                    )
                  }
                  style={styles.input}
                />
              </div>

            </div>

          </section>

          <section style={styles.card}>

            <h2 style={styles.sectionTitle}>
              Notes
            </h2>

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value
                )
              }
              placeholder="Add any additional notes..."
              style={styles.largeTextarea}
            />

          </section>

          {message && (
            <div
              style={{
                ...styles.message,
                ...(message.includes(
                  "successfully"
                )
                  ? styles.success
                  : styles.error),
              }}
            >
              {message}
            </div>
          )}

          <div style={styles.actions}>

            <a
              href="/leads"
              style={styles.cancelButton}
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving
                ? "Creating..."
                : "Create Lead"}
            </button>

          </div>

        </form>

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
  },

  container: {
    maxWidth: "1100px",
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
    alignItems: "center",
    justifyContent: "space-between",
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

  backButton: {
    color: "#374151",
    background: "white",
    border: "1px solid #d1d5db",
    padding: "10px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "25px",
  },

  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "7px",
    marginBottom: "18px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    color: "#111827",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: "110px",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical" as const,
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  largeTextarea: {
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: "140px",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical" as const,
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  moneyInput: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    overflow: "hidden",
  },

  dollar: {
    paddingLeft: "12px",
    color: "#6b7280",
    fontSize: "14px",
  },

  moneyField: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "11px 8px",
    fontSize: "14px",
  },

  message: {
    padding: "13px 15px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },

  cancelButton: {
    background: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "11px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },

  saveButton: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "11px 22px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

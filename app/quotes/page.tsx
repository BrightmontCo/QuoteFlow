```tsx
"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  service?: string;
  status?: string;
  quote_amount?: number | string;
  notes?: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/leads", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not load customers");
      }

      setCustomers(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load customers"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateCustomer(
    id: string,
    field: keyof Customer,
    value: string
  ) {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              [field]: value,
            }
          : customer
      )
    );
  }

  async function saveCustomer(customer: Customer) {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/leads/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: customer.name || customer.full_name || "",
          full_name: customer.full_name || customer.name || "",
          phone: customer.phone || "",
          email: customer.email || "",
          address: customer.address || "",
          service: customer.service || "",
          status: customer.status || "New",
          quote_amount: customer.quote_amount || "",
          notes: customer.notes || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save customer");
      }

      alert("Customer saved successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save customer"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <h1 style={styles.title}>Customers</h1>
        <p>Loading customers...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Customers</h1>
          <p style={styles.subtitle}>QuoteFlow customer database</p>
        </div>

        <button onClick={loadCustomers} style={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {customers.length === 0 ? (
        <div style={styles.empty}>
          <h2>No customers yet</h2>
          <p>
            Customers will appear here when they submit a quote request.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {customers.map((customer) => (
            <div key={customer.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.customerName}>
                    {customer.name ||
                      customer.full_name ||
                      "Unnamed Customer"}
                  </h2>

                  <p style={styles.id}>ID: {customer.id}</p>
                </div>

                <select
                  value={customer.status || "New"}
                  onChange={(e) =>
                    updateCustomer(
                      customer.id,
                      "status",
                      e.target.value
                    )
                  }
                  style={styles.status}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div style={styles.grid}>
                <label style={styles.label}>
                  Name
                  <input
                    value={
                      customer.name || customer.full_name || ""
                    }
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "name",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Phone
                  <input
                    value={customer.phone || ""}
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "phone",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Email
                  <input
                    value={customer.email || ""}
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "email",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Service
                  <input
                    value={customer.service || ""}
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "service",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Quote Amount
                  <input
                    type="number"
                    value={customer.quote_amount || ""}
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "quote_amount",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Address
                  <input
                    value={customer.address || ""}
                    onChange={(e) =>
                      updateCustomer(
                        customer.id,
                        "address",
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </label>
              </div>

              <label style={styles.label}>
                Notes
                <textarea
                  value={customer.notes || ""}
                  onChange={(e) =>
                    updateCustomer(
                      customer.id,
                      "notes",
                      e.target.value
                    )
                  }
                  style={styles.textarea}
                  rows={4}
                />
              </label>

              <div style={styles.actions}>
                <button
                  onClick={() => saveCustomer(customer)}
                  disabled={saving}
                  style={styles.saveButton}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
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
    marginTop: "6px",
    color: "#667085",
  },

  refreshButton: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  error: {
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "8px",
    background: "#fee4e2",
    color: "#b42318",
  },

  empty: {
    padding: "50px",
    background: "white",
    borderRadius: "12px",
    textAlign: "center",
  },

  list: {
    display: "grid",
    gap: "20px",
  },

  card: {
    background: "white",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  customerName: {
    margin: 0,
    fontSize: "22px",
  },

  id: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#98a2b3",
  },

  status: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    background: "white",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "18px",
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    fontWeight: 600,
    fontSize: "14px",
  },

  input: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
  },

  textarea: {
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
    resize: "vertical",
  },

  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },

  saveButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
};
```

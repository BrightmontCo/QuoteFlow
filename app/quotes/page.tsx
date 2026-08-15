"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  service?: string;
  status?: string;
};

export default function QuotesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/leads", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load customers");
      }

      setCustomers(data.leads || data.customers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load customers"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      setSaving(id);
      setError("");

      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update customer");
      }

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === id
            ? { ...customer, status }
            : customer
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update customer"
      );
    } finally {
      setSaving(null);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Quotes
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#6b7280",
              }}
            >
              Manage customer quote requests.
            </p>
          </div>

          <button
            onClick={loadCustomers}
            style={{
              border: "none",
              background: "#111827",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            ERROR: {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#111827" }}>
              No customers yet
            </h2>

            <p style={{ color: "#6b7280" }}>
              Customers will appear here when they submit a quote
              request.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {customers.map((customer) => (
              <div
                key={customer.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 10px",
                        color: "#111827",
                      }}
                    >
                      {customer.full_name ||
                        customer.name ||
                        "Unnamed Customer"}
                    </h2>

                    {customer.email && (
                      <p style={{ margin: "5px 0", color: "#4b5563" }}>
                        Email: {customer.email}
                      </p>
                    )}

                    {customer.phone && (
                      <p style={{ margin: "5px 0", color: "#4b5563" }}>
                        Phone: {customer.phone}
                      </p>
                    )}

                    {customer.address && (
                      <p style={{ margin: "5px 0", color: "#4b5563" }}>
                        Address: {customer.address}
                      </p>
                    )}

                    {customer.service && (
                      <p style={{ margin: "5px 0", color: "#4b5563" }}>
                        Service: {customer.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: 600,
                        marginBottom: "8px",
                        color: "#374151",
                      }}
                    >
                      Status
                    </label>

                    <select
                      value={customer.status || "new"}
                      disabled={saving === customer.id}
                      onChange={(event) =>
                        updateStatus(
                          customer.id,
                          event.target.value
                        )
                      }
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        background: "white",
                        minWidth: "150px",
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

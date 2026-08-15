```tsx
"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  service?: string;
  status?: string;
};

export default function QuotesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        throw new Error(data?.error || "Could not load customers");
      }

      const leads = Array.isArray(data) ? data : data.leads || data.customers || [];

      setCustomers(leads);
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
      setError("");

      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not update customer");
      }

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === id ? { ...customer, status } : customer
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update customer"
      );
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
        padding: "40px 24px",
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
              Manage customer quotes and requests.
            </p>
          </div>

          <button
            onClick={loadCustomers}
            style={{
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              background: "#111827",
              color: "white",
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
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "50px 30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#111827" }}>No customers yet</h2>

            <p style={{ color: "#6b7280" }}>
              Customers will appear here when they submit a quote request.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {customers.map((customer) => (
              <div
                key={customer.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "22px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        color: "#111827",
                        fontSize: "20px",
                      }}
                    >
                      {customer.name ||
                        customer.full_name ||
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

                    {customer.service && (
                      <p style={{ margin: "5px 0", color: "#4b5563" }}>
                        Service: {customer.service}
                      </p>
                    )}
                  </div>

                  <select
                    value={customer.status || "new"}
                    onChange={(event) =>
                      updateStatus(customer.id, event.target.value)
                    }
                    style={{
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      background: "white",
                      color: "#111827",
                    }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

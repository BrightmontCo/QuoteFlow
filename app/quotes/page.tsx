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

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/leads");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load customers");
        }

        setCustomers(data.leads || data.customers || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load customers"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      setError("");

      const response = await fetch("/api/leads/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update status");
      }

      setCustomers((oldCustomers) =>
        oldCustomers.map((customer) => {
          if (customer.id === id) {
            return {
              ...customer,
              status: status,
            };
          }

          return customer;
        })
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update status"
      );
    }
  }

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
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
            color: "#111827",
          }}
        >
          Quotes
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Manage customer quote requests.
        </p>

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
            {error}
          </div>
        )}

        {loading && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            Loading quotes...
          </div>
        )}

        {!loading && customers.length === 0 && !error && (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h2>No quote requests yet</h2>

            <p style={{ color: "#6b7280" }}>
              Customers will appear here when they submit a quote request.
            </p>
          </div>
        )}

        {!loading && customers.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {customers.map((customer) => {
              const name =
                customer.name ||
                customer.full_name ||
                "Unnamed Customer";

              return (
                <div
                  key={customer.id}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
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
                        {name}
                      </h2>

                      {customer.email && (
                        <p
                          style={{
                            margin: "5px 0",
                            color: "#6b7280",
                          }}
                        >
                          Email: {customer.email}
                        </p>
                      )}

                      {customer.phone && (
                        <p
                          style={{
                            margin: "5px 0",
                            color: "#6b7280",
                          }}
                        >
                          Phone: {customer.phone}
                        </p>
                      )}

                      {customer.service && (
                        <p
                          style={{
                            margin: "12px 0 0",
                            color: "#374151",
                          }}
                        >
                          Service: <strong>{customer.service}</strong>
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: "6px",
                        }}
                      >
                        Status
                      </label>

                      <select
                        value={customer.status || "New"}
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
                        }}
                      >
                        <option value="New">New</option>
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

```tsx id="0g9v2m"
"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load leads");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setLeads(data);
        } else if (Array.isArray(data.leads)) {
          setLeads(data.leads);
        } else {
          setLeads([]);
        }
      } catch {
        setError("Could not load customers.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
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
              Customers
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              Manage your QuoteFlow customers.
            </p>
          </div>
        </div>

        {loading && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            Loading customers...
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && leads.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <h2>No customers yet</h2>
            <p style={{ color: "#6b7280" }}>
              Customers will appear here when they submit a quote request.
            </p>
          </div>
        )}

        {!loading && leads.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {leads.map((lead) => (
              <a
                key={lead.id}
                href={`/leads/${lead.id}`}
                style={{
                  display: "block",
                  background: "white",
                  padding: "22px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  textDecoration: "none",
                  color: "#111827",
                }}
              >
                <h3 style={{ margin: "0 0 8px" }}>
                  {lead.full_name || lead.name || "Unnamed Customer"}
                </h3>

                <p style={{ margin: "4px 0", color: "#6b7280" }}>
                  {lead.email || "No email"}
                </p>

                <p style={{ margin: "4px 0", color: "#6b7280" }}>
                  {lead.phone || "No phone"}
                </p>

                <p
                  style={{
                    marginTop: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Status: {lead.status || "New"}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

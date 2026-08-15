```tsx
"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  problem?: string;
  status?: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLeads(data.data || []);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
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
            <h1>Leads</h1>
            <p>
              Manage your customers and leads.
            </p>
          </div>

          <a
            href="/leads/new"
            style={{
              background: "#111827",
              color: "white",
              padding: "12px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            + New Lead
          </a>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {loading && (
            <div style={{ padding: "40px" }}>
              Loading leads...
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
              }}
            >
              <h2>No leads yet</h2>

              <p>
                Add your first customer.
              </p>

              <a
                href="/leads/new"
                style={{
                  display: "inline-block",
                  background: "#111827",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                + New Lead
              </a>
            </div>
          )}

          {!loading &&
            leads.map((lead) => (
              <a
                key={lead.id}
                href={"/leads/" + lead.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "20px",
                  borderBottom:
                    "1px solid #eeeeee",
                  textDecoration: "none",
                  color: "#111827",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {(lead.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>
                    {lead.name}
                  </strong>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}
                  >
                    {lead.service ||
                      "No service"}
                  </div>
                </div>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  {lead.phone ||
                    lead.email ||
                    ""}
                </div>

                <div
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {lead.status || "New"}
                </div>

                <div>→</div>
              </a>
            ))}
        </div>
      </div>
    </main>
  );
}
```

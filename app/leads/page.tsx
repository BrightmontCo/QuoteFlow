```tsx
"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  service?: string | null;
  problem?: string | null;
  status?: string | null;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setLeads(result.data || []);
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
        color: "#111827",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
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
            <a
              href="/"
              style={{
                color: "#111827",
                textDecoration: "none",
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              QuoteFlow
            </a>

            <h1
              style={{
                fontSize: "32px",
                margin: "35px 0 5px",
              }}
            >
              Leads
            </h1>

            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Manage your customers and leads.
            </p>
          </div>

          <a
            href="/leads/new"
            style={{
              background: "#111827",
              color: "#ffffff",
              padding: "12px 20px",
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
            display: "flex",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          <a href="/" style={linkStyle}>
            Dashboard
          </a>

          <a href="/leads" style={activeLinkStyle}>
            Leads
          </a>

          <a href="/quotes" style={linkStyle}>
            Quotes
          </a>

          <a href="/appointments" style={linkStyle}>
            Appointments
          </a>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {loading && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
              }}
            >
              Loading leads...
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div
              style={{
                padding: "70px 20px",
                textAlign: "center",
              }}
            >
              <h2>No leads yet</h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "25px",
                }}
              >
                Add your first customer.
              </p>

              <a
                href="/leads/new"
                style={{
                  background: "#111827",
                  color: "#ffffff",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
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
                  borderBottom: "1px solid #eeeeee",
                  textDecoration: "none",
                  color: "#111827",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#eef2ff",
                    color: "#4f46e5",
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
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: "5px",
                    }}
                  >
                    {lead.name}
                  </div>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    {lead.service || "No service"}
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    color: "#4b5563",
                    fontSize: "13px",
                  }}
                >
                  {lead.problem || "No description"}
                </div>

                <div
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {lead.status || "New"}
                </div>

                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  {lead.phone || lead.email || ""}
                </div>

                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "20px",
                  }}
                >
                  →
                </div>
              </a>
            ))}
        </div>
      </div>
    </main>
  );
}

const linkStyle = {
  color: "#6b7280",
  textDecoration: "none",
  fontSize: "14px",
};

const activeLinkStyle = {
  color: "#111827",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 700,
};
```

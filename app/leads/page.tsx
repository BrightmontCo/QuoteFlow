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
    fetch("/api/leads", {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setLeads(data);
        } else if (Array.isArray(data.leads)) {
          setLeads(data.leads);
        } else {
          setLeads([]);
        }
      })
      .catch(() => {
        setError("Could not load customers.");
      })
      .finally(() => {
        setLoading(false);
      });
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
        <h1 style={{ color: "#111827" }}>Customers</h1>

        <p style={{ color: "#6b7280" }}>
          Manage your QuoteFlow customers.
        </p>

        {loading && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              marginTop: "25px",
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
              padding: "15px",
              borderRadius: "10px",
              marginTop: "25px",
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
              marginTop: "25px",
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
              marginTop: "25px",
            }}
          >
            {leads.map((lead) => (
              <a
                key={lead.id}
                href={"/leads/" + lead.id}
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

                <p style={{ margin: "5px 0", color: "#6b7280" }}>
                  {lead.email || "No email"}
                </p>

                <p style={{ margin: "5px 0", color: "#6b7280" }}>
                  {lead.phone || "No phone"}
                </p>

                <p style={{ marginTop: "12px", fontWeight: "bold" }}>
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

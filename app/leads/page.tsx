"use client";

import { useEffect, useState } from "react";

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
  "created At": string | null;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (result.success) {
          setLeads(result.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
          Leads
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Manage your customers and quote requests.
        </p>

        {loading ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            No leads yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {leads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0 0 8px",
                        fontSize: "20px",
                      }}
                    >
                      {lead.name}
                    </h2>

                    <p
                      style={{
                        margin: "4px 0",
                        color: "#6b7280",
                      }}
                    >
                      {lead.service || "No service specified"}
                    </p>

                    <p
                      style={{
                        margin: "4px 0",
                        color: "#6b7280",
                      }}
                    >
                      {lead.phone || "No phone"}
                    </p>

                    <p
                      style={{
                        margin: "4px 0",
                        color: "#6b7280",
                      }}
                    >
                      {lead.email || "No email"}
                    </p>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {lead.status || "New"}
                    </span>
                  </div>
                </div>

                {lead.address && (
                  <p style={{ marginTop: "18px" }}>
                    <strong>Address:</strong>{" "}
                    {lead.address}
                  </p>
                )}

                {lead.problem && (
                  <p style={{ marginTop: "10px" }}>
                    <strong>Problem:</strong>{" "}
                    {lead.problem}
                  </p>
                )}

                {lead["appointment date"] && (
                  <p style={{ marginTop: "10px" }}>
                    <strong>Appointment:</strong>{" "}
                    {lead["appointment date"]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

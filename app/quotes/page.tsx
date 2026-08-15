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

```
  const response = await fetch("/api/leads");
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
```

}

async function updateStatus(id: string, status: string) {
try {
setError("");

```
  const response = await fetch("/api/leads/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
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
    err instanceof Error ? err.message : "Could not update customer"
  );
}
```

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
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "30px",
}}
> <div>
<h1
style={{
margin: 0,
fontSize: "32px",
color: "#111827",
}}
>
Quotes </h1>

```
        <p style={{ color: "#6b7280" }}>
          Manage customer quote requests.
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
          padding: "14px",
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
        }}
      >
        Loading quotes...
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
          No quote requests yet
        </h2>

        <p style={{ color: "#6b7280" }}>
          Customers will appear here when they submit a quote request.
        </p>
      </div>
    ) : (
      <div style={{ display: "grid", gap: "16px" }}>
        {customers.map((customer) => {
          const customerName =
            customer.name ||
            customer.full_name ||
            "Unnamed Customer";

          return (
            <div
              key={customer.id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "22px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
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
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    {customerName}
                  </h2>

                  {customer.email && (
                    <p style={{ color: "#6b7280" }}>
                      {customer.email}
                    </p>
                  )}

                  {customer.phone && (
                    <p style={{ color: "#6b7280" }}>
                      {customer.phone}
                    </p>
                  )}

                  {customer.service && (
                    <p style={{ color: "#374151" }}>
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
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      background: "white",
                      minWidth: "150px",
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
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
```

);
}

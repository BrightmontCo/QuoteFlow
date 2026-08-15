"use client";

import { useEffect, useState } from "react";

type Customer = {
id: string;
full_name?: string;
name?: string;
email?: string;
phone?: string;
service?: string;
status?: string;
};

export default function QuotesPage() {
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadCustomers = async () => {
try {
setLoading(true);

```
  const response = await fetch("/api/leads");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load customers");
  }

  setCustomers(data.leads || data || []);
  setError("");
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Could not load customers"
  );
} finally {
  setLoading(false);
}
```

};

const updateStatus = async (id: string, status: string) => {
try {
const response = await fetch("/api/leads/" + id, {
method: "PATCH",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ status }),
});

```
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not update status");
  }

  setCustomers((customers) =>
    customers.map((customer) =>
      customer.id === id
        ? { ...customer, status }
        : customer
    )
  );
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Could not update status"
  );
}
```

};

useEffect(() => {
loadCustomers();
}, []);

if (loading) {
return (
<main
style={{
padding: "40px",
fontFamily: "Arial",
}}
> <h1>Quotes</h1> <p>Loading quotes...</p> </main>
);
}

return (
<main
style={{
minHeight: "100vh",
background: "#f5f7fb",
padding: "40px",
fontFamily: "Arial",
}}
>
<div
style={{
maxWidth: "1000px",
margin: "0 auto",
}}
>
<h1
style={{
fontSize: "32px",
marginBottom: "8px",
}}
>
Quotes </h1>

```
    <p
      style={{
        color: "#666",
        marginBottom: "30px",
      }}
    >
      Manage customer quotes.
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

    {customers.length === 0 ? (
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
        }}
      >
        <h2>No quotes yet</h2>
        <p>
          Customer quote requests will appear here.
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
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              {customer.full_name ||
                customer.name ||
                "Customer"}
            </h2>

            {customer.email && (
              <p>Email: {customer.email}</p>
            )}

            {customer.phone && (
              <p>Phone: {customer.phone}</p>
            )}

            {customer.service && (
              <p>Service: {customer.service}</p>
            )}

            <label
              style={{
                display: "block",
                marginTop: "15px",
                marginBottom: "6px",
              }}
            >
              Status
            </label>

            <select
              value={customer.status || "new"}
              onChange={(event) =>
                updateStatus(
                  customer.id,
                  event.target.value
                )
              }
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="new">New</option>
              <option value="contacted">
                Contacted
              </option>
              <option value="quoted">Quoted</option>
              <option value="approved">
                Approved
              </option>
              <option value="completed">
                Completed
              </option>
              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>
        ))}
      </div>
    )}
  </div>
</main>
```

);
}

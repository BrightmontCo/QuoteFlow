```tsx
import Link from "next/link";

export default function LeadsPage() {
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
            <h1 style={{ margin: 0 }}>
              Leads
            </h1>

            <p style={{ color: "#666" }}>
              Manage your customers and leads.
            </p>
          </div>

          <Link
            href="/leads/new"
            style={{
              background: "#111827",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            + New Lead
          </Link>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h2>Customers</h2>

          <p style={{ color: "#666" }}>
            Your customers will appear here.
          </p>

          <Link
            href="/leads/new"
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "#111827",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Add Customer
          </Link>
        </div>
      </div>
    </main>
  );
}
```

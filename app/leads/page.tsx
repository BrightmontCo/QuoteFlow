```tsx
import Link from "next/link";

export default function LeadsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
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
              }}
            >
              Leads
            </h1>

            <p
              style={{
                color: "#666",
              }}
            >
              Manage your customers.
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
            borderRadius: "12px",
            border: "1px solid #ddd",
            padding: "30px",
          }}
        >
          <h2>Your Customers</h2>

          <p
            style={{
              color: "#666",
            }}
          >
            Your leads will appear here.
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
            Add Your First Customer
          </Link>
        </div>
      </div>
    </main>
  );
}
```

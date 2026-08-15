```tsx id="5l0t8q"
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
        <h1>Leads</h1>

        <p>Manage your customers and leads.</p>

        <Link
          href="/leads/new"
          style={{
            display: "inline-block",
            marginTop: "20px",
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

        <div
          style={{
            marginTop: "30px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h2>Customers</h2>

          <p>Your customers will appear here.</p>
        </div>
      </div>
    </main>
  );
}
```

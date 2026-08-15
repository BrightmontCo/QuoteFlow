```tsx
import Link from "next/link";

type Lead = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  service?: string | null;
  status?: string | null;
};

async function getLeads(): Promise<Lead[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/leads`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    return result.data || [];
  } catch {
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

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
                color: "#6b7280",
              }}
            >
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
            display: "flex",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          <Link href="/" style={navStyle}>
            Dashboard
          </Link>

          <Link href="/leads" style={activeNavStyle}>
            Leads
          </Link>

          <Link href="/appointments" style={navStyle}>
            Appointments
          </Link>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          {leads.length === 0 ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
              }}
            >
              <h2>No customers yet</h2>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "25px",
                }}
              >
                Add your first customer.
              </p>

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
                + Add Customer
              </Link>
            </div>
          ) : (
            leads.map((lead) => (
              <Link
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
                    fontWeight: "bold",
                  }}
                >
                  {(lead.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "bold",
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
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  {lead.phone || lead.email || ""}
                </div>

                <div
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {lead.status || "New"}
                </div>

                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "20px",
                  }}
                >
                  →
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

const navStyle = {
  color: "#6b7280",
  textDecoration: "none",
  fontSize: "14px",
};

const activeNavStyle = {
  color: "#111827",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
};
```

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
  quote_amount: number | null;
  appointment_date: string | null;
  notes: string | null;
  created_at: string | null;
};

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("Could not load leads");
        }

        setLeads(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load leads.");
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const newLeads = leads.filter(
    (lead) => lead.status?.toLowerCase() === "new"
  );

  const quotesAwaiting = leads.filter(
    (lead) => lead.status?.toLowerCase() === "quote sent"
  );

  const booked = leads.filter(
    (lead) => lead.status?.toLowerCase() === "booked"
  );

  const pipelineValue = leads.reduce(
    (total, lead) => total + Number(lead.quote_amount || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-60 border-r bg-white p-6 md:block">
          <div className="mb-10 text-2xl font-bold">QuoteFlow</div>

          <nav className="space-y-2">
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold">
              Dashboard
            </div>

            <div className="px-4 py-3 text-sm text-gray-500">Leads</div>

            <div className="px-4 py-3 text-sm text-gray-500">Quotes</div>

            <div className="px-4 py-3 text-sm text-gray-500">
              Appointments
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-6 md:p-10">
          {/* HEADER */}
          <header className="mb-8">
            <p className="text-sm text-gray-500">Contractor CRM</p>

            <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>

            <p className="mt-1 text-gray-500">
              Manage your leads, quotes, and jobs.
            </p>
          </header>

          {/* STATS */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="New Leads"
              value={newLeads.length.toString()}
            />

            <StatCard
              title="Quotes Awaiting"
              value={quotesAwaiting.length.toString()}
            />

            <StatCard
              title="Appointments"
              value={booked.length.toString()}
            />

            <StatCard
              title="Pipeline Value"
              value={`$${pipelineValue.toLocaleString()}`}
            />
          </section>

          {/* LEADS */}
          <section className="overflow-hidden rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold">Recent Leads</h2>

                <p className="mt-1 text-xs text-gray-500">
                  {leads.length} customer{leads.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {loading && (
              <div className="p-10 text-center text-gray-500">
                Loading leads...
              </div>
            )}

            {!loading && error && (
              <div className="p-10 text-center text-red-500">
                {error}
              </div>
            )}

            {!loading && !error && leads.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                No leads yet.
              </div>
            )}

            {!loading && !error && leads.length > 0 && (
              <div>
                {/* TABLE HEADER */}
                <div className="hidden grid-cols-4 gap-4 border-b bg-gray-50 px-5 py-3 text-xs font-medium text-gray-500 md:grid">
                  <div>Customer</div>
                  <div>Service</div>
                  <div>Status</div>
                  <div>Quote</div>
                </div>

                {/* LEADS */}
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="grid gap-3 border-b px-5 py-5 md:grid-cols-4 md:items-center"
                  >
                    {/* CUSTOMER */}
                    <div>
                      <div className="font-semibold">
                        {lead.name || "Unknown Customer"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {lead.email || "No email"}
                      </div>

                      {lead.phone && (
                        <div className="mt-1 text-xs text-gray-500">
                          {lead.phone}
                        </div>
                      )}
                    </div>

                    {/* SERVICE */}
                    <div className="text-sm">
                      {lead.service || "—"}
                    </div>

                    {/* STATUS */}
                    <div>
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                        {lead.status || "New"}
                      </span>
                    </div>

                    {/* QUOTE */}
                    <div className="text-sm font-semibold">
                      {lead.quote_amount
                        ? `$${Number(lead.quote_amount).toLocaleString()}`
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

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

export default function Home() {
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

  const newLeads = leads.filter(
    (lead) => (lead.status || "").toLowerCase() === "new"
  );

  const appointments = leads.filter(
    (lead) => lead["appointment date"]
  );

  const pipelineValue = leads.reduce(
    (total, lead) => total + Number(lead["quote amount"] || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white">
        <div className="flex h-20 items-center border-b border-slate-800 px-7">
          <div>
            <div className="text-xl font-bold">QuoteFlow</div>
            <div className="text-xs text-slate-400">
              Contractor CRM
            </div>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          <div className="rounded-lg bg-white/10 px-4 py-3 font-medium">
            Dashboard
          </div>

          <div className="rounded-lg px-4 py-3 text-slate-400">
            Leads
          </div>

          <div className="rounded-lg px-4 py-3 text-slate-400">
            Quotes
          </div>

          <div className="rounded-lg px-4 py-3 text-slate-400">
            Appointments
          </div>
        </nav>
      </aside>

      <main className="ml-64">

        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Welcome back. Here's what's happening.
            </p>
          </div>

          <button className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-medium text-white">
            + New Lead
          </button>
        </header>

        <div className="p-8">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border bg-white p-6">
              <p className="text-sm text-slate-500">New Leads</p>
              <p className="mt-3 text-3xl font-bold">
                {loading ? "..." : newLeads.length}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Leads requiring attention
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <p className="text-sm text-slate-500">
                Quotes Awaiting
              </p>
              <p className="mt-3 text-3xl font-bold">0</p>
              <p className="mt-2 text-xs text-slate-400">
                Quotes awaiting customer
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <p className="text-sm text-slate-500">
                Appointments
              </p>
              <p className="mt-3 text-3xl font-bold">
                {loading ? "..." : appointments.length}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Upcoming appointments
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <p className="text-sm text-slate-500">
                Pipeline Value
              </p>
              <p className="mt-3 text-3xl font-bold">
                ${pipelineValue.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Total quoted value
              </p>
            </div>

          </div>

          <div className="mt-8 rounded-xl border bg-white">

            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">Recent Leads</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest customer requests
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-slate-500">
                Loading leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-slate-500">
                No leads yet.
              </div>
            ) : (
              <div className="divide-y">

                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="px-6 py-5 hover:bg-slate-50"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold">
                          {lead.name
                            ? lead.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {lead.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {lead.service || "Service not specified"}
                          </p>
                        </div>

                      </div>

                      <div className="text-right">

                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {lead.status || "New"}
                        </span>

                        {lead["appointment date"] && (
                          <p className="mt-2 text-xs text-slate-500">
                            Appointment:{" "}
                            {lead["appointment date"]}
                          </p>
                        )}

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-500 md:grid-cols-3">

                      <div>
                        📞 {lead.phone || "No phone"}
                      </div>

                      <div>
                        ✉ {lead.email || "No email"}
                      </div>

                      <div>
                        📍 {lead.address || "No address"}
                      </div>

                    </div>

                    {lead.problem && (
                      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                        <span className="font-medium">
                          Problem:
                        </span>{" "}
                        {lead.problem}
                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

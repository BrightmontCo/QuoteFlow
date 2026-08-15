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
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const response = await fetch("/api/leads", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load leads");
        }

        setLeads(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load leads"
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  const newLeads = leads.filter(
    (lead) => (lead.status || "").toLowerCase() === "new"
  );

  const quotesAwaiting = leads.filter(
    (lead) =>
      (lead.status || "").toLowerCase().includes("quote")
  );

  const appointments = leads.filter(
    (lead) => lead["appointment date"]
  );

  const pipelineValue = leads.reduce(
    (total, lead) => total + Number(lead["quote amount"] || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6">
          <h1 className="text-2xl font-bold mb-10">QuoteFlow</h1>

          <nav className="space-y-3">
            <div className="rounded-lg bg-black text-white px-4 py-3">
              Dashboard
            </div>

            <div className="px-4 py-3 text-gray-600">
              Leads
            </div>

            <div className="px-4 py-3 text-gray-600">
              Quotes
            </div>

            <div className="px-4 py-3 text-gray-600">
              Appointments
            </div>

            <div className="px-4 py-3 text-gray-600">
              Contractor CRM
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-500 mt-1">
              Manage your leads, quotes, and jobs.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">New Leads</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : newLeads.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Quotes Awaiting</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : quotesAwaiting.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Appointments</p>
              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : appointments.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">Pipeline Value</p>
              <p className="text-3xl font-bold mt-2">
                ${pipelineValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Recent Leads</h3>
              <p className="text-gray-500 text-sm mt-1">
                {loading ? "Loading..." : `${leads.length} customers`}
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-gray-500">
                Loading leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-gray-500">
                No leads yet.
              </div>
            ) : (
              <div className="divide-y">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 hover:bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {lead.name}
                        </h4>

                        <p className="text-gray-500 text-sm mt-1">
                          {lead.service || "Service not specified"}
                        </p>

                        {lead.problem && (
                          <p className="text-gray-600 text-sm mt-2">
                            {lead.problem}
                          </p>
                        )}
                      </div>

                      <div className="text-left md:text-right">
                        <span className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm">
                          {lead.status || "New"}
                        </span>

                        {lead.phone && (
                          <p className="text-sm text-gray-500 mt-2">
                            {lead.phone}
                          </p>
                        )}

                        {lead["appointment date"] && (
                          <p className="text-sm text-gray-500">
                            Appointment:{" "}
                            {lead["appointment date"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

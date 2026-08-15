"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
  const [message, setMessage] = useState("Loading customers...");

  useEffect(() => {
    fetch("/api/leads", { cache: "no-store" })
      .then(async (response) => {
        const text = await response.text();

        if (!response.ok) {
          throw new Error(text || "API request failed");
        }

        try {
          const data = JSON.parse(text);
          setMessage(
            Array.isArray(data)
              ? "Customers loaded: " + data.length
              : "API returned: " + text
          );
        } catch {
          setMessage("API returned: " + text);
        }
      })
      .catch((error) => {
        setMessage("ERROR: " + error.message);
      });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Customers</h1>
      <p>QuoteFlow customer database</p>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "white",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        {message}
      </div>
    </main>
  );
}

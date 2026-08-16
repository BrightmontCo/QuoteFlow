import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "QuoteFlow | Contractor CRM",
  description: "Manage HVAC leads, quotes, appointments, and jobs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          nav a[href="/"],
          nav a[href="/leads"],
          nav a[href="/quotes"],
          nav a[href="/appointments"] {
            color: #64748b !important;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 1.4 !important;
            text-decoration: none !important;
            text-transform: none !important;
          }

          nav > a:first-child {
            color: #0f172a !important;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            font-size: 20px !important;
            font-weight: 800 !important;
            text-decoration: none !important;
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthBootstrap from "../components/auth-bootstrap";

export const metadata: Metadata = { title: "QuoteFlow | HVAC CRM", description: "Manage HVAC leads, quotes, appointments, and jobs in one place." };

export default function RootLayout({ children }: { children: ReactNode }) {
 return <html lang="en"><head><style>{`*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:#f7f8fa}button,input,select,textarea{font:inherit}@media(max-width:760px){nav{gap:14px!important;flex-wrap:wrap!important;height:auto!important;min-height:72px!important;padding:14px 0!important}nav>div{gap:14px!important;flex-wrap:wrap!important}main>div{padding-left:16px!important;padding-right:16px!important}section[style*="grid-template-columns"]{grid-template-columns:1fr!important}table{min-width:720px}}`}</style></head><body style={{fontFamily:'Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'}}><AuthBootstrap/>{children}</body></html>;
}

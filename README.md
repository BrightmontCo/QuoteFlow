# QuoteFlow

QuoteFlow is a lightweight contractor CRM for managing HVAC leads, quotes, appointments, and jobs.

## Stack

- Next.js
- React
- TypeScript
- Supabase
- Vercel

## Required environment variables

Create these in your Vercel project (and local `.env.local` when developing):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The app expects a Supabase `leads` table with fields used by the dashboard: `id`, `name`, `phone`, `email`, `address`, `service`, `problem`, `status`, `quote amount`, `appointment date`, `notes`, and preferably `created_at`.

## Main routes

- `/` — dashboard
- `/leads` — customer list
- `/leads/new` — create a lead
- `/leads/[id]` — edit a lead
- `/quotes` — quote pipeline
- `/appointments` — appointments

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

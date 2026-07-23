## Goal

Add a new `/dashboard` route to the existing Iris site — a clean, trustworthy B2B SaaS control panel for a non-technical business owner. Zero AI jargon. All copy is about calls, appointments, revenue.

## Scope & Stack

- New route only. Landing page, `/contact`, and Iris components untouched.
- Built in the existing stack: TanStack Start + React + Tailwind v4.
- Lovable Cloud enabled for real, persisted data + auth.

## Enable Lovable Cloud

Enable Cloud so we can persist calls, appointments, activity events, and gate the dashboard behind sign-in.

## Data model (migration)

All tables in `public`, scoped per business owner via `user_id = auth.uid()`, RLS enabled, GRANTs to `authenticated` + `service_role` (no `anon`).

- `calls` — id, user_id, caller_name, phone, started_at, duration_seconds, outcome (`appointment_booked` | `transferred` | `voicemail` | `missed` | `info_only`), revenue_opportunity_cents, summary, recording_url
- `appointments` — id, user_id, customer_name, phone, scheduled_at, service, status, created_from_call_id
- `activity_events` — id, user_id, kind (`call_live` | `call_completed` | `appointment_booked` | `transferred` | `missed`), title, meta jsonb, created_at
- `receptionist_status` — one row per user_id: status (`online` | `degraded` | `offline`), updated_at

Metrics for the hero cards are computed on the fly from `calls` / `appointments` (today/this-week windows).

## Routes & Auth

- Dashboard lives under the managed `_authenticated/` layout so hard-refresh works: `src/routes/_authenticated/dashboard.tsx`.
- Sign-in via the existing/managed auth flow (email + password, plus Google through the Lovable broker). If `/auth` doesn't exist yet, add a minimal `src/routes/auth.tsx`.
- No auth gate on landing or `/contact`.

## Server functions (all `.functions.ts`, `requireSupabaseAuth`)

- `getDashboardOverview` — returns status banner text + 4 hero-card metrics (calls today, appointments today, revenue opps captured this week, missed calls prevented this week).
- `getLiveActivity` — latest 10 activity events, realtime-subscribable.
- `getRecentCalls` — last 25 calls with outcome + duration.
- `seedDemoData` — one-shot: if the signed-in user has zero calls, insert a realistic demo dataset so the dashboard is immediately populated. Called from the loader.

## UI components (all new, under `src/components/dashboard/`)

Design: white bg, subtle gray borders (`border-neutral-200`), generous spacing, Inter typography, green for healthy, amber/red only for actionable alerts. No Tesla-red branding on this route — it's a distinct product surface.

- `DashboardLayout.tsx` — responsive shell
  - Desktop (`lg+`): fixed left sidebar (240px) with logo, nav items (Overview, Calls, Appointments, Settings), user chip at bottom. Main content `max-w-6xl` with generous padding.
  - Mobile: top bar with hamburger + business name; fixed bottom nav (Home / Calls / Appts / More) with active state. Hamburger opens a slide-in drawer.
  - Vanilla React state (`useState`) for menu toggle — matches the "basic JS to toggle" ask.
- `StatusBanner.tsx` — full-width rounded banner. Green dot + "Your AI Receptionist is working normally." Subtext with real counts from `getDashboardOverview`. Amber variant when `receptionist_status` != online.
- `MetricCards.tsx` — grid `grid-cols-2 lg:grid-cols-4`, one `MetricCard` per stat with emoji icon, label, big number, subtle trend line/delta. Rounded, bordered, hover elevates.
- `LiveActivityFeed.tsx` — "Live Activity" heading with pulsing green dot. Vertical list of events with left status indicator, title, subtext, relative timestamp. Live rows (`call_live`) show a subtle pulse and duration ticking. Subscribes to `activity_events` via Supabase realtime.
- `RecentCallsTable.tsx` — "Recent Calls & Follow-ups". On desktop: table with Customer / Time / Outcome pill / Duration / Actions. On mobile: stacked card per row. Actions per row: `▶ Listen`, `📄 Read Summary` (opens a shadcn Sheet with the call summary), and a prominent `📞 Call Back` (only for `missed` outcome; uses `tel:` link).

## Page composition

`src/routes/_authenticated/dashboard.tsx`:

```
DashboardLayout
├─ StatusBanner
├─ MetricCards
├─ LiveActivityFeed
└─ RecentCallsTable
```

Loader primes TanStack Query via `ensureQueryData` for overview + recent calls + live activity; components read with `useSuspenseQuery`. `errorComponent` + `notFoundComponent` set. Route `head()` gets its own title/description: "Dashboard — Iris".

## Landing page link

Add a small "Sign in" / "Dashboard" link in the existing Nav (desktop + mobile menu) that goes to `/dashboard`. Everything else on landing is untouched.

## Out of scope

- Real telephony integration, recordings playback (buttons open a placeholder Sheet).
- Settings pages, billing, team management.
- Notifications, exports.

## Verification

After build: sign in, hit `/dashboard`, confirm seed data appears, banner is green, metrics render, activity feed streams a new row when inserted, table actions work, mobile layout uses bottom nav + hamburger drawer with no horizontal scroll at 375px.

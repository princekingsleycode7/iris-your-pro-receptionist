# Even mobile nav + live call data from your ElevenLabs database

## 1. Mobile nav balance (scrolled pill)

Right now the scrolled pill packs a full-size logo, a wordmark, "Pricing", "Dashboard", "Try Basic" and a hamburger into 360px, so items crowd and sit unevenly.

Fix, presentation only:
- Scrolled state on mobile shows exactly three things on one baseline: compact logo mark, a centered active-section label, and the hamburger. "Pricing"/"Dashboard"/"Try Basic" stay hidden below `sm` while scrolled (they already live in the drawer).
- Use a three-column grid (`auto 1fr auto`) instead of `justify-between` so the center item is truly centered regardless of side widths.
- Reduce pill padding (`px-3`), logo to 18px, and shrink the wordmark on the smallest widths so nothing wraps.
- Match control heights (hamburger and CTA both 32px, same border radius) so the row reads as one line.

## 2. Real call data from the external database

Your ElevenLabs webhook writes to a **different** Supabase project — this app's backend has none of those four tables. So this app will read that project remotely.

What I need from you (I'll request them securely once you approve):
- The external project's URL
- A key for it (service role recommended, since `webhook_logs`/audio shouldn't be publicly readable)

### Ownership
`agent_id` identifies a user. I'll add an `agent_id` field to this app's `user_settings` table and a field on the Settings page where each owner pastes their agent ID. Every dashboard read is filtered by that agent ID, so users only ever see their own calls.

### What the dashboard becomes
The seeded demo rows are removed. All dashboard numbers derive from `elevenlabs_calls` for the signed-in user's agent:

- Calls handled today = calls with `start_time` today
- Appointments booked = calls whose `call_successful` / `dynamic_variables` indicate a booking (I'll confirm the exact marker once I can inspect a few real rows)
- Missed / failed = matching rows in `elevenlabs_call_failures`
- Revenue opportunity = derived from the same booking marker; if there's no amount in the data I'll drop that card rather than invent a number
- Live Activity = the most recent calls and failures, newest first
- Recent Calls table = caller, time, duration, outcome, plus Read Summary (`raw_summary`), Read Transcript (`formatted_transcript`), and Listen (audio from `elevenlabs_audio`, fetched only when clicked since it's base64 in the row)

### Freshness
- Refetch on every dashboard load and on window focus.
- Plus a 20-second background poll so an in-progress call surfaces without a manual refresh.
- True realtime would require enabling realtime replication on the external project; polling is the reliable option and is indistinguishable at this scale. I can switch to realtime later if you can enable it there.

## Technical notes

- New `src/lib/elevenlabs.server.ts` creates a client for the external project from `ELEVENLABS_DB_URL` / `ELEVENLABS_DB_KEY`, imported only inside server-function handlers so the key never reaches the browser.
- New `src/lib/elevenlabs.functions.ts` exposes `getOverview`, `getRecentCalls`, `getCallDetail`, `getCallAudio`, all behind `requireSupabaseAuth`; each resolves the caller's `agent_id` from `user_settings` first and returns empty state if none is set.
- `src/lib/dashboard.functions.ts` loses `seedIfEmpty` and the local `calls`/`activity_events` queries; components keep their current props shape where possible.
- Migration: add `agent_id text` to `user_settings`.
- Side note: `src/lib/calls.functions.ts` currently selects `transcript` and `raw_payload`, columns that don't exist — that page is broken today and this rewrite fixes it.
- Audio is base64 in the row, so it's fetched per-call on demand and turned into a blob URL, never listed in bulk.

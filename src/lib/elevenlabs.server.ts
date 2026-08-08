import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client for the EXTERNAL Supabase project that receives ElevenLabs webhooks.
 * Server-only: the key must never reach the browser.
 */
export function createElevenLabsClient(): SupabaseClient | null {
  const url = process.env["ELEVENLABS_DB_URL"];
  const key = process.env["ELEVENLABS_DB_KEY"];
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export type RawCall = {
  conversation_id: string | null;
  agent_id: string | null;
  agent_name: string | null;
  status: string | null;
  start_time: string | null;
  call_duration_secs: number | null;
  cost: number | null;
  total_turns: number | null;
  call_successful: string | null;
  raw_summary: string | null;
  formatted_transcript: string | null;
  dynamic_variables: Record<string, unknown> | null;
};

export type RawFailure = {
  conversation_id: string | null;
  agent_id: string | null;
  failure_reason: string | null;
  provider_type: string | null;
  error_code: string | null;
  error_description: string | null;
  severity: string | null;
  preprocessed_at: string | null;
};

const BOOKING_KEYS = /(appointment|booking|booked|scheduled)/i;
const TRANSFER_KEYS = /(transfer|escalat|handoff)/i;
const REVENUE_KEYS = /(revenue|amount|value|price|quote|deal)/i;
const NAME_KEYS = /(caller_name|customer_name|name|contact)/i;
const PHONE_KEYS = /(phone|caller_id|from_number|number)/i;

function truthy(v: unknown) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s !== "" && s !== "false" && s !== "no" && s !== "none" && s !== "null" && s !== "0";
  }
  return false;
}

function findVar(vars: Record<string, unknown> | null, pattern: RegExp) {
  if (!vars) return undefined;
  for (const [k, v] of Object.entries(vars)) {
    if (pattern.test(k) && v != null && v !== "") return v;
  }
  return undefined;
}

export type Outcome =
  | "appointment_booked"
  | "transferred"
  | "voicemail"
  | "missed"
  | "info_only";

export function callerName(c: RawCall) {
  const n = findVar(c.dynamic_variables, NAME_KEYS);
  if (typeof n === "string" && n.trim()) return n.trim();
  const p = callerPhone(c);
  return p ?? "Unknown caller";
}

export function callerPhone(c: RawCall): string | null {
  const p = findVar(c.dynamic_variables, PHONE_KEYS);
  return typeof p === "string" && p.trim() ? p.trim() : null;
}

export function revenueCents(c: RawCall) {
  const v = findVar(c.dynamic_variables, REVENUE_KEYS);
  const n = typeof v === "number" ? v : typeof v === "string" ? parseFloat(v.replace(/[^0-9.]/g, "")) : NaN;
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

export function outcomeOf(c: RawCall, failed: boolean): Outcome {
  if (failed) return "missed";
  if (truthy(findVar(c.dynamic_variables, BOOKING_KEYS))) return "appointment_booked";
  if (truthy(findVar(c.dynamic_variables, TRANSFER_KEYS))) return "transferred";
  if ((c.status ?? "").toLowerCase() === "voicemail") return "voicemail";
  return "info_only";
}

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

export type DashCall = {
  id: string;
  caller_name: string;
  phone: string | null;
  started_at: string;
  duration_seconds: number;
  outcome: Outcome;
  summary: string | null;
  transcript: string | null;
  revenue_opportunity_cents: number;
  has_audio: boolean;
};

const CALL_COLS =
  "conversation_id, agent_id, agent_name, status, start_time, call_duration_secs, cost, total_turns, call_successful, raw_summary, formatted_transcript, dynamic_variables";

async function load(agentId: string, sinceIso: string) {
  const client = createElevenLabsClient();
  if (!client || !agentId) return { calls: [] as RawCall[], failures: [] as RawFailure[], connected: !!client };

  const [callsRes, failRes] = await Promise.all([
    client
      .from("elevenlabs_calls")
      .select(CALL_COLS)
      .eq("agent_id", agentId)
      .gte("start_time", sinceIso)
      .order("start_time", { ascending: false })
      .limit(500),
    client
      .from("elevenlabs_call_failures")
      .select("conversation_id, agent_id, failure_reason, provider_type, error_code, error_description, severity, preprocessed_at")
      .eq("agent_id", agentId)
      .gte("preprocessed_at", sinceIso)
      .order("preprocessed_at", { ascending: false })
      .limit(500),
  ]);

  return {
    calls: (callsRes.data ?? []) as unknown as RawCall[],
    failures: (failRes.data ?? []) as unknown as RawFailure[],
    connected: true,
  };
}

function since(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export async function overviewForAgent(agentId: string) {
  const { calls, failures, connected } = await load(agentId, since(30));
  const failedIds = new Set(failures.map((f) => f.conversation_id));
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  const weekAgo = Date.now() - 7 * 86_400_000;

  let callsToday = 0;
  let appointmentsToday = 0;
  let weeklyCalls = 0;
  let weeklyAppointments = 0;
  let weeklyEscalated = 0;
  let revenueOppsCentsThisWeek = 0;

  for (const c of calls) {
    const t = c.start_time ? new Date(c.start_time).getTime() : 0;
    const outcome = outcomeOf(c, failedIds.has(c.conversation_id));
    if (t >= startToday.getTime()) {
      callsToday++;
      if (outcome === "appointment_booked") appointmentsToday++;
    }
    if (t >= weekAgo) {
      weeklyCalls++;
      if (outcome === "appointment_booked") {
        weeklyAppointments++;
        revenueOppsCentsThisWeek += revenueCents(c);
      }
      if (outcome === "transferred") weeklyEscalated++;
    }
  }

  const missedPreventedThisWeek = failures.filter(
    (f) => new Date(f.preprocessed_at ?? 0).getTime() >= weekAgo,
  ).length;

  return {
    status: (connected ? "online" : "offline") as "online" | "degraded" | "offline",
    connected,
    agentConfigured: !!agentId,
    callsToday,
    appointmentsToday,
    revenueOppsCentsThisWeek,
    missedPreventedThisWeek,
    weeklyCalls,
    weeklyAppointments,
    weeklyEscalated,
  };
}

export async function callsForAgent(agentId: string, limit = 25): Promise<DashCall[]> {
  const { calls, failures } = await load(agentId, since(90));
  const failedIds = new Set(failures.map((f) => f.conversation_id));

  return calls.slice(0, limit).map((c) => ({
    id: c.conversation_id ?? crypto.randomUUID(),
    caller_name: callerName(c),
    phone: callerPhone(c),
    started_at: c.start_time ?? new Date().toISOString(),
    duration_seconds: c.call_duration_secs ?? 0,
    outcome: outcomeOf(c, failedIds.has(c.conversation_id)),
    summary: c.raw_summary,
    transcript: c.formatted_transcript,
    revenue_opportunity_cents: revenueCents(c),
    has_audio: true,
  }));
}

export type DashEvent = {
  id: string;
  kind: "call_live" | "call_completed" | "appointment_booked" | "transferred" | "missed";
  title: string;
  subtitle: string | null;
  created_at: string;
};

export async function activityForAgent(agentId: string): Promise<DashEvent[]> {
  const { calls, failures } = await load(agentId, since(14));
  const failedIds = new Set(failures.map((f) => f.conversation_id));

  const fromCalls: DashEvent[] = calls.slice(0, 20).map((c) => {
    const outcome = outcomeOf(c, failedIds.has(c.conversation_id));
    const name = callerName(c);
    const live = (c.status ?? "").toLowerCase() === "in-progress";
    const kind: DashEvent["kind"] = live
      ? "call_live"
      : outcome === "appointment_booked"
        ? "appointment_booked"
        : outcome === "transferred"
          ? "transferred"
          : outcome === "missed"
            ? "missed"
            : "call_completed";
    return {
      id: `c-${c.conversation_id}`,
      kind,
      title: live
        ? `Talking with ${name}`
        : kind === "appointment_booked"
          ? `Appointment booked for ${name}`
          : kind === "transferred"
            ? `Call transferred · ${name}`
            : `Call completed with ${name}`,
      subtitle: c.raw_summary ? c.raw_summary.slice(0, 90) : null,
      created_at: c.start_time ?? new Date().toISOString(),
    };
  });

  const fromFailures: DashEvent[] = failures.slice(0, 10).map((f) => ({
    id: `f-${f.conversation_id}`,
    kind: "missed",
    title: `Call not connected (${f.failure_reason ?? "unknown"})`,
    subtitle: f.error_description ?? f.error_code ?? null,
    created_at: f.preprocessed_at ?? new Date().toISOString(),
  }));

  return [...fromCalls, ...fromFailures]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 12);
}

export async function audioForCall(agentId: string, conversationId: string) {
  const client = createElevenLabsClient();
  if (!client || !agentId) return null;

  const { data } = await client
    .from("elevenlabs_audio")
    .select("conversation_id, agent_id, full_audio_base64, audio_format, audio_size_formatted")
    .eq("conversation_id", conversationId)
    .eq("agent_id", agentId)
    .maybeSingle();

  if (!data?.full_audio_base64) return null;
  return {
    base64: data.full_audio_base64 as string,
    format: (data.audio_format as string) ?? "mp3",
    size: (data.audio_size_formatted as string) ?? "",
  };
}

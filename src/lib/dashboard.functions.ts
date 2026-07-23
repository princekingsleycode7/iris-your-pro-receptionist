import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Overview = {
  status: "online" | "degraded" | "offline";
  callsToday: number;
  appointmentsToday: number;
  revenueOppsCentsThisWeek: number;
  missedPreventedThisWeek: number;
  weeklyCalls: number;
  weeklyAppointments: number;
  weeklyEscalated: number;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

async function seedIfEmpty(supabase: any, userId: string) {
  const { count } = await supabase
    .from("calls")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
    
  if ((count ?? 0) > 0) return;

  const now = Date.now();
  const min = (m: number) => new Date(now - m * 60_000).toISOString();
  const hr = (h: number) => new Date(now - h * 3_600_000).toISOString();
  const day = (d: number) => new Date(now - d * 86_400_000).toISOString();

  const callsRows = [
    { caller_name: "John Alvarez", phone: "+13015550118", started_at: min(3), duration_seconds: 72, outcome: "appointment_booked", revenue_opportunity_cents: 45000, summary: "Kitchen sink leak — booked for Thursday 10am. Confirmed address and phone." },
    { caller_name: "Sarah Chen", phone: "+13015550142", started_at: min(24), duration_seconds: 118, outcome: "appointment_booked", revenue_opportunity_cents: 22000, summary: "Annual checkup — booked Friday 2pm." },
    { caller_name: "Marcus Bell", phone: "+13015550183", started_at: min(58), duration_seconds: 41, outcome: "transferred", revenue_opportunity_cents: 0, summary: "Asked to speak with owner — transferred to front desk." },
    { caller_name: "Priya Nair", phone: "+13015550164", started_at: hr(2), duration_seconds: 65, outcome: "appointment_booked", revenue_opportunity_cents: 30000, summary: "New patient intake — booked Monday 9am." },
    { caller_name: "David Okoye", phone: "+13015550172", started_at: hr(3), duration_seconds: 22, outcome: "missed", revenue_opportunity_cents: 60000, summary: "Emergency water heater. Caller hung up before booking. Recommend callback." },
    { caller_name: "Elena Rossi", phone: "+13015550190", started_at: hr(4), duration_seconds: 94, outcome: "info_only", revenue_opportunity_cents: 0, summary: "Asked about hours and pricing." },
    { caller_name: "Tomas Weber", phone: "+13015550111", started_at: hr(5), duration_seconds: 130, outcome: "appointment_booked", revenue_opportunity_cents: 55000, summary: "Bathroom remodel consult — booked next Tuesday 11am." },
    { caller_name: "Aisha Kone", phone: "+13015550128", started_at: hr(7), duration_seconds: 39, outcome: "voicemail", revenue_opportunity_cents: 15000, summary: "Left voicemail requesting quote for drain cleaning." },
    { caller_name: "Ryan Park", phone: "+13015550155", started_at: hr(20), duration_seconds: 88, outcome: "appointment_booked", revenue_opportunity_cents: 28000, summary: "Booked Saturday 10am." },
    { caller_name: "Nora Fischer", phone: "+13015550109", started_at: day(1), duration_seconds: 66, outcome: "missed", revenue_opportunity_cents: 40000, summary: "Rang out — needs follow up." },
    { caller_name: "Kai Nakamura", phone: "+13015550176", started_at: day(1), duration_seconds: 102, outcome: "appointment_booked", revenue_opportunity_cents: 35000, summary: "Booked service visit." },
    { caller_name: "Jorge Medina", phone: "+13015550133", started_at: day(2), duration_seconds: 57, outcome: "transferred", revenue_opportunity_cents: 0, summary: "Warranty question — transferred." },
    { caller_name: "Lena Osei", phone: "+13015550166", started_at: day(3), duration_seconds: 74, outcome: "appointment_booked", revenue_opportunity_cents: 26000, summary: "New client booked." },
    { caller_name: "Ben Carter", phone: "+13015550112", started_at: day(4), duration_seconds: 30, outcome: "info_only", revenue_opportunity_cents: 0, summary: "General inquiry." },
  ].map((c) => ({ ...c, user_id: userId }));

  const { data: inserted } = await supabase.from("calls").insert(callsRows).select("id, caller_name, started_at, outcome");

  const activity = [
    { kind: "call_live", title: "Talking with John Alvarez", subtitle: "In progress · plumbing", meta: { started_at: min(1) } },
    { kind: "appointment_booked", title: "Appointment booked for Sarah Chen", subtitle: "Friday 2:00 PM" },
    { kind: "transferred", title: "Call transferred to Front Desk", subtitle: "Marcus Bell" },
    { kind: "appointment_booked", title: "Appointment booked for Priya Nair", subtitle: "Monday 9:00 AM" },
    { kind: "missed", title: "Missed call flagged for callback", subtitle: "David Okoye · high-value" },
    { kind: "call_completed", title: "Call completed with Elena Rossi", subtitle: "Info only" },
  ].map((a) => ({ ...a, user_id: userId }));
  
  await supabase.from("activity_events").insert(activity);

  const appts = (inserted ?? [])
    .filter((c: any) => c.outcome === "appointment_booked")
    .slice(0, 6)
    .map((c: any, i: number) => ({
      user_id: userId,
      customer_name: c.caller_name,
      scheduled_at: new Date(Date.now() + (i + 1) * 86_400_000).toISOString(),
      service: "Service visit",
      status: "confirmed",
      created_from_call_id: c.id,
    }));
    
  if (appts.length) await supabase.from("appointments").insert(appts);

  await supabase
    .from("receptionist_status")
    .upsert({ user_id: userId, state: "online" }, { onConflict: "user_id" });
}

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Overview> => {
    const { supabase, userId } = context;
    await seedIfEmpty(supabase, userId);

    const today = startOfToday();
    const week = startOfWeek();

    const [callsToday, apptsToday, weekCalls, weekAppts, weekMissed, weekTransferred, statusRow] =
      await Promise.all([
        supabase.from("calls").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("started_at", today),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("scheduled_at", today),
        supabase.from("calls").select("revenue_opportunity_cents, outcome").eq("user_id", userId).gte("started_at", week),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("user_id", userId).gte("scheduled_at", week),
        supabase.from("calls").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("outcome", "missed").gte("started_at", week),
        supabase.from("calls").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("outcome", "transferred").gte("started_at", week),
        supabase.from("receptionist_status").select("state").eq("user_id", userId).maybeSingle(),
      ]);

    const revenueOppsCentsThisWeek = (weekCalls.data ?? []).reduce(
      (s: number, c: any) => s + (c.outcome === "appointment_booked" ? c.revenue_opportunity_cents : 0),
      0,
    );

    return {
      status: (statusRow.data?.state as any) ?? "online",
      callsToday: callsToday.count ?? 0,
      appointmentsToday: apptsToday.count ?? 0,
      revenueOppsCentsThisWeek,
      missedPreventedThisWeek: weekMissed.count ?? 0,
      weeklyCalls: (weekCalls.data ?? []).length,
      weeklyAppointments: weekAppts.count ?? 0,
      weeklyEscalated: weekTransferred.count ?? 0,
    };
  });

export const getLiveActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("activity_events")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(10);
      
    return data ?? [];
  });

export const getRecentCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("calls")
      .select("id, caller_name, phone, started_at, duration_seconds, outcome, summary, revenue_opportunity_cents")
      .eq("user_id", context.userId)
      .order("started_at", { ascending: false })
      .limit(25);
      
    return data ?? [];
  });

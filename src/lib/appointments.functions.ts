import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Fetch local database appointments
    const { data: dbAppointments } = await supabase
      .from("appointments")
      .select("id, customer_name, scheduled_at, service, status, created_from_call_id, created_at")
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: true });

    return dbAppointments ?? [];
  });

export const syncCalComBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Fetch user Cal.com credentials from settings table
    const { data: settings } = await supabase
      .from("user_settings")
      .select("cal_com_api_key")
      .eq("user_id", userId)
      .maybeSingle();

    if (!settings?.cal_com_api_key) {
      throw new Error("Cal.com API key not configured. Add it in Settings.");
    }

    // Fetch bookings from Cal.com API v1
    const res = await fetch(`https://api.cal.com/v1/bookings?apiKey=${settings.cal_com_api_key}`);
    if (!res.ok) throw new Error("Failed to reach Cal.com API");

    const json = await res.json();
    const calBookings = json.bookings || [];

    // Map and upsert into Supabase appointments
    const upserts = calBookings.map((b: any) => ({
      user_id: userId,
      customer_name: b.responses?.name || b.attendees?.[0]?.name || "Cal.com Client",
      scheduled_at: b.startTime,
      service: b.title || "Consultation",
      status: b.status === "CANCELLED" ? "cancelled" : "confirmed",
    }));

    if (upserts.length > 0) {
      await supabase.from("appointments").upsert(upserts, { onConflict: "user_id, scheduled_at" });
    }

    return { syncedCount: upserts.length };
  });

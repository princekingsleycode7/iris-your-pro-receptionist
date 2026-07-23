import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("calls")
      .select("id, caller_name, phone, started_at, duration_seconds, outcome, summary, transcript, revenue_opportunity_cents, raw_payload")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  });

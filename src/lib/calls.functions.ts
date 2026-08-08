import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_settings")
      .select("agent_id")
      .eq("user_id", context.userId)
      .maybeSingle();

    const agentId = ((data as any)?.agent_id ?? "").trim();
    const { callsForAgent } = await import("./elevenlabs.server");
    return callsForAgent(agentId, 200);
  });

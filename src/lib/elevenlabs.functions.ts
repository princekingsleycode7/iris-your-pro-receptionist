import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function agentIdFor(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_settings")
    .select("agent_id")
    .eq("user_id", userId)
    .maybeSingle();
  return (data?.agent_id ?? "").trim();
}

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const agentId = await agentIdFor(context.supabase, context.userId);
    const { overviewForAgent } = await import("./elevenlabs.server");
    return overviewForAgent(agentId);
  });

export const getRecentCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const agentId = await agentIdFor(context.supabase, context.userId);
    const { callsForAgent } = await import("./elevenlabs.server");
    return callsForAgent(agentId, 25);
  });

export const getAllCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const agentId = await agentIdFor(context.supabase, context.userId);
    const { callsForAgent } = await import("./elevenlabs.server");
    return callsForAgent(agentId, 200);
  });

export const getLiveActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const agentId = await agentIdFor(context.supabase, context.userId);
    const { activityForAgent } = await import("./elevenlabs.server");
    return activityForAgent(agentId);
  });

export const getCallAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { conversationId: string }) => input)
  .handler(async ({ context, data }) => {
    const agentId = await agentIdFor(context.supabase, context.userId);
    const { audioForCall } = await import("./elevenlabs.server");
    return audioForCall(agentId, data.conversationId);
  });

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return data ?? {
      receptionist_name: "Iris",
      greeting: "Hello, thank you for calling. How can I assist you today?",
      system_prompt: "You are an intelligent, polite receptionist. Your goal is to qualify callers, answer questions, and schedule appointments.",
      transfer_phone_number: "",
      cal_com_api_key: "",
      cal_com_event_type_id: "",
      timezone: "Africa/Lagos",
    };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }: { context: any; data: any }) => {
    const { supabase, userId } = context;

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) throw new Error(error.message);
    return { success: true };
  });

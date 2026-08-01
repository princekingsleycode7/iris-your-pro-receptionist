import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ReceptionistSettings = {
  receptionist_name: string;
  greeting: string;
  system_prompt: string;
  transfer_phone_number: string;
  cal_com_api_key: string;
  cal_com_event_type_id: string;
  timezone: string;
};

export const getSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ReceptionistSettings> => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      receptionist_name: data?.receptionist_name ?? "Iris",
      greeting:
        data?.greeting ?? "Hello, thank you for calling. How can I assist you today?",
      system_prompt:
        data?.system_prompt ??
        "You are an intelligent, polite receptionist. Your goal is to qualify callers, answer questions, and schedule appointments.",
      transfer_phone_number: data?.transfer_phone_number ?? "",
      cal_com_api_key: data?.cal_com_api_key ?? "",
      cal_com_event_type_id: data?.cal_com_event_type_id ?? "",
      timezone: data?.timezone ?? "Africa/Lagos",
    };
  });


export const updateSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: Partial<ReceptionistSettings>) => data)
  .handler(async ({ context, data }) => {

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

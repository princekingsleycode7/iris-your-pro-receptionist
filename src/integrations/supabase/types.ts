export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["activity_kind"]
          meta: Json
          subtitle: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["activity_kind"]
          meta?: Json
          subtitle?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"]
          meta?: Json
          subtitle?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          created_from_call_id: string | null
          customer_name: string
          id: string
          phone: string | null
          scheduled_at: string
          service: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_from_call_id?: string | null
          customer_name: string
          id?: string
          phone?: string | null
          scheduled_at: string
          service?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_from_call_id?: string | null
          customer_name?: string
          id?: string
          phone?: string | null
          scheduled_at?: string
          service?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_created_from_call_id_fkey"
            columns: ["created_from_call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          caller_name: string
          created_at: string
          duration_seconds: number
          id: string
          outcome: Database["public"]["Enums"]["call_outcome"]
          phone: string | null
          recording_url: string | null
          revenue_opportunity_cents: number
          started_at: string
          summary: string | null
          user_id: string
        }
        Insert: {
          caller_name: string
          created_at?: string
          duration_seconds?: number
          id?: string
          outcome?: Database["public"]["Enums"]["call_outcome"]
          phone?: string | null
          recording_url?: string | null
          revenue_opportunity_cents?: number
          started_at?: string
          summary?: string | null
          user_id: string
        }
        Update: {
          caller_name?: string
          created_at?: string
          duration_seconds?: number
          id?: string
          outcome?: Database["public"]["Enums"]["call_outcome"]
          phone?: string | null
          recording_url?: string | null
          revenue_opportunity_cents?: number
          started_at?: string
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      receptionist_status: {
        Row: {
          state: Database["public"]["Enums"]["receptionist_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          state?: Database["public"]["Enums"]["receptionist_state"]
          updated_at?: string
          user_id: string
        }
        Update: {
          state?: Database["public"]["Enums"]["receptionist_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          agent_id: string
          cal_com_api_key: string
          cal_com_event_type_id: string
          created_at: string
          greeting: string
          id: string
          receptionist_name: string
          system_prompt: string
          timezone: string
          transfer_phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string
          cal_com_api_key?: string
          cal_com_event_type_id?: string
          created_at?: string
          greeting?: string
          id?: string
          receptionist_name?: string
          system_prompt?: string
          timezone?: string
          transfer_phone_number?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          cal_com_api_key?: string
          cal_com_event_type_id?: string
          created_at?: string
          greeting?: string
          id?: string
          receptionist_name?: string
          system_prompt?: string
          timezone?: string
          transfer_phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_kind:
        | "call_live"
        | "call_completed"
        | "appointment_booked"
        | "transferred"
        | "missed"
      call_outcome:
        | "appointment_booked"
        | "transferred"
        | "voicemail"
        | "missed"
        | "info_only"
      receptionist_state: "online" | "degraded" | "offline"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_kind: [
        "call_live",
        "call_completed",
        "appointment_booked",
        "transferred",
        "missed",
      ],
      call_outcome: [
        "appointment_booked",
        "transferred",
        "voicemail",
        "missed",
        "info_only",
      ],
      receptionist_state: ["online", "degraded", "offline"],
    },
  },
} as const

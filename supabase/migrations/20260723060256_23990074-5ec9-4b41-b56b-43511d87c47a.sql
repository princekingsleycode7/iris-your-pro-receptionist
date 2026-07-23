
CREATE TYPE public.call_outcome AS ENUM ('appointment_booked','transferred','voicemail','missed','info_only');
CREATE TYPE public.activity_kind AS ENUM ('call_live','call_completed','appointment_booked','transferred','missed');
CREATE TYPE public.receptionist_state AS ENUM ('online','degraded','offline');

CREATE TABLE public.calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  caller_name text NOT NULL,
  phone text,
  started_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds integer NOT NULL DEFAULT 0,
  outcome public.call_outcome NOT NULL DEFAULT 'info_only',
  revenue_opportunity_cents integer NOT NULL DEFAULT 0,
  summary text,
  recording_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calls TO authenticated;
GRANT ALL ON public.calls TO service_role;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own calls" ON public.calls FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  phone text,
  scheduled_at timestamptz NOT NULL,
  service text,
  status text NOT NULL DEFAULT 'confirmed',
  created_from_call_id uuid REFERENCES public.calls(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind public.activity_kind NOT NULL,
  title text NOT NULL,
  subtitle text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_events TO authenticated;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own activity" ON public.activity_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;

CREATE TABLE public.receptionist_status (
  user_id uuid PRIMARY KEY,
  state public.receptionist_state NOT NULL DEFAULT 'online',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receptionist_status TO authenticated;
GRANT ALL ON public.receptionist_status TO service_role;
ALTER TABLE public.receptionist_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own status" ON public.receptionist_status FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX calls_user_started_idx ON public.calls (user_id, started_at DESC);
CREATE INDEX appointments_user_sched_idx ON public.appointments (user_id, scheduled_at DESC);
CREATE INDEX activity_user_created_idx ON public.activity_events (user_id, created_at DESC);

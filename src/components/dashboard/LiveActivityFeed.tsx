import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Event = {
  id: string;
  kind: "call_live" | "call_completed" | "appointment_booked" | "transferred" | "missed";
  title: string;
  subtitle: string | null;
  created_at: string;
};

const ICONS: Record<Event["kind"], { dot: string; symbol: string }> = {
  call_live: { dot: "bg-emerald-500", symbol: "🟢" },
  call_completed: { dot: "bg-neutral-300", symbol: "✔" },
  appointment_booked: { dot: "bg-blue-500", symbol: "📅" },
  transferred: { dot: "bg-indigo-500", symbol: "☎" },
  missed: { dot: "bg-amber-500", symbol: "⚠" },
};

function relative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function LiveActivityFeed({ initial }: { initial: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initial);

  useEffect(() => {
    const channel = supabase
      .channel("activity_events_stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_events" },
        (payload) => {
          setEvents((prev) => [payload.new as Event, ...prev].slice(0, 10));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="bg-white border border-neutral-200 rounded-2xl">
      <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h2 className="text-sm font-semibold text-neutral-900">Live Activity</h2>
        </div>
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
          Real-time
        </span>
      </div>
      <ul className="divide-y divide-neutral-100">
        {events.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-neutral-500">
            No activity yet.
          </li>
        )}
        {events.map((e) => {
          const icon = ICONS[e.kind];
          const isLive = e.kind === "call_live";
          return (
            <li
              key={e.id}
              className="px-5 py-3.5 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="relative">
                <span className={`block w-2.5 h-2.5 rounded-full ${icon.dot}`} />
                {isLive && (
                  <span className={`absolute inset-0 rounded-full ${icon.dot} opacity-60 animate-ping`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 truncate">
                  <span className="mr-1.5">{icon.symbol}</span>
                  {e.title}
                </div>
                {e.subtitle && (
                  <div className="text-xs text-neutral-500 truncate">{e.subtitle}</div>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 shrink-0">
                {relative(e.created_at)}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

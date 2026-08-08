import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCallAudio } from "@/lib/elevenlabs.functions";

type Call = {
  id: string;
  caller_name: string;
  phone: string | null;
  started_at: string;
  duration_seconds: number;
  outcome: "appointment_booked" | "transferred" | "voicemail" | "missed" | "info_only";
  summary: string | null;
  transcript?: string | null;
  revenue_opportunity_cents: number;
};

const OUTCOME_META: Record<Call["outcome"], { label: string; className: string }> = {
  appointment_booked: { label: "✔ Appointment Booked", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  transferred: { label: "☎ Transferred", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  voicemail: { label: "📩 Voicemail", className: "bg-neutral-100 text-neutral-700 border-neutral-200" },
  missed: { label: "⚠ Missed — Follow up", className: "bg-amber-50 text-amber-700 border-amber-200" },
  info_only: { label: "ℹ Info Only", className: "bg-neutral-50 text-neutral-600 border-neutral-200" },
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

export function RecentCallsTable({ calls }: { calls: Call[] }) {
  const [open, setOpen] = useState<Call | null>(null);

  return (
    <>
      <section className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Calls & Follow-ups</h2>
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
            Last 25
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="text-left font-medium px-5 py-3">Customer</th>
                <th className="text-left font-medium px-5 py-3">Time</th>
                <th className="text-left font-medium px-5 py-3">Outcome</th>
                <th className="text-left font-medium px-5 py-3">Duration</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {calls.map((c) => {
                const m = OUTCOME_META[c.outcome];
                return (
                  <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-neutral-900">{c.caller_name}</td>
                    <td className="px-5 py-3 text-neutral-600">{fmtTime(c.started_at)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-xs px-2 py-1 rounded-full border ${m.className}`}>
                        {m.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{fmtDuration(c.duration_seconds)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setOpen(c)}
                          className="text-xs px-2.5 py-1.5 rounded-md border border-neutral-200 hover:bg-neutral-100"
                        >
                          ▶ Listen
                        </button>
                        <button
                          onClick={() => setOpen(c)}
                          className="text-xs px-2.5 py-1.5 rounded-md border border-neutral-200 hover:bg-neutral-100"
                        >
                          📄 Summary
                        </button>
                        {c.outcome === "missed" && c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-800"
                          >
                            📞 Call Back
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="md:hidden divide-y divide-neutral-100">
          {calls.map((c) => {
            const m = OUTCOME_META[c.outcome];
            return (
              <li key={c.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-neutral-900 truncate">{c.caller_name}</div>
                    <div className="text-xs text-neutral-500">
                      {fmtTime(c.started_at)} · {fmtDuration(c.duration_seconds)}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border shrink-0 ${m.className}`}>
                    {m.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(c)}
                    className="flex-1 text-xs px-2 py-1.5 rounded-md border border-neutral-200"
                  >
                    ▶ Listen
                  </button>
                  <button
                    onClick={() => setOpen(c)}
                    className="flex-1 text-xs px-2 py-1.5 rounded-md border border-neutral-200"
                  >
                    📄 Summary
                  </button>
                  {c.outcome === "missed" && c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="flex-1 text-xs px-2 py-1.5 rounded-md bg-neutral-900 text-white text-center font-semibold"
                    >
                      📞 Call
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Summary modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-wider">Call Summary</div>
                <div className="text-lg font-bold mt-1">{open.caller_name}</div>
                <div className="text-xs text-neutral-500">
                  {fmtTime(open.started_at)} · {fmtDuration(open.duration_seconds)}
                </div>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="text-neutral-400 hover:text-neutral-900 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
              {open.summary ?? "No summary available."}
            </p>
            {open.phone && (
              <a
                href={`tel:${open.phone}`}
                className="mt-5 block text-center bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-neutral-800"
              >
                📞 Call {open.caller_name} back
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

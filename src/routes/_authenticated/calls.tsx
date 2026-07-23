import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCalls } from "@/lib/calls.functions";
import { Phone, Clock, FileText, Search, User, Filter, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/calls")({
  head: () => ({ meta: [{ title: "Call Logs — Iris AI" }] }),
  component: CallsPage,
});

function CallsPage() {
  const fetchCallsFn = useServerFn(getCalls);
  const { data: calls } = useSuspenseQuery(
    queryOptions({ queryKey: ["calls-list"], queryFn: () => fetchCallsFn() })
  );

  const [search, setSearch] = useState("");
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [selectedCall, setSelectedCall] = useState<any | null>(null);

  const filteredCalls = calls.filter((call: any) => {
    const matchesSearch =
      (call.caller_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (call.phone || "").includes(search) ||
      (call.summary || "").toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = filterOutcome === "all" || call.outcome === filterOutcome;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Call History</h1>
        <p className="text-sm text-neutral-500">Review all conversations handled by your AI receptionist.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search caller name, phone, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Outcomes</option>
            <option value="appointment_booked">Appointment Booked</option>
            <option value="transferred">Transferred</option>
            <option value="missed">Missed</option>
            <option value="info_only">Info Only</option>
            <option value="voicemail">Voicemail</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Caller</th>
              <th className="px-4 py-3 font-medium">Outcome</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Date & Time</th>
              <th className="px-4 py-3 font-medium">Summary</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredCalls.map((call: any) => (
              <tr key={call.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900">{call.caller_name || "Unknown Caller"}</div>
                  <div className="text-xs text-neutral-500">{call.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    call.outcome === "appointment_booked" ? "bg-emerald-100 text-emerald-800" :
                    call.outcome === "transferred" ? "bg-amber-100 text-amber-800" :
                    call.outcome === "missed" ? "bg-red-100 text-red-800" : "bg-neutral-100 text-neutral-700"
                  }`}>
                    {call.outcome?.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </div>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Date(call.started_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">
                  {call.summary || "No summary available."}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedCall(call)}
                    className="text-xs font-medium text-neutral-900 underline hover:text-neutral-600"
                  >
                    View Call
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Call Detail Side Drawer */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold">Call Details</h2>
                <button onClick={() => setSelectedCall(null)} className="p-1 hover:bg-neutral-100 rounded">
                  <X className="h-5 w-5 text-neutral-500" />
                </button>
              </div>

              <div>
                <div className="text-xl font-semibold">{selectedCall.caller_name}</div>
                <div className="text-sm text-neutral-500">{selectedCall.phone}</div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="font-semibold text-neutral-900">Call Summary</div>
                <p className="text-neutral-600 leading-relaxed">{selectedCall.summary}</p>
              </div>

              {selectedCall.transcript && (
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-neutral-900">Full Transcript</div>
                  <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-xs font-mono space-y-2 max-h-60 overflow-y-auto">
                    {Array.isArray(selectedCall.transcript) ? (
                      selectedCall.transcript.map((msg: any, idx: number) => (
                        <div key={idx}>
                          <span className="text-neutral-400 uppercase">{msg.role}:</span> {msg.content}
                        </div>
                      ))
                    ) : (
                      <p>{JSON.stringify(selectedCall.transcript, null, 2)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCall(null)}
              className="mt-6 w-full py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

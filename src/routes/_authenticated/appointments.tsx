import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAppointments, syncCalComBookings } from "@/lib/appointments.functions";
import { Calendar, RefreshCw, CheckCircle, Clock, User, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Iris AI" }] }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const queryClient = useQueryClient();
  const fetchAppointmentsFn = useServerFn(getAppointments);
  const syncCalFn = useServerFn(syncCalComBookings);

  const { data: appointments } = useSuspenseQuery(
    queryOptions({ queryKey: ["appointments-list"], queryFn: () => fetchAppointmentsFn() })
  );

  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const syncMutation = useMutation({
    mutationFn: async () => await syncCalFn(),
    onSuccess: (res) => {
      setSyncStatus(`Successfully synced ${res.syncedCount} bookings from Cal.com!`);
      queryClient.invalidateQueries({ queryKey: ["appointments-list"] });
    },
    onError: (err: any) => setSyncStatus(`Sync error: ${err.message}`),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments & Bookings</h1>
          <p className="text-sm text-neutral-500">Booked automatically by Iris or synced from Cal.com.</p>
        </div>

        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
          Sync Cal.com
        </button>
      </div>

      {syncStatus && (
        <div className="p-3 text-xs bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-800">
          {syncStatus}
        </div>
      )}

      {/* Appointment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((appt: any) => (
          <div key={appt.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                  appt.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {appt.status}
                </span>
                <span className="text-xs text-neutral-400">
                  {appt.created_from_call_id ? "Iris AI Call" : "External Calendar"}
                </span>
              </div>

              <div className="font-semibold text-lg text-neutral-900">{appt.customer_name}</div>
              <div className="text-sm text-neutral-600 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neutral-400" />
                {new Date(appt.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-sm text-neutral-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-400" />
                {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex justify-between items-center">
              <span>Service: {appt.service || "General Booking"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

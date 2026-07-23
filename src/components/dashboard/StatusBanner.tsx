type Props = {
  status: "online" | "degraded" | "offline";
  weeklyCalls: number;
  weeklyAppointments: number;
  weeklyEscalated: number;
};

export function StatusBanner({ status, weeklyCalls, weeklyAppointments, weeklyEscalated }: Props) {
  const healthy = status === "online";
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 ${
        healthy
          ? "bg-emerald-50/60 border-emerald-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`relative flex w-2.5 h-2.5 shrink-0 ${
            healthy ? "" : ""
          }`}
        >
          {healthy && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              healthy ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
        </span>
        <div>
          <div className="text-sm sm:text-base font-semibold text-neutral-900">
            {healthy
              ? "Your AI Receptionist is working normally."
              : "Your AI Receptionist needs your attention."}
          </div>
          <div className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Answered <strong>{weeklyCalls}</strong> calls this week. Booked{" "}
            <strong>{weeklyAppointments}</strong> appointments. Escalated{" "}
            <strong>{weeklyEscalated}</strong> calls to your staff.{" "}
            {healthy ? "No action needed." : "Please review flagged calls below."}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  callsToday: number;
  appointmentsToday: number;
  revenueOppsCentsThisWeek: number;
  missedPreventedThisWeek: number;
};

function Card({
  emoji,
  label,
  value,
  hint,
}: {
  emoji: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xl leading-none">{emoji}</span>
      </div>
      <div className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}

export function MetricCards({
  callsToday,
  appointmentsToday,
  revenueOppsCentsThisWeek,
  missedPreventedThisWeek,
}: Props) {
  const revenue = `$${(revenueOppsCentsThisWeek / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card emoji="📞" label="Calls Handled Today" value={String(callsToday)} hint="Since 12:00 AM" />
      <Card emoji="📅" label="Appointments Booked" value={String(appointmentsToday)} hint="Scheduled today" />
      <Card emoji="💰" label="Revenue Opps Captured" value={revenue} hint="Last 7 days" />
      <Card emoji="❌" label="Missed Calls Prevented" value={String(missedPreventedThisWeek)} hint="Last 7 days" />
    </div>
  );
}

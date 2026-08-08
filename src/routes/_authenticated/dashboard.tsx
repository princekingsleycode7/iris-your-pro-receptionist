import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
import {
  getDashboardOverview,
  getLiveActivity,
  getRecentCalls,
} from "@/lib/elevenlabs.functions";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Iris AI Receptionist" },
      {
        name: "description",
        content:
          "Your AI Receptionist control panel — see calls handled, appointments booked, and revenue captured today.",
      },
      { property: "og:title", content: "Dashboard — Iris AI Receptionist" },
      {
        property: "og:description",
        content: "Calls, appointments, and revenue at a glance.",
      },
    ],
  }),
  component: DashboardPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-sm text-neutral-600">
      Something went wrong loading your dashboard. {error.message}
    </div>
  ),
});

function DashboardPage() {
  const { user } = Route.useRouteContext();

  return (
    <DashboardLayout email={user?.email ?? undefined}>
      <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading your dashboard…</div>}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}

function DashboardContent() {
  const overviewFn = useServerFn(getDashboardOverview);
  const activityFn = useServerFn(getLiveActivity);
  const callsFn = useServerFn(getRecentCalls);

  const overview = useSuspenseQuery(
    queryOptions({ queryKey: ["dashboard-overview"], queryFn: () => overviewFn() }),
  );
  const activity = useSuspenseQuery(
    queryOptions({ queryKey: ["dashboard-activity"], queryFn: () => activityFn() }),
  );
  const calls = useSuspenseQuery(
    queryOptions({ queryKey: ["dashboard-calls"], queryFn: () => callsFn() }),
  );

  const o = overview.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Here's what your receptionist has been up to.
        </p>
      </div>

      <StatusBanner
        status={o.status}
        weeklyCalls={o.weeklyCalls}
        weeklyAppointments={o.weeklyAppointments}
        weeklyEscalated={o.weeklyEscalated}
      />

      <MetricCards
        callsToday={o.callsToday}
        appointmentsToday={o.appointmentsToday}
        revenueOppsCentsThisWeek={o.revenueOppsCentsThisWeek}
        missedPreventedThisWeek={o.missedPreventedThisWeek}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <LiveActivityFeed initial={activity.data as any} />
        </div>
        <div className="lg:col-span-3">
          <RecentCallsTable calls={calls.data as any} />
        </div>
      </div>
    </div>
  );
}

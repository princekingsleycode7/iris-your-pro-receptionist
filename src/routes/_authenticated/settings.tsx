import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSettings, updateSettings } from "@/lib/settings.functions";
import { Save, Bot, Calendar, Phone, Globe } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Iris AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const fetchSettingsFn = useServerFn(getSettings);
  const saveSettingsFn = useServerFn(updateSettings);

  const { data: initialSettings } = useSuspenseQuery(
    queryOptions({ queryKey: ["user-settings"], queryFn: () => fetchSettingsFn() })
  );

  const [form, setForm] = useState(initialSettings);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => await saveSettingsFn({ data: form }),
    onSuccess: () => setSaveMessage("Settings saved successfully!"),
    onError: (err: any) => setSaveMessage(`Error saving settings: ${err.message}`),
  });

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receptionist & System Settings</h1>
        <p className="text-sm text-neutral-500">Configure how Iris manages phone calls, prompts, and integrations.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="space-y-6"
      >
        {/* Receptionist Configuration */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 font-semibold text-neutral-900">
            <Bot className="h-5 w-5 text-neutral-700" /> AI Receptionist Identity
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Receptionist Name</label>
              <input
                type="text"
                value={form.receptionist_name}
                onChange={(e) => setForm({ ...form, receptionist_name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Transfer Phone Number</label>
              <input
                type="text"
                placeholder="+234..."
                value={form.transfer_phone_number || ""}
                onChange={(e) => setForm({ ...form, transfer_phone_number: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Greeting Speech</label>
            <input
              type="text"
              value={form.greeting}
              onChange={(e) => setForm({ ...form, greeting: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">System Instructions / Prompt Rules</label>
            <textarea
              rows={4}
              value={form.system_prompt}
              onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-xs"
            />
          </div>
        </div>

        {/* Cal.com Scheduling Integration */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 font-semibold text-neutral-900">
            <Calendar className="h-5 w-5 text-neutral-700" /> Cal.com Scheduling Integration
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cal.com API Key</label>
              <input
                type="password"
                placeholder="cal_live_..."
                value={form.cal_com_api_key || ""}
                onChange={(e) => setForm({ ...form, cal_com_api_key: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Event Type ID</label>
              <input
                type="text"
                placeholder="e.g. 123456"
                value={form.cal_com_event_type_id || ""}
                onChange={(e) => setForm({ ...form, cal_com_event_type_id: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Timezone</label>
            <input
              type="text"
              value={form.timezone || "Africa/Lagos"}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Receptionist ID
            </label>
            <input
              type="text"
              placeholder="Paste the ID for your receptionist line"
              value={(form as any).agent_id || ""}
              onChange={(e) => setForm({ ...form, agent_id: e.target.value } as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <p className="mt-1 text-[11px] text-neutral-500">
              Links your dashboard to the calls your receptionist handles.
            </p>
          </div>
        </div>


        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          {saveMessage && <span className="text-xs text-neutral-600">{saveMessage}</span>}
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="ml-auto inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

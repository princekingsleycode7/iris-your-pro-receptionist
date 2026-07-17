import { Reveal } from "./Reveal";

const logos = [
  "Salesforce",
  "Zendesk",
  "Hubspot",
  "ServiceNow",
  "Slack",
  "SAP",
  "Twilio",
  "Notion",
];

export function IntegrationsSection() {
  const row = [...logos, ...logos];
  return (
    <section id="integrations" className="py-24 md:py-32 overflow-hidden">
      <Reveal>
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05] mb-12 md:mb-16 px-6">
          Integrates with everything you use.
        </h2>
      </Reveal>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-2xl md:text-3xl font-black tracking-tight text-tesla-dark/70 font-[family-name:var(--font-display)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

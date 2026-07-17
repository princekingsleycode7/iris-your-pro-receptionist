import { Reveal } from "./Reveal";

export function ScaleSection() {
  return (
    <section id="scale" className="py-24 md:py-32 px-6 md:px-10 bg-stone-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <Reveal>
          <div className="relative aspect-square rounded-3xl bg-white ring-1 ring-black/5 overflow-hidden">
            {/* Grid globe visual */}
            <div className="absolute inset-0 grid place-items-center">
              <svg
                viewBox="0 0 400 400"
                className="w-[80%] h-[80%] text-tesla-dark/15 animate-spin-slow"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <circle cx="200" cy="200" r="180" />
                <ellipse cx="200" cy="200" rx="180" ry="60" />
                <ellipse cx="200" cy="200" rx="180" ry="120" />
                <ellipse cx="200" cy="200" rx="60" ry="180" />
                <ellipse cx="200" cy="200" rx="120" ry="180" />
                <line x1="20" y1="200" x2="380" y2="200" />
                <line x1="200" y1="20" x2="200" y2="380" />
              </svg>
            </div>
            {/* Signal dots */}
            <span className="absolute top-[28%] left-[30%] w-2 h-2 rounded-full bg-tesla-red animate-pulse" />
            <span
              className="absolute top-[52%] left-[62%] w-2 h-2 rounded-full bg-tesla-red animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <span
              className="absolute top-[70%] left-[38%] w-2 h-2 rounded-full bg-tesla-red animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute top-5 left-5 text-[10px] font-mono uppercase tracking-[0.25em] text-tesla-dark/40">
              GLOBAL INFRASTRUCTURE
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-6">
            Enterprise Scale
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05]">
            Built for the Fortune 500.
          </h2>
          <p className="mt-6 text-tesla-gray leading-relaxed max-w-lg">
            Deploy Iris across ten thousand lines simultaneously. No server lag,
            no dropped calls. A global edge network keeps her always online,
            always ready.
          </p>
          <ul className="mt-8 space-y-3.5">
            {[
              "SOC 2 Type II Compliant",
              "End-to-End Encrypted Conversations",
              "Custom API & CRM Integrations",
              "99.99% Uptime SLA",
            ].map((line) => (
              <li
                key={line}
                className="flex items-center gap-3 text-sm font-semibold text-tesla-dark"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-tesla-red" />
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

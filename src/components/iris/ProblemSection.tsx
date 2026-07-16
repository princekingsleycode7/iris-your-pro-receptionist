import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export function ProblemSection() {
  return (
    <section id="problem" className="py-32 px-6 md:px-10 bg-tesla-dark text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-6">
            The Problem
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05]">
            Customer service is broken. We fixed the logic.
          </h2>
          <p className="mt-6 text-stone-400 leading-relaxed max-w-lg">
            Hold music is a failure of scale. Scripted bots are a failure of
            intelligence. Iris processes intent at 1.2 teraflops, ensuring no
            customer ever repeats themselves.
          </p>
          <div className="mt-10 space-y-5">
            <div className="border-l-2 border-tesla-red pl-6 py-1 flex items-baseline gap-5">
              <span className="text-4xl font-black font-[family-name:var(--font-display)]">
                <CountUp value={0} suffix="ms" />
              </span>
              <span className="text-stone-500 text-sm">Wait time latency</span>
            </div>
            <div className="border-l-2 border-tesla-red pl-6 py-1 flex items-baseline gap-5">
              <span className="text-4xl font-black font-[family-name:var(--font-display)]">
                <CountUp value={100} suffix="%" />
              </span>
              <span className="text-stone-500 text-sm">Context retention</span>
            </div>
            <div className="border-l-2 border-tesla-red pl-6 py-1 flex items-baseline gap-5">
              <span className="text-4xl font-black font-[family-name:var(--font-display)]">
                <CountUp value={24} suffix="/7" />
              </span>
              <span className="text-stone-500 text-sm">Autonomous uptime</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative aspect-square rounded-3xl bg-white/5 ring-1 ring-white/10 overflow-hidden grid place-items-center">
            {/* Neural engine visual */}
            <div className="absolute inset-0 grid place-items-center animate-spin-slow">
              <div className="w-[70%] h-[70%] rounded-full border border-white/10" />
            </div>
            <div
              className="absolute inset-0 grid place-items-center animate-spin-slow"
              style={{ animationDirection: "reverse", animationDuration: "60s" }}
            >
              <div className="w-[50%] h-[50%] rounded-full border border-tesla-red/40" />
            </div>
            <div className="relative w-40 h-40 rounded-full bg-tesla-red/10 grid place-items-center animate-float-soft">
              <div className="w-24 h-24 rounded-full bg-tesla-red/20 grid place-items-center">
                <div className="w-12 h-12 rounded-full bg-tesla-red shadow-[0_0_60px_20px_rgba(232,25,25,0.35)]" />
              </div>
            </div>
            <div className="absolute top-5 left-5 text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
              NEURAL ENGINE
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

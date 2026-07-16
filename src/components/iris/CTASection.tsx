import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <section id="cta" className="py-32 px-6 md:px-10 bg-white border-t border-black/5">
      <Reveal>
        <div className="max-w-5xl mx-auto relative bg-tesla-dark text-white rounded-[2.5rem] p-12 md:p-16 overflow-hidden">
          {/* Animated wireframe backdrop */}
          <div className="pointer-events-none absolute -right-24 -top-24 w-[560px] h-[560px] opacity-25">
            <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse-ring" />
            <div
              className="absolute inset-10 rounded-full border border-white/20 animate-pulse-ring"
              style={{ animationDelay: "0.6s" }}
            />
            <div
              className="absolute inset-24 rounded-full border border-tesla-red/50 animate-pulse-ring"
              style={{ animationDelay: "1.2s" }}
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-6">
              Enterprise Pilot
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.02]">
              The Future is Calling.
            </h2>
            <p className="mt-6 text-lg text-stone-400 max-w-lg leading-relaxed">
              Join the enterprise pilot program and redefine what it means to
              care for your customers.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#"
                className="bg-white text-tesla-dark px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-tesla-red hover:text-white transition-all"
              >
                Contact Sales
              </a>
              <a
                href="#"
                className="border border-white/20 text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-all"
              >
                Download Whitepaper
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

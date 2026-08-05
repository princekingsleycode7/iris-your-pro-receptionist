import { Link } from "@tanstack/react-router";
import { IrisOrb } from "./IrisOrb";
import irisAgent from "@/assets/iris-agent.png.asset.json";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-16 px-5 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — message */}
        <div className="text-center lg:text-left animate-fade-up">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-gray mb-4 md:mb-5">
            Meet Iris by Clova
          </p>
          <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl font-black tracking-tight font-[family-name:var(--font-display)]">
            Never Miss Another Customer Again.
          </h1>
          <p className="mt-5 md:mt-7 text-base sm:text-lg text-tesla-gray max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Iris answers calls instantly, books appointments, qualifies leads, and
            delights your customers—day and night—so you never lose business to
            missed calls.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              to="/pricing"
              className="bg-tesla-dark text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-tesla-red transition-all"
            >
              Try Iris Free for 7 Days
            </Link>
            <a
              href="#transcript"
              className="border border-tesla-dark/15 text-tesla-dark px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-tesla-dark hover:text-white transition-all text-center"
            >
              Listen to Iris in Action
            </a>
          </div>
          <p className="mt-4 text-xs text-tesla-gray">
            No credit card required. Fully set up for your business. Cancel anytime.
          </p>
        </div>

        {/* Right — Iris */}
        <div
          className="relative animate-fade-up flex flex-col items-center"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="relative w-full max-w-[440px] aspect-[4/5]">
            {/* depth rings */}
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="relative w-[92%] aspect-square">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-tesla-stone to-white ring-1 ring-tesla-dark/5" />
                <div className="absolute inset-6 rounded-full border border-tesla-red/15 animate-pulse-ring" />
                <div
                  className="absolute inset-16 rounded-full border border-tesla-red/20 animate-pulse-ring"
                  style={{ animationDelay: "0.8s" }}
                />
              </div>
            </div>
            <img
              src={irisAgent.url}
              alt="Iris, the Clova AI receptionist, wearing a headset at her desk"
              className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)] animate-float-soft"
            />
          </div>

          <div className="mt-2 inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/80 backdrop-blur px-5 py-2.5 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-clova-neon opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-clova-neon" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-tesla-dark">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* secondary accent */}
      <div className="hidden xl:block absolute -bottom-40 left-0 w-[420px] opacity-40 pointer-events-none">
        <IrisOrb />
      </div>
    </section>
  );
}

import { IrisOrb } from "./IrisOrb";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-5 md:px-6 overflow-hidden"
    >
      <div className="text-center max-w-3xl mx-auto animate-fade-up">
        <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-gray mb-4 md:mb-5">
          Introducing Iris
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[0.95]">
          Beyond Human.
        </h1>
        <p className="mt-5 md:mt-7 text-base sm:text-lg md:text-xl text-tesla-gray max-w-xl mx-auto leading-relaxed">
          The world&apos;s first autonomous AI receptionist. Designed to eliminate the
          wait, understand the nuance, and solve the problem at Tesla speed.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 justify-center sm:flex-wrap">
          <a
            href="#cta"
            className="bg-tesla-dark text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-tesla-red transition-all"
          >
            Reserve Access
          </a>
          <a
            href="#transcript"
            className="border border-tesla-dark/15 text-tesla-dark px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-tesla-dark hover:text-white transition-all"
          >
            Watch Iris In Action
          </a>
        </div>
      </div>

      <div
        className="mt-12 md:mt-16 w-full max-w-5xl animate-fade-up"
        style={{ animationDelay: "0.35s" }}
      >
        <IrisOrb />
      </div>
    </section>
  );
}

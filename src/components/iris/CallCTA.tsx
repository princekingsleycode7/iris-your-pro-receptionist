import { useState } from "react";

const NUMBER = "+13012593104";
const DISPLAY = "+1 (301) 259‑3104";

export function CallCTA() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="bg-tesla-dark px-6 md:px-10 pb-20 md:pb-28">
      <div className="max-w-4xl mx-auto">
        <div className="[perspective:1600px]">
          <div
            className={`relative rounded-[2rem] md:rounded-[2.5rem] transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] ${
              revealed ? "[transform:rotateY(180deg)]" : ""
            }`}
            style={{ minHeight: "260px" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10 md:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="max-w-md">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-red mb-3">
                  Talk to Iris
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05] text-white">
                  Want to hear her yourself?
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/60 leading-relaxed">
                  Give Iris a call. One tap dials our live demo line.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="shrink-0 bg-tesla-red text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-tesla-dark transition-colors"
              >
                Reveal Number
              </button>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-[2rem] md:rounded-[2.5rem] border border-tesla-red/40 bg-gradient-to-br from-tesla-red/20 to-transparent p-8 sm:p-10 md:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-3">
                  Live · Tap to dial
                </p>
                <a
                  href={`tel:${NUMBER}`}
                  className="block text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] text-white hover:text-tesla-red transition-colors"
                >
                  {DISPLAY}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${NUMBER}`}
                  className="bg-white text-tesla-dark px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center hover:bg-tesla-red hover:text-white transition-colors"
                >
                  Call Now
                </a>
                <button
                  type="button"
                  onClick={() => setRevealed(false)}
                  className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

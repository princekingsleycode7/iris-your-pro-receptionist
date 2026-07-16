// Signature Iris visual: layered pulse rings + live waveform.
export function IrisOrb() {
  return (
    <div className="relative w-full aspect-[21/9] rounded-3xl bg-gradient-to-b from-stone-100 to-white ring-1 ring-black/5 overflow-hidden">
      {/* Concentric pulse rings */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[420px] h-[420px] max-w-[80%] max-h-[80%]">
          <div className="absolute inset-0 rounded-full border border-tesla-red/20 animate-pulse-ring" />
          <div
            className="absolute inset-6 rounded-full border border-tesla-red/25 animate-pulse-ring"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="absolute inset-14 rounded-full border border-tesla-red/30 animate-pulse-ring"
            style={{ animationDelay: "1.2s" }}
          />
          <div className="absolute inset-24 rounded-full bg-tesla-dark grid place-items-center shadow-2xl">
            <div className="flex items-end gap-1 h-16">
              {[0.15, 0.35, 0.55, 0.85, 0.55, 0.35, 0.15].map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-full bg-white rounded-full animate-waveform"
                  style={{
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Corner labels */}
      <div className="absolute top-4 left-5 text-[10px] font-mono uppercase tracking-[0.25em] text-tesla-dark/40">
        IRIS.CORE / V2.4
      </div>
      <div className="absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-tesla-dark/40">
        <span className="w-1.5 h-1.5 rounded-full bg-tesla-red animate-pulse" />
        LIVE
      </div>
      <div className="absolute bottom-4 left-5 text-[10px] font-mono uppercase tracking-[0.25em] text-tesla-dark/40">
        LATENCY 0.18s
      </div>
      <div className="absolute bottom-4 right-5 text-[10px] font-mono uppercase tracking-[0.25em] text-tesla-dark/40">
        FLEET · GLOBAL
      </div>
    </div>
  );
}

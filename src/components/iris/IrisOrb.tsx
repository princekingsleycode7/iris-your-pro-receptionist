import { useState } from "react";

type Stage = "idle" | "loading" | "live";

export function IrisOrb() {
  const [stage, setStage] = useState<Stage>("idle");

  const handleClick = () => {
    if (stage !== "idle") return;
    setStage("loading");
    setTimeout(() => setStage("live"), 2400);
  };

  const isLive = stage === "live";
  const isLoading = stage === "loading";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLive ? "Live conversation with Iris" : "Start live conversation"}
      className={`group relative w-full aspect-[21/9] rounded-3xl ring-1 overflow-hidden text-left transition-colors duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isLive
          ? "bg-tesla-red ring-tesla-red/40"
          : "bg-gradient-to-b from-stone-100 to-white ring-black/5 cursor-pointer"
      }`}
    >
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-[420px] h-[420px] max-w-[80%] max-h-[80%]">
          <div className={`absolute inset-0 rounded-full border animate-pulse-ring ${isLive ? "border-white/40" : "border-tesla-red/20"}`} />
          <div
            className={`absolute inset-6 rounded-full border animate-pulse-ring ${isLive ? "border-white/40" : "border-tesla-red/25"}`}
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className={`absolute inset-14 rounded-full border animate-pulse-ring ${isLive ? "border-white/50" : "border-tesla-red/30"}`}
            style={{ animationDelay: "1.2s" }}
          />
          <div className={`absolute inset-24 rounded-full grid place-items-center shadow-2xl transition-colors duration-700 ${isLive ? "bg-white" : "bg-tesla-dark"}`}>
            {isLoading ? (
              <div className={`w-10 h-10 rounded-full border-2 border-t-transparent animate-spin ${isLive ? "border-tesla-red" : "border-white"}`} />
            ) : (
              <div className="flex items-end gap-1 h-16">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-full rounded-full animate-waveform ${isLive ? "bg-tesla-red" : "bg-white"}`}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`absolute top-4 left-5 text-[10px] font-mono uppercase tracking-[0.25em] ${isLive ? "text-white/70" : "text-tesla-dark/40"}`}>
        IRIS.CORE / V2.4
      </div>
      <div className={`absolute top-4 right-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] ${isLive ? "text-white" : "text-tesla-dark/40"}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLive ? "bg-white" : "bg-tesla-red"}`} />
        {isLoading ? "LOADING GEMINI TTS…" : isLive ? "LIVE · CONNECTED" : "TAP TO SPEAK"}
      </div>
      <div className={`absolute bottom-4 left-5 text-[10px] font-mono uppercase tracking-[0.25em] ${isLive ? "text-white/70" : "text-tesla-dark/40"}`}>
        LATENCY 0.18s
      </div>
      <div className={`absolute bottom-4 right-5 text-[10px] font-mono uppercase tracking-[0.25em] ${isLive ? "text-white/70" : "text-tesla-dark/40"}`}>
        FLEET · GLOBAL
      </div>
    </button>
  );
}

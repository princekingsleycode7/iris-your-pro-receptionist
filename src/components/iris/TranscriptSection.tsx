import { useEffect, useState } from "react";
import { useInView } from "./useInView";

type Line = { speaker: "caller" | "iris"; time: string; text: string };

const script: Line[] = [
  {
    speaker: "caller",
    time: "00:02",
    text: "Hi — my Model Y delivery is tomorrow but something came up. Can I push it to Friday?",
  },
  {
    speaker: "iris",
    time: "00:03",
    text: "Of course, Priya. Fremont has a 2:30 PM Friday slot open. Would that work?",
  },
  {
    speaker: "caller",
    time: "00:09",
    text: "Perfect. Also — does mine have the acoustic glass upgrade?",
  },
  {
    speaker: "iris",
    time: "00:11",
    text: "Yes. VIN ending 4829 ships with acoustic glass and the Ultra White interior. Friday 2:30 is confirmed.",
  },
];

export function TranscriptSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const revealNext = () => {
      if (i >= script.length) return;
      setVisibleCount(i + 1);
      const full = script[i].text;
      let c = 0;
      const idx = i;
      const typer = setInterval(() => {
        c++;
        setTyped((prev) => {
          const next = [...prev];
          next[idx] = full.slice(0, c);
          return next;
        });
        if (c >= full.length) {
          clearInterval(typer);
          i++;
          setTimeout(revealNext, 500);
        }
      }, 18);
    };
    revealNext();
  }, [inView]);

  return (
    <section
      id="transcript"
      ref={ref}
      className="py-32 px-6 md:px-10 bg-tesla-dark text-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <span className="w-2 h-2 rounded-full bg-tesla-red animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-white/50">
            Live Session Transcript · Iris.core
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05] mb-16 max-w-2xl">
          A real call. Resolved in eleven seconds.
        </h2>

        <div className="space-y-10 min-h-[380px]">
          {script.map((line, i) => {
            if (i >= visibleCount) return null;
            const isIris = line.speaker === "iris";
            return (
              <div
                key={i}
                className={`animate-fade-in ${isIris ? "pl-6 border-l-2 border-tesla-red" : ""}`}
              >
                <div
                  className={`text-[10px] font-mono uppercase tracking-[0.3em] mb-2 ${
                    isIris ? "text-tesla-red" : "text-white/40"
                  }`}
                >
                  {isIris ? "Iris" : "Caller"} · {line.time}
                </div>
                <p
                  className={`text-lg md:text-xl leading-relaxed ${
                    isIris ? "text-white" : "text-white/70"
                  }`}
                >
                  {typed[i]}
                  {typed[i].length < line.text.length && (
                    <span className="inline-block w-2 h-5 bg-tesla-red translate-y-0.5 ml-0.5 animate-pulse" />
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

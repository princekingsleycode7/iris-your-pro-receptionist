import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type Metric = {
  value: string;
  label: string;
  caption: string;
  tag: string;
};

const METRICS: Metric[] = [
  {
    tag: "01 — Latency",
    value: "0ms",
    label: "Wait time.",
    caption:
      "Iris answers on the first ring. No hold queues, no elevator jazz, no lost customers.",
  },
  {
    tag: "02 — Memory",
    value: "100%",
    label: "Context retention.",
    caption:
      "Every past interaction, order, and preference is loaded before the call connects.",
  },
  {
    tag: "03 — Uptime",
    value: "24 / 7",
    label: "Always online.",
    caption:
      "Sunday 3 AM or Black Friday noon — Iris answers every call at the same tier of service.",
  },
  {
    tag: "04 — Resolution",
    value: "94%",
    label: "First-call resolved.",
    caption:
      "Autonomous reasoning closes tickets without transfers, callbacks, or escalations.",
  },
];

export function ProblemSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track visible card
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = cards.indexOf(e.target as HTMLElement);
            if (i >= 0) setIndex(i);
          }
        }
      },
      { root: el, threshold: [0.6, 0.9] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let paused = false;
    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });

    const scrollToCard = (i: number) => {
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      const card = cards[i];
      if (!card) return;
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
    };

    const id = window.setInterval(() => {
      if (paused) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards.length) return;
      scrollToCard((index + 1) % cards.length);
    }, 4200);

    return () => {
      window.clearInterval(id);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
    };
  }, [index]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const card = cards[i];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <section id="problem" className="py-24 md:py-32 px-6 md:px-10 bg-tesla-dark text-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-6">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05] max-w-3xl">
            Customer service is broken. We fixed the logic.
          </h2>
          <p className="mt-6 text-clova-sage leading-relaxed max-w-xl text-base md:text-lg">
            Hold music is a failure of scale. Scripted bots are a failure of
            intelligence. Iris processes intent in real time — no customer ever
            repeats themselves.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-14 md:mt-20 relative">
            {/* Scroller */}
            <div
              ref={scrollerRef}
              className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar"
            >
              {METRICS.map((m, i) => (
                <article
                  key={m.value}
                  data-card
                  className="snap-start shrink-0 w-[82%] sm:w-[62%] md:w-[46%] lg:w-[38%] h-[340px] md:h-[380px] rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group"
                >
                  <div
                    className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl transition-opacity duration-700 ${
                      index === i ? "opacity-100" : "opacity-30"
                    } bg-tesla-red/25`}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                      {m.tag}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">
                      0{i + 1} / 0{METRICS.length}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight font-[family-name:var(--font-display)] leading-none">
                      {m.value}
                    </div>
                    <div className="mt-4 text-xl md:text-2xl font-bold font-[family-name:var(--font-display)]">
                      {m.label}
                    </div>
                    <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs">
                      {m.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Progress dots */}
            <div className="mt-8 flex items-center gap-3">
              {METRICS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to metric ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    index === i ? "w-10 bg-tesla-red" : "w-6 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
              <span className="ml-auto text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                Scroll / Drag
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

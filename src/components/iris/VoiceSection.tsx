import { Reveal } from "./Reveal";

const features = [
  {
    title: "Adaptive Tone",
    body: "Iris reads sentiment in real time and adjusts pitch, pace, and empathy to match the caller.",
  },
  {
    title: "Multi-Lingual",
    body: "Fluent in 64 languages with native regional accents. No handoff, no translation lag.",
  },
  {
    title: "No Scripts",
    body: "Generative reasoning replaces decision trees. Every conversation is truly natural.",
  },
];

export function VoiceSection() {
  return (
    <section id="voice" className="py-32 px-6 md:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-6">
            Synthesized Empathy
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05]">
            Uncannily human voice synthesis.
          </h2>
          <p className="mt-6 text-lg text-tesla-gray max-w-2xl mx-auto leading-relaxed">
            Iris doesn&apos;t sound like a machine. She breathes, pauses, and
            emphasizes like a pro-level executive assistant. Your customers
            won&apos;t know the difference. Your balance sheet will.
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="group h-full p-8 rounded-2xl border border-black/5 bg-stone-50 hover:bg-white hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] transition-all duration-500">
                <div className="w-8 h-8 rounded-full bg-tesla-red/10 grid place-items-center mb-6">
                  <span className="w-2 h-2 rounded-full bg-tesla-red group-hover:scale-150 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-display)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-tesla-gray leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

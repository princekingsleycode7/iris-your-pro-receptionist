import { useState } from "react";

export function CallbackSection() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhone("");
    }, 4000);
  };

  return (
    <section
      id="callback"
      className="bg-tesla-dark text-white px-6 md:px-10 border-t border-white/5 flex items-center"
      style={{ minHeight: "40vh" }}
    >
      <div className="max-w-4xl mx-auto w-full py-12 md:py-16">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-red mb-3">
              Have Iris call you
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.05]">
              Drop your number.
              <br />
              Iris rings back in seconds.
            </h3>
          </div>

          <form
            onSubmit={onSubmit}
            className="w-full md:w-[380px] flex flex-col gap-3"
          >
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full pl-5 pr-1.5 py-1.5 focus-within:border-tesla-red transition-colors">
              <span className="text-white/40 text-sm font-mono mr-2">+1</span>
              <input
                type="tel"
                inputMode="tel"
                required
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent outline-none py-2.5 text-sm text-white placeholder:text-white/30"
              />
              <button
                type="submit"
                className="bg-tesla-red text-white px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-tesla-dark transition-colors"
              >
                Call Me
              </button>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 pl-5">
              {submitted
                ? "✓ Iris is dialing…"
                : "No spam. One call. Anytime."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { useState } from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  submitLabel: string;
};

export function ContactForm({ eyebrow, title, subtitle, submitLabel }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white text-tesla-dark font-[family-name:var(--font-sans)]">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-base font-black tracking-[0.3em] font-[family-name:var(--font-display)]">
          TESLA
        </Link>
        <Link
          to="/"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-dark/60 hover:text-tesla-red transition-colors"
        >
          ← Back
        </Link>
      </header>

      <section className="px-6 md:px-10 pt-8 md:pt-16 pb-24 max-w-3xl mx-auto">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-5">
          {eyebrow}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.02]">
          {title}
        </h1>
        <p className="mt-5 text-base md:text-lg text-tesla-gray max-w-xl leading-relaxed">
          {subtitle}
        </p>

        {sent ? (
          <div className="mt-12 p-8 md:p-10 rounded-3xl bg-tesla-dark text-white">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-red mb-3">
              Message received
            </p>
            <h2 className="text-2xl md:text-3xl font-black font-[family-name:var(--font-display)] tracking-tight">
              Thanks, {form.name.split(" ")[0] || "friend"}. We'll be in touch.
            </h2>
            <p className="mt-3 text-sm text-white/60">
              A member of the Iris team will reach out at {form.email} within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 md:mt-14 grid gap-5">
            <Field label="Full name">
              <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="Jane Doe" />
            </Field>
            <Field label="Email">
              <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="jane@company.com" />
            </Field>
            <Field label="Phone">
              <input required type="tel" value={form.phone} onChange={update("phone")} className={inputCls} placeholder="+1 (555) 123-4567" />
            </Field>
            <Field label="Message">
              <textarea required rows={4} value={form.message} onChange={update("message")} className={`${inputCls} resize-none`} placeholder="Tell us about your team and use case." />
            </Field>
            <button
              type="submit"
              className="mt-3 bg-tesla-dark text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-tesla-red transition-colors self-start"
            >
              {submitLabel}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const inputCls =
  "w-full bg-transparent border-b border-tesla-dark/15 focus:border-tesla-red outline-none py-3 text-base text-tesla-dark placeholder:text-tesla-dark/30 transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-tesla-dark/50">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

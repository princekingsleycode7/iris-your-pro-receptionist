import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/iris/Logo";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Clova — Talk to the Iris Team" },
      {
        name: "description",
        content:
          "Reach the Clova team. Start your free trial, request a demo, or ask anything about Iris, the AI receptionist.",
      },
      { property: "og:title", content: "Contact Clova" },
      {
        property: "og:description",
        content:
          "Reach the Clova team. Start your free trial, request a demo, or ask anything about Iris, the AI receptionist.",
      },
    ],
  }),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Iris Enterprise Inquiry — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`,
    );
    window.location.href = `mailto:newcetf@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white text-tesla-dark font-[family-name:var(--font-sans)] selection:bg-tesla-red selection:text-white">
      {/* Minimal top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-10">
          <Link
            to="/"
          >
            <Logo />
          </Link>
          <Link
            to="/"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-dark/70 hover:text-tesla-red transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="pt-32 md:pt-40 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="animate-fade-up">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-5">
              Enterprise Contact
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[0.95]">
              Let's talk.
            </h1>
            <p className="mt-6 text-lg text-tesla-gray max-w-md leading-relaxed">
              Tell us about your operation. Our team will get back within one
              business day with a pilot proposal for Iris.
            </p>

            <div className="mt-10 space-y-4 text-sm">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-gray mb-1">
                  Email
                </div>
                <a
                  href="mailto:newcetf@gmail.com"
                  className="text-tesla-dark hover:text-tesla-red transition-colors"
                >
                  newcetf@gmail.com
                </a>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-gray mb-1">
                  Direct Line
                </div>
                <a
                  href="tel:+13012593104"
                  className="text-tesla-dark hover:text-tesla-red transition-colors"
                >
                  +1 (301) 259‑3104
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-tesla-stone rounded-3xl p-8 md:p-10 space-y-5 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Field label="Name" name="name" value={form.name} onChange={onChange} required />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
            />
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-gray mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={5}
                className="w-full bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-tesla-red transition-colors resize-none"
                placeholder="Tell us about your team & call volume…"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-tesla-dark text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-tesla-red transition-colors"
            >
              {sent ? "Opening your mail app…" : "Send Message"}
            </button>
            {sent && (
              <p className="text-xs text-tesla-gray text-center animate-fade-in">
                If nothing opened, email us directly at newcetf@gmail.com
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.3em] text-tesla-gray mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white border border-black/10 rounded-full px-5 py-3 text-sm outline-none focus:border-tesla-red transition-colors"
      />
    </div>
  );
}

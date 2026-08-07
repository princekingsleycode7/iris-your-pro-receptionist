import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/iris/Logo";
import { Footer } from "@/components/iris/Footer";
import { Reveal } from "@/components/iris/Reveal";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Iris AI Receptionist by Clover Nexus" },
      {
        name: "description",
        content:
          "Simple plans for Iris, the AI receptionist by Clover Nexus. Start with Basic for 10 minutes a month, or scale to outbound calls and lead qualification.",
      },
      { property: "og:title", content: "Pricing — Iris AI Receptionist by Clover Nexus" },
      {
        property: "og:description",
        content:
          "Basic, Starter, Growth, and Enterprise plans for the AI receptionist that never misses a call.",
      },
    ],
  }),
});

const PLANS = [
  {
    name: "Basic",
    price: "$10",
    cadence: "/month",
    blurb: "Try Iris on your real calls.",
    cta: "Choose Basic",
    featured: false,
    features: [
      "Inbound calls only",
      "10 minutes of talk time per month",
      "Renews automatically every month",
      "Instant answering, 24/7",
      "Call summaries in your dashboard",
    ],
  },
  {
    name: "Starter",
    price: "$50",
    cadence: "/month",
    blurb: "For small teams that live on the phone.",
    cta: "Choose Starter",
    featured: false,
    features: [
      "150 minutes of talk time per month",
      "Gmail and CRM integrations",
      "Booking and appointment taking",
      "Call transfers to your staff",
      "Everything in Basic",
    ],
  },
  {
    name: "Growth",
    price: "$500",
    cadence: "/month",
    blurb: "Turn every call into revenue.",
    cta: "Choose Growth",
    featured: true,
    features: [
      "500 minutes of talk time per month",
      "Everything in Starter",
      "Outbound calling campaigns",
      "Lead qualification and upsell",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "Multi-location, high volume, custom rules.",
    cta: "Talk to Sales",
    featured: false,
    features: [
      "Unlimited minutes and call volume",
      "Dedicated number pool per location",
      "Custom integrations and workflows",
      "SSO and advanced permissions",
      "Named success manager",
    ],
  },
];

const FAQ = [
  {
    q: "What counts as a minute?",
    a: "Only live talk time with a customer. Ringing, voicemail drops, and idle time are never billed.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade, downgrade, or cancel at any time — changes take effect on your next billing date.",
  },
  {
    q: "Do I need a new phone number?",
    a: "No. Iris can answer on your existing business number, or we can provision a new one for you.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are live the same day. We configure Iris with your services, hours, and booking rules.",
  },
];

function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-tesla-dark font-[family-name:var(--font-sans)] selection:bg-tesla-red selection:text-white">
      <header className="fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 md:px-10">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-dark/70 hover:text-tesla-red transition-colors"
            >
              ← Home
            </Link>
            <Link
              to="/contact"
              className="bg-tesla-dark text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-tesla-red transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 md:pt-40 pb-8 px-6 md:px-10 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-tesla-red mb-5">
          Pricing
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-[family-name:var(--font-display)] leading-[1.02] max-w-3xl mx-auto">
          Pay for conversations, not software.
        </h1>
        <p className="mt-5 text-base md:text-lg text-tesla-gray max-w-xl mx-auto leading-relaxed">
          Every plan includes a 7-day free trial. No credit card required. Cancel
          anytime.
        </p>
      </section>

      <section className="px-5 md:px-10 pb-20">
        <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80} className="h-full">
              <div
                className={`h-full flex flex-col rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
                  p.featured
                    ? "bg-tesla-dark text-white border-tesla-dark shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)]"
                    : "bg-white border-black/10 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)]"
                }`}
              >
                {p.featured && (
                  <span className="self-start mb-4 rounded-full bg-tesla-red px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Most popular
                  </span>
                )}
                <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-70">
                  {p.name}
                </h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl md:text-5xl font-black tracking-tight font-[family-name:var(--font-display)]">
                    {p.price}
                  </span>
                  <span
                    className={`pb-1.5 text-sm ${p.featured ? "text-white/60" : "text-tesla-gray"}`}
                  >
                    {p.cadence}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    p.featured ? "text-white/70" : "text-tesla-gray"
                  }`}
                >
                  {p.blurb}
                </p>

                <ul className="mt-6 space-y-3 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-tesla-red" />
                      <span className={p.featured ? "text-white/85" : "text-tesla-dark/80"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`mt-8 rounded-full px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                    p.featured
                      ? "bg-white text-tesla-dark hover:bg-tesla-red hover:text-white"
                      : "bg-tesla-dark text-white hover:bg-tesla-red"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-[family-name:var(--font-display)] mb-8">
            Questions, answered.
          </h2>
          <div className="divide-y divide-black/5 border-y border-black/5">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="text-base font-bold">{f.q}</h3>
                <p className="mt-2 text-sm text-tesla-gray leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const PRODUCT = [
  { label: "How Iris Works", href: "/#voice" },
  { label: "Live Call Demo", href: "/#transcript" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Appointment Booking", href: "/#scale" },
];

const COMPANY = [
  { label: "Pricing", to: "/pricing" as const },
  { label: "Contact Sales", to: "/contact" as const },
  { label: "Dashboard", to: "/dashboard" as const },
];

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-10 px-6 md:px-10 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 max-w-sm">
            <Logo className="mb-5" />
            <p className="text-sm text-tesla-gray leading-relaxed">
              Iris is the AI receptionist by Clova. She answers every call, books
              appointments, qualifies leads, and keeps your customers happy around
              the clock.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Product
            </h4>
            <ul className="text-sm space-y-2.5 text-tesla-gray">
              {PRODUCT.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-tesla-red transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4">
              Get Started
            </h4>
            <ul className="text-sm space-y-2.5 text-tesla-gray">
              {COMPANY.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-tesla-red transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized bold wordmark */}
        <div className="select-none pointer-events-none overflow-hidden">
          <h2 className="text-[22vw] md:text-[16vw] leading-[0.85] font-black tracking-[-0.04em] font-[family-name:var(--font-display)] text-tesla-dark/[0.06] whitespace-nowrap text-center">
            IRIS BY CLOVA
          </h2>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 flex flex-wrap justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-tesla-dark/40">
          <span>Clova &copy; 2026</span>
          <div className="flex gap-8">
            <Link to="/pricing" className="hover:text-tesla-red">Pricing</Link>
            <Link to="/contact" className="hover:text-tesla-red">Contact</Link>
            <a href="/#top" className="hover:text-tesla-red">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

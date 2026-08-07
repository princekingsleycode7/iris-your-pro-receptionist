import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useActiveSection } from "./useActiveSection";
import { Logo } from "./Logo";

const LINKS = [
  { id: "problem", label: "The Problem" },
  { id: "voice", label: "Neural Voice" },
  { id: "scale", label: "Scale" },
  { id: "transcript", label: "Live Call" },
  { id: "integrations", label: "Integrations" },
];

const IDS = LINKS.map((l) => l.id);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    window.dispatchEvent(
      new CustomEvent("iris:menu-toggle", { detail: open })
    );
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeLabel = LINKS.find((l) => l.id === active)?.label;

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          scrolled
            ? "top-4 left-1/2 -translate-x-1/2 w-[min(92%,780px)] rounded-full bg-white/85 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] border border-black/5"
            : "top-0 left-0 right-0 w-full bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-12 px-5" : "h-16 px-6 md:px-10 max-w-7xl mx-auto"
          }`}
        >
          <a href="#top" className="shrink-0">
            <Logo size={scrolled ? 20 : 24} />
          </a>

          {/* Desktop full nav — visible only lg+ AND not scrolled */}
          {!scrolled && (
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-tesla-dark/80">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`transition-colors ${
                    active === l.id
                      ? "text-tesla-red"
                      : "hover:text-tesla-red"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          {/* Scrolled state: show active section pill (lg+) */}
          {scrolled && activeLabel && (
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-tesla-dark/70">
              <span className="w-1.5 h-1.5 rounded-full bg-tesla-red animate-pulse" />
              <span key={activeLabel} className="animate-fade-in">
                {activeLabel}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/pricing"
              className={`hidden sm:inline-flex text-tesla-dark/80 hover:text-tesla-red font-semibold uppercase tracking-[0.15em] transition-colors ${
                scrolled ? "text-[10px]" : "text-[11px]"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/dashboard"
              className={`hidden sm:inline-flex text-tesla-dark/80 hover:text-tesla-red font-semibold uppercase tracking-[0.15em] transition-colors ${
                scrolled ? "text-[10px]" : "text-[11px]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/auth"

              className={`bg-tesla-dark text-white rounded-full font-bold uppercase tracking-[0.15em] hover:bg-tesla-red transition-all ${
                scrolled ? "px-4 py-1.5 text-[10px]" : "px-5 py-2 text-[11px]"
              }`}
            >
              Try Basic
            </Link>


            {/* Hamburger — mobile + tablet */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden ml-1 w-9 h-9 grid place-items-center rounded-full hover:bg-black/5 transition"
            >
              <span className="relative block w-5 h-3">
                <span
                  className={`absolute left-0 top-0 w-5 h-[2px] bg-tesla-dark transition-transform duration-300 ${
                    open ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 bottom-0 w-5 h-[2px] bg-tesla-dark transition-transform duration-300 ${
                    open ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / tablet menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-24 px-8 flex flex-col gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`py-4 border-b border-black/5 text-2xl font-black tracking-tight font-[family-name:var(--font-display)] transition-colors ${
                  active === l.id ? "text-tesla-red" : "text-tesla-dark"
                }`}
                style={{
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                }}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="py-4 border-b border-black/5 text-2xl font-black tracking-tight font-[family-name:var(--font-display)] text-tesla-dark hover:text-tesla-red transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/auth"

              onClick={() => setOpen(false)}
              className="mt-10 bg-tesla-dark text-white px-6 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center hover:bg-tesla-red transition-colors"
            >
              Try Iris Basic
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

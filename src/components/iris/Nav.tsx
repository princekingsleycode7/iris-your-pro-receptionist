import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16">
        <a
          href="#top"
          className="text-lg font-black tracking-[0.3em] font-[family-name:var(--font-display)]"
        >
          TESLA
        </a>
        <div className="hidden md:flex items-center gap-9 text-[13px] font-medium text-tesla-dark/80">
          <a href="#problem" className="hover:text-tesla-red transition-colors">
            The Problem
          </a>
          <a href="#voice" className="hover:text-tesla-red transition-colors">
            Neural Voice
          </a>
          <a href="#scale" className="hover:text-tesla-red transition-colors">
            Scale
          </a>
          <a href="#transcript" className="hover:text-tesla-red transition-colors">
            Live Call
          </a>
          <a href="#integrations" className="hover:text-tesla-red transition-colors">
            Integrations
          </a>
        </div>
        <a
          href="#cta"
          className="bg-tesla-dark text-white px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-tesla-red transition-colors"
        >
          Reserve Access
        </a>
      </div>
    </nav>
  );
}

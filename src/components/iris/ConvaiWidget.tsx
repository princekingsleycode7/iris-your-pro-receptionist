import { createElement, useEffect, useRef, useState } from "react";

const AGENT_ID = "agent_9401ky6jnb3betyr39bprns2q225";

/** Floating voice widget — client-only to avoid SSR/hydration issues. */
export function ConvaiWidget() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.type = "text/javascript";
      document.body.appendChild(s);
    }

    const onMenu = (e: Event) => setHidden(Boolean((e as CustomEvent).detail));
    window.addEventListener("iris:menu-toggle", onMenu as EventListener);
    return () =>
      window.removeEventListener("iris:menu-toggle", onMenu as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // defer so the opening click doesn't immediately close it
    const id = window.setTimeout(() => {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("touchstart", onDown);
    }, 0);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 transition-all duration-300 ease-out ${
        hidden
          ? "opacity-0 translate-y-3 pointer-events-none invisible"
          : "opacity-100 translate-y-0"
      }`}
    >
      <div
        ref={panelRef}
        className={`origin-bottom-right transition-all duration-300 ease-out ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none invisible"
        }`}
      >
        {createElement("elevenlabs-convai", { "agent-id": AGENT_ID })}
      </div>

      <button
        ref={btnRef}
        type="button"
        aria-label={open ? "Close voice assistant" : "Talk to Iris"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 grid place-items-center rounded-full bg-tesla-red text-white shadow-[0_14px_35px_-10px_rgba(0,0,0,0.55)] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.58 3.6a1 1 0 01-.25 1l-2.23 2.2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

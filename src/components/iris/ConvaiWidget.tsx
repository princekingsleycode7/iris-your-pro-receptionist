import { createElement, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const AGENT_ID = "agent_9401ky6jnb3betyr39bprns2q225";
const HIDDEN_PREFIXES = ["/dashboard", "/auth", "/calls", "/appointments", "/settings"];

/** Floating draggable voice bubble + full-screen widget overlay — client-only. */
export function ConvaiWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

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

  // default bubble position: bottom-right
  useEffect(() => {
    if (!mounted || pos) return;
    setPos({ x: window.innerWidth - 76, y: window.innerHeight - 96 });
  }, [mounted, pos]);

  // drag handling
  useEffect(() => {
    if (!mounted) return;
    const clamp = (x: number, y: number) => ({
      x: Math.min(Math.max(8, x), window.innerWidth - 64),
      y: Math.min(Math.max(8, y), window.innerHeight - 64),
    });
    const point = (e: MouseEvent | TouchEvent) =>
      "touches" in e ? e.touches[0] : (e as MouseEvent);
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const p = point(e);
      if (!p) return;
      movedRef.current = true;
      setPos(clamp(p.clientX - offsetRef.current.x, p.clientY - offsetRef.current.y));
      if (e.cancelable) e.preventDefault();
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const startDrag = (clientX: number, clientY: number) => {
    if (!pos) return;
    draggingRef.current = true;
    movedRef.current = false;
    offsetRef.current = { x: clientX - pos.x, y: clientY - pos.y };
  };

  return (
    <>
      {/* Full-screen overlay so the widget renders at natural size */}
      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-tesla-dark/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <button
          type="button"
          aria-label="Close voice assistant"
          onClick={() => setOpen(false)}
          className="absolute top-5 right-5 z-10 h-11 w-11 grid place-items-center rounded-full bg-white text-tesla-dark shadow-lg hover:scale-105 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-2xl">
            {open && createElement("elevenlabs-convai", { "agent-id": AGENT_ID })}
          </div>
        </div>
      </div>

      {/* Draggable bubble */}
      {pos && (
        <button
          type="button"
          aria-label="Talk to Iris"
          style={{ left: pos.x, top: pos.y }}
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onClick={() => {
            if (movedRef.current) return;
            setOpen(true);
          }}
          className={`fixed z-[70] h-14 w-14 grid place-items-center rounded-full bg-tesla-red text-white shadow-[0_14px_35px_-10px_rgba(0,0,0,0.55)] touch-none cursor-grab active:cursor-grabbing transition-opacity duration-300 ${
            hidden || open ? "opacity-0 pointer-events-none invisible" : "opacity-100"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.58 3.6a1 1 0 01-.25 1l-2.23 2.2z" />
          </svg>
        </button>
      )}
    </>
  );
}

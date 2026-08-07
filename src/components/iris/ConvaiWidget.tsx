import { createElement, useEffect, useState } from "react";

const AGENT_ID = "agent_9401ky6jnb3betyr39bprns2q225";

/** Floating voice widget — client-only to avoid SSR/hydration issues. */
export function ConvaiWidget() {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

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

  if (!mounted) return null;

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        hidden
          ? "opacity-0 translate-y-3 pointer-events-none invisible"
          : "opacity-100 translate-y-0"
      }`}
    >
      {createElement("elevenlabs-convai", { "agent-id": AGENT_ID })}
    </div>
  );
}

import { createElement, useEffect, useState } from "react";

const AGENT_ID = "agent_9401ky6jnb3betyr39bprns2q225";


/** Floating voice widget — client-only to avoid SSR/hydration issues. */
export function ConvaiWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
  }, []);

  if (!mounted) return null;

  return createElement("elevenlabs-convai", { "agent-id": AGENT_ID });

}

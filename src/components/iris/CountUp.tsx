import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";

type Props = {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  duration = 1600,
  className = "",
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

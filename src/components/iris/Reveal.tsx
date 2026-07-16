import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./useInView";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "span" | "li" | "p" | "h2" | "h3";
};

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};
  return (
    <Tag
      ref={ref as never}
      data-visible={inView ? "true" : "false"}
      className={`reveal ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

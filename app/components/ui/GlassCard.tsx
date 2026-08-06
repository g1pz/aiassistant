"use client";

import { useRef, ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className = "", tilt = true, style }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt) return;
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -6;
    const ry = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 6;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    card.style.setProperty("--sx", `${px}%`);
    card.style.setProperty("--sy", `${py}%`);
    card.style.setProperty("--spotlight", "0.12");
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--spotlight", "0");
  };

  return (
    <div
      ref={ref}
      className={`glass relative overflow-hidden transition-transform duration-200 ease-out ${className}`}
      style={{ "--sx": "50%", "--sy": "50%", "--spotlight": "0", ...style } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at var(--sx) var(--sy), rgba(79,140,255,var(--spotlight)) 0%, transparent 60%)",
          borderRadius: "inherit",
        }}
      />
      {children}
    </div>
  );
}

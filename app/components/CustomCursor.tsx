'use client';

import { useEffect, useRef } from 'react';

// Selectors that should trigger the morph
const SELECTORS = 'a, button, [role="button"], input, label, select, textarea';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -300, mouseY = -300;
    let ringX = -300, ringY = -300;
    let rafId: number;
    let hoveredEl: HTMLElement | null = null;
    let cachedBR = '50%';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    // Event delegation — catches ALL interactive elements including header/footer
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest(SELECTORS) as HTMLElement | null;
      if (target && target !== hoveredEl) {
        hoveredEl = target;
        const cs = getComputedStyle(target);
        const br = cs.borderRadius;
        cachedBR = (br && br !== '0px') ? br : '9999px';
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest(SELECTORS) as HTMLElement | null;
      if (target && target === hoveredEl) {
        // Only leave if mouse truly exited the element (not moved to a child)
        const rel = (e.relatedTarget as Element | null)?.closest(SELECTORS) as HTMLElement | null;
        if (!rel || rel !== hoveredEl) hoveredEl = null;
      }
    };
    const onDocLeave = () => { hoveredEl = null; };

    const animate = () => {
      if (hoveredEl && document.contains(hoveredEl)) {
        const rect = hoveredEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Snap quickly to element center
        ringX += (cx - ringX) * 0.28;
        ringY += (cy - ringY) * 0.28;

        const pad = 10;
        ring.style.width = `${rect.width + pad}px`;
        ring.style.height = `${rect.height + pad}px`;
        ring.style.borderRadius = cachedBR;
        ring.style.opacity = '1';
        ring.style.borderColor = 'rgba(79,140,255,0.60)';
        ring.style.background = 'rgba(79,140,255,0.058)';
        ring.style.boxShadow =
          '0 0 0 1px rgba(79,140,255,0.14), 0 0 22px rgba(79,140,255,0.14), inset 0 0 16px rgba(79,140,255,0.05)';
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%,-50%) scale(0.3)';
      } else {
        // Default: ring is invisible — cursor feedback comes from the network background
        ring.style.opacity = '0';
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderRadius = '50%';
        dot.style.opacity = '1';
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
        // Keep position tracking so hover snap is instant when entering a target
        ringX += (mouseX - ringX) * 0.35;
        ringY += (mouseY - ringY) * 0.35;
      }

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mouseleave', onDocLeave);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onDocLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

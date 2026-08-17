'use client';

import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const MAX_EDGE_DIST = 170;
const MAX_IMPULSES = 3;
const EXTRA_H = 1400;  // virtual canvas extends below viewport for parallax travel
const PARALLAX = 0.32; // network moves at 32% of scroll speed → depth illusion

interface NNode {
  x: number;
  y: number;
  baseR: number;
  baseAlpha: number;
  bright: number;  // cursor proximity boost [0,1]
  flash: number;   // impulse-arrival flash [0,1], decays per frame
  rgb: readonly [number, number, number];
}

interface Impulse {
  ai: number;
  bi: number;
  t: number;
  dur: number;
  rgb: readonly [number, number, number];
}

const BLUE = [79, 140, 255] as const;
const PURPLE = [168, 85, 247] as const;

// Quasi-regular grid with jitter — looks like a network, not random clouds
function buildNodes(w: number, virtualH: number, isMobile: boolean): NNode[] {
  const step = isMobile ? 90 : 120;
  const jitter = step * 0.38;
  const nodes: NNode[] = [];

  for (let gy = step * 0.5; gy < virtualH + step * 0.5; gy += step) {
    for (let gx = step * 0.5; gx < w + step * 0.5; gx += step) {
      const x = gx + (Math.random() - 0.5) * jitter * 2;
      const y = gy + (Math.random() - 0.5) * jitter * 2;
      nodes.push({
        x, y,
        baseR: 1.4 + Math.random() * 1.0,
        baseAlpha: 0.24 + Math.random() * 0.16,
        bright: 0,
        flash: 0,
        rgb: Math.random() < 0.55 ? BLUE : PURPLE,
      });
    }
  }
  return nodes;
}

// Build edge list once at init — O(n²) is fine for ~200 nodes
function buildEdges(nodes: NNode[]): Array<[number, number]> {
  const edges: Array<[number, number]> = [];
  const connected = new Set<string>();

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const nearby: Array<{ j: number; d: number }> = [];

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const d = Math.hypot(a.x - nodes[j].x, a.y - nodes[j].y);
      if (d < MAX_EDGE_DIST) nearby.push({ j, d });
    }

    nearby.sort((a, b) => a.d - b.d);
    const maxConn = 2 + Math.floor(Math.random() * 3); // 2–4 connections per node
    let count = 0;

    for (const n of nearby) {
      if (count >= maxConn) break;
      const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
      if (!connected.has(key)) {
        connected.add(key);
        edges.push([i, n.j]);
        count++;
      }
    }
  }
  return edges;
}

export function AIBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    let animId = 0;
    let lastTs = 0;
    let nodes: NNode[] = [];
    let edges: Array<[number, number]> = [];
    let impulses: Impulse[] = [];
    let nextImpulseIn = 2.0;
    let isMobile = false;
    let smoothScroll = 0; // lerped scroll position for smooth parallax
    const mouse = { x: -9999, y: -9999 };

    function init() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      isMobile = w < 768;
      nodes = buildNodes(w, h + EXTRA_H, isMobile);
      edges = buildEdges(nodes);
      impulses = [];
      nextImpulseIn = 1.5 + Math.random() * 1.5;
      smoothScroll = window.scrollY;
    }

    function spawnImpulse() {
      if (impulses.length >= MAX_IMPULSES || edges.length === 0) return;

      let ai: number, bi: number;

      // 35% chance: spawn impulse from node near cursor
      if (mouse.x > -100 && Math.random() < 0.35) {
        const yOff = smoothScroll * PARALLAX;
        const nearby = nodes
          .map((n, i) => ({ i, d: Math.hypot(n.x - mouse.x, n.y - (mouse.y + yOff)) }))
          .filter(n => n.d < 200)
          .sort((a, b) => a.d - b.d);

        if (nearby.length > 0) {
          const src = nearby[0].i;
          const srcEdges = edges.filter(([a, b]) => a === src || b === src);
          if (srcEdges.length > 0) {
            [ai, bi] = srcEdges[Math.floor(Math.random() * srcEdges.length)];
          } else {
            [ai, bi] = edges[Math.floor(Math.random() * edges.length)];
          }
        } else {
          [ai, bi] = edges[Math.floor(Math.random() * edges.length)];
        }
      } else {
        // Pick a random edge that's currently visible in viewport
        const yOff = smoothScroll * PARALLAX;
        const visibleEdges = edges.filter(([a, b]) => {
          const ay = nodes[a].y - yOff, by = nodes[b].y - yOff;
          return (ay > -50 && ay < h + 50) || (by > -50 && by < h + 50);
        });
        if (visibleEdges.length > 0) {
          [ai, bi] = visibleEdges[Math.floor(Math.random() * visibleEdges.length)];
        } else {
          [ai, bi] = edges[Math.floor(Math.random() * edges.length)];
        }
      }

      impulses.push({
        ai: ai!,
        bi: bi!,
        t: 0,
        dur: 0.6 + Math.random() * 0.4,
        rgb: Math.random() < 0.5 ? BLUE : PURPLE,
      });
    }

    function frame(ts: number) {
      if (!canvas || !ctx) { animId = requestAnimationFrame(frame); return; }
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) * 0.001, 0.05);
      lastTs = ts;

      // Smooth parallax scroll (lerp toward actual scrollY)
      smoothScroll += (window.scrollY - smoothScroll) * 0.07;
      const yOff = smoothScroll * PARALLAX;

      // ── Impulse timer (skip on mobile) ────────────────────────────────────
      if (!isMobile) {
        nextImpulseIn -= dt;
        if (nextImpulseIn <= 0) {
          spawnImpulse();
          nextImpulseIn = 2 + Math.random() * 2;
        }
        impulses = impulses.filter(imp => {
          imp.t += dt / imp.dur;
          if (imp.t > 0.88 && imp.t - dt / imp.dur < 0.88) {
            nodes[imp.bi].flash = Math.min(1, nodes[imp.bi].flash + 0.7);
          }
          return imp.t < 1.08;
        });
      }

      // ── Cursor proximity brightening ──────────────────────────────────────
      // Cursor y in virtual canvas space = mouseY + parallax offset
      const CURSOR_R = 180;
      const mouseVY = mouse.y + yOff;
      for (const node of nodes) {
        const d = Math.hypot(node.x - mouse.x, node.y - mouseVY);
        const target = d < CURSOR_R ? Math.pow(1 - d / CURSOR_R, 1.6) : 0;
        node.bright += (target - node.bright) * 0.09;
        node.flash = Math.max(0, node.flash - dt * 1.8);
      }

      // ── Clear ─────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // ── Parallax transform: shift entire network by -yOff ─────────────────
      ctx.save();
      ctx.translate(0, -yOff);

      // ── Edges ─────────────────────────────────────────────────────────────
      for (const [ai, bi] of edges) {
        const a = nodes[ai], b = nodes[bi];
        // Cull edges completely outside viewport (in virtual space)
        if (
          a.y - yOff > h + 60 && b.y - yOff > h + 60 &&
          a.y - yOff < -60    && b.y - yOff < -60
        ) continue;

        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const proximity = 1 - dist / MAX_EDGE_DIST;
        const boost = (a.bright + b.bright) * 0.5;
        const fboost = (a.flash + b.flash) * 0.5;
        const alpha = Math.min(
          (0.08 + 0.06 * proximity) * (1 + boost * 2.8 + fboost * 1.5),
          0.38
        );
        if (alpha < 0.005) continue;

        const r = (a.rgb[0] + b.rgb[0]) >> 1;
        const g = (a.rgb[1] + b.rgb[1]) >> 1;
        const bv = (a.rgb[2] + b.rgb[2]) >> 1;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${r},${g},${bv},${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // ── Impulses ──────────────────────────────────────────────────────────
      for (const imp of impulses) {
        const a = nodes[imp.ai], b = nodes[imp.bi];
        const t = Math.min(1, imp.t);
        const fade = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.33;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 18);
        glow.addColorStop(0, `rgba(${imp.rgb.join(',')},${(0.45 * fade).toFixed(3)})`);
        glow.addColorStop(1, `rgba(${imp.rgb.join(',')},0)`);
        ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU);
        ctx.fillStyle = glow; ctx.fill();

        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, TAU);
        ctx.fillStyle = `rgba(255,255,255,${(0.88 * fade).toFixed(3)})`;
        ctx.fill();
      }

      // ── Nodes ─────────────────────────────────────────────────────────────
      for (const node of nodes) {
        // Cull nodes outside viewport
        const screenY = node.y - yOff;
        if (screenY < -40 || screenY > h + 40) continue;

        const boost = node.bright + node.flash * 0.6;
        const r = node.baseR * (1 + boost * 1.4);
        const alpha = Math.min(node.baseAlpha + boost * 0.45, 0.9);
        if (alpha < 0.01) continue;

        if (boost > 0.06) {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 7);
          glow.addColorStop(0, `rgba(${node.rgb.join(',')},${(alpha * 0.38).toFixed(3)})`);
          glow.addColorStop(1, `rgba(${node.rgb.join(',')},0)`);
          ctx.beginPath(); ctx.arc(node.x, node.y, r * 7, 0, TAU);
          ctx.fillStyle = glow; ctx.fill();
        }

        ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, TAU);
        ctx.fillStyle = `rgba(${node.rgb.join(',')},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore(); // end parallax transform

      // ── Vignette — fixed to viewport, no parallax ─────────────────────────
      const cx = w / 2, cy = h / 2;
      const vg = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.22, cx, cy, Math.max(w, h) * 0.80);
      vg.addColorStop(0, 'rgba(10,14,23,0)');
      vg.addColorStop(1, 'rgba(10,14,23,0.75)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(frame);
    }

    init();
    animId = requestAnimationFrame(frame);

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => { init(); };

    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          WebkitMaskImage: 'radial-gradient(ellipse 88% 88% at 50% 50%, black 20%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 88% 88% at 50% 50%, black 20%, transparent 100%)',
        }}
      />
    </>
  );
}

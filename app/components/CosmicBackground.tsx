'use client';

import { useEffect, useRef } from 'react';

// ─── Constants / helpers ───────────────────────────────────────────────────────

const TAU = Math.PI * 2;

function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
function rgba(r: number, g: number, b: number, a: number) { return `rgba(${r},${g},${b},${a})`; }

function getSection(scrollY: number): number {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = Math.min(1, scrollY / max);
  const bps = [0.17, 0.33, 0.50, 0.67, 0.84];
  for (let i = 0; i < bps.length; i++) if (p < bps[i]) return i;
  return 5;
}

interface SecParam { orbitFrac: number; speed: number; sizeA: number; sizeB: number; beams: boolean }

const PARAMS: SecParam[] = [
  { orbitFrac: 0.27, speed: 0.30, sizeA: 0.085, sizeB: 0.056, beams: false },
  { orbitFrac: 0.37, speed: 0.18, sizeA: 0.080, sizeB: 0.050, beams: false },
  { orbitFrac: 0.21, speed: 0.55, sizeA: 0.088, sizeB: 0.058, beams: true  },
  { orbitFrac: 0.44, speed: 0.14, sizeA: 0.076, sizeB: 0.047, beams: false },
  { orbitFrac: 0.15, speed: 0.80, sizeA: 0.090, sizeB: 0.060, beams: false },
  { orbitFrac: 0.22, speed: 0.45, sizeA: 0.090, sizeB: 0.060, beams: false },
];

// ─── Saturn-like ring (drawn in two halves so planet body sits inside) ─────────

function drawRingHalf(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  tilt: number, half: 'back' | 'front'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.scale(1, 0.23); // perspective squash

  // Multiple bands — inner faint C ring, bright B ring, outer A ring
  const bands = [
    { radius: r * 1.64, width: r * 0.06, a: 0.10 },
    { radius: r * 1.75, width: r * 0.09, a: 0.18 },
    { radius: r * 1.87, width: r * 0.24, a: 0.26 },
    { radius: r * 2.08, width: r * 0.07, a: 0.11 },
    { radius: r * 2.19, width: r * 0.10, a: 0.15 },
  ];

  const [start, end] = half === 'back' ? [0, Math.PI] : [Math.PI, TAU];
  const dim = half === 'back' ? 0.38 : 1.0;

  for (const b of bands) {
    ctx.beginPath();
    ctx.arc(0, 0, b.radius, start, end);
    ctx.strokeStyle = rgba(165, 208, 255, b.a * dim);
    ctx.lineWidth = b.width;
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Planet A — Yin (Blue Ocean World) ────────────────────────────────────────
// Realistic rendering: layered surface patches + Lambert shading + terminator SSS
// Light source: top-left (~10 o'clock)

function drawPlanetA(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tilt: number) {
  // Background glow cloud — planet body is painted on top so the glow reads as "behind" it
  // Inner part (r*0–r*1) will be hidden by the planet disk; outer part visible as soft halo
  const bgGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 5.8);
  bgGlow.addColorStop(0,    rgba(38, 98, 218, 0.16));
  bgGlow.addColorStop(0.17, rgba(55, 128, 248, 0.28)); // peak ~r*1 — visible as rim glow
  bgGlow.addColorStop(0.32, rgba(48, 112, 238, 0.14));
  bgGlow.addColorStop(0.58, rgba(30,  82, 200, 0.05));
  bgGlow.addColorStop(1,    rgba(0, 0, 0, 0));
  ctx.beginPath(); ctx.arc(x, y, r * 5.8, 0, TAU);
  ctx.fillStyle = bgGlow; ctx.fill();

  // Ring — back half (behind planet body)
  drawRingHalf(ctx, x, y, r, tilt, 'back');

  // ── Sphere body (clipped) ────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();

  // 1. Deep-dark ocean base
  ctx.fillStyle = rgba(3, 10, 24, 1);
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 2. Surface texture — organic continental + ocean patches
  //    Elliptical patches rotated at different angles for organic look
  type Patch = { ox:number; oy:number; rx:number; ry:number; rot:number; rc:number[]; a:number };
  const patches: Patch[] = [
    // Deep ocean basins
    { ox:-0.08, oy: 0.22, rx:r*1.10, ry:r*0.88, rot: 0.30, rc:[22,64,120],   a:0.48 },
    { ox: 0.32, oy:-0.12, rx:r*0.92, ry:r*0.74, rot:-0.42, rc:[28,76,140],   a:0.42 },
    { ox:-0.42, oy:-0.22, rx:r*0.78, ry:r*0.62, rot: 0.58, rc:[18,58,112],   a:0.40 },
    // Shallower ocean / ice (lighter blue)
    { ox: 0.08, oy:-0.32, rx:r*0.68, ry:r*0.52, rot:-0.18, rc:[40,88,168],   a:0.32 },
    { ox: 0.28, oy: 0.42, rx:r*0.58, ry:r*0.46, rot: 0.48, rc:[34,80,152],   a:0.28 },
    // Cloud bands (horizontal streaks)
    { ox:-0.20, oy:-0.52, rx:r*0.80, ry:r*0.18, rot:-0.08, rc:[90,148,230],  a:0.22 },
    { ox: 0.10, oy: 0.50, rx:r*0.72, ry:r*0.16, rot: 0.12, rc:[100,160,240], a:0.18 },
    { ox:-0.40, oy: 0.18, rx:r*0.60, ry:r*0.14, rot: 0.35, rc:[110,170,250], a:0.15 },
    // Polar ice cap hints
    { ox: 0.0,  oy:-0.68, rx:r*0.42, ry:r*0.30, rot: 0.0,  rc:[180,220,255], a:0.20 },
    { ox: 0.05, oy: 0.72, rx:r*0.36, ry:r*0.25, rot: 0.1,  rc:[160,210,255], a:0.16 },
  ];

  for (const p of patches) {
    ctx.save();
    ctx.translate(x + p.ox * r, y + p.oy * r);
    ctx.rotate(p.rot);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.rx);
    g.addColorStop(0, rgba(p.rc[0], p.rc[1], p.rc[2], p.a));
    g.addColorStop(1, rgba(p.rc[0], p.rc[1], p.rc[2], 0));
    ctx.scale(1, p.ry / p.rx);
    ctx.beginPath(); ctx.arc(0, 0, p.rx, 0, TAU);
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
  }

  // 3. Diffuse light (Lambert) — bluish-white from top-left
  const lx = x - r * 0.52, ly = y - r * 0.62;
  const lit = ctx.createRadialGradient(lx, ly, 0, x, y, r * 1.18);
  lit.addColorStop(0,    rgba(148, 192, 255, 0.34));
  lit.addColorStop(0.22, rgba(110, 162, 248, 0.16));
  lit.addColorStop(0.50, rgba(70,  128, 220, 0.05));
  lit.addColorStop(1,    rgba(0, 0, 0, 0));
  ctx.fillStyle = lit; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 4. Hard shadow / terminator — from bottom-right
  const sx = x + r * 0.70, sy = y + r * 0.70;
  const shadow = ctx.createRadialGradient(sx, sy, 0, x + r * 0.10, y + r * 0.10, r * 1.85);
  shadow.addColorStop(0,    rgba(0, 0, 0, 0.97));
  shadow.addColorStop(0.38, rgba(0, 0, 0, 0.90));
  shadow.addColorStop(0.56, rgba(0, 0, 0, 0.38));
  shadow.addColorStop(0.74, rgba(0, 0, 0, 0));
  ctx.fillStyle = shadow; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 5. Terminator SSS (subsurface scattering) — warm orange glow at day/night edge
  const tx = x + r * 0.20, ty = y + r * 0.25;
  const sss = ctx.createRadialGradient(tx, ty, r * 0.38, tx, ty, r * 0.92);
  sss.addColorStop(0,   rgba(255, 140, 55, 0));
  sss.addColorStop(0.5, rgba(255, 128, 42, 0.08));
  sss.addColorStop(1,   rgba(255, 100, 20, 0));
  ctx.fillStyle = sss; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 6. Limb darkening — edges always slightly darker (true for all spheres)
  const limb = ctx.createRadialGradient(x - r * 0.08, y - r * 0.08, r * 0.52, x, y, r);
  limb.addColorStop(0,   rgba(0, 0, 0, 0));
  limb.addColorStop(0.68, rgba(0, 0, 0, 0.12));
  limb.addColorStop(1,   rgba(0, 0, 0, 0.55));
  ctx.fillStyle = limb; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 7. Specular highlight — ocean glint from star
  const spx = x - r * 0.40, spy = y - r * 0.48;
  const spec = ctx.createRadialGradient(spx, spy, 0, spx, spy, r * 0.26);
  spec.addColorStop(0,   rgba(225, 242, 255, 0.55));
  spec.addColorStop(0.45, rgba(190, 220, 255, 0.18));
  spec.addColorStop(1,   rgba(255, 255, 255, 0));
  ctx.fillStyle = spec; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore(); // end clip

  // Ring — front half (in front of planet)
  drawRingHalf(ctx, x, y, r, tilt, 'front');
}

// ─── Planet B — Yang (Dark Energy / Exotic World) ─────────────────────────────
// Deep black-purple surface with visible energy emission zones and magnetic field lines

function drawPlanetB(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, t: number) {
  // Background energy cloud — starts from center, planet disk is on top, glow reads as "behind"
  const pulse = 1 + 0.11 * Math.sin(t * 2.7);
  const outerR = r * pulse * 5.6;
  const bgGlow = ctx.createRadialGradient(x, y, 0, x, y, outerR);
  bgGlow.addColorStop(0,    rgba(140, 40, 220, 0.20));
  bgGlow.addColorStop(0.18, rgba(190, 75, 255, 0.35)); // peak near planet rim — visible as corona
  bgGlow.addColorStop(0.34, rgba(160, 55, 240, 0.18));
  bgGlow.addColorStop(0.60, rgba(110, 30, 200, 0.07));
  bgGlow.addColorStop(1,    rgba(70, 15, 155, 0));
  ctx.beginPath(); ctx.arc(x, y, outerR, 0, TAU);
  ctx.fillStyle = bgGlow; ctx.fill();

  // ── Sphere body (clipped) ────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();

  // 1. Near-black base with slight purple
  ctx.fillStyle = rgba(5, 0, 14, 1);
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 2. Internal energy zones — like magma but purple
  type Patch2 = { ox:number; oy:number; rx:number; ry:number; rot:number; rc:number[]; a:number };
  const energy: Patch2[] = [
    // Deep core glow (large, dark purple)
    { ox:-0.05, oy:-0.05, rx:r*0.68, ry:r*0.68, rot:0,    rc:[110, 28, 190], a:0.60 },
    { ox: 0.18, oy: 0.12, rx:r*0.50, ry:r*0.44, rot:0.28, rc:[130, 42, 210], a:0.45 },
    // Magnetic field line streaks (elongated, rotated)
    { ox:-0.12, oy: 0.32, rx:r*0.75, ry:r*0.16, rot:-0.38, rc:[168, 85, 247], a:0.42 },
    { ox: 0.26, oy:-0.28, rx:r*0.68, ry:r*0.13, rot: 0.48, rc:[150, 68, 230], a:0.36 },
    { ox:-0.32, oy:-0.08, rx:r*0.60, ry:r*0.11, rot: 0.18, rc:[188, 95, 255], a:0.30 },
    { ox: 0.10, oy: 0.55, rx:r*0.55, ry:r*0.10, rot:-0.22, rc:[175, 80, 240], a:0.28 },
    // Bright energy emission hotspots
    { ox: 0.12, oy: 0.38, rx:r*0.26, ry:r*0.26, rot:0,     rc:[210, 120, 255], a:0.50 },
    { ox:-0.36, oy: 0.18, rx:r*0.22, ry:r*0.22, rot:0,     rc:[220, 130, 255], a:0.45 },
    { ox: 0.32, oy:-0.42, rx:r*0.18, ry:r*0.18, rot:0,     rc:[200, 110, 255], a:0.40 },
  ];

  for (const f of energy) {
    ctx.save();
    ctx.translate(x + f.ox * r, y + f.oy * r);
    ctx.rotate(f.rot);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, f.rx);
    g.addColorStop(0, rgba(f.rc[0], f.rc[1], f.rc[2], f.a));
    g.addColorStop(1, rgba(f.rc[0], f.rc[1], f.rc[2], 0));
    ctx.scale(1, f.ry / f.rx);
    ctx.beginPath(); ctx.arc(0, 0, f.rx, 0, TAU);
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
  }

  // Animated energy pulse ring (expanding from core)
  const ph = (t * 0.45) % 1;
  const pr = r * (0.25 + ph * 0.65);
  const pa = 0.14 * (1 - ph);
  const pg = ctx.createRadialGradient(x, y, 0, x, y, pr);
  pg.addColorStop(0, rgba(180, 80, 255, 0));
  pg.addColorStop(0.7, rgba(200, 90, 255, pa));
  pg.addColorStop(1, rgba(180, 70, 240, 0));
  ctx.fillStyle = pg; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 3. Diffuse light — consistent direction with planet A (top-left)
  const lx = x - r * 0.52, ly = y - r * 0.62;
  const lit = ctx.createRadialGradient(lx, ly, 0, x, y, r * 1.15);
  lit.addColorStop(0,    rgba(210, 148, 255, 0.24));
  lit.addColorStop(0.28, rgba(170, 108, 248, 0.12));
  lit.addColorStop(0.58, rgba(130,  70, 220, 0.03));
  lit.addColorStop(1,    rgba(0, 0, 0, 0));
  ctx.fillStyle = lit; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 4. Shadow — very deep (neutron star absorbs almost all incoming light)
  const shx = x + r * 0.72, shy = y + r * 0.72;
  const shadow = ctx.createRadialGradient(shx, shy, 0, x + r * 0.12, y + r * 0.12, r * 1.75);
  shadow.addColorStop(0,    rgba(0, 0, 0, 0.98));
  shadow.addColorStop(0.42, rgba(0, 0, 0, 0.94));
  shadow.addColorStop(0.62, rgba(0, 0, 0, 0.42));
  shadow.addColorStop(0.80, rgba(0, 0, 0, 0));
  ctx.fillStyle = shadow; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 5. Terminator glow — sci-fi blue-violet instead of orange
  const ttx = x + r * 0.20, tty = y + r * 0.26;
  const sss = ctx.createRadialGradient(ttx, tty, r * 0.36, ttx, tty, r * 0.88);
  sss.addColorStop(0,   rgba(160, 70, 255, 0));
  sss.addColorStop(0.5, rgba(150, 60, 248, 0.10));
  sss.addColorStop(1,   rgba(130, 50, 220, 0));
  ctx.fillStyle = sss; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 6. Limb darkening
  const limb = ctx.createRadialGradient(x - r * 0.08, y - r * 0.08, r * 0.50, x, y, r);
  limb.addColorStop(0,    rgba(0, 0, 0, 0));
  limb.addColorStop(0.70, rgba(0, 0, 0, 0.14));
  limb.addColorStop(1,    rgba(0, 0, 0, 0.62));
  ctx.fillStyle = limb; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // 7. Specular — purple-white glint
  const spx = x - r * 0.40, spy = y - r * 0.46;
  const spec = ctx.createRadialGradient(spx, spy, 0, spx, spy, r * 0.24);
  spec.addColorStop(0,   rgba(245, 210, 255, 0.48));
  spec.addColorStop(0.5, rgba(210, 170, 255, 0.16));
  spec.addColorStop(1,   rgba(255, 255, 255, 0));
  ctx.fillStyle = spec; ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.restore(); // end clip
}

// ─── Energy beams (HowItWorks section) ───────────────────────────────────────

function drawBeams(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, t: number) {
  const dx = bx - ax, dy = by - ay;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return;

  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
  ctx.strokeStyle = rgba(79, 140, 255, 0.06); ctx.lineWidth = 1; ctx.stroke();

  for (let i = 0; i < 3; i++) {
    const phase = ((t * 0.75 + i / 3) % 1);
    const px = ax + dx * phase, py = ay + dy * phase;
    const a = Math.sin(phase * Math.PI) * 0.78;
    const g = ctx.createRadialGradient(px, py, 0, px, py, 14);
    g.addColorStop(0, rgba(130, 190, 255, a));
    g.addColorStop(1, rgba(79, 140, 255, 0));
    ctx.beginPath(); ctx.arc(px, py, 14, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 3, 0, TAU);
    ctx.fillStyle = rgba(215, 238, 255, a); ctx.fill();
  }
}


// ─── Background stars ─────────────────────────────────────────────────────────

function makeBgStars(w: number, h: number) {
  const count = w < 768 ? 85 : 165;
  return Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 1.1 + 0.2,
    op: Math.random() * 0.40 + 0.06,
    phase: Math.random() * TAU,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, animId = 0, time = 0, lastTs = 0;
    let orbitR = 0, curSpeed = 0.3, sA = 0, sB = 0, angle = 0;
    const RING_TILT = Math.PI * 0.13;

    const TRAIL = 30;
    const trailA: { x:number; y:number }[] = [];
    const trailB: { x:number; y:number }[] = [];
    let bgStars: ReturnType<typeof makeBgStars> = [];
    let currentSection = 0;

    function init() {
      if (!canvas) return;
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      const dim = Math.min(w, h);
      const p0 = PARAMS[0];
      orbitR = p0.orbitFrac * dim;
      curSpeed = p0.speed;
      sA = p0.sizeA * dim;
      sB = p0.sizeB * dim;
      bgStars = makeBgStars(w, h);
    }

    function frame(ts: number) {
      if (!canvas || !ctx) { animId = requestAnimationFrame(frame); return; }
      if (!lastTs) lastTs = ts;
      const dt = Math.min(ts - lastTs, 50) * 0.001;
      lastTs = ts; time += dt;

      const sec = getSection(window.scrollY);
      const dim = Math.min(w, h);

      if (sec !== currentSection) {
        currentSection = sec;
        trailA.length = 0; trailB.length = 0;
      }

      const p = PARAMS[sec];
      orbitR   = lerp(orbitR,   p.orbitFrac * dim, 0.028);
      curSpeed = lerp(curSpeed, p.speed,            0.028);
      sA       = lerp(sA,       p.sizeA * dim,      0.028);
      sB       = lerp(sB,       p.sizeB * dim,      0.028);

      angle += curSpeed * dt;
      const cx = w / 2, cy = h / 2;
      const ax = cx + orbitR * Math.cos(angle);
      const ay = cy + orbitR * Math.sin(angle);
      const bx = cx - orbitR * Math.cos(angle);
      const by = cy - orbitR * Math.sin(angle);

      if (orbitR > sA * 0.5) {
        trailA.push({ x:ax, y:ay });
        trailB.push({ x:bx, y:by });
        if (trailA.length > TRAIL) trailA.shift();
        if (trailB.length > TRAIL) trailB.shift();
      }

      // ── Draw ───────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Background stars
      for (const s of bgStars) {
        const a = s.op * (0.65 + 0.35 * Math.sin(time * 0.7 + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fillStyle = rgba(255, 255, 255, a); ctx.fill();
      }

      // Orbital trails
      for (let i = 0; i < trailA.length; i++) {
        const f = i / trailA.length;
        ctx.beginPath(); ctx.arc(trailA[i].x, trailA[i].y, Math.max(0.5, f * sA * 0.28), 0, TAU);
        ctx.fillStyle = rgba(79, 140, 255, f * 0.45); ctx.fill();
      }
      for (let i = 0; i < trailB.length; i++) {
        const f = i / trailB.length;
        ctx.beginPath(); ctx.arc(trailB[i].x, trailB[i].y, Math.max(0.5, f * sB * 0.28), 0, TAU);
        ctx.fillStyle = rgba(168, 85, 247, f * 0.40); ctx.fill();
      }

      if (p.beams) drawBeams(ctx, ax, ay, bx, by, time);

      drawPlanetA(ctx, ax, ay, sA, RING_TILT);
      drawPlanetB(ctx, bx, by, sB, time);

      // Edge vignette
      const vg = ctx.createRadialGradient(cx, cy, dim * 0.32, cx, cy, Math.max(w, h) * 0.88);
      vg.addColorStop(0, rgba(10, 14, 23, 0));
      vg.addColorStop(1, rgba(10, 14, 23, 0.80));
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(frame);
    }

    init();
    animId = requestAnimationFrame(frame);

    function onResize() {
      if (!canvas) return;
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
      bgStars = makeBgStars(w, h);
    }

    window.addEventListener('resize', onResize, { passive: true });
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      />
      <div
        aria-hidden="true"
        style={{
          position:'fixed', inset:0, pointerEvents:'none', zIndex:1,
          backgroundImage:'radial-gradient(rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize:'38px 38px',
          WebkitMaskImage:'radial-gradient(ellipse 88% 88% at 50% 50%, black 20%, transparent 100%)',
          maskImage:'radial-gradient(ellipse 88% 88% at 50% 50%, black 20%, transparent 100%)',
        }}
      />
    </>
  );
}

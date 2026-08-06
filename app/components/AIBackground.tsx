'use client';

import { useEffect, useRef } from 'react';

const MAX_DIST = 155;
const BLUE_H = 216;
const PURPLE_H = 270;
const RED_H = 5;

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  phase: number;
  act: number;
  targetAct: number;
  hue: number;
  stressed: boolean;
}

interface Packet {
  a: number; b: number;
  t: number;
  speed: number;
  hue: number;
  life: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
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
    let sec = 0;
    let time = 0;
    let lastTs = 0;
    let lastPacketTime = 0;

    const mouse = { x: -1000, y: -1000 };
    let nodes: Node[] = [];
    let packets: Packet[] = [];

    function getPhase(scrollY: number): { section: number } {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(1, scrollY / maxScroll);
      // [Hero, Problem, HowItWorks, Differentiator, Demos, CTA]
      const bps = [0, 0.17, 0.33, 0.50, 0.67, 0.84, 1.0];
      for (let s = 0; s < bps.length - 1; s++) {
        if (pct < bps[s + 1] || s === bps.length - 2) {
          return { section: s };
        }
      }
      return { section: 5 };
    }

    function init() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      const count = w < 768 ? 42 : 68;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 1.2,
        phase: Math.random() * Math.PI * 2,
        act: 0.2,
        targetAct: 0.3,
        hue: Math.random() < 0.6 ? BLUE_H : PURPLE_H,
        stressed: false,
      }));
      packets = [];
    }

    function tryAddPacket() {
      if (packets.length > 38) return;
      for (let tries = 0; tries < 15; tries++) {
        const ai = Math.floor(Math.random() * nodes.length);
        const bi = Math.floor(Math.random() * nodes.length);
        if (ai === bi) continue;
        const na = nodes[ai], nb = nodes[bi];
        if (Math.hypot(na.x - nb.x, na.y - nb.y) < MAX_DIST) {
          packets.push({
            a: ai, b: bi, t: 0,
            speed: 0.005 + Math.random() * 0.01,
            hue: sec === 1
              ? (Math.random() < 0.3 ? RED_H : BLUE_H)
              : sec >= 3
              ? (Math.random() < 0.5 ? PURPLE_H : BLUE_H)
              : BLUE_H,
            life: 1,
          });
          break;
        }
      }
    }

    function updateNodes() {
      const mx = mouse.x, my = mouse.y;
      const count = nodes.length;

      for (let i = 0; i < count; i++) {
        const n = nodes[i];

        switch (sec) {
          case 0: {
            // Hero: gentle awakening wave radiating from center
            const dist = Math.hypot(n.x - w / 2, n.y - h / 2) / (Math.hypot(w, h) * 0.5);
            n.targetAct = 0.18 + 0.38 * Math.max(0, Math.sin(time * 0.55 - dist * 2.5 + n.phase));
            n.hue = lerp(n.hue, BLUE_H, 0.04);
            n.stressed = false;
            break;
          }
          case 1: {
            // Problem: stressed nodes flash red, others go dim
            if (Math.random() < 0.0008 && !n.stressed) {
              n.stressed = Math.random() < 0.3;
            }
            n.hue = n.stressed ? lerp(n.hue, RED_H, 0.05) : lerp(n.hue, BLUE_H, 0.02);
            n.targetAct = n.stressed
              ? 0.1 + 0.75 * Math.abs(Math.sin(time * 4.5 + n.phase))
              : 0.08 + 0.14 * Math.max(0, Math.sin(time * 0.25 + n.phase));
            // Extra chaos
            n.vx += (Math.random() - 0.5) * 0.06;
            n.vy += (Math.random() - 0.5) * 0.06;
            break;
          }
          case 2: {
            // HowItWorks: left-to-right activation wave (3 sequential pulses)
            const wavePos = ((time * 0.11) % 1.4) - 0.2;
            const nx = n.x / w;
            const infl = Math.exp(-Math.pow((nx - wavePos) * 5.5, 2));
            n.targetAct = 0.1 + 0.78 * infl;
            n.hue = lerp(n.hue, BLUE_H, 0.05);
            n.stressed = false;
            n.vx += 0.014; // gentle rightward drift
            break;
          }
          case 3: {
            // Differentiator: left half blue vs right half purple
            n.hue = lerp(n.hue, n.x < w * 0.5 ? BLUE_H : PURPLE_H, 0.05);
            n.targetAct = 0.38 + 0.42 * Math.sin(time * 0.9 + n.phase);
            n.stressed = false;
            break;
          }
          case 4: {
            // Demos: 4 cluster hotspots light up in sequence
            const clusters: [number, number][] = [[0.22, 0.3], [0.78, 0.25], [0.18, 0.72], [0.77, 0.68]];
            let maxInfl = 0, bestH = BLUE_H;
            for (let c = 0; c < clusters.length; c++) {
              const d = Math.hypot(n.x / w - clusters[c][0], n.y / h - clusters[c][1]);
              const inf = Math.exp(-d * 9);
              if (inf > maxInfl) { maxInfl = inf; bestH = c % 2 === 0 ? BLUE_H : PURPLE_H; }
            }
            n.hue = lerp(n.hue, bestH, 0.05);
            n.targetAct = 0.15 + 0.74 * maxInfl + 0.11 * Math.sin(time + n.phase);
            n.stressed = false;
            break;
          }
          case 5: {
            // CTA: synchronized pulse, all nodes converge toward center
            const pulse = 0.5 + 0.5 * Math.sin(time * 1.8);
            const cx = w / 2, cy = h / 2;
            const dist = Math.hypot(n.x - cx, n.y - cy) / Math.max(w, h);
            n.targetAct = (0.5 + 0.38 * (1 - Math.min(1, dist * 1.3))) * (0.6 + 0.4 * pulse);
            n.hue = lerp(n.hue, lerp(BLUE_H, PURPLE_H, n.x / w), 0.05);
            n.stressed = false;
            n.vx += (cx - n.x) * 0.00011;
            n.vy += (cy - n.y) * 0.00011;
            break;
          }
        }

        n.act = lerp(n.act, n.targetAct, 0.025);

        // Mouse repulsion
        const mdx = n.x - mx, mdy = n.y - my;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 110 && mdist > 0) {
          const f = ((110 - mdist) / 110) * 0.55;
          n.vx += (mdx / mdist) * f;
          n.vy += (mdy / mdist) * f;
        }

        n.vx *= 0.97;
        n.vy *= 0.97;
        const spd = Math.hypot(n.vx, n.vy);
        if (spd > 1.2) { n.vx = n.vx / spd * 1.2; n.vy = n.vy / spd * 1.2; }

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -10) n.x += w + 10;
        else if (n.x > w + 10) n.x -= w + 10;
        if (n.y < -10) n.y += h + 10;
        else if (n.y > h + 10) n.y -= h + 10;
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const baseAlpha = [0.14, 0.11, 0.18, 0.20, 0.22, 0.23][sec] ?? 0.14;
      const count = nodes.length;

      // Connections
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const na = nodes[i], nb = nodes[j];
          const dx = na.x - nb.x, dy = na.y - nb.y;
          const dist = Math.hypot(dx, dy);
          if (dist >= MAX_DIST) continue;

          const proximity = 1 - dist / MAX_DIST;
          const alpha = proximity * Math.min(na.act, nb.act) * baseAlpha * 6.5;
          if (alpha < 0.004) continue;

          const midH = (na.hue + nb.hue) / 2;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = `hsla(${midH | 0},75%,65%,${alpha})`;
          ctx.lineWidth = proximity * 1.1;
          ctx.stroke();
        }
      }

      // Packets
      for (const p of packets) {
        const na = nodes[p.a], nb = nodes[p.b];
        if (!na || !nb) continue;
        if (Math.hypot(na.x - nb.x, na.y - nb.y) >= MAX_DIST) continue;

        const x = lerp(na.x, nb.x, p.t);
        const y = lerp(na.y, nb.y, p.t);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,70%,${0.14 * p.life})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,78%,${0.85 * p.life})`;
        ctx.fill();
      }

      // Nodes
      for (const n of nodes) {
        if (n.act < 0.05) continue;
        const r = n.r * (1 + 0.12 * Math.sin(time * 2.5 + n.phase) * n.act);

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
        grd.addColorStop(0, `hsla(${n.hue | 0},85%,68%,${n.act * baseAlpha * 12})`);
        grd.addColorStop(1, 'hsla(0,0%,0%,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue | 0},85%,75%,${n.act * 0.88})`;
        ctx.fill();
      }
    }

    function frame(ts: number) {
      if (!lastTs) lastTs = ts;
      time += Math.min(ts - lastTs, 50) * 0.001;
      lastTs = ts;

      sec = getPhase(window.scrollY).section;

      const rates = [850, 1300, 220, 170, 130, 380];
      if (ts - lastPacketTime > (rates[sec] ?? 600)) {
        tryAddPacket();
        lastPacketTime = ts;
      }

      packets = packets.filter(p => {
        p.t += p.speed;
        if (p.t > 0.75) p.life = lerp(p.life, 0, 0.12);
        return p.t < 1.05 && p.life > 0.02;
      });

      updateNodes();
      draw();
      animId = requestAnimationFrame(frame);
    }

    init();
    animId = requestAnimationFrame(frame);

    function onResize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
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
  );
}

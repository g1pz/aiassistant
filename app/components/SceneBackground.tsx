'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Orb = { x: string; y: string; size: string; color: string; opacity: number };

// 3 orbs per section — position/color shift as user scrolls
const THEMES: [Orb, Orb, Orb][] = [
  // Hero — blue dominant, expansive top-right / bottom-left
  [
    { x: '18vw', y: '-20vh', size: '68vw', color: '79,140,255', opacity: 0.26 },
    { x: '-26vw', y: '22vh', size: '54vw', color: '168,85,247', opacity: 0.17 },
    { x: '4vw', y: '2vh', size: '26vw', color: '79,140,255', opacity: 0.06 },
  ],
  // Problem — purple-red shift, more central / ominous
  [
    { x: '-20vw', y: '-15vh', size: '58vw', color: '168,85,247', opacity: 0.21 },
    { x: '22vw', y: '18vh', size: '50vw', color: '124,58,237', opacity: 0.16 },
    { x: '-5vw', y: '5vh', size: '22vw', color: '239,68,68', opacity: 0.1 },
  ],
  // HowItWorks — blue flows left → right (3 steps)
  [
    { x: '-22vw', y: '8vh', size: '54vw', color: '79,140,255', opacity: 0.2 },
    { x: '22vw', y: '-10vh', size: '56vw', color: '79,140,255', opacity: 0.22 },
    { x: '0vw', y: '22vh', size: '24vw', color: '168,85,247', opacity: 0.09 },
  ],
  // Differentiator — split: blue left, purple right
  [
    { x: '-32vw', y: '0vh', size: '58vw', color: '79,140,255', opacity: 0.22 },
    { x: '32vw', y: '0vh', size: '58vw', color: '168,85,247', opacity: 0.22 },
    { x: '0vw', y: '0vh', size: '16vw', color: '255,255,255', opacity: 0.02 },
  ],
  // Demos — scattered clusters
  [
    { x: '-20vw', y: '-20vh', size: '46vw', color: '79,140,255', opacity: 0.2 },
    { x: '22vw', y: '20vh', size: '46vw', color: '168,85,247', opacity: 0.2 },
    { x: '0vw', y: '0vh', size: '34vw', color: '79,140,255', opacity: 0.1 },
  ],
  // CTA — converging to center, purple dominant
  [
    { x: '0vw', y: '-22vh', size: '64vw', color: '168,85,247', opacity: 0.24 },
    { x: '0vw', y: '18vh', size: '50vw', color: '79,140,255', opacity: 0.18 },
    { x: '0vw', y: '-2vh', size: '28vw', color: '168,85,247', opacity: 0.1 },
  ],
];

function getSection(scrollY: number): number {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pct = scrollY / maxScroll;
  const bps = [0.17, 0.33, 0.50, 0.67, 0.84];
  for (let i = 0; i < bps.length; i++) {
    if (pct < bps[i]) return i;
  }
  return 5;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function SceneBackground() {
  const [section, setSection] = useState(0);

  useEffect(() => {
    const onScroll = () => setSection(getSection(window.scrollY));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const theme = THEMES[section];

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Ambient orbs */}
      {theme.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            top: '50%',
            left: '50%',
            marginTop: `calc(${orb.size} * -0.5)`,
            marginLeft: `calc(${orb.size} * -0.5)`,
            borderRadius: '50%',
            filter: 'blur(88px)',
            background: `radial-gradient(circle, rgba(${orb.color},0.88) 0%, transparent 65%)`,
            willChange: 'transform, opacity',
          }}
          initial={{ x: orb.x, y: orb.y, opacity: 0 }}
          animate={{ x: orb.x, y: orb.y, opacity: orb.opacity }}
          transition={{ duration: 2.2, ease: EASE, delay: i === 0 ? 0.1 : i * 0.15 }}
        />
      ))}

      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.026) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Edge vignette — pulls edges dark so content stays readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 40%, rgba(10,14,23,0.82) 100%)',
        }}
      />
    </div>
  );
}

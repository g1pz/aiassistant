'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { useLanguage } from '../i18n/LanguageContext';
import { openCalendly } from '@/lib/config';

const ease = 'easeOut' as const;

export function Hero() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden pt-24">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(79,140,255,0.09) 0%, rgba(168,85,247,0.05) 45%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0 }}
        >
          <span className="section-badge">{t.hero.badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="gradient-text"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            fontWeight: 700,
          }}
        >
          {t.hero.h1[0]}
          <br />
          {t.hero.h1[1]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.24 }}
          className="text-lg leading-relaxed max-w-2xl"
          style={{ color: '#94A3B8' }}
        >
          {t.hero.subtitle}
          <span style={{ color: '#F5F7FA' }}>{t.hero.subtitleHighlight}</span>
          {t.hero.subtitleEnd}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.36 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <MagneticButton href="#demos" variant="primary" className="text-base px-8 py-4">
            {t.hero.cta1}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
          <MagneticButton onClick={openCalendly} variant="secondary" className="text-base px-8 py-4">
            {t.hero.cta2}
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.48 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2"
                style={{
                  borderColor: '#0A0E17',
                  background: `hsl(${220 + i * 30}, 60%, ${40 + i * 5}%)`,
                }}
              />
            ))}
          </div>
          <p className="text-sm" style={{ color: '#94A3B8' }}>
            <span style={{ color: '#F5F7FA' }}>{t.hero.socialProof}</span>
            {t.hero.socialProofSuffix}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator — fixed to viewport bottom, fades out on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ delay: scrolled ? 0 : 1.2, duration: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ color: '#94A3B8', zIndex: 20 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {t.hero.scroll}
        </span>
        <div
          className="w-px h-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(79,140,255,0.6), transparent)',
            animation: 'scroll-line 2s ease-in-out infinite',
          }}
        />
        <style>{`@keyframes scroll-line{0%{transform:scaleY(0);transform-origin:top;opacity:1}50%{transform:scaleY(1);transform-origin:top;opacity:1}100%{transform:scaleY(1);transform-origin:bottom;opacity:0}}`}</style>
      </motion.div>
    </section>
  );
}

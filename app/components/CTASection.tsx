"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./ui/MagneticButton";
import { useLanguage } from "../i18n/LanguageContext";
import { openCalendly } from "@/lib/config";

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(79,140,255,0.1) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge mb-6 block">{t.cta.badge}</span>
          <h2
            className="gradient-text"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            {t.cta.title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg max-w-2xl leading-relaxed"
          style={{ color: "#94A3B8" }}
        >
          {t.cta.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <div className="flex flex-col items-center gap-3">
            <MagneticButton onClick={openCalendly} variant="primary" className="text-base px-10 py-4">
              {t.cta.button}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <p className="text-sm text-center" style={{ color: "#64748B" }}>
              20-minute call · No commitment · We&apos;ll show you exactly how it works for your business
            </p>
          </div>
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            {t.cta.emailPrefix}{" "}
            <a href="mailto:hello@agentic.ee" style={{ color: "#4F8CFF" }}>
              hello@agentic.ee
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-6 mt-2"
        >
          {t.cta.badges.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-xs"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#94A3B8" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4F8CFF" }} />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { useLanguage } from "../i18n/LanguageContext";

export function Differentiator() {
  const { t } = useLanguage();

  return (
    <section className="relative py-28 px-6">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.3), transparent)" }}
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="section-badge mb-4 block">{t.differentiator.badge}</span>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#F5F7FA",
            }}
          >
            {t.differentiator.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.55, ease: "easeOut" as const }}
          >
            <GlassCard tilt={false} className="p-8 rounded-2xl h-full">
              <h3
                className="text-sm font-medium mb-6 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#94A3B8", fontSize: "0.7rem" }}
              >
                {t.differentiator.col1}
              </h3>
              <ul className="flex flex-col gap-5">
                {t.differentiator.items.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
                    >
                      ✕
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                      {c.bad}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.55, ease: "easeOut" as const }}
          >
            <GlassCard
              className="p-8 rounded-2xl h-full"
              style={{ borderColor: "rgba(79,140,255,0.2)", boxShadow: "0 0 40px rgba(79,140,255,0.06)" }}
            >
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(79,140,255,0.06),rgba(168,85,247,0.03))", borderRadius: "inherit" }}
              />
              <h3
                className="text-sm font-medium mb-6 uppercase tracking-widest relative z-10"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.7rem" }}
              >
                <span className="gradient-text">{t.differentiator.col2}</span>
              </h3>
              <ul className="flex flex-col gap-5 relative z-10">
                {t.differentiator.items.map((c, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: "rgba(79,140,255,0.15)", color: "#4F8CFF" }}
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: "#F5F7FA" }}>
                      {c.good}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

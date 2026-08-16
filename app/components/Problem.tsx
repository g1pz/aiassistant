"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { AnimatedCounter } from "./ui/AnimatedCounter";
import { useLanguage } from "../i18n/LanguageContext";

const STAT_VALUES = [73, 10, 60];
const COLORS = ["#4F8CFF", "#A855F7", "#4F8CFF"];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Problem() {
  const { t } = useLanguage();

  return (
    <section className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="section-badge mb-4 block">{t.problem.badge}</span>
          <h2
            className="gradient-text"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            {t.problem.title}
          </h2>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {t.problem.cards.map((card, i) => (
            <motion.div key={i} variants={item}>
              <GlassCard className="p-8 h-full rounded-2xl flex flex-col gap-5">
                <div
                  className="gradient-text"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <AnimatedCounter target={STAT_VALUES[i]} suffix={card.suffix} />
                </div>
                <span className="section-badge" style={{ color: COLORS[i] }}>
                  {card.label}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#F5F7FA",
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  {card.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

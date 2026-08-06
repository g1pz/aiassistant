"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";

const ICONS = [
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 8v4l3 3" />
  </svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8h2m4 0h2M7 11h10" />
  </svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>,
];

const NUMS = ["01", "02", "03"];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="relative py-28 px-6">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(79,140,255,0.3), transparent)" }}
      />
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="section-badge mb-4 block">{t.howItWorks.badge}</span>
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
            {t.howItWorks.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div
            className="absolute top-10 left-[16.5%] right-[16.5%] h-px hidden md:block"
            style={{ background: "linear-gradient(to right, rgba(79,140,255,0.3), rgba(168,85,247,0.3))" }}
          />
          {t.howItWorks.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" as const }}
              className="flex flex-col gap-5 relative"
            >
              <div className="relative w-20 h-20 flex items-center justify-center glass rounded-2xl mb-2">
                {ICONS[i]}
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full font-bold"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    background: "linear-gradient(135deg, #4F8CFF, #A855F7)",
                    color: "#fff",
                    fontSize: "0.6rem",
                  }}
                >
                  {NUMS[i]}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#F5F7FA",
                }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

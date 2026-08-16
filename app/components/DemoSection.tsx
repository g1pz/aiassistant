"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { useLanguage } from "../i18n/LanguageContext";
import { openCalendly } from "@/lib/config";

const COLORS = ["#4F8CFF", "#A855F7", "#D97706", "#22C55E"];

function IconRealEstate({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18M3 10.5L12 3l9 7.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21v-6h6v6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="5" y="11" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5"/>
      <rect x="16" y="11" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function IconBeauty({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 10a4 4 0 008 0c0-4-4-8-4-8z" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 18c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M3 21h18" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="12" cy="10" r="1.5" fill={color}/>
    </svg>
  );
}

function IconRestaurant({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 11h18M12 4v7" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M5 11C5 7.686 8.134 5 12 5s7 2.686 7 6" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M3 11a1 1 0 001 1h16a1 1 0 001-1" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M8 19h8M12 13v6" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M7 21h10" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  );
}

function IconDental({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C9.5 2 7 4 7 7c0 1.5.5 3 1 4.5C8.5 13 9 15 9 17c0 2 .5 3 1.5 3s1.5-1.5 1.5-3 .5-3 1.5-3 1.5 1.5 1.5 3-.5 3 1.5 3 1.5-1 1.5-3c0-2 .5-4 1-5.5.5-1.5 1-3 1-4.5 0-3-2.5-5-5-5z" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 8.5c1-.5 2-.5 3 0s2 .5 3 0" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const ICONS = [IconRealEstate, IconBeauty, IconRestaurant, IconDental];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function DemoSection() {
  const { t } = useLanguage();

  return (
    <section id="demos" className="relative py-28 px-6">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(79,140,255,0.3), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 50%, rgba(79,140,255,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="section-badge mb-4 block">{t.demos.badge}</span>
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
            {t.demos.title}
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
            {t.demos.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {t.demos.industries.map((industry, i) => (
            <motion.div key={i} variants={item} className="h-full">
              <GlassCard className="p-6 rounded-2xl flex flex-col gap-4 h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${COLORS[i]}18`, border: `1px solid ${COLORS[i]}30` }}
                >
                  {(() => { const Icon = ICONS[i]; return <Icon color={COLORS[i]} />; })()}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "#F5F7FA",
                  }}
                >
                  {industry.name}
                </h3>

                <p className="text-sm leading-relaxed flex-1" style={{ color: "#94A3B8" }}>
                  {industry.desc}
                </p>

                {/* Live demo cards */}
                {i === 0 || i === 1 || i === 2 ? (
                  <div className="mt-auto flex flex-col gap-2">
                    {i === 2 ? (
                      <div className="flex gap-2">
                        <Link
                          href="/chat/bella-cucina"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-medium text-sm cta-btn text-white rounded-full flex-1"
                        >
                          💬 {t.demos.chatBtn}
                        </Link>
                        <Link
                          href="/call/bella-cucina"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-medium text-sm text-white rounded-full flex-1 transition-colors duration-150"
                          style={{ border: "1px solid rgba(217,119,6,0.55)", background: "rgba(217,119,6,0.1)", color: "#FBBF24" }}
                        >
                          📞 {t.demos.voiceBtn}
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={i === 0 ? "/chat/kodu-kinnisvara" : "/chat/glamour-salon"}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm transition-transform duration-150 ease-out cta-btn text-white rounded-full"
                      >
                        {t.demos.tryLiveDemo}
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    )}
                    <span
                      className="flex items-center gap-1.5"
                      style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#22C55E" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#22C55E", boxShadow: "0 0 5px #22C55E", animation: "pulse-dot 2.4s ease-in-out infinite" }}
                      />
                      {t.demos.liveBadge}{i === 2 ? ' · voice + chat' : ''}
                    </span>
                  </div>
                ) : (
                  /* Coming soon cards — Calendly CTA */
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={openCalendly}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm transition-transform duration-150 ease-out rounded-full w-full"
                      style={{
                        background: "transparent",
                        border: `1px solid ${COLORS[i]}50`,
                        color: COLORS[i],
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${COLORS[i]}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {t.demos.getDemo}
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <span
                      className="flex items-center gap-1.5"
                      style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "#94A3B8" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#94A3B8" }} />
                      Soon
                    </span>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

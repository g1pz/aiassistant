"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "./ui/MagneticButton";
import { useLanguage } from "../i18n/LanguageContext";
import { Locale } from "../i18n/translations";
import { openCalendly } from "@/lib/config";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "et", label: "ET" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, locale, setLocale } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t.nav.demos, href: "#demos" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
      style={{
        background: scrolled ? "rgba(10, 14, 23, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0)"}`,
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#F5F7FA" }}
        >
          <img src="/logo32.png" alt="Vorvex" width={24} height={24} />
          VORVEX
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#F5F7FA")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "#94A3B8")
              }
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side: language switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language switcher */}
          <div className="flex items-center gap-1">
            {LOCALES.map((loc, i) => (
              <span key={loc.code} className="flex items-center">
                <button
                  onClick={() => setLocale(loc.code)}
                  className="text-xs font-medium px-1.5 py-0.5 rounded transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    color: locale === loc.code ? "#4F8CFF" : "#94A3B8",
                    background:
                      locale === loc.code
                        ? "rgba(79,140,255,0.1)"
                        : "transparent",
                  }}
                >
                  {loc.label}
                </button>
                {i < LOCALES.length - 1 && (
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    /
                  </span>
                )}
              </span>
            ))}
          </div>

          <MagneticButton onClick={openCalendly} variant="primary" className="text-sm">
            {t.nav.bookCall}
          </MagneticButton>
        </div>

        {/* Mobile: language + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => setLocale(loc.code)}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: locale === loc.code ? "#4F8CFF" : "#94A3B8",
                  background:
                    locale === loc.code
                      ? "rgba(79,140,255,0.1)"
                      : "transparent",
                }}
              >
                {loc.label}
              </button>
            ))}
          </div>

          <button
            className="p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ color: "#94A3B8" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden mt-1 px-6 py-4 flex flex-col gap-4"
          style={{
            background: "rgba(10, 14, 23, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium"
              style={{ color: "#94A3B8" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <MagneticButton
            onClick={openCalendly}
            variant="primary"
            className="text-sm w-full mt-2"
          >
            {t.nav.bookCall}
          </MagneticButton>
        </div>
      )}
    </header>
  );
}

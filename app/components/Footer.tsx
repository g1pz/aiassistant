"use client";

import { useLanguage } from "../i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const navLinks = [
    [t.nav.demos, "#demos"],
    [t.nav.howItWorks, "#how-it-works"],
    [t.nav.bookCall, "#contact"],
  ];

  return (
    <footer className="relative py-12 px-6">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <a
            href="/"
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#F5F7FA" }}
          >
            AGENTIC
            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full align-middle mb-0.5" style={{ background: "#4F8CFF" }} />
          </a>
          <p className="text-sm" style={{ color: "#94A3B8" }}>{t.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#94A3B8", fontSize: "0.65rem" }}
          >
            {t.footer.getInTouch}
          </p>
          <a
            href="mailto:hello@agentic.ee"
            className="text-sm transition-colors duration-200"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#4F8CFF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
          >
            hello@agentic.ee
          </a>
          <a
            href="https://t.me/agentic_ee"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-colors duration-200"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#4F8CFF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
          >
            Telegram: @agentic_ee
          </a>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm transition-colors duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#F5F7FA")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div
        className="mx-auto max-w-7xl mt-10 pt-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "rgba(148,163,184,0.5)", fontSize: "0.65rem" }}
        >
          © {year} AGENTIC. {t.footer.rights}
        </p>
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-jetbrains-mono)", color: "rgba(148,163,184,0.4)", fontSize: "0.65rem" }}
        >
          {t.footer.location}
        </p>
      </div>
    </footer>
  );
}

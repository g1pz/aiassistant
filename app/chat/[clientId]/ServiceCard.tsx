"use client";

import type { Service } from '@/lib/clients/index';

type Lang = 'en' | 'ru' | 'et';

const TEXT: Record<Lang, { book: string; unavailable: string; bookMsg: (name: string) => string }> = {
  en: {
    book: 'Book now →',
    unavailable: 'Unavailable',
    bookMsg: (name) => `I'd like to book "${name}".`,
  },
  ru: {
    book: 'Записаться →',
    unavailable: 'Недоступно',
    bookMsg: (name) => `Хочу записаться на "${name}".`,
  },
  et: {
    book: 'Broneeri →',
    unavailable: 'Pole saadaval',
    bookMsg: (name) => `Sooviksin broneerida "${name}".`,
  },
};

interface ServiceCardProps {
  service: Service;
  lang: Lang;
  accent: string;
  accent2: string;
  onBook: (msg: string) => void;
}

export function ServiceCard({ service, lang, accent, accent2, onBook }: ServiceCardProps) {
  const t = TEXT[lang];
  const displayName     = service.nameI18n?.[lang]     ?? service.name;
  const displayPrice    = service.priceI18n?.[lang]    ?? service.price;
  const displayDuration = service.durationI18n?.[lang] ?? service.duration;
  const displayCategory = service.categoryI18n?.[lang] ?? service.category;

  return (
    <div
      style={{
        marginTop: 8,
        maxWidth: 300,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(18,21,31,0.9)',
        animation: 'cardFadeIn 0.3s ease-out both',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 140, background: '#1a1e2e' }}>
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const ph = img.nextElementSibling as HTMLElement;
            if (ph) ph.style.display = 'flex';
          }}
        />
        {/* Image placeholder */}
        <div
          style={{
            display: 'none', position: 'absolute', inset: 0,
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg,${accent}22,${accent2}22)`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#94A3B8" />
          </svg>
        </div>

        {/* Category badge */}
        <span
          style={{
            position: 'absolute', top: 10, left: 10,
            background: `linear-gradient(135deg,${accent},${accent2})`,
            color: '#fff',
            borderRadius: 9999, padding: '3px 10px', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            fontWeight: 700,
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {displayCategory}
        </span>

        {/* Unavailable overlay */}
        {!service.available && (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
              {t.unavailable}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ color: '#F5F7FA', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
          {displayName}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <span style={{ color: accent, fontSize: 15, fontWeight: 700 }}>
            {displayPrice}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94A3B8', fontSize: 12 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {displayDuration}
          </span>
        </div>

        {/* Dynamic details */}
        {service.details && service.details.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 -2px 2px' }} />
            {service.details.map((detail, i) => {
              const label = detail.labelI18n?.[lang] ?? detail.label;
              const value = detail.valueI18n?.[lang] ?? detail.value;
              return (
                <div key={i}>
                  <span style={{ color: '#64748B', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                    {label}
                  </span>
                  <span style={{ color: '#CBD5E1', fontSize: 12, lineHeight: 1.4 }}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => onBook(t.bookMsg(displayName))}
          disabled={!service.available}
          style={{
            marginTop: 12, width: '100%', padding: '8px 0',
            background: service.available
              ? `linear-gradient(135deg,${accent},${accent2})`
              : 'rgba(148,163,184,0.15)',
            border: 'none', borderRadius: 9999, color: service.available ? '#fff' : '#64748B',
            fontSize: 13, fontWeight: 600,
            cursor: service.available ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { if (service.available) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {service.available ? t.book : t.unavailable}
        </button>
      </div>

      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

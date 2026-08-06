"use client";

import type { Service } from '@/lib/clients/index';

type Lang = 'en' | 'ru' | 'et';

const TEXT: Record<Lang, { ask: string; askMsg: (name: string) => string }> = {
  en: {
    ask: 'Tell me more →',
    askMsg: (name) => `Tell me more about the ${name}.`,
  },
  ru: {
    ask: 'Подробнее →',
    askMsg: (name) => `Расскажите подробнее о блюде «${name}».`,
  },
  et: {
    ask: 'Loe lähemalt →',
    askMsg: (name) => `Rääkige lähemalt roast "${name}".`,
  },
};

interface MenuItemCardProps {
  item: Service;
  lang: Lang;
  accent: string;
  accent2: string;
  onAsk: (msg: string) => void;
}

export function MenuItemCard({ item, lang, accent, accent2, onAsk }: MenuItemCardProps) {
  const t = TEXT[lang];
  const displayName     = item.nameI18n?.[lang]     ?? item.name;
  const displayPrice    = item.priceI18n?.[lang]    ?? item.price;
  const displayCategory = item.categoryI18n?.[lang] ?? item.category;

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
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const ph = img.nextElementSibling as HTMLElement;
            if (ph) ph.style.display = 'flex';
          }}
        />
        <div
          style={{
            display: 'none', position: 'absolute', inset: 0,
            alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg,${accent}22,${accent2}22)`,
            fontSize: 32,
          }}
        >
          🍽️
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
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ color: '#F5F7FA', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
          {displayName}
        </div>

        <div style={{ marginTop: 6 }}>
          <span style={{ color: accent, fontSize: 16, fontWeight: 700 }}>
            {displayPrice}
          </span>
        </div>

        {/* Details */}
        {item.details && item.details.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 -2px 2px' }} />
            {item.details.map((detail, i) => {
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
          onClick={() => onAsk(t.askMsg(displayName))}
          style={{
            marginTop: 12, width: '100%', padding: '8px 0',
            background: `linear-gradient(135deg,${accent},${accent2})`,
            border: 'none', borderRadius: 9999, color: '#fff',
            fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {t.ask}
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

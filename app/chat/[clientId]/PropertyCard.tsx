"use client";

import type { Listing } from '@/lib/clients/index';

type Lang = 'en' | 'ru' | 'et';

const TEXT: Record<Lang, { book: string; available: string; reserved: string; rented: string; bookMsg: string }> = {
  en: { book: 'Book a viewing →', available: 'available', reserved: 'reserved',   rented: 'rented',     bookMsg: "I'd like to book a viewing for this property." },
  ru: { book: 'Записаться на просмотр →', available: 'свободно',  reserved: 'резерв',    rented: 'арендовано', bookMsg: 'Я хочу записаться на просмотр этого объекта.' },
  et: { book: 'Broneeri vaatamine →',     available: 'saadaval',  reserved: 'reserv',    rented: 'üüritud',    bookMsg: 'Soovin broneerida vaatamise selle kinnisvara jaoks.' },
};

interface PropertyCardProps {
  listing: Listing;
  lang: Lang;
  onBook: (msg: string) => void;
}

export function PropertyCard({ listing, lang, onBook }: PropertyCardProps) {
  const t = TEXT[lang];
  const displayTitle = listing.titleI18n?.[lang]  ?? listing.title;
  const displayPrice = listing.priceI18n?.[lang]  ?? listing.price;
  const displayArea  = listing.areaI18n?.[lang]   ?? listing.area;
  const displayTags  = listing.tagsI18n?.[lang]   ?? listing.tags;

  return (
    <div
      style={{
        marginTop: 8,
        maxWidth: 320,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(18,21,31,0.9)',
        animation: 'cardFadeIn 0.3s ease-out both',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 160, background: '#1a1e2e' }}>
        <img
          src={listing.imageUrl}
          alt={listing.title}
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
            alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12h6v10" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Status badge */}
        <span
          style={{
            position: 'absolute', top: 10, right: 10,
            background: listing.status === 'available' ? '#16a34a' : '#dc2626',
            color: '#fff',
            borderRadius: 9999, padding: '3px 10px', fontSize: 11,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {t[listing.status]}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ color: '#F5F7FA', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
            {displayTitle}
          </span>
          <span style={{ color: '#94A3B8', fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {displayArea}
          </span>
        </div>

        <div style={{ color: '#4F8CFF', fontSize: 15, fontWeight: 700, marginTop: 4 }}>
          {displayPrice}
        </div>

        {displayTags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {displayTags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'rgba(79,140,255,0.12)', color: '#4F8CFF',
                  border: '1px solid rgba(79,140,255,0.25)',
                  borderRadius: 9999, padding: '2px 8px', fontSize: 11,
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => onBook(t.bookMsg)}
          style={{
            marginTop: 12, width: '100%', padding: '8px 0',
            background: 'linear-gradient(135deg,#4F8CFF,#A855F7)',
            border: 'none', borderRadius: 9999, color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {t.book}
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

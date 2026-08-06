"use client";

type Lang = 'en' | 'ru' | 'et';

export interface BookingData {
  service?: string;
  date?: string;
  date_iso?: string;
  time?: string;
  name?: string;
  contact?: string;
  guests?: string;
}

const TEXT: Record<Lang, {
  title: string;
  tableTitle: string;
  service: string;
  guests: string;
  date: string;
  time: string;
  name: string;
  contact: string;
  note: string;
  tableNote: string;
  callBtn: string;
}> = {
  en: {
    title: 'Appointment Request',
    tableTitle: 'Table Reserved',
    service: 'Service',
    guests: 'Guests',
    date: 'Date',
    time: 'Time',
    name: 'Name',
    contact: 'Contact',
    note: 'Our team will confirm your booking within 30 minutes during working hours.',
    tableNote: 'Your reservation is confirmed. We look forward to seeing you!',
    callBtn: 'Call to confirm',
  },
  ru: {
    title: 'Запись принята',
    tableTitle: 'Стол забронирован',
    service: 'Услуга',
    guests: 'Гостей',
    date: 'Дата',
    time: 'Время',
    name: 'Имя',
    contact: 'Контакт',
    note: 'Наш администратор подтвердит запись в течение 30 минут в рабочее время.',
    tableNote: 'Ваша бронь подтверждена. Ждём вас в Bella Cucina!',
    callBtn: 'Позвонить для подтверждения',
  },
  et: {
    title: 'Broneeringusoov',
    tableTitle: 'Laud reserveeritud',
    service: 'Teenus',
    guests: 'Külastajaid',
    date: 'Kuupäev',
    time: 'Kellaaeg',
    name: 'Nimi',
    contact: 'Kontakt',
    note: 'Meie tiim kinnitab teie broneeringu 30 minuti jooksul tööajal.',
    tableNote: 'Teie reserveering on kinnitatud. Ootame teid Bella Cucinasse!',
    callBtn: 'Helista kinnitamiseks',
  },
};

interface BookingCardProps {
  data: BookingData;
  lang: Lang;
  accent: string;
  accent2: string;
  salonPhone?: string;
}

export function BookingCard({ data, lang, accent, accent2, salonPhone }: BookingCardProps) {
  const t = TEXT[lang];
  const isRestaurant = !!data.guests;

  const rows: { label: string; value?: string; icon: string }[] = [
    isRestaurant
      ? { label: t.guests,  value: data.guests,  icon: '👥' }
      : { label: t.service, value: data.service, icon: '✂️' },
    { label: t.date,    value: data.date,    icon: '📅' },
    { label: t.time,    value: data.time,    icon: '🕐' },
    { label: t.name,    value: data.name,    icon: '👤' },
    { label: t.contact, value: data.contact, icon: '📱' },
  ].filter((r) => r.value);

  return (
    <div
      style={{
        marginTop: 8,
        maxWidth: 300,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${accent}44`,
        background: 'rgba(18,21,31,0.95)',
        animation: 'cardFadeIn 0.3s ease-out both',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg,${accent},${accent2})`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>{isRestaurant ? '🍽️' : '✓'}</span>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{isRestaurant ? t.tableTitle : t.title}</span>
      </div>

      {/* Rows */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.4 }}>{row.icon}</span>
            <div>
              <span style={{ color: '#64748B', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                {row.label}
              </span>
              <span style={{ color: '#F5F7FA', fontSize: 13, fontWeight: 500 }}>
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* Note */}
      <div style={{ padding: '0 16px', paddingBottom: 2 }}>
        <p style={{ color: '#64748B', fontSize: 11, margin: 0, lineHeight: 1.4 }}>
          {isRestaurant ? t.tableNote : t.note}
        </p>
      </div>

      {/* Button */}
      <div style={{ padding: '10px 16px 14px' }}>
        {salonPhone && (
          <a
            href={`tel:${salonPhone.replace(/\s/g, '')}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', padding: '8px 0',
              background: `linear-gradient(135deg,${accent},${accent2})`,
              borderRadius: 9999, color: '#fff',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            📞 {salonPhone}
          </a>
        )}
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

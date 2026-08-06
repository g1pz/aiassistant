import type { ClientConfig } from './index';

export const glamourSalon: ClientConfig = {
  name: 'Glamour Studio',
  phone: '+372 5811 2233',

  theme: {
    accent: '#D946A8',
    accent2: '#F472B6',
  },

  welcomeMessages: {
    en: "Hi! I'm the virtual assistant for Glamour Studio. I can tell you about our services, prices, and help you book an appointment. How can I help you? 💅",
    ru: "Привет! Я виртуальный ассистент Glamour Studio. Расскажу об услугах и ценах, помогу записаться на удобное время. Чем могу помочь? 💅",
    et: "Tere! Olen Glamour Studio virtuaalne assistent. Saan rääkida teenustest, hindadest ja aidata teile aeg broneerida. Kuidas saan aidata? 💅",
  },

  listings: [],

  services: [
    {
      id: 'service-1',
      name: "Women's Haircut & Blowdry",
      nameI18n: { ru: 'Женская стрижка и укладка', et: 'Naiste juusteleik ja föön' },
      price: '€35–55',
      duration: '60 min',
      durationI18n: { ru: '60 мин', et: '60 min' },
      category: 'Hair',
      categoryI18n: { ru: 'Волосы', et: 'Juuksed' },
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Wash, cut & blowdry by senior stylist',
          valueI18n: { ru: 'Мойка, стрижка и укладка старшим стилистом', et: 'Pesu, lõikus ja föön vanemmeistrilt' },
        },
        {
          label: 'Price varies by',
          labelI18n: { ru: 'Цена зависит от', et: 'Hind sõltub' },
          value: 'Hair length & complexity',
          valueI18n: { ru: 'Длины и сложности работы', et: 'Juuste pikkusest ja keerukusest' },
        },
      ],
    },
    {
      id: 'service-2',
      name: "Men's Haircut",
      nameI18n: { ru: 'Мужская стрижка', et: 'Meeste juusteleik' },
      price: '€18–25',
      duration: '30 min',
      durationI18n: { ru: '30 мин', et: '30 min' },
      category: 'Hair',
      categoryI18n: { ru: 'Волосы', et: 'Juuksed' },
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Wash & cut',
          valueI18n: { ru: 'Мойка и стрижка', et: 'Pesu ja lõikus' },
        },
      ],
    },
    {
      id: 'service-3',
      name: 'Full Color',
      nameI18n: { ru: 'Полное окрашивание', et: 'Täielik värvimine' },
      price: '€60–90',
      duration: '120 min',
      durationI18n: { ru: '120 мин', et: '120 min' },
      category: 'Color',
      categoryI18n: { ru: 'Окрашивание', et: 'Värvimine' },
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Color application, development, wash & blowdry',
          valueI18n: { ru: 'Нанесение, вымывание и укладка', et: 'Värvi kandmine, loputus ja föön' },
        },
        {
          label: 'Price varies by',
          labelI18n: { ru: 'Цена зависит от', et: 'Hind sõltub' },
          value: 'Hair length',
          valueI18n: { ru: 'Длины волос', et: 'Juuste pikkusest' },
        },
      ],
    },
    {
      id: 'service-4',
      name: 'Balayage',
      nameI18n: { ru: 'Балаяж', et: 'Balayage' },
      price: '€90–140',
      duration: '180 min',
      durationI18n: { ru: '180 мин', et: '180 min' },
      category: 'Color',
      categoryI18n: { ru: 'Окрашивание', et: 'Värvimine' },
      imageUrl: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Hand-painted highlights, toner, wash & blowdry',
          valueI18n: { ru: 'Ручное мелирование, тонирование, мойка и укладка', et: 'Käsitsi tõstetud toonid, toonija, pesu ja föön' },
        },
        {
          label: 'Result lasts',
          labelI18n: { ru: 'Результат держится', et: 'Tulemus kestab' },
          value: '3–4 months',
          valueI18n: { ru: '3–4 месяца', et: '3–4 kuud' },
        },
        {
          label: 'Note',
          labelI18n: { ru: 'Примечание', et: 'Märkus' },
          value: 'Book early — popular service',
          valueI18n: { ru: 'Популярная услуга — лучше записаться заранее', et: 'Populaarne teenus — soovitame varakult broneerida' },
        },
      ],
    },
    {
      id: 'service-5',
      name: 'Gel Manicure',
      nameI18n: { ru: 'Гель-маникюр', et: 'Geelküüned' },
      price: '€30',
      duration: '60 min',
      durationI18n: { ru: '60 мин', et: '60 min' },
      category: 'Nails',
      categoryI18n: { ru: 'Ногти', et: 'Küüned' },
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Shaping, cuticle care & gel color',
          valueI18n: { ru: 'Форма, уход за кутикулой и гель-покрытие', et: 'Kuju, küünenaha hooldus ja geelvärv' },
        },
        {
          label: 'Lasts',
          labelI18n: { ru: 'Держится', et: 'Kestab' },
          value: '2–3 weeks',
          valueI18n: { ru: '2–3 недели', et: '2–3 nädalat' },
        },
      ],
    },
    {
      id: 'service-6',
      name: 'Classic Pedicure',
      nameI18n: { ru: 'Классический педикюр', et: 'Klassikaline pediküür' },
      price: '€35',
      duration: '60 min',
      durationI18n: { ru: '60 мин', et: '60 min' },
      category: 'Nails',
      categoryI18n: { ru: 'Ногти', et: 'Küüned' },
      imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Foot soak, callus treatment, shaping & polish',
          valueI18n: { ru: 'Ванночка, обработка огрубевшей кожи, форма и покрытие', et: 'Jalavann, konaruste eemaldamine, kuju ja lakk' },
        },
      ],
    },
    {
      id: 'service-7',
      name: 'Eyebrow Shaping & Tint',
      nameI18n: { ru: 'Оформление и окрашивание бровей', et: 'Kulmude kujundamine ja värvimine' },
      price: '€20',
      duration: '30 min',
      durationI18n: { ru: '30 мин', et: '30 min' },
      category: 'Brows',
      categoryI18n: { ru: 'Брови', et: 'Kulmud' },
      imageUrl: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Waxing or threading + vegetable tint',
          valueI18n: { ru: 'Воск или нить + растительный краситель', et: 'Vahtimine või niitamine + taimne toonija' },
        },
        {
          label: 'Lasts',
          labelI18n: { ru: 'Держится', et: 'Kestab' },
          value: '3–4 weeks',
          valueI18n: { ru: '3–4 недели', et: '3–4 nädalat' },
        },
      ],
    },
    {
      id: 'service-8',
      name: 'Classic Facial',
      nameI18n: { ru: 'Классический уход за лицом', et: 'Klassikaline näohooldus' },
      price: '€45',
      duration: '60 min',
      durationI18n: { ru: '60 мин', et: '60 min' },
      category: 'Skin',
      categoryI18n: { ru: 'Кожа', et: 'Nahk' },
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Includes',
          labelI18n: { ru: 'Включено', et: 'Sisaldab' },
          value: 'Cleansing, exfoliation, massage, mask & moisturizer',
          valueI18n: { ru: 'Очищение, пилинг, массаж, маска и увлажнение', et: 'Puhastus, koorimine, massaaž, mask ja niisutus' },
        },
        {
          label: 'Suitable for',
          labelI18n: { ru: 'Подходит для', et: 'Sobib' },
          value: 'All skin types',
          valueI18n: { ru: 'Всех типов кожи', et: 'Kõigile nahatüüpidele' },
        },
      ],
    },
  ],

  systemPrompt: `You are an AI assistant for Glamour Studio, a premium beauty salon in Tallinn, Estonia. You have full knowledge of the salon's services, prices, and booking process. Your job is to help clients choose services, answer questions, and guide them through booking an appointment.

IMPORTANT RULES:
1. Answer ONLY based on the information provided below. If a client asks something not covered here, say: "Great question — I'll pass it to our team. Can I get your name and email so we can follow up?"
2. NEVER invent prices, durations, or policies.
3. Detect the client's language from their first message and respond in that same language throughout. You can communicate in any language the client uses.
4. When recommending specific services, always include their IDs at the END of your message using this exact format: SERVICE_IDS: service-1, service-2 (comma-separated). If one service — SERVICE_IDS: service-1. Do NOT include this marker when not discussing specific services.
5. When mentioning a service, do NOT repeat its full price or duration — that information is displayed automatically in a service card. Write 1–2 sentences about why it suits the client's request.
6. Keep responses concise — 3–5 sentences per message unless the client asks for detail.
7. NEVER autocorrect or rephrase user input. If something is unclear, ask the client to clarify.
8. NEVER discuss competitors.

---

BOOKING PROCESS:
When a client wants to book, collect this information step by step (one question at a time):
1. Which service they want (if not already clear)
2. Preferred date
3. Preferred time
4. Their first and last name
5. Phone number or email

After collecting ALL five pieces of information, confirm the appointment with a summary message and include EXACTLY this marker at the end:
BOOKING_SUMMARY: service={service_name}|date={readable_date}|date_iso={YYYY-MM-DD}|time={HH:MM}|name={client_name}|contact={phone_or_email}

Example: BOOKING_SUMMARY: service=Balayage|date=Thursday, 7 August|date_iso=2026-08-07|time=11:00|name=Maria Ivanova|contact=maria@email.com

CRITICAL: Before suggesting or confirming any date/time, always check the CURRENT BOOKINGS section at the bottom of this prompt. If the requested slot is taken (considering service duration), say so and suggest the nearest free alternative. Do NOT include the BOOKING_SUMMARY marker until you have ALL five pieces of information AND the slot is confirmed free.

---

SALON INFORMATION:

Name: Glamour Studio OÜ
Address: Viru 5, Tallinn 10140 (Old Town area)
Working hours: Mon–Sat 9:00–20:00, Sun 10:00–18:00
Phone: +372 5811 2233
Email: hello@glamourstudio.ee
Languages: Estonian, Russian, English
Online booking platform: Fresha (clients can also book at fresha.com — just search "Glamour Studio Tallinn")
Cancellation policy: Free cancellation up to 24 hours before the appointment.

---

SERVICES MENU:

HAIR:
1. Women's Haircut & Blowdry
   SERVICE_ID: service-1
   Price: €35–55 (depends on hair length and complexity)
   Duration: 60 min
   Includes: wash, cut, and blowdry by a senior stylist

2. Men's Haircut
   SERVICE_ID: service-2
   Price: €18–25
   Duration: 30 min
   Includes: wash and cut

COLOR:
3. Full Color
   SERVICE_ID: service-3
   Price: €60–90 (depending on hair length)
   Duration: 120 min
   Includes: color application, development, wash, and blowdry

4. Balayage
   SERVICE_ID: service-4
   Price: €90–140 (short to long hair)
   Duration: 180 min
   Includes: hand-painted highlights, toner, wash, and blowdry. The most popular highlighting technique for a natural sun-kissed look.

NAILS:
5. Gel Manicure
   SERVICE_ID: service-5
   Price: €30
   Duration: 60 min
   Includes: nail shaping, cuticle care, gel color application. Lasts 2–3 weeks.

6. Classic Pedicure
   SERVICE_ID: service-6
   Price: €35
   Duration: 60 min
   Includes: foot soak, callus treatment, nail shaping, and regular polish.

BROWS:
7. Eyebrow Shaping & Tint
   SERVICE_ID: service-7
   Price: €20
   Duration: 30 min
   Includes: waxing or threading to shape, plus vegetable tint for definition. Lasts 3–4 weeks.

SKIN:
8. Classic Facial
   SERVICE_ID: service-8
   Price: €45
   Duration: 60 min
   Includes: deep cleansing, exfoliation, massage, mask, and moisturizer. Suitable for all skin types.

---

FREQUENTLY ASKED QUESTIONS:

Q: Do you accept walk-ins?
A: We recommend booking in advance, especially on weekends. Walk-ins are welcome if a time slot is available, but we can't guarantee availability without a reservation.

Q: What payment methods do you accept?
A: Cash, all major bank cards, and contactless payments (Apple Pay, Google Pay).

Q: Do you have parking?
A: We're located in the Old Town — the nearest paid parking is at Viru Keskus (2 min walk). Public transport: tram lines 2 and 4 stop right outside.

Q: Can I bring my child?
A: Children's haircuts are available on request (up to age 12, €12). Please mention this when booking.

Q: How much notice do I need to book?
A: For popular slots (weekends, evenings), we recommend booking 2–3 days in advance. Weekday mornings are usually available on the same day.

Q: Do you do bridal packages?
A: Yes! Contact us directly at hello@glamourstudio.ee for custom bridal packages — we offer full-day or half-day bookings for the whole party.`,
};

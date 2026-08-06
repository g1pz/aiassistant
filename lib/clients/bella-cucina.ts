import type { ClientConfig } from './index';

export const bellaCucina: ClientConfig = {
  name: 'Bella Cucina',
  clientType: 'restaurant',
  phone: process.env.VAPI_PHONE_NUMBER || '',
  vapiAssistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '',

  theme: {
    accent: '#D97706',
    accent2: '#B45309',
  },

  welcomeMessages: {
    en: "Buonasera! I'm Sofia, your virtual host at Bella Cucina 🍽️ I can help with reservations, tell you about our menu, or answer any questions. How can I help you tonight?",
    ru: "Buonasera! Я София, виртуальный хост Bella Cucina 🍽️ Помогу забронировать столик, расскажу о меню или отвечу на вопросы. Чем могу помочь?",
    et: "Buonasera! Olen Sofia, Bella Cucina virtuaalne peremees 🍽️ Saan aidata reserveerida, rääkida menüüst või vastata küsimustele. Kuidas saan aidata?",
  },

  listings: [],

  services: [
    // ── Antipasti ──────────────────────────────────────────────────────────
    {
      id: 'dish-1',
      name: 'Bruschetta al Pomodoro',
      price: '€8',
      duration: '—',
      category: 'Antipasti',
      categoryI18n: { ru: 'Закуски', et: 'Eelroad' },
      imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Toasted ciabatta, heirloom tomatoes, basil & extra virgin olive oil',
          valueI18n: {
            ru: 'Тосты из чиабатты с томатами, базиликом и оливковым маслом первого отжима',
            et: 'Grillitud ciabatta, pärandtomatid, basiilik ja külmpressitud oliiviõli',
          },
        },
        {
          label: 'Dietary',
          labelI18n: { ru: 'Диета', et: 'Dieet' },
          value: 'Vegetarian · Vegan',
          valueI18n: { ru: 'Вегетарианское · Веганское', et: 'Taimetoit · Vegan' },
        },
      ],
    },
    {
      id: 'dish-2',
      name: 'Burrata con Prosciutto',
      price: '€14',
      duration: '—',
      category: 'Antipasti',
      categoryI18n: { ru: 'Закуски', et: 'Eelroad' },
      imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190ca9d30d?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Fresh burrata, San Daniele prosciutto, cherry tomatoes & rocket',
          valueI18n: {
            ru: 'Свежая буррата, прошутто Сан-Даниеле, томаты черри и руккола',
            et: 'Värske burrata, San Daniele prosciutto, kirsitomatid ja rucola',
          },
        },
      ],
    },
    {
      id: 'dish-3',
      name: 'Zuppa di Pesce',
      nameI18n: { ru: 'Рыбный суп', et: 'Kalasupp' },
      price: '€12',
      duration: '—',
      category: 'Antipasti',
      categoryI18n: { ru: 'Закуски', et: 'Eelroad' },
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Mussels, clams, shrimp & white fish in saffron broth',
          valueI18n: {
            ru: 'Мидии, моллюски, креветки и белая рыба в шафрановом бульоне',
            et: 'Rannakarbid, karbid, krevetid ja valge kala safranipuljongis',
          },
        },
      ],
    },

    // ── Pasta & Risotto ────────────────────────────────────────────────────
    {
      id: 'dish-4',
      name: 'Spaghetti alla Carbonara',
      price: '€16',
      duration: '—',
      category: 'Pasta & Risotto',
      categoryI18n: { ru: 'Паста и ризотто', et: 'Pasta ja risoto' },
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Guanciale, free-range egg yolk, Pecorino Romano, black pepper. No cream.',
          valueI18n: {
            ru: 'Гуанчале, желток домашнего яйца, пекорино романо, чёрный перец. Без сливок.',
            et: 'Guanciale, vabalt peetud kana munakollane, Pecorino Romano, must pipar. Ilma kooreta.',
          },
        },
      ],
    },
    {
      id: 'dish-5',
      name: 'Pappardelle al Cinghiale',
      nameI18n: { ru: 'Паппарделле с диким кабаном', et: 'Pappardelle metssea ragùga' },
      price: '€19',
      duration: '—',
      category: 'Pasta & Risotto',
      categoryI18n: { ru: 'Паста и ризотто', et: 'Pasta ja risoto' },
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Homemade pasta with 6-hour braised wild boar ragù, red wine & juniper. Our signature dish.',
          valueI18n: {
            ru: 'Домашняя паста с рагу из дикого кабана (6 часов тушения), красное вино и можжевельник. Наш фирменный рецепт.',
            et: 'Kodune pasta 6 tundi hautatud metssea ragùga, punane vein ja kadakas. Meie firmaroog.',
          },
        },
      ],
    },
    {
      id: 'dish-6',
      name: 'Risotto ai Funghi Porcini',
      nameI18n: { ru: 'Ризотто с белыми грибами', et: 'Risoto puravikkudega' },
      price: '€18',
      duration: '—',
      category: 'Pasta & Risotto',
      categoryI18n: { ru: 'Паста и ризотто', et: 'Pasta ja risoto' },
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Carnaroli rice with fresh & dried porcini, truffle oil & aged Parmigiano',
          valueI18n: {
            ru: 'Рис карнарори со свежими и сушёными белыми грибами, трюфельным маслом и пармиджано',
            et: 'Carnaroli riis värskete ja kuivatatud puravikkudega, trühveliõli ja laagerdunud parmesaniga',
          },
        },
        {
          label: 'Dietary',
          labelI18n: { ru: 'Диета', et: 'Dieet' },
          value: 'Vegetarian · Gluten-free',
          valueI18n: { ru: 'Вегетарианское · Без глютена', et: 'Taimetoit · Gluteenivaba' },
        },
      ],
    },

    // ── Secondi ────────────────────────────────────────────────────────────
    {
      id: 'dish-7',
      name: 'Branzino al Forno',
      nameI18n: { ru: 'Запечённый сибас', et: 'Küpsetatud meriahven' },
      price: '€24',
      duration: '—',
      category: 'Secondi',
      categoryI18n: { ru: 'Основные блюда', et: 'Pearoad' },
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Whole oven-roasted sea bass, capers, olives, lemon & Mediterranean herbs',
          valueI18n: {
            ru: 'Целый запечённый сибас с каперсами, маслинами, лимоном и средиземноморскими травами',
            et: 'Terve ahjus küpsetatud meriahven, kapparid, oliivid, sidrun ja Vahemere maitsetaimed',
          },
        },
        {
          label: 'Dietary',
          labelI18n: { ru: 'Диета', et: 'Dieet' },
          value: 'Gluten-free',
          valueI18n: { ru: 'Без глютена', et: 'Gluteenivaba' },
        },
      ],
    },
    {
      id: 'dish-8',
      name: 'Tagliata di Manzo',
      nameI18n: { ru: 'Тальята из говядины', et: 'Veise tagliata' },
      price: '€28',
      duration: '—',
      category: 'Secondi',
      categoryI18n: { ru: 'Основные блюда', et: 'Pearoad' },
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Grilled sirloin (250g), rocket, shaved Parmigiano & aged balsamic',
          valueI18n: {
            ru: 'Жареная вырезка (250г), руккола, пармиджано и выдержанный бальзамик',
            et: 'Grillitud sisefilee (250g), rucola, hakitud parmesan ja laagerdunud palsamiäädikas',
          },
        },
        {
          label: 'Dietary',
          labelI18n: { ru: 'Диета', et: 'Dieet' },
          value: 'Gluten-free',
          valueI18n: { ru: 'Без глютена', et: 'Gluteenivaba' },
        },
      ],
    },

    // ── Dolci ──────────────────────────────────────────────────────────────
    {
      id: 'dish-9',
      name: "Tiramisù della Casa",
      nameI18n: { ru: 'Тирамису от шефа', et: 'Kojune tiramisù' },
      price: '€8',
      duration: '—',
      category: 'Dolci',
      categoryI18n: { ru: 'Десерты', et: 'Magustoidud' },
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: "Chef Marco's recipe — Savoiardi, mascarpone, espresso & a touch of Marsala",
          valueI18n: {
            ru: 'Рецепт шефа Марко — савоярди, маскарпоне, эспрессо и немного марсалы',
            et: 'Chef Marco retsept — Savoiardi, mascarpone, espresso ja tilk Marsalat',
          },
        },
      ],
    },
    {
      id: 'dish-10',
      name: 'Panna Cotta ai Frutti di Bosco',
      nameI18n: { ru: 'Панна-котта с лесными ягодами', et: 'Panna cotta metsamarjadega' },
      price: '€7',
      duration: '—',
      category: 'Dolci',
      categoryI18n: { ru: 'Десерты', et: 'Magustoidud' },
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
      available: true,
      details: [
        {
          label: 'Description',
          labelI18n: { ru: 'Описание', et: 'Kirjeldus' },
          value: 'Silky vanilla panna cotta with warm wild berry compote & fresh mint',
          valueI18n: {
            ru: 'Шёлковая ванильная панна-котта с тёплым компотом из лесных ягод и мятой',
            et: 'Siidine vanilli panna cotta sooja metsamarjakompoti ja värske mündi',
          },
        },
        {
          label: 'Dietary',
          labelI18n: { ru: 'Диета', et: 'Dieet' },
          value: 'Vegetarian · Gluten-free',
          valueI18n: { ru: 'Вегетарианское · Без глютена', et: 'Taimetoit · Gluteenivaba' },
        },
      ],
    },
  ],

  systemPrompt: `You are Sofia, the AI host and reservation manager at Bella Cucina — a contemporary Italian restaurant in Tallinn's Old Town. Speak in a warm, welcoming tone, like a real host who loves good food and great company.

IMPORTANT RULES:
1. Answer ONLY based on the information provided below. If a guest asks something outside your knowledge, say: "Wonderful question — let me have our manager follow up. Could I get your name and a contact?"
2. NEVER invent dishes, prices, or policies.
3. Detect the guest's language from their first message and respond in that same language throughout. You communicate in English, Russian, and Estonian.
4. When recommending specific dishes, always include their IDs at the END of your message using this exact format: SERVICE_IDS: dish-1, dish-2 (comma-separated). Do NOT include this marker when not discussing specific dishes.
5. When mentioning a dish, do NOT repeat its price — that is shown automatically. Write 1–2 warm sentences about the dish's character or why it suits the guest.
6. Keep responses warm but concise — 2–4 sentences. If a guest asks for detail, go deeper.
7. NEVER discuss competitors or give medical/allergy advice beyond what is listed.

---

RESERVATION PROCESS:
When a guest wants to reserve a table, collect this information one question at a time:
1. Number of guests
2. Preferred date
3. Preferred time
4. First and last name
5. Phone number or email

After collecting ALL five pieces of information, confirm the reservation with a warm summary and include EXACTLY this marker at the end:
BOOKING_SUMMARY: service=Table for {N} guests|guests={N}|date={readable_date}|date_iso={YYYY-MM-DD}|time={HH:MM}|name={client_name}|contact={phone_or_email}

Example: BOOKING_SUMMARY: service=Table for 2 guests|guests=2|date=Thursday, 7 August|date_iso=2026-08-07|time=19:00|name=Maria Ivanova|contact=+372 5000 0000

CRITICAL: Before suggesting or confirming any date/time, always check the CURRENT BOOKINGS section at the bottom. Do NOT include the BOOKING_SUMMARY marker until you have ALL five pieces of information AND the slot is confirmed free.

---

RESTAURANT INFORMATION:

Name: Bella Cucina
Cuisine: Contemporary Italian
Address: Viru 12, Tallinn 10140 (Old Town — 3 min from Viru Gate)
Opening hours:
  Mon–Thu: 12:00–22:00
  Fri–Sat: 12:00–23:00
  Sun: 13:00–21:00
Email: reservations@bellacucina.ee
Reservation policy: We accept reservations for 1–20 guests. Walk-ins welcome when space is available.
Cancellation policy: Free cancellation up to 2 hours before the reservation.
Dress code: Smart casual.
Private dining: Available for groups of 8+. Email reservations@bellacucina.ee.
Parking: Paid parking at Viru Keskus (2 min walk). Tram lines 2 and 4 stop outside.
Payment: All major cards, contactless, Apple Pay, Google Pay. No cash.

---

MENU:

ANTIPASTI (Starters):
1. Bruschetta al Pomodoro — €8
   SERVICE_ID: dish-1
   Toasted ciabatta, heirloom tomatoes, fresh basil & extra virgin olive oil. Vegetarian & vegan.

2. Burrata con Prosciutto — €14
   SERVICE_ID: dish-2
   Fresh burrata from Puglia, San Daniele prosciutto, cherry tomatoes & rocket. A guest favourite.

3. Zuppa di Pesce — €12
   SERVICE_ID: dish-3
   Fisherman's soup — mussels, clams, shrimp & white fish in saffron broth.

PASTA & RISOTTO:
4. Spaghetti alla Carbonara — €16
   SERVICE_ID: dish-4
   Roman classic — guanciale, egg yolk, Pecorino Romano, black pepper. No cream, ever.

5. Pappardelle al Cinghiale — €19
   SERVICE_ID: dish-5
   Homemade pappardelle with 6-hour braised wild boar ragù. Our most popular dish.

6. Risotto ai Funghi Porcini — €18
   SERVICE_ID: dish-6
   Carnaroli rice with porcini mushrooms, truffle oil & aged Parmigiano. Vegetarian.

SECONDI (Main Courses):
7. Branzino al Forno — €24
   SERVICE_ID: dish-7
   Whole oven-roasted sea bass, capers, olives, lemon & Mediterranean herbs. Gluten-free.

8. Tagliata di Manzo — €28
   SERVICE_ID: dish-8
   Grilled sirloin (250g), rocket, shaved Parmigiano & aged balsamic. Gluten-free.

DOLCI (Desserts):
9. Tiramisù della Casa — €8
   SERVICE_ID: dish-9
   Chef Marco's recipe — Savoiardi, mascarpone, espresso & a touch of Marsala.

10. Panna Cotta ai Frutti di Bosco — €7
    SERVICE_ID: dish-10
    Silky vanilla panna cotta with wild berry compote & fresh mint. Vegetarian & gluten-free.

---

BUSINESS LUNCH (Mon–Fri, 12:00–15:00):
- 2-course (soup + main): €14
- 3-course (starter + main + coffee): €18

LIVE JAZZ: Every Friday & Saturday from 20:00.

---

FREQUENTLY ASKED QUESTIONS:

Q: Do you have vegetarian or vegan options?
A: Yes. Bruschetta is vegan, Risotto and Panna Cotta are vegetarian. We can adapt some dishes — please mention dietary needs when booking.

Q: Do you have gluten-free options?
A: Branzino and Tagliata are naturally gluten-free. Please inform our staff of allergies on arrival.

Q: Can you accommodate large groups or private events?
A: Absolutely. For 8+ guests we have a private dining room with a custom menu. Email reservations@bellacucina.ee.

Q: Is there a children's menu?
A: No separate menu, but we're happy to serve smaller pasta portions for children.

Q: Do you take walk-ins?
A: Yes, when space is available. Evenings and weekends fill up quickly — a reservation is strongly recommended.

Q: Is there live music?
A: Yes, live jazz every Friday and Saturday from 20:00.

Q: Where are you located?
A: Viru 12, Tallinn Old Town — 3 minutes from Viru Gate. Tram lines 2 and 4 stop right outside.`,
};

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * VAPI SETUP GUIDE — paste this system prompt into your Vapi assistant
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 1. Go to vapi.ai → Create Assistant → choose Claude (claude-sonnet-4-6)
 * 2. Set First Message: "Bella Cucina, buonasera! I'm Sofia. How can I help you?"
 * 3. Paste the system prompt above (remove the BOOKING_SUMMARY instructions — not needed for voice)
 * 4. Add Tool (function):
 *    Name: book_table
 *    Description: "Save a table reservation to the database"
 *    Parameters (JSON Schema):
 *    {
 *      "type": "object",
 *      "properties": {
 *        "guests":   { "type": "string", "description": "Number of guests" },
 *        "date":     { "type": "string", "description": "Human-readable date, e.g. Thursday, August 7" },
 *        "date_iso": { "type": "string", "description": "Date in YYYY-MM-DD format" },
 *        "time":     { "type": "string", "description": "Time in HH:MM format" },
 *        "name":     { "type": "string", "description": "Guest full name" },
 *        "contact":  { "type": "string", "description": "Phone number or email" }
 *      },
 *      "required": ["guests","date","date_iso","time","name","contact"]
 *    }
 *    Server URL: https://YOUR_DOMAIN/api/vapi/book
 *
 * 5. Buy a phone number (Phone Numbers → Buy Number → US ~$2/month)
 *    OR add Twilio SIP trunk for a local number
 * 6. Assign the phone number to the assistant
 * 7. Copy:
 *    - Assistant ID → NEXT_PUBLIC_VAPI_ASSISTANT_ID in .env.local
 *    - Public key (Dashboard → API Keys) → NEXT_PUBLIC_VAPI_KEY in .env.local
 *    - Phone number → VAPI_PHONE_NUMBER in .env.local
 *    - Server secret (optional) → VAPI_WEBHOOK_SECRET in .env.local
 * ─────────────────────────────────────────────────────────────────────────────
 */

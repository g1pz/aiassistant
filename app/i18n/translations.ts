export type Locale = "en" | "ru" | "et";

export interface T {
  nav: {
    demos: string;
    howItWorks: string;
    contact: string;
    bookCall: string;
  };
  hero: {
    badge: string;
    h1: string[];
    subtitle: string;
    subtitleHighlight: string;
    subtitleEnd: string;
    cta1: string;
    cta2: string;
    socialProof: string;
    socialProofSuffix: string;
    scroll: string;
  };
  problem: {
    badge: string;
    title: string;
    cards: Array<{ suffix: string; label: string; title: string; desc: string }>;
  };
  howItWorks: {
    badge: string;
    title: string;
    steps: Array<{ title: string; desc: string }>;
  };
  differentiator: {
    badge: string;
    title: string;
    col1: string;
    col2: string;
    items: Array<{ bad: string; good: string }>;
  };
  demos: {
    badge: string;
    title: string;
    subtitle: string;
    industries: Array<{ name: string; desc: string; tagline?: string }>;
    comingSoon: string;
    tryDemo: string;
    tryLiveDemo: string;
    getDemo: string;
    liveBadge: string;
    chatBtn: string;
    voiceBtn: string;
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    button: string;
    emailPrefix: string;
    badges: string[];
  };
  footer: {
    tagline: string;
    getInTouch: string;
    rights: string;
    location: string;
  };
}

export const translations: Record<Locale, T> = {
  en: {
    nav: {
      demos: "Demos",
      howItWorks: "How it works",
      contact: "Contact",
      bookCall: "Book a call",
    },
    hero: {
      badge: "AI Agents for Local Business",
      h1: ["Your Business,", "Answered 24/7."],
      subtitle:
        "AI agents that know your business inside out — booking appointments, answering questions, and capturing leads in ",
      subtitleHighlight: "any language your customers speak.",
      subtitleEnd: " Never asleep, never clueless.",
      cta1: "See a Live Demo",
      cta2: "Book a Call",
      socialProof: "Local businesses",
      socialProofSuffix: " already running",
      scroll: "Scroll",
    },
    problem: {
      badge: "The Problem",
      title: "Every missed call is a lost customer.",
      cards: [
        {
          suffix: "%",
          label: "AFTER HOURS",
          title: "After-hours silence costs you customers",
          desc: "Most inquiries come in evenings and weekends — when no one's answering the phone.",
        },
        {
          suffix: "+ langs",
          label: "LANGUAGE GAP",
          title: "Any language, one agent",
          desc: "Finnish, Swedish, Latvian, or any other — your staff can't speak every customer's language.",
        },
        {
          suffix: "%",
          label: "GENERIC BOTS",
          title: "Bots that shrug when it matters",
          desc: "Most chatbots freeze the moment a question isn't in their script.",
        },
      ],
    },
    howItWorks: {
      badge: "Process",
      title: "How it works.",
      steps: [
        {
          title: "We learn your business",
          desc: "A short interview and your existing materials become your agent's full knowledge base.",
        },
        {
          title: "We build your agent",
          desc: "Live in 3–5 days, trained on your services, prices, and policies.",
        },
        {
          title: "It works around the clock",
          desc: "Books appointments, answers questions, captures leads — in any language, 24/7.",
        },
      ],
    },
    differentiator: {
      badge: "Why AGENTIC",
      title: "Not another chatbot that shrugs.",
      col1: "Generic chatbots",
      col2: "AGENTIC",
      items: [
        { bad: "Guesses when it doesn't know", good: "Says 'let me check' and follows up" },
        { bad: "One language, one script", good: "Any language your client writes in — automatically" },
        { bad: "Just chats", good: "Books, captures leads, takes action" },
        { bad: "Static after setup", good: "Gets smarter every week from real questions" },
      ],
    },
    demos: {
      badge: "Live Demos",
      title: "See it for yourself.",
      subtitle: "Each agent is trained for a specific industry — your business, your rules, your language.",
      industries: [
        { name: "Real Estate", desc: "Answers property questions, schedules viewings, and captures buyer info — 24/7." },
        { name: "Beauty Salon", desc: "Books appointments, shares pricing, and handles rescheduling in any language.", tagline: "Booking, availability, price list — in any language" },
        { name: "Restaurant", desc: "Takes reservations, answers menu questions, and confirms booking details.", tagline: "Reservations, menu questions, opening hours" },
        { name: "Dental Clinic", desc: "Books consultations, explains procedures, and sends reminders automatically.", tagline: "Appointments, pricing, FAQ — no medical advice" },
      ],
      comingSoon: "Demo coming soon",
      tryDemo: "Try the demo",
      tryLiveDemo: "Try live demo",
      getDemo: "Get free demo",
      liveBadge: "Live",
      chatBtn: "Chat",
      voiceBtn: "Voice",
    },
    cta: {
      badge: "Ready to start?",
      title: "Ready to stop losing customers to a missed call?",
      subtitle:
        "Let's talk about your business. In 30 minutes we'll show you what an agent built specifically for you looks like — no commitment required.",
      button: "Book a Free Consultation",
      emailPrefix: "or write us at",
      badges: ["Live in 3–5 days", "No code required", "Works in any language"],
    },
    footer: {
      tagline: "AI agents for local businesses",
      getInTouch: "Get in touch",
      rights: "All rights reserved.",
      location: "Tallinn, Estonia",
    },
  },

  ru: {
    nav: {
      demos: "Демо",
      howItWorks: "Как это работает",
      contact: "Контакт",
      bookCall: "Записаться",
    },
    hero: {
      badge: "ИИ-агенты для малого бизнеса",
      h1: ["Ваш бизнес,", "на связи 24/7."],
      subtitle:
        "ИИ-агенты, которые знают ваш бизнес изнутри — бронируют визиты, отвечают на вопросы и собирают контакты на ",
      subtitleHighlight: "любом языке ваших клиентов.",
      subtitleEnd: " Никогда не спит, всегда в теме.",
      cta1: "Смотреть демо",
      cta2: "Записаться на звонок",
      socialProof: "Местные бизнесы",
      socialProofSuffix: " уже работают",
      scroll: "Листайте",
    },
    problem: {
      badge: "Проблема",
      title: "Каждый пропущенный звонок — потерянный клиент.",
      cards: [
        {
          suffix: "%",
          label: "ВНЕ РАБОЧИХ ЧАСОВ",
          title: "Тишина после закрытия обходится дорого",
          desc: "Большинство обращений приходит вечером и в выходные — когда никто не отвечает на телефон.",
        },
        {
          suffix: "+ яз.",
          label: "ЯЗЫКОВОЙ БАРЬЕР",
          title: "Любой язык — один агент",
          desc: "Финский, шведский, латышский и любой другой — ваши сотрудники не говорят на всех языках клиентов.",
        },
        {
          suffix: "%",
          label: "ШАБЛОННЫЕ БОТЫ",
          title: "Боты теряются в нестандартных вопросах",
          desc: "Большинство чат-ботов зависают, как только вопрос не вписывается в скрипт.",
        },
      ],
    },
    howItWorks: {
      badge: "Процесс",
      title: "Как это работает.",
      steps: [
        {
          title: "Изучаем ваш бизнес",
          desc: "Короткое интервью и ваши материалы превращаются в полную базу знаний для агента.",
        },
        {
          title: "Создаём агента",
          desc: "Запуск за 3–5 дней, обучен на ваших услугах, ценах и правилах.",
        },
        {
          title: "Работает круглосуточно",
          desc: "Записывает на приём, отвечает на вопросы, собирает контакты — на любом языке, 24/7.",
        },
      ],
    },
    differentiator: {
      badge: "Почему AGENTIC",
      title: "Не очередной бот, который пожимает плечами.",
      col1: "Обычные чат-боты",
      col2: "AGENTIC",
      items: [
        { bad: "Угадывает, когда не знает ответа", good: "Говорит «уточню» и возвращается с ответом" },
        { bad: "Один язык, один скрипт", good: "Любой язык клиента — автоматически" },
        { bad: "Только переписывается", good: "Записывает, собирает контакты, действует" },
        { bad: "Статичен после настройки", good: "Становится умнее каждую неделю от реальных вопросов" },
      ],
    },
    demos: {
      badge: "Живые демо",
      title: "Убедитесь сами.",
      subtitle: "Каждый агент обучен под конкретную отрасль — ваш бизнес, ваши правила, ваш язык.",
      industries: [
        { name: "Недвижимость", desc: "Отвечает на вопросы об объектах, записывает на просмотры и собирает контакты покупателей." },
        { name: "Салон красоты", desc: "Записывает на процедуры, сообщает цены и переносит записи на любом языке.", tagline: "Запись, расписание, прайс — на любом языке" },
        { name: "Ресторан", desc: "Принимает брони, отвечает на вопросы по меню и подтверждает детали.", tagline: "Бронирование, меню, часы работы" },
        { name: "Стоматология", desc: "Записывает на консультации, объясняет процедуры и отправляет напоминания.", tagline: "Запись, цены, FAQ — без медицинских советов" },
      ],
      comingSoon: "Демо скоро появится",
      tryDemo: "Попробовать демо",
      tryLiveDemo: "Живое демо",
      getDemo: "Бесплатное демо",
      liveBadge: "Live",
      chatBtn: "Чат",
      voiceBtn: "Звонок",
    },
    cta: {
      badge: "Готовы начать?",
      title: "Готовы перестать терять клиентов из-за пропущенных звонков?",
      subtitle:
        "Давайте поговорим о вашем бизнесе. За 30 минут мы покажем, как будет выглядеть агент, созданный именно для вас — без каких-либо обязательств.",
      button: "Записаться на бесплатную консультацию",
      emailPrefix: "или напишите нам на",
      badges: ["Запуск за 3–5 дней", "Без программирования", "Работает на любом языке"],
    },
    footer: {
      tagline: "ИИ-агенты для малого бизнеса",
      getInTouch: "Связаться",
      rights: "Все права защищены.",
      location: "Таллинн, Эстония",
    },
  },

  et: {
    nav: {
      demos: "Demod",
      howItWorks: "Kuidas see töötab",
      contact: "Kontakt",
      bookCall: "Broneeri kõne",
    },
    hero: {
      badge: "AI-agendid kohalikele ettevõtetele",
      h1: ["Teie ettevõte,", "vastab 24/7."],
      subtitle:
        "AI-agendid, kes tunnevad teie äri seestpoolt — broneerivad kohtumisi, vastavad küsimustele ja koguvad kontakte ",
      subtitleHighlight: "teie klientide valitud keeles.",
      subtitleEnd: " Mitte kunagi magab, mitte kunagi teadmatu.",
      cta1: "Vaata live-demo",
      cta2: "Broneeri kõne",
      socialProof: "Kohalikud ettevõtted",
      socialProofSuffix: " töötavad juba",
      scroll: "Keri",
    },
    problem: {
      badge: "Probleem",
      title: "Iga vastamata kõne on kaotatud klient.",
      cards: [
        {
          suffix: "%",
          label: "VÄLJASPOOL TÖÖAEGA",
          title: "Vaikus pärast sulgemist maksab kliente",
          desc: "Enamik päringuid tuleb õhtuti ja nädalavahetustel — kui keegi ei vasta telefonile.",
        },
        {
          suffix: "+ keelt",
          label: "KEELEBARJÄÄR",
          title: "Iga keel, üks agent",
          desc: "Soome, rootsi, läti või muu — teie töötajad ei räägi kõigi klientide keelt.",
        },
        {
          suffix: "%",
          label: "TAVALISED BOTID",
          title: "Botid, kes tarduvad keeruliste küsimuste ees",
          desc: "Enamik vestlusroboteid hangub kohe, kui küsimus pole nende skriptis.",
        },
      ],
    },
    howItWorks: {
      badge: "Protsess",
      title: "Kuidas see töötab.",
      steps: [
        {
          title: "Õpime tundma teie äri",
          desc: "Lühike intervjuu ja teie olemasolevad materjalid muutuvad agendi täielikuks teadmistebaasiks.",
        },
        {
          title: "Loome teie agendi",
          desc: "Töötab 3–5 päevaga, koolitatud teie teenuste, hindade ja reeglite põhjal.",
        },
        {
          title: "Töötab ööpäevaringselt",
          desc: "Broneerib kohtumisi, vastab küsimustele, kogub kontakte — igas keeles, 24/7.",
        },
      ],
    },
    differentiator: {
      badge: "Miks AGENTIC",
      title: "Mitte veel üks vestlusrobot, kes kehitab õlgu.",
      col1: "Tavalised vestlusrobotid",
      col2: "AGENTIC",
      items: [
        { bad: "Arvab, kui ei tea vastust", good: "Ütleb 'vaatan järgi' ja vastab hiljem" },
        { bad: "Üks keel, üks skript", good: "Iga kliendi keel — automaatselt" },
        { bad: "Ainult vestleb", good: "Broneerib, kogub kontakte, tegutseb" },
        { bad: "Staatiline pärast seadistamist", good: "Muutub iga nädalaga targemaks" },
      ],
    },
    demos: {
      badge: "Live-demod",
      title: "Veendu ise.",
      subtitle: "Iga agent on koolitatud konkreetsele valdkonnale — teie äri, teie reeglid, teie keel.",
      industries: [
        { name: "Kinnisvara", desc: "Vastab kinnisvaraküsimustele, planeerib vaatamisi ja kogub ostjate kontakte." },
        { name: "Ilusalong", desc: "Broneerib aegu, jagab hindu ja haldab ümberplaneerimisi igas keeles.", tagline: "Broneerimine, ajakava, hinnakiri — igas keeles" },
        { name: "Restoran", desc: "Võtab reservatsioone vastu, vastab menüüküsimustele ja kinnitab broneering.", tagline: "Reservatsioonid, menüü, lahtiolekuajad" },
        { name: "Hambakliinik", desc: "Broneerib konsultatsioone, selgitab protseduure ja saadab meeldetuletusi.", tagline: "Kohtumised, hinnad, KKK — ilma meditsiiniliste nõuanneteta" },
      ],
      comingSoon: "Demo tulekul",
      tryDemo: "Proovi demot",
      tryLiveDemo: "Proovi live-demot",
      getDemo: "Tasuta demo",
      liveBadge: "Live",
      chatBtn: "Vestlus",
      voiceBtn: "Kõne",
    },
    cta: {
      badge: "Valmis alustama?",
      title: "Valmis lõpetama klientide kaotamist vastamata kõnede tõttu?",
      subtitle:
        "Räägime teie ärist. 30 minutiga näitame, kuidas näeks välja just teie jaoks loodud agent — ilma igasuguste kohustuseta.",
      button: "Broneeri tasuta konsultatsioon",
      emailPrefix: "või kirjutage meile",
      badges: ["Töötab 3–5 päevaga", "Koodi pole vaja", "Töötab igas keeles"],
    },
    footer: {
      tagline: "AI-agendid kohalikele ettevõtetele",
      getInTouch: "Võtke ühendust",
      rights: "Kõik õigused kaitstud.",
      location: "Tallinn, Eesti",
    },
  },
};

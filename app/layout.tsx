import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "./components/CustomCursor";
import { LanguageProvider } from "./i18n/LanguageContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vorvex.tech"),
  title: "Vorvex — AI Agents for Local Business | Chatbot & Voice Assistant",
  description:
    "AI agents that book appointments, answer questions and capture leads — 24/7, in Estonian, Russian and English. For restaurants, salons, real estate and dental clinics.",
  keywords: [
    "AI chatbot", "AI assistant for business", "chatbot Estonia",
    "AI агент для бизнеса", "AI бронирование", "vorvex",
    "voice assistant", "AI for restaurant", "AI for salon",
  ],
  icons: { apple: "/vorvex-logo.jpg" },
  alternates: {
    canonical: "https://vorvex.tech",
    languages: {
      en: "https://vorvex.tech",
      ru: "https://vorvex.tech/?lang=ru",
      et: "https://vorvex.tech/?lang=et",
    },
  },
  openGraph: {
    type: "website",
    url: "https://vorvex.tech",
    title: "Vorvex — AI Agents for Local Business",
    description:
      "AI agents that book appointments, answer questions and capture leads — 24/7, in Estonian, Russian and English.",
    siteName: "Vorvex",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vorvex AI Agent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vorvex — AI Agents for Local Business",
    description: "AI chatbot & voice assistant for restaurants, salons, real estate and dental — 24/7.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vorvex OÜ",
              url: "https://vorvex.tech",
              logo: "https://vorvex.tech/logo32.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+37256969240",
                email: "vorvex.tech@gmail.com",
                contactType: "customer support",
              },
              areaServed: "EE",
              foundingLocation: "Tallinn, Estonia",
              sameAs: [],
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Vorvex AI Agent",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "AI chatbot and voice assistant for local businesses — restaurants, beauty salons, real estate agencies and dental clinics. Works 24/7 in Estonian, Russian and English.",
              offers: {
                "@type": "Offer",
                price: "350",
                priceCurrency: "EUR",
                priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" },
              },
              provider: { "@type": "Organization", name: "Vorvex OÜ", url: "https://vorvex.tech" },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How does the Vorvex AI agent work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You share your business information — menu, services, prices, hours. We set up your AI agent within 48 hours. It then handles customer questions, bookings and lead capture automatically, 24/7.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What languages does Vorvex support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Vorvex AI agents communicate in Estonian, Russian and English — automatically detecting the customer's language.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much does a Vorvex AI agent cost?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Pricing starts from €350/month, which includes setup, hosting and a high usage allowance. Contact us for a custom quote.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can Vorvex AI book appointments automatically?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The AI agent can collect booking details from customers and save them directly to your calendar or management system.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which businesses can use Vorvex?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Vorvex works for any local business: restaurants, beauty salons, real estate agencies, dental clinics, spas, gyms and more.",
                  },
                },
              ],
            },
          ]) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <LanguageProvider>
          <CustomCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

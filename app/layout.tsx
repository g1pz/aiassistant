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
  title: "Vorvex — AI Agents for Local Business",
  description:
    "AI agents that know your business inside out — booking appointments, answering questions, and capturing leads in Estonian, Russian, and English. Never asleep, never clueless.",
  keywords: ["AI agent", "chatbot", "Estonia", "local business", "automation"],
  icons: {
    apple: "/vorvex-logo.jpg",
  },
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

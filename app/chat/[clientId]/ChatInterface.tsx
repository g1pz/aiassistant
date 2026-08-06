"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import type { Listing, Service } from "@/lib/clients/index";
import { PropertyCard } from "./PropertyCard";
import { ServiceCard } from "./ServiceCard";
import { MenuItemCard } from "./MenuItemCard";
import { VapiCallButton } from "./VapiCallButton";
import { BookingCard, type BookingData } from "./BookingCard";

type Lang = "en" | "ru" | "et";

interface Message {
  role: "user" | "assistant";
  content: string;
  listingIds?: string[];
  serviceIds?: string[];
  bookingData?: BookingData;
}

const DEFAULT_WELCOME: Record<Lang, string> = {
  ru: "Привет! Чем могу помочь? 👋",
  et: "Tere! Kuidas saan aidata? 👋",
  en: "Hi! How can I help you today? 👋",
};

const DEFAULT_PLACEHOLDER: Record<Lang, string> = {
  en: "Ask a question or type your request…",
  ru: "Задайте вопрос или напишите запрос…",
  et: "Esitage küsimus või kirjutage päring…",
};

function getBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const l = navigator.language.toLowerCase().slice(0, 2);
  return (l === "ru" || l === "et") ? l : "en";
}

function detectLang(text: string): Lang | null {
  if (/[а-яёА-ЯЁ]/.test(text)) return "ru";
  // õ/Õ is unique to Estonian — other languages (Swedish, German, Finnish) don't use it
  if (/[õÕ]/.test(text)) return "et";
  if (/[a-zA-Z]/.test(text)) return "en";
  return null;
}

function extractListings(text: string): { content: string; listingIds: string[] } {
  const match = text.match(/LISTING_IDS?:\s*([\w-]+(?:,\s*[\w-]+)*)/i);
  if (!match) return { content: text.trim(), listingIds: [] };
  const listingIds = match[1].split(",").map((s) => s.trim()).filter(Boolean);
  const content = text.replace(/\s*LISTING_IDS?:\s*[\w,\s-]+/gi, "").trim();
  return { content, listingIds };
}

function extractServices(text: string): { content: string; serviceIds: string[] } {
  const match = text.match(/SERVICE_IDS?:\s*([\w-]+(?:,\s*[\w-]+)*)/i);
  if (!match) return { content: text.trim(), serviceIds: [] };
  const serviceIds = match[1].split(",").map((s) => s.trim()).filter(Boolean);
  const content = text.replace(/\s*SERVICE_IDS?:\s*[\w,\s-]+/gi, "").trim();
  return { content, serviceIds };
}

function extractBooking(text: string): { content: string; bookingData: BookingData | null } {
  const match = text.match(/BOOKING_SUMMARY:\s*([^\n]+)/i);
  if (!match) return { content: text.trim(), bookingData: null };
  const pairs = match[1].split("|").map((s) => s.trim());
  const data: Record<string, string> = {};
  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim();
    const val = pair.slice(eqIdx + 1).trim();
    data[key] = val;
  }
  const content = text.replace(/\s*BOOKING_SUMMARY:\s*[^\n]*/i, "").trim();
  return { content, bookingData: data as BookingData };
}

interface ChatInterfaceProps {
  clientId: string;
  clientName: string;
  listings: Listing[];
  services?: Service[];
  accent?: string;
  accent2?: string;
  welcomeMessages?: Record<string, string>;
  salonPhone?: string;
  phone?: string;
  clientType?: string;
  vapiAssistantId?: string;
}

const CALL_BANNER: Record<Lang, { heading: string; sub: string; orPhone: string }> = {
  en: { heading: "Prefer to speak? Call our AI host Sofia", sub: "Real conversation — no hold music, no scripts", orPhone: "or call directly" },
  ru: { heading: "Хотите поговорить? Позвоните хосту Sofie", sub: "Живой разговор — без ожидания и скриптов", orPhone: "или позвоните напрямую" },
  et: { heading: "Eelistate rääkida? Helistage AI-peremehele Sofia", sub: "Päris vestlus — ilma ootamise ja skriptideta", orPhone: "või helistage otse" },
};

export function ChatInterface({
  clientId,
  clientName,
  listings,
  services = [],
  accent = "#4F8CFF",
  accent2 = "#A855F7",
  welcomeMessages,
  salonPhone,
  phone,
  clientType,
  vapiAssistantId,
}: ChatInterfaceProps) {
  const effectivePhone = phone ?? salonPhone ?? '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [chatLang, setChatLang] = useState<Lang>("en");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track slots booked in this session to avoid duplicate /api/book calls
  const bookedSlotsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const lang = getBrowserLang();
    setChatLang(lang);
    const welcome =
      welcomeMessages?.[lang] ??
      DEFAULT_WELCOME[lang];
    setMessages([{ role: "assistant", content: welcome }]);
  }, [welcomeMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  async function submitMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const detected = detectLang(text);
    if (detected) setChatLang(detected);

    setRateLimitError(null);
    const userMessage: Message = { role: "user", content: text.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const apiMessages = nextMessages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`/api/chat/${clientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setMessages((prev) => prev.slice(0, -1));
        setRateLimitError(data.error ?? "You're sending messages too fast. Please wait a moment.");
        setIsStreaming(false);
        return;
      }

      if (!res.ok || !res.body) {
        setMessages((prev) => prev.slice(0, -1));
        setRateLimitError("Service temporarily unavailable. Please try again.");
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Accumulate locally so we can parse OUTSIDE of setMessages
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }

      // Parse markers from locally accumulated content — no React async issues
      const lResult = extractListings(accumulated);
      const sResult = extractServices(lResult.content);
      const bResult = extractBooking(sResult.content);
      const cleanContent = bResult.content;
      const capturedBooking = bResult.bookingData;

      const detectedLang = detectLang(cleanContent);
      if (detectedLang) setChatLang(detectedLang);

      // Single setMessages to apply cleaned content + structured data
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role !== "assistant") return updated;
        updated[updated.length - 1] = {
          ...last,
          content: cleanContent,
          listingIds: lResult.listingIds,
          serviceIds: sResult.serviceIds,
          bookingData: capturedBooking ?? undefined,
        };
        return updated;
      });

      // Now capturedBooking is set synchronously — safe to use here
      if (capturedBooking) {
        const slotKey = `${capturedBooking.date_iso}|${capturedBooking.time}|${capturedBooking.service}`;
        if (!bookedSlotsRef.current.has(slotKey)) {
          try {
            const bookRes = await fetch("/api/book", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId, clientName, bookingData: capturedBooking }),
            });
            if (bookRes.ok) {
              bookedSlotsRef.current.add(slotKey);
            } else if (bookRes.status === 409) {
              const conflictMsg =
                chatLang === "ru" ? "⚠️ Это время только что заняли. Пожалуйста, выберите другое — бот поможет найти свободный слот." :
                chatLang === "et" ? "⚠️ See aeg on just broneeritud. Palun vali muu kellaaeg — bot aitab leida vaba aja." :
                "⚠️ This slot was just taken. Please ask for another time — the bot will find the next available slot.";
              setMessages((prev) => [...prev, { role: "assistant", content: conflictMsg }]);
            }
          } catch {/* non-fatal */}
        }
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setRateLimitError("Connection error. Please try again.");
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    setInput("");
    submitMessage(text);
  }

  function clearChat() {
    const lang = getBrowserLang();
    setChatLang(lang);
    const welcome = welcomeMessages?.[lang] ?? DEFAULT_WELCOME[lang];
    setMessages([{ role: "assistant", content: welcome }]);
    setRateLimitError(null);
    bookedSlotsRef.current.clear();
    inputRef.current?.focus();
  }

  const placeholder = DEFAULT_PLACEHOLDER[chatLang];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#0A0E17", fontFamily: "system-ui, sans-serif" }}
    >
      <div className="flex flex-col flex-1 mx-auto w-full" style={{ maxWidth: 720 }}>
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 py-4 sticky top-0 z-20"
          style={{
            background: "rgba(10,14,23,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
              style={{ background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff" }}
            >
              {clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                className="font-semibold text-sm leading-tight"
                style={{ color: "#F5F7FA", fontFamily: "var(--font-space-grotesk, system-ui)" }}
              >
                {clientName}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                <span className="text-xs" style={{ color: "#94A3B8" }}>Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={clearChat}
            title="New chat"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "5px 10px",
              color: "#94A3B8",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            New chat
          </button>
        </header>

        {/* Voice call banner — restaurant only */}
        {clientType === 'restaurant' && (effectivePhone || vapiAssistantId) && (
          <div
            style={{
              background: `linear-gradient(135deg, ${accent}10, ${accent2}08)`,
              borderBottom: `1px solid ${accent}28`,
              padding: '14px 20px',
            }}
          >
            <div
              style={{
                maxWidth: 680,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: '#F5F7FA', fontSize: 13, fontWeight: 600 }}>
                  {CALL_BANNER[chatLang].heading}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>
                  {CALL_BANNER[chatLang].sub}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {vapiAssistantId && (
                  <VapiCallButton
                    assistantId={vapiAssistantId}
                    accent={accent}
                    accent2={accent2}
                    lang={chatLang}
                  />
                )}
                {effectivePhone && (
                  <a
                    href={`tel:${effectivePhone.replace(/\s/g, '')}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 9999,
                      border: `1px solid ${accent}50`,
                      color: accent, fontSize: 13, fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}15`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    📞 {effectivePhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => {
            const matchedListings = (msg.listingIds ?? [])
              .map((id) => listings.find((l) => l.id === id))
              .filter((l): l is Listing => !!l);

            const matchedServices = (msg.serviceIds ?? [])
              .map((id) => services.find((s) => s.id === id))
              .filter((s): s is Service => !!s);

            return (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff" }}
                  >
                    {clientName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Text bubble */}
                  {(msg.content !== "" || (msg.role === "assistant" && i === messages.length - 1 && isStreaming)) && (
                    <div
                      style={{
                        ...(msg.role === "assistant"
                          ? { background: "rgba(18,21,31,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#F5F7FA", borderRadius: "4px 18px 18px 18px" }
                          : { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", borderRadius: "18px 4px 18px 18px" }),
                        padding: "10px 14px",
                        fontSize: "0.9rem",
                        lineHeight: "1.55",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.content === "" && isStreaming && i === messages.length - 1 ? (
                        <TypingDots accent={accent} />
                      ) : (
                        msg.content
                      )}
                      {msg.content !== "" && isStreaming && i === messages.length - 1 && (
                        <span
                          style={{
                            display: "inline-block", width: 2, height: "1em",
                            background: accent, marginLeft: 2, verticalAlign: "text-bottom",
                            animation: "blink 0.9s step-end infinite",
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Property cards */}
                  {matchedListings.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {matchedListings.map((listing) => (
                        <PropertyCard
                          key={listing.id}
                          listing={listing}
                          lang={chatLang}
                          onBook={(msg) => submitMessage(msg)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Service / menu item cards */}
                  {matchedServices.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {matchedServices.map((service) =>
                        clientType === 'restaurant' ? (
                          <MenuItemCard
                            key={service.id}
                            item={service}
                            lang={chatLang}
                            accent={accent}
                            accent2={accent2}
                            onAsk={(msg) => submitMessage(msg)}
                          />
                        ) : (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            lang={chatLang}
                            accent={accent}
                            accent2={accent2}
                            onBook={(msg) => submitMessage(msg)}
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* Booking confirmation card */}
                  {msg.bookingData && (
                    <BookingCard
                      data={msg.bookingData}
                      lang={chatLang}
                      accent={accent}
                      accent2={accent2}
                      salonPhone={effectivePhone || undefined}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {rateLimitError && (
            <div
              className="text-center text-sm py-2 px-4 rounded-xl mx-auto"
              style={{ color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", maxWidth: 380 }}
            >
              {rateLimitError}
            </div>
          )}

          <div ref={bottomRef} />
        </main>

        {/* Input */}
        <div
          className="px-4 py-4 sticky bottom-0"
          style={{
            background: "rgba(10,14,23,0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isStreaming}
              style={{
                flex: 1, background: "rgba(18,21,31,0.8)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9999,
                padding: "11px 18px", color: "#F5F7FA", fontSize: "0.9rem",
                outline: "none", transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = `${accent}80`)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              style={{
                width: 42, height: 42, borderRadius: "50%",
                background: isStreaming || !input.trim()
                  ? "rgba(79,140,255,0.25)"
                  : `linear-gradient(135deg,${accent},${accent2})`,
                border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, cursor: isStreaming || !input.trim() ? "not-allowed" : "pointer", transition: "opacity 0.2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <p className="text-center mt-2 text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
            Demo bot — powered by AGENTIC
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce-dot { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        input::placeholder { color: rgba(148,163,184,0.5); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

function TypingDots({ accent }: { accent: string }) {
  return (
    <span className="flex gap-1 items-center" style={{ height: "1.2em" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block", width: 6, height: 6, borderRadius: "50%",
            background: accent,
            animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended';
type Lang = 'en' | 'ru' | 'et';

const TEXT: Record<Lang, {
  callBtn: string;
  connecting: string;
  active: string;
  ended: string;
  callAgain: string;
  switchChat: string;
  mic: string;
  aiHost: string;
  demoLabel: string;
  backChat: string;
}> = {
  en: {
    callBtn: 'Start voice call',
    connecting: 'Connecting…',
    active: '',
    ended: 'Call ended',
    callAgain: 'Call again',
    switchChat: 'Switch to chat',
    mic: 'Uses your microphone',
    aiHost: 'AI Host',
    demoLabel: 'DEMO · AI Voice',
    backChat: 'Chat',
  },
  ru: {
    callBtn: 'Начать голосовой звонок',
    connecting: 'Подключение…',
    active: '',
    ended: 'Звонок завершён',
    callAgain: 'Позвонить снова',
    switchChat: 'Перейти в чат',
    mic: 'Используется микрофон',
    aiHost: 'ИИ-хост',
    demoLabel: 'ДЕМО · Голосовой ИИ',
    backChat: 'Чат',
  },
  et: {
    callBtn: 'Alusta häälkõnet',
    connecting: 'Ühendamine…',
    active: '',
    ended: 'Kõne lõpetatud',
    callAgain: 'Helista uuesti',
    switchChat: 'Mine vestlusesse',
    mic: 'Kasutab mikrofoni',
    aiHost: 'AI-peremees',
    demoLabel: 'DEMO · AI Hääl',
    backChat: 'Vestlus',
  },
};

function getUserLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('vorvex-locale');
  if (saved === 'ru' || saved === 'et' || saved === 'en') return saved;
  const l = navigator.language.toLowerCase().slice(0, 2);
  return l === 'ru' ? 'ru' : l === 'et' ? 'et' : 'en';
}

interface CallInterfaceProps {
  clientId: string;
  clientName: string;
  hostName: string;
  accent: string;
  accent2: string;
  vapiAssistantId: string;
  welcomeMessages?: Record<string, string>;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function CallInterface({
  clientId,
  clientName,
  hostName,
  accent,
  accent2,
  vapiAssistantId,
  welcomeMessages,
}: CallInterfaceProps) {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'active') {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (status === 'idle' || status === 'ended') setDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  useEffect(() => { setLang(getUserLang()); }, []);

  useEffect(() => {
    return () => { vapiRef.current?.stop?.(); };
  }, []);

  async function startCall() {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_KEY;
    if (!publicKey || !vapiAssistantId) {
      setError('Vapi is not configured. Check .env.local.');
      return;
    }
    setError(null);
    setStatus('connecting');
    try {
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;
      vapi.on('call-start', () => setStatus('active'));
      vapi.on('call-end', () => { setStatus('ended'); vapiRef.current = null; });
      vapi.on('error', (e: unknown) => {
        console.error('[Vapi]', e);
        setStatus('idle');
        setError('Could not start the call. Please check microphone permissions.');
        vapiRef.current = null;
      });

      // Fetch only the greeting — system prompt stays in Vapi Dashboard, never sent to browser
      const cfgToken = process.env.NEXT_PUBLIC_CONFIG_TOKEN ?? '';
      const cfgRes = await fetch(`/api/vapi/session-config?clientId=${clientId}&lang=${lang}&token=${cfgToken}`);
      const { firstMessage } = cfgRes.ok ? await cfgRes.json() : {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });

      await (vapi as any).start(vapiAssistantId, {
        ...(firstMessage ? { firstMessage } : {}),
        variableValues: { clientId, lang, currentDate },
        model: { maxTokens: 1500 },
      });
    } catch (err) {
      console.error('[Vapi]', err);
      setStatus('idle');
      setError('Could not start the call. Please try again.');
    }
  }

  function endCall() {
    vapiRef.current?.stop?.();
    setStatus('ended');
    vapiRef.current = null;
  }

  function toggleMute() {
    if (!vapiRef.current) return;
    const next = !muted;
    vapiRef.current.setMuted?.(next);
    setMuted(next);
  }

  const t = TEXT[lang];
  const statusText =
    status === 'idle' ? t.callBtn :
    status === 'connecting' ? t.connecting :
    status === 'active' ? formatDuration(duration) :
    t.ended;

  const statusColor =
    status === 'active' ? '#22C55E' :
    status === 'connecting' ? accent :
    '#94A3B8';

  return (
    <div
      style={{
        minHeight: '100svh',
        background: '#0A0E17',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0 48px',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at 50% 20%, ${accent}18 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '20px 20px 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link
          href={`/chat/${clientId}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#94A3B8', textDecoration: 'none',
            fontSize: 14, fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 9999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t.backChat}
        </Link>

        <div
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontSize: 13, color: '#94A3B8',
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22C55E',
              boxShadow: '0 0 6px #22C55E',
              display: 'inline-block',
            }}
          />
          {t.demoLabel}
        </div>
      </div>

      {/* Center — avatar + info */}
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 16, position: 'relative', zIndex: 1,
          marginTop: 60,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 140, height: 140, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 56, fontWeight: 700, color: '#fff',
            boxShadow: `0 0 60px ${accent}44, 0 0 120px ${accent}18`,
            position: 'relative',
          }}
        >
          {hostName.charAt(0)}

          {/* Pulse rings when active */}
          {status === 'active' && (
            <>
              <span style={{
                position: 'absolute', inset: -12, borderRadius: '50%',
                border: `2px solid ${accent}40`,
                animation: 'ring-pulse 2s ease-out infinite',
              }} />
              <span style={{
                position: 'absolute', inset: -26, borderRadius: '50%',
                border: `2px solid ${accent}20`,
                animation: 'ring-pulse 2s ease-out 0.5s infinite',
              }} />
            </>
          )}
        </div>

        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 28, fontWeight: 700, color: '#F5F7FA',
              fontFamily: 'var(--font-space-grotesk, system-ui)',
              letterSpacing: '-0.02em',
            }}
          >
            {hostName}
          </div>
          <div style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
            {t.aiHost} · {clientName}
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            fontSize: 15, fontWeight: 600, color: statusColor,
            fontFamily: 'var(--font-jetbrains-mono, monospace)',
            minHeight: 22,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {status === 'connecting' && (
            <span
              style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${accent}50`,
                borderTopColor: accent,
                animation: 'spin 0.8s linear infinite',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          )}
          {statusText}
        </div>

        {error && (
          <div
            style={{
              fontSize: 12, color: '#F87171', maxWidth: 280,
              textAlign: 'center', lineHeight: 1.5,
              padding: '8px 16px', borderRadius: 10,
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, position: 'relative', zIndex: 1 }}>

        {status === 'idle' && (
          <button
            onClick={startCall}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 32px rgba(34,197,94,0.6)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 0 48px rgba(34,197,94,0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(34,197,94,0.6)';
            }}
          >
            <PhoneIcon />
          </button>
        )}

        {status === 'connecting' && (
          <button
            onClick={endCall}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#EF4444', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.85,
            }}
          >
            <PhoneEndIcon />
          </button>
        )}

        {status === 'active' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {/* Mute */}
            <button
              onClick={toggleMute}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: muted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${muted ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.12)'}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              {muted ? <MicOffIcon /> : <MicIcon />}
            </button>

            {/* End call */}
            <button
              onClick={endCall}
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: '#EF4444', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px rgba(239,68,68,0.5)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <PhoneEndIcon />
            </button>

            {/* Speaker placeholder */}
            <button
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.5,
              }}
              disabled
            >
              <SpeakerIcon />
            </button>
          </div>
        )}

        {status === 'ended' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => { setStatus('idle'); setError(null); setDuration(0); }}
              style={{
                padding: '12px 32px', borderRadius: 9999,
                background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 15, fontWeight: 600,
                boxShadow: `0 0 24px ${accent}40`,
              }}
            >
              {t.callAgain}
            </button>
            <Link
              href={`/chat/${clientId}`}
              style={{
                color: '#64748B', fontSize: 13,
                textDecoration: 'none',
                padding: '8px 20px', borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.switchChat}
            </Link>
          </div>
        )}

        {(status === 'idle' || status === 'connecting') && (
          <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.5)', marginTop: -16 }}>
            🎙️ {t.mic}
          </p>
        )}
      </div>

      <style>{`
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="white"/>
    </svg>
  );
}

function PhoneEndIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.32-2.67m-2.48-3.49a19.5 19.5 0 01-2.59-4.07 19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91M23 1L1 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

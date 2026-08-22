"use client";

import { useState, useRef, useEffect } from 'react';

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended';

type Lang = 'en' | 'ru' | 'et';

const TEXT: Record<Lang, {
  start: string;
  connecting: string;
  end: string;
  ended: string;
  callAgain: string;
  mic: string;
}> = {
  en: {
    start: 'Start voice call',
    connecting: 'Connecting…',
    end: 'End call',
    ended: 'Call ended',
    callAgain: 'Call again',
    mic: 'Uses your microphone',
  },
  ru: {
    start: 'Голосовой звонок',
    connecting: 'Подключение…',
    end: 'Завершить звонок',
    ended: 'Звонок завершён',
    callAgain: 'Позвонить снова',
    mic: 'Использует микрофон',
  },
  et: {
    start: 'Häälkõne',
    connecting: 'Ühendamine…',
    end: 'Lõpeta kõne',
    ended: 'Kõne lõpetatud',
    callAgain: 'Helista uuesti',
    mic: 'Kasutab mikrofoni',
  },
};

interface VapiCallButtonProps {
  assistantId: string;
  clientId: string;
  accent: string;
  accent2: string;
  lang?: Lang;
}

export function VapiCallButton({ assistantId, clientId, accent, accent2, lang = 'en' }: VapiCallButtonProps) {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vapiRef = useRef<any>(null);
  const t = TEXT[lang];

  useEffect(() => {
    return () => {
      vapiRef.current?.stop?.();
    };
  }, []);

  async function startCall() {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_KEY;
    if (!publicKey || !assistantId) {
      setError('Vapi is not configured yet. Check .env.local.');
      return;
    }

    setError(null);
    setStatus('connecting');

    try {
      // Dynamic import to keep Vapi SDK out of the SSR bundle
      const { default: Vapi } = await import('@vapi-ai/web');
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on('call-start', () => setStatus('active'));
      vapi.on('call-end', () => {
        setStatus('ended');
        vapiRef.current = null;
      });
      vapi.on('error', (e: unknown) => {
        console.error('[Vapi]', e);
        setStatus('idle');
        setError('Could not start the call. Please try again.');
        vapiRef.current = null;
      });

      const cfgToken = process.env.NEXT_PUBLIC_CONFIG_TOKEN ?? '';
      const cfgRes = await fetch(`/api/vapi/session-config?clientId=${clientId}&lang=${lang}&token=${cfgToken}`);
      const { firstMessage } = cfgRes.ok ? await cfgRes.json() : {};

      const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });

      await vapi.start(assistantId, {
        ...(firstMessage ? { firstMessage } : {}),
        variableValues: { clientId, lang, currentDate },
      });
    } catch (err) {
      console.error('[Vapi] start error:', err);
      setStatus('idle');
      setError('Could not start the call. Please try again.');
    }
  }

  function endCall() {
    vapiRef.current?.stop?.();
    setStatus('ended');
    vapiRef.current = null;
  }

  const isConnecting = status === 'connecting';
  const isActive     = status === 'active';
  const isEnded      = status === 'ended';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
      {isActive ? (
        <button
          onClick={endCall}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 9999,
            background: '#EF4444', border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {/* Pulsing red dot */}
          <span
            style={{
              width: 8, height: 8, borderRadius: '50%', background: '#fff',
              animation: 'vapi-pulse 1.4s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          {t.end}
        </button>
      ) : (
        <button
          onClick={isEnded ? () => { setStatus('idle'); setError(null); } : startCall}
          disabled={isConnecting}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 9999,
            background: isConnecting
              ? 'rgba(217,119,6,0.35)'
              : 'linear-gradient(135deg,#16a34a,#22c55e)',
            border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: isConnecting ? 'default' : 'pointer',
            transition: 'opacity 0.2s',
            opacity: isConnecting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => { if (!isConnecting) e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = isConnecting ? '0.7' : '1'; }}
        >
          {isConnecting ? (
            <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'vapi-spin 0.8s linear infinite', flexShrink: 0 }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.86 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.77 0h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isConnecting ? t.connecting : isEnded ? t.callAgain : t.start}
        </button>
      )}

      {!isActive && !isConnecting && !isEnded && (
        <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)' }}>
          🎙️ {t.mic}
        </span>
      )}

      {error && (
        <span style={{ fontSize: 11, color: '#F87171', maxWidth: 200, textAlign: 'right' }}>
          {error}
        </span>
      )}

      <style>{`
        @keyframes vapi-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes vapi-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

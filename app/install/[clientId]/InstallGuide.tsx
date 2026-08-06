"use client";

import { useState, useEffect } from "react";

interface InstallGuideProps {
  clientId: string;
  clientName: string;
}

export function InstallGuide({ clientId, clientName }: InstallGuideProps) {
  const [origin, setOrigin] = useState("https://your-domain.vercel.app");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const snippet = `<script\n  src="${origin}/widget.js"\n  data-client-id="${clientId}"\n  async>\n</script>`;

  function copySnippet() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0E17",
        color: "#F5F7FA",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4F8CFF,#A855F7)",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            🎉
          </div>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              marginBottom: 12,
            }}
          >
            Your AI Assistant is Ready
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16 }}>
            <strong style={{ color: "#F5F7FA" }}>{clientName}</strong> — install it on your website in 60 seconds.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
          {[
            { num: 1, title: "Copy the code", desc: "Click the button below to copy the embed snippet." },
            { num: 2, title: 'Paste it before </body> on your website', desc: "Works with any website — WordPress, Webflow, Wix, plain HTML." },
            { num: 3, title: "That's it", desc: "Your assistant goes live immediately. No reload needed." },
          ].map((step) => (
            <div key={step.num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#4F8CFF,#A855F7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  color: "#fff",
                }}
              >
                {step.num}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{step.title}</div>
                <div style={{ color: "#94A3B8", fontSize: 14 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Code block */}
        <div
          style={{
            background: "rgba(18,21,31,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <span style={{ color: "#94A3B8", fontSize: 12, fontFamily: "monospace" }}>
              Embed code
            </span>
            <button
              onClick={copySnippet}
              style={{
                background: copied ? "rgba(34,197,94,0.15)" : "rgba(79,140,255,0.15)",
                border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(79,140,255,0.3)"}`,
                color: copied ? "#22C55E" : "#4F8CFF",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "monospace",
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "16px",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#94A3B8",
              overflowX: "auto",
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#F87171" }}>&lt;script</span>
            {"\n  "}
            <span style={{ color: "#A855F7" }}>src</span>
            <span style={{ color: "#F5F7FA" }}>=</span>
            <span style={{ color: "#4F8CFF" }}>&quot;{origin}/widget.js&quot;</span>
            {"\n  "}
            <span style={{ color: "#A855F7" }}>data-client-id</span>
            <span style={{ color: "#F5F7FA" }}>=</span>
            <span style={{ color: "#4F8CFF" }}>&quot;{clientId}&quot;</span>
            {"\n  "}
            <span style={{ color: "#A855F7" }}>async</span>
            <span style={{ color: "#F87171" }}>&gt;</span>
            {"\n"}
            <span style={{ color: "#F87171" }}>&lt;/script&gt;</span>
          </pre>
        </div>

        {/* Preview button */}
        <a
          href={`/chat/${clientId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
            padding: "13px 0",
            background: "linear-gradient(135deg,#4F8CFF,#A855F7)",
            borderRadius: 9999,
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Preview your assistant
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}

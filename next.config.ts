import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "microphone=(self), camera=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://assets.calendly.com https://*.daily.co`,
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      "connect-src 'self' https://api.anthropic.com wss://api.vapi.ai https://*.vapi.ai https://*.daily.co wss://*.daily.co",
      "img-src 'self' data: blob: https://images.unsplash.com https://assets.calendly.com",
      "font-src 'self' https://fonts.gstatic.com",
      "worker-src blob: 'self'",
      "frame-src 'self' https://calendly.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

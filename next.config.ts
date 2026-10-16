import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 768, 1024, 1280, 1600, 2048],
    imageSizes: [160, 320, 480, 640],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://checkout.stripe.com; img-src 'self' data: blob:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://js.stripe.com https://plausible.io https://www.googletagmanager.com; connect-src 'self' https://api.stripe.com https://api.resend.com https://plausible.io https://www.google-analytics.com; frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; upgrade-insecure-requests",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")',
          },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;

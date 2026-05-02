/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ]
  },
}

// Wrap with Sentry if DSN is set — zero-config error monitoring
// Install: npm install @sentry/nextjs
// Then run: npx @sentry/wizard@latest -i nextjs
// Or manually: set NEXT_PUBLIC_SENTRY_DSN in .env.local
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    const { withSentryConfig } = require('@sentry/nextjs')
    module.exports = withSentryConfig(nextConfig, {
      silent: true,
      org: 'rapidfix',
      project: 'rapidfix-web',
    }, {
      widenClientFileUpload: true,
      transpileClientSDK: true,
      tunnelRoute: '/monitoring',
      hideSourceMaps: true,
      disableLogger: true,
    })
  } catch {
    // @sentry/nextjs not installed yet — run: npm install @sentry/nextjs
    module.exports = nextConfig
  }
} else {
  module.exports = nextConfig
}

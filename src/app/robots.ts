import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/admin-kavya/',
          '/profile',
          '/payment',
          '/api/',
          '/auth/',
          '/sso-callback',
        ],
      },
    ],
    sitemap: 'https://rapidfix.in/sitemap.xml',
  }
}

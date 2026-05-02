import { MetadataRoute } from 'next'

const BASE_URL = 'https://rapidfix.in'

const SERVICES = [
  'electrician',
  'plumber',
  'carpenter',
  'painter',
  'cleaner',
  'ac_repair',
]

const CITIES = [
  'rajkot',
  'ahmedabad',
  'surat',
  'vadodara',
  'jamnagar',
  'gandhinagar',
  'junagadh',
  'bhavnagar',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/careers`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/jobs/browse`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Service landing pages (6 services)
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // City × service pages (48 pages: 6 × 8)
  const cityServiceRoutes: MetadataRoute.Sitemap = SERVICES.flatMap((slug) =>
    CITIES.map((city) => ({
      url: `${BASE_URL}/services/${slug}/${city}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [...staticRoutes, ...serviceRoutes, ...cityServiceRoutes]
}

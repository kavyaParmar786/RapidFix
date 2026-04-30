import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Star, Shield, CheckCircle, ArrowRight, Clock } from 'lucide-react'

const SERVICES: Record<string, { label: string; emoji: string; desc: string; avgCost: string }> = {
  electrician: { label: 'Electrician', emoji: '⚡', desc: 'wiring, MCB installation, fan fitting, and all electrical repairs', avgCost: '₹300–₹1,500' },
  plumber: { label: 'Plumber', emoji: '🔧', desc: 'pipe repairs, tap fixing, drain cleaning, and bathroom fittings', avgCost: '₹250–₹1,200' },
  carpenter: { label: 'Carpenter', emoji: '🪚', desc: 'furniture repair, door fixing, wardrobe installation, and custom work', avgCost: '₹400–₹2,000' },
  painter: { label: 'Painter', emoji: '🎨', desc: 'interior and exterior painting, texture work, and touch-ups', avgCost: '₹8–₹18 per sq ft' },
  cleaner: { label: 'Cleaner', emoji: '🧹', desc: 'deep cleaning, sofa cleaning, kitchen cleaning, and move-in/out cleaning', avgCost: '₹500–₹3,000' },
  'ac-repair': { label: 'AC Repair', emoji: '❄️', desc: 'AC servicing, gas refilling, installation, and repairs', avgCost: '₹400–₹2,500' },
}

const CITIES: Record<string, { label: string; state: string }> = {
  rajkot: { label: 'Rajkot', state: 'Gujarat' },
  surat: { label: 'Surat', state: 'Gujarat' },
  ahmedabad: { label: 'Ahmedabad', state: 'Gujarat' },
  vadodara: { label: 'Vadodara', state: 'Gujarat' },
  mumbai: { label: 'Mumbai', state: 'Maharashtra' },
  pune: { label: 'Pune', state: 'Maharashtra' },
  delhi: { label: 'Delhi', state: 'Delhi' },
  bangalore: { label: 'Bangalore', state: 'Karnataka' },
}

export async function generateMetadata({ params }: { params: { slug: string; city: string } }): Promise<Metadata> {
  const service = SERVICES[params.slug]
  const city = CITIES[params.city]
  if (!service || !city) return { title: 'RapidFix' }

  const title = `Best ${service.label} in ${city.label} — RapidFix`
  const description = `Hire a verified ${service.label.toLowerCase()} in ${city.label}, ${city.state} for ${service.desc}. Get instant quotes, background-checked workers, starting at ${service.avgCost}.`

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/services/${params.slug}/${params.city}` },
    other: {
      'schema:json-ld': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `RapidFix — ${service.label} in ${city.label}`,
        description,
        areaServed: { '@type': 'City', name: city.label },
        serviceType: service.label,
      }),
    },
  }
}

export async function generateStaticParams() {
  const params = []
  for (const slug of Object.keys(SERVICES)) {
    for (const city of Object.keys(CITIES)) {
      params.push({ slug, city })
    }
  }
  return params
}

export default function CityServicePage({ params }: { params: { slug: string; city: string } }) {
  const service = SERVICES[params.slug]
  const city = CITIES[params.city]

  if (!service || !city) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <p style={{ color: 'var(--text-muted)' }}>Service not found</p>
    </div>
  }

  const faqs = [
    { q: `How much does a ${service.label.toLowerCase()} cost in ${city.label}?`, a: `${service.label} services in ${city.label} typically cost ${service.avgCost} depending on the complexity of the work.` },
    { q: `How quickly can I get a ${service.label.toLowerCase()} in ${city.label}?`, a: `Most jobs are assigned within 15 minutes. Emergency bookings can get a worker to your door within 1–2 hours.` },
    { q: `Are RapidFix workers in ${city.label} verified?`, a: `Yes. Every worker undergoes Aadhaar verification, skill assessment, and background check before they're listed on the platform.` },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section className="px-4 py-16 text-center" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl mb-4 block">{service.emoji}</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            {service.label} in {city.label}
          </h1>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Hire verified {service.label.toLowerCase()}s in {city.label}, {city.state} for {service.desc}.
            Background-checked, reviewed, and available today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {[
              { icon: Shield, text: 'Verified workers' },
              { icon: Clock, text: 'Available today' },
              { icon: Star, text: `Starting ${service.avgCost}` },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}>
                <Icon size={11} style={{ color: 'var(--accent)' }} /> {text}
              </span>
            ))}
          </div>
          <Link href={`/jobs/post?category=${params.slug}&city=${params.city}`}>
            <button className="btn-primary rounded-xl px-8 py-3 text-sm font-semibold flex items-center gap-2 mx-auto">
              Book a {service.label} in {city.label} <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* Services list */}
      <section className="px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            {service.label} services we offer in {city.label}
          </h2>
          <div className="glass-card divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {(service.desc.split(', ')).map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <CheckCircle size={14} style={{ color: 'var(--accent)' }} />
                <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '3.5rem' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="glass-card p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other cities */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Also available in
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CITIES).filter(([key]) => key !== params.city).map(([key, c]) => (
              <Link key={key} href={`/services/${params.slug}/${key}`}>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                  <MapPin size={9} /> {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

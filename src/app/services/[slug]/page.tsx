import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, Shield, Star } from 'lucide-react'

const SERVICE_DATA: Record<string, {
  title: string; tagline: string; description: string; tasks: string[]; price: string
}> = {
  electrician: {
    title: 'Electrician', tagline: 'Certified electrical work, done safely.',
    description: 'From wiring and switchboards to appliance installation and power failures — our certified electricians handle it all.',
    tasks: ['Wiring & rewiring', 'Switch & socket repair', 'Fan & light installation', 'MCB/fuse box repair', 'Short circuit fixing', 'Generator setup'],
    price: '₹299'
  },
  plumber: {
    title: 'Plumber', tagline: 'Fix leaks fast, no mess left behind.',
    description: 'Burst pipes, leaking taps, blocked drains — our plumbers arrive quickly and fix it right the first time.',
    tasks: ['Pipe leak repair', 'Drain unblocking', 'Tap & shower repair', 'Water tank fitting', 'Toilet repair', 'Water heater installation'],
    price: '₹249'
  },
  carpenter: {
    title: 'Carpenter', tagline: 'Precision woodwork for your home.',
    description: 'Furniture assembly, door repairs, custom shelving — our skilled carpenters bring quality craftsmanship to every job.',
    tasks: ['Furniture assembly', 'Door & window repair', 'Shelving & cabinets', 'Flooring work', 'Modular furniture fitting', 'Wood polishing'],
    price: '₹349'
  },
  painter: {
    title: 'Painter', tagline: 'Fresh walls, professional finish.',
    description: 'Interior and exterior painting with premium materials. Clean, precise, and on schedule.',
    tasks: ['Interior wall painting', 'Exterior painting', 'Texture & stencil work', 'Waterproofing', 'Wood & metal painting', 'Wallpaper removal'],
    price: '₹15/sqft'
  },
  'ac-repair': {
    title: 'AC Repair', tagline: 'Cool down fast with expert AC service.',
    description: 'Installation, servicing, gas refills, and repairs for all AC brands by trained HVAC technicians.',
    tasks: ['AC installation', 'Deep cleaning & servicing', 'Gas refill', 'Compressor repair', 'PCB repair', 'Duct cleaning'],
    price: '₹399'
  },
  'appliance-repair': {
    title: 'Appliance Repair', tagline: 'Get your appliances running again.',
    description: 'Washing machines, refrigerators, microwaves, and more — fast repairs with genuine parts.',
    tasks: ['Washing machine repair', 'Refrigerator service', 'Microwave repair', 'Dishwasher fix', 'Geyser repair', 'TV & electronics'],
    price: '₹299'
  },
  'pest-control': {
    title: 'Pest Control', tagline: 'Safe, effective pest elimination.',
    description: 'Professional pest control using certified, family-safe chemicals. Cockroaches, rats, termites and more.',
    tasks: ['Cockroach treatment', 'Rodent control', 'Termite treatment', 'Bed bug removal', 'Mosquito spray', 'Ant & fly control'],
    price: '₹599'
  },
  security: {
    title: 'Security', tagline: 'Protect your home, inside and out.',
    description: 'CCTV installation, smart locks, alarm systems — professional security solutions for homes and offices.',
    tasks: ['CCTV installation', 'Smart lock fitting', 'Alarm system setup', 'Motion sensor install', 'Video doorbell', 'Security audit'],
    price: '₹799'
  },
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICE_DATA[params.slug]
  if (!service) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <p className="text-[var(--text-muted)]">Service not found</p>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-14" style={{ background: 'var(--bg-base)' }}>
        {/* Hero */}
        <div className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest mb-4">RapidFix Service</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">{service.title}</h1>
            <p className="text-lg text-[var(--text-muted)] mb-8">{service.tagline}</p>
            <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto mb-10">{service.description}</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/auth/signup" className="btn-primary px-6 py-2.5 text-sm">
                Book Now <ArrowRight size={14} className="ml-1.5" />
              </Link>
              <span className="text-sm text-[var(--text-muted)]">Starting at <span className="text-[var(--text-primary)] font-medium">{service.price}</span></span>
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">What's included</h2>
              <div className="space-y-3">
                {service.tasks.map(task => (
                  <div key={task} className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-[var(--text-muted)] shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)]">{task}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Why RapidFix</h2>
              {[
                { icon: Clock, title: 'Same-day availability', desc: 'Book and get a worker within hours' },
                { icon: Shield, title: 'Verified professionals', desc: 'Every worker is ID-checked and rated' },
                { icon: Star, title: 'Satisfaction guaranteed', desc: 'Not happy? We fix it free of charge' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Ready to book?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">Create a free account and post your job in under 2 minutes.</p>
            <Link href="/auth/signup" className="btn-primary px-8 py-3">
              Get started — it's free
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export function generateStaticParams() {
  return Object.keys(SERVICE_DATA).map(slug => ({ slug }))
}

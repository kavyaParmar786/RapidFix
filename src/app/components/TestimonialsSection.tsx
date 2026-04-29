'use client'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Customer',
    avatar: 'P',
    color: 'from-pink-500 to-rose-600',
    rating: 5,
    text: 'RapidFix saved me! My pipe burst at midnight and within 20 minutes a plumber was at my door. The real-time chat feature made coordination so easy.',
    service: 'Plumbing',
  },
  {
    name: 'Amit Patel',
    role: 'Electrician',
    avatar: 'A',
    color: 'from-amber-500 to-orange-600',
    rating: 5,
    text: 'As a worker, RapidFix has transformed my business. I get consistent jobs matching my skills, and the payment system is completely transparent.',
    service: 'Electrician',
  },
  {
    name: 'Sneha Mehta',
    role: 'Customer',
    avatar: 'S',
    color: 'from-indigo-500 to-violet-600',
    rating: 5,
    text: 'The worker showed up on time, did an excellent AC repair, and even cleaned up after. The review system ensures only the best professionals.',
    service: 'AC Repair',
  },
  {
    name: 'Ravi Kumar',
    role: 'Carpenter',
    avatar: 'R',
    color: 'from-green-500 to-teal-600',
    rating: 5,
    text: 'I\'ve doubled my monthly income since joining RapidFix. The app is easy to use and I get notified instantly when jobs matching my skills are posted.',
    service: 'Carpenter',
  },
  {
    name: 'Deepa Nair',
    role: 'Customer',
    avatar: 'D',
    color: 'from-cyan-500 to-blue-600',
    rating: 5,
    text: 'Posted a painting job in the morning, worker accepted in 5 minutes, work started by afternoon. The speed is unbelievable!',
    service: 'Painting',
  },
  {
    name: 'Karan Singh',
    role: 'Plumber',
    avatar: 'K',
    color: 'from-purple-500 to-indigo-600',
    rating: 5,
    text: 'The atomic job locking means no arguments over who got the job first. Fair system, good pay, happy customers — what more could you want?',
    service: 'Plumber',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            Real stories
          </p>
          <h2 className="section-title text-zinc-900 mb-4">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Don't just take our word for it — hear from our community of customers and workers.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:border-black/20 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex">
                {[...Array(t.rating)].map((_, si) => (
                  <svg key={si} className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-zinc-900 flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{t.role}</p>
                  </div>
                </div>
                <span className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium text-zinc-500">
                  {t.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

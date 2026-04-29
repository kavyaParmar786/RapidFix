'use client'

export default function StatsSection() {
  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '8K+', label: 'Verified Workers' },
    { value: '1M+', label: 'Jobs Completed' },
    { value: '4.8★', label: 'Average Rating' },
  ]

  return (
    <section className="relative py-16 border-y border-white/5">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p
                className="text-4xl font-bold mb-1 gradient-text"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {s.value}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

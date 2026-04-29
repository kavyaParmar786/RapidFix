'use client'

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Customer · Plumbing', avatar: 'P', rating: 5, text: 'Pipe burst at midnight and within 20 minutes a plumber was at my door. RapidFix is genuinely incredible.' },
  { name: 'Amit Patel', role: 'Electrician · Worker', avatar: 'A', rating: 5, text: 'As a worker, RapidFix transformed my business. Consistent jobs, transparent payments, great customers.' },
  { name: 'Sneha Mehta', role: 'Customer · AC Repair', avatar: 'S', rating: 5, text: 'Worker showed up on time, fixed the AC perfectly, and cleaned up after. 10/10 would use again.' },
  { name: 'Raj Kumar', role: 'Customer · Carpenter', avatar: 'R', rating: 5, text: 'Had my entire wardrobe assembled in 3 hours. The quality of workers on this platform is outstanding.' },
  { name: 'Kavita Joshi', role: 'Customer · Painting', avatar: 'K', rating: 5, text: 'Got 3 rooms painted for a very fair price. The painter was professional and the finish is flawless.' },
  { name: 'Mohammed Ali', role: 'Plumber · Worker', avatar: 'M', rating: 5, text: 'I get 5-6 jobs a week through RapidFix. The app is simple and customers are always satisfied.' },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Reviews</p>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Loved by customers<br />and workers alike.</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ name, role, avatar, rating, text }) => (
            <div key={name} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:border-zinc-200 hover:shadow-md transition-all">
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, i) => (
                  <svg key={i} className="h-3.5 w-3.5 fill-zinc-900" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 shrink-0">{avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{name}</p>
                  <p className="text-xs text-zinc-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

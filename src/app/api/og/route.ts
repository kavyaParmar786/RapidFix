import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const SERVICE_ICONS: Record<string, string> = {
  Electrician: '⚡',
  Plumber: '🔧',
  Carpenter: '🪚',
  Painter: '🎨',
  Cleaner: '🧹',
  'AC Repair': '❄️',
  'Appliance Repair': '🔌',
  'Pest Control': '🐛',
  Security: '🔒',
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const service = searchParams.get('service') || 'Home Service'
  const city = searchParams.get('city') || 'Your City'
  const icon = SERVICE_ICONS[service] || '🔨'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 72px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <span style={{ fontSize: 28, color: '#6366f1' }}>⚡</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            RapidFix
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'auto' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>{icon}</div>
          <div style={{ fontSize: 54, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            {service} in {city}
          </div>
          <div style={{ fontSize: 22, color: '#a1a1aa', marginTop: 16 }}>
            Verified professionals · Instant booking · Best rates
          </div>
        </div>

        {/* Bottom badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              padding: '10px 24px',
              background: '#6366f1',
              borderRadius: 999,
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Book Now — rapidfix.in
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['✓ Background checked', '✓ GST invoices', '✓ Rated 4.8★'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  color: '#d4d4d8',
                  fontSize: 13,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

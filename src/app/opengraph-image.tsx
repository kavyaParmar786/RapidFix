import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RapidFix — Home Services On Demand'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>
          RapidFix
        </div>
        <div style={{ fontSize: 24, color: '#a1a1aa', marginTop: 12 }}>
          Home Services On Demand
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '10px 28px',
            background: '#6366f1',
            borderRadius: 999,
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Book a Pro in Minutes
        </div>
      </div>
    ),
    { ...size }
  )
}

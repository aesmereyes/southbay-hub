import { degToCompass } from './logic'

const STATIONS = [
  { id: '46025', nickname: 'The Outer Scout',      color: '#2C5F78', icon: '🌊', name: 'Santa Monica Basin',  depth: '890m',  relevance: 'North + South Bay', tip: 'Deep water truth. Use this for period & direction — no island shadow. 16s+ here means big energy incoming.' },
  { id: '46221', nickname: 'The Inner Confirm',     color: '#6BAE9A', icon: '📡', name: 'Santa Monica Bay',    depth: '387m',  relevance: 'MB · Hermosa · Redondo', tip: 'What actually made it through Catalina\'s shadow. If smaller than 46025, islands blocked the swell.' },
  { id: '46268', nickname: 'North Sentinel',        color: '#4a7c59', icon: '🏄', name: 'Topanga Nearshore',   depth: '~20m',  relevance: 'Malibu · Santa Monica', tip: 'NW swells hit here first. If Topanga is firing at 12s+, South Bay gets it within the hour.' },
  { id: 'ICAC1', nickname: 'Shore Station',         color: '#8B6F47', icon: '🌬️', name: 'Santa Monica Pier',   depth: 'Shore', relevance: 'Wind & tide reference', tip: 'Ground-level wind + tide. Cross-check against weather — if they match, trust the forecast.' },
  { id: '46222', nickname: 'South Sentinel',        color: '#E8934A', icon: '🧭', name: 'San Pedro',           depth: '483m',  relevance: 'South Bay south swells', tip: 'South swells arrive here first. Height + period on 46222 means Redondo south end is already on.' },
  { id: '46253', nickname: "Redondo's Backyard",    color: '#C4614A', icon: '🎯', name: 'San Pedro South',     depth: '66m',   relevance: 'Redondo · Torrance Beach', tip: 'Closest nearshore station to Redondo. If this shows height, the Breakwater is already firing.' },
]

function BuoyCard({ meta, station }) {
  const d = station?.data
  const ok = station?.ok

  return (
    <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-soft)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: ok ? meta.color : 'var(--dune)', opacity: ok ? 1 : 0.3 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: ok ? meta.color : 'var(--text-muted)' }}>
            {meta.icon} {meta.nickname}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{meta.id} · {meta.name} · {meta.depth}</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '3px 9px', borderRadius: '20px', background: ok ? `${meta.color}12` : 'var(--sand)', color: ok ? meta.color : 'var(--text-muted)', border: `1px solid ${ok ? meta.color + '25' : 'var(--border)'}` }}>
          {ok ? '● Live' : '○ No data'}
        </span>
      </div>

      {/* Data row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { l: 'Height', v: d?.wvht_ft?.toFixed(1), u: 'ft' },
          { l: 'Period', v: d?.dpd_s ? Math.round(d.dpd_s) : null, u: 's' },
          { l: 'Dir', v: d?.mwd_deg != null ? degToCompass(d.mwd_deg) : null },
          { l: 'Wind', v: d?.wspd_mph?.toFixed(0), u: 'mph' },
          { l: 'Water', v: d?.wtmp_f ? Math.round(d.wtmp_f) : null, u: '°F' },
        ].map(s => (
          <div key={s.l} style={{ background: 'var(--sand)', borderRadius: '8px', padding: '7px 10px', textAlign: 'center', minWidth: '54px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: ok && s.v ? meta.color : 'var(--text-light)', lineHeight: 1.2 }}>
              {s.v ?? '—'}{s.v && s.u ? <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--text-muted)' }}>{s.u}</span> : ''}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic', paddingTop: '10px', borderTop: '1px solid var(--border-soft)' }}>
        {meta.tip}
      </div>
      {d?.timestamp && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-light)', marginTop: '8px', textAlign: 'right' }}>{d.timestamp}</div>
      )}
    </div>
  )
}

export default function BuoyDashboard({ stations, fetchedAt }) {
  if (!stations) return null
  const liveCount = STATIONS.filter(m => stations[m.id]?.ok).length
  const mins = fetchedAt ? Math.round((Date.now() - new Date(fetchedAt)) / 60000) : null
  const ageStr = mins === null ? '' : mins < 2 ? 'Just updated' : mins < 60 ? `${mins}min ago` : `${Math.floor(mins/60)}h ${mins%60}m ago`

  return (
    <section style={{ marginBottom: '36px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Buoy Network</h2>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 300 }}>{liveCount}/{STATIONS.length} stations live · {ageStr}</span>
      </div>

      {/* Reading guide */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px', padding: '12px 16px', background: 'var(--card)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-soft)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'center' }}>How to read the water:</span>
        {[
          { color: '#2C5F78', text: '46025 + 46221 → Surf score' },
          { color: '#4a7c59', text: '46268 → NW early warning' },
          { color: '#C4614A', text: '46253 → Redondo real-time' },
          { color: '#E8934A', text: '46222 → South swell detector' },
        ].map(l => (
          <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-mid)' }}>{l.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {STATIONS.map(meta => <BuoyCard key={meta.id} meta={meta} station={stations[meta.id]} />)}
      </div>
    </section>
  )
}

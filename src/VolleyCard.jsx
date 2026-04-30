import ScoreGauge from './ScoreGauge'
import { degToCompass } from './logic'

const WIND_DIRS = { N:'↓', NE:'↙', E:'←', SE:'↖', S:'↑', SW:'↗', W:'→', NW:'↘', NNE:'↙', ENE:'↙', ESE:'↖', SSE:'↖', SSW:'↗', WSW:'↗', WNW:'↘', NNW:'↘' }

const WIND_TABLE = [
  { max: 5,   label: '0–5 mph',   condition: 'Pure',      detail: 'Zero drift. Perfect setting.',           color: '#4a7c59' },
  { max: 12,  label: '6–12 mph',  condition: 'Breezy',    detail: 'Slight drift. Use the wind.',            color: '#2C5F78' },
  { max: 20,  label: '13–20 mph', condition: 'Heavy',     detail: '3ft off the net. Keep sets low.',        color: '#E8934A' },
  { max: 999, label: '21+ mph',   condition: 'Blown Out', detail: 'Sand flying. Hero serves only.',         color: '#C4614A' },
]

function WindMeter({ mph, dirDeg }) {
  const dir = dirDeg != null ? degToCompass(dirDeg) : null
  const arrow = dir ? (WIND_DIRS[dir] || '→') : '?'
  const row = mph != null ? WIND_TABLE.find(r => mph <= r.max) : null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', background: row ? `${row.color}12` : 'var(--sand)', border: `2px solid ${row ? row.color + '30' : 'var(--border)'}`, flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: row?.color || 'var(--text-mid)', lineHeight: 1 }}>
          {mph?.toFixed(0) ?? '—'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>mph</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500, marginBottom: '4px' }}>Ball Drift</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '22px', color: row?.color || 'var(--text-mid)' }}>{arrow}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: row?.color || 'var(--text-mid)', lineHeight: 1 }}>{row?.condition ?? '—'}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{row?.detail}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VolleyCard({ score, condition, data, advice }) {
  const color = '#4a7c59'
  const uvColor = !data?.uvIndex ? 'var(--text-mid)' : data.uvIndex >= 8 ? '#C4614A' : data.uvIndex >= 6 ? '#E8934A' : '#4a7c59'

  return (
    <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '28px 28px 22px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-soft)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${color}, #FFB347)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏐</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Volleyball</span>
          </div>
          {condition && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: condition.color, fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {condition.label}
            </div>
          )}
        </div>
        <ScoreGauge score={score} color={color} size={100} />
      </div>

      {/* Wind meter */}
      <div style={{ paddingBottom: '18px', borderBottom: '1px solid var(--border-soft)', marginBottom: '16px' }}>
        <WindMeter mph={data?.windMph} dirDeg={data?.windDirDeg} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'UV Index', value: data?.uvIndex?.toFixed(1), color: uvColor },
          { label: 'Cloud Cover', value: data?.cloudPct != null ? Math.round(data.cloudPct) + '%' : null },
          { label: 'Air Temp', value: data?.tempF ? Math.round(data.tempF) + '°F' : null },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--sand)', borderRadius: '10px', padding: '10px 12px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: s.color || 'var(--text-mid)' }}>{s.value ?? '—'}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--text-mid)', lineHeight: 1.6, paddingTop: '12px', borderTop: '1px solid var(--border-soft)' }}>
        "{advice || 'Fetching weather data...'}"
      </div>
    </div>
  )
}

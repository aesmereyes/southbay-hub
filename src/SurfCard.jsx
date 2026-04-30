import ScoreGauge from './ScoreGauge'
import { degToCompass } from './logic'

const DIR_ARROW = { N:'↓',NNE:'↙',NE:'↙',ENE:'←',E:'←',ESE:'↖',SE:'↖',SSE:'↑',S:'↑',SSW:'↗',SW:'↗',WSW:'→',W:'→',WNW:'↘',NW:'↘',NNW:'↓' }

function BigStat({ label, value, unit, color, sub }) {
  return (
    <div>
      <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'2px' }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'3px' }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'38px', fontWeight:700, color: color||'var(--text-mid)', lineHeight:1 }}>{value ?? '—'}</span>
        {unit && <span style={{ fontFamily:'var(--font-body)', fontSize:'14px', color:'var(--text-muted)', fontWeight:400 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-light)', marginTop:'2px' }}>{sub}</div>}
    </div>
  )
}

function SmallStat({ label, value, unit }) {
  return (
    <div style={{ background:'var(--sand)', borderRadius:'10px', padding:'10px 12px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>{label}</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:'var(--text-mid)', lineHeight:1 }}>
        {value ?? '—'}{value && unit && <span style={{ fontSize:'11px', fontWeight:400, color:'var(--text-muted)', marginLeft:'2px' }}>{unit}</span>}
      </div>
    </div>
  )
}

export default function SurfCard({ score, quality, data, advice }) {
  const color = '#2C5F78'
  const waveDir = data?.mwdDeg ?? data?.swellDirDeg
  const dir = waveDir != null ? degToCompass(waveDir) : null
  const arrow = dir ? (DIR_ARROW[dir] || '→') : null

  // Determine what to show as primary height
  // If we have both swell and total, show both
  const totalHt = data?.wvhtFt
  const swellHt = data?.swellHtFt
  const period  = data?.dpdS ?? data?.swellPeriod

  return (
    <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', boxShadow:'var(--shadow-md)', border:'1px solid var(--border-soft)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${color},#6BAE9A)` }} />

      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'var(--text)' }}>🏄 Surf</div>
          {quality && <div style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:quality.color, fontWeight:700, marginTop:'4px', textTransform:'uppercase', letterSpacing:'0.1em' }}>{quality.label}</div>}
        </div>
        <ScoreGauge score={score} color={color} size={100} />
      </div>

      {/* Big 3 stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', paddingBottom:'18px', borderBottom:'1px solid var(--border-soft)', marginBottom:'16px' }}>
        <BigStat label="Wave Height" value={totalHt?.toFixed(1)} unit="ft" color={color} sub={swellHt ? `${swellHt.toFixed(1)}ft swell` : null} />
        <BigStat label="Period"      value={period ? Math.round(period) : null} unit="s" sub={data?.windWavePeriod ? `${Math.round(data.windWavePeriod)}s wind wave` : null} />
        <div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'4px' }}>Direction</div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {arrow && <span style={{ fontSize:'30px', lineHeight:1, color:color }}>{arrow}</span>}
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'var(--text-mid)', lineHeight:1 }}>{dir ?? '—'}</div>
              {waveDir != null && <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-light)' }}>{Math.round(waveDir)}°</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'16px' }}>
        <SmallStat label="Swell Ht"  value={swellHt?.toFixed(1)}  unit="ft" />
        <SmallStat label="Swell Per" value={data?.swellPeriod ? Math.round(data.swellPeriod) : null} unit="s" />
        <SmallStat label="Wind Wave" value={data?.windWaveHtFt?.toFixed(1)} unit="ft" />
        <SmallStat label="Water °F"  value={data?.waterTempF ? Math.round(data.waterTempF) : null} />
      </div>

      {/* NOAA buoy timestamps if available */}
      {data?.b25Time && (
        <div style={{ display:'flex', gap:'12px', marginBottom:'12px' }}>
          {[['46025 Outer', data.b25Time, '#2C5F78'], ['46221 Inner', data.b21Time, '#6BAE9A']].map(([id, t, c]) => t && (
            <div key={id} style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-light)', display:'flex', alignItems:'center', gap:'4px' }}>
              <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:c, display:'inline-block' }} />
              {id} · {t.split(' ').slice(1).join(' ')}
            </div>
          ))}
        </div>
      )}

      {/* Advice */}
      <div style={{ fontFamily:'var(--font-display)', fontSize:'14px', fontStyle:'italic', color:'var(--text-mid)', lineHeight:1.6, paddingTop:'14px', borderTop:'1px solid var(--border-soft)' }}>
        "{advice || 'Loading wave data…'}"
      </div>
    </div>
  )
}

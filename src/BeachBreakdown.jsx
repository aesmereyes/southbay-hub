import { degToCompass, calcSurfScore, surfQuality } from './logic'

const DIR_ARROW = { N:'↓',NNE:'↙',NE:'↙',ENE:'←',E:'←',ESE:'↖',SE:'↖',SSE:'↑',S:'↑',SSW:'↗',SW:'↗',WSW:'→',W:'→',WNW:'↘',NW:'↘',NNW:'↓' }

function scoreColor(score) {
  if (score >= 8) return '#4a7c59'
  if (score >= 6) return '#2C5F78'
  if (score >= 4) return '#E8934A'
  return '#C4614A'
}

function ScoreBar({ score }) {
  const color = scoreColor(score)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{ flex:1, height:'5px', background:'rgba(139,111,71,0.12)', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${score*10}%`, background:color, borderRadius:'3px', transition:'width 0.8s ease' }} />
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color, minWidth:'24px', textAlign:'right' }}>{score}</div>
    </div>
  )
}

function BeachCard({ beach, windMph, isHome }) {
  const score = calcSurfScore({ heightFt: beach.waveHtFt, periodS: beach.wavePer, windMph: windMph ?? 0 })
  const qual  = surfQuality(score, beach.waveHtFt, beach.wavePer)
  const dir   = beach.waveDirDeg != null ? degToCompass(beach.waveDirDeg) : null
  const arrow = dir ? (DIR_ARROW[dir] || '→') : null
  const color = scoreColor(score)

  return (
    <div style={{
      background: isHome ? 'var(--pacific)' : 'var(--card)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: isHome ? '0 8px 32px rgba(44,95,120,0.25)' : 'var(--shadow-md)',
      border: isHome ? 'none' : '1px solid var(--border-soft)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s',
    }}>
      {isHome && (
        <div style={{ position:'absolute', top:'12px', right:'14px', fontFamily:'var(--font-mono)', fontSize:'9px', background:'rgba(255,255,255,0.18)', color:'white', padding:'2px 8px', borderRadius:'20px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Home Court</div>
      )}

      {/* Beach name */}
      <div style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:700, color: isHome?'white':'var(--text)', marginBottom:'4px' }}>
        {beach.icon} {beach.name}
      </div>

      {/* Quality badge */}
      <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', fontWeight:700, color: isHome?'rgba(255,255,255,0.7)':qual.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'14px' }}>
        {qual.label}
      </div>

      {/* Score bar */}
      <div style={{ marginBottom:'14px' }}>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:isHome?'rgba(255,255,255,0.55)':'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:500, marginBottom:'5px' }}>Surf Score</div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ flex:1, height:'5px', background:isHome?'rgba(255,255,255,0.2)':'rgba(139,111,71,0.12)', borderRadius:'3px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${score*10}%`, background:isHome?'white':color, borderRadius:'3px', transition:'width 0.8s ease' }} />
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:isHome?'white':color, minWidth:'28px', textAlign:'right' }}>{score}</div>
        </div>
      </div>

      {/* Key stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
        {[
          { label:'Height', value: beach.waveHtFt?.toFixed(1), unit:'ft' },
          { label:'Period', value: beach.wavePer ? Math.round(beach.wavePer) : null, unit:'s' },
          { label:'Dir',    value: dir, extra: arrow },
        ].map(s => (
          <div key={s.label} style={{ background: isHome?'rgba(255,255,255,0.12)':'var(--sand)', borderRadius:'10px', padding:'10px 10px 8px' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:isHome?'rgba(255,255,255,0.5)':'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>{s.label}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700, color:isHome?'white':'var(--text-mid)', lineHeight:1 }}>
              {s.extra && <span style={{ marginRight:'2px' }}>{s.extra}</span>}
              {s.value ?? '—'}
              {s.value && s.unit && <span style={{ fontSize:'11px', fontWeight:400, color:isHome?'rgba(255,255,255,0.5)':'var(--text-muted)', marginLeft:'2px' }}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Swell detail */}
      {beach.swellHtFt != null && (
        <div style={{ marginTop:'10px', padding:'8px 10px', background:isHome?'rgba(255,255,255,0.1)':'var(--sand)', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:isHome?'rgba(255,255,255,0.55)':'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Swell</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'14px', fontWeight:600, color:isHome?'white':'var(--text-mid)' }}>
            {beach.swellHtFt.toFixed(1)}ft @ {beach.swellPer ? Math.round(beach.swellPer) : '—'}s · {degToCompass(beach.swellDirDeg) ?? '—'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function BeachBreakdown({ beaches, windMph }) {
  if (!beaches?.length) return null

  return (
    <section style={{ marginBottom:'36px', position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'16px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>
          Where to Surf Today
        </h2>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', fontWeight:300 }}>
          Per-beach conditions · Open-Meteo Marine · Live
        </span>
      </div>

      {/* Best pick callout */}
      {(() => {
        const ranked = [...beaches]
          .map(b => ({ ...b, score: calcSurfScore({ heightFt: b.waveHtFt, periodS: b.wavePer, windMph: windMph ?? 0 }) }))
          .sort((a,b) => b.score - a.score)
        const best = ranked[0]
        if (!best || best.score < 4) return null
        return (
          <div style={{ background:'linear-gradient(135deg, #FFB347 0%, #E8934A 100%)', borderRadius:'14px', padding:'14px 20px', marginBottom:'14px', display:'flex', alignItems:'center', gap:'12px', boxShadow:'0 4px 20px rgba(255,179,71,0.3)' }}>
            <span style={{ fontSize:'22px' }}>🎯</span>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color:'white' }}>
                Best bet today: {best.name}
              </div>
              <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'rgba(255,255,255,0.85)', marginTop:'2px' }}>
                {best.waveHtFt?.toFixed(1)}ft · {best.wavePer ? Math.round(best.wavePer) : '—'}s · Score {best.score}/10
              </div>
            </div>
          </div>
        )
      })()}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px' }}>
        {beaches.map(beach => (
          <BeachCard
            key={beach.id}
            beach={beach}
            windMph={windMph}
            isHome={beach.id === 'hermosa'}
          />
        ))}
      </div>
    </section>
  )
}

import { calcSurfScore, surfQuality, degToCompass } from './logic'

const DIR_ARROW = { N:'↓',NNE:'↙',NE:'↙',ENE:'←',E:'←',ESE:'↖',SE:'↖',SSE:'↑',S:'↑',SSW:'↗',SW:'↗',WSW:'→',W:'→',WNW:'↘',NW:'↘',NNW:'↓' }

const SPOT_KNOWLEDGE = {
  'manhattan':  { best:['NW','WNW','W'], worst:['S','SSW'], note:'Best on NW swells. El Porto is the heavy beach break local chargers favor.' },
  'hermosa':    { best:['NW','W','WSW'], worst:['S'], note:'Open bay catches swells others miss. Pier gives lefts and rights. Great all-arounder.' },
  'redondo':    { best:['S','SSW','SW'], worst:['N','NW'], note:'Breakwater protects from north wind. Catches south swells first. Great on windy days.' },
  'el-segundo': { best:['NW','W'], worst:['S'], note:'Less crowded north end. Gets the same swell as El Porto but fewer people.' },
  'torrance':   { best:['S','SW','SSW'], worst:['N','NW'], note:'Southern exposure. Great for south swells when north spots are blown out.' },
}

function getDecision(beaches, windMph) {
  if (!beaches?.length) return null
  const scored = beaches.map(b => ({
    ...b,
    score: calcSurfScore({ heightFt: b.waveHtFt, periodS: b.wavePer, windMph: windMph ?? 0 }),
  })).sort((a,b) => b.score - a.score)

  const best = scored[0]
  const worst = scored[scored.length - 1]
  const qual = surfQuality(best.score, best.waveHtFt, best.wavePer)

  return { ranked: scored, best, worst, qual }
}

export default function BestSpotPanel({ beaches, windMph }) {
  const result = getDecision(beaches, windMph)
  if (!result) return null
  const { ranked, best, qual } = result

  const dir = best.waveDirDeg != null ? degToCompass(best.waveDirDeg) : null
  const arrow = dir ? (DIR_ARROW[dir] || '→') : ''
  const know = SPOT_KNOWLEDGE[best.id]

  // Scoring bar colors
  const scoreColor = (s) => s >= 7 ? '#4a7c59' : s >= 5 ? '#2C5F78' : s >= 3 ? '#E8934A' : '#C4614A'

  return (
    <section style={{ marginBottom:'32px', position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'16px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>Where to Surf Today</h2>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', fontWeight:300 }}>Live per-beach conditions · Open-Meteo Marine</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'16px' }}>
        {/* LEFT: Best pick hero */}
        <div style={{ background:'linear-gradient(135deg, var(--pacific) 0%, #1a4a60 100%)', borderRadius:'20px', padding:'28px', boxShadow:'0 8px 40px rgba(44,95,120,0.3)', color:'white', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
          <div style={{ position:'absolute', bottom:'-20px', left:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

          <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>
            🎯 Best Bet Right Now
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:700, color:'white', lineHeight:1.1, marginBottom:'4px' }}>
            {best.icon} {best.name}
          </div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:qual.color === '#4a7c59' ? '#86efac' : qual.color === '#2C5F78' ? '#93c5fd' : '#fde68a', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'20px' }}>
            {qual.label}
          </div>

          {/* Big stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
            {[
              { label:'Height', value: best.waveHtFt?.toFixed(1), unit:'ft' },
              { label:'Period', value: best.wavePer ? Math.round(best.wavePer) : null, unit:'s' },
              { label:'Direction', value: dir, extra: arrow },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.1)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>{s.label}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'white', lineHeight:1 }}>
                  {s.extra}{s.value ?? '—'}{s.value && s.unit && <span style={{ fontSize:'13px', fontWeight:400, color:'rgba(255,255,255,0.6)', marginLeft:'2px' }}>{s.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Surf score */}
          <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:'12px', padding:'12px 14px', marginBottom:'14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Surf Score</span>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:700, color:'white' }}>{ranked[0].score}/10</span>
            </div>
            <div style={{ height:'5px', background:'rgba(255,255,255,0.15)', borderRadius:'3px' }}>
              <div style={{ height:'100%', width:`${ranked[0].score*10}%`, background:'#FFB347', borderRadius:'3px', boxShadow:'0 0 8px rgba(255,179,71,0.6)' }} />
            </div>
          </div>

          {/* Local knowledge */}
          {know && (
            <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'rgba(255,255,255,0.7)', lineHeight:1.5, fontStyle:'italic' }}>
              💡 {know.note}
            </div>
          )}
        </div>

        {/* RIGHT: Full ranked list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'2px' }}>All Spots Ranked</div>
          {ranked.map((b, i) => {
            const dir = b.waveDirDeg != null ? degToCompass(b.waveDirDeg) : '—'
            const color = scoreColor(b.score)
            return (
              <div key={b.id} style={{ background:'var(--card)', borderRadius:'12px', padding:'14px 16px', boxShadow:'var(--shadow-sm)', border:`1px solid ${i===0?color+'30':'var(--border-soft)'}`, display:'flex', alignItems:'center', gap:'14px' }}>
                {/* Rank */}
                <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color: i===0?color:'var(--text-light)', minWidth:'28px', textAlign:'center' }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                </div>
                {/* Name */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'14px', fontWeight:700, color:'var(--text)' }}>{b.icon} {b.name}</div>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-muted)', marginTop:'2px' }}>
                    {b.waveHtFt?.toFixed(1) ?? '—'}ft · {b.wavePer ? Math.round(b.wavePer) : '—'}s · {dir}
                  </div>
                </div>
                {/* Score bar */}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', minWidth:'90px' }}>
                  <div style={{ flex:1, height:'4px', background:'rgba(139,111,71,0.12)', borderRadius:'2px' }}>
                    <div style={{ height:'100%', width:`${b.score*10}%`, background:color, borderRadius:'2px' }} />
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, color, minWidth:'20px', textAlign:'right' }}>{b.score}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

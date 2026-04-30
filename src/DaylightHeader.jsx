import { useState, useEffect } from 'react'

function fmt(iso, opts) {
  if (!iso) return '--'
  return new Date(iso).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', ...opts })
}

function buoyAgeLabel(fetchedAt) {
  if (!fetchedAt) return null
  const mins = Math.round((Date.now() - new Date(fetchedAt)) / 60000)
  if (mins < 2)  return { text: 'Buoy data · just updated', color: '#4a5e3a' }
  if (mins < 60) return { text: `Buoy data · updated ${mins} min ago`, color: '#4a5e3a' }
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  if (hrs < 2)   return { text: `Buoy data · updated ${hrs}h ${rem}m ago`, color: '#d4824a' }
  return           { text: `Buoy data · ${hrs} hours old — refreshing soon`, color: '#c4614a' }
}

export default function DaylightHeader({ sunriseISO, sunsetISO, lastFetch, buoyFetchedAt }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric' })

  let pct = 50, remainStr = '—', isNight = false
  if (sunriseISO && sunsetISO) {
    const sr = new Date(sunriseISO), ss = new Date(sunsetISO)
    pct = Math.max(0, Math.min(100, ((now - sr) / (ss - sr)) * 100))
    isNight = now > ss || now < sr
    if (!isNight) {
      const rem = ss - now
      remainStr = `${Math.floor(rem / 3600000)}h ${Math.floor((rem % 3600000) / 60000)}m of daylight left`
    } else {
      remainStr = 'After sunset — lit courts only'
    }
  }

  const buoyStatus = buoyAgeLabel(buoyFetchedAt)

  return (
    <header style={{ padding:'28px 0 22px', borderBottom:'1px solid var(--border)', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'32px', alignItems:'center', position:'relative', zIndex:1 }}>

      {/* Brand */}
      <div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>
          South Bay Hub
        </div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-muted)', marginTop:'3px', letterSpacing:'0.04em' }}>
          Hermosa Beach · Manhattan · Redondo
        </div>
        {buoyStatus && (
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:buoyStatus.color, marginTop:'5px', display:'flex', alignItems:'center', gap:'5px' }}>
            <span style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:buoyStatus.color, flexShrink:0 }} />
            {buoyStatus.text}
          </div>
        )}
        {lastFetch && (
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-light)', marginTop:'3px' }}>
            Weather: live · Dashboard refreshed {lastFetch.toLocaleTimeString('en-US', { timeZone:'America/Los_Angeles', hour:'numeric', minute:'2-digit' })}
          </div>
        )}
      </div>

      {/* Clock */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'48px', fontWeight:300, color:'var(--ocean)', lineHeight:1, letterSpacing:'0.02em' }}>
          {timeStr}
        </div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', marginTop:'5px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          {dateStr}
        </div>
      </div>

      {/* Sun panel */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px' }}>
        <div style={{ display:'flex', gap:'20px' }}>
          {[
            { label:'Sunrise', iso:sunriseISO, emoji:'🌅' },
            { label:'Sunset',  iso:sunsetISO,  emoji:'🌇' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                {s.emoji} {s.label}
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'15px', color:'var(--text-mid)', fontWeight:500, marginTop:'2px' }}>
                {fmt(s.iso, { hour:'numeric', minute:'2-digit', hour12:true })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ width:'240px' }}>
          <div style={{ height:'5px', background:'var(--sand-deeper)', borderRadius:'3px', position:'relative', overflow:'visible' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, #d4824a, ${isNight?'#4a5e3a':'#2a6b8a'})`, borderRadius:'3px', transition:'width 1s linear', position:'relative' }}>
              <div style={{ position:'absolute', right:'-5px', top:'50%', transform:'translateY(-50%)', width:'10px', height:'10px', background:isNight?'#4a5e3a':'#d4824a', borderRadius:'50%', boxShadow:`0 0 6px ${isNight?'#4a5e3a':'#d4824a'}` }} />
            </div>
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:isNight?'#c4614a':'var(--ocean)', marginTop:'5px', textAlign:'right' }}>
            {isNight ? '🌙 ' : ''}{remainStr}
          </div>
        </div>
      </div>
    </header>
  )
}

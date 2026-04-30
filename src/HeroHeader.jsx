import { useState, useEffect } from 'react'

const NIGHT_IMAGES = [
  'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475274047050-1d0c0975de51?w=1800&auto=format&fit=crop&q=80',
]
const DAY_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1800&auto=format&fit=crop&q=80',
]

function fmtTime(iso) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('en-US', { timeZone:'America/Los_Angeles', hour:'numeric', minute:'2-digit', hour12:true })
}

function getVibeComment(data, isNight, cloudPct, uvIndex) {
  if (isNight) {
    const h = [
      { h:'The Shore is Yours Tonight',      s:'Lit courts open · Stars over the Pacific' },
      { h:'Moon\'s Out, Board\'s Out',         s:'Night session energy · Bring a buddy' },
      { h:'After Hours at the Beach',          s:'Sand volleyball under the lights, anyone?' },
    ]
    return h[Math.floor(Math.random() * h.length)]
  }
  if (!data) return { h:'Reading the Water…', s:'Fetching live conditions' }
  const { wvhtFt, dpdS, windMph } = data
  if (cloudPct > 80) return { h:'A Moody Ocean Day', s:'Grab a hoodie. Waves don\'t care about clouds — but you might.' }
  if (uvIndex >= 9)  return { h:'The Sun is NOT Messing Around', s:'SPF 50+, polarized shades, and maybe a hat. You have been warned.' }
  if (uvIndex >= 7)  return { h:'High UV Alert ☀️', s:'Sunscreen is not optional today. Reapply every 90 minutes or become a lobster.' }
  if (wvhtFt >= 5 && dpdS >= 12) return { h:'The Water is on Fire 🔥', s:`${wvhtFt.toFixed(1)}ft / ${Math.round(dpdS)}s — this is what you woke up early for` }
  if (wvhtFt >= 3 && dpdS >= 10) return { h:'The Water is Calling',      s:`${wvhtFt.toFixed(1)}ft faces · ${Math.round(dpdS)}s period · Worth it` }
  if (wvhtFt >= 1.5)              return { h:'Something\'s Out There',    s:`${wvhtFt.toFixed(1)}ft — not epic, but you\'ll catch something` }
  if (windMph <= 5)               return { h:'Perfect for the Sand',      s:'Glass water, zero wind. Volleyball sets going exactly where you want them.' }
  if (windMph <= 12)              return { h:'Breezy & Beautiful',        s:`${windMph.toFixed(0)}mph breeze · Use it on those float serves` }
  if (windMph > 20)               return { h:'It\'s Blowing Out There 💨', s:`${windMph.toFixed(0)}mph — only the brave (or stubborn) are on the sand today` }
  return { h:'A Day at the Beach', s:'South Bay is always on. Pick your sport.' }
}

export default function HeroHeader({ data, sunriseISO, sunsetISO }) {
  const [now, setNow]     = useState(new Date())
  const [imgIdx, setIdx]  = useState(0)
  const [imgLoaded, setOk] = useState(false)

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { const t = setInterval(() => { setOk(false); setIdx(i => (i + 1)) }, 12000); return () => clearInterval(t) }, [])

  const timeStr = now.toLocaleTimeString('en-US', { timeZone:'America/Los_Angeles', hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { timeZone:'America/Los_Angeles', weekday:'long', month:'long', day:'numeric' })

  let pct = 0, isNight = false, remStr = '', minutesToEvent = 0, nextEvent = ''
  if (sunriseISO && sunsetISO) {
    const sr = new Date(sunriseISO), ss = new Date(sunsetISO)
    isNight = now > ss || now < sr
    if (!isNight) {
      pct = Math.max(0, Math.min(100, ((now - sr) / (ss - sr)) * 100))
      const rem = ss - now
      remStr = `${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m until sunset`
    } else {
      // Night: show progress toward sunrise
      const nextSr = now < sr ? sr : new Date(sr.getTime() + 86400000)
      const rem = nextSr - now
      pct = 100 - Math.max(0, Math.min(100, (rem / 43200000) * 100))
      remStr = `${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m until sunrise`
    }
  }

  const images = isNight ? NIGHT_IMAGES : DAY_IMAGES
  const img = images[imgIdx % images.length]
  const { h, s } = getVibeComment(data, isNight, data?.cloudPct, data?.uvIndex)

  return (
    <div style={{ position:'relative', width:'100%', height:'400px', overflow:'hidden', borderRadius:'0 0 28px 28px', marginBottom:'32px', background: isNight ? '#0a0f1a' : '#1a3a4a' }}>
      <img key={img} src={img} alt="South Bay" onLoad={() => setOk(true)}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 55%', opacity:imgLoaded?1:0, transition:'opacity 1.2s ease' }} />

      {/* Overlay — darker at night */}
      <div style={{ position:'absolute', inset:0, background: isNight
        ? 'linear-gradient(to bottom, rgba(5,10,20,0.4) 0%, rgba(5,10,20,0.65) 55%, rgba(5,10,20,0.88) 100%)'
        : 'linear-gradient(to bottom, rgba(10,20,30,0.2) 0%, rgba(10,20,30,0.5) 55%, rgba(10,20,30,0.82) 100%)'
      }} />

      {/* Night stars overlay */}
      {isNight && (
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top, rgba(30,50,80,0.4) 0%, transparent 70%)', pointerEvents:'none' }} />
      )}

      {/* Top bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, padding:'22px 36px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:'white' }}>South Bay Hub</div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'rgba(255,255,255,0.55)', marginTop:'2px', letterSpacing:'0.07em', textTransform:'uppercase' }}>Hermosa · Manhattan · Redondo</div>
        </div>
        {/* Night/Day indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(0,0,0,0.3)', padding:'6px 14px', borderRadius:'20px', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize:'16px' }}>{isNight ? '🌙' : '☀️'}</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:isNight?'#818cf8':'#FFB347' }}>{isNight ? 'Night Session' : 'Day Session'}</span>
        </div>
      </div>

      {/* Image dots */}
      <div style={{ position:'absolute', top:'26px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
        {images.map((_,i) => (
          <div key={i} onClick={() => { setOk(false); setIdx(i) }}
            style={{ width:i===imgIdx%images.length?20:6, height:6, borderRadius:'3px', background:i===imgIdx%images.length?'white':'rgba(255,255,255,0.3)', transition:'all 0.3s', cursor:'pointer' }} />
        ))}
      </div>

      {/* Main glass card */}
      <div style={{ position:'absolute', bottom:'24px', left:'50%', transform:'translateX(-50%)', width:'720px', maxWidth:'calc(100% - 48px)', background:'rgba(5,12,22,0.45)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'18px', padding:'24px 32px', display:'grid', gridTemplateColumns:'1fr auto', gap:'24px', alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'34px', fontWeight:700, color:'white', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:'6px' }}>{h}</div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:'rgba(255,255,255,0.68)', fontWeight:300 }}>{s}</div>

          {/* Sun/Moon bar */}
          <div style={{ marginTop:'16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:'10px', color:'rgba(255,255,255,0.45)', marginBottom:'5px' }}>
              <span>🌅 Sunrise {fmtTime(sunriseISO)}</span>
              <span style={{ color: isNight ? '#818cf8' : '#FFB347', fontWeight:500 }}>{remStr}</span>
              <span>🌇 Sunset {fmtTime(sunsetISO)}</span>
            </div>
            <div style={{ height:'4px', background:'rgba(255,255,255,0.12)', borderRadius:'2px', position:'relative', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background: isNight ? 'linear-gradient(90deg,#4338ca,#818cf8)' : 'linear-gradient(90deg,#FFB347,#FF6B35)', borderRadius:'2px', transition:'width 1s linear', position:'relative' }}>
                <div style={{ position:'absolute', right:'-4px', top:'50%', transform:'translateY(-50%)', width:'8px', height:'8px', background:isNight?'#818cf8':'#FFB347', borderRadius:'50%', boxShadow:`0 0 8px ${isNight?'#818cf8':'#FFB347'}` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Clock */}
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'40px', fontWeight:300, color:'white', lineHeight:1, letterSpacing:'0.02em' }}>{timeStr}</div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'rgba(255,255,255,0.4)', marginTop:'5px', textTransform:'uppercase', letterSpacing:'0.08em' }}>{dateStr}</div>
        </div>
      </div>
    </div>
  )
}

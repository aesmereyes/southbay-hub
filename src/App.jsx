import { useState, useEffect } from 'react'
import { useStationData } from './useStationData'
import { calcSurfScore, calcVolleyScore, surfLabel, windLabel, vibeComment, degToCompass, surfAdvice } from './logic'
import MapPage from './MapPage'
import CalendarPage from './CalendarPage'
import BuoyPage from './BuoyPage'
import CamsPage from './CamsPage'

// ─── NIGHT / DAY DETECTION ───────────────────────────────────────
function isNightTime(sunriseISO, sunsetISO) {
  if (!sunriseISO || !sunsetISO) return false
  const now = new Date()
  return now < new Date(sunriseISO) || now > new Date(sunsetISO)
}

// ─── NAVIGATION ──────────────────────────────────────────────────
const PAGES = [
  { id:'home',     label:'Conditions' },
  { id:'spots',    label:'Spots & Map' },
  { id:'calendar', label:'Calendar'   },
  { id:'buoys',    label:'Buoy Data'  },
  { id:'cams',     label:'Live Cams'  },
]

function Nav({ page, setPage, isNight }) {
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      background: isNight ? 'rgba(13,27,42,0.96)' : 'rgba(249,245,238,0.96)',
      backdropFilter:'blur(12px)',
      borderBottom: `1px solid ${isNight ? 'rgba(255,255,255,0.08)' : 'var(--border)'}`,
      padding:'0 32px',
      display:'flex', alignItems:'center', justifyContent:'space-between', height:'58px',
    }}>
      <div style={{ fontFamily:'var(--ff-display)', fontSize:'18px', fontWeight:600, color: isNight?'#e2e8f0':'var(--text)', letterSpacing:'-0.02em', cursor:'pointer' }}
        onClick={()=>setPage('home')}>
        South Bay Hub
      </div>
      <div style={{ display:'flex', gap:'4px' }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={()=>setPage(p.id)} style={{
            padding:'6px 16px', borderRadius:'8px', border:'none', cursor:'pointer',
            fontFamily:'var(--ff-body)', fontSize:'13px', fontWeight: page===p.id?600:400,
            background: page===p.id ? (isNight?'rgba(255,255,255,0.12)':'rgba(26,18,8,0.08)') : 'transparent',
            color: page===p.id ? (isNight?'white':'var(--text)') : (isNight?'rgba(255,255,255,0.5)':'var(--textd)'),
            transition:'all 0.15s',
          }}>{p.label}</button>
        ))}
      </div>
      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'11px', color: isNight?'rgba(255,255,255,0.35)':'var(--textl)', letterSpacing:'0.04em' }}>
        33.88°N · 118.41°W
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────
const NIGHT_IMGS = [
  'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475274047050-1d0c0975de51?w=1800&auto=format&fit=crop&q=80',
]
const DAY_IMGS = [
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

function Hero({ data, isNight }) {
  const [now, setNow] = useState(new Date())
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(t) },[])
  useEffect(() => { const t=setInterval(()=>{setLoaded(false);setIdx(i=>(i+1))},12000); return()=>clearInterval(t) },[])

  const imgs = isNight ? NIGHT_IMGS : DAY_IMGS
  const img  = imgs[idx % imgs.length]
  const timeStr = now.toLocaleTimeString('en-US',{timeZone:'America/Los_Angeles',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})

  // Sun progress
  let pct=0, remStr='', sr, ss
  if (data?.sunriseISO && data?.sunsetISO) {
    sr = new Date(data.sunriseISO); ss = new Date(data.sunsetISO)
    if (!isNight) {
      pct = Math.max(0, Math.min(100, ((now-sr)/(ss-sr))*100))
      const rem = ss-now; remStr = `${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m until sunset`
    } else {
      const nextSr = now < sr ? sr : new Date(sr.getTime()+86400000)
      const rem = nextSr - now; remStr = `${Math.floor(rem/3600000)}h ${Math.floor((rem%3600000)/60000)}m until sunrise`
      pct = 100 - Math.max(0, Math.min(100, (rem/43200000)*100))
    }
  }

  const {h, s} = vibeComment(data, isNight, data?.cloudPct, data?.uvIndex)

  return (
    <div style={{ position:'relative', height:'380px', overflow:'hidden', background: isNight?'#0D1B2A':'#1a3a4a' }}>
      <img key={img} src={img} alt="" onLoad={()=>setLoaded(true)}
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 55%',opacity:loaded?1:0,transition:'opacity 1.4s ease' }} />
      <div style={{ position:'absolute',inset:0, background: isNight
        ? 'linear-gradient(to bottom, rgba(5,10,20,0.5) 0%, rgba(5,10,20,0.72) 60%, rgba(13,27,42,1) 100%)'
        : 'linear-gradient(to bottom, rgba(10,20,30,0.15) 0%, rgba(10,20,30,0.45) 60%, rgba(249,245,238,1) 100%)'
      }} />

      {/* Image dots */}
      <div style={{ position:'absolute', top:'20px', right:'24px', display:'flex', gap:'5px' }}>
        {imgs.map((_,i)=>(
          <div key={i} onClick={()=>{setLoaded(false);setIdx(i)}} style={{ width:i===idx%imgs.length?18:5,height:5,borderRadius:'3px',background:i===idx%imgs.length?'white':'rgba(255,255,255,0.3)',transition:'all 0.3s',cursor:'pointer' }} />
        ))}
      </div>

      {/* Night/Day pill */}
      <div style={{ position:'absolute', top:'16px', left:'24px', display:'flex', alignItems:'center', gap:'6px', background:'rgba(0,0,0,0.28)', padding:'5px 12px', borderRadius:'20px', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)' }}>
        <span>{isNight?'🌙':'☀️'}</span>
        <span style={{ fontFamily:'var(--ff-mono)', fontSize:'11px', color:isNight?'#a5b4fc':'#FFD166' }}>{isNight?'Night Session':'Day Session'}</span>
      </div>

      {/* Bottom content */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 40px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'flex-end', gap:'24px' }}>
          <div>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'clamp(28px,4vw,42px)', fontWeight:600, color:'white', lineHeight:1.15, letterSpacing:'-0.02em', textShadow:'0 2px 20px rgba(0,0,0,0.4)', marginBottom:'8px' }}>{h}</div>
            <div style={{ fontFamily:'var(--ff-body)', fontSize:'14px', color:'rgba(255,255,255,0.72)', fontWeight:300, marginBottom:'18px' }}>{s}</div>
            {/* Sun bar */}
            <div style={{ maxWidth:'440px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--ff-mono)', fontSize:'10px', color:'rgba(255,255,255,0.45)', marginBottom:'5px' }}>
                <span>🌅 Sunrise · {fmtTime(data?.sunriseISO)}</span>
                <span style={{ color:isNight?'#a5b4fc':'#FFD166', fontWeight:500 }}>{remStr}</span>
                <span>🌇 Sunset · {fmtTime(data?.sunsetISO)}</span>
              </div>
              <div style={{ height:'3px', background:'rgba(255,255,255,0.15)', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:isNight?'linear-gradient(90deg,#4338ca,#a5b4fc)':'linear-gradient(90deg,#E9A23B,#FF6B35)', borderRadius:'2px', transition:'width 1s linear' }} />
              </div>
            </div>
          </div>
          {/* Clock */}
          <div style={{ textAlign:'right', color:'white' }}>
            <div style={{ fontFamily:'var(--ff-mono)', fontSize:'38px', fontWeight:300, lineHeight:1, letterSpacing:'0.02em', textShadow:'0 2px 16px rgba(0,0,0,0.4)' }}>{timeStr}</div>
            <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'4px', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              {now.toLocaleDateString('en-US',{timeZone:'America/Los_Angeles',weekday:'long',month:'long',day:'numeric'})}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── SCORE GAUGE (SVG) ────────────────────────────────────────────
function Gauge({ score, color, size=110 }) {
  const r=44, cx=size/2, cy=size/2, sw=6
  const p=a=>{ const rad=(a-90)*(Math.PI/180); return {x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)} }
  const arc=(s,e)=>{ const a=p(s),b=p(e); return `M ${a.x} ${a.y} A ${r} ${r} 0 ${e-s>180?1:0} 1 ${b.x} ${b.y}` }
  const S=135, SW=270, fe=S+(Math.max(0,score)/10)*SW
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={arc(S,S+SW)} fill="none" stroke="rgba(139,111,71,0.1)" strokeWidth={sw} strokeLinecap="round" />
      {score>0&&<path d={arc(S,fe)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" style={{filter:`drop-shadow(0 0 5px ${color}60)`}} />}
      <text x={cx} y={cy-2} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="30" fontFamily="'Fraunces',serif" fontWeight="600">{score}</text>
      <text x={cx} y={cy+18} textAnchor="middle" fill="var(--textl)" fontSize="10" fontFamily="'DM Mono',monospace">/10</text>
    </svg>
  )
}

// ─── CONDITIONS HOME PAGE ─────────────────────────────────────────
function ScoreCard({ title, icon, score, label, color, children }) {
  return (
    <div style={{ background:'var(--card)', borderRadius:'20px', padding:'24px', boxShadow:'var(--sh-md)', border:'1px solid var(--bsoft)', position:'relative', overflow:'hidden', animation:'fadeUp 0.5s ease' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${color},${color}80)` }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
        <div>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:'20px', fontWeight:600, color:'var(--text)', display:'flex', alignItems:'center', gap:'7px' }}>
            <span>{icon}</span>{title}
          </div>
          {label && <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', fontWeight:700, color:label.c, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'4px' }}>{label.t}</div>}
        </div>
        <Gauge score={score} color={color} />
      </div>
      {children}
    </div>
  )
}

function Stat({ label, value, unit, sub }) {
  return (
    <div>
      <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'3px' }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'3px' }}>
        <span style={{ fontFamily:'var(--ff-display)', fontSize:'28px', fontWeight:600, color:'var(--textm)', lineHeight:1 }}>{value??'—'}</span>
        {unit&&<span style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:'var(--textd)' }}>{unit}</span>}
      </div>
      {sub&&<div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'var(--textl)', marginTop:'2px' }}>{sub}</div>}
    </div>
  )
}

function SmTile({ label, value, unit, color }) {
  return (
    <div style={{ background:'var(--sand)', borderRadius:'10px', padding:'10px 12px' }}>
      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>{label}</div>
      <div style={{ fontFamily:'var(--ff-display)', fontSize:'17px', fontWeight:600, color:color||'var(--textm)', lineHeight:1 }}>
        {value??'—'}{value&&unit&&<span style={{ fontSize:'10px', fontWeight:400, color:'var(--textl)', marginLeft:'2px' }}>{unit}</span>}
      </div>
    </div>
  )
}

// Best beach recommendation
function BestBeach({ beaches, windMph }) {
  if (!beaches?.length) return null
  const ranked = [...beaches].map(b=>({...b, score: calcSurfScore({heightFt:b.waveHtFt, periodS:b.wavePer, windMph:windMph??0})})).sort((a,b)=>b.score-a.score)
  const best = ranked[0]
  const lbl  = surfLabel(best.score, best.waveHtFt, best.wavePer)
  const DA = { N:'↓',NNE:'↙',NE:'↙',ENE:'←',E:'←',ESE:'↖',SE:'↖',SSE:'↑',S:'↑',SSW:'↗',SW:'↗',WSW:'→',W:'→',WNW:'↘',NW:'↘',NNW:'↓' }
  const d = best.waveDirDeg!=null ? degToCompass(best.waveDirDeg) : null
  return (
    <div style={{ background:'var(--pacific)', borderRadius:'20px', padding:'24px 28px', boxShadow:'0 8px 32px rgba(31,78,107,0.3)', animation:'fadeUp 0.5s ease 0.1s both' }}>
      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>🎯 Best Surf Bet Right Now</div>
      <div style={{ fontFamily:'var(--ff-display)', fontSize:'28px', fontWeight:600, color:'white', marginBottom:'4px' }}>{best.icon} {best.name}</div>
      <div style={{ fontFamily:'var(--ff-body)', fontSize:'12px', fontWeight:700, color:lbl.c==='#3D5A40'?'#86efac':lbl.c==='#1F4E6B'?'#93c5fd':'#fde68a', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'18px' }}>{lbl.t}</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
        {[{l:'Height',v:best.waveHtFt?.toFixed(1),u:'ft'},{l:'Period',v:best.wavePer?Math.round(best.wavePer):null,u:'s'},{l:'Direction',v:d,extra:d?DA[d]:''}].map(s=>(
          <div key={s.l} style={{ background:'rgba(255,255,255,0.1)', borderRadius:'10px', padding:'10px', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>{s.l}</div>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'20px', fontWeight:600, color:'white' }}>{s.extra}{s.v??'—'}{s.v&&s.u&&<span style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', marginLeft:'2px' }}>{s.u}</span>}</div>
          </div>
        ))}
      </div>
      {/* All spots mini rank */}
      <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
        {ranked.map((b,i)=>(
          <div key={b.id} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontFamily:'var(--ff-mono)', fontSize:'11px', color:'rgba(255,255,255,0.4)', minWidth:'20px' }}>#{i+1}</span>
            <span style={{ fontFamily:'var(--ff-body)', fontSize:'13px', color:'white', flex:1 }}>{b.icon} {b.name}</span>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'60px', height:'3px', background:'rgba(255,255,255,0.15)', borderRadius:'2px' }}>
                <div style={{ height:'100%', width:`${b.score*10}%`, background:'rgba(255,255,255,0.7)', borderRadius:'2px' }} />
              </div>
              <span style={{ fontFamily:'var(--ff-display)', fontSize:'14px', color:'white', fontWeight:600, minWidth:'16px' }}>{b.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConditionsRow({ data, isNight }) {
  if (!data) return null
  const { cloudPct, uvIndex, tempF, waterTempF, tides } = data
  const uvC = uvIndex>=9?'#BC4B51':uvIndex>=6?'#E9A23B':'#3D5A40'
  // Night time → always show "Night Time" regardless of clouds
  const vis = isNight
    ? 'Night Time'
    : cloudPct<20 ? 'High Sun'
    : cloudPct<60 ? 'Partly Cloudy'
    : 'Overcast'
  const visColor = isNight ? '#818cf8' : cloudPct<20 ? '#E9A23B' : undefined
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'10px', animation:'fadeUp 0.5s ease 0.2s both' }}>
      {[
        { label:'Air Temp', value:tempF?Math.round(tempF):null, unit:'°F', color:'white', bg:'var(--pacific)' },
        { label:'Water Temp', value:waterTempF?waterTempF.toFixed(1):null, unit:'°F', color:'var(--pacific)', sub:'NOAA SM Pier' },
        { label:'UV Index', value:uvIndex?.toFixed(1), color:uvC },
        { label:'Cloud Cover', value:cloudPct!=null?Math.round(cloudPct):null, unit:'%' },
        { label:'Visibility', value: isNight ? '🌙 Night Time' : vis, color: visColor },
        { label:'Tides · Today', tides },
      ].map((t,i) => t.tides ? (
        <div key={i} style={{ background:'var(--card)', borderRadius:'14px', padding:'14px', boxShadow:'var(--sh-sm)', border:'1px solid var(--bsoft)' }}>
          <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'8px' }}>🌊 Tides</div>
          {t.tides.map((td,j)=>(
            <div key={j} style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
              <span style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'var(--textd)' }}>{td.time}</span>
              <span style={{ fontFamily:'var(--ff-body)', fontSize:'11px', fontWeight:600, color:td.type==='High'?'var(--pacific)':'var(--textm)' }}>{td.type}</span>
              <span style={{ fontFamily:'var(--ff-display)', fontSize:'12px', fontWeight:600, color:'var(--textm)' }}>{td.ht}ft</span>
            </div>
          ))}
        </div>
      ) : (
        <div key={i} style={{ background:t.bg||'var(--card)', borderRadius:'14px', padding:'14px 16px', boxShadow:'var(--sh-sm)', border:t.bg?'none':'1px solid var(--bsoft)' }}>
          <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', color:t.bg?'rgba(255,255,255,0.6)':'var(--textd)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'5px' }}>{t.label}</div>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:'22px', fontWeight:600, color:t.bg?'white':(t.color||'var(--textm)'), lineHeight:1.1 }}>
            {t.value??'—'}{t.unit&&<span style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:t.bg?'rgba(255,255,255,0.6)':'var(--textd)', marginLeft:'3px' }}>{t.unit}</span>}
          </div>
          {t.sub&&<div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textl)', marginTop:'3px' }}>{t.sub}</div>}
        </div>
      ))}
    </div>
  )
}

function HomePage({ data, loading }) {
  const DA = { N:'↓',NNE:'↙',NE:'↙',ENE:'←',E:'←',ESE:'↖',SE:'↖',SSE:'↑',S:'↑',SSW:'↗',SW:'↗',WSW:'→',W:'→',WNW:'↘',NW:'↘',NNW:'↓' }
  if (loading && !data) return (
    <div style={{ textAlign:'center', padding:'80px 0', fontFamily:'var(--ff-display)', fontSize:'22px', fontStyle:'italic', color:'var(--textd)' }}>
      <span style={{ display:'inline-block', animation:'bob 1.8s ease-in-out infinite', marginRight:'10px' }}>🌊</span>
      Reading the water…
    </div>
  )

  const surfScore = data ? calcSurfScore({ heightFt:data.wvhtFt, periodS:data.dpdS, windMph:data.windMph }) : 0
  const volScore  = data ? calcVolleyScore({ windMph:data.windMph, cloudPct:data.cloudPct }) : 0
  const sLbl = data ? surfLabel(surfScore, data.wvhtFt, data.dpdS) : null
  const vLbl = data ? windLabel(data.windMph) : null
  const wdir = data?.mwdDeg??data?.swellDirDeg
  const wdirStr = wdir!=null ? degToCompass(wdir) : null

  const sa = data ? surfAdvice({ score:surfScore, heightFt:data.wvhtFt, periodS:data.dpdS, windMph:data.windMph, dir:wdir }) : null
  const windDir = data?.windDirDeg!=null ? degToCompass(data.windDirDeg) : null
  const windArr = windDir ? (DA[windDir]||'→') : ''

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      {/* Score cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <ScoreCard title="Surf" icon="🏄" score={surfScore} label={sLbl} color="#1F4E6B">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', paddingBottom:'16px', borderBottom:'1px solid var(--bsoft)', marginBottom:'14px' }}>
            <Stat label="Wave Height" value={data?.wvhtFt?.toFixed(1)} unit="ft" sub={data?.swellHtFt?`${data.swellHtFt.toFixed(1)}ft swell`:null} />
            <Stat label="Period" value={data?.dpdS?Math.round(data.dpdS):null} unit="s" sub={data?.swellPeriod?`${Math.round(data.swellPeriod)}s swell`:null} />
            <div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'3px' }}>Direction</div>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'24px', fontWeight:600, color:'var(--textm)', lineHeight:1, display:'flex', alignItems:'center', gap:'6px' }}>
                {wdirStr&&<span style={{ fontSize:'20px', color:'var(--pacific)' }}>{DA[wdirStr]||'→'}</span>}
                {wdirStr??'—'}
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'14px' }}>
            <SmTile label="Swell Ht" value={data?.swellHtFt?.toFixed(1)} unit="ft" />
            <SmTile label="Swell Per" value={data?.swellPeriod?Math.round(data.swellPeriod):null} unit="s" />
            <SmTile label="Wind Wave" value={data?.windWaveHtFt?.toFixed(1)} unit="ft" />
            <SmTile label="Water °F" value={data?.waterTempF?Math.round(data.waterTempF):null} color="var(--pacific2)" />
          </div>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:'13px', fontStyle:'italic', color:'var(--textm)', lineHeight:1.6, padding:'12px', background:'var(--sand)', borderRadius:'10px' }}>
            "{sa||'Loading wave data…'}"
          </div>
        </ScoreCard>

        <ScoreCard title="Volleyball" icon="🏐" score={volScore} label={vLbl} color="#3D5A40">
          {/* Wind meter */}
          <div style={{ display:'flex', alignItems:'center', gap:'20px', paddingBottom:'16px', borderBottom:'1px solid var(--bsoft)', marginBottom:'14px' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'80px', height:'80px', borderRadius:'50%', background: `${vLbl?.c||'#3D5A40'}12`, border:`2px solid ${vLbl?.c||'#3D5A40'}30`, flexShrink:0 }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'26px', fontWeight:600, color:vLbl?.c||'#3D5A40', lineHeight:1 }}>{data?.windMph?.toFixed(0)??'—'}</div>
              <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textd)' }}>mph</div>
            </div>
            <div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'4px' }}>Ball Drift</div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                {windArr&&<span style={{ fontSize:'24px', color:vLbl?.c||'#3D5A40' }}>{windArr}</span>}
                <div>
                  <div style={{ fontFamily:'var(--ff-display)', fontSize:'16px', fontWeight:600, color:vLbl?.c||'var(--textm)' }}>{vLbl?.t??'—'}</div>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textd)', marginTop:'2px' }}>
                    {data?.windMph<=5?'Zero drift · Perfect setting':data?.windMph<=12?'Slight drift · Use the wind':data?.windMph<=20?'3ft off net · Sets low':'Sand flying · Hero serves only'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'14px' }}>
            <SmTile label="UV Index" value={data?.uvIndex?.toFixed(1)} color={data?.uvIndex>=9?'#BC4B51':data?.uvIndex>=6?'#E9A23B':'#3D5A40'} />
            <SmTile label="Cloud" value={data?.cloudPct!=null?Math.round(data.cloudPct):null} unit="%" />
            <SmTile label="Air Temp" value={data?.tempF?Math.round(data.tempF):null} unit="°F" />
          </div>
          <div style={{ fontFamily:'var(--ff-display)', fontSize:'13px', fontStyle:'italic', color:'var(--textm)', lineHeight:1.6, padding:'12px', background:'var(--sand)', borderRadius:'10px' }}>
            "{windDir?`${windDir} at ${data?.windMph?.toFixed(0)}mph — ${data?.windMph<=5?'zero drift, perfect setting conditions':data?.windMph<=12?'slight drift, use wind on float serves':data?.windMph<=20?'heavy drift, keep sets low and 3ft off net':'sand flying, hero serves only'}.`:'Loading wind data…'}"
          </div>
        </ScoreCard>
      </div>

      {/* Conditions strip */}
      <ConditionsRow data={data} isNight={isNight} />

      {/* Best beach */}
      <BestBeach beaches={data?.beaches} windMph={data?.windMph} />
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const { data, loading, error, lastFetch, refetch } = useStationData()
  const [page, setPage] = useState('home')
  const isNight = isNightTime(data?.sunriseISO, data?.sunsetISO)

  useEffect(() => {
    document.body.style.background = isNight && page==='home' ? 'var(--night)' : 'var(--linen)'
  }, [isNight, page])

  const wrap = { maxWidth:'1200px', margin:'0 auto', padding:'0 28px 60px' }

  return (
    <div style={{ minHeight:'100vh', background: isNight&&page==='home' ? 'var(--night)' : 'var(--linen)' }}>
      <Nav page={page} setPage={setPage} isNight={isNight&&page==='home'} />

      {page === 'home' && <Hero data={data} isNight={isNight} />}

      <div style={wrap}>
        {error && (
          <div style={{ background:'rgba(188,75,81,0.08)', border:'1px solid rgba(188,75,81,0.2)', borderRadius:'12px', padding:'12px 20px', margin:'20px 0', fontFamily:'var(--ff-body)', fontSize:'13px', color:'var(--coral)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={refetch} style={{ padding:'6px 14px', background:'transparent', border:'1px solid var(--coral)', borderRadius:'7px', color:'var(--coral)', cursor:'pointer', fontFamily:'var(--ff-body)', fontSize:'12px' }}>Retry</button>
          </div>
        )}

        {page === 'home'     && <div style={{ paddingTop:'28px' }}><HomePage data={data} loading={loading} /></div>}
        {page === 'spots'    && <div style={{ paddingTop:'28px' }}><MapPage data={data} /></div>}
        {page === 'calendar' && <div style={{ paddingTop:'28px' }}><CalendarPage /></div>}
        {page === 'buoys'    && <div style={{ paddingTop:'28px' }}><BuoyPage data={data} lastFetch={lastFetch} /></div>}
        {page === 'cams'     && <div style={{ paddingTop:'28px' }}><CamsPage /></div>}

        {lastFetch && page==='home' && (
          <div style={{ textAlign:'center', marginTop:'32px', fontFamily:'var(--ff-mono)', fontSize:'10px', color: isNight?'rgba(255,255,255,0.2)':'var(--textl)', letterSpacing:'0.04em' }}>
            Marine data · Open-Meteo · Water temp · NOAA CO-OPS 9410840 · Refreshed {lastFetch.toLocaleTimeString('en-US',{timeZone:'America/Los_Angeles',hour:'numeric',minute:'2-digit'})} · Auto-refreshes every 30min
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { calcSurfScore, surfLabel, degToCompass } from './logic'

const SPOTS = [
  { id:'marine',       name:'Marine St Courts',     sub:'Manhattan Beach',   tag:'Pro Focus',     lat:33.8853, lon:-118.4104, color:'#1F4E6B', popup:'Pro-level · 6 courts · Lights\nBest: A / Open pickup' },
  { id:'mb-pier',      name:'MB Pier Courts',        sub:'Manhattan Beach',   tag:'Iconic',        lat:33.8842, lon:-118.4097, color:'#1F4E6B', popup:'Most famous courts in the world\nAVP history · All levels' },
  { id:'22nd',         name:'22nd St Courts',        sub:'Manhattan Beach',   tag:'High Level',    lat:33.8817, lon:-118.4117, color:'#1F4E6B', popup:'High-intermediate · 4 courts\nBest: BB / A competitive' },
  { id:'hermosa-pier', name:'Hermosa Pier Courts',   sub:'Hermosa Beach ⭐',  tag:'Home Court',    lat:33.8622, lon:-118.4023, color:'#BC4B51', popup:'Challenge court culture · All day\nBest social scene on the Strand' },
  { id:'hermosa-12th', name:'12th St Courts',        sub:'Hermosa Beach',     tag:'Intermediate',  lat:33.8602, lon:-118.4018, color:'#BC4B51', popup:'Great intermediate scene · Best: BB' },
  { id:'hermosa-6th',  name:'6th St Courts',         sub:'Hermosa Beach',     tag:'Mixed',         lat:33.8568, lon:-118.3999, color:'#BC4B51', popup:'Mixed levels · Good scene · B/BB' },
  { id:'knob-hill',    name:'Knob Hill Courts',      sub:'811 Esplanade, Redondo', tag:'Thu/Sat/Sun', lat:33.8285, lon:-118.3905, color:'#3D5A40', popup:'📅 Thu 2pm · Sat/Sun 2pm (Int/Adv)\nOrganized pickup · All welcome' },
  { id:'ave-g',        name:'Ave G Courts',          sub:'Redondo · Esplanade',tag:'Sat/Sun Beginner', lat:33.8241, lon:-118.3897, color:'#3D5A40', popup:'📅 Sat/Sun 2pm\nFriendly beginner scene' },
  { id:'redondo',      name:'Redondo Esplanade',     sub:'Redondo Beach',     tag:'Wind Protected', lat:33.8304, lon:-118.3905, color:'#3D5A40', popup:'Wind-protected by breakwater\nBest on heavy wind days' },
  { id:'dockweiler',   name:'Dockweiler Courts',     sub:'Playa del Rey',     tag:'Night Play',    lat:33.9297, lon:-118.4272, color:'#8B6F47', popup:'Lit courts · Fire pits\nGreat evening sessions' },
]

const CREAMYBOYS = [
  { id:'cb1', name:'Creamy Boys Hermosa', lat:33.8619, lon:-118.3997, addr:'1136 Hermosa Ave' },
  { id:'cb2', name:'Creamy Boys El Segundo', lat:33.9189, lon:-118.4167, addr:'118 W Grand Ave' },
]

const mkIcon = (color, active) => L.divIcon({
  html:`<div style="width:${active?14:9}px;height:${active?14:9}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 10px ${color}80;"></div>`,
  className:'', iconSize:[active?14:9,active?14:9], iconAnchor:[active?7:4,active?7:4],
})

export default function MapPage({ data }) {
  const mapRef = useRef(null), mapObj = useRef(null), marks = useRef({})
  const [active, setActive] = useState(null)
  const beaches = data?.beaches || []

  useEffect(() => {
    if (mapObj.current) return
    const map = L.map(mapRef.current, { center:[33.862,-118.401], zoom:13, zoomControl:false })
    L.control.zoom({ position:'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution:'&copy; CARTO', subdomains:'abcd', maxZoom:19 }).addTo(map)

    // Buoys
    ;[{lat:33.755,lon:-119.045,id:'46025',c:'#1F4E6B',desc:'Offshore · Period + Direction'},{lat:33.860,lon:-118.641,id:'46221',c:'#3D5A40',desc:'Inner · Wave Height'}].forEach(b=>{
      L.marker([b.lat,b.lon],{icon:L.divIcon({html:`<div style="width:8px;height:8px;border-radius:50%;background:${b.c};border:2px solid white;box-shadow:0 0 6px ${b.c}"></div>`,className:'',iconSize:[8,8],iconAnchor:[4,4]})})
        .addTo(map).bindPopup(`<b style="color:${b.c}">${b.id}</b><br><span style="font-size:11px;color:#5c4f3a">${b.desc}</span>`)
    })

    // Creamy Boys
    CREAMYBOYS.forEach(cb=>{
      L.marker([cb.lat,cb.lon],{icon:L.divIcon({html:'<div style="width:13px;height:13px;border-radius:50%;background:#f472b6;border:2px solid white;box-shadow:0 2px 8px rgba(244,114,182,0.6);display:flex;align-items:center;justify-content:center;font-size:8px;">🍦</div>',className:'',iconSize:[13,13],iconAnchor:[6,6]})})
        .addTo(map).bindPopup(`<b style="color:#db2777">${cb.name}</b><br><span style="font-size:11px;color:#5c4f3a">${cb.addr}</span><br><span style="font-size:10px;color:#db2777">Mon–Thu 12–10 · Fri–Sat 12–11</span>`)
    })

    SPOTS.forEach(spot=>{
      const m=L.marker([spot.lat,spot.lon],{icon:mkIcon(spot.color,false)}).addTo(map)
        .bindPopup(`<div style="font-family:'DM Sans',sans-serif"><b style="color:${spot.color};font-size:13px">${spot.name}</b><br><span style="font-size:11px;color:#5c4f3a">${spot.sub}</span><br><span style="font-size:11px;white-space:pre-line;color:#4A3728">${spot.popup}</span></div>`,{maxWidth:220})
      m.on('click',()=>setActive(spot.id))
      marks.current[spot.id]={m,color:spot.color}
    })
    mapObj.current=map
  },[])

  useEffect(()=>{
    SPOTS.forEach(s=>{
      const e=marks.current[s.id]; if(!e) return
      const a=s.id===active
      e.m.setIcon(mkIcon(e.color,a))
      if(a){mapObj.current?.flyTo([s.lat,s.lon],15,{duration:1.2});e.m.openPopup()}
    })
  },[active])

  return (
    <div>
      <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'34px', fontWeight:600, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:'4px' }}>Spots & Map</h1>
      <p style={{ fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textd)', marginBottom:'24px' }}>All volleyball courts, surf spots, and live wave conditions per beach</p>

      {/* Per-beach wave grid */}
      {beaches.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'10px', marginBottom:'24px' }}>
          {beaches.map(b=>{
            const score = calcSurfScore({heightFt:b.waveHtFt, periodS:b.wavePer, windMph:data?.windMph??0})
            const lbl = surfLabel(score, b.waveHtFt, b.wavePer)
            const dir = b.waveDirDeg!=null ? degToCompass(b.waveDirDeg) : '—'
            return (
              <div key={b.id} style={{ background:'var(--card)', borderRadius:'14px', padding:'16px', boxShadow:'var(--sh-sm)', border:'1px solid var(--bsoft)' }}>
                <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>{b.icon} {b.name}</div>
                <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', fontWeight:700, color:lbl.c, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' }}>{lbl.t}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
                  {[{l:'Height',v:b.waveHtFt?.toFixed(1),u:'ft'},{l:'Period',v:b.wavePer?Math.round(b.wavePer):null,u:'s'},{l:'Swell',v:b.swellHtFt?.toFixed(1),u:'ft'},{l:'Dir',v:dir}].map(s=>(
                    <div key={s.l} style={{ background:'var(--sand)', borderRadius:'7px', padding:'7px 8px' }}>
                      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textd)', textTransform:'uppercase', marginBottom:'2px' }}>{s.l}</div>
                      <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:'var(--textm)' }}>{s.v??'—'}{s.v&&s.u&&<span style={{ fontSize:'9px', color:'var(--textd)', marginLeft:'1px' }}>{s.u}</span>}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:'8px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <div style={{ flex:1, height:'3px', background:'rgba(139,111,71,0.1)', borderRadius:'2px' }}>
                      <div style={{ height:'100%', width:`${score*10}%`, background:lbl.c, borderRadius:'2px' }} />
                    </div>
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:'14px', fontWeight:600, color:lbl.c }}>{score}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px' }}>
        <div ref={mapRef} style={{ height:'460px', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--sh-md)' }} />
        <div style={{ display:'flex', flexDirection:'column', gap:'7px', overflowY:'auto', maxHeight:'460px' }}>
          {SPOTS.map(spot=>(
            <div key={spot.id} onClick={()=>setActive(spot.id===active?null:spot.id)}
              style={{ background:spot.id===active?spot.color:spot.id==='hermosa-pier'?'#fff8f0':'var(--card)', border:`1px solid ${spot.id===active?spot.color:spot.id==='hermosa-pier'?spot.color+'40':'var(--bsoft)'}`, borderRadius:'10px', padding:'11px 13px', cursor:'pointer', boxShadow:'var(--sh-sm)', transition:'all 0.15s' }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'13px', fontWeight:600, color:spot.id===active?'white':'var(--text)' }}>{spot.id==='hermosa-pier'?'⭐ ':''}{spot.name}</div>
              <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:spot.id===active?'rgba(255,255,255,0.6)':'var(--textd)', margin:'3px 0 5px' }}>{spot.sub}</div>
              <span style={{ fontFamily:'var(--ff-body)', fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'10px', background:spot.id===active?'rgba(255,255,255,0.2)':spot.color+'15', color:spot.id===active?'white':spot.color }}>{spot.tag}</span>
            </div>
          ))}
          <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'#db2777', fontWeight:600, marginTop:'8px', paddingTop:'10px', borderTop:'1px solid rgba(244,114,182,0.2)' }}>🍦 Creamy Boys</div>
          {CREAMYBOYS.map(cb=>(
            <div key={cb.id} style={{ background:'#fff5fb', border:'1px solid rgba(244,114,182,0.2)', borderRadius:'10px', padding:'10px 13px', boxShadow:'var(--sh-sm)' }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'13px', fontWeight:600, color:'#be185d' }}>🍦 {cb.name}</div>
              <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'#9d174d', marginTop:'2px' }}>{cb.addr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

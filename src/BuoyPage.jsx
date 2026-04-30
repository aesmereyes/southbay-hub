import { degToCompass } from './logic'

const STATIONS = [
  { id:'46025', nick:'The Outer Scout',    color:'#1F4E6B', icon:'🌊', name:'Santa Monica Basin',  depth:'890m', role:'Period + Direction', tip:'Deep water truth. 16s+ here = big energy incoming. No island shadow. Always check this first.' },
  { id:'46221', nick:'The Inner Confirm',  color:'#3D5A40', icon:'📡', name:'Santa Monica Bay',    depth:'387m', role:'Wave Height',        tip:'What actually makes it through Catalina\'s shadow. If smaller than 46025, the islands blocked the swell.' },
  { id:'46268', nick:'North Sentinel',     color:'#2C7DA0', icon:'🏄', name:'Topanga Nearshore',   depth:'~20m', role:'NW Early Warning',   tip:'NW swells hit here first. Firing at 12s+? South Bay gets it within the hour.' },
  { id:'ICAC1', nick:'Shore Station',      color:'#8B6F47', icon:'🌬', name:'Santa Monica Pier',   depth:'Shore', role:'Wind & Tide',       tip:'Ground-level conditions. Cross-reference wind here vs Open-Meteo — if they match, trust the forecast.' },
  { id:'46222', nick:'South Sentinel',     color:'#E9A23B', icon:'🧭', name:'San Pedro',           depth:'483m', role:'South Swell Detector',tip:'South swells come up from below PV. Height + period here means Redondo south end is already on.' },
  { id:'46253', nick:"Redondo's Backyard", color:'#BC4B51', icon:'🎯', name:'San Pedro South',     depth:'66m',  role:'Redondo Nearshore',  tip:'Closest nearshore station to Redondo. Shows height → Breakwater and King Harbor are firing.' },
]

function pill(v, n) {
  return <span style={{ fontFamily:'var(--ff-mono)', fontSize:'12px', fontWeight:500, color: v!=null?n:'var(--textl)' }}>{v!=null?v:'—'}</span>
}

export default function BuoyPage({ data, lastFetch }) {
  const stations = data?.stations || {}
  const live = STATIONS.filter(s=>stations[s.id]?.ok).length
  const mins = lastFetch ? Math.round((Date.now()-new Date(data?.buoyFetchedAt||lastFetch))/60000) : null
  const ageStr = mins===null?'':mins<2?'Just updated':mins<60?`${mins}min ago`:`${Math.floor(mins/60)}h ${mins%60}m ago`

  return (
    <div>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'34px', fontWeight:600, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:'4px' }}>Buoy Network</h1>
        <p style={{ fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textd)' }}>
          {live}/{STATIONS.length} stations live · {ageStr} · Updated hourly by GitHub Actions
        </p>
      </div>

      <div style={{ background:'var(--card)', borderRadius:'14px', padding:'14px 18px', marginBottom:'20px', boxShadow:'var(--sh-sm)', border:'1px solid var(--bsoft)', display:'flex', gap:'20px', flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ fontFamily:'var(--ff-body)', fontSize:'11px', fontWeight:600, color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.08em' }}>How to read:</span>
        {[['#1F4E6B','46025 + 46221 → Surf score inputs'],['#2C7DA0','46268 → NW early warning'],['#BC4B51','46253 → Redondo real-time'],['#E9A23B','46222 → South swell detector']].map(([c,t])=>(
          <div key={t} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:c, flexShrink:0 }} />
            <span style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textm)' }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
        {STATIONS.map(meta => {
          const st = stations[meta.id]
          const d  = st?.data
          const ok = st?.ok
          return (
            <div key={meta.id} style={{ background:'var(--card)', borderRadius:'16px', padding:'20px', boxShadow:'var(--sh-sm)', border:'1px solid var(--bsoft)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'3px', background:ok?meta.color:'var(--drift)', opacity:ok?1:0.3 }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <div>
                  <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:ok?meta.color:'var(--textd)' }}>{meta.icon} {meta.nick}</div>
                  <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'var(--textd)', marginTop:'2px' }}>{meta.id} · {meta.name} · {meta.depth}</div>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:meta.color, fontWeight:500, marginTop:'3px' }}>{meta.role}</div>
                </div>
                <span style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', padding:'3px 9px', borderRadius:'20px', background:ok?`${meta.color}12`:'var(--sand)', color:ok?meta.color:'var(--textd)', border:`1px solid ${ok?meta.color+'25':'var(--border)'}` }}>
                  {ok?'● Live':'○ No data'}
                </span>
              </div>
              <div style={{ display:'flex', gap:'7px', flexWrap:'wrap', marginBottom:'12px' }}>
                {[['Height', d?.wvht_ft!=null?d.wvht_ft.toFixed(1):null, 'ft'], ['Period', d?.dpd_s?Math.round(d.dpd_s):null, 's'], ['Dir', d?.mwd_deg!=null?degToCompass(d.mwd_deg):null], ['Wind', d?.wspd_mph?.toFixed(0), 'mph'], ['Water', d?.wtmp_f?Math.round(d.wtmp_f):null, '°F']].map(([l,v,u])=>(
                  <div key={l} style={{ background:'var(--sand)', borderRadius:'8px', padding:'7px 10px', textAlign:'center', minWidth:'52px' }}>
                    <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textd)', textTransform:'uppercase', marginBottom:'2px' }}>{l}</div>
                    <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:ok&&v?meta.color:'var(--textl)', lineHeight:1 }}>{v??'—'}{v&&u?<span style={{ fontSize:'9px', color:'var(--textd)' }}>{u}</span>:''}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textd)', lineHeight:1.5, fontStyle:'italic', paddingTop:'10px', borderTop:'1px solid var(--bsoft)' }}>{meta.tip}</div>
              {d?.timestamp && <div style={{ fontFamily:'var(--ff-mono)', fontSize:'9px', color:'var(--textl)', marginTop:'8px', textAlign:'right' }}>{d.timestamp}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

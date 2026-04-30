import { degToCompass } from './logic'

const STATION_META = {
  '46025': { nick:'The Outer Scout',    color:'#1F4E6B', icon:'🌊', name:'Santa Monica Basin', depth:'890m', role:'Period + Direction', tip:'Deep water truth · No island shadow · If 16s+ here, big energy is headed to South Bay.' },
  '46221': { nick:'The Inner Confirm',  color:'#3D5A40', icon:'📡', name:'Santa Monica Bay',   depth:'387m', role:'Wave Height confirm', tip:"What actually makes it through Catalina's shadow. Compare with 46025 to see island blocking." },
  '46268': { nick:'North Sentinel',     color:'#2C7DA0', icon:'🏄', name:'Topanga Nearshore',  depth:'~20m', role:'NW Early Warning',   tip:'NW swells hit here first. Firing at 12s+? South Bay gets it within the hour.' },
  'ICAC1': { nick:'Shore Station',      color:'#8B6F47', icon:'🌬', name:'Santa Monica Pier',  depth:'Shore', role:'Wind & Tide',       tip:'Ground-level wind + tide. If this matches Open-Meteo, trust the forecast.' },
  '46222': { nick:'South Sentinel',     color:'#E9A23B', icon:'🧭', name:'San Pedro',          depth:'483m', role:'South Swell Detector', tip:'South swells arrive here first. Height + period here = Redondo south end is already on.' },
  '46253': { nick:"Redondo's Backyard", color:'#BC4B51', icon:'🎯', name:'San Pedro South',    depth:'66m',  role:'Redondo Nearshore',  tip:'Closest nearshore station to Redondo. Shows height → Breakwater and King Harbor are firing.' },
}

const ORDER = ['46025','46221','46268','ICAC1','46222','46253']

// Realistic placeholder data for when GitHub Actions hasn't fetched yet
// Based on typical South Bay spring conditions
const PLACEHOLDER = {
  '46025': { wvht_ft:2.3, dpd_s:10, mwd_deg:285, wspd_mph:8.4, wtmp_f:null, timestamp:'Awaiting live fetch — typical spring values shown' },
  '46221': { wvht_ft:1.9, dpd_s:10, mwd_deg:280, wspd_mph:7.1, wtmp_f:60.2, timestamp:'Awaiting live fetch — typical spring values shown' },
  '46268': { wvht_ft:2.6, dpd_s:9,  mwd_deg:295, wspd_mph:9.2, wtmp_f:61.0, timestamp:'Awaiting live fetch — typical spring values shown' },
  'ICAC1': { wvht_ft:null,dpd_s:null,mwd_deg:null,wspd_mph:6.8, wtmp_f:null, timestamp:'Awaiting live fetch — typical spring values shown' },
  '46222': { wvht_ft:1.4, dpd_s:8,  mwd_deg:270, wspd_mph:7.4, wtmp_f:59.8, timestamp:'Awaiting live fetch — typical spring values shown' },
  '46253': { wvht_ft:1.2, dpd_s:8,  mwd_deg:268, wspd_mph:6.5, wtmp_f:59.5, timestamp:'Awaiting live fetch — typical spring values shown' },
}

function BuoyCard({ meta, station }) {
  const isLive    = station?.ok === true
  const isWaiting = !station || station.ok === false
  // Use real data if live, placeholder if not — always show something meaningful
  const d = isLive ? station.data : PLACEHOLDER[meta.id]
  const isPlaceholder = !isLive

  return (
    <div style={{ background:'var(--card)',borderRadius:'16px',padding:'20px',
      boxShadow:'var(--sh-sm)',border:'1px solid var(--bsoft)',
      position:'relative',overflow:'hidden' }}>
      {/* Left accent bar */}
      <div style={{ position:'absolute',top:0,left:0,bottom:0,width:'3px',
        background:meta.color,opacity:isLive?1:0.4 }} />

      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px' }}>
        <div>
          <div style={{ fontFamily:'var(--ff-display)',fontSize:'15px',fontWeight:600,
            color:meta.color,marginBottom:'2px' }}>{meta.icon} {meta.nick}</div>
          <div style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'var(--textd)' }}>
            {meta.id} · {meta.name} · {meta.depth}
          </div>
          <div style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:meta.color,fontWeight:500,marginTop:'2px' }}>
            {meta.role}
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px' }}>
          <span style={{ fontFamily:'var(--ff-mono)',fontSize:'9px',padding:'3px 9px',borderRadius:'20px',
            background:isLive?`${meta.color}15`:'rgba(233,162,59,0.1)',
            color:isLive?meta.color:'#E9A23B',
            border:`1px solid ${isLive?meta.color+'25':'rgba(233,162,59,0.3)'}` }}>
            {isLive ? '● Live' : '◐ Est.'}
          </span>
        </div>
      </div>

      {/* Data pills */}
      <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px' }}>
        {[
          ['Height', d?.wvht_ft!=null?d.wvht_ft.toFixed(1):null, 'ft'],
          ['Period', d?.dpd_s?Math.round(d.dpd_s):null, 's'],
          ['Dir',    d?.mwd_deg!=null?degToCompass(d.mwd_deg):null, ''],
          ['Wind',   d?.wspd_mph?.toFixed(0), 'mph'],
          ['Water',  d?.wtmp_f?Math.round(d.wtmp_f):null, '°F'],
        ].map(([l,v,u])=>(
          <div key={l} style={{ background:'var(--sand)',borderRadius:'8px',
            padding:'7px 10px',textAlign:'center',minWidth:'52px' }}>
            <div style={{ fontFamily:'var(--ff-mono)',fontSize:'9px',color:'var(--textd)',
              textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'2px' }}>{l}</div>
            <div style={{ fontFamily:'var(--ff-display)',fontSize:'16px',fontWeight:600,
              color: v?meta.color:'var(--textl)',lineHeight:1,
              opacity:isPlaceholder&&v?0.75:1 }}>
              {v??'—'}{v&&u?<span style={{ fontSize:'9px',color:'var(--textd)' }}>{u}</span>:''}
            </div>
          </div>
        ))}
      </div>

      {isPlaceholder && (
        <div style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'#E9A23B',
          background:'rgba(233,162,59,0.08)',borderRadius:'7px',padding:'6px 10px',
          marginBottom:'10px',border:'1px solid rgba(233,162,59,0.2)' }}>
          📊 Estimated — typical spring conditions · Live data fetches hourly via GitHub Actions
        </div>
      )}

      <div style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textd)',
        lineHeight:1.5,fontStyle:'italic',paddingTop:'10px',borderTop:'1px solid var(--bsoft)' }}>
        {meta.tip}
      </div>
      {d?.timestamp && (
        <div style={{ fontFamily:'var(--ff-mono)',fontSize:'9px',color:'var(--textl)',
          marginTop:'6px',textAlign:'right' }}>{d.timestamp}</div>
      )}
    </div>
  )
}

export default function BuoyPage({ data, lastFetch }) {
  const stations = data?.stations || {}
  const liveCount = ORDER.filter(id => stations[id]?.ok).length
  const fetched = data?.buoyFetchedAt
  const mins = fetched ? Math.round((Date.now()-new Date(fetched))/60000) : null
  const ageStr = mins===null ? 'Not yet fetched' :
    mins<2 ? 'Just updated' :
    mins<60 ? `${mins}min ago` :
    `${Math.floor(mins/60)}h ${mins%60}m ago`

  const allEstimated = liveCount === 0

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontFamily:'var(--ff-display)',fontSize:'34px',fontWeight:600,
          color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px' }}>Buoy Network</h1>
        <p style={{ fontFamily:'var(--ff-body)',fontSize:'14px',color:'var(--textd)',marginBottom:'8px' }}>
          {liveCount}/{ORDER.length} stations live · {ageStr}
        </p>
        {allEstimated && (
          <div style={{ background:'rgba(233,162,59,0.1)',border:'1px solid rgba(233,162,59,0.3)',
            borderRadius:'10px',padding:'12px 16px',fontFamily:'var(--ff-body)',
            fontSize:'13px',color:'#8B6F00',lineHeight:1.5 }}>
            <strong>📊 Showing estimated typical conditions</strong> — Live NOAA buoy data is fetched hourly
            by GitHub Actions. Go to <strong>Actions → Fetch Buoy Data → Run workflow</strong> to pull
            fresh readings now. Until then, values shown reflect typical South Bay spring conditions.
          </div>
        )}
      </div>

      {/* Reading guide */}
      <div style={{ background:'var(--card)',borderRadius:'12px',padding:'14px 18px',
        marginBottom:'20px',boxShadow:'var(--sh-sm)',border:'1px solid var(--bsoft)',
        display:'flex',gap:'20px',flexWrap:'wrap',alignItems:'center' }}>
        <span style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textd)',
          fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em' }}>How to read:</span>
        {[['#1F4E6B','46025+46221 → Surf score'],['#2C7DA0','46268 → NW warning'],
          ['#BC4B51','46253 → Redondo live'],['#E9A23B','46222 → South swell']].map(([c,t])=>(
          <div key={t} style={{ display:'flex',alignItems:'center',gap:'6px' }}>
            <div style={{ width:'8px',height:'8px',borderRadius:'50%',background:c,flexShrink:0 }} />
            <span style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textm)' }}>{t}</span>
          </div>
        ))}
        <span style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'var(--textl)',marginLeft:'auto' }}>
          ● Live = real NOAA data · ◐ Est. = typical conditions
        </span>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px' }}>
        {ORDER.map(id => (
          <BuoyCard key={id} meta={STATION_META[id]} station={stations[id]} />
        ))}
      </div>
    </div>
  )
}

function Tile({ emoji, label, value, unit, color, highlight, sub }) {
  return (
    <div style={{ background: highlight?'var(--pacific)':'var(--card)', borderRadius:'14px', padding:'16px 18px', boxShadow:'var(--shadow-sm)', border: highlight?'none':'1px solid var(--border-soft)', display:'flex', flexDirection:'column', gap:'3px' }}>
      <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:highlight?'rgba(255,255,255,0.6)':'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500 }}>{emoji} {label}</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:highlight?'white':(color||'var(--text-mid)'), lineHeight:1.1 }}>
        {value ?? '—'}
        {unit && <span style={{ fontFamily:'var(--font-body)', fontSize:'13px', color:highlight?'rgba(255,255,255,0.65)':'var(--text-muted)', fontWeight:400, marginLeft:'3px' }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:highlight?'rgba(255,255,255,0.45)':'var(--text-light)', marginTop:'1px' }}>{sub}</div>}
    </div>
  )
}

function TideTile({ tides }) {
  if (!tides?.length) return (
    <div style={{ background:'var(--card)', borderRadius:'14px', padding:'16px 18px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border-soft)' }}>
      <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'6px' }}>🌊 Tides Today</div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'14px', color:'var(--text-light)' }}>—</div>
    </div>
  )
  return (
    <div style={{ background:'var(--card)', borderRadius:'14px', padding:'14px 16px', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border-soft)' }}>
      <div style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:500, marginBottom:'8px' }}>🌊 Tides · Santa Monica</div>
      <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
        {tides.slice(0,4).map((t,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-muted)' }}>{t.time.split(' ')[1]}</span>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:600, color: t.type==='High'?'var(--pacific)':'var(--text-mid)' }}>{t.type}</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:700, color:'var(--text-mid)' }}>{t.height}ft</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ConditionsStrip({ data }) {
  if (!data) return null
  const { cloudPct, uvIndex, tempF, waterTempF, tides } = data
  const uvColor = uvIndex >= 8?'#C4614A':uvIndex>=6?'#E8934A':'#4a7c59'
  const vis = cloudPct < 20?'High Sun':cloudPct<60?'Partly Cloudy':'Overcast'

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'10px', margin:'0 0 32px', position:'relative', zIndex:1 }}>
      <Tile emoji="🌡" label="Air Temp"    value={tempF?Math.round(tempF):null}             unit="°F"  highlight />
      <Tile emoji="🌊" label="Water Temp"  value={waterTempF?waterTempF.toFixed(1):null}    unit="°F"  color="var(--pacific)" sub="NOAA Santa Monica Pier" />
      <Tile emoji="☀️" label="UV Index"    value={uvIndex?.toFixed(1)}                       color={uvColor} />
      <Tile emoji="☁️" label="Cloud Cover" value={cloudPct!=null?Math.round(cloudPct):null} unit="%" />
      <Tile emoji="👁" label="Visibility"  value={vis} color={cloudPct<20?'#E8934A':undefined} />
      <TideTile tides={tides} />
    </div>
  )
}

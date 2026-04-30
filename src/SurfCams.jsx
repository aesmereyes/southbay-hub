// HDOnTap live cams — these are public streams that load directly
// We link to them since embed requires HDOnTap account
const CAMS = [
  {
    id: 'mb-pier-south',
    name: 'Manhattan Beach Pier South',
    sub: 'South of the pier · surf check',
    url: 'https://hdontap.com/stream/405464/manhattan-beach-pier-south-live-webcam/',
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=70',
    badge: 'MB Pier',
    color: '#2C5F78',
  },
  {
    id: 'mb-pier-north',
    name: 'Manhattan Beach Pier North',
    sub: 'North of the pier · El Porto view',
    url: 'https://hdontap.com/stream/855798/manhattan-beach-pier-north-live-cam/',
    thumb: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&auto=format&fit=crop&q=70',
    badge: 'El Porto',
    color: '#2C5F78',
  },
  {
    id: 'hermosa-north',
    name: 'Hermosa Beach North',
    sub: 'North of pier · surf + volleyball',
    url: 'https://hdontap.com/stream/199895/hermosa-beach-north-live-webcam/',
    thumb: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&auto=format&fit=crop&q=70',
    badge: '⭐ Hermosa',
    color: '#C4614A',
  },
  {
    id: 'hermosa-south',
    name: 'Hermosa Beach South',
    sub: 'South of pier · mellower waves',
    url: 'https://hdontap.com/stream/417105/hermosa-beach-south-live-surf-cam/',
    thumb: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=70',
    badge: 'Hermosa S',
    color: '#C4614A',
  },
  {
    id: 'mb-ultra',
    name: 'Manhattan Beach Ultra HD',
    sub: 'Pier panoramic · best quality',
    url: 'https://hdontap.com/stream/126730/manhattan-beach-pier-ultra-hd-live-webcam/',
    thumb: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=70',
    badge: 'Ultra HD',
    color: '#4a7c59',
  },
  {
    id: 'el-porto',
    name: 'El Porto · Manhattan Beach',
    sub: 'Heavy beach break · local favorite',
    url: 'https://hdontap.com/stream/256987/el-porto-manhattan-beach-live-webcam/',
    thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=70',
    badge: 'El Porto',
    color: '#E8934A',
  },
]

function CamCard({ cam }) {
  return (
    <a href={cam.url} target="_blank" rel="noopener noreferrer"
      style={{ display:'block', textDecoration:'none', borderRadius:'14px', overflow:'hidden', boxShadow:'var(--shadow-md)', border:'1px solid var(--border-soft)', position:'relative', background:'var(--card)', transition:'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-md)' }}>
      {/* Thumbnail with play overlay */}
      <div style={{ position:'relative', height:'140px', overflow:'hidden' }}>
        <img src={cam.thumb} alt={cam.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(5,12,22,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
            <div style={{ width:0, height:0, borderTop:'9px solid transparent', borderBottom:'9px solid transparent', borderLeft:`15px solid ${cam.color}`, marginLeft:'3px' }} />
          </div>
        </div>
        {/* Live badge */}
        <div style={{ position:'absolute', top:'10px', left:'10px', background:'rgba(196,97,74,0.9)', color:'white', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:600, padding:'3px 8px', borderRadius:'6px', letterSpacing:'0.06em', display:'flex', alignItems:'center', gap:'5px' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'white', animation:'pulse 1.5s ease-in-out infinite', display:'inline-block' }} />
          LIVE
        </div>
        {/* Beach badge */}
        <div style={{ position:'absolute', top:'10px', right:'10px', background:cam.color, color:'white', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:600, padding:'3px 10px', borderRadius:'6px', letterSpacing:'0.04em' }}>
          {cam.badge}
        </div>
      </div>
      {/* Info */}
      <div style={{ padding:'12px 14px' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'3px' }}>{cam.name}</div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--text-muted)' }}>{cam.sub}</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:cam.color, marginTop:'6px', fontWeight:500 }}>
          Opens HDOnTap live stream ↗
        </div>
      </div>
    </a>
  )
}

export default function SurfCams() {
  return (
    <section style={{ marginBottom:'36px', position:'relative', zIndex:1 }}>
      <style>{`@keyframes pulse{0%,100%{opacity:0.4;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'16px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>Live Cams</h2>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', fontWeight:300 }}>Click to watch · Powered by HDOnTap</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
        {CAMS.map(cam => <CamCard key={cam.id} cam={cam} />)}
      </div>
      <div style={{ marginTop:'10px', fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--text-light)', fontStyle:'italic' }}>
        💡 Cams open in a new tab via HDOnTap — the best free live surf cam network on the Strand.
      </div>
    </section>
  )
}

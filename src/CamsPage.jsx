const CAMS = [
  { id:'mb-south', name:'Manhattan Beach Pier South', sub:'South of pier · surf check', url:'https://hdontap.com/stream/405464/manhattan-beach-pier-south-live-webcam/', badge:'MB Pier', color:'#1F4E6B', thumb:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=70' },
  { id:'mb-north', name:'Manhattan Beach Pier North', sub:'North · El Porto view',       url:'https://hdontap.com/stream/855798/manhattan-beach-pier-north-live-cam/',       badge:'El Porto', color:'#1F4E6B', thumb:'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&auto=format&fit=crop&q=70' },
  { id:'hb-north', name:'Hermosa Beach North',        sub:'North of pier · surf + volley', url:'https://hdontap.com/stream/199895/hermosa-beach-north-live-webcam/',          badge:'⭐ Hermosa N', color:'#BC4B51', thumb:'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&auto=format&fit=crop&q=70' },
  { id:'hb-south', name:'Hermosa Beach South',        sub:'South of pier · mellower',     url:'https://hdontap.com/stream/417105/hermosa-beach-south-live-surf-cam/',         badge:'Hermosa S', color:'#BC4B51', thumb:'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&auto=format&fit=crop&q=70' },
  { id:'mb-ultra', name:'Manhattan Beach Ultra HD',   sub:'Pier panoramic · best quality',url:'https://hdontap.com/stream/126730/manhattan-beach-pier-ultra-hd-live-webcam/',  badge:'Ultra HD',  color:'#3D5A40', thumb:'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=70' },
  { id:'el-porto', name:'El Porto · Manhattan Beach', sub:'Heavy beach break',             url:'https://hdontap.com/stream/256987/el-porto-manhattan-beach-live-webcam/',       badge:'El Porto',  color:'#E9A23B', thumb:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=70' },
]

export default function CamsPage() {
  return (
    <div>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'34px', fontWeight:600, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:'4px' }}>Live Cams</h1>
        <p style={{ fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textd)' }}>Click any camera to open the live stream · Powered by HDOnTap</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
        {CAMS.map(cam=>(
          <a key={cam.id} href={cam.url} target="_blank" rel="noopener noreferrer"
            style={{ display:'block', textDecoration:'none', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--sh-md)', border:'1px solid var(--bsoft)', background:'var(--card)', transition:'transform 0.2s,box-shadow 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--sh-lg)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='var(--sh-md)'}}>
            <div style={{ position:'relative', height:'150px', overflow:'hidden' }}>
              <img src={cam.thumb} alt={cam.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', inset:0, background:'rgba(5,12,22,0.32)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:'46px', height:'46px', borderRadius:'50%', background:'rgba(255,255,255,0.92)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.35)' }}>
                  <div style={{ width:0, height:0, borderTop:'9px solid transparent', borderBottom:'9px solid transparent', borderLeft:`15px solid ${cam.color}`, marginLeft:'3px' }} />
                </div>
              </div>
              <div style={{ position:'absolute', top:'10px', left:'10px', background:'rgba(188,75,81,0.88)', color:'white', fontFamily:'var(--ff-mono)', fontSize:'10px', fontWeight:600, padding:'3px 8px', borderRadius:'6px', display:'flex', alignItems:'center', gap:'5px' }}>
                <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'white', animation:'pulse 1.5s ease-in-out infinite', display:'inline-block' }} />
                LIVE
              </div>
              <div style={{ position:'absolute', top:'10px', right:'10px', background:cam.color, color:'white', fontFamily:'var(--ff-mono)', fontSize:'10px', fontWeight:600, padding:'3px 10px', borderRadius:'6px' }}>{cam.badge}</div>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:'var(--text)', marginBottom:'3px' }}>{cam.name}</div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:'var(--textd)', marginBottom:'6px' }}>{cam.sub}</div>
              <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:cam.color, fontWeight:500 }}>Opens HDOnTap live stream ↗</div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ marginTop:'16px', fontFamily:'var(--ff-body)', fontSize:'12px', color:'var(--textl)', fontStyle:'italic' }}>
        💡 Cameras open in a new tab. HDOnTap is the best free live surf cam network on the Strand. If a stream is offline, try a different cam.
      </div>
    </div>
  )
}

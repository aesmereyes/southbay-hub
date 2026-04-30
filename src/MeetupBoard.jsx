import { useState } from 'react'

const SEED = [
  { id:1, group:'MB Morning Grind',   level:'A',    location:'Marine St Courts',     time:'Today · 7:00 AM',    contact:'https://wa.me/13105550001', avatar:'🏖️' },
  { id:2, group:'Hermosa Kings',      level:'Open', location:'Hermosa Pier Courts',  time:'Today · 10:00 AM',   contact:'https://instagram.com/',    avatar:'👑' },
  { id:3, group:'Sunset Rally',       level:'BB',   location:'22nd St Courts',       time:'Today · 5:30 PM',    contact:'https://wa.me/13105550002', avatar:'🌅' },
  { id:4, group:'Redondo Regulars',   level:'B',    location:'Redondo Esplanade',    time:'Today · 9:00 AM',    contact:'https://wa.me/13105550003', avatar:'🌊' },
  { id:5, group:'AVP Hopefuls',       level:'A',    location:'Marine St Courts',     time:'Tomorrow · 8:00 AM', contact:'https://instagram.com/',    avatar:'🏆' },
  { id:6, group:'Dockweiler Nights',  level:'Open', location:'Dockweiler Courts',    time:'Tonight · 6:30 PM',  contact:'https://wa.me/13105550004', avatar:'🔥' },
]
const LVL = {
  B:    { color:'#8B6F47', bg:'rgba(139,111,71,0.1)'   },
  BB:   { color:'#2C5F78', bg:'rgba(44,95,120,0.1)'    },
  A:    { color:'#E8934A', bg:'rgba(232,147,74,0.1)'   },
  Open: { color:'#4a7c59', bg:'rgba(74,124,89,0.1)'    },
}

function Card({ m }) {
  const [hov, setHov] = useState(false)
  const lvl = LVL[m.level] || LVL.B
  const isWA = m.contact?.includes('wa.me')
  return (
    <div style={{ background: 'var(--card)', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${lvl.color}15`, border: `2px solid ${lvl.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
          {m.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{m.group}</div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', padding: '2px 10px', borderRadius: '20px', background: lvl.bg, color: lvl.color, fontWeight: 600, letterSpacing: '0.05em', display: 'inline-block', marginTop: '4px' }}>{m.level}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-mid)' }}>📍 {m.location}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-mid)' }}>🕐 {m.time}</div>
      </div>
      <a href={m.contact} target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', textAlign: 'center', padding: '11px', background: hov ? 'var(--pacific)' : 'var(--sand)', border: `1px solid ${hov ? 'var(--pacific)' : 'var(--border)'}`, borderRadius: '10px', color: hov ? 'white' : 'var(--text-mid)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.04em', boxShadow: hov ? '0 4px 16px rgba(44,95,120,0.3)' : 'none' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        {isWA ? '💬 Join the Crew' : '📸 Find on Instagram'}
      </a>
    </div>
  )
}

function Modal({ onClose, onAdd }) {
  const [f, setF] = useState({ group:'', level:'BB', location:'Marine St Courts', time:'', contact:'', avatar:'🏐' })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const inp = { width:'100%', padding:'10px 14px', background:'var(--sand)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontFamily:'var(--font-body)', fontSize:'13px', outline:'none' }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,18,8,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:'var(--card)', borderRadius:'20px', padding:'36px', width:'100%', maxWidth:'480px', boxShadow:'var(--shadow-lg)', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'20px', background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'var(--text-muted)' }}>✕</button>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text)', marginBottom:'24px' }}>Post a Game</div>
        {[
          { label:'Group Name', key:'group', type:'text', ph:'e.g. MB Morning Crew' },
          { label:'Time', key:'time', type:'text', ph:'e.g. Today 4:00 PM' },
          { label:'Contact (WhatsApp / Instagram)', key:'contact', type:'url', ph:'https://wa.me/...' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom:'14px' }}>
            <label style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:'6px', fontWeight:500 }}>{field.label}</label>
            <input style={inp} type={field.type} placeholder={field.ph} value={f[field.key]} onChange={e => set(field.key, e.target.value)} onFocus={e => e.target.style.borderColor='var(--pacific)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
          {[
            { label:'Level', key:'level', opts:['B','BB','A','Open'] },
            { label:'Location', key:'location', opts:['Marine St Courts','MB Pier Courts','22nd St Courts','Hermosa Pier Courts','Knob Hill Courts','Ave G Courts','Redondo Esplanade','Dockweiler Courts'] },
          ].map(sel => (
            <div key={sel.key}>
              <label style={{ fontFamily:'var(--font-body)', fontSize:'11px', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', display:'block', marginBottom:'6px', fontWeight:500 }}>{sel.label}</label>
              <select style={inp} value={f[sel.key]} onChange={e => set(sel.key, e.target.value)}>{sel.opts.map(o => <option key={o}>{o}</option>)}</select>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'12px', background:'transparent', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text-muted)', fontFamily:'var(--font-body)', fontSize:'13px', cursor:'pointer' }}>Cancel</button>
          <button onClick={() => { if (f.group && f.time) { onAdd({ ...f, id:Date.now() }); onClose() } }} style={{ flex:2, padding:'12px', background:'var(--pacific)', border:'none', borderRadius:'10px', color:'white', fontFamily:'var(--font-display)', fontSize:'16px', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(44,95,120,0.3)' }}>Post It</button>
        </div>
      </div>
    </div>
  )
}

export default function MeetupBoard() {
  const [meetups, setMeetups] = useState(SEED)
  const [modal, setModal] = useState(false)
  return (
    <section style={{ marginBottom:'40px', position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'16px' }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:'var(--text)', letterSpacing:'-0.01em' }}>Community Board</h2>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', fontWeight:300, flex:1 }}>Find your crew · post a game</span>
        <button onClick={() => setModal(true)} style={{ fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:600, padding:'10px 22px', background:'var(--gold)', color:'var(--text)', border:'none', borderRadius:'10px', cursor:'pointer', boxShadow:'0 4px 16px rgba(255,179,71,0.35)', letterSpacing:'0.02em' }}>
          + Post Game
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'12px' }}>
        {meetups.map(m => <Card key={m.id} m={m} />)}
      </div>
      {modal && <Modal onClose={() => setModal(false)} onAdd={m => setMeetups(p => [{ ...m, avatar:'🏐' }, ...p])} />}
    </section>
  )
}

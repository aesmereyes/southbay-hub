import { useState } from 'react'

const SEED_EVENTS = [
  { id:1,  date:'2026-05-15', end:'2026-05-17', title:'AVP Huntington Beach Open',          type:'avp',        location:'Huntington Beach',       contact:'', description:'Heritage Major · Courts impacted nearby', courtImpact:true },
  { id:2,  date:'2026-07-22', end:'2026-07-26', title:'AVP Junior National Championships',  type:'avp-junior', location:'Hermosa Beach',           contact:'', description:'Courts reduced at Hermosa Pier' },
  { id:3,  date:'2026-08-13', end:'2026-08-16', title:'Manhattan Beach Open by AVP',         type:'avp',        location:'Manhattan Beach Pier',    contact:'', description:'⚠️ Street closures · Limited courts Aug 10–19', courtImpact:true },
  { id:4,  date:'2026-09-10', end:'2026-09-13', title:'Hermosa Beach Open',                 type:'avp',        location:'Hermosa Beach Pier',      contact:'', description:'⚠️ Pier courts reduced · Competitive + free entry', courtImpact:true },
  { id:5,  date:'2026-09-18', end:'2026-09-20', title:'AVP Laguna Open',                    type:'avp',        location:'Laguna Beach',            contact:'', description:'Heritage Major · South OC' },
  { id:6,  date:'2026-05-02', end:'2026-05-03', title:'AVP League · Los Angeles',           type:'avp-league', location:'Los Angeles',             contact:'', description:'AVP League stop' },
  { id:7,  date:'2026-06-20', end:'2026-06-21', title:'International Surf Festival',        type:'local',      location:'Manhattan Beach',         contact:'', description:'Annual summer festival · Some beach access limited', courtImpact:true },
  { id:8,  date:'2026-07-04', end:'2026-07-04', title:'4th of July Beach Fest',             type:'local',      location:'All South Bay',           contact:'', description:'⚠️ Very crowded · Early morning only for sports', courtImpact:true },
  { id:9,  date:'2026-08-20', end:'2026-08-23', title:'Hermosa Beach Fiesta',               type:'local',      location:'Hermosa Beach',           contact:'', description:'Annual community event · Courts may be impacted', courtImpact:true },
  { id:10, date:'2026-06-14', end:'2026-06-14', title:'South Bay Charity Volleyball Cup',   type:'community',  location:'Marine St Courts, MB',    contact:'southbayvball@gmail.com', description:'4v4 doubles tournament · All proceeds to local youth programs · $40/team entry · Register online' },
  { id:11, date:'2026-07-18', end:'2026-07-18', title:'Hermosa Sunset Tournament',          type:'community',  location:'Hermosa Pier Courts',     contact:'hermosavb@ig.com', description:'2v2 open tourney · Fundraiser for new net installation · $25/pair · Prizes for top 3 teams' },
  { id:20, recurring:'thu', title:'Thursday Pickup · Knob Hill',   type:'pickup', location:'Knob Hill Courts · 811 Esplanade, Redondo', description:'All levels · 2:00 PM' },
  { id:21, recurring:'sat', title:'Saturday Pickup · Knob Hill',   type:'pickup', location:'Knob Hill Courts',                         description:'Int / Adv · 2:00 PM' },
  { id:22, recurring:'sat', title:'Saturday Pickup · Ave G',        type:'pickup', location:'Ave G Courts · Esplanade',                 description:'Beginners · 2:00 PM' },
  { id:23, recurring:'sun', title:'Sunday Pickup · Knob Hill',      type:'pickup', location:'Knob Hill Courts',                         description:'Int / Adv · 2:00 PM' },
  { id:24, recurring:'sun', title:'Sunday Pickup · Ave G',          type:'pickup', location:'Ave G Courts · Esplanade',                 description:'Beginners · 2:00 PM' },
]

const TYPE_META = {
  'avp':       { label:'AVP Pro',        color:'#1F4E6B', bg:'rgba(31,78,107,0.1)'   },
  'avp-league':{ label:'AVP League',     color:'#2C7DA0', bg:'rgba(44,125,160,0.1)'  },
  'avp-junior':{ label:'AVP Junior',     color:'#3D5A40', bg:'rgba(61,90,64,0.1)'    },
  'local':     { label:'Local Event',    color:'#E9A23B', bg:'rgba(233,162,59,0.1)'  },
  'pickup':    { label:'Weekly Pickup',  color:'#BC4B51', bg:'rgba(188,75,81,0.1)'   },
  'community': { label:'Community',      color:'#7B2D8B', bg:'rgba(123,45,139,0.1)'  },
  'tournament':{ label:'Tournament',     color:'#C05621', bg:'rgba(192,86,33,0.1)'   },
  'fundraiser':{ label:'Fundraiser',     color:'#2D6A4F', bg:'rgba(45,106,79,0.1)'   },
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAYS_FULL  = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

function dateStr(y,m,d) { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }

function getDayEvents(events, year, month, day) {
  const ds  = dateStr(year, month, day)
  const dow = DAYS_FULL[new Date(year,month,day).getDay()].slice(0,3)
  return events.filter(e => {
    if (e.recurring) return e.recurring === dow
    return e.date <= ds && (e.end||e.date) >= ds
  })
}

// ── ADD EVENT MODAL ──────────────────────────────────────────────
function AddEventModal({ onClose, onAdd, defaultDate }) {
  const [form, setForm] = useState({
    title:'', type:'community', location:'', date: defaultDate||'',
    end:'', description:'', contact:'', organizer:''
  })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))
  const valid = form.title && form.date && form.location

  const inp = {
    width:'100%', padding:'10px 14px',
    background:'var(--sand)', border:'1px solid var(--border)',
    borderRadius:'10px', color:'var(--text)',
    fontFamily:'var(--ff-body)', fontSize:'13px', outline:'none',
  }
  const label = {
    fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textd)',
    textTransform:'uppercase', letterSpacing:'0.08em',
    display:'block', marginBottom:'5px', fontWeight:500,
  }

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(26,18,8,0.65)',zIndex:9999,
      display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(6px)' }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:'var(--card)',borderRadius:'20px',padding:'32px 36px',
        width:'100%',maxWidth:'540px',boxShadow:'var(--sh-lg)',
        maxHeight:'90vh',overflowY:'auto',position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute',top:'16px',right:'20px',
          background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'var(--textd)' }}>✕</button>

        <div style={{ fontFamily:'var(--ff-display)',fontSize:'26px',fontWeight:600,
          color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'6px' }}>Post an Event</div>
        <div style={{ fontFamily:'var(--ff-body)',fontSize:'13px',color:'var(--textd)',marginBottom:'24px' }}>
          Add your tournament, fundraiser, or pickup game to the South Bay calendar.
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
          <div>
            <label style={label}>Event Type</label>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px' }}>
              {['community','tournament','fundraiser','pickup','local','avp-league'].map(t=>{
                const m = TYPE_META[t]
                return (
                  <button key={t} onClick={()=>set('type',t)} style={{
                    padding:'8px 6px',borderRadius:'8px',border:`1.5px solid ${form.type===t?m.color:'var(--border)'}`,
                    background:form.type===t?m.bg:'transparent',cursor:'pointer',
                    fontFamily:'var(--ff-body)',fontSize:'11px',fontWeight:600,
                    color:form.type===t?m.color:'var(--textd)',transition:'all 0.15s',
                  }}>{m.label}</button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={label}>Event Title *</label>
            <input style={inp} placeholder="e.g. South Bay Charity Doubles" value={form.title}
              onChange={e=>set('title',e.target.value)} />
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
            <div>
              <label style={label}>Start Date *</label>
              <input style={inp} type="date" value={form.date} onChange={e=>set('date',e.target.value)} />
            </div>
            <div>
              <label style={label}>End Date (optional)</label>
              <input style={inp} type="date" value={form.end} onChange={e=>set('end',e.target.value)} />
            </div>
          </div>

          <div>
            <label style={label}>Location *</label>
            <input style={inp} placeholder="e.g. Marine St Courts, Manhattan Beach"
              value={form.location} onChange={e=>set('location',e.target.value)} />
          </div>

          <div>
            <label style={label}>Organizer / Group Name</label>
            <input style={inp} placeholder="e.g. South Bay Volleyball Club"
              value={form.organizer} onChange={e=>set('organizer',e.target.value)} />
          </div>

          <div>
            <label style={label}>Contact / Registration Link</label>
            <input style={inp} placeholder="Email, Instagram, WhatsApp, or URL"
              value={form.contact} onChange={e=>set('contact',e.target.value)} />
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea style={{...inp,height:'80px',resize:'vertical',lineHeight:1.5}}
              placeholder="Format, entry fee, skill level, prizes, charity info..."
              value={form.description} onChange={e=>set('description',e.target.value)} />
          </div>
        </div>

        <div style={{ display:'flex',gap:'10px',marginTop:'20px' }}>
          <button onClick={onClose} style={{ flex:1,padding:'12px',background:'transparent',
            border:'1px solid var(--border)',borderRadius:'10px',color:'var(--textd)',
            fontFamily:'var(--ff-body)',fontSize:'13px',cursor:'pointer' }}>Cancel</button>
          <button disabled={!valid} onClick={()=>{ if(!valid) return
            onAdd({...form,id:Date.now(),end:form.end||form.date})
            onClose()
          }} style={{ flex:2,padding:'12px',
            background:valid?'var(--pacific)':'var(--dune)',border:'none',
            borderRadius:'10px',color:'white',fontFamily:'var(--ff-display)',
            fontSize:'16px',fontWeight:700,cursor:valid?'pointer':'not-allowed',
            transition:'background 0.2s' }}>Post Event</button>
        </div>
      </div>
    </div>
  )
}

// ── EVENT DETAIL PANEL ───────────────────────────────────────────
function EventDetail({ events, day, month, year, onClose }) {
  const dateLabel = `${MONTHS[month]} ${day}, ${year}`
  return (
    <div style={{ background:'var(--card)',borderRadius:'16px',padding:'22px',
      boxShadow:'var(--sh-md)',border:'1px solid var(--bsoft)' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px' }}>
        <div style={{ fontFamily:'var(--ff-display)',fontSize:'18px',fontWeight:600,color:'var(--text)' }}>
          {dateLabel}
        </div>
        <button onClick={onClose} style={{ background:'var(--sand)',border:'none',
          borderRadius:'8px',padding:'4px 10px',cursor:'pointer',
          fontFamily:'var(--ff-body)',fontSize:'13px',color:'var(--textd)' }}>✕</button>
      </div>

      {events.length === 0 ? (
        <div style={{ fontFamily:'var(--ff-body)',fontSize:'13px',color:'var(--textl)',
          textAlign:'center',padding:'20px 0',fontStyle:'italic' }}>
          Nothing scheduled · Click "Post Event" to add something!
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
          {events.map(e=>{
            const m = TYPE_META[e.type] || TYPE_META.community
            return (
              <div key={e.id} style={{ borderRadius:'12px',padding:'14px',
                background:m.bg,border:`1px solid ${m.color}25` }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px' }}>
                  <span style={{ fontFamily:'var(--ff-body)',fontSize:'10px',fontWeight:700,
                    color:m.color,textTransform:'uppercase',letterSpacing:'0.08em' }}>{m.label}</span>
                  {e.recurring && <span style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'var(--textl)' }}>Weekly</span>}
                </div>
                <div style={{ fontFamily:'var(--ff-display)',fontSize:'15px',fontWeight:600,
                  color:'var(--text)',marginBottom:'6px' }}>{e.title}</div>
                <div style={{ fontFamily:'var(--ff-body)',fontSize:'12px',color:'var(--textm)',marginBottom:'4px' }}>
                  📍 {e.location}
                </div>
                {e.description && (
                  <div style={{ fontFamily:'var(--ff-body)',fontSize:'12px',color:'var(--textd)',
                    lineHeight:1.5,marginBottom:'4px' }}>{e.description}</div>
                )}
                {e.organizer && (
                  <div style={{ fontFamily:'var(--ff-body)',fontSize:'12px',color:'var(--textm)' }}>
                    👤 {e.organizer}
                  </div>
                )}
                {e.contact && (
                  <div style={{ fontFamily:'var(--ff-mono)',fontSize:'11px',color:m.color,marginTop:'6px' }}>
                    📬 {e.contact}
                  </div>
                )}
                {e.courtImpact && (
                  <div style={{ marginTop:'8px',padding:'6px 10px',background:'rgba(188,75,81,0.1)',
                    borderRadius:'7px',fontFamily:'var(--ff-body)',fontSize:'11px',color:'#BC4B51' }}>
                    ⚠️ Court availability may be reduced during this event
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── MAIN CALENDAR ────────────────────────────────────────────────
export default function CalendarPage() {
  const now = new Date()
  const [year,   setYear]   = useState(now.getFullYear())
  const [month,  setMonth]  = useState(now.getMonth())
  const [events, setEvents] = useState(SEED_EVENTS)
  const [selected, setSelected] = useState(null)
  const [showAdd,  setShowAdd]  = useState(false)
  const [addDate,  setAddDate]  = useState('')

  const addEvent = e => setEvents(prev => [...prev, e])
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()

  const prevMonth = () => { if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1) }
  const nextMonth = () => { if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1) }

  const upcoming = events
    .filter(e => !e.recurring && e.date >= now.toISOString().slice(0,10))
    .sort((a,b)=>a.date.localeCompare(b.date))
    .slice(0,6)

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px' }}>
        <div>
          <h1 style={{ fontFamily:'var(--ff-display)',fontSize:'34px',fontWeight:600,
            color:'var(--text)',letterSpacing:'-0.02em',marginBottom:'4px' }}>Beach Calendar</h1>
          <p style={{ fontFamily:'var(--ff-body)',fontSize:'14px',color:'var(--textd)' }}>
            AVP tournaments · local events · community games · court availability
          </p>
        </div>
        <button onClick={()=>{ setAddDate(''); setShowAdd(true) }} style={{
          padding:'12px 24px',background:'var(--pacific)',border:'none',
          borderRadius:'12px',color:'white',fontFamily:'var(--ff-display)',
          fontSize:'16px',fontWeight:700,cursor:'pointer',
          boxShadow:'0 4px 16px rgba(31,78,107,0.3)',letterSpacing:'-0.01em',
          display:'flex',alignItems:'center',gap:'8px',
        }}>
          <span style={{ fontSize:'18px' }}>+</span> Post Your Event
        </button>
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:'24px',alignItems:'start' }}>
        {/* Calendar */}
        <div style={{ background:'var(--card)',borderRadius:'20px',padding:'24px',
          boxShadow:'var(--sh-md)',border:'1px solid var(--bsoft)' }}>

          {/* Month nav */}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }}>
            <button onClick={prevMonth} style={{ background:'var(--sand)',border:'none',
              borderRadius:'10px',padding:'8px 16px',cursor:'pointer',
              fontFamily:'var(--ff-body)',fontSize:'16px',color:'var(--textm)' }}>‹</button>
            <div style={{ fontFamily:'var(--ff-display)',fontSize:'24px',fontWeight:600,color:'var(--text)' }}>
              {MONTHS[month]} {year}
            </div>
            <button onClick={nextMonth} style={{ background:'var(--sand)',border:'none',
              borderRadius:'10px',padding:'8px 16px',cursor:'pointer',
              fontFamily:'var(--ff-body)',fontSize:'16px',color:'var(--textm)' }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px',marginBottom:'6px' }}>
            {DAYS_SHORT.map(d=>(
              <div key={d} style={{ textAlign:'center',fontFamily:'var(--ff-mono)',
                fontSize:'10px',color:'var(--textd)',textTransform:'uppercase',
                letterSpacing:'0.08em',padding:'4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px' }}>
            {Array.from({length: firstDay}).map((_,i)=><div key={`e${i}`} />)}
            {Array.from({length: daysInMonth},(_,i)=>i+1).map(day=>{
              const evts = getDayEvents(events, year, month, day)
              const isToday = year===now.getFullYear()&&month===now.getMonth()&&day===now.getDate()
              const isSel   = selected?.day===day
              const hasAvp  = evts.some(e=>e.type==='avp'||e.type==='avp-league'||e.type==='avp-junior')
              const hasComm = evts.some(e=>e.type==='community'||e.type==='tournament'||e.type==='fundraiser')
              const hasLocal= evts.some(e=>e.type==='local')
              const hasPickup=evts.some(e=>e.type==='pickup')
              const hasCourt=evts.some(e=>e.courtImpact)

              return (
                <div key={day}
                  onClick={()=>setSelected(isSel?null:{day,evts})}
                  onDoubleClick={()=>{ setAddDate(dateStr(year,month,day)); setShowAdd(true) }}
                  title="Click to view · Double-click to add event"
                  style={{
                    minHeight:'64px', borderRadius:'10px', padding:'6px 7px',
                    cursor:'pointer', position:'relative',
                    background: isToday?'var(--pacific)':isSel?'var(--sand-dark)':'transparent',
                    border:`1px solid ${isToday?'var(--pacific)':isSel?'var(--dune)':evts.length?'rgba(139,111,71,0.12)':'transparent'}`,
                    transition:'all 0.12s',
                  }}
                  onMouseEnter={e=>{ if(!isToday&&!isSel) e.currentTarget.style.background='var(--sand)' }}
                  onMouseLeave={e=>{ if(!isToday&&!isSel) e.currentTarget.style.background='transparent' }}>
                  <div style={{ fontFamily:'var(--ff-body)',fontSize:'13px',fontWeight:isToday?700:400,
                    color:isToday?'white':'var(--text)',marginBottom:'5px' }}>{day}</div>
                  {/* Event dots */}
                  <div style={{ display:'flex',flexDirection:'column',gap:'2px' }}>
                    {hasAvp    && <div style={{ height:'3px',borderRadius:'2px',background:'#1F4E6B',opacity:isToday?.7:1 }} />}
                    {hasComm   && <div style={{ height:'3px',borderRadius:'2px',background:'#7B2D8B',opacity:isToday?.7:1 }} />}
                    {hasLocal  && <div style={{ height:'3px',borderRadius:'2px',background:'#E9A23B',opacity:isToday?.7:1 }} />}
                    {hasPickup && <div style={{ height:'3px',borderRadius:'2px',background:'#BC4B51',opacity:isToday?.7:1 }} />}
                    {hasCourt  && <div style={{ position:'absolute',top:'5px',right:'5px',width:'6px',height:'6px',borderRadius:'50%',background:'#BC4B51' }} title="Court availability may be reduced" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display:'flex',gap:'14px',flexWrap:'wrap',marginTop:'18px',
            paddingTop:'16px',borderTop:'1px solid var(--bsoft)',alignItems:'center' }}>
            <span style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textd)',fontWeight:600 }}>Legend:</span>
            {[
              {c:'#1F4E6B',l:'AVP Events'},
              {c:'#7B2D8B',l:'Community / Tournament'},
              {c:'#E9A23B',l:'Local Events'},
              {c:'#BC4B51',l:'Weekly Pickup'},
            ].map(x=>(
              <div key={x.l} style={{ display:'flex',alignItems:'center',gap:'5px' }}>
                <div style={{ width:'12px',height:'3px',borderRadius:'2px',background:x.c }} />
                <span style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textd)' }}>{x.l}</span>
              </div>
            ))}
            <span style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textl)',marginLeft:'auto' }}>
              Double-click a date to add event
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
          {/* Selected day */}
          {selected && (
            <EventDetail
              events={selected.evts}
              day={selected.day}
              month={month}
              year={year}
              onClose={()=>setSelected(null)}
            />
          )}

          {/* Post CTA */}
          <div style={{ background:'linear-gradient(135deg,var(--pacific) 0%,#1a4a60 100%)',
            borderRadius:'16px',padding:'20px',color:'white' }}>
            <div style={{ fontFamily:'var(--ff-display)',fontSize:'18px',fontWeight:600,marginBottom:'6px' }}>
              Host a Tournament?
            </div>
            <div style={{ fontFamily:'var(--ff-body)',fontSize:'13px',color:'rgba(255,255,255,0.75)',
              lineHeight:1.5,marginBottom:'14px' }}>
              Post your doubles tourney, fundraiser, or community game for free.
              Reach the entire South Bay volleyball community.
            </div>
            <button onClick={()=>setShowAdd(true)} style={{
              width:'100%',padding:'11px',background:'rgba(255,255,255,0.15)',
              border:'1px solid rgba(255,255,255,0.3)',borderRadius:'10px',
              color:'white',fontFamily:'var(--ff-body)',fontSize:'13px',
              fontWeight:600,cursor:'pointer',letterSpacing:'0.02em',
            }}>+ Post Your Event</button>
          </div>

          {/* Upcoming */}
          <div style={{ background:'var(--card)',borderRadius:'16px',padding:'20px',
            boxShadow:'var(--sh-md)',border:'1px solid var(--bsoft)' }}>
            <div style={{ fontFamily:'var(--ff-display)',fontSize:'18px',fontWeight:600,
              color:'var(--text)',marginBottom:'14px' }}>Upcoming Events</div>
            <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
              {upcoming.map(e=>{
                const m = TYPE_META[e.type]||TYPE_META.community
                const d = new Date(e.date+'T12:00:00')
                return (
                  <div key={e.id} style={{ display:'flex',gap:'12px',alignItems:'flex-start',
                    cursor:'pointer',padding:'6px',borderRadius:'8px',transition:'background 0.15s' }}
                    onClick={()=>{ setYear(d.getFullYear()); setMonth(d.getMonth()); setSelected({day:d.getDate(),evts:getDayEvents(events,d.getFullYear(),d.getMonth(),d.getDate())}) }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--sand)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div style={{ background:m.bg,borderRadius:'8px',padding:'5px 8px',
                      textAlign:'center',minWidth:'44px',flexShrink:0,border:`1px solid ${m.color}20` }}>
                      <div style={{ fontFamily:'var(--ff-mono)',fontSize:'9px',color:m.color,textTransform:'uppercase' }}>
                        {MONTHS[d.getMonth()].slice(0,3)}
                      </div>
                      <div style={{ fontFamily:'var(--ff-display)',fontSize:'18px',fontWeight:600,color:m.color,lineHeight:1 }}>
                        {d.getDate()}
                      </div>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:'var(--ff-body)',fontSize:'13px',fontWeight:600,
                        color:'var(--text)',marginBottom:'2px' }}>{e.title}</div>
                      <div style={{ fontFamily:'var(--ff-body)',fontSize:'11px',color:'var(--textd)' }}>{e.location}</div>
                      {e.courtImpact && <div style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'#BC4B51',marginTop:'2px' }}>⚠️ Courts affected</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weekly pickup */}
          <div style={{ background:'rgba(188,75,81,0.06)',borderRadius:'14px',
            padding:'16px',border:'1px solid rgba(188,75,81,0.15)' }}>
            <div style={{ fontFamily:'var(--ff-display)',fontSize:'16px',fontWeight:600,
              color:'var(--text)',marginBottom:'12px' }}>📅 Weekly Pickup · Redondo</div>
            {[
              {day:'Thursday', loc:'Knob Hill',level:'All Levels'},
              {day:'Saturday', loc:'Knob Hill',level:'Int / Adv'},
              {day:'Saturday', loc:'Ave G',    level:'Beginners'},
              {day:'Sunday',   loc:'Knob Hill',level:'Int / Adv'},
              {day:'Sunday',   loc:'Ave G',    level:'Beginners'},
            ].map((p,i)=>(
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'8px 0',borderBottom:i<4?'1px solid rgba(188,75,81,0.08)':'' }}>
                <div>
                  <span style={{ fontFamily:'var(--ff-body)',fontSize:'13px',fontWeight:600,color:'var(--text)' }}>{p.day}</span>
                  <span style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'var(--textd)',marginLeft:'8px' }}>2:00 PM</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--ff-body)',fontSize:'12px',color:'var(--textm)' }}>{p.loc} Courts</div>
                  <div style={{ fontFamily:'var(--ff-mono)',fontSize:'10px',color:'#BC4B51' }}>{p.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddEventModal onClose={()=>setShowAdd(false)} onAdd={addEvent} defaultDate={addDate} />}
    </div>
  )
}

import { useState } from 'react'

// 2026 real events from research
const EVENTS = [
  // AVP Heritage events
  { id:1, date:'2026-05-15', end:'2026-05-17', title:'AVP Huntington Beach Open', type:'avp', location:'Huntington Beach', note:'Heritage Major · Courts impacted', courtImpact:'nearby' },
  { id:2, date:'2026-07-22', end:'2026-07-26', title:'AVP Junior National Championships', type:'avp-junior', location:'Hermosa Beach', note:'Courts reduced at Hermosa Pier', courtImpact:'hermosa' },
  { id:3, date:'2026-08-13', end:'2026-08-16', title:'Manhattan Beach Open (MBO) by AVP', type:'avp', location:'Manhattan Beach Pier', note:'⚠️ Street closures · Limited courts Aug 10–19', courtImpact:'manhattan' },
  { id:4, date:'2026-09-10', end:'2026-09-13', title:'Hermosa Beach Open', type:'avp', location:'Hermosa Beach Pier', note:'⚠️ Pier courts reduced · Competitive + free entry', courtImpact:'hermosa' },
  { id:5, date:'2026-09-18', end:'2026-09-20', title:'AVP Laguna Open', type:'avp', location:'Laguna Beach', note:'Heritage Major · South OC' },
  // Regular AVP League events
  { id:6, date:'2026-05-02', end:'2026-05-03', title:'AVP League · Los Angeles', type:'avp-league', location:'Los Angeles', note:'League stop' },
  { id:7, date:'2026-06-06', end:'2026-06-07', title:'AVP League · Aspen', type:'avp-league', location:'Aspen, CO', note:'New venue' },
  { id:8, date:'2026-07-11', end:'2026-07-12', title:'AVP League · New York', type:'avp-league', location:'New York', note:'East Hampton' },
  { id:9, date:'2026-08-01', end:'2026-08-02', title:'AVP League · Chicago', type:'avp-league', location:'Chicago, IL', note:'Returning stop' },
  { id:10, date:'2026-09-05', end:'2026-09-06', title:'AVP League Championships', type:'avp-league', location:'Chicago, IL', note:'Season finale' },
  // Local events
  { id:11, date:'2026-06-20', end:'2026-06-21', title:'International Surf Festival', type:'local', location:'Manhattan Beach', note:'Annual summer festival · Some beach access limited' },
  { id:12, date:'2026-07-04', end:'2026-07-04', title:'4th of July Beach Fest', type:'local', location:'All South Bay', note:'⚠️ Very crowded · Early morning only for sports' },
  { id:13, date:'2026-08-20', end:'2026-08-23', title:'Hermosa Beach Fiesta', type:'local', location:'Hermosa Beach', note:'Annual community event · Courts may be impacted' },
  // Weekly pickups
  { id:20, recurring:'thu', title:'Thursday Pickup · Knob Hill', type:'pickup', location:'Knob Hill Courts · 811 Esplanade, Redondo', note:'All levels · 2:00 PM' },
  { id:21, recurring:'sat', title:'Saturday Pickup · Knob Hill', type:'pickup', location:'Knob Hill Courts', note:'Int/Adv · 2:00 PM' },
  { id:22, recurring:'sat', title:'Saturday Pickup · Ave G', type:'pickup', location:'Ave G Courts · Esplanade', note:'Beginners · 2:00 PM' },
  { id:23, recurring:'sun', title:'Sunday Pickup · Knob Hill', type:'pickup', location:'Knob Hill Courts', note:'Int/Adv · 2:00 PM' },
  { id:24, recurring:'sun', title:'Sunday Pickup · Ave G', type:'pickup', location:'Ave G Courts · Esplanade', note:'Beginners · 2:00 PM' },
]

const TYPE_STYLE = {
  'avp':        { color:'#1F4E6B', bg:'rgba(31,78,107,0.1)',  label:'AVP Heritage' },
  'avp-league': { color:'#2C7DA0', bg:'rgba(44,125,160,0.1)', label:'AVP League'   },
  'avp-junior': { color:'#3D5A40', bg:'rgba(61,90,64,0.1)',   label:'AVP Junior'   },
  'local':      { color:'#E9A23B', bg:'rgba(233,162,59,0.1)', label:'Local Event'  },
  'pickup':     { color:'#BC4B51', bg:'rgba(188,75,81,0.1)',   label:'Weekly Pickup'},
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getDayEvents(year, month, day) {
  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  const dayOfWeek = DAYS[new Date(year,month,day).getDay()].toLowerCase().slice(0,3)
  return EVENTS.filter(e => {
    if (e.recurring) return e.recurring === dayOfWeek
    return e.date <= dateStr && (e.end || e.date) >= dateStr
  })
}

export default function CalendarPage() {
  const now = new Date()
  const [year,  setYear]  = useState(2026)
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(null)

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const cells = Array.from({length: firstDay + daysInMonth}, (_,i) => i < firstDay ? null : i - firstDay + 1)

  const upcoming = EVENTS.filter(e => !e.recurring && e.date >= now.toISOString().slice(0,10)).slice(0,5)

  return (
    <div>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'var(--ff-display)', fontSize:'34px', fontWeight:600, color:'var(--text)', letterSpacing:'-0.02em', marginBottom:'4px' }}>Beach Calendar</h1>
        <p style={{ fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textd)' }}>AVP tournaments, local events, pickup schedules & court availability</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'24px', alignItems:'start' }}>
        {/* Calendar grid */}
        <div style={{ background:'var(--card)', borderRadius:'20px', padding:'24px', boxShadow:'var(--sh-md)', border:'1px solid var(--bsoft)' }}>
          {/* Month nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
            <button onClick={()=>{ if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1) }}
              style={{ background:'var(--sand)', border:'none', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textm)' }}>‹</button>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'22px', fontWeight:600, color:'var(--text)' }}>{MONTHS[month]} {year}</div>
            <button onClick={()=>{ if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1) }}
              style={{ background:'var(--sand)', border:'none', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', fontFamily:'var(--ff-body)', fontSize:'14px', color:'var(--textm)' }}>›</button>
          </div>
          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'6px' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontFamily:'var(--ff-mono)', fontSize:'10px', color:'var(--textd)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'4px' }}>{d}</div>)}
          </div>
          {/* Day cells */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const evts = getDayEvents(year, month, day)
              const isToday = year===now.getFullYear() && month===now.getMonth() && day===now.getDate()
              const hasAvp = evts.some(e=>e.type==='avp'||e.type==='avp-league'||e.type==='avp-junior')
              const hasLocal = evts.some(e=>e.type==='local')
              const hasPickup = evts.some(e=>e.type==='pickup')
              return (
                <div key={day} onClick={()=>setSelected(evts.length?{day,evts}:null)}
                  style={{ minHeight:'56px', borderRadius:'10px', padding:'6px 7px', cursor:evts.length?'pointer':'default',
                    background: isToday?'var(--pacific)': selected?.day===day?'var(--sand)':'transparent',
                    border:`1px solid ${isToday?'var(--pacific)':evts.length?'rgba(139,111,71,0.1)':'transparent'}`,
                    transition:'all 0.15s' }}
                  onMouseEnter={e=>{ if(!isToday&&evts.length) e.currentTarget.style.background='var(--sand)' }}
                  onMouseLeave={e=>{ if(!isToday&&selected?.day!==day) e.currentTarget.style.background='transparent' }}>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:'13px', fontWeight:isToday?600:400, color:isToday?'white':'var(--text)', marginBottom:'4px' }}>{day}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                    {hasAvp    && <div style={{ height:'3px', borderRadius:'2px', background:'#1F4E6B' }} />}
                    {hasLocal  && <div style={{ height:'3px', borderRadius:'2px', background:'#E9A23B' }} />}
                    {hasPickup && <div style={{ height:'3px', borderRadius:'2px', background:'#BC4B51' }} />}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div style={{ display:'flex', gap:'16px', marginTop:'16px', paddingTop:'16px', borderTop:'1px solid var(--bsoft)' }}>
            {Object.entries(TYPE_STYLE).slice(0,4).map(([k,v])=>(
              <div key={k} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{ width:'10px', height:'3px', borderRadius:'2px', background:v.color }} />
                <span style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textd)' }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {/* Selected day events */}
          {selected && (
            <div style={{ background:'var(--card)', borderRadius:'16px', padding:'20px', boxShadow:'var(--sh-md)', border:'1px solid var(--bsoft)' }}>
              <div style={{ fontFamily:'var(--ff-display)', fontSize:'18px', fontWeight:600, color:'var(--text)', marginBottom:'14px' }}>
                {MONTHS[month]} {selected.day}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {selected.evts.map(e => {
                  const ts = TYPE_STYLE[e.type]
                  return (
                    <div key={e.id} style={{ background:ts.bg, borderRadius:'10px', padding:'12px', border:`1px solid ${ts.color}25` }}>
                      <div style={{ fontFamily:'var(--ff-body)', fontSize:'10px', fontWeight:700, color:ts.color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'4px' }}>{ts.label}</div>
                      <div style={{ fontFamily:'var(--ff-display)', fontSize:'15px', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>{e.title}</div>
                      <div style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:'var(--textm)', marginBottom:'4px' }}>📍 {e.location}</div>
                      {e.note && <div style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:e.note.startsWith('⚠️')?'#BC4B51':'var(--textd)', fontStyle:'italic' }}>{e.note}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upcoming events */}
          <div style={{ background:'var(--card)', borderRadius:'16px', padding:'20px', boxShadow:'var(--sh-md)', border:'1px solid var(--bsoft)' }}>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'18px', fontWeight:600, color:'var(--text)', marginBottom:'14px' }}>Upcoming Events</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {upcoming.map(e => {
                const ts = TYPE_STYLE[e.type]
                const d = new Date(e.date)
                return (
                  <div key={e.id} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                    <div style={{ background:ts.bg, borderRadius:'8px', padding:'6px 8px', textAlign:'center', minWidth:'44px', flexShrink:0, border:`1px solid ${ts.color}20` }}>
                      <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:ts.color, textTransform:'uppercase' }}>{MONTHS[d.getMonth()]}</div>
                      <div style={{ fontFamily:'var(--ff-display)', fontSize:'18px', fontWeight:600, color:ts.color, lineHeight:1 }}>{d.getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily:'var(--ff-body)', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{e.title}</div>
                      <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'var(--textd)', marginTop:'2px' }}>{e.location}</div>
                      {e.note && e.note.startsWith('⚠️') && <div style={{ fontFamily:'var(--ff-body)', fontSize:'11px', color:'#BC4B51', marginTop:'2px' }}>{e.note}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weekly pickup */}
          <div style={{ background:'rgba(188,75,81,0.06)', borderRadius:'16px', padding:'18px', border:'1px solid rgba(188,75,81,0.15)' }}>
            <div style={{ fontFamily:'var(--ff-display)', fontSize:'16px', fontWeight:600, color:'var(--text)', marginBottom:'12px' }}>📅 Weekly Pickup</div>
            {[
              { day:'Thursday', time:'2pm', loc:'Knob Hill', level:'All Levels' },
              { day:'Saturday', time:'2pm', loc:'Knob Hill', level:'Int / Adv' },
              { day:'Saturday', time:'2pm', loc:'Ave G', level:'Beginners' },
              { day:'Sunday',   time:'2pm', loc:'Knob Hill', level:'Int / Adv' },
              { day:'Sunday',   time:'2pm', loc:'Ave G', level:'Beginners' },
            ].map((p,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i<4?'1px solid rgba(188,75,81,0.08)':'' }}>
                <div>
                  <span style={{ fontFamily:'var(--ff-body)', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{p.day}</span>
                  <span style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'var(--textd)', marginLeft:'8px' }}>{p.time}</span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--ff-body)', fontSize:'12px', color:'var(--textm)' }}>{p.loc} Courts</div>
                  <div style={{ fontFamily:'var(--ff-mono)', fontSize:'10px', color:'#BC4B51' }}>{p.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

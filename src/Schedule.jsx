const SCHEDULE = [
  { day: 'Thursday', events: [
    { time: '2:00 PM', location: 'Knob Hill Courts',  sub: '811 Esplanade, Redondo', level: 'All Levels', color: '#2C5F78' },
  ]},
  { day: 'Saturday', events: [
    { time: '2:00 PM', location: 'Knob Hill Courts',  sub: '811 Esplanade, Redondo', level: 'Int / Adv',  color: '#E8934A' },
    { time: '2:00 PM', location: 'Ave G Courts',       sub: 'Esplanade near Ave G',  level: 'Beginner',   color: '#4a7c59' },
  ]},
  { day: 'Sunday', events: [
    { time: '2:00 PM', location: 'Knob Hill Courts',  sub: '811 Esplanade, Redondo', level: 'Int / Adv',  color: '#E8934A' },
    { time: '2:00 PM', location: 'Ave G Courts',       sub: 'Esplanade near Ave G',  level: 'Beginner',   color: '#4a7c59' },
  ]},
]

const TODAY = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long' })

export default function Schedule() {
  return (
    <section style={{ marginBottom: '36px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Weekly Pickup</h2>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 300 }}>Knob Hill · Ave G · Redondo Esplanade</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {SCHEDULE.map(day => {
          const isToday = day.day === TODAY
          return (
            <div key={day.day} style={{ background: isToday ? 'var(--pacific)' : 'var(--card)', borderRadius: '16px', padding: '20px', boxShadow: isToday ? '0 8px 32px rgba(44,95,120,0.3)' : 'var(--shadow-sm)', border: '1px solid var(--border-soft)', position: 'relative', overflow: 'hidden' }}>
              {isToday && <div style={{ position: 'absolute', top: '14px', right: '14px', fontFamily: 'var(--font-mono)', fontSize: '9px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today</div>}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: isToday ? 'white' : 'var(--text)', marginBottom: '14px' }}>{day.day}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {day.events.map((ev, i) => (
                  <div key={i} style={{ background: isToday ? 'rgba(255,255,255,0.12)' : 'var(--sand)', borderRadius: '12px', padding: '12px 14px', border: isToday ? '1px solid rgba(255,255,255,0.15)' : `1px solid ${ev.color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: isToday ? 'rgba(255,255,255,0.9)' : 'var(--text)' }}>⏰ {ev.time}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', padding: '2px 10px', borderRadius: '20px', background: isToday ? 'rgba(255,255,255,0.2)' : `${ev.color}15`, color: isToday ? 'white' : ev.color, fontWeight: 600, letterSpacing: '0.04em' }}>{ev.level}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: isToday ? 'white' : 'var(--text-mid)' }}>{ev.location}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: isToday ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: '2px' }}>{ev.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

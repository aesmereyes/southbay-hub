const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80', caption: 'Dawn patrol' },
  'https://images.unsplash.com/photo-1455264745730-cb3b76250820?w=600&q=80',
  'https://images.unsplash.com/photo-1484608856193-968d2be4080e?w=600&q=80',
  'https://images.unsplash.com/photo-1531722569936-825d4ebd7ac6?w=600&q=80',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600&q=80',
  'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
  'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&q=80',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80',
  'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=80',
]

const CAPTIONS = [
  'Dawn patrol, South Bay', 'Glass before the crowds', 'The Strand at golden hour',
  'Hermosa · all day', 'Sets on the horizon', 'Salt air and good company',
  'Between the flags', 'Perfect peel', 'Evening session',
]

export default function PhotoGallery() {
  // Pick 3 random, different photos each load
  const picks = []
  const pool = PHOTOS.map((_, i) => i)
  while (picks.length < 3 && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length)
    picks.push(pool.splice(i, 1)[0])
  }

  return (
    <section style={{ margin: '0 0 36px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
          The Shore
        </h2>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 300, letterSpacing: '0.04em' }}>
          South Bay · Today's light
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '12px', height: '240px' }}>
        {picks.map((idx, i) => (
          <div key={idx} style={{
            borderRadius: i === 0 ? '16px' : '12px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'var(--shadow-md)',
            gridRow: i === 0 ? '1' : '1',
          }}>
            <img
              src={PHOTOS[idx] instanceof Object ? PHOTOS[idx].url : PHOTOS[idx]}
              alt={CAPTIONS[idx]}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
            {i === 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(15,10,5,0.6))' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>{CAPTIONS[idx]}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

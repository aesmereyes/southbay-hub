export default function ScoreGauge({ score, color, size = 120 }) {
  const r = 44, cx = size / 2, cy = size / 2, strokeW = 6
  const polar = (a) => {
    const rad = (a - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  const arc = (s, e) => {
    const a = polar(s), b = polar(e)
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${b.x} ${b.y}`
  }
  const start = 135, sweep = 270
  const fillEnd = start + (Math.max(0, score) / 10) * sweep
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Score ${score} out of 10`}>
      <path d={arc(start, start + sweep)} fill="none" stroke="rgba(139,111,71,0.12)" strokeWidth={strokeW} strokeLinecap="round" />
      {score > 0 && (
        <path d={arc(start, fillEnd)} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }} />
      )}
      <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="32" fontFamily="'Playfair Display', serif" fontWeight="700">{score}</text>
      <text x={cx} y={cy + 19} textAnchor="middle" fill="var(--text-light)"
        fontSize="10" fontFamily="'DM Mono', monospace">/10</text>
    </svg>
  )
}

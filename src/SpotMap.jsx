import { useEffect, useRef } from 'react'
import L from 'leaflet'

export const SPOTS = [
  { id:'marine',        name:'Marine St Courts',        sub:'Manhattan Beach',      tag:'Pro Focus',     lat:33.8853, lon:-118.4104, color:'#2C5F78' },
  { id:'mb-pier',       name:'MB Pier Courts',           sub:'Manhattan Beach',      tag:'Iconic',        lat:33.8842, lon:-118.4097, color:'#2C5F78' },
  { id:'22nd',          name:'22nd St Courts',           sub:'Manhattan Beach',      tag:'High Level',    lat:33.8817, lon:-118.4117, color:'#2C5F78' },
  { id:'26th',          name:'26th St Courts',           sub:'Manhattan Beach',      tag:'Competitive',   lat:33.8858, lon:-118.4110, color:'#2C5F78' },
  { id:'hermosa-pier',  name:'Hermosa Pier Courts',      sub:'Hermosa Beach ⭐',     tag:'Home Court',    lat:33.8622, lon:-118.4023, color:'#C4614A' },
  { id:'hermosa-12th',  name:'12th St Courts',           sub:'Hermosa Beach',        tag:'Intermediate',  lat:33.8602, lon:-118.4018, color:'#C4614A' },
  { id:'hermosa-6th',   name:'6th St Courts',            sub:'Hermosa Beach',        tag:'Mixed',         lat:33.8568, lon:-118.3999, color:'#C4614A' },
  { id:'hermosa-1st',   name:'1st St Courts',            sub:'Hermosa Beach',        tag:'South End',     lat:33.8539, lon:-118.3990, color:'#C4614A' },
  { id:'knob-hill',     name:'Knob Hill Courts',         sub:'Redondo · 811 Esplanade', tag:'Thu/Sat/Sun', lat:33.8285, lon:-118.3905, color:'#4a7c59' },
  { id:'ave-g',         name:'Ave G Courts',             sub:'Redondo · Esplanade',  tag:'Sat/Sun Beginner', lat:33.8241, lon:-118.3897, color:'#4a7c59' },
  { id:'redondo',       name:'Redondo Esplanade',        sub:'Redondo Beach',        tag:'Wind Protected', lat:33.8304, lon:-118.3905, color:'#4a7c59' },
  { id:'torrance',      name:'Torrance Beach Courts',    sub:'Redondo / Torrance',   tag:'Chill Vibes',   lat:33.8380, lon:-118.3900, color:'#4a7c59' },
  { id:'dockweiler',    name:'Dockweiler Courts',        sub:'Playa del Rey',        tag:'Night Play',    lat:33.9297, lon:-118.4272, color:'#8B6F47' },
]

export const CREAMY_BOYS = [
  { id:'cb-hermosa', name:'Creamy Boys Hermosa',   lat:33.8619, lon:-118.3997, addr:'1136 Hermosa Ave',   hours:'Mon–Thu 12–10pm · Fri–Sat 12–11pm' },
  { id:'cb-elseg',   name:'Creamy Boys El Segundo', lat:33.9189, lon:-118.4167, addr:'118 W Grand Ave',    hours:'Mon–Thu 12–10pm · Fri–Sat 12–11pm' },
]

const mkIcon = (color, active, isHome) => {
  const s = (active || isHome) ? 14 : 9
  return L.divIcon({
    html: `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 8px ${color}80;"></div>`,
    className:'', iconSize:[s,s], iconAnchor:[s/2,s/2],
  })
}

export default function SpotMap({ activeSpot, onSpotClick }) {
  const mapRef = useRef(null), mapObj = useRef(null), markers = useRef({})

  useEffect(() => {
    if (mapObj.current) return
    const map = L.map(mapRef.current, { center:[33.862,-118.401], zoom:13, zoomControl:false })
    L.control.zoom({ position:'bottomright' }).addTo(map)
    // Warm Positron tiles — beachy, muted
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:'&copy; <a href="https://carto.com/">CARTO</a>', subdomains:'abcd', maxZoom:19,
    }).addTo(map)

    // Buoy markers
    ;[
      { lat:33.749, lon:-119.053, id:'46025', color:'#2C5F78', desc:'Outer Scout · Period + Direction' },
      { lat:33.855, lon:-118.633, id:'46221', color:'#6BAE9A', desc:'Inner Confirm · Wave Height'      },
    ].forEach(b => {
      L.marker([b.lat,b.lon], { icon:L.divIcon({ html:`<div style="width:8px;height:8px;border-radius:50%;background:${b.color};border:2px solid white;box-shadow:0 0 6px ${b.color};"></div>`, className:'', iconSize:[8,8], iconAnchor:[4,4] }) })
        .addTo(map).bindPopup(`<b style="color:${b.color}">Buoy ${b.id}</b><br><span style="font-size:11px;color:#5c4f3a">${b.desc}</span>`)
    })

    // Creamy Boys 🍦
    CREAMY_BOYS.forEach(cb => {
      L.marker([cb.lat,cb.lon], { icon:L.divIcon({ html:`<div style="width:14px;height:14px;border-radius:50%;background:#f472b6;border:2px solid white;box-shadow:0 2px 8px #f472b680;display:flex;align-items:center;justify-content:center;font-size:8px;">🍦</div>`, className:'', iconSize:[14,14], iconAnchor:[7,7] }) })
        .addTo(map).bindPopup(`<b style="color:#db2777">${cb.name}</b><br><span style="font-size:11px;color:#5c4f3a">${cb.addr}<br>🕐 ${cb.hours}</span>`)
    })

    SPOTS.forEach(spot => {
      const isHome = spot.id === 'hermosa-pier'
      const m = L.marker([spot.lat,spot.lon], { icon:mkIcon(spot.color,false,isHome) }).addTo(map)
        .bindPopup(`<div style="font-family:'Montserrat',sans-serif"><b style="color:${spot.color};font-size:13px">${spot.name}</b><br><span style="font-size:11px;color:#5c4f3a">${spot.sub}</span><br><span style="font-size:10px;color:${spot.color};background:${spot.color}15;padding:2px 8px;border-radius:10px;display:inline-block;margin-top:4px">${spot.tag}</span></div>`, { maxWidth:200 })
      m.on('click', () => onSpotClick(spot.id))
      markers.current[spot.id] = { m, color:spot.color, isHome }
    })
    mapObj.current = map
  }, [])

  useEffect(() => {
    SPOTS.forEach(spot => {
      const e = markers.current[spot.id]
      if (!e) return
      const active = spot.id === activeSpot
      e.m.setIcon(mkIcon(e.color, active, e.isHome))
      if (active) { mapObj.current?.flyTo([spot.lat,spot.lon], 15, { duration:1.2 }); e.m.openPopup() }
    })
  }, [activeSpot])

  return <div ref={mapRef} style={{ height:'460px', borderRadius:'16px', overflow:'hidden', boxShadow:'var(--shadow-md)' }} />
}

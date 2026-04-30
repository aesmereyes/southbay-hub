import { useState, useEffect, useCallback, useRef } from 'react'
import { mToFt } from './logic'

// Fix 1: Import the JSON directly so Vite bundles it into dist.
// GitHub Actions updates src/data/buoy-data.json hourly, rebuilds, and pushes.
// The browser always gets the latest bundled version with zero CORS issues.
import buoyDataSeed from './data/buoy-data.json'

export const BEACHES = [
  { id:'el-segundo',  name:'El Segundo',     icon:'🤙', lat:33.916, lon:-118.427 },
  { id:'manhattan',   name:'Manhattan Beach', icon:'🏄', lat:33.886, lon:-118.411 },
  { id:'hermosa',     name:'Hermosa Beach',   icon:'⭐', lat:33.862, lon:-118.402 },
  { id:'redondo',     name:'Redondo Beach',   icon:'🌊', lat:33.845, lon:-118.393 },
  { id:'torrance',    name:'Torrance Beach',  icon:'🏖️', lat:33.835, lon:-118.387 },
]

const mkMarineUrl = (lat, lon) =>
  `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
  `&current=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,` +
  `swell_wave_direction,wind_wave_height,wind_wave_period` +
  `&hourly=wave_height,wave_period,swell_wave_height,swell_wave_period` +
  `&timezone=America%2FLos_Angeles&forecast_days=3`

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=33.88&longitude=-118.41` +
  `&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,uv_index` +
  `&daily=sunrise,sunset&timezone=America%2FLos_Angeles&forecast_days=2`

const WATER_TEMP_URL =
  `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
  `?station=9410840&product=water_temperature&date=latest` +
  `&units=english&time_zone=lst_ldt&format=json&application=SouthBayHub`

const TIDES_URL =
  `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
  `?station=9410840&product=predictions&date=today&datum=MLLW` +
  `&interval=hilo&units=english&time_zone=lst_ldt&format=json&application=SouthBayHub`

function parseBeach(res, beach) {
  const c = res.current
  const now = new Date()
  const hi  = Math.max(0, res.hourly.time.findIndex(t => new Date(t) >= now))
  return {
    ...beach,
    waveHtFt:     mToFt(c.wave_height),
    wavePer:      c.wave_period   ? +c.wave_period.toFixed(1)   : null,
    waveDirDeg:   c.wave_direction   ?? null,
    swellHtFt:    mToFt(c.swell_wave_height),
    swellPer:     c.swell_wave_period ?? null,
    swellDirDeg:  c.swell_wave_direction ?? null,
    windWaveHtFt: mToFt(c.wind_wave_height),
    windWavePer:  c.wind_wave_period ?? null,
    trendTimes:   res.hourly.time.slice(hi, hi+48),
    trendWaveHt:  res.hourly.wave_height.slice(hi, hi+48).map(mToFt),
    trendPeriod:  res.hourly.wave_period.slice(hi, hi+48),
  }
}

export function useStationData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [lastFetch, setLF]    = useState(null)
  const timer = useRef(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Per-beach marine + weather run in parallel from browser (CORS enabled)
      const [weatherRes, waterRes, tidesRes, ...marineResults] = await Promise.all([
        fetch(WEATHER_URL).then(r => r.json()),
        fetch(WATER_TEMP_URL).then(r => r.json()).catch(() => null),
        fetch(TIDES_URL).then(r => r.json()).catch(() => null),
        ...BEACHES.map(b => fetch(mkMarineUrl(b.lat, b.lon)).then(r => r.json())),
      ])

      const beaches = marineResults.map((res, i) => parseBeach(res, BEACHES[i]))
      const primary = beaches.find(b => b.id === 'hermosa') || beaches[0]
      const wc      = weatherRes.current

      // Water temperature — NOAA CO-OPS Santa Monica Pier
      const waterTempF = (() => {
        try { const v = parseFloat(waterRes?.data?.[0]?.v); return isNaN(v) ? null : +v.toFixed(1) }
        catch { return null }
      })()

      // Tides
      const tides = (() => {
        try {
          return tidesRes?.predictions?.slice(0, 4).map(p => ({
            time: p.t.split(' ')[1],
            ht:   +parseFloat(p.v).toFixed(1),
            type: p.type === 'H' ? 'High' : 'Low',
          })) || []
        } catch { return [] }
      })()

      // Buoy detail comes from the bundled JSON (updated hourly by GitHub Actions)
      // Use sunrise/sunset from buoy JSON if available, otherwise fall back to weather API
      const buoy = buoyDataSeed
      const sunriseISO = buoy.sunrise || weatherRes.daily?.sunrise?.[0] || null
      const sunsetISO  = buoy.sunset  || weatherRes.daily?.sunset?.[0]  || null

      setData({
        beaches, primary,
        // surf
        wvhtFt:       primary.waveHtFt,
        dpdS:         primary.wavePer,
        mwdDeg:       primary.waveDirDeg,
        swellHtFt:    primary.swellHtFt,
        swellPeriod:  primary.swellPer,
        swellDirDeg:  primary.swellDirDeg,
        windWaveHtFt: primary.windWaveHtFt,
        // weather
        windMph:      +((wc.wind_speed_10m * 0.6214).toFixed(1)),
        windDirDeg:   wc.wind_direction_10m,
        cloudPct:     wc.cloud_cover,
        uvIndex:      wc.uv_index,
        tempF:        +((wc.temperature_2m * 9/5 + 32).toFixed(1)),
        sunriseISO,
        sunsetISO,
        waterTempF,
        tides,
        // buoy detail (bundled, from ERDDAP via GitHub Actions)
        stations:      buoy.stations || null,
        buoyFetchedAt: buoy.fetched_at || null,
      })
      setLF(new Date())
    } catch (e) {
      console.error('Data error:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    timer.current = setInterval(fetchAll, 30 * 60 * 1000)
    return () => clearInterval(timer.current)
  }, [fetchAll])

  return { data, loading, error, lastFetch, refetch: fetchAll }
}

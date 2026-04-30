const C16 = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
export const degToCompass = d => d != null ? C16[Math.round(d/22.5)%16] : '—'
export const mToFt = m => m != null ? +(m*3.281).toFixed(1) : null

export function calcSurfScore({heightFt, periodS, windMph}){
  if(!heightFt||!periodS) return 0
  if(heightFt>8) return 1
  if(periodS>16) return 3
  let s=5
  if(heightFt>=4&&heightFt<=6)s+=2; else if(heightFt>=2.5&&heightFt<4)s+=1; else if(heightFt<1)s-=2; else if(heightFt>=1&&heightFt<1.5)s-=1
  if(periodS>=12&&periodS<=16)s+=2; else if(periodS>=9&&periodS<12)s+=1; else if(periodS<8)s-=1
  if(windMph<8)s+=1; else if(windMph>20)s-=2; else if(windMph>12)s-=1
  return Math.max(0,Math.min(10,Math.round(s)))
}

export function surfLabel(score, htFt, per){
  if(!htFt) return {t:'No Data', c:'#8B7355'}
  if(htFt>8) return {t:'Closed Out', c:'#BC4B51'}
  if(per>16)  return {t:'Walled Out', c:'#E9A23B'}
  if(score>=8)return {t:'Epic 🔥',    c:'#3D5A40'}
  if(score>=6)return {t:'Good',       c:'#1F4E6B'}
  if(score>=4)return {t:'Fair',       c:'#E9A23B'}
  return              {t:'Poor',       c:'#BC4B51'}
}

export function surfAdvice({score,heightFt,periodS,windMph,dir}){
  if(!heightFt) return 'Buoy data loading — Open-Meteo Marine updates every hour.'
  const d=degToCompass(dir)
  if(heightFt>8) return `Closed out at ${heightFt.toFixed(1)}ft. Most breaks unsurfable.`
  if(periodS>16) return `${Math.round(periodS)}s period from ${d} walls out South Bay beach breaks. Try Redondo breakwater.`
  if(score>=8) return `${d} swell, ${heightFt.toFixed(1)}ft/${Math.round(periodS)}s — it's firing. Go now, don't think.`
  if(score>=6) return windMph<8 ? `Glassy ${heightFt.toFixed(1)}ft with ${Math.round(periodS)}s period. Solid session.` : `${heightFt.toFixed(1)}ft/${Math.round(periodS)}s with ${windMph.toFixed(0)}mph wind. Worth paddling out.`
  if(score>=4) return `${heightFt.toFixed(1)}ft/${Math.round(periodS)}s — survivable. Manage expectations and you'll have fun.`
  return `${heightFt.toFixed(1)}ft slop. Better days ahead. Check the 48hr trend.`
}

export function calcVolleyScore({windMph,cloudPct}){
  if(windMph==null)return 0
  let s=8
  if(windMph<=5)s+=2; else if(windMph<=12)s+=0; else if(windMph<=20)s-=2; else s-=5
  if(cloudPct>80)s-=1
  return Math.max(0,Math.min(10,Math.round(s)))
}

export function windLabel(mph){
  if(mph==null) return {t:'No Data', c:'#8B7355'}
  if(mph<=5)  return {t:'Pure',      c:'#3D5A40'}
  if(mph<=12) return {t:'Breezy',    c:'#1F4E6B'}
  if(mph<=20) return {t:'Heavy',     c:'#E9A23B'}
  return             {t:'Blown Out', c:'#BC4B51'}
}

export function vibeComment(data, isNight, cloudPct, uvIndex){
  if(isNight){
    const opts=[
      {h:"Moon's Out, Board's Out", s:"Night session energy · Lit courts open"},
      {h:"After Hours at the Beach", s:"Sand volleyball under the lights — find your crew"},
      {h:"The Shore is Yours Tonight", s:"Stars over the Pacific · Quieter crowds"},
    ]
    return opts[Math.floor(Math.random()*opts.length)]
  }
  if(!data) return {h:"Reading the Water…", s:"Fetching live conditions"}
  const {wvhtFt,dpdS,windMph}=data
  if(cloudPct>80) return {h:"A Moody Ocean Day ☁️", s:"Grab a hoodie. The waves don't care about clouds — but you might."}
  if(uvIndex>=9)  return {h:"The Sun is NOT Messing Around ☀️", s:"SPF 50+, polarized shades, and a hat. You have been warned."}
  if(uvIndex>=7)  return {h:"High UV Alert", s:"Sunscreen is not optional. Reapply every 90 min or become a lobster."}
  if(wvhtFt>=5&&dpdS>=12) return {h:`The Water is on Fire 🔥`, s:`${wvhtFt.toFixed(1)}ft · ${Math.round(dpdS)}s · Don't you dare sit this one out`}
  if(wvhtFt>=3&&dpdS>=10) return {h:"The Water is Calling", s:`${wvhtFt.toFixed(1)}ft / ${Math.round(dpdS)}s — worth it`}
  if(wvhtFt>=1.5)         return {h:"Something's Out There", s:`${wvhtFt.toFixed(1)}ft — not epic, but you'll catch something`}
  if(windMph<=5)          return {h:"Perfect for the Sand", s:"Zero drift. Volleyball sets going exactly where you want them."}
  if(windMph<=12)         return {h:"Breezy & Beautiful", s:`${windMph.toFixed(0)}mph — use it on float serves and deep angles`}
  if(windMph>20)          return {h:"It's Blowing Out There 💨", s:`${windMph.toFixed(0)}mph — only the brave are on the sand today`}
  return {h:"A Day at the Beach", s:"South Bay is always on. Pick your sport."}
}

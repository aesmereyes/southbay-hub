# South Bay Hub — Surf & Volleyball Dashboard

**Live:** https://aesmereyes.github.io/southbay-hub/

Real-time surf and volleyball conditions for Manhattan Beach, Hermosa Beach, and Redondo Beach.

## Data Sources

| Source | Data |
|--------|------|
| **Open-Meteo Marine** | Per-beach wave height, period, direction, swell (browser, live) |
| **NOAA ERDDAP** | Buoy 46025, 46221, 46268, ICAC1, 46222, 46253 (GitHub Actions, hourly) |
| **NOAA CO-OPS** | Water temperature, tides — Santa Monica Pier station 9410840 |
| **Open-Meteo Weather** | Wind, UV, cloud cover, sunrise/sunset |

## Why ERDDAP for buoys?

NOAA's direct `.txt` files block automated requests with a 403. ERDDAP (coastwatch.pfeg.noaa.gov) is NOAA's official data server with proper CORS and API support — same data, reliable access.

## Stack

React + Vite → GitHub Pages via GitHub Actions

## Local dev
```bash
npm install && npm run dev
```

# TRAFFIQ CLOUD

A frontend-only smart traffic monitoring demonstration for a UI/UX event. The cinematic intro uses the supplied red sports car video. The dashboard uses fixed illustrative data and browser-local state; it does not connect to cameras, signals, cloud services, or a backend.

## Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The intro's **Enter Dashboard** button opens `/dashboard`. `/login` is an optional demonstration role switch; the dashboard is directly accessible for judging.

For a production build, run `npm run build` and `npm run start`.

## Edit quickly during the event

| Change | File |
| --- | --- |
| Intro titles, supporting copy, button text and route | `config/introContent.ts` |
| Intro scroll length | `introScrollDistance` in `config/introContent.ts` |
| Intro animation transitions | `components/intro/CinematicIntro.tsx` |
| Intro styling and color tokens | `app/globals.css` |
| Dashboard navigation labels and routes | `config/dashboardNav.ts` |
| Road names, coordinates, volumes and speed | `data/roads.ts` |
| Camera demo status and locations | `data/cameras.ts` |
| Junction timings | `data/junctions.ts` |
| Incidents | `data/incidents.ts` |
| Chart datasets | `data/traffic-history.ts` |
| Dashboard styling | `app/dashboard/dashboard.css` and `dashboard-pages.css` |

The supplied source video remains at `vedio/Red_sports_car_driving_animation_20261015111214.mp4`. An unchanged copy is served from `public/videos/car-intro.mp4`. The fallback poster at `public/images/car-poster.jpg` was extracted from that video. To replace the clip later, replace the public MP4 without changing its filename.

## Demo interactions

- All sidebar routes work. The mobile menu and sidebar collapse are interactive.
- Map markers and the road list select locations. The OpenStreetMap base layer needs an internet connection; location overlays and details remain illustrative.
- Camera status, incident status, junction timings and preferences persist in browser `localStorage` and update shared overview values.
- Charts have hover tooltips. Analytics filters transform the fixed reference data. The weekly heatmap remains a clearly labeled reference view.
- Reports generate real rows from the local data, download a CSV, and open the browser print dialog for PDF saving.
- Login accepts any valid email and a password of at least six characters. It is a role demonstration, not real authentication. The Viewer role cannot edit incidents, cameras or junctions; Admin can reset the local demo.

## Metric definitions

- **Vehicles monitored:** sum of each demo road's fixed observation-day vehicle count.
- **Average speed:** vehicle-weighted mean of road speeds, rounded to the nearest km/h.
- **Congestion index:** vehicle-weighted mean of illustrative road levels (`Low=24`, `Moderate=52`, `High=74`, `Severe=91`).
- **Active incidents:** incidents whose status is not `Resolved`.
- **Active cameras / operational signals:** count of locally simulated online/operational devices.

The demo makes no live traffic or cloud connectivity claim. OSM tiles are supplied by OpenStreetMap and require internet access.

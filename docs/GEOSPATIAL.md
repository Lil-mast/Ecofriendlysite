# Geospatial Features in EcoNexus

This document describes how geospatial functionality works in the EcoNexus app: data models, services, API endpoints, and how they fit together.

## Overview

The geospatial layer helps users:

1. **Find nearby eco-friendly locations** (Eco Hubs) – recycling, EV charging, bike share, etc.
2. **Calculate route emissions** – distance, transport mode, and CO₂ for a path, with alternative modes.
3. **Get spatial insights** – emission hotspots, commute patterns, and recommendations.
4. **Contribute and check in at hubs** – submit new hubs and check in when visiting (with proximity check).
5. **Analyze renewable potential** – solar, wind, reforestation at a location.

All of this is backed by **MongoDB** (with geospatial indexes), **Turf.js** for geometry, and optional external APIs (e.g. OpenRouteService, Electricity Map).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  API Routes (/api/v1/geo/*)                                      │
│  GeospatialController                                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌──────────────────┐   ┌─────────────┐
│ SpatialAnalysis│   │ CarbonCalculator │   │ EcoHub      │
│ (hotspots,     │   │ (distance,        │   │ (MongoDB    │
│  nearby,       │   │  emissions,       │   │  model)     │
│  isochrones)   │   │  transport mode)  │   │             │
└───────┬────────┘   └────────┬─────────┘   └──────┬──────┘
        │                     │                    │
        └─────────────────────┼────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ CarbonEntry      │
                    │ (MongoDB, with   │
                    │  geometry)       │
                    └──────────────────┘
```

- **GeospatialController** – Handles HTTP for all geo endpoints; calls services and returns JSON.
- **SpatialAnalysis** – Hotspot clustering, nearby hubs, isochrones, commute analysis, renewable potential.
- **CarbonCalculator** – Distances, transport emissions (with factors), optional grid intensity; used by routes and WebSocket live tracking.
- **EcoHub** – MongoDB model for eco-friendly locations (2dsphere index for `$near`).
- **CarbonEntry** – MongoDB model for user carbon entries; can store `geometry` (Point/LineString) for transport and location-based entries.

---

## Data Models

### EcoHub (MongoDB)

Stores eco-friendly locations (recycling, EV charging, bike share, etc.).

- **location** – GeoJSON Point `[longitude, latitude]` (required). Enables `$near` queries.
- **type** – One of: `recycling_center`, `ev_charging`, `bike_share`, `repair_cafe`, `farmers_market`, `sustainability_hub`, `renewable_installer`, `carbon_project_site`, `eco_store`, `community_garden`.
- **verified** – Boolean; only verified hubs are returned by default in “nearby” search.
- **checkIns** – Array of user check-ins (userId, date, carbonSaved) for gamification.
- **address**, **contact**, **operatingHours**, **details** (e.g. chargers, bikes) for display.

The schema uses a **2dsphere index** on `location` so MongoDB can run geospatial queries (`$near`, `$maxDistance`).

### CarbonEntry (MongoDB)

Stores individual carbon footprint entries. When an entry is tied to a place or a route:

- **geometry** – GeoJSON:
  - **Point** – Single location (e.g. home, office).
  - **LineString** – Route (e.g. drive, cycle path).
- **emissions** – Includes `totalCo2e`; used for hotspot and commute analysis.
- **category** – e.g. `transportation`, `energy`; used for recommendations.
- **userId**, **date** – For filtering by user and time range.

SpatialAnalysis uses these entries to find emission hotspots and commute patterns.

---

## Services

### SpatialAnalysis (`src/services/geospatial/SpatialAnalysis.js`)

- **identifyHotspots(userId, timeRange)**  
  Loads the user’s CarbonEntries with geometry and emissions in the given time range. Converts them to points (centroid for LineStrings), runs **DBSCAN** (Turf.js `clustersDbscan`) to cluster by location, then returns hotspots with center, radius, total/average emissions, primary category, and recommendations (e.g. mode shift, route optimization).

- **findNearbyServices(lat, lng, radius, types)**  
  Queries **EcoHub** with `$near` and `$maxDistance` (meters). Optionally filters by `type`. Uses Turf to compute distance from user to each hub and adds `walkable` / `cyclable` and travel emissions.

- **generateIsochrones(center, modes)**  
  Builds simplified isochrones (areas reachable in a given time) per mode (walking, cycling, driving) using Turf’s `circle` (radius from speed × time). Can be extended to use OpenRouteService or similar for road-based isochrones.

- **analyzeCommutePatterns(userId, days)**  
  Uses transportation CarbonEntries with LineString geometry. Extracts start/end points, clusters destinations with DBSCAN, and returns frequent destinations and patterns.

- **analyzeRenewablePotential(bounds, projectType)**  
  Returns criteria and data sources for solar, wind, or reforestation (no external API calls in the stub; can be wired to real data later).

### CarbonCalculator (`src/services/geospatial/CarbonCalculator.js`)

- **calculatePathDistance(coordinates)**  
  Uses Turf to compute total distance along a line (e.g. route).

- **calculateTransportEmissions({ mode, distance, passengers }, userLocation)**  
  Uses built-in emission factors (IPCC/EPA/DEFRA style) per transport mode. Can factor in grid intensity by user location (e.g. for EVs). Returns CO₂ and total CO₂e.

- **calculateDistance(pointA, pointB)**  
  Distance between two points (Turf), used e.g. for check-in proximity.

- **detectTransportMode(points)**  
  Infers transport mode from a sequence of points (used e.g. by WebSocket live tracking).

Emission factors (e.g. kg CO2/km per mode) and optional grid intensity are defined in the service; location can be used to adjust for regional electricity carbon intensity.

---

## API Endpoints (all under `/api/v1`, auth required except where noted)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/geo/nearby` | Nearby eco hubs. Query: `lat`, `lng`, optional `radius` (m), `types` (comma-separated). |
| POST | `/geo/route` | Route emissions. Body: `waypoints` (array of `{lat, lng}`), `mode`, optional `alternatives`. Returns distance, emissions, and alternative modes. |
| GET | `/geo/insights` | Spatial insights for the current user. Query: `period` (days). Returns hotspots, commute analysis, recommendations. |
| POST | `/geo/hubs` | Create a new hub (body: hub fields). Saved as unverified until admin approves. |
| POST | `/geo/checkin` | Check in at a hub. Body: `hubId`, `lat`, `lng`, optional `activity`. Fails if user is not within ~100 m. |
| GET | `/geo/renewable-potential` | Renewable potential at a point. Query: `lat`, `lng`, `projectType` (solar/wind/reforestation), optional `area`. |

All geo routes except “nearby” (if you choose to keep it public) are protected by the same auth middleware as the rest of the API; the frontend must send a valid Bearer token.

---

## Flow Examples

### 1. “Find nearby hubs”

1. Frontend (or client) calls `GET /api/v1/geo/nearby?lat=37.77&lng=-122.42&radius=5000&types=ev_charging,bike_share`.
2. **GeospatialController.findNearbyHubs** reads `lat`, `lng`, `radius`, `types` from query.
3. **SpatialAnalysis.findNearbyServices(lat, lng, radius, types)** runs an EcoHub `$near` query (with optional type filter), then enriches each hub with distance, walkable/cyclable, and travel emissions.
4. For each hub, **SpatialAnalysis.generateIsochrones** is called at the hub’s coordinates to add isochrone polygons (walk/cycle/drive).
5. Controller returns `{ hubs, query, total }` with the enriched list.

### 2. “Route emissions”

1. Client sends `POST /api/v1/geo/route` with `waypoints: [{lat, lng}, ...]` and `mode` (e.g. `driving`).
2. **GeospatialController.calculateRoute** uses **CarbonCalculator.calculatePathDistance(waypoints)** for distance.
3. **CarbonCalculator.calculateTransportEmissions** returns CO₂ for the chosen mode (and optionally user location for grid intensity).
4. If `alternatives` is true, the same distance is computed for other modes (e.g. cycling, transit, walking) and returned as `alternatives` with savings.

### 3. “Spatial insights”

1. Client calls `GET /api/v1/geo/insights?period=90`.
2. **GeospatialController.getSpatialInsights** runs in parallel:
   - **SpatialAnalysis.identifyHotspots(userId, period)** – clusters CarbonEntries into hotspots.
   - **SpatialAnalysis.analyzeCommutePatterns(userId, period)** – commute patterns from LineString entries.
   - **generateSpatialRecommendations(userId)** – e.g. route optimization, EV charging suggestions.
3. Response is `{ hotspots, commuteAnalysis, recommendations, generatedAt }`.

### 4. “Check in at hub”

1. Client sends `POST /api/v1/geo/checkin` with `hubId`, `lat`, `lng`, and optional `activity`.
2. Controller loads the **EcoHub** by `hubId`.
3. **CarbonCalculator.calculateDistance** between user and hub; if &gt; ~100 m, response is 400 “Too far from location”.
4. Otherwise, a check-in is appended to the hub’s `checkIns` and saved; badges (e.g. first_visit, regular, eco_warrior) are derived from the user’s check-in count at that hub and returned in the response.

---

## Frontend Usage

The frontend does not implement geo UI in this repo yet. To use the geo API:

1. **Auth** – Send `Authorization: Bearer <token>` for all protected geo endpoints.
2. **Nearby** – Call `GET /api/v1/geo/nearby?lat=...&lng=...&radius=5000` (and optionally `types=ev_charging,bike_share`). You can use the browser geolocation API or a map click to get `lat`/`lng`.
3. **Route** – Call `POST /api/v1/geo/route` with `waypoints` and `mode`; display distance and emissions (and alternatives if requested).
4. **Insights** – Call `GET /api/v1/geo/insights?period=90` and show hotspots, commute summary, and recommendations on a map or list.
5. **Check-in** – After getting the user’s position (and selecting a hub), call `POST /api/v1/geo/checkin` with `hubId`, `lat`, `lng`.

Base URL in development is the Vite proxy (`/api`) or the backend origin (e.g. `http://localhost:3001`); in production set `VITE_API_URL` to your API origin.

---

## Dependencies

- **@turf/turf** – Distance, centroid, line length, DBSCAN clustering, circle (isochrones), etc.
- **MongoDB** – 2dsphere index on EcoHub and geometry on CarbonEntry for geo queries.
- **Optional** – OpenRouteService (routes/isochrones), Electricity Map (grid intensity); currently the code uses built-in factors and simplified isochrones.

---

## Summary

Geospatial in EcoNexus works by: (1) storing locations and routes in **MongoDB** (EcoHub and CarbonEntry with GeoJSON), (2) using **SpatialAnalysis** for nearby hubs, hotspots, isochrones, and commute patterns, (3) using **CarbonCalculator** for distances and transport emissions, and (4) exposing everything through **GeospatialController** under `/api/v1/geo/*`. The frontend can call these endpoints with the user’s position and route data to build maps, dashboards, and check-in flows.

# API Reference

All endpoints live under `/api/*`. The base URL in production is
`https://harbor.radai-1984.dev`. In local development it is `http://localhost:3000`.

The API is intentionally shaped so that every route handler can be swapped for a real
service later. Today every response is computed from `src/lib/mock-data.ts`.

Conventions:

- Every response is `application/json`.
- Every response is wrapped: `{ "data": ... }` (some include an extra `kpis` block).
- Every request body is JSON.
- No authentication is required. **Do not put secrets in this surface in production
  without adding an auth layer first.**

---

## `GET /api/vessels`

Returns the fleet list and pre-computed cockpit KPIs.

**Response** — `200 OK`

```json
{
  "data": [
    {
      "id": "v-001",
      "name": "Aurora Crest",
      "imo": "9742118",
      "type": "Container",
      "status": "Underway",
      "flag": "Marshall Islands",
      "capacityTeu": 14400,
      "speedKn": 18.7,
      "fuelPct": 64,
      "cargo": "Mixed FCL — electronics, apparel",
      "originPort": "Yantian",
      "destinationPort": "Rotterdam",
      "etaIso": "2026-06-04T08:30:00Z",
      "delayHours": 6,
      "carbonIndex": 71,
      "routeProgress": 58,
      "speedHistory": [16.8, 17.4, 18.1, 17.9, 18.5, 18.9, 18.7]
    }
  ],
  "kpis": {
    "vesselsInTransit": 4,
    "portsUnderStress": 3,
    "activeDisruptions": 5,
    "onTimeScore": 74,
    "avgPortWaitHours": 30,
    "carbonIntensity": 72
  }
}
```

Field types are defined in [`src/types/index.ts`](../src/types/index.ts).

---

## `GET /api/ports`

Returns the watched-port snapshot — congestion tier, anchorage queue, dwell time,
weekly trend, and the most recent notable events for each port.

**Response** — `200 OK`

```json
{
  "data": [
    {
      "id": "p-001",
      "name": "Singapore",
      "country": "Singapore",
      "unlocode": "SGSIN",
      "congestion": "Heavy",
      "vesselsAtAnchor": 38,
      "vesselsBerthed": 64,
      "avgWaitHours": 36,
      "weeklyTrend": 12,
      "cargoMix": "Transshipment, bunker, container",
      "events": ["Heavy NE monsoon swell", "Berth 41 maintenance window"]
    }
  ]
}
```

---

## `GET /api/voyages`

Returns the active voyage ledger — route, vessel, distance, on-time score, risk score,
fuel burn, departure/arrival windows.

**Response** — `200 OK`

```json
{
  "data": [
    {
      "id": "vy-001",
      "routeCode": "AS-EU-12",
      "from": "Yantian",
      "to": "Rotterdam",
      "vessel": "Aurora Crest",
      "departureIso": "2026-05-12T03:00:00Z",
      "arrivalIso": "2026-06-04T08:30:00Z",
      "distanceNm": 10620,
      "status": "In transit",
      "fuelTons": 2840,
      "onTimeScore": 78,
      "riskScore": 31
    }
  ]
}
```

---

## `GET /api/disruptions`

Returns active disruption signals — weather, congestion, strike, mechanical,
geopolitical. Severity and status drive the cockpit's alert feed and the
Disruptions page.

**Response** — `200 OK`

```json
{
  "data": [
    {
      "id": "d-001",
      "severity": "Critical",
      "type": "Congestion",
      "location": "Long Beach (USLGB)",
      "message": "27 vessels at anchorage. ILWU shift overtime restrictions extend dwell times beyond 60h.",
      "affectedVessels": 11,
      "detectedIso": "2026-05-22T05:42:00Z",
      "status": "Open"
    }
  ]
}
```

---

## `POST /api/voyages/plan`

Mock voyage optimization. The handler fabricates a deterministic-but-fresh `Voyage`
with `status: "Planned"` and returns it.

**Request body**

```json
{
  "from": "Yokohama",
  "to": "Hamburg",
  "vessel": "Cygnus Maru"
}
```

All three fields are optional; sensible defaults are filled in.

**Response** — `200 OK`

```json
{
  "data": {
    "id": "vy-1779454152235",
    "routeCode": "YO-HA-NEW",
    "from": "Yokohama",
    "to": "Hamburg",
    "vessel": "Cygnus Maru",
    "departureIso": "2026-05-24T00:49:12.235Z",
    "arrivalIso": "2026-06-12T12:49:12.235Z",
    "distanceNm": 8420,
    "status": "Planned",
    "fuelTons": 2310,
    "onTimeScore": 81,
    "riskScore": 27
  }
}
```

**curl**

```bash
curl -X POST https://harbor.radai-1984.dev/api/voyages/plan \
  -H "Content-Type: application/json" \
  -d '{"from":"Yokohama","to":"Hamburg","vessel":"Cygnus Maru"}'
```

---

## `POST /api/ai/analyze`

Mock routing analyst. The handler inspects the `question` for trigger keywords and
returns a templated answer over the mock dataset. The intended replacement is an LLM
with retrieval over the operator's own voyages.

Trigger keywords currently recognized:

| Keywords in `question`                             | Answer template                                     |
|----------------------------------------------------|-----------------------------------------------------|
| `delay`, `late`, `on time`, `on-time`              | Worst on-time route + recommended action            |
| `congest`, `port`                                  | Ports under stress ranked by wait                   |
| `disruption`, `risk`, `alert`                      | Counts of open + critical, top two routes to flag   |
| `fuel`, `carbon`, `emission`                       | Highest carbon-intensity vessel + slow-steam advice |
| `brief`, `summary`, `report`                       | Full weekly ocean-freight brief                     |
| *(none of the above)*                              | Fallback narrative                                  |

**Request body**

```json
{
  "question": "Where are the worst delays right now?"
}
```

**Response** — `200 OK`

```json
{
  "data": {
    "answer": "Lowest on-time score is route SA-NA-07 (Valparaiso → Long Beach) on Boreal Vega: 41/100 with risk 76. Suggest pre-positioning a slot at the discharge port and notifying the consignee.",
    "citations": [
      "Mock AIS positions",
      "Mock port congestion model",
      "Mock weather + geopolitics feed"
    ]
  }
}
```

**curl**

```bash
curl -X POST https://harbor.radai-1984.dev/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"Brief me on disruptions and risk"}'
```

---

## Error handling

The current prototype trusts the inputs and never fails — there is no validation layer
because no real consequence depends on the result. In production, every endpoint should:

- Validate the body with `zod` (or equivalent) and return `400` on malformed input.
- Authenticate the request and return `401` / `403` on missing/insufficient credentials.
- Apply per-tenant rate limits and return `429` on overrun.
- Capture exceptions to an observability tool and return `500` with a stable error code.

---

## Versioning

There is no versioned API surface yet (`/api/v1/...`). When a real backend lands, move
the existing routes under `/api/v1/` and reserve unversioned paths for redirects.

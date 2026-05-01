# WC26 - Claude Code Handoff

This project was built in Claude.ai chat and is being handed to Claude Code
for completion, deployment wiring, and ongoing development.

Read `CLAUDE.md` first for project architecture and conventions.

---

## Context: what has been built

A fully functional PWA exists in `index.html`. It works as a standalone file
right now - open it in a browser and everything renders. The following is
already complete and should not be rewritten unless something is broken:

- All 72 group stage fixtures with correct dates, UTC times, venues
- Full knockout bracket (Round of 32 through Final) with placeholder team names
- UK TV channel assignments for all group stage matches (BBC/ITV)
- Team filter (select any of 48 teams from dropdown)
- Group filter (tap any of 12 group cards)
- Knockout tab with "possible path" highlighting when a team is selected
- Calendar modal with Google Calendar URLs, Outlook.com URLs, .ics download,
  and subscribe flow (subscribe shows instructions + webcal:// link)
- Live score display - cards update in-place when scores.json has results
- Live bar indicator at top of page
- PWA manifest + service worker (offline caching)
- Dark theme design system (all CSS custom properties)

---

## What needs doing - priority order

### 1. Deployment wiring (do this first)

The backend score updater (`backend/update-scores.js`) needs to be
moved and wired up properly for Vercel.

**Steps:**

```bash
# Create proper Vercel function directory
mkdir -p api
cp backend/update-scores.js api/update-scores.js
```

The function uses ES module syntax (`export default`). Ensure `package.json`
has `"type": "module"` or rename to `.mjs` - whichever Vercel prefers in
the current version. Check Vercel docs if unsure.

Install the one dependency:
```bash
npm init -y
npm install @vercel/blob
```

**Two constants to update in `index.html`:**
```js
const SCORES_URL = '/scores.json';
const BASE_URL = 'https://ACTUAL_DOMAIN_HERE.vercel.app';
```

`SCORES_URL` should stay as `/scores.json` - the rewrite in `vercel.json`
routes it. Update `vercel.json` with the actual Blob Store URL once created:
```json
"destination": "https://YOUR_ACTUAL_BLOB_URL/scores.json"
```

**Test the function manually:**
```bash
vercel dev
curl http://localhost:3000/api/update-scores
```
Confirm it returns `{ ok: true, count: N }` and writes scores.json to Blob.

---

### 2. iCal subscription feed endpoint (second priority)

The calendar modal's "Subscribe" option currently shows a webcal:// URL
pointing to `BASE_URL/feeds/{slug}.ics` - but that endpoint doesn't exist yet.

Create `api/feed.js` as a Vercel serverless function that:

- Accepts a query param: `?team=England` or `?group=L`
- Generates a valid iCal (.ics) feed on demand
- For teams: includes confirmed group stage matches + knockout placeholder events
- For groups: includes all group stage matches
- Sets correct headers: `Content-Type: text/calendar`, `Content-Disposition: inline`

**iCal format reference** (match the logic already in `index.html`):

The frontend already has `buildIcs()`, `matchToIcsEvent()`, `fmtIcsDate()` etc.
Port those functions to Node.js for the serverless function. Key rules:
- All times in UTC (DTSTART/DTEND with Z suffix)
- DTEND = kickoff + 110 minutes
- Knockout placeholders: prefix titles with `[If qualified] ` and include
  `[PENCILLED IN - subject to qualification]` in DESCRIPTION
- UID format: `wc2026-{matchId}@wc26`

**Slug format:**
- Team: `england`, `south-korea`, `ivory-coast` (lowercase, hyphens)
- Group: `group-a` through `group-l`

**Route:** `api/feed.js` should handle `/feeds/:slug.ics`
Add a rewrite to `vercel.json`:
```json
{ "source": "/feeds/:slug.ics", "destination": "/api/feed?slug=:slug" }
```

---

### 3. Scores.json CORS / caching

The PWA fetches `/scores.json` with a cache-buster (`?t=timestamp`).
Vercel Blob serves files with aggressive CDN caching by default.

Ensure the response headers are set correctly. In `vercel.json` the
header config is already present - verify it applies correctly once
the Blob URL rewrite is in place. If caching is still aggressive,
the backend function can set `cacheControlMaxAge: 0` in the Blob `put()` call:

```js
await put('scores.json', JSON.stringify(scores), {
  access: 'public',
  contentType: 'application/json',
  addRandomSuffix: false,
  cacheControlMaxAge: 0,
});
```

---

### 4. Service worker cache strategy

`sw.js` currently uses a simple cache-first strategy for everything.
This will cause `scores.json` to be served stale from cache.

Update `sw.js` so that:
- `scores.json` (and any `/feeds/*.ics`) use **network-first** strategy
- All other assets (`index.html`, `manifest.json`, fonts) use **cache-first**

```js
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isScores = url.pathname.includes('scores.json') || url.pathname.includes('/feeds/');

  if (isScores) {
    // Network first, fall back to cache
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // Cache first
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
```

---

### 5. Knockout match name updates (ongoing during tournament)

When teams qualify from the group stage, knockout match `home`/`away`
fields in `KNOCKOUT_ROUNDS` inside `index.html` should be updated
from placeholder strings (e.g. `'Group L winners'`) to actual team names.

This is a manual edit to `index.html` as results come in. Consider whether
this should instead be driven by the backend - e.g. a `knockout.json` file
updated by the cron function once groups are resolved. That would avoid
needing to redeploy the frontend for bracket updates.

**Suggested enhancement:** Add knockout team name resolution to the backend.
Once all group stage matches have `status: 'FT'`, compute group standings
and write a `knockout.json` alongside `scores.json`. The PWA fetches it and
overlays actual team names onto the KNOCKOUT_ROUNDS array.

This is a nice-to-have - the manual approach works fine for a personal project.

---

### 6. UK TV for knockout rounds (ongoing)

All knockout match `uk` fields are currently `'TBA'`.
BBC and ITV announce their knockout allocations closer to each round.

When allocations are announced (typically a few days before each round),
update the relevant entries in KNOCKOUT_ROUNDS in `index.html`.

Alternatively, drive this from a `tv.json` file fetched at startup -
same pattern as scores.json - so TV info can be updated without a redeploy.

---

### 7. PWA icons (minor)

`manifest.json` references `icon-192.png` and `icon-512.png` which don't
exist yet. Without them the PWA install prompt won't show on Android,
and iOS home screen will use a screenshot fallback.

Generate simple icons - a dark `#080c18` background with "WC26" text in
the gold accent `#e8c14a` using Barlow Condensed. Any image tool works.
Place them in the project root alongside `index.html`.

---

## Known issues / gotchas

**Team name fuzzy matching (backend):**
The `matchesLocalTeam()` function in `update-scores.js` uses alias lists.
football-data.org may use different names than expected. The first time
the cron runs against live data, check the logs to confirm all 72 matches
are being matched. If count is low, add missing aliases to `TEAM_NAME_MAP`.

**UTC times crossing midnight:**
Several matches kick off after midnight UTC (e.g. matches listed as
`utc: '02:00'` on a given date actually show in the UI as the following
morning in BST). The `toLocal()` function in the frontend handles this
correctly via timezone-aware Date arithmetic. Do not change this logic.

**Simultaneous kickoffs:**
Several matchdays have pairs of matches at identical times (final group
matchdays always do - e.g. g49 and g50 both at `19:00` on June 24).
This is correct data. The UI renders them in the same date section,
sorted by utc time (which ties, so order is array order).

**ICS on iOS:**
On iOS, `.ics` file downloads via `URL.createObjectURL()` trigger the
system calendar import sheet automatically. This is the desired behaviour.
Do not add any additional handling.

**Google Calendar subscribe:**
The Google Calendar subscribe URL (`calendar.google.com/calendar/r/settings/addbyurl`)
requires the feed URL to be publicly accessible. The webcal:// approach
works on mobile without this restriction. Both are shown to users.

---

## Testing checklist before going live

- [ ] Open `index.html` directly in browser - all 72 fixtures render
- [ ] Select a team - filter banner appears, correct matches highlighted
- [ ] Select a group - group cards highlight, fixture list filters
- [ ] Switch to Groups tab - all 12 groups show with correct teams
- [ ] Switch to Knockout tab - all rounds render
- [ ] Select England in dropdown, switch to Knockout tab - possible matches highlighted in blue
- [ ] Click calendar icon on a match - modal opens with 3 options
- [ ] Select a team, click "Add to calendar" in filter banner - bulk modal opens
- [ ] Download a .ics from the modal - opens in calendar app
- [ ] Close modal with Escape key and backdrop click
- [ ] `scores.json` with test data - scores render correctly on cards
- [ ] `scores.json` with a `LIVE` status - live bar appears, red border on card
- [ ] Resize to mobile width - layout holds, venue text hides gracefully
- [ ] Backend function returns `{ ok: true }` when called manually
- [ ] Cron runs on schedule in Vercel dashboard

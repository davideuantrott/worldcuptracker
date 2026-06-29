# WC26 - World Cup 2026 PWA

## Project summary

Ad-free, no-login Progressive Web App for tracking FIFA World Cup 2026 fixtures,
live scores, UK TV listings, team/group filtering, and calendar export.
Built as a single-file static frontend with a Vercel serverless backend for scores.

## Deployment

- **Live URL:** https://worldcuptracker.vercel.app
- **Blob storage:** https://kdoazmegsbme4ynq.public.blob.vercel-storage.com/scores.json
- **Score updater cron:** cron-job.org (calls `/api/update-scores` every 5 minutes)
  - Vercel Hobby plan does not support frequent crons - cron-job.org is used instead
  - `update-scores.js` uses module-level `cachedScores`/`cachedStandings`/`cachedKnockout` variables to skip Blob `put()` calls when data hasn't changed — prevents burning the free tier's 2,000 Advanced Requests/month limit during pre-tournament when scores never change
  - Score extraction tries `score.fullTime` → `score.regularTime` → `score.halfTime` (in that order) — `regularTime` added as WC2026 API uses this field variant. Response includes `apiMatchCount` and `includedMatchCount` for debugging via cron-job.org logs.
  - `update-scores.js` matches API fixtures to local `MATCH_IDS` by team name via `TEAM_NAME_MAP` — if football-data.org uses a different name than our local team name (e.g. the API uses "Cape Verde Islands" while our local name is "Cape Verde"), the match silently fails to map and that game never gets a score written. Add the API's name as an alias in `TEAM_NAME_MAP` when this happens. If a concluded match isn't showing a score in the UI, check this mapping first.
  - Any ACTIVE/FINISHED match that fails team-name matching is now logged to stdout as `Unmatched: "X" vs "Y" (STATUS)` — visible in cron-job.org logs for rapid diagnosis. The `unmatched` array is also returned in the JSON response body so it appears directly in cron-job.org execution history.
  - 0-0 draws: the API can return `null` for all goal fields on a 0-0 FINISHED match. The null-goal guard therefore allows all `ACTIVE_STATUSES` (FINISHED/PAUSED/IN_PLAY/ET/PEN) through even when goals are null; `homeGoals ?? 0` then correctly writes 0.
  - **Knockout fixtures** are matched to `KNOCKOUT_BY_DATE` by the UTC kickoff timestamp (`m.utcDate`) rather than by team name — the teams aren't known until groups conclude. Once the API populates knockout fixtures with real team names, they flow through `toLocalName()` (same `TEAM_NAME_MAP` alias lookup) and are written to `knockout.json`. Knockout scores go into `scores.json` the same as group stage scores. If a knockout fixture time ever shifts (FIFA reschedule), update `KNOCKOUT_BY_DATE` to match.

## IMPORTANT: After every deployment

**Always bump the cache version in `sw.js`** — increment `const CACHE = 'wc26-vN'` by 1 each time changes are pushed. This ensures installed PWA users get the updated `index.html` served immediately rather than the stale cached version. Without this, returning users may see the old version until they manually hard-refresh.

## Stack

- **Frontend:** Vanilla HTML/CSS/JS - no framework, no build step required
- **Backend:** Vercel Serverless Functions (Node.js, ESM)
- **Score storage:** Vercel Blob Storage - serves `scores.json` publicly
- **Score source:** football-data.org API (free tier, WC competition code: `WC`)
- **Hosting:** Vercel (static + serverless, Pro plan — upgraded May 2026 after hitting the Hobby Blob limit; plan to downgrade back to Hobby around June 1 once the May billing period resets, as tournament usage is estimated well within Hobby limits)
- **Fonts:** Google Fonts - Barlow Condensed + Barlow (loaded from CDN)
- **PWA:** manifest.json + sw.js service worker for offline caching

## File structure

```
index.html                  Primary PWA - all UI, state, and calendar logic
manifest.json               PWA manifest
sw.js                       Service worker (network-first for scores, cache-first for assets)
scores.json                 DELETED — do not recreate. A static file at this path blocks Vercel from applying the /scores.json → Blob rewrite. Live scores come from the Blob URL via the rewrite in vercel.json.
knockout.json               DELETED — do not recreate. Same reason as scores.json. Knockout team slots written by backend to Blob, served via vercel.json rewrite.
vercel.json                 Routing + header config (no crons - handled by cron-job.org)
package.json                Node deps (type: module, @vercel/blob)
node_modules/               Dependencies
icons/
  android/                  launchericon-{48,72,96,144,192,512}x{...}.png — PWA manifest icons
  ios/                      {size}.png — apple-touch-icon uses 180.png
  windows/                  Windows tile variants (not currently referenced in manifest)
api/
  update-scores.js          Serverless function - fetches API, writes Blob (GET to trigger)
CLAUDE.md                   This file
HANDOFF.md                  Detailed task list and gotchas
README.md                   Deployment instructions
```

## Design system

All styles are CSS custom properties defined in `:root` in `index.html`.
The full token spec lives in `design-system.json`.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0c0e0a` | Page background |
| `--surface` | `#141a0f` | Card / header background |
| `--surface2` | `#1c2414` | Input / secondary surfaces |
| `--border` | `#1e2a14` | All borders |
| `--accent` | `#c8f000` | Electric lime - primary highlight, selected team |
| `--accent-muted` | `rgba(200,240,0,0.12)` | Lime tint for badge backgrounds |
| `--accent-border` | `rgba(200,240,0,0.35)` | Lime tint for badge borders |
| `--accent2` | `#5b9cf6` | Blue - possible matches, secondary info |
| `--text` | `#f0f2eb` | Body text |
| `--muted` | `#8a9478` | Labels, metadata, placeholders |
| `--live-color` | `#e8443a` | Live match indicator |
| `--highlight` | `rgba(200,240,0,0.10)` | Selected team card background |
| `--highlight-border` | `#c8f000` | Selected team card border |
| `--possible-bg` | `rgba(91,156,246,0.08)` | Possible knockout match background |
| `--possible-border` | `#5b9cf6` | Possible knockout match border |

Logo: `WC` in `--text`, `26` in `--accent` (lime).
Fonts: `'Barlow Condensed'` for headings/scores/labels, `'Barlow'` for body text.
Score numerals use `font-variant-numeric: tabular-nums lining-nums` and `font-feature-settings: "tnum" 1` to prevent layout shift.

### Motion tokens (also in `:root`)

| Token | Value | Usage |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.16,1,0.3,1)` | Transform animations (spring feel) |
| `--ease-color` | `cubic-bezier(0.2,0,0,1)` | Color/border transitions |
| `--t-color` | `color/border-color/bg 150ms --ease-color` | Use on non-transform interactive elements |
| `--t-interactive` | `--t-color + transform 200ms --ease-spring` | Use on elements with `:active` scale feedback |

**Do not use `transition: all`** — always use `--t-color` or `--t-interactive`. All `:active` states use `transform: scale()` (hardware-accelerated only).

### Animations

| Name | Usage |
|---|---|
| `cardReveal` | Match cards and group cards on render — driven by `--i` inline style (`style="--i:N"`) |
| `tabReveal` | Tab panel fade-in on `.tab-content.active` |
| `liveGlow` | Live bar glow pulse when matches are live |
| `liveBarPulse` | `.match-card.is-live::before` left-bar opacity pulse |
| `shimmer` | `.score-skeleton` placeholder when scores not yet fetched |
| `pulse` | Live dot and `badge-live` opacity pulse |
| `slideUp` | Modal entrance |

Card stagger index is capped at 18 to prevent long delays on large lists.

### SVG icons

Reusable icon symbols are defined in a hidden `<svg>` block at the top of `<body>`:
`#ico-phone`, `#ico-cal-g`, `#ico-cal-o`, `#ico-apple`, `#ico-check`, `#ico-refresh`, `#ico-share`.
Reference with `<svg><use href="#ico-X"/></svg>`. **No emoji anywhere in the UI** — use these SVG symbols or Barlow Condensed numeral badges instead.

## Data model

### Match IDs

Group stage matches are `g1` through `g72`.
Knockout matches are `r32-1` through `r32-16`, `r16-1` through `r16-8`,
`qf-1` through `qf-4`, `sf-1`, `sf-2`, `3p`, `final`.

### MATCHES array (group stage, index.html)

```js
{
  id: 'g22',               // Unique match ID
  date: '2026-06-17',      // UTC date of kickoff
  utc: '20:00',            // UTC kickoff time (HH:MM, 24hr)
  home: 'England',         // Home team name (must match FLAGS keys)
  away: 'Croatia',         // Away team name (must match FLAGS keys)
  venue: 'AT&T Stadium, Arlington',  // Full venue name
  group: 'L',              // Group letter A-L
  uk: 'ITV',               // UK broadcaster: 'BBC' | 'ITV' | 'BOTH' | 'TBA'
}
```

### KNOCKOUT_ROUNDS array (index.html)

Same shape as MATCHES but without `group`, with `confirmed: false`.
`home` and `away` are static placeholder strings like `'Group L winners'` or
`'Winner R32 M4'` — these are never mutated. At render time, `resolvedKnockoutMatch(m)`
overlays confirmed team names from `knockoutTeams` (populated from `knockout.json`),
returning a new object with real names where known and falling back to the placeholder
where still TBD. `confirmed` is set to `true` dynamically when both slots are non-null.

### scores.json (written by backend, read by PWA)

```json
{
  "g22":   { "home": 2, "away": 1, "status": "FT", "minute": null },
  "g6":    { "home": 1, "away": 0, "status": "LIVE", "minute": 67 },
  "r32-1": { "home": 1, "away": 0, "status": "FT", "minute": null }
}
```

Status values: `FT` | `HT` | `LIVE` | `ET` | `PEN`

Only matches with known scores appear. Missing IDs = not yet played. Includes knockout match IDs once those games kick off.

### knockout.json (written by backend, read by PWA)

```json
{
  "r32-1": { "home": "France", "away": "Germany" },
  "r32-2": { "home": "Brazil", "away": null },
  "r32-7": { "home": null,     "away": null }
}
```

Written once the API populates knockout fixture slots with real team names. A `null` value means the slot is not yet confirmed (team still TBD). The frontend's `resolvedKnockoutMatch(m)` overlays these values onto the static `KNOCKOUT_ROUNDS` placeholders at render time — a non-null name replaces the placeholder, a null falls back to the original placeholder string (e.g. `"Group A winners"`). A match is treated as `confirmed: true` only when both home and away are non-null. If knockout.json doesn't exist yet (pre-R32), the frontend degrades gracefully — all placeholders remain.

## Key constants in index.html

```js
const SCORES_URL = '/scores.json';                        // Rewrites to Blob via vercel.json
const BASE_URL = 'https://worldcuptracker.vercel.app';    // Live domain
const POLL_INTERVAL = 60000;                              // Normal poll frequency (ms)
```

## Timezone display

Match times are stored as UTC in the `MATCHES` array and converted for display via `toLocal()`.

`toLocal()` manually shifts the UTC timestamp by `tzOffset` hours (derived from `getTimezoneOffset()` at init), then reads the result using **`getUTCHours()`/`getUTCMinutes()`/`getUTCDate()`** — not the non-UTC equivalents. Using `getHours()` etc. would double-apply the browser's local offset (once via the manual shift, once via the JS date internals), showing times 1 hour too late in BST.

## Environment variables (Vercel)

| Variable | Description |
|---|---|
| `FOOTBALL_DATA_API_KEY` | football-data.org API key - set in Vercel dashboard |
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob |
| `CRON_SECRET` | Shared secret to protect `/api/update-scores` - must also be set as `X-Cron-Secret` header in cron-job.org |

## Security

- `/api/update-scores` checks the `X-Cron-Secret` request header against `CRON_SECRET` env var - requests without the correct secret are rejected with 401. The check is skipped if `CRON_SECRET` is not set (safe during initial deploy).
- Score fields (`home`, `away`, `minute`) from `scores.json` are parsed as integers in `fetchScores()` before being stored in `liveResults`, preventing any injected HTML from reaching `innerHTML`.
- `vercel.json` sets `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` headers on all responses.

## Scores polling behaviour

- PWA polls `SCORES_URL` every `POLL_INTERVAL` (60s) normally
- Drops to 30s automatically when live matches are detected
- Cache-busted with `?t=timestamp` on every request
- Silent failure if fetch fails - no UI error shown
- Live bar shown at top when results are available or matches are live
- `scoresInitialized` flag (set on first successful `/scores.json` response) controls whether the shimmer skeleton shows — skeleton only appears before the first fetch returns; after that, "vs" is shown for unscored matches rather than a perpetual loading box

## Fixture list - past match handling

`renderFixtures()` shows **both group stage and knockout fixtures** in a single chronological list, grouped by local date. Knockout matches appear below all group stage matches (their dates are later). The function computes `todayKey` on each render:
- Past date sections (key < todayKey) get class `section-past` — their section title fades to opacity 0.4 and loses the lime accent bar (replaced by `var(--muted)` grey)
- Today's section gets `id="fixtures-today"` and a lime "TODAY" pill in the header
- Match cards get `is-past` class when their section is past OR when `liveResults[m.id]?.status === 'FT'` — but never on currently `LIVE` matches
- `is-past` cards use `background: var(--bg)` (page colour) so they visually recede, plus a faded border, suppressed hover highlight, and muted meta text — four distinct signals that a match is concluded
- On the first render of each Fixtures tab visit, `scrollIntoView({ behavior: 'instant', block: 'start' })` scrolls to `#fixtures-today`. `hasScrolledToToday` flag prevents re-scrolling on score-update re-renders; it resets when the user taps the Fixtures tab.
- Matches within each date group are sorted by `parseKickoff(m.date, m.utc)` (actual UTC timestamp), **not** by `m.utc` string — sorting by the UTC string would place late-night matches (e.g. 23:00 UTC = 00:00 BST) at the end of the local-date group instead of the start.

### Knockout matches in the Fixtures tab

- **No filter**: all 31 knockout matches appended after group stage matches
- **Team filter**: only knockout matches where the team is confirmed (`home`/`away` match) or possibly involved (`mightInvolve()` — group text / winner / loser / best 3rd). Cards show lime "Your team" or blue "Possible" badge accordingly
- **Group filter**: knockout matches are excluded (they aren't group-specific)
- Each knockout card shows a muted round badge (`badge-ko`) — "Round of 32", "Quarter-final", etc. — derived by `knockoutRoundLabel(id)` from the match ID, so context is clear without a section header

## Group standings tables

`calcGroupStandings(group)` computes live standings from `liveResults` on each render. Any match with a result in `liveResults` (including LIVE/HT mid-game scores) contributes to the table — so standings update in real-time during live matches.

Standings are sorted by: Pts desc → GD desc → GF desc → alphabetical.

The group card in the Groups tab shows:
- **No results yet**: team list in draw order (same as before)
- **Results exist + scores visible**: compact standings table (Pos, flag+name, Pts, GD)
- **Results exist + scores hidden**: team list in draw order (standings would reveal results)

## Score spoiler toggle

A "Hide scores" / "Show scores" button (`#scoreToggle`, class `.score-toggle-btn`) lives in the **sticky header** (between the team selector and the Clear button), so it is always accessible without scrolling. Do not move it back into the fixtures tab toolbar.

When `hideScores` is true:
- Match cards show "vs" instead of the score, with no FT/HT/LIVE badge
- No `is-live` red border on cards (would reveal a game is in progress)
- Live bar shows "Scores available - hidden" instead of live match count
- Group standings revert to team list (standings reveal results)
- Shimmer skeleton is suppressed (would hint at live activity)

State persisted in `localStorage` key `wc26-hide-scores`. Button starts with correct state on load (initialised in `init()`).

## PWA install prompt

Two UI elements prompt users to install the PWA, both hidden when already running in standalone mode (`display-mode: standalone` or `navigator.standalone`):

- **Banner** — slim bar between the live bar and tabs, shown on first visit. Dismissed by tapping ✕; dismissal persisted in `localStorage` key `wc26-install-dismissed`. Does not reappear after dismissal, but the footer button remains.
- **Footer button** — "Add to home screen" button at the bottom of the scroll, always visible when installable.

**Android / Chrome**: the browser fires `beforeinstallprompt`, which is captured and deferred. Tapping either UI element calls `deferredInstallPrompt.prompt()` to trigger the native install sheet. Both elements hide on `appinstalled`.

**iOS Safari**: no `beforeinstallprompt` event. iOS is detected via UA string (`iPad|iPhone|iPod`). Both elements are shown on page load (respecting the dismissed flag for the banner). Tapping either element opens the existing calendar modal with 3-step share-sheet instructions.

## Calendar features

Three modes triggered from the UI:

1. **Single match** - opens modal with Google Calendar URL, Outlook.com URL,
   or .ics download for Apple Calendar / Outlook desktop
2. **Team bulk** - confirmed group games only (.ics), OR all fixtures including
   knockout placeholders labelled `[If qualified]`
3. **Group bulk** - all group stage matches as .ics download
4. **Subscribe feed** - webcal:// URL for Apple, Google Calendar subscribe URL,
   Outlook instructions. Feed URL format: `BASE_URL/feeds/{slug}.ics`
   (feed serving endpoint not yet implemented - see HANDOFF.md task 2)

### ICS generation gotchas

- **`fmtIcsDate` / `fmtIcsDateEnd` already include the trailing `Z`** (from `toISOString()`). Do NOT append `Z` again in `DTSTART`/`DTEND` lines — a double `ZZ` causes calendar apps to misparse the timestamp as local time, shifting the event 1 hour early for BST users.
- **Event titles** use the format `Home vs. Away - Channel` (e.g. `Haiti vs. Scotland - BBC`). Channel suffix is omitted when `uk` is `TBA` or absent. All three calendar paths (ICS download, Google Calendar URL, Outlook URL) use the same format.

## Group standings - API-sourced

`apiStandings` state variable is populated from `/standings.json` (Blob-backed), fetched in parallel with scores on every poll cycle. The backend writes it from `data.standings[].table[]`, filtering for `type === 'TOTAL'`, extracting the group letter from the `group` field (e.g. `GROUP_A` → `A`).

`standings.json` format:
```json
{
  "A": [{ "team": "Mexico", "pos": 1, "p": 3, "w": 2, "d": 1, "l": 0, "gf": 5, "ga": 2, "gd": 3, "pts": 7 }],
  "B": [...]
}
```

### Fallback logic (`groupStandings(g)` helper)

Uses `apiStandings[g]` when available. Falls back to `calcGroupStandings(g)` only when any match in that group has status `LIVE` or `HT` in `liveResults` (the API lags until FT). `calcGroupStandings()` remains in place as the live-only fallback.

Both `renderGroups()` and `renderStandings()` call `groupStandings(g)` for consistency.

## Standings tab

A dedicated Standings tab (4th tab) shows full group tables for all 12 groups in a responsive grid (3 columns desktop, 2 tablet, 1 mobile).

Columns: Pos, Flag+Team, P, W, D, L, GD, Pts.

Tables are always shown, including pre-tournament when all values are 0 (unlike the compact group cards which only show a table when results exist). When `hideScores` is on and results exist, standings revert to team list in draw order (same as Groups tab). Source: `groupStandings(g)` with LIVE-match fallback to `calcGroupStandings()`.

## UK TV listings status (as of 2026-06-29)

The `uk` field on each match is manually maintained — BBC/ITV do not provide a machine-readable feed.

- **Round of 32:** All 16 matches confirmed (updated 2026-06-29). Source: BBC/ITV official announcements via broadcastnow.co.uk.
- **Round of 16 and beyond:** `TBA` — channels not yet announced. Exception: the Final is `BOTH` (both broadcasters, already confirmed at tournament start).
- When BBC/ITV announce Round of 16 channels, update the `uk` field for `r16-1` through `r16-8` in `KNOCKOUT_ROUNDS`.

## Tone and conventions

- No framework dependencies - keep it vanilla JS
- No npm build step for the frontend - it's a single deployable HTML file
- Error handling should be silent/graceful - this is a read-only info app
- No user accounts, no data collection, no analytics
- UK-first: times shown in user's local timezone, UK TV info prominent
- Hyphens with spaces ( - ) not em dashes in any user-facing text

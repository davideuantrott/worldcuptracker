# WC26 - World Cup 2026 Results Archive

## Project summary

Ad-free, no-login static results archive for FIFA World Cup 2026 fixtures,
final scores, UK TV listings, team/group filtering, and calendar export.
The tournament concluded on 2026-07-19 (Spain beat Argentina 1-0 in the
final; England took third place). This is now a single-file static
frontend with **no backend** - all results, standings, and knockout
bracket data are frozen into `index.html` as constants.

## Deployment

- **Live URL:** https://worldcuptracker.vercel.app
- Any static host works (Vercel, Netlify, GitHub Pages, plain file server). No environment variables, cron jobs, or serverless functions are required.
- The cron-job.org job that used to call `/api/update-scores` every 5 minutes should be deleted/paused in the cron-job.org dashboard - it has no endpoint to call anymore and will just generate 404s.
- The Vercel Blob store (`kdoazmegsbme4ynq.public.blob.vercel-storage.com`) is no longer read or written to. It can be deleted from the Vercel dashboard once you're sure nothing else depends on it.
- Vercel env vars `FOOTBALL_DATA_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `CRON_SECRET` are unused and can be removed from the Vercel dashboard.
- The project was temporarily on the Vercel Pro plan during the tournament (upgraded May 2026 for the Hobby Blob limit) - now that there's no Blob traffic at all, it should be safe to downgrade back to Hobby.

## IMPORTANT: After every deployment

**Always bump the cache version in `sw.js`** — increment `const CACHE = 'wc26-vN'` by 1 each time changes are pushed. This ensures installed PWA users get the updated `index.html` served immediately rather than the stale cached version. Without this, returning users may see the old version until they manually hard-refresh.

## Stack

- **Frontend:** Vanilla HTML/CSS/JS - no framework, no build step, no backend
- **Hosting:** Static hosting only (currently Vercel)
- **Fonts:** Google Fonts - Barlow Condensed + Barlow (loaded from CDN)
- **PWA:** manifest.json + sw.js service worker for offline caching (cache-first for everything - there's no dynamic data left to treat specially)

## File structure

```
index.html                  The whole app - UI, final results data, and all logic
manifest.json               PWA manifest
sw.js                       Service worker (cache-first for all assets)
vercel.json                 Static hosting security headers only (no rewrites/crons)
CLAUDE.md                   This file
README.md                   Deployment instructions
design-system.json          Full design token spec
icons/
  android/                  launchericon-{48,72,96,144,192,512}x{...}.png — PWA manifest icons
  ios/                      {size}.png — apple-touch-icon uses 180.png
  windows/                  Windows tile variants (not currently referenced in manifest)
```

There is no `api/` directory, no `package.json`, and no `node_modules` -
the score-updater serverless function and its `@vercel/blob` dependency
were removed once the tournament ended. `scores.json` and `knockout.json`
were never checked into the repo (they were Blob-backed) and still
shouldn't be - the data now lives inline in `index.html` instead.

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
| `--live-color` | `#e8443a` | Reserved for the "scores hidden" state of the results bar (no longer used for actual live matches) |
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
| `liveGlow` | Results bar glow pulse — only plays when `hideScores` is on (the "scores hidden" state); the default "tournament complete" state uses the `.is-final` variant with no animation |
| `liveBarPulse` | `.match-card.is-live::before` left-bar opacity pulse (dead code now that no match can be `LIVE` - kept in case historical mid-match data is ever re-added) |
| `shimmer` | `.score-skeleton` placeholder (dead code now that `scoresInitialized` is always `true` - kept for CSS completeness) |
| `pulse` | Live dot opacity pulse - only used in the `hideScores` state now |
| `slideUp` | Modal entrance (calendar modal and champion modal) |

Card stagger index is capped at 18 to prevent long delays on large lists.

### SVG icons

Reusable icon symbols are defined in a hidden `<svg>` block at the top of `<body>`:
`#ico-phone`, `#ico-cal-g`, `#ico-cal-o`, `#ico-apple`, `#ico-check`, `#ico-refresh`, `#ico-share`.
Reference with `<svg><use href="#ico-X"/></svg>`. **No emoji anywhere in the UI** — use these SVG symbols or Barlow Condensed numeral badges instead. (Team flag emoji in `FLAGS` are the one established exception - they represent data, not decoration.)

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
overlays confirmed team names from `knockoutTeams` (now sourced from the
`FINAL_KNOCKOUT_TEAMS` constant, not a fetched `knockout.json`), returning a new
object with real names — every knockout slot is filled in since the bracket
is fully resolved. `confirmed` is `true` for every knockout match now.

### Final results data (frozen constants in index.html)

Three constants, inserted right after `KNOCKOUT_ROUNDS`, hold the complete
final state of the tournament and are assigned directly to the app's state
variables at load (`liveResults`, `apiStandings`, `knockoutTeams`):

- **`FINAL_SCORES`** — same shape as the old `scores.json`: `{ id: { home, away, status: 'FT', minute: null } }` for every one of the 72 group + 31 knockout matches.
- **`FINAL_KNOCKOUT_TEAMS`** — same shape as the old `knockout.json`: `{ id: { home, away } }` team names for every knockout slot.
- **`FINAL_STANDINGS`** — same shape as the old `standings.json`: `{ 'A': [{ team, pos, p, w, d, l, gf, ga, gd, pts }, ...] }` for all 12 groups.

If a scoring error is ever found in these constants, edit them directly -
there is no backend to regenerate them from.

## Key constants in index.html

```js
const BASE_URL = 'https://worldcuptracker.vercel.app';    // Live domain, used for calendar subscribe links
```

There is no `SCORES_URL` or `POLL_INTERVAL` anymore - nothing is fetched at runtime.

## Timezone display

Match times are stored as UTC in the `MATCHES` array and converted for display via `toLocal()`.

`toLocal()` manually shifts the UTC timestamp by `tzOffset` hours (derived from `getTimezoneOffset()` at init), then reads the result using **`getUTCHours()`/`getUTCMinutes()`/`getUTCDate()`** — not the non-UTC equivalents. Using `getHours()` etc. would double-apply the browser's local offset (once via the manual shift, once via the JS date internals), showing times 1 hour too late in BST.

## Security

- `vercel.json` sets `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` headers on all responses. `connect-src` was removed from the CSP since the page no longer makes any `fetch()` calls.
- Score fields in `FINAL_SCORES` are plain numbers already (not user input), so no runtime sanitization is needed before they reach the DOM.

## Results bar (formerly the "live bar")

`#liveBar` / `updateLiveBar()` no longer polls anything - it just reflects
the frozen final state:
- Default: shows "Tournament complete - Spain are 2026 champions" with the `.is-final` styling (lime, no pulse animation).
- When `hideScores` is on: shows "Scores available - hidden" with the original red/pulsing styling, same as before.

## Champion popup

`#championModal` shows the podium (1st Spain, 2nd Argentina, 3rd England)
once per browser via the `wc26-champion-seen` localStorage flag, opened
from `init()` if that flag isn't set. Structured like the calendar modal's
option rows, using `badge-confirmed`/`badge-ko` pills for the "1st/2nd/3rd"
labels instead of emoji (per the no-emoji-in-UI rule). Closeable via the
Close button, backdrop click, or Escape - all three paths set the
localStorage flag so it doesn't reappear.

## Fixture list - past match handling

`renderFixtures()` shows **both group stage and knockout fixtures** in a single chronological list, grouped by local date. Knockout matches appear below all group stage matches (their dates are later). The function computes `todayKey` on each render:
- Past date sections (key < todayKey) get class `section-past` — their section title fades to opacity 0.4 and loses the lime accent bar (replaced by `var(--muted)` grey)
- Today's section gets `id="fixtures-today"` and a lime "TODAY" pill in the header — in practice this never matches anymore since every match date is in the past, so no section gets the pill and the scroll-to-today call is a no-op
- Match cards get `is-past` class when their section is past OR when `liveResults[m.id]?.status === 'FT'` — since every match is now `FT` and every date is in the past, **every card renders in the faded "past" state**. This matches how the site already looked in production once the tournament finished (it was not changed when the site was converted to static), so it's expected, not a bug.
- `is-past` cards use `background: var(--bg)` (page colour) so they visually recede, plus a faded border, suppressed hover highlight, and muted meta text
- Matches within each date group are sorted by `parseKickoff(m.date, m.utc)` (actual UTC timestamp), **not** by `m.utc` string — sorting by the UTC string would place late-night matches (e.g. 23:00 UTC = 00:00 BST) at the end of the local-date group instead of the start.

### Knockout matches in the Fixtures tab

- **No filter**: all 31 knockout matches appended after group stage matches
- **Team filter**: knockout matches where the team is confirmed (`home`/`away` match) show a lime "Your team" badge. Since every knockout slot is now filled with a real team name, the old "possible" (blue, not-yet-confirmed) badge path is effectively dead code — it's kept because it's cheap to keep and does no harm.
- **Group filter**: knockout matches are excluded (they aren't group-specific)
- Each knockout card shows a muted round badge (`badge-ko`) — "Round of 32", "Quarter-final", etc. — derived by `knockoutRoundLabel(id)` from the match ID

## Group standings tables

`calcGroupStandings(group)` computes standings from `liveResults` (now `FINAL_SCORES`) on each render — this still works and produces the same output as `FINAL_STANDINGS`, but `groupStandings(g)` prefers `apiStandings` (`FINAL_STANDINGS`) directly and only falls back to `calcGroupStandings()` when a match is `LIVE`/`HT`, which can never happen anymore. `calcGroupStandings()` is kept as-is rather than removed, since it's harmless dead-ish code and deleting it would be pure churn.

Standings are sorted by: Pts desc → GD desc → GF desc → alphabetical.

## Score spoiler toggle

A "Hide scores" / "Show scores" button (`#scoreToggle`, class `.score-toggle-btn`) lives in the sticky header. Still present and functional post-tournament, for anyone browsing fixtures/venues without wanting to see who won.

When `hideScores` is true:
- Match cards show "vs" instead of the score, with no FT badge
- Results bar shows "Scores available - hidden" instead of the champion message
- Group standings revert to team list (standings reveal results)

State persisted in `localStorage` key `wc26-hide-scores`.

## PWA install prompt

Two UI elements prompt users to install the PWA, both hidden when already running in standalone mode (`display-mode: standalone` or `navigator.standalone`): a dismissible banner and a footer button. Still fully functional - the PWA is a useful offline-capable results archive even post-tournament. See `index.html`'s `PWA INSTALL` section for the Android (`beforeinstallprompt`) vs iOS (manual instructions modal) split.

## Calendar features

Kept even though every match is in the past - some users may still want an
.ics record of when matches were played. Three modes triggered from the UI:

1. **Single match** - opens modal with Google Calendar URL, Outlook.com URL,
   or .ics download for Apple Calendar / Outlook desktop
2. **Team bulk** - all of a team's group + knockout matches (all confirmed now)
3. **Group bulk** - all group stage matches as .ics download
4. **Subscribe feed** - shows a webcal:// URL / Google Calendar subscribe link. This was never wired up to a real endpoint (`/feeds/*.ics` was planned but not implemented) and definitely won't be now - the option is effectively non-functional. Consider removing it if it causes confusion.

### ICS generation gotchas

- **`fmtIcsDate` / `fmtIcsDateEnd` already include the trailing `Z`** (from `toISOString()`). Do NOT append `Z` again in `DTSTART`/`DTEND` lines — a double `ZZ` causes calendar apps to misparse the timestamp as local time, shifting the event 1 hour early for BST users.
- **Event titles** use the format `Home vs. Away - Channel` (e.g. `Haiti vs. Scotland - BBC`). Channel suffix is omitted when `uk` is `TBA` or absent. All three calendar paths (ICS download, Google Calendar URL, Outlook URL) use the same format.

## Standings tab

A dedicated Standings tab (4th tab) shows full group tables for all 12 groups in a responsive grid (3 columns desktop, 2 tablet, 1 mobile).

Columns: Pos, Flag+Team, P, W, D, L, GD, Pts.

Source: `groupStandings(g)`, which reads `FINAL_STANDINGS` directly (see "Group standings tables" above).

## UK TV listings (final, as of tournament close)

The `uk` field on each match was manually maintained throughout the tournament - BBC/ITV don't provide a machine-readable feed. All rounds are now confirmed and frozen; there's nothing left to update here.

- **Group stage:** all confirmed.
- **Round of 32:** all 16 matches confirmed.
- **Round of 16:** all 8 matches confirmed. ITV: r16-1 (Canada vs Morocco), r16-3 (Brazil vs Norway), r16-7 (Argentina vs Egypt), r16-8 (Switzerland vs Colombia). BBC: r16-2 (Paraguay vs France), r16-4 (Mexico vs England), r16-5 (Portugal vs Spain), r16-6 (USA vs Belgium).
- **Quarter-finals:** all 4 confirmed. ITV: qf-1 (France vs Morocco), qf-3 (Norway vs England), qf-4 (Argentina vs Switzerland) - ITV held three of the four QFs. BBC: qf-2 (Spain vs Belgium).
- **Semi-finals:** sf-1 (France vs Spain) ITV, sf-2 (England vs Argentina) BBC.
- **Third Place Play-off:** BBC.
- **Final:** `BOTH`.

## Timezone gotchas (historical, kept for context on the frozen dates/times)

- **Mexico City** (Estadio Azteca) uses **CST = UTC-6** year-round (Mexico abolished DST in 2023). An 8 pm local kickoff = **02:00 UTC**.
- **Guadalajara/Kansas City** (CDT = UTC-5 in summer). An 8 pm local kickoff = **01:00 UTC**.
- **Vancouver** (PDT = UTC-7 in summer). An 8 pm local kickoff = **03:00 UTC**.
- **football-data.org stored the actual kick-off time, not the scheduled time**, back when scores were being polled from it. If a match was delayed (e.g. weather), its listed time reflects the delay. r16-4 (Mexico vs England) was delayed 1 hour by a thunderstorm — scheduled `2026-07-06T00:00:00Z`, actual (and what's stored in `KNOCKOUT_ROUNDS`) `2026-07-06T01:00:00Z`.

## Tone and conventions

- No framework dependencies - keep it vanilla JS
- No npm build step, no backend - it's a single deployable HTML file plus a manifest and service worker
- Error handling should be silent/graceful - this is a read-only info app
- No user accounts, no data collection, no analytics
- UK-first: times shown in user's local timezone, UK TV info prominent
- Hyphens with spaces ( - ) not em dashes in any user-facing text

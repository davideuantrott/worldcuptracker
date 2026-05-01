# WC26 - World Cup 2026 PWA

## Project summary

Ad-free, no-login Progressive Web App for tracking FIFA World Cup 2026 fixtures,
live scores, UK TV listings, team/group filtering, and calendar export.
Built as a single-file static frontend with a Vercel serverless backend for scores.

## Stack

- **Frontend:** Vanilla HTML/CSS/JS - no framework, no build step required
- **Backend:** Vercel Serverless Functions (Node.js, ESM)
- **Score storage:** Vercel Blob Storage - serves `scores.json` publicly
- **Score source:** football-data.org API (free tier, WC competition code: `WC`)
- **Hosting:** Vercel (static + serverless, free tier)
- **Fonts:** Google Fonts - Barlow Condensed + Barlow (loaded from CDN)
- **PWA:** manifest.json + sw.js service worker for offline caching

## File structure

```
index.html                  Primary PWA - all UI, state, and calendar logic
manifest.json               PWA manifest
sw.js                       Service worker
scores.json                 Live match scores (written by cron, read by PWA)
vercel.json                 Cron schedule + routing config
backend/
  update-scores.js          Serverless cron function - fetches API, writes Blob
CLAUDE.md                   This file
HANDOFF.md                  Detailed task list for Claude Code
README.md                   Deployment instructions
```

## Design system

All styles are CSS custom properties defined in `:root` in `index.html`.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080c18` | Page background |
| `--surface` | `#0f1525` | Card / header background |
| `--surface2` | `#161d33` | Input / secondary surfaces |
| `--border` | `#1e2a45` | All borders |
| `--accent` | `#e8c14a` | Gold - primary highlight, selected team |
| `--accent2` | `#5b9cf6` | Blue - groups, secondary info |
| `--text` | `#e8eaf0` | Body text |
| `--muted` | `#6b7898` | Labels, metadata, placeholders |
| `--live-color` | `#e8443a` | Live match indicator |
| `--highlight` | `rgba(232,193,74,0.1)` | Selected team card background |
| `--possible-bg` | `rgba(91,156,246,0.08)` | Possible knockout match background |

Fonts: `'Barlow Condensed'` for headings/scores/labels, `'Barlow'` for body text.

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
`home` and `away` are placeholder strings like `'Group L winners'` until
knockout results update them.

### scores.json (written by backend, read by PWA)

```json
{
  "g22": { "home": 2, "away": 1, "status": "FT", "minute": null },
  "g6":  { "home": 1, "away": 0, "status": "LIVE", "minute": 67 }
}
```

Status values: `FT` | `HT` | `LIVE` | `ET` | `PEN`

Only matches with known scores appear. Missing IDs = not yet played.

## Key constants in index.html (update before deploying)

```js
const SCORES_URL = '/scores.json';           // URL the PWA polls for scores
const BASE_URL = 'https://your-domain.com';  // Used for webcal:// feed URLs
const POLL_INTERVAL = 60000;                 // Normal poll frequency (ms)
```

## Environment variables (Vercel)

| Variable | Description |
|---|---|
| `FOOTBALL_DATA_API_KEY` | football-data.org API key |
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob |

## Scores polling behaviour

- PWA polls `SCORES_URL` every `POLL_INTERVAL` (60s) normally
- Drops to 30s automatically when live matches are detected
- Cache-busted with `?t=timestamp` on every request
- Silent failure if fetch fails - no UI error shown
- Live bar shown at top when results are available or matches are live

## Calendar features

Three modes triggered from the UI:

1. **Single match** - opens modal with Google Calendar URL, Outlook.com URL,
   or .ics download for Apple Calendar / Outlook desktop
2. **Team bulk** - confirmed group games only (.ics), OR all fixtures including
   knockout placeholders labelled `[If qualified]`
3. **Group bulk** - all group stage matches as .ics download
4. **Subscribe feed** - webcal:// URL for Apple, Google Calendar subscribe URL,
   Outlook instructions. Feed URL format: `BASE_URL/feeds/{slug}.ics`
   (feed serving endpoint not yet implemented - see HANDOFF.md)

## Tone and conventions

- No framework dependencies - keep it vanilla JS
- No npm build step for the frontend - it's a single deployable HTML file
- Error handling should be silent/graceful - this is a read-only info app
- No user accounts, no data collection, no analytics
- UK-first: times shown in user's local timezone, UK TV info prominent
- Hyphens with spaces ( - ) not em dashes in any user-facing text

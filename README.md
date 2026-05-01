# WC26 - World Cup 2026 PWA

Ad-free, no-login World Cup 2026 fixture tracker with live scores,
UK TV channel info, team filtering, and calendar export.

## Files

```
index.html          - The PWA (deploy this to web root)
manifest.json       - PWA manifest
sw.js               - Service worker for offline caching
scores.json         - Live scores (updated by backend cron)
vercel.json         - Vercel cron + routing config
backend/
  update-scores.js  - Serverless function (Vercel)
```

---

## Deploying to Vercel (recommended, free)

### 1. Set up the project

```bash
npm i -g vercel
vercel login
vercel
```

### 2. Set environment variables

In Vercel dashboard > Settings > Environment Variables:

| Variable | Value |
|---|---|
| `FOOTBALL_DATA_API_KEY` | Your key from football-data.org (free signup) |
| `BLOB_READ_WRITE_TOKEN` | Auto-created when you enable Vercel Blob |

### 3. Enable Vercel Blob

In Vercel dashboard > Storage > Create Database > Blob.
This gives you a place to store and serve scores.json publicly.

### 4. Move the backend function

```bash
mkdir api
cp backend/update-scores.js api/update-scores.js
```

Vercel auto-detects files in `/api` as serverless functions.

### 5. Update SCORES_URL in index.html

In `index.html`, update this line near the top of the script:
```js
const SCORES_URL = '/scores.json';
```
Leave as `/scores.json` - the `vercel.json` rewrite handles routing
it to your Blob Store URL automatically.

Also update:
```js
const BASE_URL = 'https://your-wc26-domain.com';
```
This is used for the iCal subscription feed URLs.

### 6. Deploy

```bash
vercel --prod
```

The cron job runs every 2 minutes. During live matches you can
reduce to `*/1 * * * *` (every minute) - the free Vercel plan
allows cron jobs, but check current limits at vercel.com/docs.

---

## Alternative: Netlify

Netlify Scheduled Functions work similarly.
Replace `update-scores.js` logic with a Netlify Function,
and use Netlify Blob storage instead of Vercel Blob.

---

## iCal Subscription Feeds

The subscribe feature in the calendar modal points to:
```
BASE_URL/feeds/{team-name}.ics
BASE_URL/feeds/group_{x}.ics
```

To serve these, add a second serverless function `api/feed.js`
that generates the .ics on demand from your match data,
or pre-generates and stores them in Blob alongside scores.json.

The simplest version: generate them on every scores update
and save alongside scores.json to Blob Storage. Then users
who subscribe get automatic updates as knockout opponents
are confirmed (when you update the knockout match data).

---

## scores.json format

The backend writes this format. You can also update it manually:

```json
{
  "g1": { "home": 2, "away": 1, "status": "FT", "minute": null },
  "g6": { "home": 0, "away": 0, "status": "LIVE", "minute": 34 },
  "g7": { "home": 1, "away": 1, "status": "HT", "minute": null }
}
```

Status values: `FT` (full time) | `HT` (half time) | `LIVE` | `ET` (extra time) | `PEN` (penalties)

Match IDs follow the pattern: `g1` through `g72` for group stage.

---

## Calendar features

**Single match** - adds one event via Google Calendar URL,
Outlook.com URL, or downloads a .ics file.

**Team bulk** - choice of confirmed group games only, or
all slots including knockout placeholders labelled
"[If qualified]". Correct dates and venues - opponents TBD.

**Group bulk** - all confirmed group stage matches as .ics.

**Subscribe feed** - webcal:// URL for Apple Calendar,
Google Calendar subscribe URL, and Outlook instructions.
Hosted feed auto-updates when knockout opponents are confirmed.

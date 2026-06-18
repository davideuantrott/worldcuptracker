# Session handoff — Spain vs Cape Verde score not showing

## Problem

Spain 0-0 Cape Verde (g13, 15 Jun, 16:00 UTC) shows "vs" in the fixture card with no score, while all surrounding matches on the same day show correct final scores.

## What we did

### Fix 1 — Team name alias (merged to main)

`api/update-scores.js` matches API fixtures to local matches by team name via `TEAM_NAME_MAP`. The entry for Cape Verde only had:

```js
'Cape Verde': ['Cape Verde'],
```

FIFA's official name is "Cabo Verde" and football-data.org follows FIFA naming conventions, so `findLocalMatch()` was silently returning null for every Spain/Cape Verde fixture — the score was never written to `scores.json`. We added the alias:

```js
'Cape Verde': ['Cape Verde', 'Cabo Verde'],
```

### Fix 2 — 0-0 null-goals guard (merged to main)

The match ended 0-0. The API can return `null` for all goal score fields on a nil-nil FINISHED match. The original null-goal guard:

```js
const isInPlay = m.status === 'IN_PLAY';
if ((homeGoals === null || homeGoals === undefined) && !isInPlay) return;
```

…skipped FINISHED matches with all-null goals rather than allowing `homeGoals ?? 0` to produce the correct 0-0. Changed to:

```js
const ACTIVE_STATUSES = new Set(['FINISHED', 'PAUSED', 'IN_PLAY', 'EXTRA_TIME', 'PENALTY']);
if ((homeGoals === null || homeGoals === undefined) && !ACTIVE_STATUSES.has(m.status)) return;
```

### Fix 3 — Unmatched team logging (merged to main)

Any ACTIVE/FINISHED match that fails team-name matching now logs to stdout:

```
Unmatched: "X" vs "Y" (STATUS)
```

This appears in cron-job.org logs and should immediately reveal if the team name returned by the API is still something else entirely.

### Deployment note

The first fix attempt was pushed to the feature branch `claude/spain-cape-verde-score-zbrl4v` only. Vercel deploys that as a **preview URL** — the production site (worldcuptracker.vercel.app) only updates when changes reach **main**. The cron-job.org cron calls the production URL. Both fixes were subsequently merged to main.

## Current state

All three fixes are on **main** and should be deployed. Despite this, the score is still not appearing as of the end of this session.

## Most likely remaining causes

### 1. Football-data.org uses a third team name

Neither "Cape Verde" nor "Cabo Verde" may match what the API actually returns. Other possibilities seen in sports data:
- `"Cape Verde Islands"`
- `"Cabo Verde Islands"`
- `"CV"` (ISO code)
- Portuguese: `"Ilhas de Cabo Verde"`

**How to diagnose:** Check cron-job.org logs for the `Unmatched:` line after the latest cron run. The log now prints the exact API team name for any active/finished match that fails to map.

If there's an unmatched line, add whatever name appears as another alias in `TEAM_NAME_MAP`.

### 2. Vercel didn't redeploy

The push to main should have triggered a Vercel redeploy automatically, but it's worth checking the Vercel dashboard to confirm the latest deployment is live and was triggered by the correct commit.

### 3. The score still isn't in scores.json

Even with the code fix deployed, the blob only updates on the next cron run. The cron fires every 5 minutes. If it's been more than 5 minutes since the deployment and the score still isn't showing, check the blob directly:

```
https://kdoazmegsbme4ynq.public.blob.vercel-storage.com/scores.json
```

Look for key `"g13"` — if it's absent, the cron ran but still couldn't write the score (team name still mismatching or another issue). If it's present with `0-0 FT`, the fix worked but the PWA is serving a cached version.

### 4. Cached scores in the serverless function

`update-scores.js` uses a module-level `cachedScores` variable to avoid redundant blob writes. After a fresh deployment this resets to `null` so the first cron run always writes. This shouldn't be an issue post-deploy, but if you manually trigger `/api/update-scores` and it returns `scoresWritten: false`, the function is returning cached data — wait for a cold start or redeploy.

## Key files

| File | Relevance |
|---|---|
| `api/update-scores.js` | Serverless cron function — team name map, score extraction, blob write |
| `CLAUDE.md` | Documents the score-extraction quirks and naming gotchas |
| `sw.js` | Service worker cache version (currently `wc26-v10`) |

## Recommended next step

1. Open cron-job.org → check the most recent execution log
2. Search for any `Unmatched:` line — it will show the exact string the API uses for Cape Verde
3. Add that string as another alias in `TEAM_NAME_MAP`
4. Alternatively, manually `curl` the football-data.org API with the `FOOTBALL_DATA_API_KEY` from the Vercel dashboard and `grep` for "verde" to see the exact team name

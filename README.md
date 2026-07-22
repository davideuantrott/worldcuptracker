# WC26 - World Cup 2026 Results Archive

Ad-free, no-login static results archive for FIFA World Cup 2026 - fixtures,
final scores, groups, standings, UK TV listings, team/group filtering, and
calendar export.

The tournament has concluded (Spain won the final 1-0 against Argentina,
England took third place). This is now a fully static site - all results,
standings, and knockout bracket data are baked into `index.html` as
constants. There is no backend, no live polling, and nothing to deploy
beyond the static files themselves.

## Files

```
index.html      - The whole app: UI, final results data, and all logic
manifest.json   - PWA manifest
sw.js           - Service worker (cache-first, offline support)
vercel.json     - Static hosting headers (security headers only)
```

## Deploying

Any static host works - Vercel, Netlify, GitHub Pages, or a plain file
server. There are no environment variables, cron jobs, or serverless
functions required.

```bash
vercel --prod
```

## After making changes

Bump `const CACHE = 'wc26-vN'` in `sw.js` so installed PWA users get the
updated page instead of a stale cached version.

## Calendar features

**Single match** - adds one event via Google Calendar URL,
Outlook.com URL, or downloads a .ics file.

**Team bulk** - downloads all of a team's group stage + knockout matches.

**Group bulk** - all group stage matches for a group as .ics.

**Subscribe feed** - shows a webcal:// URL / Google Calendar subscribe
link. Note: the feed-serving endpoint (`/feeds/*.ics`) was never
implemented, so this option won't actually work unless that's added.

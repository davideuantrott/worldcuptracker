/**
 * WC26 Score Updater - Vercel Serverless Function
 * 
 * Deploy to Vercel. Set environment variables:
 *   FOOTBALL_DATA_API_KEY  - your football-data.org API key (free)
 *   BLOB_STORE_TOKEN       - Vercel Blob storage token (for writing scores.json)
 *
 * This function is called on a cron schedule (see vercel.json).
 * It fetches live/recent World Cup results and writes a scores.json
 * to Vercel Blob Storage, which the PWA reads directly.
 * 
 * scores.json format:
 * {
 *   "g1": { "home": 2, "away": 1, "status": "FT", "minute": null },
 *   "g6": { "home": 1, "away": 0, "status": "LIVE", "minute": 67 }
 * }
 */

// Match our local IDs to football-data.org team names
// Update team names here if the API uses different spellings
const TEAM_NAME_MAP = {
  'Mexico': ['Mexico'],
  'South Africa': ['South Africa'],
  'South Korea': ['Korea Republic', 'South Korea'],
  'Czechia': ['Czech Republic', 'Czechia'],
  'Canada': ['Canada'],
  'Bosnia & Herzegovina': ['Bosnia and Herzegovina', 'Bosnia & Herzegovina'],
  'Qatar': ['Qatar'],
  'Switzerland': ['Switzerland'],
  'Brazil': ['Brazil'],
  'Morocco': ['Morocco'],
  'Haiti': ['Haiti'],
  'Scotland': ['Scotland'],
  'United States': ['United States', 'USA'],
  'Paraguay': ['Paraguay'],
  'Australia': ['Australia'],
  'Türkiye': ['Turkey', 'Türkiye'],
  'Germany': ['Germany'],
  'Curaçao': ['Curaçao', 'Curacao'],
  'Ivory Coast': ['Ivory Coast', "Côte d'Ivoire"],
  'Ecuador': ['Ecuador'],
  'Netherlands': ['Netherlands'],
  'Japan': ['Japan'],
  'Sweden': ['Sweden'],
  'Tunisia': ['Tunisia'],
  'Spain': ['Spain'],
  'Cape Verde': ['Cape Verde'],
  'Saudi Arabia': ['Saudi Arabia'],
  'Uruguay': ['Uruguay'],
  'Belgium': ['Belgium'],
  'Egypt': ['Egypt'],
  'Iran': ['Iran'],
  'New Zealand': ['New Zealand'],
  'France': ['France'],
  'Senegal': ['Senegal'],
  'Norway': ['Norway'],
  'Iraq': ['Iraq'],
  'Argentina': ['Argentina'],
  'Algeria': ['Algeria'],
  'Austria': ['Austria'],
  'Jordan': ['Jordan'],
  'Portugal': ['Portugal'],
  'DR Congo': ['Congo DR', 'DR Congo', 'Democratic Republic of Congo'],
  'Uzbekistan': ['Uzbekistan'],
  'Colombia': ['Colombia'],
  'England': ['England'],
  'Croatia': ['Croatia'],
  'Ghana': ['Ghana'],
  'Panama': ['Panama'],
};

// Our local match list (id, home, away)
const MATCH_IDS = [
  {id:'g1',home:'Mexico',away:'South Africa'},
  {id:'g2',home:'South Korea',away:'Czechia'},
  {id:'g3',home:'Canada',away:'Bosnia & Herzegovina'},
  {id:'g4',home:'United States',away:'Paraguay'},
  {id:'g5',home:'Qatar',away:'Switzerland'},
  {id:'g6',home:'Brazil',away:'Morocco'},
  {id:'g7',home:'Haiti',away:'Scotland'},
  {id:'g8',home:'Australia',away:'Türkiye'},
  {id:'g9',home:'Germany',away:'Curaçao'},
  {id:'g10',home:'Netherlands',away:'Japan'},
  {id:'g11',home:'Ivory Coast',away:'Ecuador'},
  {id:'g12',home:'Sweden',away:'Tunisia'},
  {id:'g13',home:'Spain',away:'Cape Verde'},
  {id:'g14',home:'Belgium',away:'Egypt'},
  {id:'g15',home:'Saudi Arabia',away:'Uruguay'},
  {id:'g16',home:'Iran',away:'New Zealand'},
  {id:'g17',home:'France',away:'Senegal'},
  {id:'g18',home:'Iraq',away:'Norway'},
  {id:'g19',home:'Argentina',away:'Algeria'},
  {id:'g20',home:'Austria',away:'Jordan'},
  {id:'g21',home:'Portugal',away:'DR Congo'},
  {id:'g22',home:'England',away:'Croatia'},
  {id:'g23',home:'Ghana',away:'Panama'},
  {id:'g24',home:'Uzbekistan',away:'Colombia'},
  {id:'g25',home:'Czechia',away:'South Africa'},
  {id:'g26',home:'Switzerland',away:'Bosnia & Herzegovina'},
  {id:'g27',home:'Canada',away:'Qatar'},
  {id:'g28',home:'Mexico',away:'South Korea'},
  {id:'g29',home:'United States',away:'Australia'},
  {id:'g30',home:'Scotland',away:'Morocco'},
  {id:'g31',home:'Brazil',away:'Haiti'},
  {id:'g32',home:'Türkiye',away:'Paraguay'},
  {id:'g33',home:'Netherlands',away:'Sweden'},
  {id:'g34',home:'Germany',away:'Ivory Coast'},
  {id:'g35',home:'Ecuador',away:'Curaçao'},
  {id:'g36',home:'Tunisia',away:'Japan'},
  {id:'g37',home:'Spain',away:'Saudi Arabia'},
  {id:'g38',home:'Belgium',away:'Iran'},
  {id:'g39',home:'Uruguay',away:'Cape Verde'},
  {id:'g40',home:'New Zealand',away:'Egypt'},
  {id:'g41',home:'Argentina',away:'Austria'},
  {id:'g42',home:'France',away:'Iraq'},
  {id:'g43',home:'Norway',away:'Senegal'},
  {id:'g44',home:'Jordan',away:'Algeria'},
  {id:'g45',home:'Portugal',away:'Uzbekistan'},
  {id:'g46',home:'England',away:'Ghana'},
  {id:'g47',home:'Panama',away:'Croatia'},
  {id:'g48',home:'Colombia',away:'DR Congo'},
  {id:'g49',home:'Switzerland',away:'Canada'},
  {id:'g50',home:'Bosnia & Herzegovina',away:'Qatar'},
  {id:'g51',home:'Scotland',away:'Brazil'},
  {id:'g52',home:'Morocco',away:'Haiti'},
  {id:'g53',home:'Czechia',away:'Mexico'},
  {id:'g54',home:'South Africa',away:'South Korea'},
  {id:'g55',home:'Ecuador',away:'Germany'},
  {id:'g56',home:'Curaçao',away:'Ivory Coast'},
  {id:'g57',home:'Japan',away:'Sweden'},
  {id:'g58',home:'Tunisia',away:'Netherlands'},
  {id:'g59',home:'Türkiye',away:'United States'},
  {id:'g60',home:'Paraguay',away:'Australia'},
  {id:'g61',home:'Norway',away:'France'},
  {id:'g62',home:'Senegal',away:'Iraq'},
  {id:'g63',home:'Uruguay',away:'Spain'},
  {id:'g64',home:'Cape Verde',away:'Saudi Arabia'},
  {id:'g65',home:'Egypt',away:'Iran'},
  {id:'g66',home:'New Zealand',away:'Belgium'},
  {id:'g67',home:'Panama',away:'England'},
  {id:'g68',home:'Croatia',away:'Ghana'},
  {id:'g69',home:'Colombia',away:'Portugal'},
  {id:'g70',home:'DR Congo',away:'Uzbekistan'},
  {id:'g71',home:'Algeria',away:'Austria'},
  {id:'g72',home:'Jordan',away:'Argentina'},
];

function normalise(name) {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function matchesLocalTeam(apiName, localName) {
  const aliases = TEAM_NAME_MAP[localName] || [localName];
  return aliases.some(a => normalise(a) === normalise(apiName));
}

function findLocalMatch(apiHome, apiAway) {
  return MATCH_IDS.find(m =>
    matchesLocalTeam(apiHome, m.home) && matchesLocalTeam(apiAway, m.away)
  );
}

// Main handler - called by Vercel cron
export default async function handler(req, res) {
  // Allow manual trigger via GET, or scheduled cron
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FOOTBALL_DATA_API_KEY not set' });
  }

  try {
    // Fetch all WC 2026 matches from football-data.org
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: {
        'X-Auth-Token': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const scores = {};

    (data.matches || []).forEach(m => {
      const local = findLocalMatch(m.homeTeam.name, m.awayTeam.name);
      if (!local) return;

      const score = m.score;
      // Use full time score if available, fall back to half time
      const homeGoals = score?.fullTime?.home ?? score?.halfTime?.home ?? null;
      const awayGoals = score?.fullTime?.away ?? score?.halfTime?.away ?? null;

      if (homeGoals === null || homeGoals === undefined) return;

      let status;
      switch (m.status) {
        case 'FINISHED':   status = 'FT';   break;
        case 'PAUSED':     status = 'HT';   break;
        case 'IN_PLAY':    status = 'LIVE'; break;
        case 'EXTRA_TIME': status = 'ET';   break;
        case 'PENALTY':    status = 'PEN';  break;
        default: return; // SCHEDULED, TIMED - skip
      }

      scores[local.id] = {
        home: homeGoals,
        away: awayGoals,
        status,
        minute: m.minute || null,
      };
    });

    // Write scores.json to Vercel Blob Storage
    // Install: npm i @vercel/blob
    const { put } = await import('@vercel/blob');
    const blob = await put('scores.json', JSON.stringify(scores), {
      access: 'public',
      contentType: 'application/json',
      // This overwrites the existing file each time
      addRandomSuffix: false,
    });

    console.log(`Updated scores.json with ${Object.keys(scores).length} results at ${blob.url}`);
    return res.status(200).json({ ok: true, count: Object.keys(scores).length, url: blob.url });

  } catch (err) {
    console.error('Score update failed:', err);
    return res.status(500).json({ error: err.message });
  }
}

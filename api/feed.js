const GROUPS = {
  A: ['Mexico','South Africa','South Korea','Czechia'],
  B: ['Canada','Bosnia & Herzegovina','Qatar','Switzerland'],
  C: ['Brazil','Morocco','Haiti','Scotland'],
  D: ['United States','Paraguay','Australia','Türkiye'],
  E: ['Germany','Curaçao','Ivory Coast','Ecuador'],
  F: ['Netherlands','Japan','Sweden','Tunisia'],
  G: ['Belgium','Egypt','Iran','New Zealand'],
  H: ['Spain','Cape Verde','Saudi Arabia','Uruguay'],
  I: ['France','Senegal','Norway','Iraq'],
  J: ['Argentina','Algeria','Austria','Jordan'],
  K: ['Portugal','DR Congo','Uzbekistan','Colombia'],
  L: ['England','Croatia','Ghana','Panama'],
};

const MATCHES = [
  {id:'g1',date:'2026-06-11',utc:'19:00',home:'Mexico',away:'South Africa',venue:'Estadio Azteca, Mexico City',group:'A',uk:'ITV'},
  {id:'g2',date:'2026-06-12',utc:'02:00',home:'South Korea',away:'Czechia',venue:'Estadio Akron, Zapopan',group:'A',uk:'ITV'},
  {id:'g3',date:'2026-06-12',utc:'19:00',home:'Canada',away:'Bosnia & Herzegovina',venue:'BMO Field, Toronto',group:'B',uk:'BBC'},
  {id:'g4',date:'2026-06-13',utc:'01:00',home:'United States',away:'Paraguay',venue:'SoFi Stadium, Inglewood',group:'D',uk:'BBC'},
  {id:'g5',date:'2026-06-13',utc:'19:00',home:'Qatar',away:'Switzerland',venue:"Levi's Stadium, Santa Clara",group:'B',uk:'ITV'},
  {id:'g6',date:'2026-06-13',utc:'22:00',home:'Brazil',away:'Morocco',venue:'MetLife Stadium, East Rutherford',group:'C',uk:'BBC'},
  {id:'g7',date:'2026-06-14',utc:'01:00',home:'Haiti',away:'Scotland',venue:'Gillette Stadium, Foxborough',group:'C',uk:'BBC'},
  {id:'g8',date:'2026-06-14',utc:'04:00',home:'Australia',away:'Türkiye',venue:'BC Place, Vancouver',group:'D',uk:'ITV'},
  {id:'g9',date:'2026-06-14',utc:'17:00',home:'Germany',away:'Curaçao',venue:'NRG Stadium, Houston',group:'E',uk:'ITV'},
  {id:'g10',date:'2026-06-14',utc:'20:00',home:'Netherlands',away:'Japan',venue:'AT&T Stadium, Arlington',group:'F',uk:'ITV'},
  {id:'g11',date:'2026-06-14',utc:'23:00',home:'Ivory Coast',away:'Ecuador',venue:'Lincoln Financial, Philadelphia',group:'E',uk:'BBC'},
  {id:'g12',date:'2026-06-15',utc:'02:00',home:'Sweden',away:'Tunisia',venue:'Estadio Guadalajara, Zapopan',group:'F',uk:'ITV'},
  {id:'g13',date:'2026-06-15',utc:'16:00',home:'Spain',away:'Cape Verde',venue:'Mercedes-Benz Stadium, Atlanta',group:'H',uk:'ITV'},
  {id:'g14',date:'2026-06-15',utc:'19:00',home:'Belgium',away:'Egypt',venue:'Lumen Field, Seattle',group:'G',uk:'BBC'},
  {id:'g15',date:'2026-06-15',utc:'22:00',home:'Saudi Arabia',away:'Uruguay',venue:'Hard Rock Stadium, Miami',group:'H',uk:'ITV'},
  {id:'g16',date:'2026-06-16',utc:'01:00',home:'Iran',away:'New Zealand',venue:'SoFi Stadium, Inglewood',group:'G',uk:'BBC'},
  {id:'g17',date:'2026-06-16',utc:'19:00',home:'France',away:'Senegal',venue:'MetLife Stadium, East Rutherford',group:'I',uk:'BBC'},
  {id:'g18',date:'2026-06-16',utc:'22:00',home:'Iraq',away:'Norway',venue:'Gillette Stadium, Foxborough',group:'I',uk:'BBC'},
  {id:'g19',date:'2026-06-17',utc:'01:00',home:'Argentina',away:'Algeria',venue:'Arrowhead Stadium, Kansas City',group:'J',uk:'ITV'},
  {id:'g20',date:'2026-06-17',utc:'04:00',home:'Austria',away:'Jordan',venue:"Levi's Stadium, Santa Clara",group:'J',uk:'BBC'},
  {id:'g21',date:'2026-06-17',utc:'17:00',home:'Portugal',away:'DR Congo',venue:'NRG Stadium, Houston',group:'K',uk:'BBC'},
  {id:'g22',date:'2026-06-17',utc:'20:00',home:'England',away:'Croatia',venue:'AT&T Stadium, Arlington',group:'L',uk:'ITV'},
  {id:'g23',date:'2026-06-17',utc:'23:00',home:'Ghana',away:'Panama',venue:'BMO Field, Toronto',group:'L',uk:'ITV'},
  {id:'g24',date:'2026-06-18',utc:'02:00',home:'Uzbekistan',away:'Colombia',venue:'Estadio Azteca, Mexico City',group:'K',uk:'BBC'},
  {id:'g25',date:'2026-06-18',utc:'16:00',home:'Czechia',away:'South Africa',venue:'Mercedes-Benz Stadium, Atlanta',group:'A',uk:'BBC'},
  {id:'g26',date:'2026-06-18',utc:'19:00',home:'Switzerland',away:'Bosnia & Herzegovina',venue:'SoFi Stadium, Inglewood',group:'B',uk:'ITV'},
  {id:'g27',date:'2026-06-18',utc:'22:00',home:'Canada',away:'Qatar',venue:'BC Place, Vancouver',group:'B',uk:'ITV'},
  {id:'g28',date:'2026-06-19',utc:'01:00',home:'Mexico',away:'South Korea',venue:'Estadio Akron, Zapopan',group:'A',uk:'BBC'},
  {id:'g29',date:'2026-06-19',utc:'19:00',home:'United States',away:'Australia',venue:'Lumen Field, Seattle',group:'D',uk:'BBC'},
  {id:'g30',date:'2026-06-19',utc:'22:00',home:'Scotland',away:'Morocco',venue:'Gillette Stadium, Foxborough',group:'C',uk:'ITV'},
  {id:'g31',date:'2026-06-20',utc:'00:30',home:'Brazil',away:'Haiti',venue:'Lincoln Financial, Philadelphia',group:'C',uk:'ITV'},
  {id:'g32',date:'2026-06-20',utc:'03:00',home:'Türkiye',away:'Paraguay',venue:"Levi's Stadium, Santa Clara",group:'D',uk:'ITV'},
  {id:'g33',date:'2026-06-20',utc:'17:00',home:'Netherlands',away:'Sweden',venue:'NRG Stadium, Houston',group:'F',uk:'BBC'},
  {id:'g34',date:'2026-06-20',utc:'20:00',home:'Germany',away:'Ivory Coast',venue:'BMO Field, Toronto',group:'E',uk:'ITV'},
  {id:'g35',date:'2026-06-21',utc:'00:00',home:'Ecuador',away:'Curaçao',venue:'Arrowhead Stadium, Kansas City',group:'E',uk:'BBC'},
  {id:'g36',date:'2026-06-21',utc:'04:00',home:'Tunisia',away:'Japan',venue:'Estadio Guadalajara, Zapopan',group:'F',uk:'BBC'},
  {id:'g37',date:'2026-06-21',utc:'16:00',home:'Spain',away:'Saudi Arabia',venue:'Mercedes-Benz Stadium, Atlanta',group:'H',uk:'BBC'},
  {id:'g38',date:'2026-06-21',utc:'19:00',home:'Belgium',away:'Iran',venue:'SoFi Stadium, Inglewood',group:'G',uk:'ITV'},
  {id:'g39',date:'2026-06-21',utc:'22:00',home:'Uruguay',away:'Cape Verde',venue:'Hard Rock Stadium, Miami',group:'H',uk:'BBC'},
  {id:'g40',date:'2026-06-22',utc:'01:00',home:'New Zealand',away:'Egypt',venue:'BC Place, Vancouver',group:'G',uk:'ITV'},
  {id:'g41',date:'2026-06-22',utc:'17:00',home:'Argentina',away:'Austria',venue:'AT&T Stadium, Arlington',group:'J',uk:'BBC'},
  {id:'g42',date:'2026-06-22',utc:'21:00',home:'France',away:'Iraq',venue:'Lincoln Financial, Philadelphia',group:'I',uk:'BBC'},
  {id:'g43',date:'2026-06-23',utc:'00:00',home:'Norway',away:'Senegal',venue:'MetLife Stadium, East Rutherford',group:'I',uk:'ITV'},
  {id:'g44',date:'2026-06-23',utc:'03:00',home:'Jordan',away:'Algeria',venue:"Levi's Stadium, Santa Clara",group:'J',uk:'ITV'},
  {id:'g45',date:'2026-06-23',utc:'17:00',home:'Portugal',away:'Uzbekistan',venue:'NRG Stadium, Houston',group:'K',uk:'ITV'},
  {id:'g46',date:'2026-06-23',utc:'20:00',home:'England',away:'Ghana',venue:'Gillette Stadium, Foxborough',group:'L',uk:'BBC'},
  {id:'g47',date:'2026-06-23',utc:'23:00',home:'Panama',away:'Croatia',venue:'BMO Field, Toronto',group:'L',uk:'BBC'},
  {id:'g48',date:'2026-06-24',utc:'02:00',home:'Colombia',away:'DR Congo',venue:'Estadio Akron, Zapopan',group:'K',uk:'ITV'},
  {id:'g49',date:'2026-06-24',utc:'19:00',home:'Switzerland',away:'Canada',venue:'BC Place, Vancouver',group:'B',uk:'ITV'},
  {id:'g50',date:'2026-06-24',utc:'19:00',home:'Bosnia & Herzegovina',away:'Qatar',venue:'Lumen Field, Seattle',group:'B',uk:'ITV'},
  {id:'g51',date:'2026-06-24',utc:'22:00',home:'Scotland',away:'Brazil',venue:'Hard Rock Stadium, Miami',group:'C',uk:'BBC'},
  {id:'g52',date:'2026-06-24',utc:'22:00',home:'Morocco',away:'Haiti',venue:'Mercedes-Benz Stadium, Atlanta',group:'C',uk:'BBC'},
  {id:'g53',date:'2026-06-25',utc:'01:00',home:'Czechia',away:'Mexico',venue:'Estadio Azteca, Mexico City',group:'A',uk:'BBC'},
  {id:'g54',date:'2026-06-25',utc:'01:00',home:'South Africa',away:'South Korea',venue:'Estadio Guadalajara, Zapopan',group:'A',uk:'BBC'},
  {id:'g55',date:'2026-06-25',utc:'20:00',home:'Ecuador',away:'Germany',venue:'MetLife Stadium, East Rutherford',group:'E',uk:'BBC'},
  {id:'g56',date:'2026-06-25',utc:'20:00',home:'Curaçao',away:'Ivory Coast',venue:'Lincoln Financial, Philadelphia',group:'E',uk:'BBC'},
  {id:'g57',date:'2026-06-25',utc:'23:00',home:'Japan',away:'Sweden',venue:'AT&T Stadium, Arlington',group:'F',uk:'BBC'},
  {id:'g58',date:'2026-06-25',utc:'23:00',home:'Tunisia',away:'Netherlands',venue:'Arrowhead Stadium, Kansas City',group:'F',uk:'BBC'},
  {id:'g59',date:'2026-06-26',utc:'02:00',home:'Türkiye',away:'United States',venue:'SoFi Stadium, Inglewood',group:'D',uk:'ITV'},
  {id:'g60',date:'2026-06-26',utc:'02:00',home:'Paraguay',away:'Australia',venue:"Levi's Stadium, Santa Clara",group:'D',uk:'ITV'},
  {id:'g61',date:'2026-06-26',utc:'19:00',home:'Norway',away:'France',venue:'Gillette Stadium, Foxborough',group:'I',uk:'ITV'},
  {id:'g62',date:'2026-06-26',utc:'19:00',home:'Senegal',away:'Iraq',venue:'BMO Field, Toronto',group:'I',uk:'ITV'},
  {id:'g63',date:'2026-06-27',utc:'00:00',home:'Uruguay',away:'Spain',venue:'Estadio Akron, Zapopan',group:'H',uk:'ITV'},
  {id:'g64',date:'2026-06-27',utc:'00:00',home:'Cape Verde',away:'Saudi Arabia',venue:'NRG Stadium, Houston',group:'H',uk:'ITV'},
  {id:'g65',date:'2026-06-27',utc:'03:00',home:'Egypt',away:'Iran',venue:'Lumen Field, Seattle',group:'G',uk:'BBC'},
  {id:'g66',date:'2026-06-27',utc:'03:00',home:'New Zealand',away:'Belgium',venue:'BC Place, Vancouver',group:'G',uk:'BBC'},
  {id:'g67',date:'2026-06-27',utc:'21:00',home:'Panama',away:'England',venue:'MetLife Stadium, East Rutherford',group:'L',uk:'ITV'},
  {id:'g68',date:'2026-06-27',utc:'21:00',home:'Croatia',away:'Ghana',venue:'Lincoln Financial, Philadelphia',group:'L',uk:'ITV'},
  {id:'g69',date:'2026-06-27',utc:'23:30',home:'Colombia',away:'Portugal',venue:'Hard Rock Stadium, Miami',group:'K',uk:'BBC'},
  {id:'g70',date:'2026-06-27',utc:'23:30',home:'DR Congo',away:'Uzbekistan',venue:'Mercedes-Benz Stadium, Atlanta',group:'K',uk:'BBC'},
  {id:'g71',date:'2026-06-28',utc:'02:00',home:'Algeria',away:'Austria',venue:'Arrowhead Stadium, Kansas City',group:'J',uk:'BBC'},
  {id:'g72',date:'2026-06-28',utc:'02:00',home:'Jordan',away:'Argentina',venue:'AT&T Stadium, Arlington',group:'J',uk:'BBC'},
];

const KNOCKOUT_ROUNDS = [
  {round:'Round of 32',matches:[
    {id:'r32-1',date:'2026-06-28',utc:'19:00',home:'Group A runners-up',away:'Group B runners-up',venue:'SoFi Stadium, Inglewood',uk:'TBA',confirmed:false},
    {id:'r32-2',date:'2026-06-29',utc:'17:00',home:'Group C winners',away:'Group F runners-up',venue:'NRG Stadium, Houston',uk:'TBA',confirmed:false},
    {id:'r32-3',date:'2026-06-29',utc:'20:30',home:'Group E winners',away:'Best 3rd (ABCDF)',venue:'Gillette Stadium, Foxborough',uk:'TBA',confirmed:false},
    {id:'r32-4',date:'2026-06-30',utc:'01:00',home:'Group F winners',away:'Group C runners-up',venue:'Estadio Guadalajara, Zapopan',uk:'TBA',confirmed:false},
    {id:'r32-5',date:'2026-06-30',utc:'17:00',home:'Group E runners-up',away:'Group I runners-up',venue:'AT&T Stadium, Arlington',uk:'TBA',confirmed:false},
    {id:'r32-6',date:'2026-06-30',utc:'21:00',home:'Group I winners',away:'Best 3rd (CDFGH)',venue:'MetLife Stadium, East Rutherford',uk:'TBA',confirmed:false},
    {id:'r32-7',date:'2026-07-01',utc:'01:00',home:'Group A winners',away:'Best 3rd (CEFHI)',venue:'Estadio Azteca, Mexico City',uk:'TBA',confirmed:false},
    {id:'r32-8',date:'2026-07-01',utc:'16:00',home:'Group L winners',away:'Best 3rd (EHIJK)',venue:'Mercedes-Benz Stadium, Atlanta',uk:'TBA',confirmed:false},
    {id:'r32-9',date:'2026-07-01',utc:'20:00',home:'Group G winners',away:'Best 3rd (AEHIJ)',venue:'Lumen Field, Seattle',uk:'TBA',confirmed:false},
    {id:'r32-10',date:'2026-07-02',utc:'00:00',home:'Group D winners',away:'Best 3rd (BEFIJ)',venue:"Levi's Stadium, Santa Clara",uk:'TBA',confirmed:false},
    {id:'r32-11',date:'2026-07-02',utc:'19:00',home:'Group H winners',away:'Group J runners-up',venue:'SoFi Stadium, Inglewood',uk:'TBA',confirmed:false},
    {id:'r32-12',date:'2026-07-02',utc:'23:00',home:'Group K runners-up',away:'Group L runners-up',venue:'BMO Field, Toronto',uk:'TBA',confirmed:false},
    {id:'r32-13',date:'2026-07-03',utc:'02:00',home:'Group B winners',away:'Best 3rd (EFGIJ)',venue:'BC Place, Vancouver',uk:'TBA',confirmed:false},
    {id:'r32-14',date:'2026-07-03',utc:'18:00',home:'Group D runners-up',away:'Group G runners-up',venue:'AT&T Stadium, Arlington',uk:'TBA',confirmed:false},
    {id:'r32-15',date:'2026-07-03',utc:'22:00',home:'Group J winners',away:'Group H runners-up',venue:'Hard Rock Stadium, Miami',uk:'TBA',confirmed:false},
    {id:'r32-16',date:'2026-07-04',utc:'01:30',home:'Group K winners',away:'Best 3rd (DEIJL)',venue:'Arrowhead Stadium, Kansas City',uk:'TBA',confirmed:false},
  ]},
  {round:'Round of 16',matches:[
    {id:'r16-1',date:'2026-07-04',utc:'17:00',home:'Winner R32 M2',away:'Winner R32 M4',venue:'NRG Stadium, Houston',uk:'TBA',confirmed:false},
    {id:'r16-2',date:'2026-07-04',utc:'21:00',home:'Winner R32 M3',away:'Winner R32 M5',venue:'Lincoln Financial, Philadelphia',uk:'TBA',confirmed:false},
    {id:'r16-3',date:'2026-07-05',utc:'20:00',home:'Winner R32 M6',away:'Winner R32 M7',venue:'MetLife Stadium, East Rutherford',uk:'TBA',confirmed:false},
    {id:'r16-4',date:'2026-07-05',utc:'23:00',home:'Winner R32 M1',away:'Winner R32 M13',venue:'Estadio Azteca, Mexico City',uk:'TBA',confirmed:false},
    {id:'r16-5',date:'2026-07-06',utc:'19:00',home:'Winner R32 M9',away:'Winner R32 M11',venue:'AT&T Stadium, Arlington',uk:'TBA',confirmed:false},
    {id:'r16-6',date:'2026-07-06',utc:'21:00',home:'Winner R32 M10',away:'Winner R32 M12',venue:'Lumen Field, Seattle',uk:'TBA',confirmed:false},
    {id:'r16-7',date:'2026-07-07',utc:'16:00',home:'Winner R32 M8',away:'Winner R32 M16',venue:'Mercedes-Benz Stadium, Atlanta',uk:'TBA',confirmed:false},
    {id:'r16-8',date:'2026-07-07',utc:'20:00',home:'Winner R32 M14',away:'Winner R32 M15',venue:'BC Place, Vancouver',uk:'TBA',confirmed:false},
  ]},
  {round:'Quarter-finals',matches:[
    {id:'qf-1',date:'2026-07-09',utc:'20:00',home:'Winner R16 M1',away:'Winner R16 M2',venue:'Gillette Stadium, Foxborough',uk:'TBA',confirmed:false},
    {id:'qf-2',date:'2026-07-10',utc:'19:00',home:'Winner R16 M3',away:'Winner R16 M4',venue:'SoFi Stadium, Inglewood',uk:'TBA',confirmed:false},
    {id:'qf-3',date:'2026-07-11',utc:'21:00',home:'Winner R16 M5',away:'Winner R16 M6',venue:'Hard Rock Stadium, Miami',uk:'TBA',confirmed:false},
    {id:'qf-4',date:'2026-07-12',utc:'00:00',home:'Winner R16 M7',away:'Winner R16 M8',venue:'Arrowhead Stadium, Kansas City',uk:'TBA',confirmed:false},
  ]},
  {round:'Semi-finals',matches:[
    {id:'sf-1',date:'2026-07-14',utc:'19:00',home:'Winner QF 1',away:'Winner QF 2',venue:'AT&T Stadium, Arlington',uk:'TBA',confirmed:false},
    {id:'sf-2',date:'2026-07-15',utc:'19:00',home:'Winner QF 3',away:'Winner QF 4',venue:'Mercedes-Benz Stadium, Atlanta',uk:'TBA',confirmed:false},
  ]},
  {round:'Third Place Play-off',matches:[
    {id:'3p',date:'2026-07-18',utc:'21:00',home:'Loser SF 1',away:'Loser SF 2',venue:'Hard Rock Stadium, Miami',uk:'TBA',confirmed:false},
  ]},
  {round:'Final',matches:[
    {id:'final',date:'2026-07-19',utc:'19:00',home:'Winner SF 1',away:'Winner SF 2',venue:'MetLife Stadium, East Rutherford',uk:'BOTH',confirmed:false},
  ]},
];

function teamToSlug(team) {
  return team.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function findTeamBySlug(slug) {
  const allTeams = [...new Set(MATCHES.flatMap(m => [m.home, m.away]))];
  return allTeams.find(t => teamToSlug(t) === slug) || null;
}

function getTeamGroup(team) {
  for (const [g, teams] of Object.entries(GROUPS)) {
    if (teams.includes(team)) return g;
  }
  return null;
}

function parseKickoff(dateStr, utcStr) {
  const [h, m] = utcStr.split(':').map(Number);
  return new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`);
}

function fmtIcsDate(dateStr, utcStr) {
  return parseKickoff(dateStr, utcStr).toISOString().replace(/[-:]/g, '').replace('.000', '');
}

function fmtIcsDateEnd(dateStr, utcStr) {
  return new Date(parseKickoff(dateStr, utcStr).getTime() + 110 * 60000)
    .toISOString().replace(/[-:]/g, '').replace('.000', '');
}

function icsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function matchToIcsEvent(m) {
  const channelName = { BBC: 'BBC', ITV: 'ITV', BOTH: 'BBC & ITV' }[m.uk] || '';
  const tvSuffix = channelName ? ` - ${channelName}` : '';
  const tvStr = channelName ? ` · UK: ${m.uk === 'BOTH' ? 'BBC & ITV' : m.uk + (m.uk === 'BBC' ? ' (iPlayer)' : ' (ITVX)')}` : '';
  const confirmedNote = m.confirmed === false ? ' [PENCILLED IN - subject to qualification]' : '';
  const title = `${m.home} vs. ${m.away}${tvSuffix}`;
  const desc = `FIFA World Cup 2026 - Group ${m.group || 'Knockout'}\n${m.venue}${tvStr}${confirmedNote}`;
  const uid = `wc2026-${m.id}@wc26`;
  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART:${fmtIcsDate(m.date, m.utc)}`,
    `DTEND:${fmtIcsDateEnd(m.date, m.utc)}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `LOCATION:${icsEscape(m.venue || '')}`,
    'END:VEVENT',
  ].join('\r\n');
}

function buildIcs(matches, calName) {
  const events = matches.map(matchToIcsEvent).join('\r\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WC26//World Cup 2026//EN',
    `X-WR-CALNAME:${calName}`,
    'X-WR-TIMEZONE:UTC',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export default function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    res.status(400).send('Missing slug');
    return;
  }

  let matches, calName;

  if (slug.startsWith('group_')) {
    const groupLetter = slug.slice(6).toUpperCase();
    const groupMatches = MATCHES.filter(m => m.group === groupLetter);
    if (groupMatches.length === 0) {
      res.status(404).send('Group not found');
      return;
    }
    matches = groupMatches;
    calName = `WC26: Group ${groupLetter}`;
  } else {
    const team = findTeamBySlug(slug);
    if (!team) {
      res.status(404).send('Team not found');
      return;
    }
    const grp = getTeamGroup(team);
    const confirmed = MATCHES.filter(m => m.home === team || m.away === team);
    const possible = KNOCKOUT_ROUNDS.flatMap(r => r.matches).filter(m => {
      if (!grp) return false;
      const d = (m.home + ' ' + m.away).toLowerCase();
      return d.includes(`group ${grp.toLowerCase()}`) || d.includes('winner') || d.includes('loser') || d.includes('best 3rd');
    }).map(m => ({
      ...m,
      home: m.home.includes('Group') ? `[If qualified] ${m.home}` : m.home,
      away: m.away.includes('Group') ? `[If qualified] ${m.away}` : m.away,
      confirmed: false,
    }));
    matches = [...confirmed, ...possible];
    calName = `WC26: ${team}`;
  }

  const icsContent = buildIcs(matches, calName);

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(icsContent);
}

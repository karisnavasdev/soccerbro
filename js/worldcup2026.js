// FIFA World Cup 2026 — full match plan (kickoffs in UTC/GMT)
const WC_FLAGS = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czechia': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turkiye': '🇹🇷',
  'Germany': '🇩🇪', 'Curacao': '🇨🇼', 'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨',
  'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
  'Spain': '🇪🇸', 'Cape Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾',
  'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
  'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
  'Portugal': '🇵🇹', 'DRC': '🇨🇩', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷',
  'Ghana': '🇬🇭', 'Panama': '🇵🇦', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴',
  'TBD': '❓'
};

const WC2026_MATCHES = [
  // Group stage — June 11
  { day: '2026-06-11', kickoff: '2026-06-11T19:00:00Z', stage: 'Group A', home: 'Mexico', away: 'South Africa', venue: 'Mexico City' },
  { day: '2026-06-11', kickoff: '2026-06-12T02:00:00Z', stage: 'Group A', home: 'South Korea', away: 'Czechia', venue: 'Guadalajara' },
  // June 12
  { day: '2026-06-12', kickoff: '2026-06-12T19:00:00Z', stage: 'Group B', home: 'Canada', away: 'Bosnia', venue: 'Toronto' },
  { day: '2026-06-12', kickoff: '2026-06-13T01:00:00Z', stage: 'Group D', home: 'USA', away: 'Paraguay', venue: 'Los Angeles' },
  // June 13
  { day: '2026-06-13', kickoff: '2026-06-13T19:00:00Z', stage: 'Group B', home: 'Qatar', away: 'Switzerland', venue: 'San Francisco' },
  { day: '2026-06-13', kickoff: '2026-06-13T22:00:00Z', stage: 'Group C', home: 'Brazil', away: 'Morocco', venue: 'New Jersey' },
  { day: '2026-06-13', kickoff: '2026-06-14T01:00:00Z', stage: 'Group C', home: 'Haiti', away: 'Scotland', venue: 'Boston' },
  { day: '2026-06-13', kickoff: '2026-06-14T04:00:00Z', stage: 'Group D', home: 'Australia', away: 'Turkiye', venue: 'Vancouver' },
  // June 14
  { day: '2026-06-14', kickoff: '2026-06-14T17:00:00Z', stage: 'Group E', home: 'Germany', away: 'Curacao', venue: 'Houston' },
  { day: '2026-06-14', kickoff: '2026-06-14T20:00:00Z', stage: 'Group F', home: 'Netherlands', away: 'Japan', venue: 'Dallas' },
  { day: '2026-06-14', kickoff: '2026-06-14T23:00:00Z', stage: 'Group E', home: 'Ivory Coast', away: 'Ecuador', venue: 'Philadelphia' },
  { day: '2026-06-14', kickoff: '2026-06-15T02:00:00Z', stage: 'Group F', home: 'Sweden', away: 'Tunisia', venue: 'Monterrey' },
  // June 15
  { day: '2026-06-15', kickoff: '2026-06-15T16:00:00Z', stage: 'Group H', home: 'Spain', away: 'Cape Verde', venue: 'Atlanta' },
  { day: '2026-06-15', kickoff: '2026-06-15T19:00:00Z', stage: 'Group G', home: 'Belgium', away: 'Egypt', venue: 'Vancouver' },
  { day: '2026-06-15', kickoff: '2026-06-15T22:00:00Z', stage: 'Group H', home: 'Saudi Arabia', away: 'Uruguay', venue: 'Miami' },
  { day: '2026-06-15', kickoff: '2026-06-16T01:00:00Z', stage: 'Group G', home: 'Iran', away: 'New Zealand', venue: 'Los Angeles' },
  // June 16
  { day: '2026-06-16', kickoff: '2026-06-16T19:00:00Z', stage: 'Group I', home: 'France', away: 'Senegal', venue: 'New Jersey' },
  { day: '2026-06-16', kickoff: '2026-06-16T22:00:00Z', stage: 'Group I', home: 'Iraq', away: 'Norway', venue: 'Boston' },
  { day: '2026-06-16', kickoff: '2026-06-17T01:00:00Z', stage: 'Group J', home: 'Argentina', away: 'Algeria', venue: 'Kansas City' },
  { day: '2026-06-16', kickoff: '2026-06-17T04:00:00Z', stage: 'Group J', home: 'Austria', away: 'Jordan', venue: 'San Francisco' },
  // June 17
  { day: '2026-06-17', kickoff: '2026-06-17T17:00:00Z', stage: 'Group K', home: 'Portugal', away: 'DRC', venue: 'Houston' },
  { day: '2026-06-17', kickoff: '2026-06-17T20:00:00Z', stage: 'Group L', home: 'England', away: 'Croatia', venue: 'Dallas' },
  { day: '2026-06-17', kickoff: '2026-06-17T23:00:00Z', stage: 'Group L', home: 'Ghana', away: 'Panama', venue: 'Toronto' },
  { day: '2026-06-17', kickoff: '2026-06-18T02:00:00Z', stage: 'Group K', home: 'Uzbekistan', away: 'Colombia', venue: 'Mexico City' },
  // June 18
  { day: '2026-06-18', kickoff: '2026-06-18T16:00:00Z', stage: 'Group A', home: 'Czechia', away: 'South Africa', venue: 'Atlanta' },
  { day: '2026-06-18', kickoff: '2026-06-18T19:00:00Z', stage: 'Group B', home: 'Switzerland', away: 'Bosnia', venue: 'Los Angeles' },
  { day: '2026-06-18', kickoff: '2026-06-18T22:00:00Z', stage: 'Group B', home: 'Canada', away: 'Qatar', venue: 'Vancouver' },
  { day: '2026-06-18', kickoff: '2026-06-19T01:00:00Z', stage: 'Group A', home: 'Mexico', away: 'South Korea', venue: 'Guadalajara' },
  // June 19
  { day: '2026-06-19', kickoff: '2026-06-19T22:00:00Z', stage: 'Group C', home: 'Scotland', away: 'Morocco', venue: 'Boston' },
  { day: '2026-06-19', kickoff: '2026-06-19T19:00:00Z', stage: 'Group D', home: 'USA', away: 'Australia', venue: 'Seattle' },
  { day: '2026-06-19', kickoff: '2026-06-20T00:30:00Z', stage: 'Group C', home: 'Brazil', away: 'Haiti', venue: 'Philadelphia' },
  { day: '2026-06-19', kickoff: '2026-06-20T03:00:00Z', stage: 'Group D', home: 'Turkiye', away: 'Paraguay', venue: 'San Francisco' },
  // June 20
  { day: '2026-06-20', kickoff: '2026-06-20T17:00:00Z', stage: 'Group F', home: 'Netherlands', away: 'Sweden', venue: 'Houston' },
  { day: '2026-06-20', kickoff: '2026-06-20T20:00:00Z', stage: 'Group E', home: 'Germany', away: 'Ivory Coast', venue: 'Toronto' },
  { day: '2026-06-20', kickoff: '2026-06-21T03:00:00Z', stage: 'Group E', home: 'Ecuador', away: 'Curacao', venue: 'Kansas City' },
  { day: '2026-06-20', kickoff: '2026-06-21T04:00:00Z', stage: 'Group F', home: 'Tunisia', away: 'Japan', venue: 'Monterrey' },
  // June 21
  { day: '2026-06-21', kickoff: '2026-06-21T16:00:00Z', stage: 'Group H', home: 'Spain', away: 'Saudi Arabia', venue: 'Atlanta' },
  { day: '2026-06-21', kickoff: '2026-06-21T19:00:00Z', stage: 'Group G', home: 'Belgium', away: 'Iran', venue: 'Los Angeles' },
  { day: '2026-06-21', kickoff: '2026-06-21T22:00:00Z', stage: 'Group H', home: 'Uruguay', away: 'Cape Verde', venue: 'Miami' },
  { day: '2026-06-21', kickoff: '2026-06-22T01:00:00Z', stage: 'Group G', home: 'New Zealand', away: 'Egypt', venue: 'Vancouver' },
  // June 22
  { day: '2026-06-22', kickoff: '2026-06-22T17:00:00Z', stage: 'Group J', home: 'Argentina', away: 'Austria', venue: 'Dallas' },
  { day: '2026-06-22', kickoff: '2026-06-22T21:00:00Z', stage: 'Group I', home: 'France', away: 'Iraq', venue: 'Philadelphia' },
  { day: '2026-06-22', kickoff: '2026-06-23T00:00:00Z', stage: 'Group I', home: 'Norway', away: 'Senegal', venue: 'New Jersey' },
  { day: '2026-06-22', kickoff: '2026-06-23T03:00:00Z', stage: 'Group J', home: 'Jordan', away: 'Algeria', venue: 'San Francisco' },
  // June 23
  { day: '2026-06-23', kickoff: '2026-06-23T17:00:00Z', stage: 'Group K', home: 'Portugal', away: 'Uzbekistan', venue: 'Houston' },
  { day: '2026-06-23', kickoff: '2026-06-23T20:00:00Z', stage: 'Group L', home: 'England', away: 'Ghana', venue: 'Boston' },
  { day: '2026-06-23', kickoff: '2026-06-23T23:00:00Z', stage: 'Group L', home: 'Panama', away: 'Croatia', venue: 'Toronto' },
  { day: '2026-06-23', kickoff: '2026-06-24T02:00:00Z', stage: 'Group K', home: 'Colombia', away: 'DRC', venue: 'Guadalajara' },
  // June 24
  { day: '2026-06-24', kickoff: '2026-06-24T19:00:00Z', stage: 'Group B', home: 'Switzerland', away: 'Canada', venue: 'Vancouver' },
  { day: '2026-06-24', kickoff: '2026-06-24T19:00:00Z', stage: 'Group B', home: 'Bosnia', away: 'Qatar', venue: 'Seattle' },
  { day: '2026-06-24', kickoff: '2026-06-24T22:00:00Z', stage: 'Group C', home: 'Scotland', away: 'Brazil', venue: 'Miami' },
  { day: '2026-06-24', kickoff: '2026-06-24T22:00:00Z', stage: 'Group C', home: 'Morocco', away: 'Haiti', venue: 'Atlanta' },
  { day: '2026-06-24', kickoff: '2026-06-25T01:00:00Z', stage: 'Group A', home: 'Czechia', away: 'Mexico', venue: 'Mexico City' },
  { day: '2026-06-24', kickoff: '2026-06-25T01:00:00Z', stage: 'Group A', home: 'South Africa', away: 'South Korea', venue: 'Monterrey' },
  // June 25
  { day: '2026-06-25', kickoff: '2026-06-25T20:00:00Z', stage: 'Group E', home: 'Ecuador', away: 'Germany', venue: 'New Jersey' },
  { day: '2026-06-25', kickoff: '2026-06-25T20:00:00Z', stage: 'Group E', home: 'Curacao', away: 'Ivory Coast', venue: 'Philadelphia' },
  { day: '2026-06-25', kickoff: '2026-06-25T23:00:00Z', stage: 'Group F', home: 'Japan', away: 'Sweden', venue: 'Dallas' },
  { day: '2026-06-25', kickoff: '2026-06-25T23:00:00Z', stage: 'Group F', home: 'Tunisia', away: 'Netherlands', venue: 'Kansas City' },
  { day: '2026-06-25', kickoff: '2026-06-26T02:00:00Z', stage: 'Group D', home: 'Turkiye', away: 'USA', venue: 'Los Angeles' },
  { day: '2026-06-25', kickoff: '2026-06-26T02:00:00Z', stage: 'Group D', home: 'Paraguay', away: 'Australia', venue: 'San Francisco' },
  // June 26
  { day: '2026-06-26', kickoff: '2026-06-26T19:00:00Z', stage: 'Group I', home: 'Norway', away: 'France', venue: 'Boston' },
  { day: '2026-06-26', kickoff: '2026-06-26T19:00:00Z', stage: 'Group I', home: 'Senegal', away: 'Iraq', venue: 'Toronto' },
  { day: '2026-06-26', kickoff: '2026-06-27T00:00:00Z', stage: 'Group H', home: 'Cape Verde', away: 'Saudi Arabia', venue: 'Houston' },
  { day: '2026-06-26', kickoff: '2026-06-27T00:00:00Z', stage: 'Group H', home: 'Uruguay', away: 'Spain', venue: 'Guadalajara' },
  { day: '2026-06-26', kickoff: '2026-06-27T03:00:00Z', stage: 'Group G', home: 'Egypt', away: 'Iran', venue: 'Seattle' },
  { day: '2026-06-26', kickoff: '2026-06-27T03:00:00Z', stage: 'Group G', home: 'New Zealand', away: 'Belgium', venue: 'Vancouver' },
  // June 27
  { day: '2026-06-27', kickoff: '2026-06-27T21:00:00Z', stage: 'Group L', home: 'Panama', away: 'England', venue: 'New Jersey' },
  { day: '2026-06-27', kickoff: '2026-06-27T21:00:00Z', stage: 'Group L', home: 'Croatia', away: 'Ghana', venue: 'Philadelphia' },
  { day: '2026-06-27', kickoff: '2026-06-27T23:30:00Z', stage: 'Group K', home: 'Colombia', away: 'Portugal', venue: 'Miami' },
  { day: '2026-06-27', kickoff: '2026-06-27T23:30:00Z', stage: 'Group K', home: 'DRC', away: 'Uzbekistan', venue: 'Atlanta' },
  { day: '2026-06-27', kickoff: '2026-06-28T02:00:00Z', stage: 'Group J', home: 'Algeria', away: 'Austria', venue: 'Kansas City' },
  { day: '2026-06-27', kickoff: '2026-06-28T02:00:00Z', stage: 'Group J', home: 'Jordan', away: 'Argentina', venue: 'Dallas' },
  // Knockout — Round of 32
  { day: '2026-06-28', kickoff: '2026-06-28T19:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Los Angeles' },
  { day: '2026-06-29', kickoff: '2026-06-29T19:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Houston' },
  { day: '2026-06-29', kickoff: '2026-06-29T20:30:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Boston' },
  { day: '2026-06-29', kickoff: '2026-06-30T01:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Monterrey' },
  { day: '2026-06-30', kickoff: '2026-06-30T17:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Dallas' },
  { day: '2026-06-30', kickoff: '2026-06-30T21:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'New Jersey' },
  { day: '2026-06-30', kickoff: '2026-07-01T01:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Mexico City' },
  { day: '2026-07-01', kickoff: '2026-07-01T16:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Atlanta' },
  { day: '2026-07-01', kickoff: '2026-07-01T20:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Seattle' },
  { day: '2026-07-01', kickoff: '2026-07-01T20:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'San Francisco' },
  { day: '2026-07-02', kickoff: '2026-07-02T19:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Los Angeles' },
  { day: '2026-07-02', kickoff: '2026-07-02T23:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Toronto' },
  { day: '2026-07-02', kickoff: '2026-07-03T03:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Vancouver' },
  { day: '2026-07-03', kickoff: '2026-07-03T18:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Dallas' },
  { day: '2026-07-03', kickoff: '2026-07-03T22:00:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Miami' },
  { day: '2026-07-03', kickoff: '2026-07-04T01:30:00Z', stage: 'Round of 32', home: 'TBD', away: 'TBD', venue: 'Kansas City' },
  // Round of 16
  { day: '2026-07-04', kickoff: '2026-07-04T17:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Houston' },
  { day: '2026-07-04', kickoff: '2026-07-04T21:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Philadelphia' },
  { day: '2026-07-05', kickoff: '2026-07-05T20:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'New Jersey' },
  { day: '2026-07-05', kickoff: '2026-07-06T00:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Mexico City' },
  { day: '2026-07-06', kickoff: '2026-07-06T19:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Dallas' },
  { day: '2026-07-06', kickoff: '2026-07-07T00:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Seattle' },
  { day: '2026-07-07', kickoff: '2026-07-07T16:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Atlanta' },
  { day: '2026-07-07', kickoff: '2026-07-07T20:00:00Z', stage: 'Round of 16', home: 'TBD', away: 'TBD', venue: 'Vancouver' },
  // Quarter-finals
  { day: '2026-07-09', kickoff: '2026-07-09T20:00:00Z', stage: 'Quarter-final', home: 'TBD', away: 'TBD', venue: 'Boston' },
  { day: '2026-07-10', kickoff: '2026-07-10T19:00:00Z', stage: 'Quarter-final', home: 'TBD', away: 'TBD', venue: 'Los Angeles' },
  { day: '2026-07-11', kickoff: '2026-07-11T20:00:00Z', stage: 'Quarter-final', home: 'TBD', away: 'TBD', venue: 'Miami' },
  { day: '2026-07-11', kickoff: '2026-07-12T01:00:00Z', stage: 'Quarter-final', home: 'TBD', away: 'TBD', venue: 'Kansas City' },
  // Semi-finals
  { day: '2026-07-14', kickoff: '2026-07-14T19:00:00Z', stage: 'Semi-final', home: 'TBD', away: 'TBD', venue: 'Dallas' },
  { day: '2026-07-15', kickoff: '2026-07-15T19:00:00Z', stage: 'Semi-final', home: 'TBD', away: 'TBD', venue: 'Atlanta' },
  // Bronze & Final
  { day: '2026-07-18', kickoff: '2026-07-18T21:00:00Z', stage: 'Bronze final', home: 'TBD', away: 'TBD', venue: 'Miami' },
  { day: '2026-07-19', kickoff: '2026-07-19T19:00:00Z', stage: 'Final', home: 'TBD', away: 'TBD', venue: 'New Jersey' }
];

function wcGetFlag(team) {
  return WC_FLAGS[team] || '⚽';
}

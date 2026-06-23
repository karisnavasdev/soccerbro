// Formation positions — normalized (x: 0=left goal … 1=right goal, y: 0=top … 1=bottom)
const FORMATIONS = {
  '442': {
    name: '4-4-2',
    roles: ['GK', 'LB', 'CB', 'CB', 'RB', 'LM', 'CM', 'CM', 'RM', 'ST', 'ST'],
    slots: [
      [0.05, 0.50],
      [0.16, 0.12], [0.16, 0.35], [0.16, 0.65], [0.16, 0.88],
      [0.34, 0.10], [0.34, 0.35], [0.34, 0.65], [0.34, 0.90],
      [0.50, 0.38], [0.50, 0.62],
    ]
  },
  '433': {
    name: '4-3-3',
    roles: ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW'],
    slots: [
      [0.05, 0.50],
      [0.16, 0.12], [0.16, 0.35], [0.16, 0.65], [0.16, 0.88],
      [0.34, 0.25], [0.34, 0.50], [0.34, 0.75],
      [0.52, 0.12], [0.54, 0.50], [0.52, 0.88],
    ]
  },
  '352': {
    name: '3-5-2',
    roles: ['GK', 'CB', 'CB', 'CB', 'LWB', 'CM', 'CM', 'CM', 'RWB', 'ST', 'ST'],
    slots: [
      [0.05, 0.50],
      [0.16, 0.22], [0.16, 0.50], [0.16, 0.78],
      [0.30, 0.08], [0.34, 0.30], [0.34, 0.50], [0.34, 0.70], [0.30, 0.92],
      [0.50, 0.38], [0.50, 0.62],
    ]
  }
};

const TEAM_NAMES = {
  home: 'BRO FC',
  away: 'RIVAL UNITED'
};

const PLAYER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function getFormation(id) {
  return FORMATIONS[id] || FORMATIONS['442'];
}

// Mirror formation for team attacking left (away team default)
function slotToField(slot, teamSide, FIELD) {
  let [nx, ny] = slot;
  if (teamSide === 'away') nx = 1 - nx;
  return {
    x: FIELD.x + nx * FIELD.w,
    y: FIELD.y + ny * FIELD.h,
    nx, ny
  };
}

function buildTeam(teamId, side, kit, captainBro, formationId, FIELD, teamMeta) {
  const form = getFormation(formationId);
  const meta = teamMeta || {};
  const teamName = meta.name || TEAM_NAMES[teamId] || teamId;
  const starBroId = meta.starBro || captainBro.id;

  const players = form.slots.map((slot, i) => {
    const pos = slotToField(slot, side, FIELD);
    const broIndex = i % BROS.length;
    let bro = Object.assign({}, BROS[broIndex], { color: kit, accent: meta.accent || BROS[broIndex].accent });
    if (i === 10) bro = Object.assign({}, captainBro, { color: kit, accent: meta.accent || captainBro.accent });
    if (meta.starBro && i === 9) {
      const star = getBro(starBroId);
      bro = Object.assign({}, star, { color: kit, accent: meta.accent || star.accent });
    }

    return {
      id: teamId + '_' + i,
      team: teamId,
      side,
      number: PLAYER_NUMBERS[i],
      role: form.roles[i],
      bro,
      x: pos.x, y: pos.y,
      homeX: pos.x, homeY: pos.y,
      homeNX: pos.nx, homeNY: pos.ny,
      vx: 0, vy: 0,
      facing: side === 'home' ? 1 : -1,
      kickAnim: 0, tackleAnim: 0, dashAnim: 0,
      stunned: 0, stamina: 100, sprinting: false,
      isHuman: false,
      isControlled: false,
      aiCooldown: Math.random() * 0.5,
    };
  });
  return {
    id: teamId, side, kit, name: teamName, flag: meta.flag || '',
    countryId: meta.countryId || null,
    players, formation: formationId, rating: meta.rating || 85
  };
}

function allPlayers(homeTeam, awayTeam) {
  return homeTeam.players.concat(awayTeam.players);
}

function getTeamPlayers(team, all) {
  return all.filter(p => p.team === team);
}

function nearestPlayerToBall(players, ball) {
  let best = null, bestD = Infinity;
  players.forEach(p => {
    const d = Math.hypot(p.x - ball.x, p.y - ball.y);
    if (d < bestD) { bestD = d; best = p; }
  });
  return best;
}

function teamOfLastTouch(lastTouchTeam) {
  return lastTouchTeam;
}

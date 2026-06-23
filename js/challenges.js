// Challenge Mode — 1v1 boss fights vs football legends
const CHALLENGES = [
  {
    id: 1, bro: 'rapinoe', title: 'RAPINBRO',
    subtitle: 'Warm-Up Round', desc: 'Beat Megan Rapinbro to start your journey.',
    goalsToWin: 2, matchTime: 60, aiBoost: 1.0, unlockAt: 0,
    reward: 'Unlocked: Challenge Mode'
  },
  {
    id: 2, bro: 'muller', title: 'MULLBRO',
    subtitle: 'The Raumdeuter', desc: 'Thomas Mullbro reads the game like no other.',
    goalsToWin: 2, matchTime: 60, aiBoost: 1.05, unlockAt: 1,
    reward: '+5 Speed boost'
  },
  {
    id: 3, bro: 'neymar', title: 'NEYBRO',
    subtitle: 'Samba Skills', desc: 'Tricks, flicks, and flair from Neybro.',
    goalsToWin: 3, matchTime: 75, aiBoost: 1.1, unlockAt: 2,
    reward: 'Brazil kit unlocked'
  },
  {
    id: 4, bro: 'marta', title: 'MARTA BRO',
    subtitle: 'Queen of Football', desc: 'The greatest female player challenges you.',
    goalsToWin: 3, matchTime: 75, aiBoost: 1.12, unlockAt: 3,
    reward: 'USA kit unlocked'
  },
  {
    id: 5, bro: 'mbappe', title: 'MBAPPBRO',
    subtitle: 'Lightning Speed', desc: 'Can you catch the fastest bro alive?',
    goalsToWin: 3, matchTime: 90, aiBoost: 1.18, unlockAt: 4,
    reward: 'France kit unlocked'
  },
  {
    id: 6, bro: 'haaland', title: 'HAALBRO',
    subtitle: 'Goal Machine', desc: 'Erling Haalbro never misses. Neither can you.',
    goalsToWin: 3, matchTime: 90, aiBoost: 1.22, unlockAt: 5,
    reward: 'Power shot upgrade'
  },
  {
    id: 7, bro: 'ronaldo', title: 'CRISTIANO RONDAL',
    subtitle: 'The GOAT Debate', desc: 'Portugal\'s superstar. Power. Precision. Pride.',
    goalsToWin: 4, matchTime: 90, aiBoost: 1.32, unlockAt: 6,
    reward: 'Portugal kit + CR7 badge'
  },
  {
    id: 8, bro: 'messi', title: 'LEO MESSY',
    subtitle: 'FINAL BOSS', desc: 'The ultimate challenge. Beat the greatest of all time.',
    goalsToWin: 5, matchTime: 120, aiBoost: 1.45, unlockAt: 7,
    reward: 'LEGEND STATUS — Argentina kit'
  }
];

function getChallenge(id) {
  return CHALLENGES.find(c => c.id === id) || CHALLENGES[0];
}

function isChallengeUnlocked(challenge, completedIds) {
  if (challenge.unlockAt === 0) return true;
  const prev = CHALLENGES.find(c => c.id === challenge.unlockAt);
  if (!prev) return true;
  return completedIds.includes(prev.id);
}

function getNextChallenge(completedIds) {
  return CHALLENGES.find(c => !completedIds.includes(c.id) && isChallengeUnlocked(c, completedIds));
}

function drawChallengeBoss(ctx, bro, x, y) {
  drawBro(ctx, bro, x, y, 1.5, -1, 'idle');
}

const BROS = [
  {
    id: 'messi', name: 'Leo Messy',
    color: '#75aadb', accent: '#fff', hair: '#3d2314', skin: '#f5cba7',
    speed: 5.2, power: 7, tackle: 5, agility: 9, unlockAt: 0,
    desc: 'Dribbling wizard. Fast feet!',
    hairStyle: 'messi'
  },
  {
    id: 'ronaldo', name: 'Cristiano Rondal',
    color: '#c8102e', accent: '#fff', hair: '#1a1a1a', skin: '#f5cba7',
    speed: 6, power: 9, tackle: 6, agility: 7, unlockAt: 0,
    desc: 'Powerhouse striker. Rocket shots!',
    hairStyle: 'ronaldo'
  },
  {
    id: 'rapinoe', name: 'Megan Rapinbro',
    color: '#002868', accent: '#bf0a30', hair: '#d4a574', skin: '#f5cba7',
    speed: 5.5, power: 7, tackle: 7, agility: 8, unlockAt: 0,
    desc: 'Balanced all-rounder.',
    hairStyle: 'rapinoe'
  },
  {
    id: 'muller', name: 'Thomas Mullbro',
    color: '#dc052d', accent: '#fff', hair: '#8b6914', skin: '#f5cba7',
    speed: 4.8, power: 6, tackle: 8, agility: 6, unlockAt: 2,
    desc: 'Great at interceptions.',
    hairStyle: 'muller'
  },
  {
    id: 'neymar', name: 'Neybro',
    color: '#009c3b', accent: '#ffdf00', hair: '#1a1a1a', skin: '#f5cba7',
    speed: 6.5, power: 6, tackle: 4, agility: 10, unlockAt: 4,
    desc: 'Trickster. Hard to catch!',
    hairStyle: 'neymar'
  },
  {
    id: 'mbappe', name: 'Kylian Mbappbro',
    color: '#0055a4', accent: '#ef4135', hair: '#1a1a1a', skin: '#f5cba7',
    speed: 8, power: 7, tackle: 5, agility: 9, unlockAt: 6,
    desc: 'Lightning fast sprinter.',
    hairStyle: 'mbappe'
  },
  {
    id: 'haaland', name: 'Erling Haalbro',
    color: '#6cabdd', accent: '#fff', hair: '#d4a020', skin: '#f5cba7',
    speed: 5, power: 10, tackle: 7, agility: 5, unlockAt: 8,
    desc: 'Goal machine. Max power!',
    hairStyle: 'haaland'
  },
  {
    id: 'marta', name: 'Marta Bro',
    color: '#009c3b', accent: '#ffdf00', hair: '#1a1a1a', skin: '#f5cba7',
    speed: 6, power: 8, tackle: 6, agility: 8, unlockAt: 10,
    desc: 'Queen of the pitch.',
    hairStyle: 'marta'
  }
];

function getBro(id) {
  return BROS.find(b => b.id === id) || BROS[0];
}

function buildPalette(bro) {
  return {
    '.': null,
    's': bro.skin,
    'h': bro.hair,
    'k': bro.color,
    'a': bro.accent,
    'b': '#111',
    'w': '#fff',
    'e': '#222',
    'r': '#c0392b',
    'g': '#4ecdc4',
  };
}

// 16-wide pixel sprite rows (Soccer Bros big-head style)
function getBroSprite(bro, anim) {
  const hs = bro.hairStyle;
  const kick = anim === 'kick';
  const dash = anim === 'dash';

  const baseHead = [
    '....hhhhhhhh....',
    '...hhhhhhhhhh...',
    '..hhhhhhhhhhhh..',
    '.hhhhhhhhhhhhhh.',
    '.hhhhhhhhhhhhhh.',
    'hhsssssssssssshh',
    'hsswwwwsswwwwssh',
    'hssweewssweewssh',
    'hsswwwwsswwwwssh',
    'hssssssrrssssssh',
    'hssssssssssssssh',
    '.hssssssssssssh.',
    '..hssssssssssh..',
  ];

  const hairOverrides = {
    messi: [[0,'h'],[1,'h'],[2,'h'],[3,'h'],[4,'h'],[5,'h']],
    ronaldo: [[0,'h'],[1,'h'],[2,'h'],[3,'h'],[4,'h'],[5,'h'],[6,'h'],[7,'h']],
    rapinoe: [[0,'.'],[1,'h'],[2,'hh'],[3,'hhh'],[4,'hhh'],[5,'hh'],[6,'h']],
    muller: [[0,'h'],[1,'hh'],[2,'hhh'],[3,'hhh'],[4,'hh'],[5,'h']],
    neymar: [[0,'.'],[1,'h'],[2,'hh'],[3,'hhh'],[4,'hhh'],[5,'hh'],[6,'h'],[7,'h']],
    mbappe: [[0,'h'],[1,'h'],[2,'h'],[3,'h'],[4,'h'],[5,'h']],
    haaland: [[0,'h'],[1,'hh'],[2,'hhh'],[3,'hhh'],[4,'hhh'],[5,'hh'],[6,'h']],
    marta: [[0,'.'],[1,'h'],[2,'hh'],[3,'hhh'],[4,'hhh'],[5,'hh'],[6,'h'],[7,'h'],[8,'h']],
  };

  const body = kick ? [
    '...kkkkkkkkkk...',
    '..kkkkkaaaakkkk..',
    '.kkkkkaaaakkkkk.',
    'kkkkkaaaakkkkkk',
    'kkkkkaaaakkkkkk',
    'aakkkkkkkkkkaa',
    'aakkkkkkkkkkaa',
    'kkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkk',
    'aakk....kkaa',
    'aakk....kkaa',
    'bbk.....kbb',
    'bbk.....kbb',
    'bb......bb',
    'bb......bb',
  ] : dash ? [
    '...kkkkkkkkkk...',
    '..kkkkkaaaakkkk..',
    '.kkkkkaaaakkkkk.',
    'kkkkkaaaakkkkkk',
    'kkkkkaaaakkkkkk',
    'aakkkkkkkkkkaa',
    'aakkkkkkkkkkaa',
    'kkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkk',
    'aakk....kkaa',
    'aakk....kkaa',
    'bbk.....kbb',
    'bbk.....kbb',
    'bb.......bb',
    'bb........bb',
  ] : [
    '...kkkkkkkkkk...',
    '..kkkkkaaaakkkk..',
    '.kkkkkaaaakkkkk.',
    'kkkkkaaaakkkkkk',
    'kkkkkaaaakkkkkk',
    'aakkkkkkkkkkaa',
    'aakkkkkkkkkkaa',
    'kkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkk',
    'aakk....kkaa',
    'aakk....kkaa',
    'bbk.....kbb',
    'bbk.....kbb',
    'bb......bb',
    'bb......bb',
  ];

  const sprite = baseHead.map(r => r.split(''));
  const overrides = hairOverrides[hs] || hairOverrides.messi;
  // Apply hair style by ensuring top rows are hair
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 16; c++) {
      if (sprite[r][c] === 'h' || (r < 5 && c >= 3 && c <= 12)) {
        if (r <= 5) sprite[r][c] = 'h';
      }
    }
  }

  return sprite.concat(body.map(r => r.split('')));
}

function drawBro(ctx, bro, x, y, scale, facing, anim) {
  const sprite = getBroSprite(bro, anim);
  const palette = buildPalette(bro);
  drawPixelSprite(ctx, sprite, palette, x, y, scale || 1.3, facing || 1);
}

function drawBroMini(ctx, bro, x, y, scale, facing) {
  drawBro(ctx, bro, x, y, scale || 1, facing || 1, 'idle');
}

function statBar(val, max) {
  const filled = Math.round((val / max) * 5);
  return '\u2588'.repeat(filled) + '\u2591'.repeat(5 - filled);
}

function drawPixelBall(ctx, x, y, z) {
  enablePixel(ctx);
  const by = y - (z || 0) * 0.5;
  const r = 4;

  // Shadow
  drawPixelEllipse(ctx, x, y, r * 2, r, 'rgba(0,0,0,0.35)');

  // Ball body - pixel soccer ball
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const checker = (dx + dy) % 2 === 0;
        drawPx(ctx, x + dx * PX - PX / 2, by + dy * PX - PX / 2, PX, PX, checker ? '#fff' : '#222');
      }
    }
  }
  drawPx(ctx, x - PX / 2, by - PX / 2, PX, PX, '#222');
}

function drawPixelField(ctx, W, H, FIELD, LEFT_GOAL_X, RIGHT_GOAL_X, GOAL_Y, GOAL_W, GOAL_H) {
  enablePixel(ctx);

  // Sky/stadium bg
  drawPixelRect(ctx, 0, 0, W, FIELD.y, '#1a3a5c');
  for (let i = 0; i < W; i += 24) {
    drawPixelRect(ctx, i, 0, 12, FIELD.y, '#1e4060');
  }
  // Crowd pixels
  for (let i = 0; i < 80; i++) {
    const cx = (i * 47 + 13) % W;
    const cy = 10 + (i * 7) % (FIELD.y - 20);
    const col = ['#e63946', '#4ecdc4', '#ffd700', '#fff', '#888'][i % 5];
    drawPx(ctx, cx, cy, PX, PX, col);
  }

  // Grass
  drawPixelRect(ctx, 0, FIELD.y, W, H - FIELD.y, '#2d6a1e');
  for (let row = FIELD.y; row < H; row += 16) {
    drawPixelRect(ctx, FIELD.x, row, FIELD.w, 8, row % 32 === 0 ? '#347a1a' : '#2d6a1e');
  }

  // Field border
  drawPixelRect(ctx, FIELD.x - 3, FIELD.y - 3, FIELD.w + 6, 3, '#fff');
  drawPixelRect(ctx, FIELD.x - 3, FIELD.y + FIELD.h, FIELD.w + 6, 3, '#fff');
  drawPixelRect(ctx, FIELD.x - 3, FIELD.y, 3, FIELD.h, '#fff');
  drawPixelRect(ctx, FIELD.x + FIELD.w, FIELD.y, 3, FIELD.h, '#fff');

  // Center line
  for (let row = FIELD.y; row < FIELD.y + FIELD.h; row += PX) {
    drawPx(ctx, FIELD.x + FIELD.w / 2 - PX / 2, row, PX, PX, '#fff');
  }

  // Center circle (pixel)
  const ccx = FIELD.x + FIELD.w / 2;
  const ccy = FIELD.y + FIELD.h / 2;
  for (let dy = -60; dy <= 60; dy += PX) {
    for (let dx = -60; dx <= 60; dx += PX) {
      const d = Math.hypot(dx, dy);
      if (d > 54 && d < 60) drawPx(ctx, ccx + dx, ccy + dy, PX, PX, '#fff');
    }
  }
  drawPixelCircle(ctx, ccx, ccy, 3, '#fff');

  // Penalty boxes
  const paW = 120, paH = FIELD.h * 0.6, paY = FIELD.y + FIELD.h * 0.2;
  drawPixelRect(ctx, FIELD.x, paY, paW, 3, '#fff');
  drawPixelRect(ctx, FIELD.x, paY + paH, paW, 3, '#fff');
  drawPixelRect(ctx, FIELD.x + paW - 3, paY, 3, paH, '#fff');
  drawPixelRect(ctx, FIELD.x + FIELD.w - paW, paY, paW, 3, '#fff');
  drawPixelRect(ctx, FIELD.x + FIELD.w - paW, paY + paH, paW, 3, '#fff');
  drawPixelRect(ctx, FIELD.x + FIELD.w - paW, paY, 3, paH, '#fff');

  // Goals
  drawPixelRect(ctx, LEFT_GOAL_X, GOAL_Y, GOAL_W, GOAL_H, 'rgba(255,255,255,0.12)');
  drawPixelRect(ctx, RIGHT_GOAL_X, GOAL_Y, GOAL_W, GOAL_H, 'rgba(255,255,255,0.12)');
  drawPixelRect(ctx, LEFT_GOAL_X, GOAL_Y, GOAL_W, 4, '#fff');
  drawPixelRect(ctx, LEFT_GOAL_X, GOAL_Y + GOAL_H - 4, GOAL_W, 4, '#fff');
  drawPixelRect(ctx, LEFT_GOAL_X, GOAL_Y, 4, GOAL_H, '#fff');
  drawPixelRect(ctx, RIGHT_GOAL_X + GOAL_W - 4, GOAL_Y, 4, GOAL_H, '#fff');
  drawPixelRect(ctx, RIGHT_GOAL_X, GOAL_Y, GOAL_W, 4, '#fff');
  drawPixelRect(ctx, RIGHT_GOAL_X, GOAL_Y + GOAL_H - 4, GOAL_W, 4, '#fff');

  // Net
  for (let i = 0; i < GOAL_H; i += 10) {
    for (let j = 0; j < GOAL_W; j += 6) {
      drawPx(ctx, LEFT_GOAL_X + j, GOAL_Y + i, 2, 2, 'rgba(255,255,255,0.25)');
      drawPx(ctx, RIGHT_GOAL_X + j, GOAL_Y + i, 2, 2, 'rgba(255,255,255,0.25)');
    }
  }
}

function drawPixelGoalkeeper(ctx, gk, goalY, goalH) {
  enablePixel(ctx);
  const x = gk.x;
  const handX = gk.side === 'left' ? x + 12 : x - 12;
  drawPixelRect(ctx, x - 3, goalY, 6, goalH, '#ffd700');
  drawPixelRect(ctx, x - 4, goalY, 2, goalH, '#cc9900');
  const gy1 = gk.handY - 28;
  const gy2 = gk.handY + 22;
  [gy1, gy2].forEach(gy => {
    drawPixelRect(ctx, handX - 12, gy, 24, 8, '#4ecdc4');
    drawPixelRect(ctx, handX - 10, gy + 2, 20, 4, '#3ab8ad');
    drawPixelRect(ctx, handX - 8, gy + 1, 6, 6, '#f5cba7');
    drawPixelRect(ctx, handX + 2, gy + 1, 6, 6, '#f5cba7');
  });
}

// Small pixel player for 11v11 field
function drawFieldPlayer(ctx, pl, isControlled) {
  const anim = pl.kickAnim > 0 ? 'kick' : pl.dashAnim > 0 ? 'dash' : 'idle';
  drawBro(ctx, pl.bro, pl.x, pl.y, 0.42, pl.facing, anim);

  enablePixel(ctx);
  const badgeY = pl.y + 10;
  const bw = pl.number > 9 ? 14 : 10;
  drawPixelRect(ctx, pl.x - bw / 2 - 1, badgeY - 1, bw + 2, 10, isControlled ? '#ffd700' : '#111');
  drawPixelRect(ctx, pl.x - bw / 2, badgeY, bw, 8, isControlled ? '#ffd700' : 'rgba(0,0,0,0.75)');

  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = isControlled ? '#111' : '#fff';
  ctx.fillText(String(pl.number), pl.x, badgeY + 7);

  if (isControlled) {
    drawPixelRect(ctx, pl.x - 6, pl.y - 22, 12, 4, '#ffd700');
    drawPx(ctx, pl.x - 2, pl.y - 26, 4, 4, '#ffd700');
  }
}

function drawMiniMap(ctx, FIELD, homeTeam, awayTeam, ball, controlled) {
  const mx = FIELD.x + FIELD.w - 72;
  const my = FIELD.y + 8;
  const mw = 64, mh = 42;
  enablePixel(ctx);
  drawPixelRect(ctx, mx, my, mw, mh, 'rgba(0,0,0,0.55)');
  drawPixelRect(ctx, mx, my, mw, 2, '#fff');
  drawPixelRect(ctx, mx, my + mh - 2, mw, 2, '#fff');
  drawPixelRect(ctx, mx, my, 2, mh, '#fff');
  drawPixelRect(ctx, mx + mw - 2, my, 2, mh, '#fff');
  drawPx(ctx, mx + mw / 2, my + 4, 2, mh - 8, 'rgba(255,255,255,0.3)');

  const dot = (p, col) => {
    const px = mx + ((p.x - FIELD.x) / FIELD.w) * mw;
    const py = my + ((p.y - FIELD.y) / FIELD.h) * mh;
    drawPx(ctx, px - 2, py - 2, p === controlled ? 5 : 3, p === controlled ? 5 : 3, col);
  };
  homeTeam.players.forEach(p => dot(p, '#4ecdc4'));
  awayTeam.players.forEach(p => dot(p, '#e63946'));
  drawPx(ctx, mx + ((ball.x - FIELD.x) / FIELD.w) * mw - 2, my + ((ball.y - FIELD.y) / FIELD.h) * mh - 2, 4, 4, '#fff');
}

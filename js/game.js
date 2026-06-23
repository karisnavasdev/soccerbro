// Soccer Bros - 11v11 Match Engine
(function () {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = 960, H = 540;
  canvas.width = W;
  canvas.height = H;
  enablePixel(ctx);

  const FIELD = { x: 30, y: 50, w: W - 60, h: H - 100 };
  const GOAL_W = 12, GOAL_H = 90, GOAL_Y = FIELD.y + (FIELD.h - GOAL_H) / 2;
  const LEFT_GOAL_X = FIELD.x - GOAL_W;
  const RIGHT_GOAL_X = FIELD.x + FIELD.w;
  const BALL_R = 5;
  const PLAYER_R = 10;
  const MATCH_TIME = 180;
  const PLAYERS_PER_TEAM = 11;

  const SAVE_KEY = 'soccerbros_save';
  let saveData = loadSave();

  function loadSave() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY)) || {
        wins: 0, unlocked: ['messi', 'ronaldo', 'rapinoe'],
        challengesCompleted: [],
        settings: { speed: 1.8, sound: true, formation: '442' }
      };
      if (!data.challengesCompleted) data.challengesCompleted = [];
      return data;
    } catch {
      return { wins: 0, unlocked: ['messi', 'ronaldo', 'rapinoe'], challengesCompleted: [], settings: { speed: 1.8, sound: true, formation: '442' } };
    }
  }
  function persistSave() { localStorage.setItem(SAVE_KEY, JSON.stringify(saveData)); }

  let SPEED_MULT = saveData.settings?.speed || 1.8;
  let formationId = saveData.settings?.formation || '442';

  let state = 'menu';
  let matchType = '11v11'; // '11v11' | 'arcade' | 'challenge' | 'country'
  let gameMode = 'single';
  let selectedP1 = 'messi';
  let kitP1 = '#75aadb', kitP2 = '#c8102e';
  let selectedHomeCountry = 'arg';
  let selectedAwayCountry = 'bra';
  let activeChallenge = null;
  let challengeGoalsToWin = 3;
  let challengeAiBoost = 1;

  let homeTeam, awayTeam, players;
  let controlledHome = null, controlledAway = null;
  let ball;
  let score = { home: 0, away: 0 };
  let timer = MATCH_TIME;
  let lastTime = 0;
  let keys = {};
  let messageTimer = 0;
  let paused = false;
  let kickCooldown = { home: 0, away: 0 };
  let tackleCooldown = { home: 0, away: 0 };
  let dashCooldown = { home: 0, away: 0 };
  let passCooldown = { home: 0, away: 0 };
  let pendingUnlock = null;
  let ballLastTouch = null;
  let autoSwitch = true;

  let kickCharge = 0, kickHeld = false;

  // Arcade/challenge uses bigger hitboxes & sprites
  let activePlayerR = PLAYER_R;
  let activeBallR = BALL_R;
  let arcadeGkLeft = null, arcadeGkRight = null;

  // Arcade 1v1 fallback
  let p1, p2, p1Bro, p2Bro;

  const screens = { hud: document.getElementById('hud'), overlay: document.getElementById('overlay') };

  AudioFX.init();
  AudioFX.setEnabled(saveData.settings?.sound !== false);

  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Escape' && state === 'playing') togglePause();
    if (e.code === 'KeyQ' && state === 'playing' && matchType === '11v11') switchPlayer('home');
    if (e.code === 'KeyO' && state === 'playing' && matchType === '11v11' && gameMode === 'local') switchPlayer('away');
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', e => { keys[e.code] = false; });

  document.querySelectorAll('#mainMenu .btn[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioFX.play('menu');
      const mode = btn.dataset.mode;
      if (mode === 'settings') { showSettings(); return; }
      if (mode === 'challenge') { showChallengeSelect(); return; }
      if (mode === 'country') { matchType = 'country'; gameMode = 'single'; showCountrySelect(); return; }
      if (mode === 'arcade') { matchType = 'arcade'; gameMode = 'single'; activeChallenge = null; showCharSelect(); return; }
      matchType = '11v11';
      activeChallenge = null;
      gameMode = mode === 'chars' ? 'single' : mode;
      if (mode === 'practice') gameMode = 'practice';
      showCharSelect();
    });
  });

  document.getElementById('countryContinueBtn').addEventListener('click', () => {
    AudioFX.play('menu');
    const home = getCountry(selectedHomeCountry);
    kitP1 = home.kit;
    selectedP1 = home.star;
    showCharSelect();
  });
  document.getElementById('countryBackBtn').addEventListener('click', () => { AudioFX.play('menu'); showMainMenu(); });
  document.getElementById('challengeBackBtn').addEventListener('click', () => { AudioFX.play('menu'); showMainMenu(); });

  document.getElementById('startMatchBtn').addEventListener('click', () => { AudioFX.play('menu'); startMatch(); });
  document.getElementById('backToMenuBtn').addEventListener('click', () => { AudioFX.play('menu'); showMainMenu(); });
  document.getElementById('resumeBtn').addEventListener('click', () => { paused = false; hideScreen('pauseMenu'); state = 'playing'; lastTime = performance.now(); });
  document.getElementById('quitBtn').addEventListener('click', showMainMenu);
  document.getElementById('unlockOkBtn').addEventListener('click', () => {
    hideScreen('unlockScreen');
    if (saveData.challengesCompleted?.length > 0 && !activeChallenge) showChallengeSelect();
    else showMainMenu();
  });
  document.getElementById('settingsBackBtn').addEventListener('click', () => { AudioFX.play('menu'); showMainMenu(); });
  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    if (confirm('Reset all wins, challenges and unlocks?')) {
      saveData.wins = 0;
      saveData.unlocked = ['messi', 'ronaldo', 'rapinoe'];
      saveData.challengesCompleted = [];
      persistSave(); updateMenuStats();
    }
  });
  document.getElementById('soundToggle').addEventListener('change', e => {
    saveData.settings = saveData.settings || {};
    saveData.settings.sound = e.target.checked;
    AudioFX.setEnabled(e.target.checked); persistSave();
  });
  document.getElementById('speedSelect').addEventListener('change', e => {
    SPEED_MULT = parseFloat(e.target.value);
    saveData.settings.speed = SPEED_MULT; persistSave();
  });
  document.getElementById('formationSelect')?.addEventListener('change', e => {
    formationId = e.target.value;
    saveData.settings.formation = formationId; persistSave();
  });
  document.getElementById('autoSwitchToggle')?.addEventListener('change', e => {
    autoSwitch = e.target.checked;
  });
  document.getElementById('kitP1').addEventListener('input', e => { kitP1 = e.target.value; updateCharPreviews(); });

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
  }
  function hideScreen(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); el.classList.add('hidden'); }
  }

  function showMainMenu() {
    state = 'menu'; paused = false;
    activeChallenge = null;
    screens.hud.classList.add('hidden');
    screens.overlay.classList.add('hidden');
    hideScreen('pauseMenu'); hideScreen('unlockScreen');
    hideScreen('countrySelect'); hideScreen('challengeSelect');
    document.getElementById('challengeHud')?.classList.add('hidden');
    showScreen('mainMenu'); updateMenuStats(); Effects.clear(); menuLoop();
  }

  function showSettings() {
    state = 'settings';
    document.getElementById('soundToggle').checked = saveData.settings?.sound !== false;
    document.getElementById('speedSelect').value = String(SPEED_MULT);
    const fs = document.getElementById('formationSelect');
    if (fs) fs.value = formationId;
    showScreen('settingsScreen');
  }

  function updateMenuStats() {
    document.getElementById('totalWins').textContent = saveData.wins;
    const cp = document.getElementById('challengeProgress');
    if (cp) cp.textContent = (saveData.challengesCompleted || []).length;
  }

  function showCountrySelect() {
    state = 'countrySelect';
    if (!selectedHomeCountry) selectedHomeCountry = 'arg';
    if (!selectedAwayCountry || selectedAwayCountry === selectedHomeCountry) {
      selectedAwayCountry = getRandomCountry(selectedHomeCountry).id;
    }
    buildCountryGrids();
    showScreen('countrySelect');
  }

  function buildCountryGrids() {
    updateCountryPreview('home', selectedHomeCountry);
    updateCountryPreview('away', selectedAwayCountry);

    const homeGrid = document.getElementById('homeCountryGrid');
    const awayGrid = document.getElementById('awayCountryGrid');
    homeGrid.innerHTML = '';
    awayGrid.innerHTML = '';

    COUNTRIES.forEach(c => {
      drawCountryCard(homeGrid, c, c.id === selectedHomeCountry, () => {
        AudioFX.play('menu');
        selectedHomeCountry = c.id;
        kitP1 = c.kit;
        selectedP1 = c.star;
        if (selectedAwayCountry === c.id) selectedAwayCountry = getRandomCountry(c.id).id;
        buildCountryGrids();
      });
      drawCountryCard(awayGrid, c, c.id === selectedAwayCountry, () => {
        AudioFX.play('menu');
        if (c.id === selectedHomeCountry) return;
        selectedAwayCountry = c.id;
        kitP2 = c.kit;
        buildCountryGrids();
      });
    });
  }

  function updateCountryPreview(side, countryId) {
    const c = getCountry(countryId);
    const el = document.getElementById(side + 'CountryPreview');
    el.innerHTML =
      `<span class="big-flag">${c.flag}</span>` +
      `<span class="preview-name">${c.name}</span>` +
      `<span class="preview-rating">RATING ${c.rating} · ${c.desc}</span>`;
    if (side === 'home') { kitP1 = c.kit; selectedP1 = c.star; }
    else kitP2 = c.kit;
  }

  function showChallengeSelect() {
    state = 'challengeSelect';
    buildChallengeList();
    showScreen('challengeSelect');
  }

  function buildChallengeList() {
    const list = document.getElementById('challengeList');
    list.innerHTML = '';
    const completed = saveData.challengesCompleted || [];

    CHALLENGES.forEach(ch => {
      const locked = !isChallengeUnlocked(ch, completed);
      const done = completed.includes(ch.id);
      const card = document.createElement('div');
      card.className = 'challenge-card' +
        (locked ? ' locked' : '') +
        (done ? ' completed' : '') +
        (ch.id >= 7 ? ' boss' : '');

      const mini = document.createElement('canvas');
      mini.width = 48; mini.height = 56;
      const bro = getBro(ch.bro);
      drawBroMini(mini.getContext('2d'), bro, 24, 36, 0.85, -1);

      const info = document.createElement('div');
      info.className = 'challenge-info';
      info.innerHTML =
        `<h4>${ch.title}</h4>` +
        `<div class="challenge-sub">${ch.subtitle}</div>` +
        `<p>${ch.desc}</p>` +
        `<p style="color:#666;margin-top:4px">First to ${ch.goalsToWin} · ${ch.matchTime}s · ${ch.reward}</p>`;

      const badge = document.createElement('div');
      badge.className = 'challenge-badge ' + (done ? 'win' : locked ? 'lock' : '');
      badge.textContent = done ? '✓' : locked ? '🔒' : '▶';

      card.appendChild(mini);
      card.appendChild(info);
      card.appendChild(badge);

      if (!locked) {
        card.addEventListener('click', () => startChallenge(ch));
      } else if (done) {
        card.addEventListener('click', () => startChallenge(ch));
      }
      list.appendChild(card);
    });
  }

  function startChallenge(ch) {
    AudioFX.play('menu');
    activeChallenge = ch;
    matchType = 'challenge';
    gameMode = 'single';
    challengeGoalsToWin = ch.goalsToWin;
    challengeAiBoost = ch.aiBoost;
    selectedP1 = saveData.unlocked[0] || 'messi';
    kitP1 = getBro(selectedP1).color;
    kitP2 = getBro(ch.bro).color;
    state = 'charSelect';

    document.getElementById('charSelectHint').textContent =
      'Beat ' + ch.title + ' — first to ' + ch.goalsToWin + ' goals in ' + ch.matchTime + 's!';
    document.getElementById('kitPickerWrap').style.display = 'none';
    document.getElementById('charSelectTitle').textContent = 'VS ' + ch.title;
    buildCharGrid();
    updateCharPreviews();
    showScreen('charSelect');
  }

  function showCharSelect() {
    state = 'charSelect';
    selectedP1 = saveData.unlocked.includes(selectedP1) ? selectedP1 : saveData.unlocked[0];
    if (matchType === 'country') {
      document.getElementById('charSelectTitle').textContent = 'PICK CAPTAIN FOR ' + getCountry(selectedHomeCountry).flag + ' ' + getCountry(selectedHomeCountry).name.toUpperCase();
      document.getElementById('charSelectHint').textContent =
        getCountry(selectedHomeCountry).flag + ' vs ' + getCountry(selectedAwayCountry).flag + ' · 11v11 Country Cup';
      document.getElementById('kitPickerWrap').style.display = 'none';
    } else if (matchType === 'challenge') {
      document.getElementById('kitPickerWrap').style.display = 'none';
    } else {
      document.getElementById('charSelectTitle').textContent = matchType === '11v11' ? 'PICK CAPTAIN (ST #11)' : 'PICK YOUR BRO';
      document.getElementById('charSelectHint').textContent = '11 players per team · 4-4-2 formation · AI teammates';
      document.getElementById('kitPickerWrap').style.display = 'block';
    }
    document.getElementById('p2Pick').style.display = matchType === 'arcade' && gameMode === 'local' ? 'block' : 'none';
    buildCharGrid(); updateCharPreviews(); showScreen('charSelect');
  }

  function buildCharGrid() {
    const grid = document.getElementById('charGrid');
    grid.innerHTML = '';
    BROS.forEach(bro => {
      const locked = !saveData.unlocked.includes(bro.id);
      const card = document.createElement('div');
      card.className = 'char-card' + (locked ? ' locked' : '');
      if (bro.id === selectedP1) card.classList.add('selected-p1');
      const mini = document.createElement('canvas');
      mini.width = 48; mini.height = 56;
      drawBroMini(mini.getContext('2d'), bro, 24, 36, 0.85, 1);
      const name = document.createElement('div');
      name.textContent = locked ? 'LOCK ' + bro.unlockAt + 'W' : bro.name.split(' ')[0];
      card.appendChild(mini); card.appendChild(name);
      if (!locked) card.addEventListener('click', () => {
        AudioFX.play('menu'); selectedP1 = bro.id; buildCharGrid(); updateCharPreviews();
      });
      grid.appendChild(card);
    });
  }

  function updateCharPreviews() {
    const b1 = applyKit(getBro(selectedP1), kitP1);
    renderPreview('p1Preview', b1);
    renderStats('p1Stats', getBro(selectedP1));
  }

  function renderPreview(id, bro) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    const c = document.createElement('canvas');
    c.width = 80; c.height = 96;
    drawBro(c.getContext('2d'), bro, 40, 58, 1.1, 1);
    el.appendChild(c);
  }

  function renderStats(id, bro) {
    document.getElementById(id).innerHTML =
      `SPD ${statBar(bro.speed, 8)}\nPWR ${statBar(bro.power, 10)}\nTCK ${statBar(bro.tackle, 8)}\nAGI ${statBar(bro.agility, 10)}`;
  }

  function applyKit(bro, kit) { return Object.assign({}, bro, { color: kit }); }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

  // ── 11v11 Setup ──
  function initTeams() {
    const captain = applyKit(getBro(selectedP1), kitP1);
    let homeMeta, awayMeta;

    if (matchType === 'country') {
      const hc = getCountry(selectedHomeCountry);
      const ac = getCountry(selectedAwayCountry);
      homeMeta = { name: hc.flag + ' ' + hc.name, flag: hc.flag, countryId: hc.id, accent: hc.accent, starBro: hc.star, rating: hc.rating };
      awayMeta = { name: ac.flag + ' ' + ac.name, flag: ac.flag, countryId: ac.id, accent: ac.accent, starBro: ac.star, rating: ac.rating };
      kitP1 = hc.kit; kitP2 = ac.kit;
    } else {
      homeMeta = { name: 'BRO FC', flag: '', rating: 85 };
      awayMeta = { name: 'RIVAL UNITED', flag: '', rating: 85 };
    }

    homeTeam = buildTeam('home', 'home', kitP1, captain, formationId, FIELD, homeMeta);
    awayTeam = buildTeam('away', 'away', kitP2, getBro(awayMeta.starBro || 'ronaldo'), formationId, FIELD, awayMeta);

    if (matchType !== 'country') {
      awayTeam.players.forEach((p, i) => {
        p.bro = Object.assign({}, BROS[i % BROS.length], { color: kitP2 });
      });
    }

    players = allPlayers(homeTeam, awayTeam);

    controlledHome = homeTeam.players[10];
    controlledHome.isHuman = true;
    controlledHome.isControlled = true;
    controlledHome.bro = captain;

    if (gameMode === 'local') {
      controlledAway = awayTeam.players[10];
      controlledAway.isHuman = true;
      controlledAway.isControlled = true;
    }
  }

  function switchPlayer(teamId) {
    const team = teamId === 'home' ? homeTeam : awayTeam;
    const controlled = teamId === 'home' ? controlledHome : controlledAway;
    if (!team) return;

    let best = null, bestD = Infinity;
    team.players.forEach(p => {
      if (p.role === 'GK') return;
      const d = dist(p.x, p.y, ball.x, ball.y);
      if (d < bestD) { bestD = d; best = p; }
    });

    if (best && best !== controlled) {
      if (controlled) { controlled.isControlled = false; controlled.isHuman = teamId === 'home' || gameMode === 'local'; }
      if (teamId === 'home') { controlledHome = best; controlledHome.isControlled = true; controlledHome.isHuman = true; }
      else { controlledAway = best; controlledAway.isControlled = true; controlledAway.isHuman = true; }
      showMessage('#' + best.number + ' ' + best.role, 1);
      AudioFX.play('menu');
    }
  }

  function autoSwitchPlayers() {
    if (!autoSwitch || matchType !== '11v11') return;
    ['home', 'away'].forEach(tid => {
      if (tid === 'away' && gameMode !== 'local') return;
      const team = tid === 'home' ? homeTeam : awayTeam;
      const cur = tid === 'home' ? controlledHome : controlledAway;
      const nearest = nearestPlayerToBall(team.players.filter(p => p.role !== 'GK'), ball);
      if (nearest && cur && dist(nearest.x, nearest.y, ball.x, ball.y) < dist(cur.x, cur.y, ball.x, ball.y) - 25) {
        if (cur) { cur.isControlled = false; }
        nearest.isControlled = true;
        nearest.isHuman = true;
        if (tid === 'home') controlledHome = nearest;
        else controlledAway = nearest;
      }
    });
  }

  function reset11v11(kickoffTeam) {
    activePlayerR = PLAYER_R;
    activeBallR = BALL_R;
    arcadeGkLeft = arcadeGkRight = null;
    ball = { x: FIELD.x + FIELD.w / 2, y: FIELD.y + FIELD.h / 2, vx: 0, vy: 0, z: 0, vz: 0 };
    ballLastTouch = null;
    initTeams();
    players = allPlayers(homeTeam, awayTeam);

    homeTeam.players.forEach((p, i) => {
      const pos = slotToField(getFormation(formationId).slots[i], 'home', FIELD);
      p.x = pos.x; p.y = pos.y;
      p.vx = p.vy = 0; p.stamina = 100; p.stunned = 0;
    });
    awayTeam.players.forEach((p, i) => {
      const pos = slotToField(getFormation(formationId).slots[i], 'away', FIELD);
      p.x = pos.x; p.y = pos.y;
      p.vx = p.vy = 0; p.stamina = 100; p.stunned = 0;
    });

    if (kickoffTeam === 'away') {
      const st = awayTeam.players[9];
      ball.x = st.x + 12; ball.y = st.y;
    } else if (kickoffTeam === 'home') {
      const st = homeTeam.players[9];
      ball.x = st.x - 12; ball.y = st.y;
    }

    controlledHome = homeTeam.players[10];
    controlledHome.isControlled = true;
    controlledHome.isHuman = true;
    controlledHome.bro = applyKit(getBro(selectedP1), kitP1);

    if (gameMode === 'local') {
      controlledAway = awayTeam.players[10];
      controlledAway.isControlled = true;
      controlledAway.isHuman = true;
    }
  }

  function makeBall() {
    return { x: FIELD.x + FIELD.w / 2, y: FIELD.y + FIELD.h / 2, vx: 0, vy: 0, z: 0, vz: 0 };
  }

  function startMatch() {
    score = { home: 0, away: 0 };
    timer = activeChallenge ? activeChallenge.matchTime : MATCH_TIME;
    paused = false;
    kickCharge = 0; kickHeld = false;

    if (matchType === '11v11' || matchType === 'country') {
      reset11v11(null);
    } else {
      startArcadeMatch();
    }

    updateHUD();
    hideScreen('mainMenu'); hideScreen('charSelect'); hideScreen('countrySelect'); hideScreen('challengeSelect');
    screens.hud.classList.remove('hidden');
    state = 'playing';

    const chHud = document.getElementById('challengeHud');
    if (matchType === 'challenge' && activeChallenge) {
      chHud.classList.remove('hidden');
      chHud.textContent = 'VS ' + activeChallenge.title;
      showMessage('CHALLENGE: ' + activeChallenge.subtitle + '!', 2.5);
    } else if (matchType === 'country') {
      chHud.classList.remove('hidden');
      chHud.textContent = getCountry(selectedHomeCountry).flag + ' vs ' + getCountry(selectedAwayCountry).flag;
      showMessage('COUNTRY CUP KICK OFF!', 2);
    } else {
      chHud.classList.add('hidden');
      showMessage(matchType === '11v11' ? '11v11 KICK OFF!' : 'KICK OFF!', 2);
    }

    AudioFX.play('whistle');
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (paused) { paused = false; hideScreen('pauseMenu'); state = 'playing'; lastTime = performance.now(); }
    else { paused = true; state = 'paused'; showScreen('pauseMenu'); }
  }

  function getArcadeInput() {
    return {
      pl: p1,
      up: keys['KeyW'], down: keys['KeyS'], left: keys['KeyA'], right: keys['KeyD'],
      kick: keys['KeyG'] || keys['Space'],
      tackle: keys['KeyF'], sprint: keys['ShiftLeft'] || keys['ShiftRight'],
      dash: keys['KeyE'], pass: keys['KeyR'], through: keys['KeyT'],
      teamKey: 'home'
    };
  }

  function getControlledInput(teamKey) {
    if (matchType === 'arcade' || matchType === 'challenge') {
      return teamKey === 'home' ? getArcadeInput() : null;
    }
    const pl = teamKey === 'home' ? controlledHome : controlledAway;
    if (!pl || !pl.isControlled) return null;
    if (teamKey === 'home') {
      return {
        pl,
        up: keys['KeyW'], down: keys['KeyS'], left: keys['KeyA'], right: keys['KeyD'],
        kick: keys['KeyG'] || keys['Space'],
        tackle: keys['KeyF'], sprint: keys['ShiftLeft'] || keys['ShiftRight'],
        dash: keys['KeyE'], pass: keys['KeyR'], through: keys['KeyT'],
        teamKey: 'home'
      };
    }
    return {
      pl,
      up: keys['ArrowUp'], down: keys['ArrowDown'], left: keys['ArrowLeft'], right: keys['ArrowRight'],
      kick: keys['KeyL'], tackle: keys['KeyK'], sprint: keys['KeyM'],
      dash: keys['KeyP'], pass: keys['KeyU'], through: keys['KeyI'],
      teamKey: 'away'
    };
  }

  function updateHumanPlayer(inp, dt) {
    const pl = inp.pl;
    const sm = SPEED_MULT;
    const tk = inp.teamKey;

    if (pl.stunned > 0) {
      pl.stunned -= dt; pl.vx *= 0.88; pl.vy *= 0.88;
    } else {
      const sprinting = inp.sprint && pl.stamina > 0;
      pl.sprinting = sprinting;
      const baseSpeed = pl.bro.speed * 28 * sm * (sprinting ? 1.5 : 1);
      if (sprinting) pl.stamina = Math.max(0, pl.stamina - 40 * dt);
      else pl.stamina = Math.min(100, pl.stamina + 22 * dt);

      let dx = 0, dy = 0;
      if (inp.up) dy -= 1;
      if (inp.down) dy += 1;
      if (inp.left) dx -= 1;
      if (inp.right) dx += 1;

      if (pl.dashAnim > 0) {
        pl.dashAnim -= dt;
        pl.vx = pl.facing * 380 * sm; pl.vy *= 0.9;
      } else if (dx || dy) {
        const len = Math.hypot(dx, dy);
        pl.vx = (dx / len) * baseSpeed;
        pl.vy = (dy / len) * baseSpeed;
        pl.facing = dx >= 0 ? 1 : -1;
      } else {
        pl.vx *= 0.8; pl.vy *= 0.8;
      }
    }

    pl.x += pl.vx * dt; pl.y += pl.vy * dt;
    const pr = activePlayerR;
    pl.x = clamp(pl.x, FIELD.x + pr, FIELD.x + FIELD.w - pr);
    pl.y = clamp(pl.y, FIELD.y + pr, FIELD.y + FIELD.h - pr);
    if (pl.kickAnim > 0) pl.kickAnim -= dt;
    if (pl.tackleAnim > 0) pl.tackleAnim -= dt;
  }

  function kickPlayer(pl, charged) {
    const pr = activePlayerR, br = activeBallR;
    const d = dist(pl.x, pl.y, ball.x, ball.y);
    if (d > pr + br + 12) return;
    pl.kickAnim = 0.12;
    const sm = SPEED_MULT;
    const mult = charged ? 2.0 : 1;
    const nx = pl.facing;
    const ny = (ball.y - pl.y) * 0.08;
    const power = pl.bro.power * 55 * sm * mult;
    ball.vx = nx * power + pl.vx * 0.5;
    ball.vy = ny * power * 0.5 + pl.vy * 0.35;
    ball.vz = pl.bro.power * 4 * mult;
    ballLastTouch = pl.team;
    Effects.addBurst(pl.x + pl.facing * 12, pl.y, charged ? '#ffd700' : '#fff', charged ? 12 : 6);
    AudioFX.play(charged ? 'super' : 'kick');
  }

  function passBall(pl, target) {
    if (!target) return;
    const d = dist(pl.x, pl.y, ball.x, ball.y);
    if (d > PLAYER_R + BALL_R + 14) return;
    pl.kickAnim = 0.1;
    const dx = target.x - ball.x, dy = target.y - ball.y;
    const len = Math.hypot(dx, dy) || 1;
    const power = Math.min(320, len * 1.8) * SPEED_MULT;
    ball.vx = (dx / len) * power;
    ball.vy = (dy / len) * power;
    ball.vz = 8;
    ballLastTouch = pl.team;
    Effects.addBurst(ball.x, ball.y, '#4ecdc4', 8);
    AudioFX.play('kick');
    showMessage('PASS → #' + target.number, 0.8);
  }

  function passToBest(pl, teammates, through) {
    const dir = TeamAI.attackDir(pl.side);
    let best = null, bestScore = -Infinity;
    teammates.forEach(tm => {
      if (tm === pl || tm.role === 'GK') return;
      const forward = (tm.x - pl.x) * dir;
      if (!through && forward < 5) return;
      const d = dist(pl, tm);
      if (d > 300 || d < 20) return;
      const score = forward * (through ? 1.5 : 0.8) - d * 0.2;
      if (score > bestScore) { bestScore = score; best = tm; }
    });
    if (best) passBall(pl, best);
  }

  function tacklePlayer(attacker, defender) {
    const d = dist(attacker.x, attacker.y, defender.x, defender.y);
    if (d > activePlayerR * 3) return;
    attacker.tackleAnim = 0.18;
    AudioFX.play('tackle');
    Effects.addBurst((attacker.x + defender.x) / 2, (attacker.y + defender.y) / 2, '#e63946', 8);
    defender.stunned = 0.5;
    defender.vx = attacker.facing * 200 * SPEED_MULT;
    if (dist(attacker.x, attacker.y, ball.x, ball.y) < activePlayerR + activeBallR + 18) {
      ball.vx = attacker.facing * 180 * SPEED_MULT;
      ballLastTouch = attacker.team;
    }
  }

  function dashPlayer(pl, teamKey) {
    if (dashCooldown[teamKey] > 0 || pl.dashAnim > 0) return;
    dashCooldown[teamKey] = 0.65;
    pl.dashAnim = 0.1;
    pl.stamina = Math.max(0, pl.stamina - 15);
    AudioFX.play('dash');
    Effects.addBurst(pl.x, pl.y, '#4ecdc4', 6);
  }

  function separatePlayers() {
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const a = players[i], b = players[j];
        const d = dist(a.x, a.y, b.x, b.y);
        const minD = PLAYER_R * 2;
        if (d < minD && d > 0) {
          const nx = (a.x - b.x) / d, ny = (a.y - b.y) / d;
          const push = (minD - d) * 0.5;
          a.x += nx * push; a.y += ny * push;
          b.x -= nx * push; b.y -= ny * push;
        }
      }
    }
  }

  function updateBall11(dt) {
    const sm = SPEED_MULT;
    const pr = activePlayerR, br = activeBallR;
    ball.vx *= 0.987; ball.vy *= 0.987;
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;

    if (ball.z > 0 || ball.vz) {
      ball.vz -= 700 * sm * dt;
      ball.z += ball.vz * dt;
      if (ball.z <= 0) { ball.z = 0; ball.vz = -ball.vz * 0.3; if (Math.abs(ball.vz) < 30) ball.vz = 0; }
    }

    if (ball.y - br < FIELD.y) { ball.y = FIELD.y + br; ball.vy *= -0.7; }
    if (ball.y + br > FIELD.y + FIELD.h) { ball.y = FIELD.y + FIELD.h - br; ball.vy *= -0.7; }

    const inGoalY = ball.y > GOAL_Y && ball.y < GOAL_Y + GOAL_H;
    if (ball.x - br < FIELD.x && !inGoalY) { ball.x = FIELD.x + br; ball.vx *= -0.7; }
    if (ball.x + br > FIELD.x + FIELD.w && !inGoalY) { ball.x = FIELD.x + FIELD.w - br; ball.vx *= -0.7; }

    const colliders = players || (p1 && p2 ? [p1, p2] : []);
    colliders.forEach(pl => {
      if (!pl) return;
      const d = dist(pl.x, pl.y, ball.x, ball.y);
      const minD = br + pr - 2;
      if (d < minD && d > 0) {
        const nx = (ball.x - pl.x) / d, ny = (ball.y - pl.y) / d;
        ball.x += nx * (minD - d); ball.y += ny * (minD - d);
        const push = (140 + pl.bro.power * 10) * sm;
        ball.vx += nx * push * 0.3 + pl.vx * 0.4;
        ball.vy += ny * push * 0.3 + pl.vy * 0.4;
        ballLastTouch = pl.team || pl.side;
      }
    });

    // Arcade goalkeeper hands
    if (arcadeGkLeft && arcadeGkRight) {
      [arcadeGkLeft, arcadeGkRight].forEach(gk => {
        gk.handY += gk.handDir * gk.handSpeed * 60 * dt;
        if (gk.handY < GOAL_Y + 20) { gk.handY = GOAL_Y + 20; gk.handDir = 1; }
        if (gk.handY > GOAL_Y + GOAL_H - 20) { gk.handY = GOAL_Y + GOAL_H - 20; gk.handDir = -1; }
        const handX = gk.side === 'left' ? gk.x + 12 : gk.x - 12;
        [gk.handY - 28, gk.handY + 22].forEach(hy => {
          const d = dist(ball.x, ball.y, handX, hy);
          if (d < br + 14) {
            const nx = (ball.x - handX) / (d || 1);
            const ny = (ball.y - hy) / (d || 1);
            ball.vx += nx * 260 * sm;
            ball.vy += ny * 260 * sm;
          }
        });
      });
    }

    if (Math.hypot(ball.vx, ball.vy) > 180) Effects.addTrail(ball.x, ball.y, '#fff');
  }

  function checkGoal11() {
    const br = activeBallR;
    const inGoalY = ball.y > GOAL_Y && ball.y < GOAL_Y + GOAL_H;
    if (!inGoalY || ball.z > 15) return null;
    if (ball.x - br < FIELD.x && ball.x > LEFT_GOAL_X) return 'away';
    if (ball.x + br > FIELD.x + FIELD.w && ball.x < RIGHT_GOAL_X + GOAL_W) return 'home';
    return null;
  }

  function teamHasBall(teamId) {
    return ballLastTouch === teamId;
  }

  function update11v11(dt) {
    autoSwitchPlayers();

    const inpHome = getControlledInput('home');
    const inpAway = gameMode === 'local' ? getControlledInput('away') : null;

    if (inpHome) updateHumanPlayer(inpHome, dt);
    if (inpAway) updateHumanPlayer(inpAway, dt);

    const callbacks = {
      kick: (pl, charged) => kickPlayer(pl, charged),
      pass: (pl, target) => passBall(pl, target),
      tackle: (a, d) => tacklePlayer(a, d),
    };

    homeTeam.players.forEach(pl => {
      if (pl.isControlled && pl.isHuman) return;
      TeamAI.updateAI(pl, homeTeam.players, awayTeam.players, ball,
        teamHasBall('home'), FIELD, SPEED_MULT, dt, callbacks);
    });
    awayTeam.players.forEach(pl => {
      if (pl.isControlled && pl.isHuman) return;
      TeamAI.updateAI(pl, awayTeam.players, homeTeam.players, ball,
        teamHasBall('away'), FIELD, SPEED_MULT, dt, callbacks);
    });

    // Human actions
    kickCooldown.home = Math.max(0, kickCooldown.home - dt);
    kickCooldown.away = Math.max(0, kickCooldown.away - dt);
    dashCooldown.home = Math.max(0, dashCooldown.home - dt);
    dashCooldown.away = Math.max(0, dashCooldown.away - dt);
    passCooldown.home = Math.max(0, passCooldown.home - dt);
    passCooldown.away = Math.max(0, passCooldown.away - dt);

    if (inpHome) {
      if (inpHome.dash) dashPlayer(inpHome.pl, 'home');
      if (inpHome.tackle) {
        const opp = nearestPlayerToBall(awayTeam.players, ball);
        if (opp) tacklePlayer(inpHome.pl, opp);
      }
      if (inpHome.pass && passCooldown.home <= 0) {
        passToBest(inpHome.pl, homeTeam.players, false);
        passCooldown.home = 0.4;
      }
      if (inpHome.through && passCooldown.home <= 0) {
        passToBest(inpHome.pl, homeTeam.players, true);
        passCooldown.home = 0.5;
      }
      if (inpHome.kick) {
        kickCharge = Math.min(1, kickCharge + dt * 1.8);
        kickHeld = true;
        document.getElementById('chargeBar').classList.remove('hidden');
        document.getElementById('chargeFill').style.width = (kickCharge * 100) + '%';
      } else if (kickHeld) {
        kickPlayer(inpHome.pl, kickCharge >= 0.55);
        kickCharge = 0; kickHeld = false;
        document.getElementById('chargeBar').classList.add('hidden');
      }
    }

    if (inpAway) {
      if (inpAway.dash) dashPlayer(inpAway.pl, 'away');
      if (inpAway.tackle) {
        const opp = nearestPlayerToBall(homeTeam.players, ball);
        if (opp) tacklePlayer(inpAway.pl, opp);
      }
      if (inpAway.pass && passCooldown.away <= 0) {
        passToBest(inpAway.pl, awayTeam.players, false);
        passCooldown.away = 0.4;
      }
      if (inpAway.kick && !inpAway.pass) kickPlayer(inpAway.pl, false);
    }

    separatePlayers();
    updateBall11(dt);

    if (controlledHome) document.getElementById('stamP1').style.width = controlledHome.stamina + '%';
    if (controlledAway) document.getElementById('stamP2').style.width = controlledAway.stamina + '%';

    const goal = checkGoal11();
    if (goal) scoreGoal11(goal);
  }

  function scoreGoal11(scorer) {
    if (matchType === 'arcade' || matchType === 'challenge') return;
    score[scorer]++;
    state = 'goal';
    const team = scorer === 'home' ? homeTeam : awayTeam;
    const scorerPl = nearestPlayerToBall(team.players, ball);
    const label = scorerPl ? '#' + scorerPl.number + ' ' + scorerPl.role : team.name;
    showOverlay('GOAL!', label + ' — ' + score.home + ' : ' + score.away);
    screens.overlay.classList.remove('hidden');
    AudioFX.play('goal');
    Effects.addGoalConfetti(scorer === 'home' ? W * 0.85 : W * 0.15, H / 2);
    updateHUD();

    setTimeout(() => {
      screens.overlay.classList.add('hidden');
      reset11v11(scorer);
      state = 'playing';
      showMessage('KICK OFF!', 1.2);
    }, 2000);
  }

  function endMatch11() {
    state = 'matchEnd';
    const won = score.home > score.away;
    const draw = score.home === score.away;

    if (matchType === 'challenge' && activeChallenge) {
      const won = score.home > score.away;
      const ch = activeChallenge;

      if (won) {
        if (!saveData.challengesCompleted.includes(ch.id)) {
          saveData.challengesCompleted.push(ch.id);
        }
        saveData.wins++;
        checkUnlocks();
        persistSave();
        updateMenuStats();
        showOverlay('CHALLENGE COMPLETE!', ch.title + ' defeated!');
        document.getElementById('overlaySub').textContent = ch.reward;
        setTimeout(() => {
          screens.overlay.classList.add('hidden');
          document.getElementById('challengeHud').classList.add('hidden');
          matchType = '11v11';
          if (pendingUnlock) showUnlock();
          else showChallengeSelect();
          activeChallenge = null;
        }, 2800);
      } else {
        showOverlay('CHALLENGE FAILED', ch.title + ' wins! ' + score.home + '-' + score.away);
        document.getElementById('overlaySub').textContent = 'Try again — you can do it!';
        setTimeout(() => {
          screens.overlay.classList.add('hidden');
          document.getElementById('challengeHud').classList.add('hidden');
          matchType = '11v11';
          activeChallenge = null;
          showChallengeSelect();
        }, 2600);
      }
      return;
    }

    showOverlay(draw ? 'DRAW!' : won ? 'YOU WIN!' : 'YOU LOSE!',
      score.home + ' - ' + score.away + (draw ? '' : ' ' + (won ? homeTeam.name : awayTeam.name)));
    if (won && gameMode !== 'practice') {
      saveData.wins++;
      checkUnlocks(); persistSave();
      if (pendingUnlock) setTimeout(showUnlock, 2800);
      else setTimeout(showMainMenu, 2800);
    } else setTimeout(showMainMenu, 2800);
  }

  function checkUnlocks() {
    const newUnlocks = BROS.filter(b => b.unlockAt <= saveData.wins && !saveData.unlocked.includes(b.id));
    newUnlocks.forEach(b => saveData.unlocked.push(b.id));
    pendingUnlock = newUnlocks[0] || null;
  }

  function showUnlock() {
    screens.overlay.classList.add('hidden');
    const el = document.getElementById('unlockChar');
    el.innerHTML = '';
    const bro = pendingUnlock;
    const c = document.createElement('canvas');
    c.width = 96; c.height = 112;
    drawBro(c.getContext('2d'), bro, 48, 68, 1.4, 1);
    el.appendChild(c);
    const p = document.createElement('p');
    p.style.marginTop = '10px'; p.style.fontSize = '0.55rem'; p.textContent = bro.name;
    el.appendChild(p);
    document.getElementById('unlockTitle').textContent = 'NEW BRO!';
    document.getElementById('unlockReward').textContent = '';
    showScreen('unlockScreen');
    pendingUnlock = null;
  }

  // ── Arcade / Challenge 1v1 ──
  function makeArcadeGk(side) {
    return {
      side,
      x: side === 'left' ? LEFT_GOAL_X + GOAL_W / 2 : RIGHT_GOAL_X + GOAL_W / 2,
      handY: GOAL_Y + GOAL_H / 2,
      handDir: 1,
      handSpeed: 3.5 * SPEED_MULT,
    };
  }

  function startArcadeMatch() {
    activePlayerR = 20;
    activeBallR = 8;
    arcadeGkLeft = makeArcadeGk('left');
    arcadeGkRight = makeArcadeGk('right');

    p1Bro = applyKit(getBro(selectedP1), kitP1);
    if (matchType === 'challenge' && activeChallenge) {
      p2Bro = applyKit(getBro(activeChallenge.bro), kitP2);
    } else {
      p2Bro = applyKit(BROS[1], kitP2);
    }
    p1 = {
      bro: p1Bro, team: 'home', side: 'home',
      x: FIELD.x + FIELD.w * 0.32, y: FIELD.y + FIELD.h / 2,
      vx: 0, vy: 0, facing: 1, kickAnim: 0, tackleAnim: 0, dashAnim: 0,
      stunned: 0, stamina: 100, sprinting: false
    };
    p2 = {
      bro: p2Bro, team: 'away', side: 'away',
      x: FIELD.x + FIELD.w * 0.68, y: FIELD.y + FIELD.h / 2,
      vx: 0, vy: 0, facing: -1, kickAnim: 0, tackleAnim: 0, dashAnim: 0,
      stunned: 0, stamina: 100, sprinting: false,
      isAI: gameMode !== 'local', aiBoost: challengeAiBoost
    };
    ball = makeBall();
    score = { home: 0, away: 0 };
    players = null;
  }

  function resetArcadePositions(scorer) {
    p1.x = FIELD.x + FIELD.w * 0.32;
    p1.y = FIELD.y + FIELD.h / 2;
    p1.vx = p1.vy = 0;
    p2.x = FIELD.x + FIELD.w * 0.68;
    p2.y = FIELD.y + FIELD.h / 2;
    p2.vx = p2.vy = 0;
    ball = makeBall();
    if (scorer === 'home') { ball.x = FIELD.x + FIELD.w * 0.45; }
    else if (scorer === 'away') { ball.x = FIELD.x + FIELD.w * 0.55; }
  }

  function updateArcade(dt) {
    if (state === 'goal') return;

    const inp = getArcadeInput();
    if (inp) {
      updateHumanPlayer(inp, dt);
      if (inp.dash) dashPlayer(p1, 'home');
      if (inp.tackle) tacklePlayer(p1, p2);
      if (inp.kick) {
        kickCharge = Math.min(1, kickCharge + dt * 1.8);
        kickHeld = true;
        document.getElementById('chargeBar').classList.remove('hidden');
        document.getElementById('chargeFill').style.width = (kickCharge * 100) + '%';
      } else if (kickHeld) {
        kickPlayer(p1, kickCharge >= 0.55);
        kickCharge = 0; kickHeld = false;
        document.getElementById('chargeBar').classList.add('hidden');
      }
    }

    if (!p2.isAI) {
      const inp2 = getControlledInput('away');
      if (inp2) { inp2.pl = p2; updateHumanPlayer(inp2, dt); if (inp2.kick) kickPlayer(p2, false); }
    } else {
      if (p2.stunned > 0) {
        p2.stunned -= dt; p2.vx *= 0.88; p2.vy *= 0.88;
      } else {
        const boost = (p2.aiBoost || 1) * SPEED_MULT;
        const d = dist(p2.x, p2.y, ball.x, ball.y);
        const dx = ball.x - p2.x, dy = ball.y - p2.y;
        const len = Math.hypot(dx, dy) || 1;
        const spd = p2.bro.speed * 30 * boost;
        p2.vx = (dx / len) * spd;
        p2.vy = (dy / len) * spd;
        p2.facing = dx > 0 ? 1 : -1;
      }
      p2.x += p2.vx * dt; p2.y += p2.vy * dt;
      const pr = activePlayerR;
      p2.x = clamp(p2.x, FIELD.x + pr, FIELD.x + FIELD.w - pr);
      p2.y = clamp(p2.y, FIELD.y + pr, FIELD.y + FIELD.h - pr);
      if (p2.kickAnim > 0) p2.kickAnim -= dt;

      const boost = (p2.aiBoost || 1) * SPEED_MULT;
      const d = dist(p2.x, p2.y, ball.x, ball.y);
      if (d < 32 && Math.random() < 0.14 * boost) kickPlayer(p2, Math.random() < 0.3);
      if (d < 40 && Math.random() < 0.05 * boost) { p2.dashAnim = 0.12; p2.vx = p2.facing * 420 * boost; }
      if (dist(p1.x, p1.y, p2.x, p2.y) < pr * 3 && Math.random() < 0.04 * boost) tacklePlayer(p2, p1);
    }

    if (p1.sprinting && p1.stamina > 0) Effects.addTrail(p1.x - p1.facing * 8, p1.y + 10, '#4ecdc4');

    updateBall11(dt);
    document.getElementById('stamP1').style.width = p1.stamina + '%';

    if (state !== 'playing') return;

    const g = checkGoal11();
    if (g) {
      score[g]++;
      updateHUD();
      state = 'goal';
      AudioFX.play('goal');
      Effects.addGoalConfetti(g === 'home' ? W * 0.85 : W * 0.15, H / 2);

      const winScore = matchType === 'challenge' ? challengeGoalsToWin : 999;
      const chWon = matchType === 'challenge' && g === 'home' && score.home >= winScore;
      const chLost = matchType === 'challenge' && g === 'away' && score.away >= winScore;

      if (chWon || chLost) {
        showOverlay(chWon ? 'YOU WIN!' : 'BOSS SCORES!', score.home + ' - ' + score.away);
        screens.overlay.classList.remove('hidden');
        setTimeout(() => endMatch11(), 1800);
        return;
      }

      const scorerName = g === 'home' ? (p1Bro?.name || 'YOU') : (activeChallenge?.title || p2Bro?.name);
      showOverlay('GOAL!', scorerName + ' — ' + score.home + ' : ' + score.away);
      screens.overlay.classList.remove('hidden');
      setTimeout(() => {
        screens.overlay.classList.add('hidden');
        resetArcadePositions(g);
        state = 'playing';
        showMessage('KICK OFF!', 1);
      }, 1600);
    }
  }

  function update(dt) {
    if (state === 'paused' || state === 'menu' || state === 'charSelect' || state === 'matchEnd' || state === 'settings' || state === 'countrySelect' || state === 'challengeSelect') return;
    if (messageTimer > 0) { messageTimer -= dt; if (messageTimer <= 0) document.getElementById('message').textContent = ''; }
    Effects.update(dt);
    if (state !== 'playing' && state !== 'goal') return;

    if (gameMode !== 'practice') {
      timer -= dt;
      if (timer <= 0) {
        timer = 0;
        endMatch11();
        return;
      }
      updateTimerDisplay();
    }

    if (matchType === '11v11' || matchType === 'country') update11v11(dt);
    else if (state === 'playing' || state === 'goal') updateArcade(dt);
  }

  function render11v11() {
    const shake = Effects.getShake();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawPixelField(ctx, W, H, FIELD, LEFT_GOAL_X, RIGHT_GOAL_X, GOAL_Y, GOAL_W, GOAL_H);

    // Sort by Y for depth
    const sorted = players.slice().sort((a, b) => a.y - b.y);
    sorted.forEach(pl => {
      const isCtrl = pl === controlledHome || pl === controlledAway;
      drawFieldPlayer(ctx, pl, isCtrl);
    });

    drawPixelBall(ctx, ball.x, ball.y, ball.z);
    drawMiniMap(ctx, FIELD, homeTeam, awayTeam, ball, controlledHome);
    Effects.draw(ctx);
    ctx.restore();
  }

  function renderArcade() {
    if (!p1 || !p2) return;
    const shake = Effects.getShake();
    ctx.save();
    ctx.translate(shake.x, shake.y);
    drawPixelField(ctx, W, H, FIELD, LEFT_GOAL_X, RIGHT_GOAL_X, GOAL_Y, GOAL_W, GOAL_H);

    if (arcadeGkLeft) drawPixelGoalkeeper(ctx, arcadeGkLeft, GOAL_Y, GOAL_H);
    if (arcadeGkRight) drawPixelGoalkeeper(ctx, arcadeGkRight, GOAL_Y, GOAL_H);

    const scale = matchType === 'challenge' ? 1.35 : 1.25;
    drawBro(ctx, p1.bro, p1.x, p1.y, scale, p1.facing, p1.kickAnim > 0 ? 'kick' : p1.dashAnim > 0 ? 'dash' : 'idle');
    drawBro(ctx, p2.bro, p2.x, p2.y, scale, p2.facing, p2.kickAnim > 0 ? 'kick' : p2.dashAnim > 0 ? 'dash' : 'idle');

    drawPixelBall(ctx, ball.x, ball.y, ball.z);

    if (matchType === 'challenge' && activeChallenge) {
      enablePixel(ctx);
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = '#ffd700';
      ctx.textAlign = 'center';
      ctx.fillText('FIRST TO ' + challengeGoalsToWin, W / 2, FIELD.y + FIELD.h + 28);
    }

    Effects.draw(ctx);
    ctx.restore();
  }

  function render() {
    if (matchType === '11v11' || matchType === 'country') render11v11();
    else if ((matchType === 'arcade' || matchType === 'challenge') && p1) renderArcade();
  }

  function updateHUD() {
    const ctrl = controlledHome;

    if (matchType === 'challenge' && activeChallenge) {
      document.getElementById('nameP1').textContent = p1Bro?.name || 'YOU';
      document.getElementById('nameP2').textContent = activeChallenge.title;
      document.getElementById('scoreP1').textContent = score.home + '/' + challengeGoalsToWin;
      document.getElementById('scoreP2').textContent = score.away + '/' + challengeGoalsToWin;
    } else if (matchType === 'country' || (matchType === '11v11' && homeTeam?.flag)) {
      document.getElementById('nameP1').textContent = homeTeam?.name || 'HOME';
      document.getElementById('nameP2').textContent = awayTeam?.name || 'AWAY';
      document.getElementById('scoreP1').textContent = score.home;
      document.getElementById('scoreP2').textContent = score.away;
    } else {
      document.getElementById('scoreP1').textContent = score.home;
      document.getElementById('scoreP2').textContent = score.away;
      document.getElementById('nameP1').textContent = matchType === '11v11'
        ? (ctrl ? '#' + ctrl.number + ' ' + ctrl.role : homeTeam?.name)
        : (p1Bro?.name || 'P1');
      document.getElementById('nameP2').textContent = matchType === '11v11'
        ? awayTeam?.name + ' x' + PLAYERS_PER_TEAM
        : (p2?.isAI ? 'CPU' : p2Bro?.name);
    }
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const m = Math.floor(timer / 60);
    const s = Math.floor(timer % 60);
    document.getElementById('timer').textContent = m + ':' + String(s).padStart(2, '0');
  }

  function showMessage(msg, duration) {
    messageTimer = duration;
    document.getElementById('message').textContent = msg;
  }

  function showOverlay(title, sub) {
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlaySub').textContent = sub || '';
    screens.overlay.classList.remove('hidden');
  }

  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (state === 'playing' || state === 'goal') { update(dt); render(); }
    if (state === 'playing' || state === 'goal') requestAnimationFrame(gameLoop);
  }

  let menuAnimFrame = 0;
  function menuLoop() {
    if (state !== 'menu') return;
    menuAnimFrame++;
    if (!ball) ball = makeBall();
    if (!homeTeam) {
      selectedHomeCountry = 'arg';
      selectedAwayCountry = 'bra';
      initTeams();
      players = allPlayers(homeTeam, awayTeam);
    }
    ball.x = FIELD.x + FIELD.w / 2 + Math.sin(menuAnimFrame * 0.015) * 80;
    ball.y = FIELD.y + FIELD.h / 2 + Math.cos(menuAnimFrame * 0.012) * 40;
    ball.vx = ball.vy = 0; ball.z = Math.abs(Math.sin(menuAnimFrame * 0.03)) * 15;
    homeTeam.players.forEach((p, i) => {
      const pos = slotToField(getFormation(formationId).slots[i], 'home', FIELD);
      p.x = pos.x + Math.sin(menuAnimFrame * 0.02 + i) * 3;
      p.y = pos.y + Math.cos(menuAnimFrame * 0.018 + i) * 2;
    });
    awayTeam.players.forEach((p, i) => {
      const pos = slotToField(getFormation(formationId).slots[i], 'away', FIELD);
      p.x = pos.x + Math.sin(menuAnimFrame * 0.02 + i + 5) * 3;
      p.y = pos.y + Math.cos(menuAnimFrame * 0.018 + i + 5) * 2;
    });
    render11v11();
    requestAnimationFrame(menuLoop);
  }

  function init() {
    selectedHomeCountry = 'arg';
    selectedAwayCountry = 'bra';
    kitP1 = getCountry('arg').kit;
    kitP2 = getCountry('bra').kit;
    showMainMenu();
    ball = makeBall();
    initTeams();
    players = allPlayers(homeTeam, awayTeam);
  }

  init();
})();

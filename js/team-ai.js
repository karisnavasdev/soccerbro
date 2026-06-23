// Team AI for 11v11
const TeamAI = (function () {
  'use strict';

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function attackDir(side) {
    return side === 'home' ? 1 : -1;
  }

  function goalX(side, FIELD) {
    return side === 'home' ? FIELD.x + FIELD.w : FIELD.x;
  }

  // Dynamic formation shift based on ball position
  function getTargetPos(pl, ball, teamHasBall, FIELD, SPEED_MULT) {
    const dir = attackDir(pl.side);
    const ballNX = (ball.x - FIELD.x) / FIELD.w;
    const ballNY = (ball.y - FIELD.y) / FIELD.h;

    let tx = pl.homeX;
    let ty = pl.homeY;

    // Shift formation toward ball horizontally
    const shiftX = (ballNX - 0.5) * 0.12 * FIELD.w;
    const shiftY = (ballNY - 0.5) * 0.08 * FIELD.h;
    tx += shiftX * (pl.role === 'GK' ? 0.2 : 1);
    ty += shiftY * (pl.role === 'GK' ? 0.1 : 1);

    if (teamHasBall) {
      // Attack — push forward by role
      const push = { GK: 0, LB: 0.04, CB: 0.03, RB: 0.04, LWB: 0.06, RWB: 0.06,
        LM: 0.08, CM: 0.07, RM: 0.08, LW: 0.10, RW: 0.10, ST: 0.12 };
      tx += dir * (push[pl.role] || 0.05) * FIELD.w;

      // Strikers track ball Y
      if (pl.role === 'ST' || pl.role === 'LW' || pl.role === 'RW') {
        ty += (ball.y - pl.homeY) * 0.35;
      }
    } else {
      // Defend — compress toward own goal
      const pull = { GK: 0, LB: 0.02, CB: 0.03, RB: 0.02, LM: 0.04, CM: 0.03, RM: 0.04, ST: 0.06 };
      tx -= dir * (pull[pl.role] || 0.03) * FIELD.w;
    }

    // GK stays in box
    if (pl.role === 'GK') {
      const boxEdge = pl.side === 'home' ? FIELD.x + FIELD.w * 0.12 : FIELD.x + FIELD.w * 0.88;
      tx = pl.side === 'home'
        ? Math.min(tx, boxEdge)
        : Math.max(tx, boxEdge);
      ty = pl.homeY + (ball.y - pl.homeY) * 0.45;
    }

    return { x: tx, y: ty };
  }

  function shouldChaseBall(pl, teammates, ball, teamHasBall) {
    if (pl.role === 'GK') {
      return dist(pl, ball) < 80;
    }
    const nearest = nearestPlayerToBall(teammates, ball);
    if (nearest !== pl) return false;
    // Only closest 1-2 players chase aggressively
    const d = dist(pl, ball);
    if (teamHasBall) {
      return d < 120 || pl.role === 'ST' || pl.role === 'CM';
    }
    return d < 160;
  }

  function nearestPlayerToBall(players, ball) {
    let best = null, bestD = Infinity;
    players.forEach(p => {
      const d = Math.hypot(p.x - ball.x, p.y - ball.y);
      if (d < bestD) { bestD = d; best = p; }
    });
    return best;
  }

  function findPassTarget(pl, teammates, opponents, FIELD) {
    const dir = attackDir(pl.side);
    let best = null, bestScore = -Infinity;

    teammates.forEach(tm => {
      if (tm === pl || tm.role === 'GK') return;
      const forward = (tm.x - pl.x) * dir;
      if (forward < 10) return;
      const d = dist(pl, tm);
      if (d > 280 || d < 30) return;

      // Openness — distance from nearest opponent
      let oppNear = Infinity;
      opponents.forEach(o => {
        const od = dist(tm, o);
        if (od < oppNear) oppNear = od;
      });

      const score = forward * 0.5 + oppNear * 2 - d * 0.3;
      if (score > bestScore) { bestScore = score; best = tm; }
    });
    return best;
  }

  function updateAI(pl, teammates, opponents, ball, teamHasBall, FIELD, SPEED_MULT, dt, callbacks) {
    if (pl.isHuman && pl.isControlled) return;
    if (pl.stunned > 0) {
      pl.stunned -= dt;
      pl.vx *= 0.88; pl.vy *= 0.88;
      pl.x += pl.vx * dt; pl.y += pl.vy * dt;
      return;
    }

    pl.aiCooldown -= dt;
    const sm = SPEED_MULT;
    const toBall = dist(pl, ball);
    const chase = shouldChaseBall(pl, teammates, ball, teamHasBall);
    const dir = attackDir(pl.side);

    let tx, ty;
    if (chase) {
      tx = ball.x;
      ty = ball.y;
    } else {
      const t = getTargetPos(pl, ball, teamHasBall, FIELD, sm);
      tx = t.x; ty = t.y;
    }

    let dx = tx - pl.x, dy = ty - pl.y;
    const len = Math.hypot(dx, dy) || 1;
    const roleSpeed = { GK: 0.75, CB: 0.85, ST: 1.05, LW: 1.1, RW: 1.1 };
    const spd = pl.bro.speed * 22 * sm * (roleSpeed[pl.role] || 0.95);

    pl.vx = (dx / len) * spd;
    pl.vy = (dy / len) * spd;
    if (Math.abs(dx) > 2) pl.facing = dx > 0 ? 1 : -1;

    pl.x += pl.vx * dt;
    pl.y += pl.vy * dt;
    pl.stamina = Math.min(100, pl.stamina + 18 * dt);

    // AI actions
    if (pl.aiCooldown <= 0 && toBall < 22) {
      if (teamHasBall) {
        // Pass or shoot
        const inShootRange = pl.side === 'home'
          ? ball.x > FIELD.x + FIELD.w * 0.72
          : ball.x < FIELD.x + FIELD.w * 0.28;

        if (inShootRange && Math.random() < 0.12) {
          callbacks.kick(pl, Math.random() < 0.25);
          pl.aiCooldown = 0.3;
        } else if (Math.random() < 0.04) {
          const target = findPassTarget(pl, teammates, opponents, FIELD);
          if (target) { callbacks.pass(pl, target); pl.aiCooldown = 0.5; }
          else { callbacks.kick(pl, false); pl.aiCooldown = 0.3; }
        }
      } else if (Math.random() < 0.08) {
        // Tackle attempt
        const carrier = opponents.find(o => dist(o, ball) < 22);
        if (carrier) { callbacks.tackle(pl, carrier); pl.aiCooldown = 0.6; }
      }
    }

    if (pl.kickAnim > 0) pl.kickAnim -= dt;
    if (pl.tackleAnim > 0) pl.tackleAnim -= dt;
    if (pl.dashAnim > 0) pl.dashAnim -= dt;
  }

  return {
    getTargetPos, findPassTarget, shouldChaseBall,
    updateAI, attackDir, goalX, dist
  };
})();

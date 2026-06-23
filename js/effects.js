// Particles & screen shake
const Effects = (function () {
  let particles = [];
  let shake = 0;

  function addBurst(x, y, color, count) {
    for (let i = 0; i < (count || 12); i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 80 + Math.random() * 200;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        color: color || '#ffd700',
        size: PX + Math.floor(Math.random() * 2) * PX,
      });
    }
  }

  function addGoalConfetti(x, y) {
    const colors = ['#ffd700', '#e63946', '#4ecdc4', '#fff', '#ff6b6b'];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 300,
        vy: -100 - Math.random() * 250,
        life: 1 + Math.random(),
        maxLife: 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: PX,
        gravity: 400,
      });
    }
    shake = 12;
  }

  function addTrail(x, y, color) {
    particles.push({
      x, y, vx: 0, vy: 0,
      life: 0.15, maxLife: 0.15,
      color: color || '#fff',
      size: PX,
    });
  }

  function update(dt) {
    shake = Math.max(0, shake - dt * 30);
    particles = particles.filter(p => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.gravity) p.vy += p.gravity * dt;
      return p.life > 0;
    });
  }

  function getShake() {
    if (shake <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * shake,
      y: (Math.random() - 0.5) * shake,
    };
  }

  function draw(ctx) {
    enablePixel(ctx);
    particles.forEach(p => {
      ctx.globalAlpha = p.life / p.maxLife;
      drawPx(ctx, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size, p.color);
    });
    ctx.globalAlpha = 1;
  }

  function clear() { particles = []; shake = 0; }

  return { addBurst, addGoalConfetti, addTrail, update, getShake, draw, clear };
})();

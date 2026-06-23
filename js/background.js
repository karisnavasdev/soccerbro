// Animated pixel football playground background
(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  canvas.className = 'playground-bg';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let W = 0, H = 0, frame = 0;
  const PX = 4;
  const crowdColors = ['#e63946', '#4ecdc4', '#ffd700', '#fff', '#888', '#0055a4', '#009c3b'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    drawStatic();
  }

  let staticLayer = null;

  function drawStatic() {
    staticLayer = document.createElement('canvas');
    staticLayer.width = W;
    staticLayer.height = H;
    const s = staticLayer.getContext('2d');
    s.imageSmoothingEnabled = false;

    // Night sky gradient (pixel bands)
    for (let y = 0; y < H * 0.45; y += PX) {
      const t = y / (H * 0.45);
      const r = Math.floor(8 + t * 12);
      const g = Math.floor(12 + t * 20);
      const b = Math.floor(35 + t * 40);
      s.fillStyle = `rgb(${r},${g},${b})`;
      s.fillRect(0, y, W, PX);
    }

    // Stars
    for (let i = 0; i < 120; i++) {
      const sx = (i * 137 + 29) % W;
      const sy = (i * 89 + 11) % Math.floor(H * 0.38);
      s.fillStyle = i % 5 === 0 ? '#ffd700' : '#fff';
      s.fillRect(sx, sy, PX, PX);
    }

    // Stadium stands — left
    drawStand(s, 0, H * 0.22, W * 0.12, H * 0.55, 'left');
    // Stadium stands — right
    drawStand(s, W * 0.88, H * 0.22, W * 0.12, H * 0.55, 'right');
    // Top stand
    drawStand(s, W * 0.08, H * 0.12, W * 0.84, H * 0.14, 'top');

    // Floodlight towers
    drawFloodlight(s, W * 0.08, H * 0.18);
    drawFloodlight(s, W * 0.92, H * 0.18);
    drawFloodlight(s, W * 0.08, H * 0.72);
    drawFloodlight(s, W * 0.92, H * 0.72);

    // Pitch area
    const fx = W * 0.1, fy = H * 0.28, fw = W * 0.8, fh = H * 0.52;
    drawPitch(s, fx, fy, fw, fh);
  }

  function drawStand(s, x, y, w, h, side) {
    s.fillStyle = '#2a2a3a';
    s.fillRect(x, y, w, h);
    s.fillStyle = '#3a3a4a';
    s.fillRect(x + 2, y + 2, w - 4, 4);

    const rows = Math.floor(h / (PX * 3));
    const cols = Math.floor(w / (PX * 2));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = r * 97 + c * 53 + (side === 'left' ? 1 : side === 'right' ? 2 : 3);
        if (seed % 4 === 0) continue;
        s.fillStyle = crowdColors[seed % crowdColors.length];
        const px = x + c * PX * 2 + (r % 2);
        const py = y + 8 + r * PX * 3;
        s.fillRect(px, py, PX, PX);
      }
    }
  }

  function drawFloodlight(s, x, y) {
    s.fillStyle = '#555';
    s.fillRect(x - 6, y, 12, H * 0.15);
    s.fillStyle = '#888';
    s.fillRect(x - 10, y - 8, 20, 12);
    s.fillStyle = 'rgba(255,255,220,0.15)';
    s.beginPath();
    s.moveTo(x, y);
    s.lineTo(x - 80, y + H * 0.35);
    s.lineTo(x + 80, y + H * 0.35);
    s.closePath();
    s.fill();
  }

  function drawPitch(s, x, y, w, h) {
    // Grass base
    s.fillStyle = '#1e5c12';
    s.fillRect(x - 8, y - 8, w + 16, h + 16);

    // Stripes
    const stripes = 12;
    for (let i = 0; i < stripes; i++) {
      s.fillStyle = i % 2 === 0 ? '#2a7a1a' : '#236815';
      s.fillRect(x + (w / stripes) * i, y, w / stripes, h);
    }

    // Field border
    s.fillStyle = '#fff';
    s.fillRect(x - 2, y - 2, w + 4, 3);
    s.fillRect(x - 2, y + h, w + 4, 3);
    s.fillRect(x - 2, y, 3, h);
    s.fillRect(x + w - 1, y, 3, h);

    // Center line
    for (let py = y; py < y + h; py += PX) {
      s.fillRect(x + w / 2 - 1, py, 3, PX);
    }

    // Center circle
    const cx = x + w / 2, cy = y + h / 2, cr = Math.min(w, h) * 0.14;
    for (let dy = -cr; dy <= cr; dy += PX) {
      for (let dx = -cr; dx <= cr; dx += PX) {
        const d = Math.hypot(dx, dy);
        if (d > cr - PX * 1.5 && d < cr) s.fillRect(cx + dx, cy + dy, PX, PX);
      }
    }
    s.fillRect(cx - PX, cy - PX, PX * 2, PX * 2);

    // Penalty boxes
    const paW = w * 0.16, paH = h * 0.55, paY = y + (h - paH) / 2;
    s.fillRect(x, paY, paW, 3);
    s.fillRect(x, paY + paH, paW, 3);
    s.fillRect(x + paW - 3, paY, 3, paH);
    s.fillRect(x + w - paW, paY, paW, 3);
    s.fillRect(x + w - paW, paY + paH, paW, 3);
    s.fillRect(x + w - paW, paY, 3, paH);

    // Goals
    const gW = 8, gH = h * 0.28, gY = y + (h - gH) / 2;
    s.fillStyle = 'rgba(255,255,255,0.2)';
    s.fillRect(x - gW, gY, gW, gH);
    s.fillRect(x + w, gY, gW, gH);
    s.fillStyle = '#fff';
    s.fillRect(x - gW, gY, gW, 3);
    s.fillRect(x - gW, gY + gH - 3, gW, 3);
    s.fillRect(x - gW, gY, 3, gH);
    s.fillRect(x + w, gY, gW, 3);
    s.fillRect(x + w, gY + gH - 3, gW, 3);
    s.fillRect(x + w + gW - 3, gY, 3, gH);

    // Net pattern
    s.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < gH; i += 8) {
      for (let j = 0; j < gW; j += 6) {
        s.fillRect(x - gW + j, gY + i, 2, 2);
        s.fillRect(x + w + j, gY + i, 2, 2);
      }
    }

    // Corner flags
    drawFlag(s, x + 4, y + 4, frame);
    drawFlag(s, x + w - 4, y + 4, frame + 30);
    drawFlag(s, x + 4, y + h - 4, frame + 60);
    drawFlag(s, x + w - 4, y + h - 4, frame + 90);
  }

  function drawFlag(s, x, y, f) {
    s.fillStyle = '#ccc';
    s.fillRect(x, y - 16, 3, 16);
    const wave = Math.sin(f * 0.08) * 3;
    s.fillStyle = '#e63946';
    s.fillRect(x + 3, y - 14 + wave, 10, 7);
    s.fillStyle = '#fff';
    s.fillRect(x + 3, y - 7 + wave, 10, 7);
  }

  function drawAnimated() {
    if (!staticLayer) return;
    ctx.drawImage(staticLayer, 0, 0);

    const fx = W * 0.1, fy = H * 0.28, fw = W * 0.8, fh = H * 0.52;

    // Animated corner flags overlay
    drawFlag(ctx, fx + 4, fy + 4, frame);
    drawFlag(ctx, fx + fw - 4, fy + 4, frame + 30);
    drawFlag(ctx, fx + 4, fy + fh - 4, frame + 60);
    drawFlag(ctx, fx + fw - 4, fy + fh - 4, frame + 90);

    // Crowd flicker pixels
    for (let i = 0; i < 8; i++) {
      const seed = (frame + i * 47) % 200;
      const cx = W * 0.05 + (seed * 17) % (W * 0.9);
      const cy = H * 0.15 + (seed * 13) % (H * 0.2);
      ctx.fillStyle = crowdColors[(frame + i) % crowdColors.length];
      ctx.globalAlpha = 0.4 + Math.sin(frame * 0.1 + i) * 0.3;
      ctx.fillRect(cx, cy, PX, PX);
    }
    ctx.globalAlpha = 1;

    // Subtle ball rolling on pitch (decorative)
    const bx = fx + fw * 0.5 + Math.sin(frame * 0.015) * fw * 0.35;
    const by = fy + fh * 0.5 + Math.cos(frame * 0.012) * fh * 0.25;
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(bx - PX, by - PX, PX * 2, PX * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(bx, by, PX, PX);

    // Dark vignette so UI pops
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.75);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function loop() {
    frame++;
    drawAnimated();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

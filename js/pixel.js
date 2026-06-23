// Pixel art rendering utilities
const PX = 3; // base pixel unit

function enablePixel(ctx) {
  ctx.imageSmoothingEnabled = false;
}

function drawPx(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w || PX, h || PX);
}

function drawPixelSprite(ctx, rows, palette, cx, cy, scale, facing) {
  ctx.save();
  enablePixel(ctx);
  ctx.translate(Math.floor(cx), Math.floor(cy));
  ctx.scale(facing * scale, scale);
  const cols = rows[0].length;
  const rowsN = rows.length;
  const ox = -(cols * PX) / 2;
  const oy = -(rowsN * PX) / 2;
  for (let r = 0; r < rowsN; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = rows[r][c];
      if (ch === '.') continue;
      const col = palette[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + c * PX, oy + r * PX, PX, PX);
    }
  }
  ctx.restore();
}

function drawPixelRect(ctx, x, y, w, h, color) {
  enablePixel(ctx);
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function drawPixelCircle(ctx, cx, cy, r, color) {
  enablePixel(ctx);
  const ir = Math.ceil(r);
  for (let dy = -ir; dy <= ir; dy++) {
    for (let dx = -ir; dx <= ir; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(cx + dx), Math.floor(cy + dy), PX, PX);
      }
    }
  }
}

function drawPixelEllipse(ctx, cx, cy, rx, ry, color) {
  enablePixel(ctx);
  for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy++) {
    for (let dx = -Math.ceil(rx); dx <= Math.ceil(rx); dx++) {
      if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(cx + dx), Math.floor(cy + dy), PX, PX);
      }
    }
  }
}

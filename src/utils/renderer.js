import { ASSETS } from '../config';
import { BIRD, GROUND, H, W, obstacleW } from './gamePhysics';

export function loadAssets() {
  const out = {};
  return Promise.all(
    Object.entries(ASSETS).map(([k, src]) => new Promise((res) => {
      const img = new Image();
      img.onload = () => { out[k] = img; res(); };
      img.onerror = () => res();
      img.src = src;
    })),
  ).then(() => out);
}

const STARS = Array.from({ length: 45 }, (_, i) => ({ x: (i * 97) % W, y: (i * 53) % (H - GROUND - 120), r: (i % 3) * 0.5 + 0.6, p: i * 0.7 }));

function drawGoat(ctx, img, cx, y, h, w, flip) {
  ctx.save();
  ctx.shadowColor = 'rgba(70,170,255,0.6)';
  ctx.shadowBlur = 16;
  ctx.translate(cx, y);
  if (flip) ctx.scale(1, -1);
  if (img) ctx.drawImage(img, -w / 2, 0, w, h);
  else { ctx.fillStyle = '#b5693a'; ctx.fillRect(-w / 2 + 8, 0, w - 16, h); }
  ctx.restore();
}

export function render(ctx, s, assets, phase) {
  ctx.clearRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#040920'); sky.addColorStop(0.6, '#0b2a6b'); sky.addColorStop(1, '#1a55b8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  STARS.forEach((st) => {
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.time * 0.03 + st.p));
    ctx.fillStyle = '#cfe6ff';
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // parallax skyline
  for (let layer = 0; layer < 2; layer++) {
    ctx.fillStyle = layer ? 'rgba(30,85,200,0.5)' : 'rgba(20,55,140,0.55)';
    const k = layer ? 0.5 : 0.25, total = 14 * 52;
    for (let i = 0; i < 14; i++) {
      const bh = 50 + ((i * 37 + layer * 23) % 90);
      const x = ((((i * 52) - s.bgX * k) % total) + total) % total - 52;
      ctx.fillRect(x, H - GROUND - bh - layer * 20, 46, bh + 20);
    }
  }

  // goat obstacles: upside-down from the ceiling, upright standing on the ground
  s.pipes.forEach((p) => {
    const cx = p.x + p.w / 2, topH = p.cy - p.gap / 2, botH = H - GROUND - (p.cy + p.gap / 2);
    drawGoat(ctx, assets.obstacle, cx, topH, topH, obstacleW(topH), true);
    drawGoat(ctx, assets.obstacle, cx, p.cy + p.gap / 2, botH, obstacleW(botH), false);
  });

  // ground
  const gy = H - GROUND;
  const gg = ctx.createLinearGradient(0, gy, 0, H);
  gg.addColorStop(0, '#1b3a8a'); gg.addColorStop(1, '#07103a');
  ctx.fillStyle = gg; ctx.fillRect(0, gy, W, GROUND);
  ctx.fillStyle = '#3d8bff'; ctx.fillRect(0, gy, W, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let x = -((s.groundX) % 40); x < W; x += 40) ctx.fillRect(x, gy + 12, 20, 6);

  // player (hidden behind the start screen)
  const b = s.bird;
  if (phase !== 'menu') {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rot);
  const flapScale = phase === 'playing' || phase === 'menu' || phase === 'countdown' ? 1 + Math.sin(s.time * 0.35) * 0.06 : 1;
  ctx.scale(1 / flapScale, flapScale);
  ctx.shadowColor = 'rgba(80,170,255,0.9)'; ctx.shadowBlur = 18;
  const img = assets.character, bw = BIRD.r * 5.3;
  if (img) ctx.drawImage(img, -bw / 2, -(bw * img.height / img.width) / 2, bw, bw * img.height / img.width);
  else { ctx.fillStyle = '#ffb84d'; ctx.beginPath(); ctx.arc(0, 0, BIRD.r, 0, 7); ctx.fill(); }
  ctx.restore();
  }

  // particles
  s.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
  });
  ctx.globalAlpha = 1;
}

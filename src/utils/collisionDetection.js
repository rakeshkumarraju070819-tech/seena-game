import { BIRD, GROUND, H, obstacleW } from './gamePhysics';

const circleRect = (cx, cy, r, x1, y1, x2, y2) => {
  const nx = Math.max(x1, Math.min(cx, x2));
  const ny = Math.max(y1, Math.min(cy, y2));
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
};

export const hitsGround = (b) => b.y + BIRD.r >= H - GROUND;

export function hitsPipe(b, p) {
  const r = BIRD.r - 3; // forgiving hitbox
  const cx = p.x + p.w / 2;
  const topH = p.cy - p.gap / 2;
  const botH = H - GROUND - (p.cy + p.gap / 2);
  const tw = obstacleW(topH) * 0.6, bw = obstacleW(botH) * 0.6; // body is narrower than the image box
  return (
    circleRect(b.x, b.y, r, cx - tw / 2, -1000, cx + tw / 2, topH) ||
    circleRect(b.x, b.y, r, cx - bw / 2, H - GROUND - botH, cx + bw / 2, H + 1000)
  );
}

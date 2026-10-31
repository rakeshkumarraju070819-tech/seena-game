import { OBSTACLE_ASPECT } from '../config';
export const W = 360;
export const H = 640;
export const GROUND = 80;
export const BIRD = { x: 96, r: 20, gravity: 0.38, flap: -6.5, maxFall: 10 };
export const PIPE = { baseGap: 180, minGap: 145, baseSpeed: 2.2, maxSpeed: 4.8, spacing: 250, margin: 110 };
export const obstacleW = (h) => h * OBSTACLE_ASPECT;

export const difficulty = (score) => ({
  speed: Math.min(PIPE.maxSpeed, PIPE.baseSpeed + score * 0.09),
  gap: Math.max(PIPE.minGap, PIPE.baseGap - score * 2),
});

export const createState = () => ({
  bird: { x: BIRD.x, y: H / 2 - 40, vy: 0, rot: 0 },
  pipes: [], particles: [], score: 0, bgX: 0, groundX: 0, time: 0,
});

export function stepBird(b, dt) {
  b.vy = Math.min(BIRD.maxFall, b.vy + BIRD.gravity * dt);
  b.y += b.vy * dt;
  if (b.y < BIRD.r) { b.y = BIRD.r; if (b.vy < 0) b.vy = 0; }
  b.rot = Math.max(-0.5, Math.min(1.25, b.vy * 0.09));
}
export const flapBird = (b) => { b.vy = BIRD.flap; };

export function spawnPipe(state) {
  const { gap } = difficulty(state.score);
  const margin = PIPE.margin;
  const min = margin + gap / 2;
  const max = H - GROUND - margin - gap / 2;
  const cy = min + Math.random() * (max - min);
  const topH = cy - gap / 2, botH = H - GROUND - (cy + gap / 2);
  state.pipes.push({ x: W + 30, cy, gap, passed: false, w: Math.max(obstacleW(topH), obstacleW(botH)) });
}

export function stepPipes(state, dt) {
  const { speed } = difficulty(state.score);
  state.pipes.forEach((p) => { p.x -= speed * dt; });
  state.pipes = state.pipes.filter((p) => p.x > -p.w - 10);
  const last = state.pipes[state.pipes.length - 1];
  if (!last || last.x <= W + 30 - PIPE.spacing) spawnPipe(state);
}

export function burst(state, x, y, n, color) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = 1 + Math.random() * 3.5;
    state.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, size: 2 + Math.random() * 3, color });
  }
}
export function stepParticles(state, dt) {
  state.particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.08 * dt; p.life -= 0.025 * dt; });
  state.particles = state.particles.filter((p) => p.life > 0);
}

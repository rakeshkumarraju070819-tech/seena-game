import { useCallback, useEffect, useRef, useState } from 'react';
import { BIRD, GROUND, H, burst, createState, difficulty, flapBird, stepBird, stepParticles, stepPipes } from '../utils/gamePhysics';
import { hitsGround, hitsPipe } from '../utils/collisionDetection';
import { loadAssets, render } from '../utils/renderer';
import { audio } from '../utils/audioManager';
import { getBest, saveBest } from '../utils/storage';

export default function useGame(canvasRef) {
  const [phase, setPhaseState] = useState('menu'); // menu | countdown | playing | paused | dead | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(getBest);
  const [isNew, setIsNew] = useState(false);
  const [count, setCount] = useState(3);
  const [muted, setMutedState] = useState(audio.isMuted());

  const G = useRef(null);
  if (!G.current) G.current = { state: createState(), phase: 'menu', raf: 0, last: 0, assets: {}, timers: [], best: getBest(), score: 0 };

  const setPhase = useCallback((p) => { G.current.phase = p; setPhaseState(p); }, []);
  const clearTimers = useCallback(() => { G.current.timers.forEach(clearTimeout); G.current.timers = []; }, []);
  const later = useCallback((fn, ms) => { G.current.timers.push(setTimeout(fn, ms)); }, []);

  const runCountdown = useCallback(() => {
    clearTimers();
    setPhase('countdown');
    setCount(3);
    later(() => setCount(2), 800);
    later(() => setCount(1), 1600);
    later(() => { setPhase('playing'); flapBird(G.current.state.bird); audio.flap(); }, 2400);
  }, [clearTimers, later, setPhase]);

  const start = useCallback(() => {
    audio.init();
    clearTimers();
    G.current.state = createState();
    G.current.score = 0;
    setScore(0);
    setIsNew(false);
    audio.stopIntro();
    audio.stopDeath();
    audio.playIntro();
    audio.startMusic();
    runCountdown();
  }, [clearTimers, runCountdown]);

  const flap = useCallback(() => {
    const C = G.current;
    if (C.phase !== 'playing') return;
    flapBird(C.state.bird);
    burst(C.state, C.state.bird.x - 12, C.state.bird.y + 10, 4, '#ff6b7a');
    audio.flap();
  }, []);

  const pauseNow = useCallback(() => {
    clearTimers(); setPhase('paused'); audio.stopMusic();
  }, [clearTimers, setPhase]);

  const togglePause = useCallback(() => {
    const p = G.current.phase;
    if (p === 'playing') pauseNow();
    else if (p === 'paused') { audio.startMusic(); runCountdown(); }
  }, [pauseNow, runCountdown]);

  const toggleMute = useCallback(() => {
    const m = !audio.isMuted();
    audio.setMuted(m);
    setMutedState(m);
    if (!m && ['playing', 'countdown'].includes(G.current.phase)) audio.startMusic();
  }, []);

  const die = useCallback(() => {
    const C = G.current, s = C.state;
    audio.stopIntro();
    audio.playDeath();
    audio.hit(); audio.stopMusic();
    burst(s, s.bird.x, s.bird.y, 28, '#ff6b6b');
    s.bird.vy = -4;
    setPhase('dead');
    if (C.score > C.best) { C.best = C.score; setBest(C.score); saveBest(C.score); setIsNew(true); }
    later(() => setPhase('over'), 700);
  }, [later, setPhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const sc = Math.min(3, (canvas.clientWidth / 360) * dpr) || 1;
      canvas.width = Math.round(360 * sc);
      canvas.height = Math.round(H * sc);
      ctx.setTransform(sc, 0, 0, sc, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    loadAssets().then((a) => { G.current.assets = a; });

    const update = (dt) => {
      const C = G.current, s = C.state, b = s.bird, p = C.phase;
      const { speed } = difficulty(s.score);
      if (p === 'menu' || p === 'countdown' || p === 'playing') { s.bgX += speed * 0.5 * dt; s.groundX += speed * dt; s.time += dt; }
      if (p === 'menu' || p === 'countdown') {
        b.y = H / 2 - 40 + Math.sin(s.time * 0.08) * 8; b.vy = 0; b.rot = 0;
      } else if (p === 'playing') {
        stepBird(b, dt);
        stepPipes(s, dt);
        for (const pipe of s.pipes) {
          if (!pipe.passed && pipe.x + pipe.w < b.x - BIRD.r) {
            pipe.passed = true; s.score += 1; C.score = s.score;
            setScore(s.score); audio.score();
            burst(s, b.x, b.y, 10, '#ffd94d');
          }
        }
        if (hitsGround(b) || s.pipes.some((pp) => hitsPipe(b, pp))) die();
      } else if (p === 'dead') {
        stepBird(b, dt);
        const gy = H - GROUND - BIRD.r;
        if (b.y > gy) { b.y = gy; b.vy = 0; }
      }
      stepParticles(s, dt);
    };

    const tick = (now) => {
      const C = G.current;
      const dt = Math.min(2.2, (now - C.last) / 16.667 || 1);
      C.last = now;
      update(dt);
      render(ctx, C.state, C.assets, C.phase);
      C.raf = requestAnimationFrame(tick);
    };
    G.current.raf = requestAnimationFrame(tick);

    // auto-pause when the tab is hidden
    const onVis = () => { if (document.hidden && G.current.phase === 'playing') pauseNow(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(G.current.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      document.removeEventListener('visibilitychange', onVis);
      clearTimers();
      audio.stopMusic();
      audio.stopIntro();
      audio.stopDeath();
    };
  }, [canvasRef, clearTimers, die, pauseNow]);

  return { phase, score, best, isNew, count, muted, start, flap, togglePause, toggleMute };
}

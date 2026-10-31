import { getMuted, saveMuted } from './storage';

let ctx = null;
let muted = getMuted();
let musicTimer = null;
let step = 0;
let introAudio = null;
let deathAudio = null;

const getIntroAudio = () => {
  if (!introAudio) {
    introAudio = new Audio('/assets/sounds/WhatsApp Audio 2026-10-31 at 3.36.08 PM.mpeg');
    introAudio.preload = 'auto';
    introAudio.loop = true;
  }
  return introAudio;
};

const getDeathAudio = () => {
  if (!deathAudio) {
    deathAudio = new Audio('/assets/sounds/WhatsApp Audio 2026-10-31 at 3.41.24 PM.mpeg');
    deathAudio.preload = 'auto';
  }
  return deathAudio;
};

const ac = () => {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (C) ctx = new C();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function tone(freq, dur, type = 'square', vol = 0.07, endFreq = null, delay = 0) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const NOTES = [262, 330, 392, 330, 294, 349, 440, 349];

export const audio = {
  init: () => { ac(); },
  flap: () => tone(380, 0.14, 'triangle', 0.09, 760),
  score: () => { tone(880, 0.09, 'square', 0.06); tone(1320, 0.14, 'square', 0.06, null, 0.08); },
  hit: () => { tone(200, 0.35, 'sawtooth', 0.12, 40); tone(90, 0.4, 'square', 0.1, 30, 0.05); },
  playIntro: () => {
    if (muted) return;
    const a = getIntroAudio();
    a.currentTime = 0;
    a.play().catch(() => {});
  },
  stopIntro: () => {
    if (introAudio) { introAudio.pause(); introAudio.currentTime = 0; }
  },
  playDeath: () => {
    if (muted) return;
    const a = getDeathAudio();
    a.currentTime = 0;
    a.play().catch(() => {});
  },
  stopDeath: () => {
    if (deathAudio) { deathAudio.pause(); deathAudio.currentTime = 0; }
  },
  startMusic: () => {
    if (musicTimer || muted) return;
    musicTimer = setInterval(() => {
      tone(NOTES[step % NOTES.length] / 2, 0.22, 'triangle', 0.035);
      step++;
    }, 280);
  },
  stopMusic: () => { clearInterval(musicTimer); musicTimer = null; },
  isMuted: () => muted,
  setMuted: (m) => { muted = m; saveMuted(m); if (m) { audio.stopMusic(); audio.stopIntro(); audio.stopDeath(); } },
};

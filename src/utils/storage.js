const BEST = 'flyingSeena.best';
const MUTE = 'flyingSeena.muted';
const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, String(v)); } catch { /* storage unavailable */ } };

export const getBest = () => parseInt(read(BEST) || '0', 10) || 0;
export const saveBest = (n) => write(BEST, n);
export const getMuted = () => read(MUTE) === '1';
export const saveMuted = (m) => write(MUTE, m ? 1 : 0);

import { Play } from 'lucide-react';
import { MEMES, TEXT } from '../config';

const Wing = ({ flip }) => (
  <svg className={`wing ${flip ? 'flip' : ''}`} viewBox="0 0 130 80" aria-hidden="true">
    <defs><linearGradient id="wg" x1="0" x2="1"><stop offset="0" stopColor="#bfeaff" /><stop offset="1" stopColor="#ffffff" /></linearGradient></defs>
    <path d="M4 14C40 0 92 8 126 44 92 36 50 38 4 14Z" fill="url(#wg)" />
    <path d="M14 34C48 24 88 32 116 58 86 52 48 54 14 34Z" fill="url(#wg)" opacity=".92" />
    <path d="M30 54C58 48 86 54 104 72 82 70 54 72 30 54Z" fill="url(#wg)" opacity=".85" />
  </svg>
);

export default function StartScreen({ onPlay, best }) {
  return (
    <div className="overlay start">
      <div className="title-wrap">
        <Wing /><Wing flip />
        <h1 className="title">
          <span className="t1" data-t="FLYING">FLYING</span>
          <span className="t2" data-t="SEENA">SEENA</span>
        </h1>
      </div>
      <img className="meme float" src={MEMES.start} alt="Seena" draggable="false" />
      <p className="dialogue">{TEXT.startDialogue}</p>
      <button className="play-btn pulse" onClick={onPlay}><Play size={30} fill="currentColor" /> PLAY</button>
      <p className="cta">{TEXT.playCta}</p>
      <p className="hint">{TEXT.instructions}</p>
      <p className="best-chip"><span className="crown">👑</span> BEST: {best}</p>
    </div>
  );
}

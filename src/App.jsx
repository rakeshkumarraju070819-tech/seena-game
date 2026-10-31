import { useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import useGame from './hooks/useGame';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import ScoreBoard from './components/ScoreBoard';
import SoundButton from './components/SoundButton';

export default function App() {
  const canvasRef = useRef(null);
  const { phase, score, best, isNew, count, muted, start, flap, togglePause, toggleMute } = useGame(canvasRef);
  const inGame = ['countdown', 'playing', 'paused', 'dead'].includes(phase);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        if (phase === 'playing') flap();
        else if (phase === 'menu' || phase === 'over') start();
        else if (phase === 'paused') togglePause();
      } else if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
      else if (e.code === 'KeyM') toggleMute();
    };
    const block = (e) => { if (inGame) e.preventDefault(); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('touchmove', block, { passive: false });
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('touchmove', block); };
  }, [phase, inGame, flap, start, togglePause, toggleMute]);

  return (
    <div className="stage">
      <div className="frame">
        <GameCanvas canvasRef={canvasRef} onFlap={flap} />

        <div className="topbar">
          <SoundButton muted={muted} onToggle={toggleMute} />
          {(phase === 'playing' || phase === 'paused') && (
            <button className="icon-btn" onClick={togglePause} aria-label="Pause">
              {phase === 'paused' ? <Play size={22} /> : <Pause size={22} />}
            </button>
          )}
        </div>

        {inGame && <ScoreBoard score={score} best={best} />}
        {phase === 'menu' && <StartScreen onPlay={start} best={best} />}
        {phase === 'countdown' && <div className="countdown"><span key={count}>{count}</span><small>GET READY!</small></div>}
        {phase === 'paused' && (
          <div className="overlay pause">
            <h2 className="failed blue">PAUSED</h2>
            <button className="play-btn" onClick={togglePause}><Play size={22} fill="currentColor" /> RESUME</button>
            <button className="ghost-btn" onClick={start}>RESTART</button>
          </div>
        )}
        {phase === 'over' && <GameOver score={score} best={best} isNew={isNew} onRestart={start} />}
      </div>
    </div>
  );
}

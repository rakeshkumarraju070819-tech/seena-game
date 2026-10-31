import { RotateCcw } from 'lucide-react';
import { MEMES, getFailDialogue } from '../config';

export default function GameOver({ score, best, isNew, onRestart }) {
  return (
    <div className="overlay over">
      <div className="popup">
        <h2 className="failed">YOU FAILED!</h2>
        <p className="dialogue">{getFailDialogue(score)}</p>
        <img className="meme" src={MEMES.over} alt="Seena" draggable="false" />
        <div className="cards">
          <div className="card"><span>SCORE</span><b>{score}</b></div>
          <div className="card"><span>BEST</span><b>{best}</b></div>
        </div>
        {isNew && <div className="new-record">🏆 NEW RECORD!</div>}
        <button className="play-btn" onClick={onRestart}><RotateCcw size={22} /> PLAY AGAIN</button>
      </div>
    </div>
  );
}

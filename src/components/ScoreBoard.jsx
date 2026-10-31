export default function ScoreBoard({ score, best }) {
  return (
    <div className="scoreboard">
      <div className="score-big" key={score}>{score}</div>
      <div className="score-best">BEST {best}</div>
    </div>
  );
}

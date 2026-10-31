export default function GameCanvas({ canvasRef, onFlap }) {
  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      onPointerDown={(e) => { e.preventDefault(); onFlap(); }}
    />
  );
}

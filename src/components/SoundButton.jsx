import { Volume2, VolumeX } from 'lucide-react';

export default function SoundButton({ muted, onToggle }) {
  return (
    <button className="icon-btn" onClick={onToggle} aria-label={muted ? 'Unmute' : 'Mute'}>
      {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
    </button>
  );
}

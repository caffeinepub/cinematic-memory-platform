import { useState, useEffect, useRef } from 'react';
import type { Memory } from '../backend';
import ThreePhotoCanvas from './ThreePhotoCanvas';
import { X, Volume2, VolumeX } from 'lucide-react';

interface MemoryUnlockAnimationProps {
  memory: Memory;
  onClose: () => void;
}

type Phase = 'fade-black' | 'heartbeat' | 'reveal' | 'subtitle' | 'handwrite';

export default function MemoryUnlockAnimation({ memory, onClose }: MemoryUnlockAnimationProps) {
  const [phase, setPhase] = useState<Phase>('fade-black');
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 30);
    const t1 = setTimeout(() => setPhase('heartbeat'), 600);
    const t2 = setTimeout(() => setPhase('reveal'), 2200);
    const t3 = setTimeout(() => setPhase('subtitle'), 3800);
    const t4 = setTimeout(() => setPhase('handwrite'), 5200);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    if (phase === 'reveal' && audioRef.current && memory.voiceNoteUrl) {
      audioRef.current.play().catch(() => {});
    }
  }, [phase, memory.voiceNoteUrl]);

  const toggleMute = () => {
    setMuted(m => {
      if (audioRef.current) audioRef.current.muted = !m;
      return !m;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: '#000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {memory.voiceNoteUrl && <audio ref={audioRef} src={memory.voiceNoteUrl} />}

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 rounded-full transition-all duration-300"
        style={{ border: '1px solid rgba(255,215,0,0.3)', color: 'rgba(255,215,0,0.7)' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,215,0,0.8)')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,215,0,0.3)')}
      >
        <X size={20} />
      </button>

      {memory.voiceNoteUrl && (
        <button
          onClick={toggleMute}
          className="absolute top-6 right-16 z-50 p-2 rounded-full transition-all duration-300"
          style={{ border: '1px solid rgba(255,215,0,0.3)', color: 'rgba(255,215,0,0.7)' }}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Heartbeat */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: phase === 'heartbeat' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      >
        <div
          className="heartbeat"
          style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
            border: '2px solid rgba(255,215,0,0.6)',
            boxShadow: '0 0 40px rgba(255,215,0,0.5)',
          }}
        />
      </div>

      {/* Photo reveal */}
      <div
        className="relative w-full max-w-3xl mx-4"
        style={{
          opacity: phase === 'reveal' || phase === 'subtitle' || phase === 'handwrite' ? 1 : 0,
          transform: phase === 'reveal' || phase === 'subtitle' || phase === 'handwrite' ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}
      >
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            aspectRatio: '16/9',
            border: '1px solid rgba(255,215,0,0.3)',
            boxShadow: '0 0 60px rgba(255,215,0,0.2)',
          }}
        >
          {memory.photoUrl ? (
            <ThreePhotoCanvas imageUrl={memory.photoUrl} />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)', minHeight: 300 }}
            >
              <span className="font-cinzel text-6xl" style={{ color: 'rgba(255,215,0,0.3)' }}>✦</span>
            </div>
          )}

          {/* Handwritten overlay */}
          {phase === 'handwrite' && memory.storyText && (
            <div
              className="absolute inset-0 flex items-end justify-start p-6"
              style={{
                opacity: phase === 'handwrite' ? 1 : 0,
                transition: 'opacity 1.5s ease',
              }}
            >
              <p
                className="handwrite-text text-lg md:text-xl max-w-xs"
                style={{
                  color: 'rgba(255,215,0,0.9)',
                  textShadow: '0 0 10px rgba(0,0,0,0.8)',
                  lineHeight: 1.6,
                }}
              >
                {memory.storyText}
              </p>
            </div>
          )}
        </div>

        {/* Subtitle */}
        {memory.subtitle && (
          <div
            className="mt-6 text-center"
            style={{
              opacity: phase === 'subtitle' || phase === 'handwrite' ? 1 : 0,
              transform: phase === 'subtitle' || phase === 'handwrite' ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <p className="font-cormorant text-xl md:text-2xl italic" style={{ color: '#F5E6C8', letterSpacing: '0.05em' }}>
              "{memory.subtitle}"
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              {memory.location && (
                <span className="font-inter text-xs tracking-widest uppercase" style={{ color: 'rgba(255,215,0,0.6)' }}>
                  {memory.location}
                </span>
              )}
              {memory.year && (
                <span className="font-inter text-xs tracking-widest" style={{ color: 'rgba(255,215,0,0.4)' }}>
                  {Number(memory.year)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

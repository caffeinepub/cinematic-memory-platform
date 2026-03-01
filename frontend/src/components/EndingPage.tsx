import { useState, useEffect, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface EndingPageProps {
  onRestart?: () => void;
}

export default function EndingPage({ onRestart }: EndingPageProps) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 100);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 4500);
    const t3 = setTimeout(() => setPhase(3), 8000);
    const t4 = setTimeout(() => setPhase(4), 11500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const { displayedText: text1 } = useTypewriter({ text: 'From strangers… to stories.', speed: 70, delay: phase >= 1 ? 0 : 99999 });
  const { displayedText: text2 } = useTypewriter({ text: 'From days… to memories.', speed: 70, delay: phase >= 2 ? 0 : 99999 });
  const { displayedText: text3 } = useTypewriter({ text: 'Our journey continues…', speed: 70, delay: phase >= 3 ? 0 : 99999 });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#000',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.5s ease',
      }}
    >
      <audio ref={audioRef} loop>
        <source src="/assets/piano-ambient.mp3" type="audio/mpeg" />
      </audio>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/ending-bg.dim_1920x1080.png)',
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 text-center px-8 max-w-2xl">
        <div className="space-y-6 mb-16">
          {phase >= 1 && (
            <p
              className="font-cinzel text-2xl md:text-4xl typewriter-cursor"
              style={{
                color: '#FFD700',
                textShadow: '0 0 20px rgba(255,215,0,0.6)',
                letterSpacing: '0.05em',
                opacity: phase >= 1 ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            >
              {text1}
            </p>
          )}

          {phase >= 2 && (
            <p
              className="font-cinzel text-2xl md:text-4xl typewriter-cursor"
              style={{
                color: '#FFD700',
                textShadow: '0 0 20px rgba(255,215,0,0.6)',
                letterSpacing: '0.05em',
                opacity: phase >= 2 ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            >
              {text2}
            </p>
          )}

          {phase >= 3 && (
            <p
              className="font-cinzel text-2xl md:text-4xl typewriter-cursor"
              style={{
                color: '#FFD700',
                textShadow: '0 0 20px rgba(255,215,0,0.6)',
                letterSpacing: '0.05em',
                opacity: phase >= 3 ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            >
              {text3}
            </p>
          )}
        </div>

        {phase >= 4 && (
          <div
            className="relative rounded-lg overflow-hidden mx-auto"
            style={{
              maxWidth: 600,
              border: '1px solid rgba(255,215,0,0.3)',
              boxShadow: '0 0 60px rgba(255,215,0,0.2)',
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 2s ease, transform 2s ease',
            }}
          >
            <img
              src="/assets/generated/group-photo.dim_1200x675.png"
              alt="Our Group"
              className="w-full h-auto"
              style={{ filter: 'sepia(0.2) brightness(0.9)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
            />
          </div>
        )}

        {phase >= 4 && onRestart && (
          <button
            className="mt-10 px-8 py-3 rounded font-cinzel text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              border: '1px solid rgba(255,215,0,0.4)',
              color: 'rgba(255,215,0,0.7)',
              background: 'transparent',
              opacity: phase >= 4 ? 1 : 0,
              transition: 'opacity 1s ease 1s, transform 0.2s ease',
            }}
            onClick={onRestart}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
          >
            Revisit Memories
          </button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import ParticleEffect from './ParticleEffect';

interface SecretRevealAnimationProps {
  onComplete: () => void;
}

export default function SecretRevealAnimation({ onComplete }: SecretRevealAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const { displayedText, isComplete } = useTypewriter({
    text: 'A secret memory has been revealed…',
    speed: 70,
    delay: 1000,
  });

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 30);
    const t1 = setTimeout(() => setTextVisible(true), 800);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, []);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 600);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: '#000',
        opacity: exiting ? 0 : visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <ParticleEffect active intensity={20} />

      <div className="relative z-10 text-center px-8">
        <div
          className="mb-8"
          style={{
            transform: visible ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <span
            className="text-6xl"
            style={{
              color: '#FFD700',
              textShadow: '0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.5)',
              display: 'block',
              animation: 'secretGlow 2s ease-in-out infinite',
            }}
          >
            ✦
          </span>
        </div>

        <p
          className="font-cinzel text-xl md:text-3xl secret-glow-text typewriter-cursor"
          style={{
            color: '#FFD700',
            letterSpacing: '0.1em',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          {displayedText}
        </p>
      </div>
    </div>
  );
}

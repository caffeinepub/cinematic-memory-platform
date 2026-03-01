import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface IntroPageProps {
  onComplete: () => void;
}

export default function IntroPage({ onComplete }: IntroPageProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const { displayedText, isComplete } = useTypewriter({
    text: 'Some moments were never meant to be forgotten…',
    speed: 65,
    delay: 1200,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(onComplete, 800);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isComplete, onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: '#0A0A0A',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          opacity: 0.2,
        }}
      />
      <div className="vignette absolute inset-0" />

      <div
        className="relative z-10 text-center px-8 max-w-3xl"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <p
          className="font-cinzel text-2xl md:text-4xl lg:text-5xl leading-relaxed typewriter-cursor"
          style={{
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          {displayedText}
        </p>
      </div>

      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: isComplete ? 0.6 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, transparent, #FFD700)' }} />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFD700', boxShadow: '0 0 8px #FFD700' }} />
      </div>
    </div>
  );
}

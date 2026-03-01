import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface WelcomeScreenProps {
  userName: string;
  onComplete: () => void;
}

export default function WelcomeScreen({ userName, onComplete }: WelcomeScreenProps) {
  const [visible, setVisible] = useState(false);

  const { displayedText: line1, isComplete: done1 } = useTypewriter({
    text: 'Welcome back,',
    speed: 80,
    delay: 500,
  });

  const { displayedText: line2, isComplete: done2 } = useTypewriter({
    text: 'Memory Keeper.',
    speed: 80,
    delay: done1 ? 200 : 99999,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (done2) {
      const t = setTimeout(onComplete, 2500);
      return () => clearTimeout(t);
    }
  }, [done2, onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-40"
      style={{
        backgroundColor: '#0A0A0A',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          opacity: 0.1,
        }}
      />
      <div className="vignette absolute inset-0" />

      <div className="relative z-10 text-center">
        <div
          className="w-16 h-px mx-auto mb-6"
          style={{
            background: 'linear-gradient(to right, transparent, #FFD700, transparent)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        />

        <p
          className="font-cormorant text-xl md:text-2xl mb-2"
          style={{ color: 'rgba(245,230,200,0.7)', letterSpacing: '0.3em' }}
        >
          {line1}
        </p>

        <p
          className="font-cinzel text-4xl md:text-6xl font-bold typewriter-cursor"
          style={{
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4)',
            letterSpacing: '0.1em',
          }}
        >
          {line2}
        </p>

        {userName && (
          <p
            className="font-cormorant text-lg mt-4"
            style={{
              color: 'rgba(245,230,200,0.5)',
              letterSpacing: '0.2em',
              opacity: done1 ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            {userName}
          </p>
        )}

        <div
          className="mt-8 w-16 h-px mx-auto"
          style={{
            background: 'linear-gradient(to right, transparent, #FFD700, transparent)',
            transform: done2 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

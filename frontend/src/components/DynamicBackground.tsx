import { useState, useEffect } from 'react';

interface DynamicBackgroundProps {
  sceneType: string;
}

const sceneGradients: Record<string, string> = {
  beach: 'radial-gradient(ellipse at 60% 40%, rgba(30,80,120,0.6) 0%, rgba(10,60,90,0.4) 40%, rgba(10,10,10,0.95) 100%)',
  college: 'radial-gradient(ellipse at 40% 60%, rgba(30,60,30,0.5) 0%, rgba(20,40,20,0.3) 40%, rgba(10,10,10,0.95) 100%)',
  night: 'radial-gradient(ellipse at 50% 30%, rgba(20,10,50,0.7) 0%, rgba(10,5,30,0.5) 40%, rgba(5,5,10,0.98) 100%)',
  default: 'radial-gradient(ellipse at 50% 50%, rgba(30,20,5,0.4) 0%, rgba(10,10,10,0.98) 100%)',
};

export default function DynamicBackground({ sceneType }: DynamicBackgroundProps) {
  const [currentGradient, setCurrentGradient] = useState(sceneGradients[sceneType] || sceneGradients.default);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(0);
    const t = setTimeout(() => {
      setCurrentGradient(sceneGradients[sceneType] || sceneGradients.default);
      setOpacity(1);
    }, 300);
    return () => clearTimeout(t);
  }, [sceneType]);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity, transition: 'opacity 0.9s ease' }}
    >
      <div className="absolute inset-0" style={{ background: currentGradient }} />
    </div>
  );
}

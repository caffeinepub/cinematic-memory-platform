import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login, loginStatus, isLoggingIn } = useInternetIdentity();
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      await login();
      onLoginSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg === 'User is already authenticated') {
        onLoginSuccess();
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-30"
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
          opacity: 0.15,
        }}
      />
      <div className="vignette absolute inset-0" />

      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
        }}
      >
        <div className="text-center mb-10">
          <div
            className="w-20 h-px mx-auto mb-6"
            style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }}
          />
          <h1
            className="font-cinzel text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.6)' }}
          >
            Memory Keeper
          </h1>
          <p className="font-cormorant text-lg" style={{ color: 'rgba(245,230,200,0.6)', letterSpacing: '0.2em' }}>
            A private sanctuary of moments
          </p>
          <div
            className="w-20 h-px mx-auto mt-6"
            style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }}
          />
        </div>

        <div
          className="rounded-lg p-8 text-center"
          style={{
            background: 'rgba(15,15,15,0.9)',
            border: '1px solid rgba(255,215,0,0.2)',
            boxShadow: '0 0 40px rgba(255,215,0,0.1)',
          }}
        >
          <p className="font-cormorant text-base mb-8" style={{ color: 'rgba(245,230,200,0.7)', lineHeight: 1.8 }}>
            This platform is a private space for six memory keepers.<br />
            Sign in to unlock your shared journey.
          </p>

          {error && (
            <p className="text-sm mb-4 font-inter" style={{ color: '#ff6b6b' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn || loginStatus === 'logging-in'}
            className="w-full py-4 rounded font-cinzel text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
              border: '1px solid rgba(255,215,0,0.5)',
              color: '#FFD700',
              boxShadow: '0 0 20px rgba(255,215,0,0.2)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(255,215,0,0.5)';
              (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,215,0,0.1))';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(255,215,0,0.2)';
              (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))';
            }}
          >
            {isLoggingIn ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            {isLoggingIn ? 'Authenticating…' : 'Enter the Archive'}
          </button>

          <p className="font-inter text-xs mt-6" style={{ color: 'rgba(245,230,200,0.3)' }}>
            Secured by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}

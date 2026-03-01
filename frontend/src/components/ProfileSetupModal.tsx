import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface ProfileSetupModalProps {
  onComplete: () => void;
}

export default function ProfileSetupModal({ onComplete }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name'); return; }
    setError('');
    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: '' });
      onComplete();
    } catch {
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm mx-4 p-8 rounded-lg"
        style={{
          background: 'rgba(12,12,12,0.98)',
          border: '1px solid rgba(255,215,0,0.3)',
          boxShadow: '0 0 60px rgba(255,215,0,0.15)',
          animation: 'fadeInScale 0.4s ease forwards',
        }}
      >
        <div className="text-center mb-6">
          <div className="w-12 h-px mx-auto mb-4" style={{ background: 'linear-gradient(to right, transparent, #FFD700, transparent)' }} />
          <h2 className="font-cinzel text-xl font-bold" style={{ color: '#FFD700' }}>Welcome, Memory Keeper</h2>
          <p className="font-cormorant text-base mt-2" style={{ color: 'rgba(245,230,200,0.6)' }}>
            How shall we remember you?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name…"
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(20,20,20,0.8)',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 4,
              color: '#F5E6C8',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.1rem',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.7)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.3)')}
          />
          {error && <p className="font-inter text-xs" style={{ color: '#ff6b6b' }}>{error}</p>}
          <button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full py-3 rounded font-cinzel text-sm tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))',
              border: '1px solid rgba(255,215,0,0.5)',
              color: '#FFD700',
              boxShadow: '0 0 20px rgba(255,215,0,0.2)',
            }}
          >
            {saveProfile.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            Enter the Archive
          </button>
        </form>
      </div>
    </div>
  );
}

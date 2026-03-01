import { useState, useEffect, useCallback, useRef } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllMemories, useGetViewedMemoryIds, useMarkMemoryViewed, useIsCallerAdmin } from './hooks/useQueries';
import type { Memory } from './backend';

import GoldenCursor from './components/GoldenCursor';
import RippleEffect from './components/RippleEffect';
import IntroPage from './components/IntroPage';
import LoginPage from './components/LoginPage';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import DynamicBackground from './components/DynamicBackground';
import MemoryWheel from './components/MemoryWheel';
import ModeToggle, { ViewMode } from './components/ModeToggle';
import TimelineMode from './components/TimelineMode';
import TravelMapMode from './components/TravelMapMode';
import MemoryUnlockAnimation from './components/MemoryUnlockAnimation';
import SecretRevealAnimation from './components/SecretRevealAnimation';
import EndingPage from './components/EndingPage';
import AdminPanel from './components/AdminPanel';
import { Settings, Heart } from 'lucide-react';

type AppPhase = 'intro' | 'login' | 'welcome' | 'main' | 'admin' | 'ending';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [phase, setPhase] = useState<AppPhase>('intro');
  const [introSeen, setIntroSeen] = useState(() => sessionStorage.getItem('introSeen') === 'true');
  const [viewMode, setViewMode] = useState<ViewMode>('wheel');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [showSecretReveal, setShowSecretReveal] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(() => localStorage.getItem('secretUnlocked') === 'true');
  const [rotationCount, setRotationCount] = useState(0);
  const [activeSceneType, setActiveSceneType] = useState('default');
  const [fadeIn, setFadeIn] = useState(false);

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: memories = [] } = useGetAllMemories();
  const { data: viewedIds = [] } = useGetViewedMemoryIds();
  const { data: isAdmin } = useIsCallerAdmin();
  const markViewed = useMarkMemoryViewed();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (memories.length > 0) {
      setActiveSceneType(memories[0].sceneType || 'default');
    }
  }, [memories]);

  useEffect(() => {
    if (secretUnlocked || !isAuthenticated) return;
    const nonSecretMemories = memories.filter(m => !m.isSecret);
    const allViewed = nonSecretMemories.length > 0 && nonSecretMemories.every(m => viewedIds.includes(m.id));
    const enoughRotations = rotationCount >= 5;
    if (allViewed || enoughRotations) {
      setSecretUnlocked(true);
      localStorage.setItem('secretUnlocked', 'true');
      setShowSecretReveal(true);
    }
  }, [viewedIds, memories, rotationCount, secretUnlocked, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || phase !== 'main') return;
    if (memories.length === 0) return;
    const allViewed = memories.every(m => viewedIds.includes(m.id));
    if (allViewed && viewedIds.length >= memories.length) {
      const t = setTimeout(() => setPhase('ending'), 1500);
      return () => clearTimeout(t);
    }
  }, [viewedIds, memories, isAuthenticated, phase]);

  useEffect(() => {
    if (isInitializing) return;
    if (introSeen) {
      if (isAuthenticated) {
        if (phase === 'intro' || phase === 'login') setPhase('main');
      } else {
        if (phase === 'intro') setPhase('login');
      }
    }
  }, [isInitializing, isAuthenticated, introSeen, phase]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('introSeen', 'true');
    setIntroSeen(true);
    if (isAuthenticated) {
      setPhase('main');
    } else {
      setPhase('login');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = useCallback(() => {
    setPhase('welcome');
  }, []);

  const handleWelcomeComplete = useCallback(() => {
    setPhase('main');
  }, []);

  const handleMemorySelect = useCallback((memory: Memory) => {
    setSelectedMemory(memory);
    setActiveSceneType(memory.sceneType || 'default');
  }, []);

  const handleMemoryClose = useCallback(() => {
    if (selectedMemory && isAuthenticated) {
      markViewed.mutate(selectedMemory.id);
    }
    setSelectedMemory(null);
  }, [selectedMemory, isAuthenticated, markViewed]);

  const handleRotationCountChange = useCallback((count: number) => {
    setRotationCount(count);
  }, []);

  const handleSecretRevealComplete = useCallback(() => {
    setShowSecretReveal(false);
  }, []);

  const handleRestart = useCallback(() => {
    localStorage.removeItem('secretUnlocked');
    setSecretUnlocked(false);
    setPhase('main');
  }, []);

  if (!introSeen && phase === 'intro') {
    return (
      <>
        <GoldenCursor />
        <RippleEffect />
        <IntroPage onComplete={handleIntroComplete} />
      </>
    );
  }

  if (phase === 'login') {
    return (
      <>
        <GoldenCursor />
        <RippleEffect />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  if (phase === 'welcome') {
    return (
      <>
        <GoldenCursor />
        <RippleEffect />
        <WelcomeScreen userName={userProfile?.name || ''} onComplete={handleWelcomeComplete} />
      </>
    );
  }

  if (phase === 'ending') {
    return (
      <>
        <GoldenCursor />
        <RippleEffect />
        <EndingPage onRestart={handleRestart} />
      </>
    );
  }

  if (phase === 'admin') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A', color: '#F5E6C8' }}>
        <GoldenCursor />
        <RippleEffect />
        <AdminPanel onBack={() => setPhase('main')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen film-grain" style={{ backgroundColor: '#0A0A0A', color: '#F5E6C8' }}>
      <GoldenCursor />
      <RippleEffect />

      <DynamicBackground sceneType={activeSceneType} />

      {showProfileSetup && (
        <ProfileSetupModal onComplete={() => {}} />
      )}

      {showSecretReveal && (
        <SecretRevealAnimation onComplete={handleSecretRevealComplete} />
      )}

      {selectedMemory && (
        <MemoryUnlockAnimation
          key={String(selectedMemory.id)}
          memory={selectedMemory}
          onClose={handleMemoryClose}
        />
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="font-cinzel text-lg font-bold tracking-widest"
              style={{ color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.5)' }}
            >
              ✦ MEMORIES
            </span>
          </div>

          <ModeToggle mode={viewMode} onChange={setViewMode} />

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setPhase('admin')}
                className="p-2 rounded-full transition-all duration-300"
                style={{ border: '1px solid rgba(255,215,0,0.2)', color: 'rgba(255,215,0,0.6)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,215,0,0.6)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#FFD700';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,215,0,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,215,0,0.6)';
                }}
                title="Admin Panel"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-16 px-4">
          {viewMode === 'wheel' && (
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="text-center mb-4">
                <p className="font-cormorant text-base" style={{ color: 'rgba(245,230,200,0.4)', letterSpacing: '0.2em' }}>
                  Scroll to rotate · Click to unlock
                </p>
              </div>
              <MemoryWheel
                memories={memories}
                onMemorySelect={handleMemorySelect}
                onRotationCountChange={handleRotationCountChange}
              />
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="w-full max-w-5xl">
              <div className="text-center mb-8">
                <h2 className="font-cinzel text-2xl font-bold" style={{ color: '#FFD700', textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>
                  Through the Years
                </h2>
              </div>
              <TimelineMode memories={memories} onMemorySelect={handleMemorySelect} />
            </div>
          )}

          {viewMode === 'map' && (
            <div className="w-full">
              <TravelMapMode memories={memories} onMemorySelect={handleMemorySelect} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="relative z-10 py-6 text-center"
          style={{ borderTop: '1px solid rgba(255,215,0,0.08)' }}
        >
          <p className="font-inter text-xs" style={{ color: 'rgba(245,230,200,0.25)' }}>
            © {new Date().getFullYear()} · Built with{' '}
            <Heart size={10} className="inline" style={{ color: '#FFD700' }} />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'cinematic-memory-platform')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,215,0,0.4)' }}
              onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = '#FFD700')}
              onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,215,0,0.4)')}
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

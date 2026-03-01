import { useState, useEffect, useRef, useCallback } from 'react';
import type { Memory } from '../backend';
import ParticleEffect from './ParticleEffect';

interface MemoryWheelProps {
  memories: Memory[];
  onMemorySelect: (memory: Memory) => void;
  onRotationCountChange: (count: number) => void;
}

export default function MemoryWheel({ memories, onMemorySelect, onRotationCountChange }: MemoryWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const rotationCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  const count = memories.length;
  const angleStep = count > 0 ? 360 / count : 0;

  const updateActiveIndex = useCallback((rot: number) => {
    if (count === 0) return;
    const normalized = ((rot % 360) + 360) % 360;
    const idx = Math.round(normalized / angleStep) % count;
    setActiveIndex(idx);
    const fullRotations = Math.floor(Math.abs(rot) / 360);
    if (fullRotations > rotationCountRef.current) {
      rotationCountRef.current = fullRotations;
      onRotationCountChange(fullRotations);
    }
  }, [count, angleStep, onRotationCountChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.3;
      setRotation(prev => {
        const next = prev + delta;
        updateActiveIndex(next);
        return next;
      });
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [updateActiveIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      lastY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dy = e.touches[0].clientY - lastY.current;
      lastY.current = e.touches[0].clientY;
      setRotation(prev => {
        const next = prev - dy * 0.8;
        updateActiveIndex(next);
        return next;
      });
    };
    const onTouchEnd = () => { isDragging.current = false; };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [updateActiveIndex]);

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="font-cormorant text-xl" style={{ color: 'rgba(255,215,0,0.5)' }}>
          No memories yet. The archive awaits…
        </p>
      </div>
    );
  }

  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 240;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: radius * 2 + 120, height: radius * 2 + 120, touchAction: 'none' }}
    >
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '1px solid rgba(255,215,0,0.15)',
          boxShadow: '0 0 60px rgba(255,215,0,0.05), inset 0 0 60px rgba(255,215,0,0.03)',
        }}
      />
      <div
        className="absolute z-10 rounded-full pointer-events-none"
        style={{
          width: 80, height: 80,
          background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(255,215,0,0.3)',
        }}
      />
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          width: 2, height: 60,
          background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.8), transparent)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {memories.map((memory, i) => {
        const angle = (i * angleStep + rotation) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius;
        const isActive = i === activeIndex;

        return (
          <div
            key={String(memory.id)}
            className="absolute cursor-pointer"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.3 : 0.85})`,
              zIndex: isActive ? 20 : 10,
              transition: 'transform 0.4s ease',
            }}
            onClick={() => isActive && onMemorySelect(memory)}
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: isActive ? 90 : 64,
                height: isActive ? 90 : 64,
                borderRadius: '50%',
                border: isActive ? '2px solid rgba(255,215,0,0.9)' : '1px solid rgba(255,215,0,0.3)',
                boxShadow: isActive
                  ? '0 0 20px rgba(255,215,0,0.7), 0 0 40px rgba(255,215,0,0.3)'
                  : '0 0 8px rgba(255,215,0,0.1)',
                transition: 'all 0.4s ease',
              }}
            >
              {memory.photoUrl ? (
                <img src={memory.photoUrl} alt={memory.subtitle || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' }}>
                  <span style={{ color: 'rgba(255,215,0,0.5)', fontSize: 20 }}>✦</span>
                </div>
              )}
              {memory.specialMemory && (
                <div className="absolute inset-0 pointer-events-none">
                  <ParticleEffect active intensity={4} />
                </div>
              )}
            </div>

            {isActive && (
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                style={{ animation: 'fadeInUp 0.3s ease forwards' }}
              >
                <p className="font-cormorant text-xs" style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255,215,0,0.6)' }}>
                  {memory.subtitle || memory.location || 'Memory'}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {memories[activeIndex] && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          style={{ opacity: 0.7 }}
        >
          <p className="font-inter text-xs tracking-widest uppercase" style={{ color: 'rgba(255,215,0,0.6)' }}>
            Click to unlock
          </p>
        </div>
      )}
    </div>
  );
}

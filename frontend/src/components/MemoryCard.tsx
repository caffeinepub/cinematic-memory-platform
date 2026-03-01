import { useState } from 'react';
import { useIntersectionObserver } from '../lib/useIntersectionObserver';
import type { Memory } from '../backend';
import ParticleEffect from './ParticleEffect';
import { Star, MapPin, Calendar } from 'lucide-react';

interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
  index?: number;
  compact?: boolean;
}

export default function MemoryCard({ memory, onClick, index = 0, compact = false }: MemoryCardProps) {
  const { ref, isVisible } = useIntersectionObserver();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={() => onClick(memory)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      style={{
        background: 'rgba(15,15,15,0.9)',
        border: `1px solid ${hovered ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.2)'}`,
        boxShadow: hovered ? '0 0 30px rgba(255,215,0,0.3), 0 4px 20px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.5)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {memory.specialMemory && <ParticleEffect active intensity={6} />}

      <div className={`relative overflow-hidden ${compact ? 'h-36' : 'h-52'}`}>
        {memory.photoUrl ? (
          <img
            src={memory.photoUrl}
            alt={memory.subtitle || 'Memory'}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.7s ease',
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' }}
          >
            <span className="font-cinzel text-4xl" style={{ color: 'rgba(255,215,0,0.3)' }}>✦</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />

        {memory.specialMemory && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-cinzel"
            style={{ background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.5)', color: '#FFD700' }}
          >
            <Star size={10} fill="#FFD700" />
            Special
          </div>
        )}

        {memory.isSecret && (
          <div
            className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-cinzel"
            style={{ background: 'rgba(180,0,255,0.2)', border: '1px solid rgba(180,0,255,0.5)', color: '#d4a0ff' }}
          >
            ✦ Secret
          </div>
        )}
      </div>

      <div className="p-4">
        {memory.subtitle && (
          <p className="font-cormorant text-base font-semibold mb-2 line-clamp-1" style={{ color: '#F5E6C8' }}>
            {memory.subtitle}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs font-inter" style={{ color: 'rgba(245,230,200,0.5)' }}>
          {memory.location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} style={{ color: '#FFD700' }} />
              {memory.location}
            </span>
          )}
          {memory.year && (
            <span className="flex items-center gap-1">
              <Calendar size={10} style={{ color: '#FFD700' }} />
              {Number(memory.year)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

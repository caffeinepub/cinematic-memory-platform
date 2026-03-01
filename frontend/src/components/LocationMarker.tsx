import { useState } from 'react';

interface LocationMarkerProps {
  x: number;
  y: number;
  name: string;
  count: number;
  onClick: () => void;
  isActive: boolean;
}

export default function LocationMarker({ x, y, name, count, onClick, isActive }: LocationMarkerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${hovered ? 1.2 : 1})`,
        transition: 'transform 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute rounded-full map-marker-pulse"
        style={{
          width: 24, height: 24,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          border: '2px solid rgba(255,215,0,0.5)',
        }}
      />
      <div
        className="relative z-10 rounded-full"
        style={{
          width: 16, height: 16,
          background: isActive ? '#FFD700' : 'rgba(255,215,0,0.7)',
          boxShadow: isActive
            ? '0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,215,0,0.5)'
            : '0 0 10px rgba(255,215,0,0.5)',
          border: '2px solid rgba(255,215,0,0.9)',
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
        style={{
          bottom: '120%',
          marginBottom: 4,
          opacity: 1,
        }}
      >
        <div
          className="px-2 py-1 rounded text-xs font-cinzel"
          style={{
            background: 'rgba(10,10,10,0.9)',
            border: '1px solid rgba(255,215,0,0.4)',
            color: '#FFD700',
            boxShadow: '0 0 10px rgba(255,215,0,0.2)',
          }}
        >
          {name}
          {count > 0 && <span className="ml-1 opacity-60">({count})</span>}
        </div>
      </div>
    </div>
  );
}

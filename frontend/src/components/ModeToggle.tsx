import { ReactNode, useRef, useEffect, useState } from 'react';
import { Circle, AlignLeft, Map } from 'lucide-react';

export type ViewMode = 'wheel' | 'timeline' | 'map';

interface ModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const modes: { key: ViewMode; label: string; icon: ReactNode }[] = [
  { key: 'wheel', label: 'Wheel', icon: <Circle size={14} /> },
  { key: 'timeline', label: 'Timeline', icon: <AlignLeft size={14} /> },
  { key: 'map', label: 'Map', icon: <Map size={14} /> },
];

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-full"
      style={{
        background: 'rgba(10,10,10,0.9)',
        border: '1px solid rgba(255,215,0,0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {modes.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel tracking-wider transition-all duration-300"
          style={{
            color: mode === m.key ? '#0A0A0A' : 'rgba(255,215,0,0.6)',
            background: mode === m.key ? '#FFD700' : 'transparent',
            boxShadow: mode === m.key ? '0 0 12px rgba(255,215,0,0.6)' : 'none',
          }}
        >
          <span className="flex items-center gap-1.5">
            {m.icon}
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}

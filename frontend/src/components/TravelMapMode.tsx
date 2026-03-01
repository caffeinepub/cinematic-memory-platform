import { useState } from 'react';
import type { Memory } from '../backend';
import LocationMarker from './LocationMarker';
import MemoryCard from './MemoryCard';
import { X } from 'lucide-react';

interface TravelMapModeProps {
  memories: Memory[];
  onMemorySelect: (memory: Memory) => void;
}

const LOCATIONS = [
  { name: 'Vizag', key: 'vizag', x: 68, y: 52 },
  { name: 'Goa', key: 'goa', x: 32, y: 60 },
  { name: 'Bangalore', key: 'bangalore', x: 42, y: 70 },
];

function normalizeLocation(loc: string): string {
  const l = loc.toLowerCase();
  if (l.includes('vizag') || l.includes('visakhapatnam')) return 'vizag';
  if (l.includes('goa')) return 'goa';
  if (l.includes('bangalore') || l.includes('bengaluru')) return 'bangalore';
  return l;
}

export default function TravelMapMode({ memories, onMemorySelect }: TravelMapModeProps) {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  const memoriesByLocation = LOCATIONS.reduce<Record<string, Memory[]>>((acc, loc) => {
    acc[loc.key] = memories.filter(m => normalizeLocation(m.location) === loc.key);
    return acc;
  }, {});

  const filteredMemories = activeLocation ? memoriesByLocation[activeLocation] || [] : [];

  const handleLocationClick = (key: string) => {
    if (activeLocation === key) {
      setPanelVisible(false);
      setTimeout(() => setActiveLocation(null), 300);
    } else {
      setActiveLocation(key);
      setPanelVisible(false);
      setTimeout(() => setPanelVisible(true), 50);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="font-cinzel text-2xl font-bold" style={{ color: '#FFD700', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>
          Our Journey
        </h2>
        <p className="font-cormorant text-base mt-1" style={{ color: 'rgba(245,230,200,0.5)' }}>
          Click a location to explore memories
        </p>
      </div>

      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          border: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 40px rgba(255,215,0,0.1)',
        }}
      >
        <img
          src="/assets/generated/india-map.dim_600x800.png"
          alt="India Map"
          className="w-full h-auto"
          style={{ filter: 'brightness(0.7) sepia(0.3)' }}
        />
        {LOCATIONS.map(loc => (
          <LocationMarker
            key={loc.key}
            x={loc.x}
            y={loc.y}
            name={loc.name}
            count={memoriesByLocation[loc.key]?.length || 0}
            isActive={activeLocation === loc.key}
            onClick={() => handleLocationClick(loc.key)}
          />
        ))}
      </div>

      {activeLocation && (
        <div
          className="mt-6"
          style={{
            opacity: panelVisible ? 1 : 0,
            transform: panelVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cinzel text-lg" style={{ color: '#FFD700' }}>
              {LOCATIONS.find(l => l.key === activeLocation)?.name} Memories
            </h3>
            <button
              onClick={() => { setPanelVisible(false); setTimeout(() => setActiveLocation(null), 300); }}
              className="p-1 rounded"
              style={{ color: 'rgba(255,215,0,0.6)' }}
            >
              <X size={16} />
            </button>
          </div>

          {filteredMemories.length === 0 ? (
            <p className="font-cormorant text-base text-center py-8" style={{ color: 'rgba(245,230,200,0.4)' }}>
              No memories from this location yet…
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMemories.map((m, i) => (
                <MemoryCard key={String(m.id)} memory={m} onClick={onMemorySelect} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

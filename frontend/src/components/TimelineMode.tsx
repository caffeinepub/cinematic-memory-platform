import type { Memory } from '../backend';
import MemoryCard from './MemoryCard';
import { useIntersectionObserver } from '../lib/useIntersectionObserver';

interface TimelineModeProps {
  memories: Memory[];
  onMemorySelect: (memory: Memory) => void;
}

export default function TimelineMode({ memories, onMemorySelect }: TimelineModeProps) {
  const grouped = memories.reduce<Record<number, Memory[]>>((acc, m) => {
    const yr = Number(m.year);
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(m);
    return acc;
  }, {});

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  if (years.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-cormorant text-xl" style={{ color: 'rgba(255,215,0,0.5)' }}>
          No memories yet…
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.4), transparent)' }}
      />
      {years.map((year, yi) => (
        <YearSection
          key={year}
          year={year}
          memories={grouped[year]}
          onMemorySelect={onMemorySelect}
          index={yi}
        />
      ))}
    </div>
  );
}

interface YearSectionProps {
  year: number;
  memories: Memory[];
  onMemorySelect: (memory: Memory) => void;
  index: number;
}

function YearSection({ year, memories, onMemorySelect, index }: YearSectionProps) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div ref={ref} className="relative mb-16">
      <div
        className="relative z-10 flex justify-center mb-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.5)',
          transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        }}
      >
        <div
          className="px-6 py-2 rounded-full font-cinzel text-lg font-bold"
          style={{
            background: 'rgba(10,10,10,0.95)',
            border: '1px solid rgba(255,215,0,0.5)',
            color: '#FFD700',
            boxShadow: '0 0 20px rgba(255,215,0,0.3)',
          }}
        >
          {year}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memories.map((memory, mi) => (
          <MemoryCard
            key={String(memory.id)}
            memory={memory}
            onClick={onMemorySelect}
            index={mi}
          />
        ))}
      </div>
    </div>
  );
}

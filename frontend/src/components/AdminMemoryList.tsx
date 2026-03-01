import { useState } from 'react';
import { useGetAllMemories, useDeleteMemory } from '../hooks/useQueries';
import type { Memory } from '../backend';
import { Edit2, Trash2, Star, Lock, Loader2 } from 'lucide-react';

interface AdminMemoryListProps {
  onEdit: (memory: Memory) => void;
}

export default function AdminMemoryList({ onEdit }: AdminMemoryListProps) {
  const { data: memories = [], isLoading } = useGetAllMemories();
  const deleteMemory = useDeleteMemory();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    setDeletingId(id);
    try {
      await deleteMemory.mutateAsync(id);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-cormorant text-xl" style={{ color: 'rgba(255,215,0,0.4)' }}>
          No memories in the archive yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory, i) => (
        <div
          key={String(memory.id)}
          className="flex items-center gap-4 p-4 rounded-lg"
          style={{
            background: 'rgba(12,12,12,0.9)',
            border: '1px solid rgba(255,215,0,0.1)',
            opacity: 1,
            animation: `fadeInLeft 0.4s ease ${i * 0.05}s both`,
          }}
        >
          <div
            className="flex-shrink-0 rounded overflow-hidden"
            style={{ width: 56, height: 56, border: '1px solid rgba(255,215,0,0.2)' }}
          >
            {memory.photoUrl ? (
              <img src={memory.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: '#111' }}>
                <span style={{ color: 'rgba(255,215,0,0.3)', fontSize: 18 }}>✦</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-cormorant text-base font-semibold truncate" style={{ color: '#F5E6C8' }}>
              {memory.subtitle || 'Untitled Memory'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-inter text-xs" style={{ color: 'rgba(255,215,0,0.5)' }}>
                {memory.location || '—'} · {Number(memory.year)}
              </span>
              <span className="font-inter text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,215,0,0.1)', color: 'rgba(255,215,0,0.6)', border: '1px solid rgba(255,215,0,0.2)' }}>
                {memory.sceneType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {memory.specialMemory && <Star size={14} fill="#FFD700" style={{ color: '#FFD700' }} />}
            {memory.isSecret && <Lock size={14} style={{ color: 'rgba(180,0,255,0.7)' }} />}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(memory)}
              className="p-2 rounded transition-all duration-200"
              style={{ color: 'rgba(255,215,0,0.5)', border: '1px solid rgba(255,215,0,0.15)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FFD700')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,215,0,0.5)')}
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => handleDelete(memory.id)}
              disabled={deletingId === memory.id}
              className="p-2 rounded transition-all duration-200"
              style={{
                color: confirmDelete === memory.id ? '#ff6b6b' : 'rgba(255,100,100,0.4)',
                border: `1px solid ${confirmDelete === memory.id ? 'rgba(255,100,100,0.5)' : 'rgba(255,100,100,0.15)'}`,
              }}
            >
              {deletingId === memory.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>

          {confirmDelete === memory.id && (
            <span className="font-inter text-xs flex-shrink-0" style={{ color: '#ff6b6b' }}>
              Click again to confirm
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

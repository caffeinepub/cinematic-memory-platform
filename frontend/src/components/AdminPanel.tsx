import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminMemoryList from './AdminMemoryList';
import MemoryForm from './MemoryForm';
import type { Memory } from '../backend';
import { Plus, List, ArrowLeft, ShieldAlert } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminView = 'list' | 'create' | 'edit';

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [view, setView] = useState<AdminView>('list');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#FFD700', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <ShieldAlert size={48} style={{ color: 'rgba(255,215,0,0.5)' }} />
        <p className="font-cinzel text-xl" style={{ color: 'rgba(255,215,0,0.7)' }}>Access Denied</p>
        <p className="font-cormorant text-base" style={{ color: 'rgba(245,230,200,0.5)' }}>
          Only administrators can access this panel.
        </p>
        <button onClick={onBack} className="mt-4 flex items-center gap-2 font-cinzel text-sm" style={{ color: 'rgba(255,215,0,0.6)' }}>
          <ArrowLeft size={16} /> Return
        </button>
      </div>
    );
  }

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setView('edit');
  };

  const handleFormSuccess = () => {
    setView('list');
    setEditingMemory(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-cinzel text-sm transition-all duration-200"
            style={{ color: 'rgba(255,215,0,0.6)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FFD700')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,215,0,0.6)')}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="w-px h-5" style={{ background: 'rgba(255,215,0,0.2)' }} />
          <h1 className="font-cinzel text-2xl font-bold" style={{ color: '#FFD700', textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>
            Admin Archive
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 px-4 py-2 rounded font-cinzel text-xs tracking-wider transition-all duration-200"
            style={{
              border: `1px solid ${view === 'list' ? 'rgba(255,215,0,0.6)' : 'rgba(255,215,0,0.2)'}`,
              color: view === 'list' ? '#FFD700' : 'rgba(255,215,0,0.5)',
              background: view === 'list' ? 'rgba(255,215,0,0.1)' : 'transparent',
            }}
          >
            <List size={14} /> Memories
          </button>
          <button
            onClick={() => { setEditingMemory(null); setView('create'); }}
            className="flex items-center gap-2 px-4 py-2 rounded font-cinzel text-xs tracking-wider transition-all duration-200"
            style={{
              border: `1px solid ${view === 'create' ? 'rgba(255,215,0,0.6)' : 'rgba(255,215,0,0.2)'}`,
              color: view === 'create' ? '#FFD700' : 'rgba(255,215,0,0.5)',
              background: view === 'create' ? 'rgba(255,215,0,0.1)' : 'transparent',
            }}
          >
            <Plus size={14} /> New Memory
          </button>
        </div>
      </div>

      {view === 'list' && <AdminMemoryList onEdit={handleEdit} />}
      {(view === 'create' || view === 'edit') && (
        <MemoryForm memory={editingMemory} onSuccess={handleFormSuccess} onCancel={() => setView('list')} />
      )}
    </div>
  );
}

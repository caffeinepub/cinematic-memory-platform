import { useState } from 'react';
import { useCreateMemory, useUpdateMemory } from '../hooks/useQueries';
import type { Memory } from '../backend';
import { Loader2, Save } from 'lucide-react';

interface MemoryFormProps {
  memory?: Memory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SCENE_TYPES = ['beach', 'college', 'night', 'default'];
const LOCATIONS = ['Vizag', 'Goa', 'Bangalore', 'Other'];

export default function MemoryForm({ memory, onSuccess, onCancel }: MemoryFormProps) {
  const isEdit = !!memory;
  const createMemory = useCreateMemory();
  const updateMemory = useUpdateMemory();

  const [form, setForm] = useState({
    photoUrl: memory?.photoUrl || '',
    voiceNoteUrl: memory?.voiceNoteUrl || '',
    storyText: memory?.storyText || '',
    subtitle: memory?.subtitle || '',
    location: memory?.location || '',
    year: memory?.year ? Number(memory.year) : new Date().getFullYear(),
    sceneType: memory?.sceneType || 'default',
    specialMemory: memory?.specialMemory || false,
    isSecret: memory?.isSecret || false,
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const memoryData: Memory = {
      id: memory?.id ?? BigInt(Date.now()),
      photoUrl: form.photoUrl,
      voiceNoteUrl: form.voiceNoteUrl,
      storyText: form.storyText,
      subtitle: form.subtitle,
      location: form.location,
      year: BigInt(form.year),
      sceneType: form.sceneType,
      specialMemory: form.specialMemory,
      isSecret: form.isSecret,
    };
    try {
      if (isEdit && memory) {
        await updateMemory.mutateAsync({ id: memory.id, memory: memoryData });
      } else {
        await createMemory.mutateAsync(memoryData);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save memory');
    }
  };

  const isPending = createMemory.isPending || updateMemory.isPending;

  const inputStyle: React.CSSProperties = {
    background: 'rgba(15,15,15,0.8)',
    border: '1px solid rgba(255,215,0,0.2)',
    color: '#F5E6C8',
    borderRadius: 4,
    padding: '10px 14px',
    width: '100%',
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,215,0,0.7)',
    fontFamily: 'Cinzel, serif',
  };

  return (
    <div
      className="rounded-lg p-6"
      style={{
        background: 'rgba(12,12,12,0.95)',
        border: '1px solid rgba(255,215,0,0.15)',
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <h2 className="font-cinzel text-xl font-bold mb-6" style={{ color: '#FFD700' }}>
        {isEdit ? 'Edit Memory' : 'Create New Memory'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label style={labelStyle}>Photo URL</label>
            <input
              type="url"
              value={form.photoUrl}
              onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))}
              placeholder="https://..."
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.2)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Voice Note URL</label>
            <input
              type="url"
              value={form.voiceNoteUrl}
              onChange={e => setForm(f => ({ ...f, voiceNoteUrl: e.target.value }))}
              placeholder="https://..."
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.2)')}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
            placeholder="A brief title for this memory…"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.2)')}
          />
        </div>

        <div>
          <label style={labelStyle}>Story Text</label>
          <textarea
            value={form.storyText}
            onChange={e => setForm(f => ({ ...f, storyText: e.target.value }))}
            placeholder="The story behind this moment…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.6)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.2)')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label style={labelStyle}>Location</label>
            <select
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Select location</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || new Date().getFullYear() }))}
              min={2000}
              max={2100}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,215,0,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,215,0,0.2)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Scene Type</label>
            <select
              value={form.sceneType}
              onChange={e => setForm(f => ({ ...f, sceneType: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {SCENE_TYPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative w-10 h-5 rounded-full transition-all duration-200"
              style={{
                background: form.specialMemory ? 'rgba(255,215,0,0.8)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,215,0,0.3)',
              }}
              onClick={() => setForm(f => ({ ...f, specialMemory: !f.specialMemory }))}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                style={{
                  background: form.specialMemory ? '#0A0A0A' : 'rgba(255,215,0,0.5)',
                  left: form.specialMemory ? '22px' : '2px',
                }}
              />
            </div>
            <span className="font-cinzel text-xs tracking-wider" style={{ color: 'rgba(255,215,0,0.7)' }}>Special Memory</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative w-10 h-5 rounded-full transition-all duration-200"
              style={{
                background: form.isSecret ? 'rgba(180,0,255,0.6)' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(180,0,255,0.3)',
              }}
              onClick={() => setForm(f => ({ ...f, isSecret: !f.isSecret }))}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                style={{
                  background: form.isSecret ? '#0A0A0A' : 'rgba(180,0,255,0.5)',
                  left: form.isSecret ? '22px' : '2px',
                }}
              />
            </div>
            <span className="font-cinzel text-xs tracking-wider" style={{ color: 'rgba(180,0,255,0.7)' }}>Secret Memory</span>
          </label>
        </div>

        {error && <p className="font-inter text-sm" style={{ color: '#ff6b6b' }}>{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 rounded font-cinzel text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.1))',
              border: '1px solid rgba(255,215,0,0.5)',
              color: '#FFD700',
              boxShadow: '0 0 20px rgba(255,215,0,0.2)',
            }}
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isPending ? 'Saving…' : isEdit ? 'Update Memory' : 'Create Memory'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded font-cinzel text-sm tracking-wider uppercase transition-all duration-200"
            style={{ border: '1px solid rgba(255,215,0,0.15)', color: 'rgba(255,215,0,0.4)' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

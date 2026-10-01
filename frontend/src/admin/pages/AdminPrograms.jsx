import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';
import { invalidateContent } from '../../hooks/useContent';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import ProgramEditor from '../components/ProgramEditor';

const STATUS_BADGES = {
  live: { label: 'Live', cls: 'bg-green-100 text-green-800' },
  coming_soon: { label: 'Coming Soon', cls: 'bg-amber-100 text-amber-800' },
  archived: { label: 'Past Program', cls: 'bg-stone-200 text-stone-800' },
  draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-800' },
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi().get('/content/programs').then(r => setPrograms(r.data.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (list) => {
    await adminApi().put('/admin/content/programs', { data: list });
    invalidateContent('programs');
    setPrograms(list);
    setEditing(null);
  };

  const handleSave = async (p) => {
    let list;
    if (editing === 'new') list = [...programs, p];
    else list = programs.map(x => x.id === p.id ? p : x);
    await save(list);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this program permanently?')) return;
    await save(programs.filter(p => p.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    await save(programs.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div className="p-8 md:p-12" data-testid="admin-programs">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Training Programs</p>
        <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917]">Manage Programs</h1>
        <p className="text-sm text-[#57534E] mt-2">Live programs on the website. Edit details or add a new program below.</p>
      </div>

      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-3">Current Live Programs · {programs.length} program{programs.length === 1 ? '' : 's'}</p>
      {loading ? <p>Loading…</p> : programs.length === 0 ? (
        <p className="text-[#57534E] mb-10">No programs yet — click Add Program below.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {programs.map((p) => {
            const badge = STATUS_BADGES[p.status] || STATUS_BADGES.draft;
            return (
              <div key={p.id} className="bg-white border border-[#E7E5E4] p-4 md:p-6 flex flex-col md:flex-row gap-4" data-testid={`program-${p.id}`}>
                {p.image && <img src={p.image} alt={p.level} className="w-full md:w-32 h-28 object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{p.name || p.level || 'Untitled'}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <p className="text-xs text-[#57534E]">{p.tagline}</p>
                  <p className="text-xs text-[#57534E] mt-1">{p.duration} · ID: <code className="bg-[#F5F5F4] px-1.5">{p.id}</code></p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <select value={p.status || 'draft'} onChange={e => handleStatusChange(p.id, e.target.value)} className="text-xs uppercase tracking-wider px-3 py-2 border border-[#E7E5E4] bg-white">
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="archived">Past Program</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button onClick={() => setEditing(p)} className="px-3 py-2 text-xs uppercase tracking-[0.2em] border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] flex items-center gap-1" data-testid={`edit-${p.id}`}>
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-2 text-xs uppercase tracking-[0.2em] border border-red-300 text-red-700 hover:bg-red-50">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW PROGRAM */}
      <div className="border-2 border-dashed border-[#D6C0A6] bg-[#FBFBF9] p-6 md:p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Programs</p>
        <h2 className="font-['Playfair_Display'] text-xl text-[#1C1917] mb-3">Add a New Program</h2>
        <p className="text-sm text-[#57534E] mb-5 max-w-md mx-auto">Launch a new training program with its own description, FAQs, and Spur.fit link.</p>
        <button
          onClick={() => setEditing('new')}
          className="bg-[#1C1917] text-[#FBFBF9] px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors inline-flex items-center gap-2"
          data-testid="add-program-btn"
        >
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {editing && (
        <ProgramEditor program={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

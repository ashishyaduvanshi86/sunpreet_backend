import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';
import { invalidateContent } from '../../hooks/useContent';
import { Plus, Edit2, Trash2, Archive, Eye, EyeOff } from 'lucide-react';
import RetreatEditor from '../components/RetreatEditor';

const STATUS_BADGES = {
  live: { label: 'Live', cls: 'bg-green-100 text-green-800' },
  coming_soon: { label: 'Coming Soon', cls: 'bg-amber-100 text-amber-800' },
  sold_out: { label: 'Sold Out', cls: 'bg-rose-100 text-rose-800' },
  past: { label: 'Past Experience', cls: 'bg-stone-200 text-stone-800' },
  draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-800' },
};

export default function AdminRetreats() {
  const [retreats, setRetreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // retreat object or 'new'

  const load = () => {
    setLoading(true);
    adminApi().get('/content/retreats').then(r => setRetreats(r.data.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (list) => {
    await adminApi().put('/admin/content/retreats', { data: list });
    invalidateContent('retreats');
    setRetreats(list);
    setEditing(null);
  };

  const handleSave = async (retreat) => {
    let list;
    if (editing === 'new') {
      list = [...retreats, retreat];
    } else {
      list = retreats.map(r => (r.id === retreat.id ? retreat : r));
    }
    await save(list);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this retreat permanently? This cannot be undone.')) return;
    await save(retreats.filter(r => r.id !== id));
  };

  const handleStatusChange = async (id, newStatus) => {
    await save(retreats.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="p-8 md:p-12" data-testid="admin-retreats">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Retreats</p>
          <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917]">Manage Retreats</h1>
          <p className="text-sm text-[#57534E] mt-2">Add, edit, archive — changes go live instantly on the site.</p>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="bg-[#1C1917] text-[#FBFBF9] px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors flex items-center gap-2 flex-shrink-0"
          data-testid="add-retreat-btn"
        >
          <Plus className="w-4 h-4" /> Add Retreat
        </button>
      </div>

      {loading ? <p>Loading…</p> : retreats.length === 0 ? (
        <p className="text-[#57534E]">No retreats yet — click Add Retreat to create one.</p>
      ) : (
        <div className="space-y-3">
          {retreats.map((r, idx) => {
            const badge = STATUS_BADGES[r.status] || STATUS_BADGES.draft;
            return (
              <div key={r.id} className="bg-white border border-[#E7E5E4] p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start" data-testid={`retreat-row-${r.id}`}>
                {r.heroImage && (
                  <img src={r.heroImage} alt={r.title} className="w-full md:w-40 h-32 md:h-28 object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-['Playfair_Display'] text-xl text-[#1C1917]">{r.title || 'Untitled'}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <p className="text-xs text-[#57534E]">{r.location} · {r.date}</p>
                  <p className="text-xs text-[#57534E]">ID: <code className="bg-[#F5F5F4] px-1.5 py-0.5">{r.id}</code></p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <select
                    value={r.status || 'draft'}
                    onChange={e => handleStatusChange(r.id, e.target.value)}
                    className="text-xs uppercase tracking-wider px-3 py-2 border border-[#E7E5E4] bg-white"
                    data-testid={`retreat-status-${r.id}`}
                  >
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="past">Past Experience</option>
                    <option value="draft">Draft</option>
                  </select>
                  <button onClick={() => setEditing(r)} className="text-xs uppercase tracking-[0.2em] px-3 py-2 border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBFBF9] transition-colors flex items-center gap-1" data-testid={`edit-retreat-${r.id}`}>
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-xs uppercase tracking-[0.2em] px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 transition-colors" data-testid={`delete-retreat-${r.id}`}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <RetreatEditor
          retreat={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

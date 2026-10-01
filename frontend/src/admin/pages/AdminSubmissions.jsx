import { useEffect, useState } from 'react';
import { adminApi } from '../AdminAuthContext';
import { Mail, Phone, Instagram, Filter } from 'lucide-react';

const KIND_LABELS = {
  contact: 'Contact', retreat: 'Retreat App', financial_aid: 'Financial Aid', waitlist: 'Waitlist', order: 'Order'
};
const KIND_COLORS = {
  contact: 'bg-blue-100 text-blue-800', retreat: 'bg-green-100 text-green-800',
  financial_aid: 'bg-amber-100 text-amber-800', waitlist: 'bg-purple-100 text-purple-800',
  order: 'bg-rose-100 text-rose-800'
};

export default function AdminSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    const params = filter !== 'all' ? `?source=${filter}` : '';
    adminApi().get(`/admin/submissions${params}`).then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  return (
    <div className="p-8 md:p-12" data-testid="admin-submissions">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#57534E] mb-2">Inbox</p>
      <h1 className="font-['Playfair_Display'] text-3xl text-[#1C1917] mb-6">Submissions</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'contact', 'retreat', 'financial_aid', 'waitlist', 'order'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition-colors ${
              filter === f ? 'bg-[#1C1917] text-[#FBFBF9] border-[#1C1917]' : 'bg-white text-[#57534E] border-[#E7E5E4] hover:border-[#1C1917]'
            }`}
            data-testid={`filter-${f}`}
          >
            {f === 'all' ? 'All' : KIND_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? <p>Loading…</p> : items.length === 0 ? (
        <p className="text-[#57534E]">No submissions yet.</p>
      ) : (
        <div className="bg-white border border-[#E7E5E4]">
          {items.map((item, idx) => (
            <button
              key={`${item.kind}-${item.id || idx}`}
              onClick={() => setSelected(item)}
              className="w-full text-left p-4 border-b border-[#E7E5E4] last:border-0 hover:bg-[#FBFBF9] transition-colors flex items-start gap-4"
              data-testid={`submission-${idx}`}
            >
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 flex-shrink-0 ${KIND_COLORS[item.kind]}`}>
                {KIND_LABELS[item.kind]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1917] truncate">
                  {item.first_name || item.customer_name || item.email || 'Unknown'}
                </p>
                <p className="text-xs text-[#57534E] truncate">
                  {item.email} {item.phone && `· ${item.phone}`} {item.aid_type && `· ${item.aid_type}`}
                </p>
                {item.message && <p className="text-xs text-[#57534E] mt-1 line-clamp-1">{item.message}</p>}
              </div>
              <p className="text-xs text-[#57534E] flex-shrink-0">
                {new Date(item.submitted_at || item.subscribed_at || item.created_at || '').toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 ${KIND_COLORS[selected.kind]}`}>
                  {KIND_LABELS[selected.kind]}
                </span>
                <h2 className="font-['Playfair_Display'] text-2xl text-[#1C1917] mt-2">
                  {selected.first_name || selected.customer_name || selected.email}
                </h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#57534E] hover:text-[#1C1917]">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(selected).filter(([k]) => !['kind', '_id'].includes(k)).map(([k, v]) => (
                <div key={k} className="flex gap-3 border-b border-[#E7E5E4] py-2">
                  <span className="text-[#57534E] text-xs uppercase tracking-wider w-32 flex-shrink-0">{k.replace(/_/g, ' ')}</span>
                  <span className="text-[#1C1917] break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
